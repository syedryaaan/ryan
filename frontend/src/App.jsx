import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Auth from "./pages/Auth";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";

// ==============================================================================
// App — Main Root Component for XSHostel
// Implements Issue #4 Smart Campus UI Design System, Layout, Navbar, Footer,
// Home Page, Room Explorer, Auth, and Integrated Chief Warden Console (/admin).
// ==============================================================================
function App() {
  // 1. Navigation Route State (default to "/" for Home page)
  const [currentPath, setCurrentPath] = useState(window.location.pathname || "/");

  // Query parameter state for filtering rooms
  const [queryBlock, setQueryBlock] = useState("");
  const [querySearch, setQuerySearch] = useState("");

  // 2. Simulated Authentication State
  // Default logged-in as student resident
  const [user, setUser] = useState({
    name: "Chandra Tripathi",
    email: "student@example.com",
    studentId: "STU-2026-1042",
    role: "student", // "student" or "admin"
  });

  // Global Toast Alert Message
  const [toastMessage, setToastMessage] = useState("");

  // 3. Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      parseAndSetRoute(window.location.pathname + window.location.search);
    };

    window.addEventListener("popstate", handlePopState);
    // Initial route parse on mount
    parseAndSetRoute(window.location.pathname + window.location.search);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Helper to parse query parameters and update state
  const parseAndSetRoute = (fullPath) => {
    const [path, queryString] = fullPath.split("?");
    setCurrentPath(path || "/");

    if (queryString) {
      const params = new URLSearchParams(queryString);
      setQueryBlock(params.get("block") || "");
      setQuerySearch(params.get("search") || "");
    } else {
      setQueryBlock("");
      setQuerySearch("");
    }
  };

  // 4. Client-side Navigation Handler
  const handleNavigate = (targetPath) => {
    // If trying to access /admin as a non-admin
    if (targetPath.startsWith("/admin")) {
      if (!user || (user.role !== "admin" && user.role !== "warden")) {
        setToastMessage("⛔ Access Denied: Chief Warden authorization required to access /admin.");
        setCurrentPath("/");
        window.history.pushState(null, "", "/");
        setTimeout(() => setToastMessage(""), 5000);
        return;
      }
    }

    parseAndSetRoute(targetPath);
    window.history.pushState(null, "", targetPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 5. Auth Handlers
  const handleLogin = (userData) => {
    setUser(userData);
    setToastMessage(`Welcome back, ${userData.name}!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleLogout = () => {
    setUser(null);
    setToastMessage("You have been logged out.");
    setTimeout(() => setToastMessage(""), 4000);
    handleNavigate("/");
  };

  // Toggle user role between student and admin for quick evaluation
  const handleToggleRole = () => {
    if (!user) {
      setUser({
        name: "Chandra Tripathi",
        email: "student@example.com",
        studentId: "STU-2026-1042",
        role: "student",
      });
      return;
    }

    const newRole = user.role === "student" ? "admin" : "student";
    setUser({
      ...user,
      role: newRole,
      name: newRole === "admin" ? "Dr. Alok Verma" : "Chandra Tripathi",
    });

    if (newRole === "student" && currentPath.startsWith("/admin")) {
      handleNavigate("/");
      setToastMessage("Switched to Student Role. Automatically exited /admin console.");
    } else {
      setToastMessage(
        `Role switched to ${newRole === "admin" ? "Chief Warden (Admin)" : "Student Resident"}.`
      );
    }
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="app-layout">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="global-toast-notification">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage("")}>✕</button>
        </div>
      )}

      {/* Role Demonstration Switcher Banner */}
      <div className="role-switcher-banner no-print">
        <div className="role-switcher-inner">
          <div className="role-status">
            <span>Authentication Simulation: </span>
            {user ? (
              <strong className={`role-tag-pill ${user.role}`}>
                {user.role === "admin" || user.role === "warden"
                  ? "🛡️ Chief Warden (Admin)"
                  : "🎓 Student Resident"}{" "}
                ({user.name})
              </strong>
            ) : (
              <strong className="role-tag-pill">Logged Out</strong>
            )}
          </div>
          <div className="role-actions">
            {user ? (
              <>
                <button
                  type="button"
                  className="btn-role-toggle"
                  onClick={handleToggleRole}
                >
                  🔄 Toggle to {user.role === "student" ? "Admin Mode" : "Student Mode"}
                </button>
                {user.role === "admin" || user.role === "warden" ? (
                  currentPath.startsWith("/admin") ? (
                    <button
                      type="button"
                      className="btn-launch-student"
                      onClick={() => handleNavigate("/")}
                    >
                      ← Return to Public Campus Home
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-launch-admin"
                      onClick={() => handleNavigate("/admin")}
                    >
                      Go to Chief Warden Console (/admin) →
                    </button>
                  )
                ) : null}
              </>
            ) : (
              <button
                type="button"
                className="btn-role-toggle"
                onClick={() =>
                  setUser({
                    name: "Chandra Tripathi",
                    email: "student@example.com",
                    role: "student",
                  })
                }
              >
                Quick Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Persistent Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Page Content Area */}
      <main className="main-content">
        {currentPath === "/" && <Home onNavigate={handleNavigate} />}

        {currentPath.startsWith("/rooms") && (
          <Rooms
            initialBlock={queryBlock}
            initialSearch={querySearch}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === "/login" && (
          <Auth mode="login" onLogin={handleLogin} onNavigate={handleNavigate} />
        )}

        {currentPath === "/register" && (
          <Auth mode="register" onLogin={handleLogin} onNavigate={handleNavigate} />
        )}

        {currentPath === "/my-bookings" && <MyBookings onNavigate={handleNavigate} />}

        {currentPath === "/profile" && <Profile onNavigate={handleNavigate} />}

        {currentPath.startsWith("/admin") &&
          (user && (user.role === "admin" || user.role === "warden") ? (
            <AdminLayout onExitToPublicSite={() => handleNavigate("/")} />
          ) : (
            <div className="rooms-page-container">
              <div className="empty-state-box">
                <span className="empty-icon">⛔</span>
                <h2>Access Restricted</h2>
                <p>Chief Warden privileged credentials required to access /admin.</p>
                <button
                  type="button"
                  className="btn-primary-action"
                  style={{ marginTop: "16px" }}
                  onClick={() => handleNavigate("/")}
                >
                  ← Return to Public Campus Home
                </button>
              </div>
            </div>
          ))}

        {/* 404 Not Found fallback for any other route */}
        {currentPath !== "/" &&
          !currentPath.startsWith("/rooms") &&
          currentPath !== "/login" &&
          currentPath !== "/register" &&
          currentPath !== "/my-bookings" &&
          currentPath !== "/profile" &&
          !currentPath.startsWith("/admin") && (
            <NotFound onNavigate={handleNavigate} />
          )}
      </main>

      {/* Main Persistent Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
