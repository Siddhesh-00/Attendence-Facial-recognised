from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import time
import cv2
import pickle
import numpy as np
import face_recognition
import csv
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Paths
BASE_DIR = os.path.join("..", "frontend")
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODELS_DIR = os.path.join(BASE_DIR, "models")
ENCODINGS_FILE = os.path.join(MODELS_DIR, "encodings.pkl")

os.makedirs(DATASET_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# In-memory databases
STUDENTS_DB = []
ATTENDANCE_LOGS = [] # This will store the table data

@app.route('/api/system/info', methods=['GET'])
def get_system_info():
    model_loaded = os.path.exists(ENCODINGS_FILE)
    return jsonify({"success": True, "status": "online", "camera_available": True, "model_loaded": model_loaded, "total_students": len(STUDENTS_DB)})

@app.route('/api/register/validate', methods=['POST'])
def validate_registration():
    data = request.json
    if not all([data.get('name'), data.get('roll_number'), data.get('class')]):
        return jsonify({"success": False, "error": "Missing required fields"}), 400
    return jsonify({"success": True, "message": "Validation successful"})

@app.route('/api/register/start-capture', methods=['POST'])
def start_capture():
    data = request.json
    name = data.get('name')
    student_dir = os.path.join(DATASET_DIR, name.replace(" ", "_"))
    os.makedirs(student_dir, exist_ok=True)
    
    print(f"Starting background camera capture for {name}...")
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        return jsonify({"success": False, "error": "Could not open webcam."}), 500

    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    count, max_images = 0, 25
    
    while count < max_images:
        ret, frame = cam.read()
        if not ret: break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, 1.3, 5)
        
        for (x, y, w, h) in faces:
            count += 1
            cv2.imwrite(os.path.join(student_dir, f"img_{count}.jpg"), gray[y:y+h, x:x+w])
            time.sleep(0.1)

    cam.release()
    STUDENTS_DB.append({"name": name, "roll_number": data.get('roll_number'), "class": data.get('class'), "encodings_generated": False})
    return jsonify({"success": True, "message": f"Successfully captured {count} images for {name}!"})

@app.route('/api/register/generate-encodings', methods=['POST'])
def generate_encodings():
    name = request.json.get('name')
    for student in STUDENTS_DB:
        if student['name'] == name: student['encodings_generated'] = True
    return train_model_logic()

@app.route('/api/train/encodings', methods=['POST'])
def train_encodings():
    return train_model_logic()

def train_model_logic():
    print("Training model...")
    known_encodings, known_names = [], []
    if not os.path.exists(DATASET_DIR): return jsonify({"success": False, "error": "Dataset folder not found"}), 404

    for person_name in os.listdir(DATASET_DIR):
        person_dir = os.path.join(DATASET_DIR, person_name)
        if not os.path.isdir(person_dir): continue

        for img_name in os.listdir(person_dir):
            if not img_name.endswith(('jpg', 'jpeg', 'png')): continue
            image = face_recognition.load_image_file(os.path.join(person_dir, img_name))
            encodings = face_recognition.face_encodings(image)
            if encodings:
                known_encodings.append(encodings[0])
                known_names.append(person_name.replace("_", " "))

    with open(ENCODINGS_FILE, 'wb') as f:
        pickle.dump({"encodings": known_encodings, "names": known_names}, f)
    return jsonify({"success": True, "message": "Model trained successfully."})

@app.route('/api/attendance/start', methods=['POST'])
def start_attendance():
    if not os.path.exists(ENCODINGS_FILE):
        return jsonify({"success": False, "error": "Model is not trained yet."}), 400

    with open(ENCODINGS_FILE, 'rb') as f:
        data = pickle.load(f)
    
    cam = cv2.VideoCapture(0)
    recognized_students = set()
    
    for _ in range(50):
        ret, frame = cam.read()
        if not ret: break
        
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        
        for face_encoding in face_recognition.face_encodings(rgb_small_frame, face_recognition.face_locations(rgb_small_frame)):
            matches = face_recognition.compare_faces(data["encodings"], face_encoding, tolerance=0.5)
            if True in matches:
                name = data["names"][matches.index(True)]
                recognized_students.add(name)

    cam.release()
    
    # Save recognized students into our Attendance Logs with timestamps
    now = datetime.now()
    for name in recognized_students:
        ATTENDANCE_LOGS.append({
            "name": name,
            "date": now.strftime("%Y-%m-%d"),
            "time": now.strftime("%H:%M:%S"),
            "status": "Present"
        })
    
    return jsonify({
        "success": True, 
        "message": f"Successfully marked {len(recognized_students)} students.",
        "marked_count": len(recognized_students),
        "students": list(recognized_students)
    })

# --- NEW: Fetch logs for the UI Table ---
@app.route('/api/attendance/logs', methods=['GET'])
def get_attendance_logs():
    return jsonify({"success": True, "logs": ATTENDANCE_LOGS})

# --- NEW: Export data to local folder ---
@app.route('/api/attendance/export', methods=['POST'])
def export_attendance():
    export_dir = os.path.join(BASE_DIR, "exports")
    os.makedirs(export_dir, exist_ok=True)
    
    filename = f"Attendance_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    filepath = os.path.join(export_dir, filename)
    
    with open(filepath, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Name", "Date", "Time", "Status"])
        for log in ATTENDANCE_LOGS:
            writer.writerow([log["name"], log["date"], log["time"], log["status"]])
            
    return jsonify({"success": True, "message": f"Successfully saved to frontend/exports/{filename}"})

@app.route('/api/students', methods=['GET'])
def get_students():
    return jsonify({"success": True, "students": STUDENTS_DB})

if __name__ == '__main__':
    print("Starting backend server on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)
