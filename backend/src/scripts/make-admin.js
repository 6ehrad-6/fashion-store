const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const makeAdmin = async () => {
  try {
    // اتصال به دیتابیس
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // پیدا کردن کاربر با ایمیل مورد نظر
    const user = await User.findOne({ email: 'admin@fashion.com' });
    
    if (!user) {
      console.log('❌ کاربری با این ایمیل یافت نشد!');
      console.log('📝 لطفاً ابتدا از طریق سایت ثبت‌نام کنید.');
      process.exit(1);
    }

    // تغییر نقش به ادمین
    user.role = 'admin';
    await user.save();
    
    console.log(`✅ کاربر ${user.fullName} (${user.email}) به ادمین تبدیل شد!`);
    console.log('🔑 می‌توانید با اطلاعات زیر وارد شوید:');
    console.log(`📧 ایمیل: ${user.email}`);
    console.log(`🔐 رمز عبور: Admin123! (یا رمزی که ثبت کردید)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطا:', error.message);
    process.exit(1);
  }
};

makeAdmin();