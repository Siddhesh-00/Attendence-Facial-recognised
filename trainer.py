"""
Face encoding trainer - Regenerate encodings from dataset
"""

import os
import face_recognition
import numpy as np
from utils import save_encodings
import warnings

# Suppress a benign multiprocessing.resource_tracker warning that can appear
# on some macOS/Python combinations when underlying C libraries create
# semaphores that are cleaned up by the OS at process exit. The warning is
# non-fatal; keep it suppressed for cleaner logs. If you'd rather fix the
# root cause, consider ensuring all multiprocessing pools are closed/joined
# or testing with a newer Python version.
warnings.filterwarnings(
    "ignore",
    message=r"resource_tracker: There appear to be .* leaked semaphore objects to clean up at shutdown",
    category=UserWarning,
)


def train_from_dataset():
    """Train face encodings from all images in dataset folder"""
    print("=" * 50)
    print("TRAINING FACE ENCODINGS FROM DATASET")
    print("=" * 50)

    dataset_path = "dataset"
    if not os.path.exists(dataset_path):
        print("Dataset folder not found!")
        return

    # Get all student folders
    student_folders = [f for f in os.listdir(dataset_path)
                       if os.path.isdir(os.path.join(dataset_path, f))]

    if len(student_folders) == 0:
        print("No student folders found in dataset!")
        return

    encodings_data = {
        'encodings': [],
        'names': [],
        'roll_numbers': [],
        'classes': []
    }

    print(f"Found {len(student_folders)} students")

    for student_folder in student_folders:
        # Parse name and roll number from folder name
        try:
            name, roll_number = student_folder.rsplit('_', 1)
        except:
            print(f"Skipping invalid folder: {student_folder}")
            continue

        folder_path = os.path.join(dataset_path, student_folder)
        image_files = [f for f in os.listdir(folder_path)
                       if f.endswith(('.jpg', '.jpeg', '.png'))]

        print(f"\nProcessing {name} (Roll: {roll_number}) - {len(image_files)} images")

        student_encodings = []

        for image_file in image_files:
            image_path = os.path.join(folder_path, image_file)

            # Load image
            image = face_recognition.load_image_file(image_path)

            # Detect faces
            face_locations = face_recognition.face_locations(image)

            if len(face_locations) > 0:
                # Get encoding
                face_encoding = face_recognition.face_encodings(image, face_locations)[0]
                student_encodings.append(face_encoding)
                print(".", end="", flush=True)

        if len(student_encodings) > 0:
            # Average encodings
            avg_encoding = np.mean(student_encodings, axis=0)

            encodings_data['encodings'].append(avg_encoding)
            encodings_data['names'].append(name)
            encodings_data['roll_numbers'].append(roll_number)
            encodings_data['classes'].append("Unknown")  # You can add class info manually

            print(f"\n✓ Added {len(student_encodings)} encodings for {name}")
        else:
            print(f"\n✗ No faces found for {name}")

    # Save encodings
    save_encodings(encodings_data)

    print("\n" + "=" * 50)
    print(f"Training complete! Saved {len(encodings_data['names'])} students")
    print("=" * 50)


if __name__ == "__main__":
    train_from_dataset()