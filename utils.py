"""
Utility functions for face recognition attendance system
"""

import os
import pickle
import cv2
import numpy as np
import pandas as pd
from datetime import datetime
import face_recognition


def ensure_directories():
    """Create necessary directories if they don't exist"""
    directories = ['dataset', 'models', 'attendance']
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")


def load_encodings():
    """Load face encodings from pickle file"""
    encoding_file = 'models/encodings.pkl'
    if os.path.exists(encoding_file):
        with open(encoding_file, 'rb') as f:
            return pickle.load(f)
    return {'encodings': [], 'names': [], 'roll_numbers': [], 'classes': []}


def save_encodings(encodings_data):
    """Save face encodings to pickle file"""
    with open('models/encodings.pkl', 'wb') as f:
        pickle.dump(encodings_data, f)


def mark_attendance(name, roll_number, student_class):
    """Mark attendance in Excel file"""
    attendance_file = 'attendance/attendance.xlsx'

    # Get current date and time
    now = datetime.now()
    date = now.strftime("%Y-%m-%d")
    time = now.strftime("%H:%M:%S")

    # Create dataframe for new record
    new_record = pd.DataFrame({
        'Name': [name],
        'Roll Number': [roll_number],
        'Class': [student_class],
        'Date': [date],
        'Time': [time]
    })

    # Check if file exists
    if os.path.exists(attendance_file):
        # Read existing file
        df = pd.read_excel(attendance_file)

        # Check if already marked today
        today_record = df[(df['Roll Number'] == roll_number) & (df['Date'] == date)]
        if len(today_record) > 0:
            return False, "Already marked today"

        # Append new record
        df = pd.concat([df, new_record], ignore_index=True)
    else:
        # Create new file
        df = new_record

    # Save to Excel
    df.to_excel(attendance_file, index=False)
    return True, "Attendance marked successfully"


def calculate_ear(eye):
    """Calculate Eye Aspect Ratio for blink detection"""
    # Compute the euclidean distances between the two sets of vertical eye landmarks
    A = np.linalg.norm(eye[1] - eye[5])
    B = np.linalg.norm(eye[2] - eye[4])

    # Compute the euclidean distance between the horizontal eye landmark
    C = np.linalg.norm(eye[0] - eye[3])

    # Compute the eye aspect ratio
    ear = (A + B) / (2.0 * C)
    return ear