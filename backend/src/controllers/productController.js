const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// ===== دریافت همه محصولات =====
exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, search, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصولات',
      error: error.message,
    });
  }
};

// ===== دریافت یک محصول =====
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }
    
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محصول',
      error: error.message,
    });
  }
};

// ===== ایجاد محصول جدید =====
exports.createProduct = async (req, res) => {
  try {
    console.log('📦 دریافت درخواست ایجاد محصول');
    console.log('📝 داده‌های دریافتی (body):', req.body);
    console.log('📸 فایل‌های دریافتی:', req.files);

    const productData = {
      name: req.body.name,
      description: req.body.description || '',
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock) || 0,
      discount: Number(req.body.discount) || 0,
      isNew: req.body.isNew === 'true',
      isSale: req.body.isSale === 'true',
      isRare: req.body.isRare === 'true',
      colors: [],
      sizes: [],
      mainImage: '',
      hoverImage: '',
    };

    if (req.body.oldPrice) {
      productData.oldPrice = Number(req.body.oldPrice);
    }

    if (req.body.colors) {
      try {
        productData.colors = JSON.parse(req.body.colors);
      } catch (e) {
        productData.colors = [];
      }
    }

    if (req.body.sizes) {
      try {
        productData.sizes = JSON.parse(req.body.sizes);
      } catch (e) {
        productData.sizes = [];
      }
    }

    if (req.files) {
      if (req.files.mainImage && req.files.mainImage[0]) {
        productData.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
        console.log('📸 عکس اصلی ذخیره شد:', productData.mainImage);
      }
      if (req.files.hoverImage && req.files.hoverImage[0]) {
        productData.hoverImage = `/uploads/${req.files.hoverImage[0].filename}`;
        console.log('📸 عکس hover ذخیره شد:', productData.hoverImage);
      }
    }

    console.log('📝 داده‌های نهایی:', JSON.stringify(productData, null, 2));

    const product = new Product(productData);
    await product.save();
    
    console.log('✅ محصول ایجاد شد با ID:', product._id);
    console.log('📸 تصاویر ذخیره شده در دیتابیس:', {
      mainImage: product.mainImage,
      hoverImage: product.hoverImage
    });

    res.status(201).json({
      success: true,
      message: 'محصول با موفقیت ایجاد شد',
      data: product,
    });
  } catch (error) {
    console.error('❌ خطا در ایجاد محصول:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'خطا در اعتبارسنجی داده‌ها',
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد محصول',
      error: error.message,
    });
  }
};

// ===== بروزرسانی محصول =====
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    console.log('📸 تصاویر قبل از بروزرسانی:', {
      mainImage: product.mainImage,
      hoverImage: product.hoverImage
    });

    const updateData = {
      name: req.body.name,
      description: req.body.description || '',
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock) || 0,
      discount: Number(req.body.discount) || 0,
      isNew: req.body.isNew === 'true',
      isSale: req.body.isSale === 'true',
      isRare: req.body.isRare === 'true',
    };

    if (req.body.oldPrice) {
      updateData.oldPrice = Number(req.body.oldPrice);
    }

    if (req.body.colors) {
      try {
        updateData.colors = JSON.parse(req.body.colors);
      } catch (e) {
        updateData.colors = [];
      }
    }

    if (req.body.sizes) {
      try {
        updateData.sizes = JSON.parse(req.body.sizes);
      } catch (e) {
        updateData.sizes = [];
      }
    }

    let imagesUpdated = false;
    
    if (req.files) {
      if (req.files.mainImage && req.files.mainImage[0]) {
        if (product.mainImage) {
          const oldMainPath = path.join(__dirname, '../../', product.mainImage);
          if (fs.existsSync(oldMainPath)) {
            fs.unlinkSync(oldMainPath);
            console.log('🗑️ تصویر اصلی قدیمی حذف شد');
          }
        }
        updateData.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
        imagesUpdated = true;
        console.log('📸 عکس اصلی جدید:', updateData.mainImage);
      }
      
      if (req.files.hoverImage && req.files.hoverImage[0]) {
        if (product.hoverImage) {
          const oldHoverPath = path.join(__dirname, '../../', product.hoverImage);
          if (fs.existsSync(oldHoverPath)) {
            fs.unlinkSync(oldHoverPath);
            console.log('🗑️ تصویر hover قدیمی حذف شد');
          }
        }
        updateData.hoverImage = `/uploads/${req.files.hoverImage[0].filename}`;
        imagesUpdated = true;
        console.log('📸 عکس hover جدید:', updateData.hoverImage);
      }
    }

    if (!imagesUpdated) {
      updateData.mainImage = product.mainImage;
      updateData.hoverImage = product.hoverImage;
      console.log('📸 تصاویر قبلی نگه داشته شدند');
    }

    console.log('📝 داده‌های بروزرسانی:', JSON.stringify(updateData, null, 2));

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('✅ محصول بروزرسانی شد با ID:', updatedProduct._id);
    console.log('📸 تصاویر بعد از بروزرسانی:', {
      mainImage: updatedProduct.mainImage,
      hoverImage: updatedProduct.hoverImage
    });

    res.json({
      success: true,
      message: 'محصول با موفقیت بروزرسانی شد',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی محصول',
      error: error.message,
    });
  }
};

// ===== حذف محصول =====
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'محصول یافت نشد',
      });
    }

    if (product.mainImage) {
      const mainPath = path.join(__dirname, '../../', product.mainImage);
      if (fs.existsSync(mainPath)) {
        fs.unlinkSync(mainPath);
      }
    }
    if (product.hoverImage) {
      const hoverPath = path.join(__dirname, '../../', product.hoverImage);
      if (fs.existsSync(hoverPath)) {
        fs.unlinkSync(hoverPath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'محصول با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف محصول',
      error: error.message,
    });
  }
};