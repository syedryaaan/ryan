import React, { useState, useEffect } from "react";
import PureSvgAreaChart from "./PureSvgAreaChart";
import PureSvgBarChart from "./PureSvgBarChart";
import { API_BASE_URL } from "../../config/api";

// ==============================================================================
// AdminOverview — Beginner-Friendly Chief Warden Operations Dashboard
// Fetches real campus statistics and renders metric cards + pure SVG charts.
// ==============================================================================
function AdminOverview() {
  // 1. Component State using basic React useState hooks
  const [stats, setStats] = useState(null);       // Holds summary numbers (beds, revenue, etc.)
  const [analytics, setAnalytics] = useState(null); // Holds array data for SVG charts
  const [loading, setLoading] = useState(true);     // Tracks if data is being fetched
  const [error, setError] = useState("");           // Holds any error message

  // 2. Simple function to fetch data from backend admin endpoints
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch summary stats and visual chart data in parallel
      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { "x-admin-role": "warden" },
        }),
        fetch(`${API_BASE_URL}/admin/analytics`, {
          headers: { "x-admin-role": "warden" },
        }),
      ]);

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      if (!statsRes.ok) throw new Error(statsData.message || "Failed to fetch stats");
      if (!analyticsRes.ok) throw new Error(analyticsData.message || "Failed to fetch analytics");

      // Save data to state
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // 3. Load data once when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 4. Loading state view
  if (loading) {
    return <div className="admin-loading">Loading Chief Warden operations console...</div>;
  }

  return (
    <div className="admin-overview-container">
      {/* Page Title & Refresh Button */}
      <div className="admin-page-header">
        <div>
          <h1>Operations Overview & Visual Analytics</h1>
          <p>Real-time campus accommodation status, bursar inflow & bed occupancy ledger</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={fetchDashboardData}>
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Error Alert (if any) */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Top 4 Key Metric Cards */}
      <div className="admin-metric-grid">
        {/* Card 1: Total Campus Beds */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Campus Beds</span>
            <span className="metric-icon">🛏️</span>
          </div>
          <div className="metric-number">{stats?.totalBeds || 0}</div>
          <span className="metric-subtext">Across {stats?.totalRooms || 0} dorm rooms</span>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Occupancy Rate</span>
            <span className="metric-icon">📈</span>
          </div>
          <div className="metric-number highlight-accent">{stats?.occupancyRate || 0}%</div>
          <span className="metric-subtext">
            {stats?.occupiedBeds || 0} Occupied • {stats?.vacantBeds || 0} Vacant
          </span>
        </div>

        {/* Card 3: Active Students */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Resident Students</span>
            <span className="metric-icon">🎓</span>
          </div>
          <div className="metric-number highlight-green">{stats?.activeStudents || 0}</div>
          <span className="metric-subtext">Verified enrolled residents</span>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Semester Fees Collected</span>
            <span className="metric-icon">₹</span>
          </div>
          <div className="metric-number">₹{(stats?.totalRevenue || 0).toLocaleString()}</div>
          <span className="metric-subtext">Bursar verified receipts</span>
        </div>
      </div>

      {/* Visual Analytics Chart 1: Pure SVG Area Chart */}
      <div className="admin-chart-card">
        <div className="chart-header">
          <div>
            <h3>6-Month Fee Collections & Bursar Inflow</h3>
            <p>Aggregated semester accommodation & mess plan deposits (Pure SVG Visualization)</p>
          </div>
        </div>
        <PureSvgAreaChart data={analytics?.monthlyRevenue || []} />
      </div>

      {/* Visual Analytics Chart 2: Pure SVG Comparative Bar Chart */}
      <div className="admin-chart-card">
        <div className="chart-header">
          <div>
            <h3>Hostel Block Capacity & Bed Utilization</h3>
            <p>Live bed capacity vs active residents across campus residential wings</p>
          </div>
        </div>
        <PureSvgBarChart data={analytics?.blockStats || []} />
      </div>
    </div>
  );
}

export default AdminOverview;
