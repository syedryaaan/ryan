import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Editable Profile Form State
  const [course, setCourse] = useState("");
  const [phone, setPhone] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [address, setAddress] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Fetch logged in student profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setProfileError("");
      const response = await fetch(`${API_BASE_URL}/users/profile`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load profile.");
      }

      const u = data.user || {};
      setProfile(u);
      setCourse(u.course || "B.Tech Computer Science & Engineering");
      setPhone(u.phone || "");
      setGuardianName(u.guardianName || "");
      setGuardianPhone(u.guardianPhone || "");
      setAddress(u.address || "");
    } catch (err) {
      setProfileError(err.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Profile Update Submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileError("");
      setProfileSuccess("");

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          phone,
          guardianName,
          guardianPhone,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfileSuccess("Profile updated successfully.");
      if (data.user) {
        setProfile(data.user);
      }
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Update Submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Frontend password validation
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);

      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="portal-container">
        <p className="loading-state">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="portal-container">
      {/* Profile Page Header */}
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Student Academic Information, Emergency Contacts & Security Credentials</p>
      </div>

      {/* Profile Global Alerts */}
      {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
      {profileError && <div className="alert alert-error">{profileError}</div>}

      {/* Card 1 — Academic Identity */}
      <section className="profile-card">
        <h2 className="card-section-title">Academic Identity</h2>
        <p className="section-note">
          Official enrollment records registered with the University Registrar and Chief Warden Office.
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input read-only-input"
              value={profile?.name || "Chandra Tripathi"}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">University Email</label>
            <input
              type="email"
              className="form-input read-only-input"
              value={profile?.email || "student@example.com"}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Student Roll Number</label>
            <input
              type="text"
              className="form-input read-only-input"
              value={profile?.studentId || "STU-2026-1042"}
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label">Enrolled Degree Course</label>
            <input
              type="text"
              className="form-input"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. B.Tech Computer Science & Engineering"
            />
          </div>
        </div>
      </section>

      {/* Card 2 — Emergency Contact & Residence */}
      <section className="profile-card">
        <h2 className="card-section-title">Emergency Contact & Residence</h2>
        <p className="section-note">
          Hostel wardens and campus emergency teams reach out to these contacts for curfew notifications and medical alerts.
        </p>

        <form onSubmit={handleUpdateProfile}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Mobile Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian / Parent Name</label>
              <input
                type="text"
                className="form-input"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Emergency Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="e.g. 9876501234"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Permanent Home Address</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 142 University Green Avenue, New Delhi"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={savingProfile}
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>

      {/* Card 3 — Security & Credentials */}
      <section className="profile-card">
        <h2 className="card-section-title">Security & Credentials</h2>
        <p className="section-note">
          Update your campus resident portal password. Minimum 6 characters required.
        </p>

        {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
        {passwordError && <div className="alert alert-error">{passwordError}</div>}

        <form onSubmit={handleChangePassword}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password (default: password123)"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={savingPassword}
          >
            {savingPassword ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Profile;
