const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('./category.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Category CRUD Routes
router.route('/')
  .get(getCategories)
  .post(createCategory); // or protect if auth required

router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
