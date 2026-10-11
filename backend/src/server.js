require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Render injects PORT dynamically; default to 10000 on Render or 5000 locally
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    // 1. Immediately bind Express to 0.0.0.0 on assigned PORT
    // This allows Render to detect the open port immediately and mark service Live
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT} (host: 0.0.0.0)`);
      console.log(`Health check: http://0.0.0.0:${PORT}/api/health`);
    });

    // 2. Connect to MongoDB asynchronously without blocking port detection
    connectDB()
      .then(() => {
        console.log("Database initialized successfully.");
      })
      .catch((err) => {
        console.warn("[MongoDB Notice]:", err.message);
      });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated.");
      });
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
