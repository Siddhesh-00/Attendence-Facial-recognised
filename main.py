"""
Main entry point for Smart Face Recognition Attendance System
"""

from register import StudentRegistration
from attendance import AttendanceMarker
from utils import ensure_directories
import sys


def print_header():
    """Print system header"""
    print("=" * 60)
    print("   SMART FACE RECOGNITION ATTENDANCE SYSTEM")
    print("           WITH ANTI-SPOOFING")
    print("=" * 60)


def main():
    """Main function"""
    ensure_directories()

    while True:
        print_header()
        print("\nMAIN MENU:")
        print("1. Register New Student")
        print("2. Take Attendance")
        print("3. Train Encodings (if needed)")
        print("4. Exit")

        choice = input("\nEnter your choice (1-4): ").strip()

        if choice == '1':
            # Register new student
            print("\n" + "-" * 40)
            print("STUDENT REGISTRATION")
            print("-" * 40)

            name = input("Enter student name: ").strip()
            roll = input("Enter roll number: ").strip()
            student_class = input("Enter class: ").strip()

            register = StudentRegistration()

            # Validate input
            valid, message = register.validate_input(name, roll, student_class)
            if not valid:
                print(f"\nError: {message}")
                input("\nPress Enter to continue...")
                continue

            print("\nOpening camera for face capture...")
            print("Please look at the camera")
            input("Press Enter when ready...")

            # Capture faces
            success, message = register.capture_faces(name, roll, student_class)
            if not success:
                print(f"\nError: {message}")
                input("\nPress Enter to continue...")
                continue

            print(f"\n{message}")

            # Generate encodings
            print("\nGenerating face encodings...")
            success, message = register.generate_encodings(name, roll, student_class)

            if success:
                print(f"\n✓ Registration successful!")
                print(f"Student: {name}")
                print(f"Roll: {roll}")
            else:
                print(f"\nError: {message}")

            input("\nPress Enter to continue...")

        elif choice == '2':
            # Take attendance
            print("\n" + "-" * 40)
            print("TAKING ATTENDANCE")
            print("-" * 40)
            print("\nInstructions:")
            print("1. Look directly at the camera")
            print("2. Blink naturally to prove liveness")
            print("3. Hold steady for recognition")
            print("\nPress ESC in camera window to stop")
            input("\nPress Enter to start attendance...")

            attendance = AttendanceMarker()
            attendance.run_attendance()

            input("\nPress Enter to continue...")

        elif choice == '3':
            # Train encodings
            print("\n" + "-" * 40)
            print("TRAINING ENCODINGS")
            print("-" * 40)

            from trainer import train_from_dataset
            train_from_dataset()

            input("\nPress Enter to continue...")

        elif choice == '4':
            print("\nThank you for using the system!")
            sys.exit(0)

        else:
            print("\nInvalid choice! Please try again.")
            input("\nPress Enter to continue...")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nSystem interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        input("\nPress Enter to exit...")