const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  getStats,
  getRecentOrders,
} = require('../controllers/dashboardController');

// همه مسیرهای داشبورد نیاز به لاگین و نقش ادمین دارند
router.get('/stats', auth, admin, getStats);
router.get('/recent-orders', auth, admin, getRecentOrders);

module.exports = router;