const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Default student session for development testing
const demoStudent = {
  _id: "661234567890abcdef123456",
  name: "Chandra Tripathi",
  email: "student@example.com",
  studentId: "STU-2026-1042",
  course: "B.Tech Computer Science & Engineering",
  phone: "9876543210",
  guardianName: "Rajesh Kumar",
  guardianPhone: "9876501234",
  address: "142 University Green Avenue, New Delhi",
  role: "student",
};

// Default Chief Warden session for admin operations
const demoAdmin = {
  _id: "661234567890abcdef999999",
  name: "Dr. Alok Verma",
  email: "chiefwarden@xshostel.edu",
  studentId: "WRD-2026-001",
  role: "warden",
};

// Middleware to verify authentication and protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if Bearer token is provided in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "xshostel_jwt_secret_key_2026"
      );

      // Try finding user in MongoDB if connected
      try {
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user;
          return next();
        }
      } catch (dbErr) {
        // Fall back to decoded payload if DB not reachable
      }

      req.user = {
        _id: decoded.id || demoStudent._id,
        name: decoded.name || demoStudent.name,
        email: decoded.email || demoStudent.email,
        role: decoded.role || "student",
      };
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }
  }

  // Check if requested with warden header or default demo student
  if (req.headers["x-role"] === "warden" || req.headers["x-admin-role"] === "warden") {
    req.user = demoAdmin;
  } else {
    req.user = demoStudent;
  }
  next();
};

// Middleware to restrict access to Chief Warden / Admin only
const adminOnly = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" ||
      req.user.role === "warden" ||
      req.headers["x-admin-role"] === "warden" ||
      req.headers["x-role"] === "warden")
  ) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Forbidden. Chief Warden or Administrator privileges required.",
  });
};

module.exports = { protect, adminOnly, demoStudent, demoAdmin };
