
# Smart Face Recognition Attendance System

A complete face recognition-based attendance system with anti-spoofing capabilities using blink detection. The system includes multiple frontend interfaces integrated with a powerful backend.

## 🎯 Features

- ✅ **Face Recognition** - State-of-the-art face encoding and recognition
- ✅ **Anti-Spoofing** - Blink-based liveness detection to prevent spoofing
- ✅ **Student Registration** - Easy student enrollment with face capture
- ✅ **Attendance Marking** - Real-time attendance marking with multiple face support
- ✅ **Multiple Interfaces** - Jupyter Notebook, Flask API, Web UI, and CLI
- ✅ **Excel Reports** - Attendance data exported to Excel
- ✅ **Scalable** - Easy to extend with custom features

## 📋 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontends                             │
├─────────────────────────────────────────────────────────┤
│  - Jupyter Notebook (Direct Integration)               │
│  - Web Interface (HTML + JavaScript)                   │
│  - CLI Interface (main.py)                             │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐   ┌────────▼────────┐
│  Flask REST API  │   │ Direct Python   │
│  (backend_api.py)│   │ (Notebook)      │
└───────┬──────────┘   └────────┬────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────▼────────────┐
        │  Backend Modules       │
        ├────────────────────────┤
        │ - Registration         │
        │ - Attendance Marking   │
        │ - Face Training        │
        │ - Liveness Detection   │
        │ - Utilities            │
        └────────────────────────┘
```

## 🚀 Quick Start

### Option 1: Jupyter Notebook (Recommended for Development)

```bash
# 1. Setup
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 2. Run Jupyter Notebook
jupyter notebook frontend/attendance_ui_integrated.ipynb
```

**Advantages:**
- Direct Python integration
- Real-time debugging
- No network overhead
- Rich UI with widgets

### Option 2: Flask REST API + Web Interface

```bash
# Terminal 1: Start API Server
source .venv/bin/activate
python backend_api.py

# Terminal 2: Open Web Interface
# Then open web_interface.html in your browser
# Or use: open web_interface.html (macOS)
```

**Advantages:**
- Distributed architecture
- Web-based interface
- RESTful API for external integration
- Better for production

### Option 3: CLI Interface

```bash
source .venv/bin/activate
python main.py
```

## 📁 Project Structure

```
PythonProject/
│
├── 📄 README.md                          # This file
├── 📄 INTEGRATION_GUIDE.md               # Detailed integration guide
├── 📄 requirements.txt                   # Python dependencies
├── 🔧 quickstart.sh                      # Quick start script
│
├── 🎯 Main Application Files
│   ├── main.py                          # CLI interface
│   ├── backend_api.py                   # Flask REST API
│   ├── register.py                      # Student registration
│   ├── attendance.py                    # Attendance marking
│   ├── trainer.py                       # Face encoding trainer
│   ├── liveness.py                      # Blink detection
│   └── utils.py                         # Utility functions
│
├── 🎨 Frontend
│   ├── attendance_ui_integrated.ipynb    # Improved Jupyter notebook
│   ├── index.html                       # Old web interface
│   └── temp_reg.txt                     # Temporary file
│
├── 📊 Data Storage
│   ├── dataset/                         # Student face images
│   │   └── [StudentName_RollNo]/
│   ├── models/                          # Model files
│   │   ├── encodings.pkl               # Face encodings database
│   │   └── shape_predictor_68...dat    # Facial landmarks model
│   └── attendance/                      # Attendance records
│       └── attendance.xlsx             # Excel report
│
└── 🗂️ Cache
    └── __pycache__/                    # Python cache
```

## 🔧 Installation

### Prerequisites
- Python 3.9+
- Webcam
- 500MB+ free disk space

### Step 1: Clone/Copy Project
```bash
cd /Users/siddhesh/Downloads/PythonProject
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
# OR
.venv\Scripts\activate      # Windows
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Download Facial Landmarks Model
Download from: http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2

Extract and place in: `models/shape_predictor_68_face_landmarks.dat`

### Step 5: Run the System
Choose your preferred interface (see Quick Start above)

## 📚 API Reference

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "message": "System is running"
}
```

#### 2. System Information
```
GET /api/system/info
```
Response:
```json
{
  "status": "ok",
  "total_students": 5,
  "dataset_path": "dataset/",
  "attendance_file": "attendance/attendance.xlsx"
}
```

#### 3. Register Student
```
POST /api/register/validate
Content-Type: application/json

{
  "name": "John Doe",
  "roll_number": "1001",
  "class": "10-A"
}
```

#### 4. Start Face Capture
```
POST /api/register/start-capture
Content-Type: application/json

{
  "name": "John Doe",
  "roll_number": "1001",
  "class": "10-A"
}
```

#### 5. Generate Face Encodings
```
POST /api/register/generate-encodings
Content-Type: application/json

