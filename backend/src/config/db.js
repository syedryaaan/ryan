const mongoose = require("mongoose");

let lastDbError = null;

const getMongoUri = () => {
  const envUri = process.env.MONGO_URI;
  // If MONGO_URI is a valid connection string and not an unparsed template or localhost in production
  if (
    envUri &&
    !envUri.includes("<") &&
    !envUri.includes(">") &&
    !(process.env.NODE_ENV === "production" && (envUri.includes("127.0.0.1") || envUri.includes("localhost")))
  ) {
    return envUri;
  }
  return "mongodb+srv://syedryaaan_db_user:Rayyan1122@cluster0.ageb2ld.mongodb.net/hostel-management?retryWrites=true&w=majority&appName=Cluster0";
};

// Connect to MongoDB database with auto-retry
const connectDB = async () => {
  const mongoUri = getMongoUri();
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    lastDbError = null;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    lastDbError = error.message;
    console.warn(`[MongoDB Notice]: ${error.message}. Retrying in 5 seconds...`);
    setTimeout(connectDB, 5000);
  }
};

const getDbStatus = () => ({
  status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || null,
  database: mongoose.connection.name || null,
  error: lastDbError,
});

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
