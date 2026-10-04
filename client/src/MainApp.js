// client/src/MainApp.js
import React from "react";
import UploadRecord from "./components/UploadRecord";
import Authorize from "./components/Authorize";
import ViewRecord from "./components/ViewRecord";
import DoctorKey from "./components/DoctorKey"; // If you don't have it, remove this import.

export default function MainApp({ currentUser, onLogout }) {
  const isPatient = currentUser?.role === "patient";
  const isDoctor = currentUser?.role === "doctor";

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Top bar */}
      <nav
        className="navbar navbar-expand-lg"
        style={{ background: "#0f766e", color: "#fff" }}
      >
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h5 text-white">
            🏥 HealthChain – Secure Data Sharing
          </span>

          <div className="d-flex align-items-center">
            <span className="me-3 small">
              Logged in as:{" "}
              <strong>{currentUser.fullName}</strong> ({currentUser.role})
            </span>

            <button className="btn btn-sm btn-outline-light" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container py-4">
        <div className="row g-4">

          {/* ==================== PATIENT COLUMN ==================== */}
          {isPatient && (
            <div className="col-md-6">
              <h5 className="mb-3" style={{ color: "#0f766e" }}>
                👩‍⚕️ Patient Portal
              </h5>

              {/* Patient can upload */}
              <UploadRecord />

              {/* Patient can authorize doctors */}
              <Authorize />
            </div>
          )}

          {/* ==================== DOCTOR COLUMN ==================== */}
          {isDoctor && (
            <div className="col-md-6">
              <h5 className="mb-3" style={{ color: "#0f766e" }}>
                🩺 Doctor Portal
              </h5>

              {/* Only doctor sees their public key generator */}
              <DoctorKey />

              {/* Doctor can decrypt */}
              <ViewRecord />
            </div>
          )}

          {/* If someone logs in with unknown role */}
          {!isPatient && !isDoctor && (
            <div className="col-12 text-center mt-5">
              <h4 className="text-danger">
                Invalid role. Please log in again.
              </h4>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
