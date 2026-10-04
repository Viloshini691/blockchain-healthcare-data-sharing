// ---- All imports must come first ----
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

// ---- Then do non-import statements ----
window.Buffer = window.Buffer || Buffer;

// ---- Render the app ----
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
