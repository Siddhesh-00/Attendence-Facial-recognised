#!/bin/bash
# Smart Face Recognition Attendance System - Quick Start Script

echo "==========================================="
echo "Smart Face Recognition Attendance System"
echo "Quick Start Setup"
echo "==========================================="

# Check Python version
python_version=$(python3 --version)
echo "Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Check for shape predictor model
if [ ! -f "models/shape_predictor_68_face_landmarks.dat" ]; then
    echo ""
    echo "⚠️  WARNING: Face landmarks model not found!"
    echo "You need to download: shape_predictor_68_face_landmarks.dat"
    echo "From: http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2"
    echo "Extract and place in: models/"
    echo ""
fi

# Display menu
echo ""
echo "==========================================="
echo "Select an option:"
echo "==========================================="
echo "1. Run Jupyter Notebook (Recommended)"
echo "2. Run Flask API Backend"
echo "3. Run CLI Interface"
echo "4. Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Starting Jupyter Notebook..."
        jupyter notebook frontend/attendance_ui_integrated.ipynb
        ;;
    2)
        echo "Starting Flask API server..."
        python backend_api.py
        ;;
    3)
        echo "Starting CLI interface..."
        python main.py
        ;;
    4)
        echo "Exiting..."
        deactivate
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac
