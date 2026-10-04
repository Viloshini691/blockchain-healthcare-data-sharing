// client/src/components/Signup.js
import React, { useState } from "react";
import "../App.css"; // For .login-page and .login-card styles

export default function Signup({ onGoLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // patient or doctor

  const handleSignup = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("users") || "[]");

    const found = existing.find((u) => u.email === email);
    if (found) {
      alert("This email is already registered. Please log in.");
      return;
    }

    const newUser = { fullName, email, password, role };
    const updated = [...existing, newUser];
    localStorage.setItem("users", JSON.stringify(updated));

    alert("Sign up successful! You can now log in.");
    onGoLogin();
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="card shadow p-4 login-card">
        <h4 className="mb-3 text-center" style={{ color: "#43c5a3ff" }}>
          Create HealthChain Account
        </h4>

        <p className="text-muted text-center mb-3">
          Sign up to securely manage your medical data.
        </p>

        <form onSubmit={handleSignup}>
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. John Smith"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "#0f766e",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Already registered?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              style={{ color: "#0369a1", fontWeight: "bold" }}
              onClick={onGoLogin}
            >
              Login
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}
