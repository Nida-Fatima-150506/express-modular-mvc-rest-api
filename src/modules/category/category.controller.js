const Category = require('./category.model');

// @desc    Create a new category
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation (Screenshot 4 requirement: 400 Bad Request when field missing)
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || ''
    });

    // 201 Created (Screenshot 2 requirement)
    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating category.'
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    // 200 OK (Screenshot 3 requirement)
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching categories.'
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    // 404 Route / Item Not Found (Screenshot 5 requirement)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    // If invalid Mongo ObjectId or error, also return 404
    return res.status(404).json({
      success: false,
      message: `Category not found with id: ${req.params.id}`
    });
  }
};

// @desc    Update category by ID
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: updatedCategory
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Category not found with id: ${req.params.id}`
    });
  }
};

// @desc    Delete category by ID
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Category not found with id: ${req.params.id}`
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
