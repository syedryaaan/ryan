import React from "react";

// ==============================================================================
// NotFound — Beginner-Friendly 404 Error Page
// Displayed when the user visits any unrecognized URL route.
// ==============================================================================
function NotFound({ onNavigate }) {
  return (
    <div className="notfound-page-container">
      <div className="notfound-card">
        <div className="notfound-icon">🏢 404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-message">
          The campus page you are looking for does not exist or may have been relocated.
        </p>

        <div className="notfound-actions">
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => onNavigate && onNavigate("/")}
          >
            ← Back to Home
          </button>
          <button
            type="button"
            className="btn-secondary-action"
            onClick={() => onNavigate && onNavigate("/rooms")}
          >
            Explore Dorms
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
