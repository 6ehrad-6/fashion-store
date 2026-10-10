const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const uploadImages = require('../middleware/upload');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// ===== مسیر تست آپلود =====
router.post('/test-upload', auth, admin, uploadImages, (req, res) => {
  console.log('✅ تست آپلود موفق!');
  console.log('📝 Body:', req.body);
  console.log('📸 Files:', req.files);
  res.json({
    success: true,
    message: 'آپلود تست موفق!',
    files: req.files,
    body: req.body,
  });
});

// ===== مسیرهای عمومی =====
router.get('/', getProducts);
router.get('/:id', getProduct);

// ===== مسیرهای ادمین =====
router.post('/', auth, admin, uploadImages, createProduct);
router.put('/:id', auth, admin, uploadImages, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;