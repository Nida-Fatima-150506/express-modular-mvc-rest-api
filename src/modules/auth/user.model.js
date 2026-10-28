const mongoose = require('mongoose');
const { isDbConnected } = require('../../config/db');

// Mongoose User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      default: 'student'
    }
  },
  { timestamps: true }
);

const MongoUser = mongoose.model('User', userSchema);

// In-Memory Users list (used if MongoDB is not running)
const memoryUsers = [];
let nextUserId = 1;

const User = {
  // Find single user by email
  findOne: async ({ email }) => {
    if (isDbConnected()) {
      return await MongoUser.findOne({ email });
    }
    return memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Create a new user
  create: async (userData) => {
    if (isDbConnected()) {
      return await MongoUser.create(userData);
    }
    const newUser = {
      _id: String(nextUserId++),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  // Find user by ID
  findById: async (id) => {
    if (isDbConnected()) {
      return await MongoUser.findById(id).select('-password');
    }
    const user = memoryUsers.find((u) => u._id === String(id));
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

module.exports = User;
