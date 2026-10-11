import React, { useState } from "react";

// ==============================================================================
// Auth — Beginner-Friendly Sign In & Registration Page
// Allows residents and staff to sign in or test different roles.
// ==============================================================================
function Auth({ mode = "login", onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    // Call simple onLogin handler
    onLogin({
      name: name || (selectedRole === "admin" ? "Dr. Alok Verma" : "Chandra Tripathi"),
      email: email,
      role: selectedRole,
      studentId: selectedRole === "admin" ? "WRD-2026-001" : "STU-2026-1042",
    });

    onNavigate("/");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-brand-icon">🏢</span>
          <h2>{mode === "register" ? "Create Student Account" : "Sign In to XSHostel"}</h2>
          <p>
            {mode === "register"
              ? "Register for university accommodation and student mess plans."
              : "Access your room allocations, profile, and hostel services."}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="e.g. Chandra Tripathi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">University Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="e.g. student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-role">Account Role</label>
            <select
              id="auth-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="form-select"
            >
              <option value="student">Student Resident</option>
              <option value="admin">Chief Warden (Admin)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary-action auth-submit-btn">
            {mode === "register" ? "Complete Registration →" : "Sign In →"}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {mode === "login" ? (
            <p>
              Don't have an account yet?{" "}
              <button
                type="button"
                className="auth-toggle-link"
                onClick={() => onNavigate("/register")}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                className="auth-toggle-link"
                onClick={() => onNavigate("/login")}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
