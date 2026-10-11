const mongoose = require("mongoose");

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb+srv://syedryaaan_db_user:Rayyan1122@cluster0.ageb2ld.mongodb.net/hostel-management?retryWrites=true&w=majority&appName=Cluster0";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(
      `[MongoDB Notice]: ${error.message}. Running in local fallback mode.`
    );
  }
};

module.exports = connectDB;
