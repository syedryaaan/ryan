const express = require('express');
const cors = require('cors');

// Initialize the Express application
const app = express();

// Configure Cross-Origin Resource Sharing (CORS)
// Allows the React frontend to communicate with this API
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Request Body Parsing Middleware
// express.json() parses incoming requests with JSON payloads (e.g., POST/PUT requests)
app.use(express.json());
// express.urlencoded() parses incoming requests with URL-encoded payloads (e.g., standard HTML forms)
app.use(express.urlencoded({ extended: true }));

// Health Check API Endpoint
// Used to verify that the backend server is running and healthy
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'XSHostel REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 Fallback Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Export the configured app for use in server.js or automated tests
module.exports = app;
