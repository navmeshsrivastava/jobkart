const express = require('express');
const { saveRedirectUrl, isLoggedIn } = require('../middleware');
const authController = require('../controllers/authController');
const router = express.Router();

// Render Signup Page
router.get('/signup', authController.getSignupPage);

// Handle Signup Form Submission
router.post('/signup', authController.postSignup);

// Render Login Page
router.get('/login', authController.getLoginPage);

// Handle Login Form Submission
router.post('/login', saveRedirectUrl, authController.postLogin);

// Handle Logout
router.get('/logout', isLoggedIn, authController.logout);

module.exports = router;
