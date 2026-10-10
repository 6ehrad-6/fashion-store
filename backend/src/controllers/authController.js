const User = require('../models/User');
const jwt = require('jsonwebtoken');

// تولید توکن
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ===== توابع اصلی =====

// @desc    ثبت‌نام کاربر جدید
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // بررسی وجود کاربر
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'این ایمیل قبلاً ثبت نام کرده است',
      });
    }

    // ایجاد کاربر
    const user = await User.create({
      fullName,
      email,
      password,
      role: 'user',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'ثبت‌نام با موفقیت انجام شد',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت‌نام',
      error: error.message,
    });
  }
};

// @desc    ورود کاربر
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'ایمیل یا رمز عبور اشتباه است',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'ورود با موفقیت انجام شد',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ورود',
      error: error.message,
    });
  }
};

// @desc    دریافت پروفایل کاربر
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('wishlist')
      .populate('cart.product');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت پروفایل',
      error: error.message,
    });
  }
};

// @desc    بروزرسانی پروفایل
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'پروفایل با موفقیت بروزرسانی شد',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی پروفایل',
      error: error.message,
    });
  }
};

// ===== توابع مدیریت کاربران (فقط ادمین) =====

// @desc    دریافت همه کاربران (ادمین)
// @route   GET /api/auth/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت کاربران',
      error: error.message,
    });
  }
};

// @desc    تغییر نقش کاربر (ادمین)
// @route   PUT /api/auth/users/:id/role
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد',
      });
    }

    if (userId === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'نمی‌توانید نقش خود را تغییر دهید',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'نقش کاربر با موفقیت تغییر کرد',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تغییر نقش کاربر',
      error: error.message,
    });
  }
};

// @desc    حذف کاربر (ادمین)
// @route   DELETE /api/auth/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد',
      });
    }

    if (userId === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'نمی‌توانید خود را حذف کنید',
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'کاربر با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف کاربر',
      error: error.message,
    });
  }
};