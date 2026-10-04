// client/src/components/Home.js
import React from "react";
import "./Home.css";

export default function Home({ onGoLogin, onGoSignup }) {
  // ⬇⬇ Add this Background Style Block ⬇⬇
  const homeBgStyle = {
    backgroundImage:
      'linear-gradient(135deg, rgba(15,23,42,0.55), rgba(15,23,42,0.15)), url("/images/health-bg.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };
  // ⬆⬆ END: Background Style Block ⬆⬆

  return (
    <div className="hc-home-root" style={homeBgStyle}>
      {/* Top navigation bar */}
      <header className="hc-navbar">
        <div className="hc-logo">
          <span className="hc-logo-icon">🩺</span>
          <span className="hc-logo-text">HealthChain</span>
        </div>

        <div className="hc-auth-buttons">
          <button className="hc-btn-login" onClick={onGoLogin}>
            LOGIN
          </button>
          <button className="hc-btn-signup" onClick={onGoSignup}>
            SIGN UP
          </button>
        </div>
      </header>

      {/* Hero section */}
      <main className="hc-hero" id="home">
        <div className="hc-hero-left">
          <p className="hc-eyebrow">Blockchain • Healthcare • Privacy</p>
          <h1 className="hc-title">Secure Medical Data Sharing</h1>
          <h2 className="hc-subtitle">
                           HealthChain helps hospitals and patients share records safely
                           using blockchain and IPFS.
          </h2>

          <div className="hc-highlights" id="features">
            <ul>
              <li>
                <span className="hc-bullet">✔</span>
                Patients encrypt and upload medical reports from anywhere.
              </li>
              <li>
                <span className="hc-bullet">✔</span>
                Doctors can view authorized records with a single click.
              </li>
              <li>
                <span className="hc-bullet">✔</span>
                Records are stored on IPFS; hashes anchored on Ethereum.
              </li>
              <li>
                <span className="hc-bullet">✔</span>
                Access is controlled by the patient using smart contracts.
              </li>
              <li>
                <span className="hc-bullet">✔</span>
                Designed for hospitals, clinics, and telemedicine platforms.
              </li>
            </ul>
          </div>
        </div>

        {/* Right-hand illustration / card */}
        <div className="hc-hero-right">
          <div className="hc-hero-card">
            <div className="hc-hero-icon">🏥</div>
            <h3 className="hc-hero-card-title">Trusted Healthcare Records</h3>
            <p className="hc-hero-card-text">
              HealthChain keeps each patient’s history tamper-evident and
              traceable, so doctors always know they are looking at the
              correct version of the record.
            </p>

            <div className="hc-hero-stats">
              <div className="hc-stat">
                <span className="hc-stat-number">256-bit</span>
                <span className="hc-stat-label">Encryption</span>
              </div>
              <div className="hc-stat">
                <span className="hc-stat-number">IPFS</span>
                <span className="hc-stat-label">Off-chain Storage</span>
              </div>
              <div className="hc-stat">
                <span className="hc-stat-number">On-chain</span>
                <span className="hc-stat-label">Audit Trail</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer anchors */}
      <section className="hc-footer-sections">
        <div id="about" className="hc-footer-box">
          <h4>About HealthChain</h4>
          <p>
            This prototype DApp is developed as a Final Year Project to explore
            blockchain-based secure data sharing for healthcare environments.
          </p>
        </div>
        <div id="contact" className="hc-footer-box">
          <h4>Contact</h4>
          <p>0142351210 (Admin)</p>
        </div>
      </section>
    </div>
  );
}
