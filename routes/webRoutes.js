const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @desc    Render home page
// @route   GET /
// @access  Public
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    user: req.user
  });
});

// @desc    Render login page
// @route   GET /login
// @access  Public
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    user: req.user
  });
});

// @desc    Render register page
// @route   GET /register
// @access  Public
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register',
    user: req.user
  });
});

// @desc    Process login
// @route   POST /login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Login',
        message: {
          type: 'danger',
          text: 'Please provide an email and password'
        }
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.render('auth/login', {
        title: 'Login',
        message: {
          type: 'danger',
          text: 'Invalid credentials'
        }
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Login',
        message: {
          type: 'danger',
          text: 'Invalid credentials'
        }
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    // Set cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRE.split('d')[0] * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    res.cookie('token', token, options);

    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  } catch (err) {
    res.render('auth/login', {
      title: 'Login',
      message: {
        type: 'danger',
        text: err.message
      }
    });
  }
});

// @desc    Process register
// @route   POST /register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create token
    const token = user.getSignedJwtToken();

    // Set cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_EXPIRE.split('d')[0] * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    res.cookie('token', token, options);

    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  } catch (err) {
    res.render('auth/register', {
      title: 'Register',
      message: {
        type: 'danger',
        text: err.message
      }
    });
  }
});

// @desc    Logout user
// @route   GET /logout
// @access  Private
router.get('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.redirect('/login');
});

// @desc    Render user dashboard
// @route   GET /dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.user
    });
  } catch (err) {
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.user,
      message: {
        type: 'danger',
        text: err.message
      }
    });
  }
});

// @desc    Render admin dashboard
// @route   GET /admin
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    // Get user counts
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const analystCount = await User.countDocuments({ role: 'analyst' });

    // Get new users in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  } catch (err) {
    // Get user counts (even in error case)
    let userCount = 0, adminCount = 0, analystCount = 0, newUsers = 0, recentUsers = [];

    try {
      userCount = await User.countDocuments();
      adminCount = await User.countDocuments({ role: 'admin' });
      analystCount = await User.countDocuments({ role: 'analyst' });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

      recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    } catch (countErr) {
      console.error('Error getting counts:', countErr);
    }

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      message: {
        type: 'danger',
        text: err.message
      },
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  }
});

// @desc    List all users
// @route   GET /admin/users
// @access  Private/Admin
router.get('/admin/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Get user counts
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const analystCount = await User.countDocuments({ role: 'analyst' });

    // Get new users in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'User Management',
      user: req.user,
      allUsers: users,
      userManagement: true,
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  } catch (err) {
    // Get user counts (even in error case)
    let userCount = 0, adminCount = 0, analystCount = 0, newUsers = 0, recentUsers = [];

    try {
      userCount = await User.countDocuments();
      adminCount = await User.countDocuments({ role: 'admin' });
      analystCount = await User.countDocuments({ role: 'analyst' });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

      recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    } catch (countErr) {
      console.error('Error getting counts:', countErr);
    }

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      message: {
        type: 'danger',
        text: err.message
      },
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  }
});

// @desc    View single user details
// @route   GET /admin/users/:id
// @access  Private/Admin
router.get('/admin/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.user,
        message: {
          type: 'danger',
          text: `User not found with id of ${req.params.id}`
        }
      });
    }

    // Get user counts
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const analystCount = await User.countDocuments({ role: 'analyst' });

    // Get new users in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'User Details',
      user: req.user,
      viewUser: user,
      userDetails: true,
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  } catch (err) {
    // Get user counts (even in error case)
    let userCount = 0, adminCount = 0, analystCount = 0, newUsers = 0, recentUsers = [];

    try {
      userCount = await User.countDocuments();
      adminCount = await User.countDocuments({ role: 'admin' });
      analystCount = await User.countDocuments({ role: 'analyst' });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

      recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    } catch (countErr) {
      console.error('Error getting counts:', countErr);
    }

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      message: {
        type: 'danger',
        text: err.message
      },
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  }
});

// @desc    Edit user form
// @route   GET /admin/users/:id/edit
// @access  Private/Admin
router.get('/admin/users/:id/edit', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.user,
        message: {
          type: 'danger',
          text: `User not found with id of ${req.params.id}`
        }
      });
    }

    // Get user counts
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const analystCount = await User.countDocuments({ role: 'analyst' });

    // Get new users in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'Edit User',
      user: req.user,
      viewUser: user,
      editUser: true,
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  } catch (err) {
    // Get user counts (even in error case)
    let userCount = 0, adminCount = 0, analystCount = 0, newUsers = 0, recentUsers = [];

    try {
      userCount = await User.countDocuments();
      adminCount = await User.countDocuments({ role: 'admin' });
      analystCount = await User.countDocuments({ role: 'analyst' });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      newUsers = await User.countDocuments({ createdAt: { $gte: oneDayAgo } });

      recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    } catch (countErr) {
      console.error('Error getting counts:', countErr);
    }

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      message: {
        type: 'danger',
        text: err.message
      },
      userCount,
      adminCount,
      analystCount,
      newUsers,
      recentUsers
    });
  }
});

module.exports = router;
