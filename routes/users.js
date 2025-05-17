const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { registerValidation, updateUserValidation, validate } = require('../middleware/validator');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getUsers)
  .post(registerValidation, validate, createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUserValidation, validate, updateUser)
  .delete(deleteUser);

module.exports = router;