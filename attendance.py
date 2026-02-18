"""
Attendance marking module with anti-spoofing
"""
import dlib
import cv2
import face_recognition
import numpy as np
from utils import load_encodings, mark_attendance
from liveness import BlinkDetector
import time
import sys


class AttendanceMarker:
    def __init__(self):
        self.encodings_data = load_encodings()
        self.blink_detector = BlinkDetector()
        self.marked_today = set()  # Track who's been marked

    def process_frame(self, frame):
        """Process a single frame for face recognition"""
        # Resize frame for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Find face locations
        face_locations = face_recognition.face_locations(rgb_small_frame)

        if len(face_locations) == 0:
            return frame, []

        # Get face encodings
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        # Scale face locations back to original frame size
        scaled_locations = []
        for (top, right, bottom, left) in face_locations:
            top *= 2
            right *= 2
            bottom *= 2
            left *= 2
            scaled_locations.append((top, right, bottom, left))

        # Process each face
        attendance_results = []
        for face_encoding, (top, right, bottom, left) in zip(face_encodings, scaled_locations):
            # Check for liveness (blink detection)
            face_rect = dlib.rectangle(left, top, right, bottom)
            has_blinked = self.blink_detector.detect_blink(frame, face_rect)

            # Draw face rectangle
            color = (0, 0, 255)  # Red for no blink
            status = "No Blink Detected"

            if has_blinked:
                color = (0, 255, 0)  # Green for blink detected
                status = "Blink Detected"

                # Match with database
                matches = face_recognition.compare_faces(self.encodings_data['encodings'], face_encoding)
                name = "Unknown"
                roll = ""
                student_class = ""

                if True in matches:
                    match_index = matches.index(True)
                    name = self.encodings_data['names'][match_index]
                    roll = self.encodings_data['roll_numbers'][match_index]
                    student_class = self.encodings_data['classes'][match_index]

                    # Mark attendance if not already marked today
                    if roll not in self.marked_today:
                        success, message = mark_attendance(name, roll, student_class)
                        if success:
                            self.marked_today.add(roll)
                            attendance_results.append((name, roll, "Marked"))
                        else:
                            attendance_results.append((name, roll, "Already Marked"))
                else:
                    attendance_results.append(("Unknown", "", "Not in Database"))
            else:
                attendance_results.append(("Checking Liveness", "", ""))

            # Draw rectangle and info
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)

            # Display name and status
            y_pos = top - 10 if top - 10 > 10 else top + 10
            cv2.putText(frame, f"Status: {status}", (left, y_pos),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            if len(attendance_results) > 0:
                last_result = attendance_results[-1]
                if last_result[0] != "Checking Liveness":
                    cv2.putText(frame, f"Name: {last_result[0]}", (left, y_pos + 25),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        return frame, attendance_results

    def run_attendance(self):
        """Main attendance loop"""
        cap = cv2.VideoCapture(0)
        # Check camera opened
        if not cap.isOpened():
            try:
                cap.release()
            except Exception:
                pass
            raise Exception(
                "Camera access failed. Grant Camera permission to the Terminal/Python process "
                "(System Settings → Privacy & Security → Camera) or run the backend in a foreground terminal."
            )

        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        # For FPS calculation
        fps_counter = 0
        fps_time = time.time()
        fps = 0

        print("\nAttendance System Started")
        print("Look at camera and blink naturally")
        print("Press ESC to exit")

        # Determine GUI availability
        gui_available = True
        try:
            cv2.namedWindow('test')
            cv2.destroyWindow('test')
        except Exception:
            gui_available = False

        try:
            loop_iterations = 0
            max_iterations = 1000000
            while True:
                loop_iterations += 1
                ret, frame = cap.read()
                if not ret:
                    raise Exception(
                        "Camera read failed. This often indicates missing camera permission or the camera is in use by another app. "
                        "On macOS: grant Camera access (System Settings → Privacy & Security → Camera) or run the backend in a foreground terminal."
                    )

                # Flip frame horizontally
                try:
                    frame = cv2.flip(frame, 1)
                except Exception:
                    pass

                # Process frame
                processed_frame, results = self.process_frame(frame)

                # Calculate FPS
                fps_counter += 1
                if time.time() - fps_time >= 1.0:
                    fps = fps_counter
                    fps_counter = 0
                    fps_time = time.time()

                # Display FPS
                try:
                    cv2.putText(processed_frame, f"FPS: {fps}", (10, 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                except Exception:
                    pass

                # Display recent attendance results
                y_offset = 60
                try:
                    for name, roll, status in results[-5:]:  # Show last 5 results
                        cv2.putText(processed_frame, f"{name}: {status}", (10, y_offset),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
                        y_offset += 25
                except Exception:
                    pass

                # Show frame or operate headless
                if gui_available:
                    try:
                        cv2.imshow('Attendance System - Look at camera and blink', processed_frame)
                        if cv2.waitKey(1) & 0xFF == 27:
                            break
                    except Exception as e:
                        # If low-level OpenCV C++ exception occurs, provide guidance
                        msg = str(e)
                        if 'Unknown C++ exception' in msg or 'cv::Exception' in msg:
                            msg += (
                                " — OpenCV low-level error. On macOS, try setting OPENCV_AVFOUNDATION_SKIP_AUTH=1 "
                                "when running the backend detached, or run the backend in a foreground terminal to allow the OS camera permission dialog."
                            )
                        raise Exception(f"Camera/OpenCV error: {msg}")
                else:
                    # headless: sleep briefly to avoid busy loop
                    time.sleep(0.02)

                if loop_iterations >= max_iterations:
                    break

        except Exception as e:
            try:
                cap.release()
            except Exception:
                pass
            try:
                cv2.destroyAllWindows()
            except Exception:
                pass
            raise

        # normal cleanup
        try:
            cap.release()
        except Exception:
            pass
        try:
            cv2.destroyAllWindows()
        except Exception:
            pass

        self.print_summary()

    def print_summary(self):
        """Print attendance summary"""
        print("\n" + "=" * 50)
        print("ATTENDANCE SUMMARY")
        print("=" * 50)
        if len(self.marked_today) > 0:
            print(f"Marked attendance for {len(self.marked_today)} students today")
        else:
            print("No attendance marked today")

        # Load and display today's attendance
        try:
            import pandas as pd
            df = pd.read_excel('attendance/attendance.xlsx')
            from datetime import datetime
            today = datetime.now().strftime("%Y-%m-%d")
            today_attendance = df[df['Date'] == today]
            if len(today_attendance) > 0:
                print("\nToday's Attendance:")
                print(today_attendance.to_string(index=False))
        except:
            pass
