import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";

// ==============================================================================
// AdminUsers — Beginner-Friendly Student & Staff Directory Component
// Allows searching by name/roll/email, filtering by role, and suspending accounts.
// ==============================================================================
function AdminUsers() {
  // 1. Component State
  const [users, setUsers] = useState([]);         // List of users from backend
  const [loading, setLoading] = useState(true);     // Loading indicator
  const [error, setError] = useState("");           // Error banner
  const [successMsg, setSuccessMsg] = useState(""); // Success message

  // Search & Role Filter State
  const [search, setSearch] = useState("");         // Search string
  const [roleFilter, setRoleFilter] = useState("All"); // "All", "student", "warden"

  // Confirmation modal state for account suspension
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [toggling, setToggling] = useState(false);

  // 2. Fetch Users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      let url = `${API_BASE_URL}/admin/users?`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;
      if (roleFilter !== "All") url += `role=${encodeURIComponent(roleFilter)}`;

      const res = await fetch(url, {
        headers: { "x-admin-role": "warden" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load directory");

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Failed to load directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  // 3. User clicks Suspend / Restore button
  const handlePromptToggle = (user) => {
    if (user.status === "active") {
      // If active, show confirmation dialog before suspending
      setConfirmTarget(user);
    } else {
      // If already suspended, restore access directly
      executeToggle(user);
    }
  };

  // 4. Send PATCH request to toggle status between active and suspended
  const executeToggle = async (user) => {
    try {
      setToggling(true);
      const res = await fetch(`${API_BASE_URL}/admin/users/${user._id}/toggle-status`, {
        method: "PATCH",
        headers: { "x-admin-role": "warden" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user account status");

      const newStatus = data.user.status;
      setSuccessMsg(
        newStatus === "suspended"
          ? `Account for ${user.name} has been suspended.`
          : `Account access restored for ${user.name}.`
      );

      setConfirmTarget(null); // Close modal
      fetchUsers();           // Refresh directory list
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>Student & Staff Directory</h1>
          <p>Campus resident profiles, academic departments, guardian contacts, and disciplinary access</p>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="user-role-filter">Filter by Role:</label>
          <select
            id="user-role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
          >
            <option value="All">All Roles</option>
            <option value="student">Students Only</option>
            <option value="warden">Hostel Wardens / Staff</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="admin-loading">Loading directory records...</div>
      ) : users.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">👥</span>
          <h3>No Records Found</h3>
          <p>No students match your query criteria.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student / Member</th>
                <th>Roll Number</th>
                <th>Email Address</th>
                <th>Degree / Course</th>
                <th>Emergency / Guardian Phone</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSuspended = u.status === "suspended";
                return (
                  <tr key={u._id} className={isSuspended ? "row-suspended" : ""}>
                    <td>
                      <div className="user-cell-meta">
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="roll-badge">{u.studentId || "N/A"}</span>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.course || "Not Specified"}</td>
                    <td>
                      <div>📞 {u.phone}</div>
                      {u.guardianPhone && u.guardianPhone !== "N/A" && (
                        <small className="guardian-contact">Guardian: {u.guardianPhone}</small>
                      )}
                    </td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {u.role ? u.role.toUpperCase() : "STUDENT"}
                      </span>
                    </td>
                    <td>
                      <span className={`account-status-badge ${isSuspended ? "status-suspended" : "status-active"}`}>
                        {isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td>
                      {u.role === "warden" ? (
                        <span className="protected-admin-tag">Admin Protected</span>
                      ) : (
                        <button
                          type="button"
                          className={`btn-action ${isSuspended ? "btn-restore" : "btn-suspend"}`}
                          onClick={() => handlePromptToggle(u)}
                        >
                          {isSuspended ? "🔓 Restore Access" : "🔒 Suspend Access"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Suspension Confirmation Modal */}
      {confirmTarget && (
        <div className="modal-backdrop">
          <div className="modal-card modal-confirm">
            <div className="modal-header">
              <h2>Confirm Account Suspension</h2>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setConfirmTarget(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body-content">
              <p>
                Are you sure you want to suspend access for student <strong>{confirmTarget.name}</strong> (
                {confirmTarget.studentId})?
              </p>
              <div className="alert alert-warning">
                ⚠️ While suspended, the student will be barred from making bed requests or booking hostel services.
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setConfirmTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={toggling}
                className="btn btn-danger"
                onClick={() => executeToggle(confirmTarget)}
              >
                {toggling ? "Suspending..." : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
