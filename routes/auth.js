const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

router.post('/register', registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', protect, getMe);

module.exports = router;