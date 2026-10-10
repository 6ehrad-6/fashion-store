const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers,
  changeUserRole,
  deleteUser,
} = require('../controllers/authController');

// مسیرهای عمومی
router.post('/register', register);
router.post('/login', login);

// مسیرهای کاربر (نیاز به لاگین)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// مسیرهای ادمین (نیاز به لاگین + نقش ادمین)
router.get('/users', auth, admin, getUsers);
router.put('/users/:id/role', auth, admin, changeUserRole);
router.delete('/users/:id', auth, admin, deleteUser);

module.exports = router;