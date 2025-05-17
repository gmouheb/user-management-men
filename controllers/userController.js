const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      // Check if request is from web form or API
      const isWebRequest = req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded');

      if (isWebRequest) {
        return res.redirect('/admin?error=User not found');
      } else {
        return res.status(404).json({
          success: false,
          error: `User not found with id of ${req.params.id}`
        });
      }
    }

    // Check if request is from web form or API
    const isWebRequest = req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded');

    if (isWebRequest) {
      return res.redirect('/admin');
    } else {
      return res.status(200).json({
        success: true,
        data: user
      });
    }
  } catch (err) {
    // Check if request is from web form or API
    const isWebRequest = req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded');

    if (isWebRequest) {
      return res.redirect(`/admin?error=${err.message}`);
    } else {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      // Check if request is from web form or API
      const isWebRequest = req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded');

      if (isWebRequest) {
        return res.redirect('/admin?error=User not found');
      } else {
        return res.status(404).json({
          success: false,
          error: `User not found with id of ${req.params.id}`
        });
      }
    }

    // Check if request is from web form or API
    const isWebRequest = req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded');

    if (isWebRequest) {
      return res.redirect('/admin');
    } else {
      return res.status(200).json({
        success: true,
        data: {}
      });
    }
  } catch (err) {
    // Check if request is from web form or API
    const isWebRequest = req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded');

    if (isWebRequest) {
      return res.redirect(`/admin?error=${err.message}`);
    } else {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }
};
