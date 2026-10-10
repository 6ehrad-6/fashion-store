const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===== بررسی احراز هویت =====
exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'لطفاً ابتدا وارد حساب خود شوید',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'کاربر یافت نشد',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'توکن نامعتبر است',
      error: error.message,
    });
  }
};

// ===== بررسی نقش ادمین =====
exports.admin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'لطفاً ابتدا وارد حساب خود شوید',
      });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'دسترسی محدود - فقط ادمین',
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ Admin check error:', error);
    return res.status(500).json({
      success: false,
      message: 'خطا در بررسی دسترسی',
    });
  }
};