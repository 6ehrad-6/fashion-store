const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');

// مسیرهای کاربر (نیاز به لاگین)
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getMyOrders);

// مسیرهای ادمین (نیاز به لاگین + نقش ادمین)
router.get('/', auth, admin, getAllOrders);
router.put('/:id/status', auth, admin, updateOrderStatus);
router.get('/stats', auth, admin, getOrderStats);

module.exports = router;