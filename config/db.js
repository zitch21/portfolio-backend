// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the database using our hidden MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // If the database fails, shut down the server
  }
};

module.exports = connectDB;