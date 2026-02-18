import { useEffect, useRef, useState } from "react"
import axios from "axios"

const API = "http://127.0.0.1:5000"

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [name, setName] = useState("")
  const [roll, setRoll] = useState("")
  const [logs, setLogs] = useState([])

  const log = (msg) => {
    setLogs(prev => [new Date().toLocaleTimeString() + " - " + msg, ...prev])
  }

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream
      })
      .catch(err => log("Camera Error: " + err.message))
  }, [])

  const captureImage = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/jpeg")
  }

  const captureStudent = async () => {
    if (!name || !roll) {
      log("Name and Roll required")
      return
    }

    const image = captureImage()

    try {
      const res = await axios.post(`${API}/api/register/capture-frame`, {
        name,
        roll_number: roll,
        image
      })
      log(JSON.stringify(res.data))
    } catch (err) {
      log("Error: " + err.message)
    }
  }

  const trainEncodings = async () => {
    try {
      const res = await axios.post(`${API}/api/train/encodings`)
      log(JSON.stringify(res.data))
    } catch (err) {
      log("Error: " + err.message)
    }
  }

  const takeAttendance = async () => {
    const image = captureImage()

    try {
      const res = await axios.post(`${API}/api/attendance/recognize`, {
        image
      })
      log(JSON.stringify(res.data))
    } catch (err) {
      log("Error: " + err.message)
    }
  }

  return (
    <div className="container">
      <h1>Smart Face Recognition Attendance</h1>

      <div className="video-section">
        <video ref={videoRef} autoPlay width="640" height="480" />
        <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }} />
      </div>

      <div className="controls">
        <input
          placeholder="Student Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Roll Number"
          value={roll}
          onChange={e => setRoll(e.target.value)}
        />

        <div className="buttons">
          <button onClick={captureStudent}>Capture Student</button>
          <button onClick={trainEncodings}>Train Encodings</button>
          <button onClick={takeAttendance}>Take Attendance</button>
        </div>
      </div>

      <div className="log-box">
        {logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  )
}
