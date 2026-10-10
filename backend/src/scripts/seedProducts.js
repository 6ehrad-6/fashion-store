const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
require('dotenv').config();

const seedProducts = async () => {
  try {
    console.log('🔄 اتصال به دیتابیس...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ متصل شد');

    const dataPath = path.join(__dirname, '../../sample-products.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error('❌ فایل sample-products.json پیدا نشد!');
      process.exit(1);
    }

    const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`📦 ${products.length} محصول از فایل خوانده شد`);

    await Product.deleteMany({});
    console.log('🗑️ محصولات قبلی حذف شدند');

    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} محصول با موفقیت اضافه شد`);

    process.exit(0);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    process.exit(1);
  }
};

seedProducts();