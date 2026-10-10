const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const uploadLogo = require('../middleware/uploadLogo');
const {
  getSettings,
  updateSettings,
} = require('../controllers/settingsController');

// دریافت تنظیمات (همه کاربران)
router.get('/', getSettings);

// بروزرسانی تنظیمات (فقط ادمین)
router.put('/', auth, admin, (req, res, next) => {
  uploadLogo(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'خطا در آپلود لوگو',
      });
    }
    next();
  });
}, updateSettings);

module.exports = router;