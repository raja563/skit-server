import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const markAttendanceURL = `${API}/api/mark-attendance/`;
const getStudentByPkURL = `${API}/api/student/`;
const getStudentPkURL = `${API}/api/get-student-pk/`;
const attendanceRecordURL = `${API}/api/attendance-records/`;

export default function FaceAttendance() {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 1;
    synth.speak(utter);
  };

  const captureAndMarkAttendance = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setMessage("⚠️ Camera not ready or permission denied.");
      return;
    }

    setLoading(true);
    setMessage("🔍 Detecting and matching face...");

    try {
      // STEP 1: Send face image to backend for recognition
      const response = await axios.post(markAttendanceURL, { image: imageSrc });

      if (response.data.status === "success" && response.data.student_id) {
        const studentCode = response.data.student_id; // backend returns student_id
        // --- FIX: Use a simpler, non-redundant message here ---
        setMessage("✅ Face recognized! Processing attendance...");
        // STEP 2: Fetch student primary key
        const lookupRes = await axios.get(`${getStudentPkURL}?student_id=${studentCode}`);
        const studentPk = lookupRes.data.pk;

        // STEP 3: Fetch student details
        const studentRes = await axios.get(`${getStudentByPkURL}${studentPk}/`);
        const studentData = studentRes.data;
        setStudent(studentData);

       
        // Add this helper function to your React file (e.g., FaceAttendance.jsx)
const formatTime = (timeString) => {
    if (!timeString) return "—"; // Return dash for null/empty time_out
    
    // Create a dummy Date object. The date part doesn't matter, only the time.
    // The timeString is assumed to be in "HH:MM:SS.mmmmmm" format (24-hour).
    // Note: We use the local time from the string, not the browser's current time.
    try {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parts[1];
        
        let displayHours = hours % 12 || 12; // Convert 0 to 12
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Result format: HH:MM AM/PM
        return `${displayHours}:${minutes} ${ampm}`;

    } catch (e) {
        console.error("Error formatting time:", e);
        return timeString; // Return original if formatting fails
    }
};

        const now = new Date();
        // STEP 4: Prepare attendance data according to AttendanceRecordSerializer

        const attendanceData = {
          student_id: studentData.student_id,  // ✅ expected field
          status: "Present",
          verified_by_face: true,
        };




        // Save attendance record
        console.log("🧾 Attendance payload:", attendanceData);
          // await axios.post(attendanceRecordURL, attendanceData);


        // --- FIX: Use the message returned from the backend ---
        const finalMsg = response.data.message; 
        setMessage(finalMsg);
        speak(finalMsg); // Speak the accurate message (Time In, Time Out, or Thanks)
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
        }, 1200);
      } else {
        // ❌ Face not recognized
        setStudent(null);
        setShowModal(false);
        const failMsg = response.data.message || "Face not recognized. Please register first.";
        setMessage("⚠️ " + failMsg);
        speak("Face not recognized. Please try again.");
      }
    } catch (error) {
      console.error("Frontend error:", error.response?.data || error.message);
      setMessage(
        "❌ Error connecting to server or processing face data. Please check backend response."
      );
      setStudent(null);
      setShowModal(false);
      speak("Error connecting to server or processing face data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 text-center">
      <h3 className="fw-bold mb-3">🎓 Automatic Face Attendance System</h3>

      <div className="d-flex flex-column align-items-center">
        <div
          className="border rounded shadow-sm overflow-hidden"
          style={{ maxWidth: "90%", width: "480px" }}
        >
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="w-100"
            style={{ aspectRatio: "4 / 3", objectFit: "cover" }}
          />
        </div>

        <div className="mt-3">
          <button
            className="btn btn-primary px-4 py-2 fw-semibold"
            onClick={captureAndMarkAttendance}
            disabled={loading}
          >
            {loading ? "Processing..." : "📸 Scan Face & Mark Attendance"}
          </button>
        </div>

        <p className="mt-3 fs-5">{message}</p>
      </div>

      {showModal && student && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">✅ Attendance Marked Successfully</h5>
              </div>
              <div className="modal-body text-center">
                {student.image && (
                  <img
                    src={`${API}${student.image}`}
                    alt="student"
                    className="rounded mb-3"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                )}
                <h5 className="fw-bold mb-1">{student.name}</h5>
                <p className="mb-1">
                  <strong>ID:</strong> {student.student_id}
                </p>
                <p className="mb-1">
                  <strong>Course:</strong> {student.course}
                </p>
                <p className="mb-1">
                  <strong>Session:</strong> {student.session}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 576px) {
          h3 { font-size: 1.2rem; }
          button { font-size: 0.9rem; }
          .modal-dialog { margin: 1rem; }
        }
      `}</style>
    </div>
  );
}
