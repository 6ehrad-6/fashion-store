const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// ===== دریافت آمار داشبورد =====
// @desc    دریافت آمار داشبورد (ادمین)
// @route   GET /api/dashboard/stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: { $in: ['pending', 'processing'] } 
    });
    const deliveredOrders = await Order.countDocuments({ 
      orderStatus: 'delivered' 
    });
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth },
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        monthlyRevenue,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار',
      error: error.message,
    });
  }
};

// ===== دریافت آخرین سفارشات =====
// @desc    دریافت آخرین سفارشات (ادمین)
// @route   GET /api/dashboard/recent-orders
exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'fullName email');
    
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارشات اخیر',
      error: error.message,
    });
  }
};