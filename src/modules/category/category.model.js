const mongoose = require('mongoose');
const { isDbConnected } = require('../../config/db');

// Mongoose Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const MongoCategory = mongoose.model('Category', categorySchema);

// In-Memory Storage (Fallback if MongoDB is not running locally)
const memoryCategories = [];
let nextCategoryId = 1;

const Category = {
  // Create category
  create: async (data) => {
    if (isDbConnected()) {
      return await MongoCategory.create(data);
    }
    const item = {
      _id: String(nextCategoryId++),
      name: data.name,
      description: data.description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryCategories.push(item);
    return item;
  },

  // Get all categories
  find: async () => {
    if (isDbConnected()) {
      return await MongoCategory.find();
    }
    return memoryCategories;
  },

  // Get category by ID
  findById: async (id) => {
    if (isDbConnected()) {
      return await MongoCategory.findById(id);
    }
    return memoryCategories.find((c) => c._id === String(id)) || null;
  },

  // Update category by ID
  findByIdAndUpdate: async (id, data, options = {}) => {
    if (isDbConnected()) {
      return await MongoCategory.findByIdAndUpdate(id, data, options);
    }
    const index = memoryCategories.findIndex((c) => c._id === String(id));
    if (index === -1) return null;
    memoryCategories[index] = {
      ...memoryCategories[index],
      ...data,
      updatedAt: new Date()
    };
    return memoryCategories[index];
  },

  // Delete category by ID
  findByIdAndDelete: async (id) => {
    if (isDbConnected()) {
      return await MongoCategory.findByIdAndDelete(id);
    }
    const index = memoryCategories.findIndex((c) => c._id === String(id));
    if (index === -1) return null;
    const deleted = memoryCategories.splice(index, 1);
    return deleted[0];
  }
};

module.exports = Category;
