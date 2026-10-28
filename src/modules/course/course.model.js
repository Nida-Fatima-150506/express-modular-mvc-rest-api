const mongoose = require('mongoose');
const { isDbConnected } = require('../../config/db');

// Mongoose Course Schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required']
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      default: 0
    },
    instructor: {
      type: String,
      default: 'Staff Instructor'
    }
  },
  { timestamps: true }
);

const MongoCourse = mongoose.model('Course', courseSchema);

// In-Memory Storage (Fallback if MongoDB is not running locally)
const memoryCourses = [];
let nextCourseId = 1;

const Course = {
  // Create course
  create: async (data) => {
    if (isDbConnected()) {
      return await MongoCourse.create(data);
    }
    const item = {
      _id: String(nextCourseId++),
      title: data.title,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      instructor: data.instructor || 'Staff Instructor',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryCourses.push(item);
    return item;
  },

  // Get all courses
  find: async () => {
    if (isDbConnected()) {
      return await MongoCourse.find();
    }
    return memoryCourses;
  },

  // Get course by ID
  findById: async (id) => {
    if (isDbConnected()) {
      return await MongoCourse.findById(id);
    }
    return memoryCourses.find((c) => c._id === String(id)) || null;
  },

  // Update course by ID
  findByIdAndUpdate: async (id, data, options = {}) => {
    if (isDbConnected()) {
      return await MongoCourse.findByIdAndUpdate(id, data, options);
    }
    const index = memoryCourses.findIndex((c) => c._id === String(id));
    if (index === -1) return null;
    memoryCourses[index] = {
      ...memoryCourses[index],
      ...data,
      updatedAt: new Date()
    };
    return memoryCourses[index];
  },

  // Delete course by ID
  findByIdAndDelete: async (id) => {
    if (isDbConnected()) {
      return await MongoCourse.findByIdAndDelete(id);
    }
    const index = memoryCourses.findIndex((c) => c._id === String(id));
    if (index === -1) return null;
    const deleted = memoryCourses.splice(index, 1);
    return deleted[0];
  }
};

module.exports = Course;
