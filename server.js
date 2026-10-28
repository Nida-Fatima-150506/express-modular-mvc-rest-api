const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db');

// Import Modular Routes
const authRoutes = require('./src/modules/auth/auth.routes');
const categoryRoutes = require('./src/modules/category/category.routes');
const courseRoutes = require('./src/modules/course/course.routes');

// Import Error Middlewares
const { notFound, errorHandler } = require('./src/middlewares/error.middleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Standard Middlewares - TRICK: Pehle Body Parser, Phir Routes
app.use(cors());
app.use(express.json()); // <-- FIXED: Yahan hona chahiye
app.use(express.urlencoded({ extended: true }));

// Mount Feature Modules
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);

// 404 Route Not Found Middleware (Screenshot 5)
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});

module.exports = app;