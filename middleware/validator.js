const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// User registration validation rules
exports.registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['analyst', 'admin'])
    .withMessage('Role must be either analyst or admin')
];

// User login validation rules
exports.loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// User update validation rules
exports.updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['analyst', 'admin'])
    .withMessage('Role must be either analyst or admin')
];