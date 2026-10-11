import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";

// ==============================================================================
// AdminSettings — Beginner-Friendly Campus Operating Policies Component
// Allows Chief Warden to view and update curfew hours, mess tariffs, and contacts.
// ==============================================================================
function AdminSettings() {
  // 1. Component State
  const [settings, setSettings] = useState({
    curfewHours: "10:00 PM",
    messMonthlyRate: 4500,
    cautionDeposit: 5000,
    emergencyDeskContact: "+91 98765 43210",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 2. Fetch current settings from backend API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: { "x-admin-role": "warden" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load hostel settings");

      if (data.settings) {
        setSettings({
          curfewHours: data.settings.curfewHours || "10:00 PM",
          messMonthlyRate: data.settings.messMonthlyRate || 4500,
          cautionDeposit: data.settings.cautionDeposit || 5000,
          emergencyDeskContact: data.settings.emergencyDeskContact || "+91 98765 43210",
        });
      }
    } catch (err) {
      setError(err.message || "Unable to reach settings service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 3. Save updated settings to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": "warden",
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update hostel settings");

      setSuccessMsg("Chief Warden operating settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading hostel operational policies...</div>;
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Curfew & Campus Operating Policies</h1>
          <p>Configure gate curfew times, mandatory caution deposits, mess tariffs, and SOS emergency desks</p>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="settings-card">
        <form onSubmit={handleSubmit} className="settings-form">
          {/* Field 1: Curfew Hours */}
          <div className="settings-field-group">
            <div className="settings-field-info">
              <label htmlFor="curfew-hours">Hostel Gate Curfew Hours</label>
              <p>Campus turnstiles and security biometric gates lock automatically at this time.</p>
            </div>
            <div className="settings-field-input">
              <input
                id="curfew-hours"
                type="text"
                required
                value={settings.curfewHours}
                onChange={(e) => setSettings({ ...settings, curfewHours: e.target.value })}
                className="form-input"
                placeholder="10:00 PM"
              />
            </div>
          </div>

          {/* Field 2: Mess Rate */}
          <div className="settings-field-group">
            <div className="settings-field-info">
              <label htmlFor="mess-monthly-rate">Standard Mess Monthly Rate (₹)</label>
              <p>Base 4-meal daily catering charge billed per resident per calendar month.</p>
            </div>
            <div className="settings-field-input">
              <input
                id="mess-monthly-rate"
                type="number"
                min="1000"
                step="100"
                required
                value={settings.messMonthlyRate}
                onChange={(e) =>
                  setSettings({ ...settings, messMonthlyRate: Number(e.target.value) })
                }
                className="form-input"
              />
            </div>
          </div>

          {/* Field 3: Caution Deposit */}
          <div className="settings-field-group">
            <div className="settings-field-info">
              <label htmlFor="caution-deposit">Institutional Caution Deposit (₹)</label>
              <p>Refundable security deposit retained by the bursar for dormitory damage protection.</p>
            </div>
            <div className="settings-field-input">
              <input
                id="caution-deposit"
                type="number"
                min="0"
                step="500"
                required
                value={settings.cautionDeposit}
                onChange={(e) =>
                  setSettings({ ...settings, cautionDeposit: Number(e.target.value) })
                }
                className="form-input"
              />
            </div>
          </div>

          {/* Field 4: Emergency Hotline */}
          <div className="settings-field-group">
            <div className="settings-field-info">
              <label htmlFor="emergency-contact">Warden Emergency Desk Contact</label>
              <p>24x7 control room hotline published on student portal and emergency gate boards.</p>
            </div>
            <div className="settings-field-input">
              <input
                id="emergency-contact"
                type="text"
                required
                value={settings.emergencyDeskContact}
                onChange={(e) =>
                  setSettings({ ...settings, emergencyDeskContact: e.target.value })
                }
                className="form-input"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="settings-actions">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Saving Changes..." : "Save Operating Policies"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSettings;
