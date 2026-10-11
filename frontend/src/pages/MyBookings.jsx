import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Room Vacating Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [vacatingDate, setVacatingDate] = useState("");
  const [vacatingReason, setVacatingReason] = useState("Semester completed");
  const [isVacating, setIsVacating] = useState(false);

  // Active printable receipt booking
  const [printBooking, setPrintBooking] = useState(null);

  // Fetch logged-in student's hostel allocations
  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/bookings/my`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load hostel allocations");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // Sort bookings newest first by start date
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  // Calculate Overview Stats
  const totalSemestersStayed = bookings.length;
  const activeAllotment = bookings.find(
    (b) => b.status === "confirmed" || b.status === "checked_in"
  );
  const totalFeesPaid = bookings.reduce(
    (sum, b) => sum + (Number(b.totalFee) || 0),
    0
  );

  // Open Vacating Modal
  const openVacateModal = (booking) => {
    setSelectedBooking(booking);
    setVacatingDate(new Date().toISOString().split("T")[0]);
    setVacatingReason("Semester completed");
  };

  // Close Vacating Modal
  const closeVacateModal = () => {
    setSelectedBooking(null);
    setIsVacating(false);
  };

  // Handle Vacating Request Submission
  const handleConfirmVacate = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      setIsVacating(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/bookings/${selectedBooking._id}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vacatingDate: vacatingDate,
            reason: vacatingReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not complete vacate request");
      }

      setSuccessMessage("Room vacated successfully.");
      closeVacateModal();
      fetchAllocations();
    } catch (err) {
      setError(err.message);
      setIsVacating(false);
    }
  };

  // Trigger Print Receipt
  const handlePrintReceipt = (booking) => {
    setPrintBooking(booking);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="portal-container">
      {/* Student Portal Header */}
      <div className="page-header">
        <h1>Student Portal</h1>
        <p>My Hostel Allocations, Mess Meal Plans & Fee Receipts</p>
      </div>

      {/* Notifications */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Overview Statistics Section */}
      <div className="stats-grid no-print">
        <div className="stat-card">
          <span className="stat-label">Total Semesters Stayed</span>
          <span className="stat-value">{totalSemestersStayed}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Active Allotment</span>
          <span className="stat-value highlight">
            {activeAllotment
              ? `${activeAllotment.block} • Room ${activeAllotment.roomNumber}`
              : "No Active Allotment"}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Fees Paid</span>
          <span className="stat-value">₹{totalFeesPaid.toLocaleString()}</span>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading && <p className="loading-state">Loading allocations...</p>}

      {!loading && sortedBookings.length === 0 && (
        <p className="empty-state">No hostel allocations found.</p>
      )}

      {/* Allocation Cards List */}
      <div className="allocations-list no-print">
        {sortedBookings.map((booking) => (
          <div key={booking._id || booking.bookingReference} className="allocation-card">
            {/* Header: Reference + Status Badge */}
            <div className="card-header">
              <div>
                <span className="card-caption">Allocation Reference</span>
                <h3 className="card-title">{booking.bookingReference}</h3>
              </div>

              <span className={`status-badge status-${booking.status}`}>
                {booking.status === "confirmed" && "Confirmed"}
                {booking.status === "checked_in" && "Checked In"}
                {booking.status === "vacated" && "Vacated"}
                {booking.status === "cancelled" && "Cancelled"}
              </span>
            </div>

            {/* Allocation Details Grid */}
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Room</span>
                <span className="detail-value">{booking.roomNumber}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Block</span>
                <span className="detail-value">{booking.block}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Sharing</span>
                <span className="detail-value">{booking.sharing}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Academic Year</span>
                <span className="detail-value">{booking.academicYear}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Semester</span>
                <span className="detail-value">{booking.semester}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">
                  {new Date(booking.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">End Date</span>
                <span className="detail-value">
                  {new Date(booking.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Mess Plan</span>
                <span className="detail-value plan-tag">{booking.messPlan}</span>
              </div>
            </div>

            {/* Fee & Caution Deposit */}
            <div className="fee-box">
              <div className="fee-item">
                <span className="fee-label">Total Fee Paid</span>
                <strong className="fee-amount">₹{Number(booking.totalFee).toLocaleString()}</strong>
              </div>

              <div className="fee-item">
                <span className="fee-label">Caution Deposit</span>
                <span className="fee-deposit">₹{Number(booking.cautionDeposit).toLocaleString()}</span>
                <small className="fee-note">Refundable upon exit clearance</small>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handlePrintReceipt(booking)}
              >
                Print Bursar Receipt
              </button>

              {(booking.status === "confirmed" || booking.status === "checked_in") && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => openVacateModal(booking)}
                >
                  Request Room Vacate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Room Vacating Modal */}
      {selectedBooking && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Request Room Vacating</h3>
            <p className="modal-subtitle">
              Vacating {selectedBooking.block} • Room {selectedBooking.roomNumber} ({selectedBooking.bookingReference})
            </p>

            <form onSubmit={handleConfirmVacate}>
              <div className="form-group">
                <label className="form-label">Vacating Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={vacatingDate}
                  onChange={(e) => setVacatingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Vacating</label>
                <select
                  className="form-input"
                  value={vacatingReason}
                  onChange={(e) => setVacatingReason(e.target.value)}
                >
                  <option value="Semester completed">Semester completed</option>
                  <option value="Internship relocation">Internship relocation</option>
                  <option value="Course completed">Course completed</option>
                  <option value="Personal reason">Personal reason</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeVacateModal}
                  disabled={isVacating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={isVacating}
                >
                  {isVacating ? "Processing..." : "Confirm Vacate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Layout (Visible when window.print() is called) */}
      {printBooking && (
        <div className="printable-receipt">
          <div className="receipt-header">
            <h2>XSHostel</h2>
            <p>Student Hostel Fee & Clearance Receipt</p>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-row">
            <span>Student Name:</span>
            <strong>Chandra Tripathi</strong>
          </div>
          <div className="receipt-row">
            <span>Roll Number:</span>
            <strong>STU-2026-1042</strong>
          </div>
          <div className="receipt-row">
            <span>Allocation Reference:</span>
            <strong>{printBooking.bookingReference}</strong>
          </div>
          <div className="receipt-row">
            <span>Hostel Block:</span>
            <strong>{printBooking.block}</strong>
          </div>
          <div className="receipt-row">
            <span>Room Number:</span>
            <strong>{printBooking.roomNumber} ({printBooking.sharing})</strong>
          </div>
          <div className="receipt-row">
            <span>Academic Year & Term:</span>
            <strong>{printBooking.academicYear} • {printBooking.semester}</strong>
          </div>
          <div className="receipt-row">
            <span>Mess Meal Plan:</span>
            <strong>{printBooking.messPlan}</strong>
          </div>
          <div className="receipt-row">
            <span>Total Fee Paid:</span>
            <strong>₹{Number(printBooking.totalFee).toLocaleString()}</strong>
          </div>
          <div className="receipt-row">
            <span>Caution Deposit:</span>
            <strong>₹{Number(printBooking.cautionDeposit).toLocaleString()} (Refundable)</strong>
          </div>
          <div className="receipt-row">
            <span>Status:</span>
            <strong>{printBooking.status.toUpperCase()}</strong>
          </div>

          <div className="receipt-divider"></div>
          <p className="receipt-footer">Thank you. Verified by Campus Hostel Bursar Office.</p>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
