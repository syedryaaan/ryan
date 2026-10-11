import React from "react";

// ==============================================================================
// Footer — Beginner-Friendly Campus Footer Component
// Organizes campus contact, quick navigation, hostel wings, and emergency hotline.
// ==============================================================================
function Footer({ onNavigate }) {
  return (
    <footer className="smart-footer">
      <div className="footer-container">
        {/* Column 1 — Brand & Overview */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-icon">🏢</span>
            <span className="brand-gradient-text">XSHostel</span>
          </div>
          <p className="footer-desc">
            Smart Campus Living & Modern Hostel Accommodation. Empowering university students
            with secure, high-tech residential living spaces.
          </p>
          <span className="campus-badge">🏛️ University Residence Division</span>
        </div>

        {/* Column 2 — Hostel Blocks */}
        <div className="footer-col">
          <h4>Hostel Blocks</h4>
          <ul className="footer-links">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => onNavigate && onNavigate("/rooms?block=Block+A+(Boys)")}
              >
                🏢 Block A (Boys Wing)
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => onNavigate && onNavigate("/rooms?block=Block+B+(Girls)")}
              >
                🏢 Block B (Girls Wing)
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => onNavigate && onNavigate("/rooms?block=Block+C+(Scholars)")}
              >
                🏢 Block C (Scholars Wing)
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3 — Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => onNavigate && onNavigate("/")}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => onNavigate && onNavigate("/rooms")}
              >
                Hostel Dorms
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => onNavigate && onNavigate("/login")}
              >
                Resident Login
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => onNavigate && onNavigate("/profile")}
              >
                Campus Rules & FAQ
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4 — Emergency & Assistance */}
        <div className="footer-col emergency-col">
          <h4>Emergency Desk</h4>
          <div className="emergency-card">
            <div className="emergency-item">
              <span className="em-title">Chief Warden Desk:</span>
              <strong className="em-hotline">📞 +91 98765 43210</strong>
            </div>
            <div className="emergency-item">
              <span className="em-title">Campus Security:</span>
              <span>24x7 Main Gate Post</span>
            </div>
            <div className="emergency-item">
              <span className="em-title">Medical Desk:</span>
              <span>Emergency Ambulance On-Call</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom-bar">
        <p>© 2026 XSHostel. All Rights Reserved. • Campus Residence Management System</p>
      </div>
    </footer>
  );
}

export default Footer;
