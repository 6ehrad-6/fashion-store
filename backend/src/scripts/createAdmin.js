const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('🔄 اتصال به دیتابیس...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ متصل شد');

    // ✅ خواندن اطلاعات از متغیرهای محیطی با مقادیر پیش‌فرض
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@fashion.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminFullName = process.env.ADMIN_FULLNAME || 'مدیر فروشگاه';
    
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log('⚠️ ادمین قبلاً وجود دارد');
      console.log('📧 ایمیل:', adminEmail);
      console.log('💡 برای تغییر رمز، از پنل مدیریت استفاده کنید');
      process.exit(0);
    }

    await User.create({
      fullName: adminFullName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('✅ ادمین با موفقیت ساخته شد');
    console.log('📧 ایمیل:', adminEmail);
    console.log('🔑 رمز عبور:', adminPassword);
    console.log('⚠️ لطفاً بعد از اولین ورود، رمز عبور را تغییر دهید');

    process.exit(0);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    process.exit(1);
  }
};

createAdmin();