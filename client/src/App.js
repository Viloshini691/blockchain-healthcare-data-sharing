// client/src/App.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainApp from "./MainApp";

function App() {
  // "home" | "login" | "signup" | "app"
  const [view, setView] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  // Try to restore session when the app loads
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setCurrentUser(user);
        setView("app");
      } catch (e) {
        console.error("Failed to parse saved user:", e);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setView("app");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("home");
  };

  if (view === "home") {
    return (
      <Home
        onGoLogin={() => setView("login")}
        onGoSignup={() => setView("signup")}
      />
    );
  }

  if (view === "signup") {
    return <Signup onGoLogin={() => setView("login")} />;
  }

  if (view === "login") {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onGoSignup={() => setView("signup")}
      />
    );
  }

  // view === "app"
  return <MainApp currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
