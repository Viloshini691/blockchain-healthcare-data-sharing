// client/src/components/Login.js
import React, { useState } from "react";
import "../App.css"; // for .login-page and .login-card styles

export default function Login({ onLoginSuccess, onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("users") || "[]");

    const found = existing.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(found));
    onLoginSuccess(found);
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: "url('/images/login-bg.jpg')", // from public/images
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="card shadow p-4 login-card">
        <h4 className="mb-3 text-center" style={{ color: "#03543f" }}>
          Healthcare DApp Login
        </h4>

        <p className="text-muted text-center mb-3">
          Login to access the secure medical records system.
        </p>

        <form onSubmit={handleLogin}>
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

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
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
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              style={{ color: "#0369a1", fontWeight: "bold" }}
              onClick={onGoSignup}
            >
              Sign Up
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}
