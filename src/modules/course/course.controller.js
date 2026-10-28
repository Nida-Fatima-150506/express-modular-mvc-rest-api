const Course = require('./course.model');

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, instructor } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title, description, category, and price.' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Price cannot be negative' 
      });
    }

    const course = await Course.create({ 
      title: title.trim(), 
      description: description.trim(), 
      category, 
      price, 
      instructor 
    });

    res.status(201).json({ 
      success: true, 
      message: 'Course created successfully.', 
      data: course 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: `Course not found with id: ${req.params.id}` 
      });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid ID format: ${req.params.id}` 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCourse) {
      return res.status(404).json({ 
        success: false, 
        message: `Course not found with id: ${req.params.id}` 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Course updated successfully.', 
      data: updatedCourse 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid ID format: ${req.params.id}` 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: `Course not found with id: ${req.params.id}` 
      });
    }
    res.status(200).json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid ID format: ${req.params.id}` 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse 
};