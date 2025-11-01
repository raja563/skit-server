import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCamera, FaUserCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
const AttHome = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-danger text-center position-relative"
      style={{
        height: "100vh",
        background:
          "linear-gradient(rgba(30, 30, 30, 0.8), rgba(30, 30, 30, 0.8)), url('img/mahguImage.jpg') center/cover no-repeat",
      }}
    >
      {/* 🔷 Optional overlay (light black tint for smooth effect) */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 0,
        }}
      ></div>

      {/* 🔷 Content Container */}
      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* 🏫 University Logo */}
        <div className="mb-3">
          <img
            src="img/mahguLogo.png" // 🔁 Replace this with actual university logo if available
            alt="University Logo"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* 🔷 University Name */}
        <h1 className="fw-bold mb-2 display-6 text-uppercase ">
          Maharaja Agrasen Himalayan Garhwal University
        </h1>
        <h4 className="fw-bold text-warning mb-4">
          Pauri Garhwal, Uttarakhand
        </h4>

        {/* 🔶 App Title and Icon */}
        <div className="mb-2">
          <FaCamera className="fs-1 text-warning mb-3" />
          <h2 className="fw-semibold mb-2 text-light">
            Face Recognition Attendance System
          </h2>
          <p className="text-secondary fs-8 fw-bold small">
            AI-powered automatic attendance tracking for modern institutions
          </p>
        </div>

        {/* 🔸 Buttons */}
        <div className="d-flex justify-content-center gap-3 ">
        
         
            <Link  className="btn btn-outline-light btn-lg fw-semibold px-2 btn-warning btn-lg fw-semibold px-2 shadow-sm" to="/markAtt"> <FaUserCheck className="me-2" /> Mark Attendance</Link>

            <Link  className="btn btn-outline-light btn-lg fw-semibold px-4" to="/login">Dashboard</Link>
           
        </div>
      </div>

      {/* 🔹 Footer */}
      <footer
        className="position-absolute bottom-0 text-center w-100 py-2"
        style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1,
        }}
      >
        <small className="text-light">
          © {new Date().getFullYear()} MAHGU | Developed by Department of
          Computer Applications
        </small>
      </footer>
    </div>
  );
};

export default AttHome;
