"""
Student registration module
"""

import cv2
import os
import face_recognition
import numpy as np
import time
from utils import ensure_directories, load_encodings, save_encodings


class StudentRegistration:
    def __init__(self):
        self.name = ""
        self.roll_number = ""
        self.student_class = ""
        ensure_directories()

    def validate_input(self, name, roll_number, student_class):
        """Validate registration input"""
        if not name or not roll_number or not student_class:
            return False, "All fields are required"

        # Check if roll number is unique
        encodings_data = load_encodings()
        if roll_number in encodings_data['roll_numbers']:
            return False, "Roll number already exists"

        return True, "Valid"

    def capture_faces(self, name, roll_number, student_class):
        """Capture face images for registration"""
        self.name = name
        self.roll_number = roll_number
        self.student_class = student_class

        # Create folder for student
        student_folder = f"dataset/{name}_{roll_number}"
        if not os.path.exists(student_folder):
            os.makedirs(student_folder)

        # Initialize camera
        cap = cv2.VideoCapture(0)
        # Check if camera opened successfully
        if not cap.isOpened():
            # Try to release if partially opened
            try:
                cap.release()
            except Exception:
                pass
            return False, (
                "Camera access failed. On macOS grant camera permission to the Terminal/Python "
                "process (System Settings → Privacy & Security → Camera) or run the backend in a "
                "foreground terminal so the OS can prompt for permission."
            )
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )

        count = 0
        max_images = 25
        capture_delay = 5  # Capture every 5 frames
        frame_counter = 0

        print(f"\nCapturing {max_images} images for {name}...")
        print("Press 'q' to quit early")

        # Determine whether GUI functions (imshow) are available. If not, run headless capture.
        gui_available = True
        try:
            cv2.namedWindow('test')
            cv2.destroyWindow('test')
        except Exception:
            gui_available = False

        try:
            loop_iterations = 0
            max_iterations = max_images * capture_delay * 10  # safety cap
            while count < max_images and loop_iterations < max_iterations:
                loop_iterations += 1
                ret, frame = cap.read()
                if not ret:
                    # camera read failed; break and return helpful message
                    break

                # Flip frame horizontally for mirror effect
                try:
                    frame = cv2.flip(frame, 1)
                except Exception:
                    pass

                # Detect faces (guard against OpenCV errors)
                try:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
                except Exception:
                    faces = []

                # Draw rectangle around faces and capture on interval
                for (x, y, w, h) in faces:
                    try:
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    except Exception:
                        pass

                    frame_counter += 1
                    if frame_counter % capture_delay == 0 and len(faces) > 0:
                        face_roi = frame[y:y + h, x:x + w]
                        if face_roi is not None and face_roi.size > 0:
                            try:
                                face_roi = cv2.resize(face_roi, (224, 224))
                                img_path = f"{student_folder}/img_{count}.jpg"
                                cv2.imwrite(img_path, face_roi)
                                count += 1
                                print(f"Captured {count}/{max_images}")
                            except Exception:
                                pass

                # If GUI available, show frame and allow key to cancel
                if gui_available:
                    try:
                        cv2.putText(frame, f"Captured: {count}/{max_images}", (10, 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                        cv2.putText(frame, f"Student: {name}", (10, 60),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                        cv2.imshow('Register Student - Press ESC to stop', frame)
                        if cv2.waitKey(1) & 0xFF == 27:
                            break
                    except Exception:
                        # If imshow/waitKey fails, disable GUI and continue headless
                        gui_available = False
                else:
                    # Headless mode: small sleep to avoid busy loop
                    time.sleep(0.03)

            # If we exited because reads failed, give informative message
            if count < max_images and loop_iterations >= max_iterations:
                return False, (
                    f"Capture timed out after {loop_iterations} iterations; captured {count} images. "
                    "If you're on macOS, ensure Terminal/Python has Camera permission or run the backend in a foreground terminal."
                )

            if not ret:
                return False, (
                    "Camera read failed. This often indicates missing camera permission or the camera is in use by another app. "
                    "On macOS: grant Camera access (System Settings → Privacy & Security → Camera) or run the backend in a foreground terminal so the OS can prompt for permission."
                )

        except Exception as e:
            try:
                cap.release()
            except Exception:
                pass
            try:
                cv2.destroyAllWindows()
            except Exception:
                pass
            # Provide actionable guidance for OpenCV C++ exceptions
            msg = str(e)
            if 'Unknown C++ exception' in msg or 'cv::Exception' in msg:
                msg += (
                    " — OpenCV low-level error. On macOS, try setting OPENCV_AVFOUNDATION_SKIP_AUTH=1 "
                    "when running the backend detached, or run the backend in a foreground terminal to allow the OS camera permission dialog."
                )
            return False, f"Camera error: {msg}"

        # normal cleanup
        cap.release()
        try:
            cv2.destroyAllWindows()
        except Exception:
            pass

        if count >= 20:  # Minimum images required
            return True, f"Captured {count} images"
        else:
            return False, f"Only captured {count} images. Need at least 20."

    def generate_encodings(self, name, roll_number, student_class):
        """Generate face encodings from captured images"""
        student_folder = f"dataset/{name}_{roll_number}"

        if not os.path.exists(student_folder):
            return False, "Student folder not found"

        # Load existing encodings
        encodings_data = load_encodings()

        # Process each image in student folder
        image_files = [f for f in os.listdir(student_folder)
                       if f.endswith(('.jpg', '.jpeg', '.png'))]

        new_encodings = []

        for image_file in image_files:
            image_path = os.path.join(student_folder, image_file)

            # Load image
            image = face_recognition.load_image_file(image_path)

            # Detect face locations
            face_locations = face_recognition.face_locations(image)

            if len(face_locations) > 0:
                # Get encoding for first face
                face_encoding = face_recognition.face_encodings(image, face_locations)[0]
                new_encodings.append(face_encoding)

        if len(new_encodings) > 0:
            # Average multiple encodings for better accuracy
            avg_encoding = np.mean(new_encodings, axis=0)

            # Add to encodings data
            encodings_data['encodings'].append(avg_encoding)
            encodings_data['names'].append(name)
            encodings_data['roll_numbers'].append(roll_number)
            encodings_data['classes'].append(student_class)

            # Save updated encodings
            save_encodings(encodings_data)

            return True, f"Generated encoding from {len(new_encodings)} images"
        else:
            return False, "No faces found in captured images"