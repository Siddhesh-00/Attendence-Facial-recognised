#!/usr/bin/env python3

import base64
import cv2
from pathlib import Path
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS

from trainer import train_from_dataset
from attendance import AttendanceMarker

BASE_DIR = Path(__file__).parent.resolve()
DATASET_DIR = BASE_DIR / "dataset"
FRONTEND_DIR = BASE_DIR / "frontend"
TMP_DIR = BASE_DIR / "tmp"

DATASET_DIR.mkdir(exist_ok=True)
TMP_DIR.mkdir(exist_ok=True)

app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="/")
CORS(app)

def save_base64_image(data_url, path):
    header, encoded = data_url.split(",", 1)
    image_data = base64.b64decode(encoded)
    with open(path, "wb") as f:
        f.write(image_data)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify(status="ok", message="System is running")

@app.route("/api/register/capture-frame", methods=["POST"])
def capture_frame():
    data = request.get_json(force=True)
    name = data.get("name")
    roll = data.get("roll_number")
    image = data.get("image")

    if not name or not roll or not image:
        return jsonify(status="error", message="Missing data"), 400

    folder = DATASET_DIR / f"{name.replace(' ','_')}_{roll}"
    folder.mkdir(parents=True, exist_ok=True)

    filename = datetime.utcnow().strftime("%Y%m%d%H%M%S%f") + ".jpg"
    path = folder / filename

    save_base64_image(image, path)

    return jsonify(status="ok", message="Image saved")

@app.route("/api/train/encodings", methods=["POST"])
def train_all():
    try:
        train_from_dataset()
        return jsonify(status="ok", message="Training complete")
    except Exception as e:
        return jsonify(status="error", message=str(e)), 500

@app.route("/api/attendance/recognize", methods=["POST"])
def recognize():
    data = request.get_json(force=True)
    image = data.get("image")

    if not image:
        return jsonify(status="error", message="No image"), 400

    tmp_path = TMP_DIR / (datetime.utcnow().strftime("%Y%m%d%H%M%S%f") + ".jpg")
    save_base64_image(image, tmp_path)

    try:
        frame = cv2.imread(str(tmp_path))
        marker = AttendanceMarker()
        _, results = marker.process_frame(frame)

        return jsonify(status="ok", results=results)
    except Exception as e:
        return jsonify(status="error", message=str(e)), 500

@app.route("/")
def index():
    return send_from_directory(str(FRONTEND_DIR), "web_interface.html")

@app.route("/<path:path>")
def static_files(path):
    file_path = FRONTEND_DIR / path
    if file_path.exists():
        return send_from_directory(str(FRONTEND_DIR), path)
    return abort(404)

if __name__ == "__main__":
    print("Server running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
