const Order = require('../models/Order');
const Product = require('../models/Product');

// ===== ایجاد سفارش جدید =====
// @desc    ایجاد سفارش جدید
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes,
    } = req.body;

    // محاسبه قیمت‌ها
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `محصول با ID ${item.product} یافت نشد`,
        });
      }
      
      itemsPrice += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size || '',
        color: item.color || '',
        image: product.images?.[0] || '',
      });
    }

    const shippingPrice = itemsPrice > 1000000 ? 0 : 50000;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      notes,
    });

    // اضافه کردن سفارش به کاربر
    await req.user.updateOne({ $push: { orders: order._id } });

    // کاهش موجودی
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'سفارش با موفقیت ثبت شد',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت سفارش',
      error: error.message,
    });
  }
};

// ===== دریافت سفارشات کاربر =====
// @desc    دریافت سفارشات کاربر
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product');
    
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارشات',
      error: error.message,
    });
  }
};

// ===== دریافت همه سفارشات (ادمین) =====
// @desc    دریافت همه سفارشات
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email')
      .populate('items.product');
    
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سفارشات',
      error: error.message,
    });
  }
};

// ===== بروزرسانی وضعیت سفارش (ادمین) =====
// @desc    بروزرسانی وضعیت سفارش
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'سفارش یافت نشد',
      });
    }

    order.orderStatus = orderStatus;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    await order.save();
    
    res.json({
      success: true,
      message: 'وضعیت سفارش با موفقیت بروزرسانی شد',
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی سفارش',
      error: error.message,
    });
  }
};

// ===== دریافت آمار سفارشات (ادمین) =====
// @desc    دریافت آمار سفارشات
// @route   GET /api/orders/stats
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: { $in: ['pending', 'processing'] } 
    });
    const deliveredOrders = await Order.countDocuments({ 
      orderStatus: 'delivered' 
    });
    const cancelledOrders = await Order.countDocuments({ 
      orderStatus: 'cancelled' 
    });

    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار سفارشات',
      error: error.message,
    });
  }
};