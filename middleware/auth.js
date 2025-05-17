const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in cookies first (for web interface)
  if (req.cookies.token) {
    token = req.cookies.token;
  } 
  // Then check for token in Authorization header (for API)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    // Check if this is an API request or web request
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    } else {
      // For web interface, redirect to login page
      return res.redirect('/login');
    }
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    // Check if this is an API request or web request
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    } else {
      // For web interface, redirect to login page
      return res.redirect('/login');
    }
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // Check if this is an API request or web request
      if (req.originalUrl.startsWith('/api')) {
        return res.status(403).json({
          success: false,
          error: `User role ${req.user.role} is not authorized to access this route`
        });
      } else {
        // For web interface, redirect to dashboard with error message
        return res.render('dashboard/index', {
          title: 'Dashboard',
          user: req.user,
          message: {
            type: 'danger',
            text: 'You are not authorized to access that page'
          }
        });
      }
    }
    next();
  };
};
