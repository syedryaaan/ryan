import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";

// ==============================================================================
// AdminBookings — Beginner-Friendly Allocations Ledger Component
// Displays room allotments and lets the Chief Warden update booking status.
// ==============================================================================
function AdminBookings() {
  // 1. Component State
  const [bookings, setBookings] = useState([]);         // List of allocations
  const [loading, setLoading] = useState(true);         // Loading indicator
  const [error, setError] = useState("");               // Error banner
  const [successMsg, setSuccessMsg] = useState("");     // Success feedback
  const [filterStatus, setFilterStatus] = useState("All"); // Active filter tab
  const [updatingId, setUpdatingId] = useState(null);   // ID currently being updated

  // 2. Fetch allocations from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      let url = `${API_BASE_URL}/admin/bookings`;
      if (filterStatus !== "All") {
        url += `?status=${filterStatus}`;
      }

      const res = await fetch(url, {
        headers: { "x-admin-role": "warden" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load allocations ledger");

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Failed to connect to allocation service");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when the selected filter pill changes
  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  // 3. Update an allocation status (confirmed, checked_in, vacated, cancelled)
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const res = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-role": "warden",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update allocation status");

      setSuccessMsg(`Allocation status updated to "${newStatus.replace('_', ' ').toUpperCase()}"!`);
      // Refresh UI immediately
      fetchBookings();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Allocations Ledger</h1>
          <p>Official registry of room allotments, check-in statuses, and student mess configurations</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={fetchBookings}>
          🔄 Refresh Ledger
        </button>
      </div>

      {/* Notifications */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter Tabs */}
      <div className="filter-pill-group">
        {["All", "confirmed", "checked_in", "vacated", "cancelled"].map((statusOption) => (
          <button
            key={statusOption}
            type="button"
            className={`filter-pill-btn ${filterStatus === statusOption ? "active" : ""}`}
            onClick={() => setFilterStatus(statusOption)}
          >
            {statusOption === "All" ? "All Allotments" : statusOption.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="admin-loading">Loading allocations registry...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">📋</span>
          <h3>No Allocations Recorded</h3>
          <p>No room allotments match the selected filter category.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Resident Student</th>
                <th>Roll Number</th>
                <th>Room & Block</th>
                <th>Semester</th>
                <th>Mess Plan</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th>Manage Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const isUpdating = updatingId === booking._id;
                return (
                  <tr key={booking._id}>
                    <td>
                      <code className="ref-tag">{booking.bookingReference}</code>
                    </td>
                    <td>
                      <strong>{booking.studentName}</strong>
                    </td>
                    <td>{booking.studentRoll}</td>
                    <td>
                      <span className="room-highlight">{booking.roomNumber}</span>
                      <small className="block-subtext">{booking.block}</small>
                    </td>
                    <td>{booking.semester}</td>
                    <td>
                      <span className="mess-plan-tag">{booking.messPlan}</span>
                    </td>
                    <td>
                      <strong>₹{Number(booking.totalFee).toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className={`booking-status-badge status-${booking.status}`}>
                        {booking.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select
                        disabled={isUpdating}
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                        className="status-select-control"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="checked_in">Checked In</option>
                        <option value="vacated">Vacated</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
