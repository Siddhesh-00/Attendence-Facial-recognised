# API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
No authentication required (open API)

## Response Format
All responses are JSON format

---

## Endpoints

### 1. Health Check
```
GET /health

Response: 200 OK
{
  "status": "ok",
  "message": "System is running"
}
```

### 2. System Information
```
GET /system/info

Response: 200 OK
{
  "status": "ok",
  "total_students": 5,
  "dataset_path": "dataset/",
  "attendance_file": "attendance/attendance.xlsx",
  "models_path": "models/"
}
```

### 3. Student Registration - Validate
```
POST /register/validate

Body:
{
  "name": "John Doe",
  "roll_number": "101",
  "class": "10-A"
}

Response: 200 OK
{
  "valid": true,
  "message": "All fields valid"
}

Error: 400 Bad Request
{
  "valid": false,
  "message": "Roll number already exists"
}
```

### 4. Student Registration - Start Capture
```
POST /register/start-capture

Body:
{
  "name": "John Doe",
  "roll_number": "101",
  "class": "10-A"
}

Response: 200 OK
{
  "success": true,
  "message": "Face capture completed! 25 images saved"
}

Error: 500 Internal Server Error
{
  "success": false,
  "message": "Camera error"
}
```

### 5. Student Registration - Generate Encodings
```
POST /register/generate-encodings

Body:
{
  "name": "John Doe",
  "roll_number": "101",
  "class": "10-A"
}

Response: 200 OK
{
  "success": true,
  "message": "Encodings generated successfully",
  "encodings_count": 25
}

Error: 500 Internal Server Error
{
  "success": false,
  "message": "Encoding generation failed"
}
```

### 6. Start Attendance
```
POST /attendance/start

Body: {} (empty)

Response: 200 OK
{
  "success": true,
  "marked_today": ["101", "102", "103"],
  "total_marked": 3
}

Error: 500 Internal Server Error
{
  "success": false,
  "message": "Attendance session failed"
}
```

### 7. Train Encodings
```
POST /train/encodings

Body: {} (empty)

Response: 200 OK
{
  "success": true,
  "total_students": 5,
  "total_encodings": 125,
  "processing_time": 45.2
}

Error: 500 Internal Server Error
{
  "success": false,
  "message": "Training failed"
}
```

### 8. Get All Students
```
GET /students

Response: 200 OK
{
  "status": "ok",
  "total": 5,
  "students": [
    {
      "name": "John Doe",
      "roll_number": "101",
      "class": "10-A"
    },
    {
      "name": "Jane Smith",
      "roll_number": "102",
      "class": "10-A"
    }
  ]
}
```

---

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | Operation completed |
| 400 | Bad Request | Invalid input, check parameters |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Backend error, check logs |

---

## Example cURL Commands

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get System Info
```bash
curl http://localhost:5000/api/system/info
```

### Validate Registration
```bash
curl -X POST http://localhost:5000/api/register/validate \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","roll_number":"101","class":"10-A"}'
```

### Start Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/start \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Get All Students
```bash
curl http://localhost:5000/api/students
```

---

## Response Zeit (Response Times)

- Health check: ~10ms
- System info: ~20ms
- Validation: ~30ms
- Face detection: ~100ms
- Attendance start: 30-60 seconds (includes face recognition)
- Training: 1-5 minutes (depends on student count)

---

## Data Validation Rules

### Name
- Required, non-empty string
- Length: 3-100 characters
- Alphanumeric + spaces allowed

### Roll Number
- Required, must be unique
- Format: Any alphanumeric string
- Length: 1-50 characters

### Class
- Required, non-empty string
- Format: Any alphanumeric string (e.g., "10-A", "Class 10")
- Length: 1-50 characters

---

## Notes

1. **CORS Enabled** - Frontend can make cross-origin requests
2. **No Rate Limiting** - Unlimited API calls
3. **File Storage** - Data stored locally in project directories
4. **Stateless API** - Each request is independent
5. **Camera Access** - Required for registration and attendance

---

## Integration Example (JavaScript/React)

```javascript
const API_URL = 'http://localhost:5000/api';

// Health check
const checkHealth = async () => {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
};

// Get system info
const getSystemInfo = async () => {
  const response = await fetch(`${API_URL}/system/info`);
  return response.json();
};

// Register student - validate
const validateStudent = async (name, rollNumber, studentClass) => {
  const response = await fetch(`${API_URL}/register/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      roll_number: rollNumber,
      class: studentClass
    })
  });
  return response.json();
};

// Get all students
const getStudents = async () => {
  const response = await fetch(`${API_URL}/students`);
  return response.json();
};
```

---

## Rate Limiting
Currently **not implemented**. For production deployment with high traffic, consider implementing:
- Requests per minute limits
- IP-based throttling
- API key authentication

---

## Version
API Version: 1.0  
Last Updated: February 18, 2026

---

For more details, see `PRODUCTION_SETUP.md`
