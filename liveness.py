"""
Blink detection for anti-spoofing
"""

import cv2
import dlib
import numpy as np
from imutils import face_utils
from utils import calculate_ear


class BlinkDetector:
    def __init__(self):
        # Initialize dlib's face detector and facial landmark predictor
        self.detector = dlib.get_frontal_face_detector()

        # Download the predictor file from:
        # http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
        import os
        import sys
        
        # Try multiple paths to find the model file
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        predictor_paths = [
            os.path.join(project_root, "models", "shape_predictor_68_face_landmarks.dat"),
            "models/shape_predictor_68_face_landmarks.dat",
            os.path.join(os.path.expanduser("~"), "Downloads", "PythonProject", "models", "shape_predictor_68_face_landmarks.dat"),
            "/Users/siddhesh/Downloads/PythonProject/models/shape_predictor_68_face_landmarks.dat"
        ]
        
        predictor_path = None
        for path in predictor_paths:
            if os.path.exists(path):
                predictor_path = path
                break
        
        # If still not found, check if it's bundled with face_recognition library
        if predictor_path is None:
            try:
                import face_recognition_models
                predictor_path = face_recognition_models.pose_predictor_model_location()
            except:
                pass

        # Check if predictor exists
        if predictor_path is None or not os.path.exists(predictor_path):
            print("\n" + "=" * 60)
            print("ERROR: Facial landmark predictor not found!")
            print("=" * 60)
            print("\nPlease download the file:")
            print("http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2")
            print("\nExtract it and place in the 'models' folder as:")
            print("models/shape_predictor_68_face_landmarks.dat")
            print("\n" + "=" * 60)
            raise FileNotFoundError("shape_predictor_68_face_landmarks.dat not found")

        self.predictor = dlib.shape_predictor(predictor_path)

        # Define indexes for left and right eyes
        (self.lStart, self.lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
        (self.rStart, self.rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

        # Blink detection parameters
        self.EYE_AR_THRESH = 0.25
        self.EYE_AR_CONSEC_FRAMES = 2
        self.BLINK_TIMEOUT = 90  # Frames to wait for blink (about 3 seconds at 30fps)

        # Initialize counters
        self.blink_counter = 0
        self.total_blinks = 0
        self.ear_history = []

    def detect_blink(self, frame, face_rect):
        """Detect if person is blinking"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Get facial landmarks
        shape = self.predictor(gray, face_rect)
        shape = face_utils.shape_to_np(shape)

        # Extract eye landmarks
        leftEye = shape[self.lStart:self.lEnd]
        rightEye = shape[self.rStart:self.rEnd]

        # Calculate EAR for both eyes
        leftEAR = calculate_ear(leftEye)
        rightEAR = calculate_ear(rightEye)

        # Average EAR
        ear = (leftEAR + rightEAR) / 2.0
        self.ear_history.append(ear)

        # Keep only last 30 values
        if len(self.ear_history) > 30:
            self.ear_history.pop(0)

        # Draw eye contours for visualization
        leftEyeHull = cv2.convexHull(leftEye)
        rightEyeHull = cv2.convexHull(rightEye)
        cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)
        cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)

        # Check for blink
        if ear < self.EYE_AR_THRESH:
            self.blink_counter += 1
        else:
            if self.blink_counter >= self.EYE_AR_CONSEC_FRAMES:
                self.total_blinks += 1
            self.blink_counter = 0

        # Draw EAR value on frame
        cv2.putText(frame, f"EAR: {ear:.2f}", (300, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        cv2.putText(frame, f"Blinks: {self.total_blinks}", (300, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

        return self.total_blinks > 0

    def reset(self):
        """Reset blink counter"""
        self.total_blinks = 0
        self.blink_counter = 0
        self.ear_history = []