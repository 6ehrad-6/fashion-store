const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    const user = await User.findOne({ email: 'admin@fashion.com' });
    
    if (!user) {
      console.log('❌ کاربری با این ایمیل یافت نشد!');
      process.exit(1);
    }

    console.log(`📧 ایمیل: ${user.email}`);
    console.log(`👤 نام: ${user.fullName}`);
    console.log(`🎯 نقش: ${user.role}`);
    console.log(`📅 تاریخ ثبت‌نام: ${user.createdAt}`);
    
    if (user.role === 'admin') {
      console.log('✅ این کاربر ادمین است!');
    } else {
      console.log('⚠️ این کاربر ادمین نیست!');
      console.log('🔄 برای تبدیل به ادمین، اسکریپت make-admin.js را اجرا کنید.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    process.exit(1);
  }
};

checkAdmin();