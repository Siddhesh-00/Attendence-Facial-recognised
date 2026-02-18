"""
Flask Backend API for Smart Face Recognition Attendance System
Provides REST endpoints for frontend integration
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys

# Ensure OpenCV on macOS doesn't try to spin the AVFoundation main loop
# when the backend is started detached. This avoids low-level C++ exceptions
# like "can not spin main run loop from other thread" and camera failures.
if sys.platform == 'darwin' and 'OPENCV_AVFOUNDATION_SKIP_AUTH' not in os.environ:
    os.environ['OPENCV_AVFOUNDATION_SKIP_AUTH'] = '1'

from register import StudentRegistration
from attendance import AttendanceMarker
from trainer import train_from_dataset
from utils import load_encodings, ensure_directories
import traceback

app = Flask(__name__)
CORS(app)

# Ensure directories exist
ensure_directories()


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'System is running'})


@app.route('/api/system/info', methods=['GET'])
def system_info():
    """Get system information"""
    try:
        encodings_data = load_encodings()
        total_students = len(encodings_data['names'])
        
        return jsonify({
            'status': 'ok',
            'total_students': total_students,
            'dataset_path': 'dataset/',
            'attendance_file': 'attendance/attendance.xlsx',
            'models_path': 'models/'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api', methods=['GET'])
def api_root():
    """API root - list available endpoints"""
    return jsonify({
        'status': 'ok',
        'message': 'API root - available endpoints',
        'endpoints': [
            '/api/health',
            '/api/system/info',
            '/api/register/validate',
            '/api/register/start-capture',
            '/api/register/generate-encodings',
            '/api/attendance/start',
            '/api/train/encodings',
            '/api/students'
        ]
    })


@app.route('/api/register/validate', methods=['POST'])
def validate_registration():
    """Validate registration input"""
    try:
        data = request.json
        name = data.get('name', '').strip()
        roll_number = data.get('roll_number', '').strip()
        student_class = data.get('class', '').strip()

        if not name or not roll_number or not student_class:
            return jsonify({
                'status': 'error',
                'valid': False,
                'message': 'All fields are required'
            }), 400

        register = StudentRegistration()
        valid, message = register.validate_input(name, roll_number, student_class)

        return jsonify({
            'status': 'ok',
            'valid': valid,
            'message': message
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/api/register/start-capture', methods=['POST'])
def start_capture():
    """Start face capture for registration"""
    try:
        data = request.json
        name = data.get('name', '').strip()
        roll_number = data.get('roll_number', '').strip()
        student_class = data.get('class', '').strip()

        register = StudentRegistration()
        
        # Validate first
        valid, message = register.validate_input(name, roll_number, student_class)
        if not valid:
            return jsonify({
                'status': 'error',
                'message': message
            }), 400

        # Start capture
        success, message = register.capture_faces(name, roll_number, student_class)

        if success:
            return jsonify({
                'status': 'ok',
                'success': True,
                'message': message
            })
        else:
            return jsonify({
                'status': 'error',
                'success': False,
                'message': message
            }), 400

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/api/register/generate-encodings', methods=['POST'])
def generate_encodings():
    """Generate face encodings from captured images"""
    try:
        data = request.json
        name = data.get('name', '').strip()
        roll_number = data.get('roll_number', '').strip()
        student_class = data.get('class', '').strip()

        register = StudentRegistration()
        success, message = register.generate_encodings(name, roll_number, student_class)

        if success:
            return jsonify({
                'status': 'ok',
                'success': True,
                'message': message,
                'student': {
                    'name': name,
                    'roll_number': roll_number,
                    'class': student_class
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'success': False,
                'message': message
            }), 400

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/api/attendance/start', methods=['POST'])
def start_attendance():
    """Start attendance marking"""
    try:
        attendance = AttendanceMarker()
        attendance.run_attendance()

        return jsonify({
            'status': 'ok',
            'message': 'Attendance session completed',
            'marked_today': list(attendance.marked_today)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/api/train/encodings', methods=['POST'])
def train_encodings():
    """Train face encodings from dataset"""
    try:
        # Run training
        train_from_dataset()

        # Get updated statistics
        encodings_data = load_encodings()
        
        return jsonify({
            'status': 'ok',
            'message': 'Training completed successfully',
            'total_students': len(encodings_data['names']),
            'total_encodings': len(encodings_data['encodings'])
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500


@app.route('/api/students', methods=['GET'])
def get_students():
    """Get list of registered students"""
    try:
        encodings_data = load_encodings()
        
        students = []
        for i, name in enumerate(encodings_data['names']):
            students.append({
                'name': name,
                'roll_number': encodings_data['roll_numbers'][i] if i < len(encodings_data['roll_numbers']) else '',
                'class': encodings_data['classes'][i] if i < len(encodings_data['classes']) else ''
            })

        return jsonify({
            'status': 'ok',
            'students': students,
            'total': len(students)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 'error', 'message': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500


if __name__ == '__main__':
    print("Starting Smart Face Recognition Attendance System Backend API...")
    port = int(os.environ.get('PORT', '5000'))
    print(f"API running on http://localhost:{port}")
    print("\nAvailable endpoints:")
    print("  GET  /api/health")
    print("  GET  /api/system/info")
    print("  POST /api/register/validate")
    print("  POST /api/register/start-capture")
    print("  POST /api/register/generate-encodings")
    print("  POST /api/attendance/start")
    print("  POST /api/train/encodings")
    print("  GET  /api/students")
    
    app.run(debug=True, host='0.0.0.0', port=port)