{
  "name": "John Doe",
  "roll_number": "1001",
  "class": "10-A"
}
```

#### 6. Start Attendance
```
POST /api/attendance/start
```

#### 7. Train Encodings
```
POST /api/train/encodings
```

#### 8. Get Students List
```
GET /api/students
```

## 🎓 Usage Guide

### Registering a Student

1. Open the interface (Notebook, Web, or CLI)
2. Click "Register Student"
3. Enter:
   - Student Name
   - Roll Number
   - Class
4. Click "Start Registration"
5. Look at the camera and stay still
6. 20+ face images will be captured
7. Face encodings are generated automatically

### Marking Attendance

1. Open the interface
2. Click "Take Attendance"
3. Know at the camera and **blink naturally**
4. Recognition happens in real-time
5. Attendance is marked in attendance.xlsx
6. Press ESC in camera to stop

### Training Encodings

1. Open the interface
2. Click "Train Encodings"
3. The system will regenerate all encodings from dataset
4. Use after adding new students

## 🔐 Anti-Spoofing

The system uses **blink detection** for liveness detection:
- User must blink naturally while looking at camera
- Prevents photo/video spoofing attacks
- Uses facial landmark tracking
- Real-time detection during attendance

## 📊 Output Files

### Attendance Reports
- **Location:** `attendance/attendance.xlsx`
- **Format:** Excel spreadsheet
- **Columns:** Name, Roll Number, Class, Date, Time

### Face Encodings
- **Location:** `models/encodings.pkl`
- **Format:** Python pickle (binary)
- **Content:** Face feature vectors (128-dimensional)

### Student Images
- **Location:** `dataset/[Name_RollNo]/`
- **Format:** JPEG images
- **Count:** 20+ per student

## 🛠️ Troubleshooting

### Camera Issues
```
Error: Cannot open camera
Solution: Check webcam permissions and ensure it's not used by another app
```

### Import Errors
```
Error: ModuleNotFoundError: No module named 'cv2'
Solution: pip install -r requirements.txt
```

### Encoding Generation
```
Error: shape_predictor_68_face_landmarks.dat not found
Solution: Download from dlib and place in models/ folder
```

### API Connection
```
Error: Cannot connect to http://localhost:5000
Solution: Ensure Flask API is running: python backend_api.py
```

## 📝 Example Python Usage

```python
from register import StudentRegistration
from attendance import AttendanceMarker
from trainer import train_from_dataset

# Register a student
reg = StudentRegistration()
valid, msg = reg.validate_input("John Doe", "1001", "10-A")
if valid:
    success, msg = reg.capture_faces("John Doe", "1001", "10-A")
    if success:
        success, msg = reg.generate_encodings("John Doe", "1001", "10-A")
        print(f"Registration: {msg}")

# Mark attendance
attendance = AttendanceMarker()
attendance.run_attendance()

# Train system
train_from_dataset()
```

## 🌐 Web Interface Usage

1. Start Flask API: `python backend_api.py`
2. Open `web_interface.html` in your browser
3. Use the interactive dashboard to:
   - Register students
   - Mark attendance
   - Train encodings
   - View student list

## 📈 Performance Notes

- **Face Recognition:** ~100ms per frame
- **Anti-Spoofing Check:** Real-time
- **Dataset Size:** Can handle 50+ students efficiently
- **Concurrent Users:** 1 (due to camera limitation)

## 🔄 Integration Options

| Interface | Use Case | Advantages |
|-----------|----------|------------|
| Jupyter Notebook | Development/Testing | Direct integration, easy debugging |
| Flask API | Production Server | Scalable, RESTful, API-first |
| Web UI | User Interface | Browser-based, no installation |
| CLI | Command Line | Simple, no UI overhead |

## 📚 Documentation

- **INTEGRATION_GUIDE.md** - Detailed integration information
- **API Endpoints** - Full REST API documentation
- **Code Comments** - Inline documentation in all modules

## 🤝 Contributing

To extend the system:

1. **Add new recognition methods** - Modify `attendance.py`
2. **Improve liveness detection** - Update `liveness.py`
3. **Add new API endpoints** - Extend `backend_api.py`
4. **Create custom frontends** - Use the REST API

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💼 Support

For issues or questions:
1. Check INTEGRATION_GUIDE.md
2. Review error messages in status area
3. Check API logs at http://localhost:5000
4. Verify all dependencies are installed

---

**Last Updated:** February 18, 2026

**Status:** ✅ Fully Integrated and Tested

**Components:**
- ✅ Backend: Fully functional
- ✅ Frontend: Multiple options available
- ✅ Integration: Complete
- ✅ Documentation: Comprehensive

Enjoy using the Smart Face Recognition Attendance System! 🎓
=======
# Attendence-Facial-recognised
>>>>>>> 5c1bebd659ef37a55bba078a9b1b15431b69b80c
