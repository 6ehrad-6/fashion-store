const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('🔄 اتصال به دیتابیس...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ متصل شد');

    const adminEmail = 'admin@fashion.com';
    
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log('⚠️ ادمین قبلاً وجود دارد');
      console.log('📧 ایمیل:', adminEmail);
      console.log('🔑 رمز عبور: Admin123!');
      process.exit(0);
    }

    await User.create({
      fullName: 'مدیر فروشگاه',
      email: adminEmail,
      password: 'Admin123!',
      role: 'admin',
    });

    console.log('✅ ادمین با موفقیت ساخته شد');
    console.log('📧 ایمیل:', adminEmail);
    console.log('🔑 رمز عبور: Admin123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    process.exit(1);
  }
};

createAdmin();