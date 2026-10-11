import React, { useState } from "react";

// ==============================================================================
// Navbar — Beginner-Friendly Responsive Campus Navigation Bar
// Supports:
// 1. Logo with gradient text
// 2. Navigation links to Home, Hostel Dorms, and Blocks A, B, C
// 3. User authentication state (Logged In / Logged Out)
// 4. Role-based links (Chief Warden Dashboard for admin/warden)
// 5. Mobile hamburger menu toggle
// ==============================================================================
function Navbar({ currentPath, onNavigate, user, onLogin, onLogout }) {
  // Simple state to open/close mobile hamburger menu
  const [menuOpen, setMenuOpen] = useState(false);
  // Simple state to open/close user profile dropdown
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Helper to handle link click and close mobile menu
  const handleLinkClick = (path) => {
    onNavigate(path);
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="smart-navbar">
      <div className="navbar-container">
        {/* 1. Brand Logo */}
        <div className="navbar-brand" onClick={() => handleLinkClick("/")}>
          <span className="brand-icon">🏢</span>
          <span className="brand-gradient-text">XSHostel</span>
          <span className="brand-tagline">Smart Campus</span>
        </div>

        {/* 2. Desktop Navigation Links */}
        <div className="navbar-links desktop-only">
          <button
            type="button"
            className={`nav-link-btn ${currentPath === "/" ? "active" : ""}`}
            onClick={() => handleLinkClick("/")}
          >
            Home
          </button>

          <button
            type="button"
            className={`nav-link-btn ${currentPath.startsWith("/rooms") && !currentPath.includes("block=") ? "active" : ""}`}
            onClick={() => handleLinkClick("/rooms")}
          >
            Hostel Dorms
          </button>

          <button
            type="button"
            className={`nav-link-btn ${currentPath.includes("Block+A") ? "active" : ""}`}
            onClick={() => handleLinkClick("/rooms?block=Block+A+(Boys)")}
          >
            Block A
          </button>

          <button
            type="button"
            className={`nav-link-btn ${currentPath.includes("Block+B") ? "active" : ""}`}
            onClick={() => handleLinkClick("/rooms?block=Block+B+(Girls)")}
          >
            Block B
          </button>

          <button
            type="button"
            className={`nav-link-btn ${currentPath.includes("Block+C") ? "active" : ""}`}
            onClick={() => handleLinkClick("/rooms?block=Block+C+(Scholars)")}
          >
            Block C
          </button>
        </div>

        {/* 3. Authentication Action Area */}
        <div className="navbar-auth desktop-only">
          {user ? (
            // Logged-in state
            <div className="user-profile-menu">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <span className="user-avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <div className="user-name-role">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role-badge">{user.role}</span>
                </div>
                <span className="dropdown-arrow">▾</span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="user-dropdown-card">
                  <button
                    type="button"
                    className="dropdown-item-btn"
                    onClick={() => handleLinkClick("/my-bookings")}
                  >
                    📋 My Allocations
                  </button>

                  <button
                    type="button"
                    className="dropdown-item-btn"
                    onClick={() => handleLinkClick("/profile")}
                  >
                    👤 Student Profile
                  </button>

                  {(user.role === "admin" || user.role === "warden") && (
                    <button
                      type="button"
                      className="dropdown-item-btn highlight-admin"
                      onClick={() => handleLinkClick("/admin")}
                    >
                      🛡️ Chief Warden Dashboard
                    </button>
                  )}

                  <hr className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-item-btn logout-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Logged-out state
            <div className="auth-buttons-row">
              <button
                type="button"
                className="btn-signin-text"
                onClick={() => handleLinkClick("/login")}
              >
                Sign In
              </button>
              <button
                type="button"
                className="btn-register-solid"
                onClick={() => handleLinkClick("/register")}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* 4. Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle mobile menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 5. Mobile Slide-Down Menu */}
      {menuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-links">
            <button
              type="button"
              className={`mobile-nav-item ${currentPath === "/" ? "active" : ""}`}
              onClick={() => handleLinkClick("/")}
            >
              🏠 Home
            </button>

            <button
              type="button"
              className={`mobile-nav-item ${currentPath === "/rooms" ? "active" : ""}`}
              onClick={() => handleLinkClick("/rooms")}
            >
              🛏️ Hostel Dorms
            </button>

            <button
              type="button"
              className="mobile-nav-item"
              onClick={() => handleLinkClick("/rooms?block=Block+A+(Boys)")}
            >
              🏢 Block A (Boys)
            </button>

            <button
              type="button"
              className="mobile-nav-item"
              onClick={() => handleLinkClick("/rooms?block=Block+B+(Girls)")}
            >
              🏢 Block B (Girls)
            </button>

            <button
              type="button"
              className="mobile-nav-item"
              onClick={() => handleLinkClick("/rooms?block=Block+C+(Scholars)")}
            >
              🏢 Block C (Scholars)
            </button>

            <hr className="mobile-menu-divider" />

            {user ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <strong>{user.name}</strong> ({user.role})
                </div>

                <button
                  type="button"
                  className="mobile-nav-item"
                  onClick={() => handleLinkClick("/my-bookings")}
                >
                  📋 My Allocations
                </button>

                <button
                  type="button"
                  className="mobile-nav-item"
                  onClick={() => handleLinkClick("/profile")}
                >
                  👤 Student Profile
                </button>

                {(user.role === "admin" || user.role === "warden") && (
                  <button
                    type="button"
                    className="mobile-nav-item highlight-admin"
                    onClick={() => handleLinkClick("/admin")}
                  >
                    🛡️ Chief Warden Dashboard
                  </button>
                )}

                <button
                  type="button"
                  className="mobile-nav-item logout-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <button
                  type="button"
                  className="btn-signin-text"
                  onClick={() => handleLinkClick("/login")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="btn-register-solid"
                  onClick={() => handleLinkClick("/register")}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
