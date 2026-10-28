const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/profile', protect, getProfile);

module.exports = router;
