const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/course_portal', {
      serverSelectionTimeoutMS: 2000 // Fast 2s timeout check
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.log('MongoDB is not running locally. Using in-memory storage mode for testing.');
  }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };
