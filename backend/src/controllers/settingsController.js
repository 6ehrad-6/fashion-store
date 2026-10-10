const Settings = require('../models/Settings');
const fs = require('fs');
const path = require('path');

// ===== دریافت تنظیمات =====
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('❌ Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت تنظیمات',
      error: error.message,
    });
  }
};

// ===== بروزرسانی تنظیمات =====
exports.updateSettings = async (req, res) => {
  try {
    console.log('📝 بروزرسانی تنظیمات');
    console.log('📋 Body:', req.body);
    console.log('📸 Files:', req.files);

    let settings = await Settings.getSettings();
    
    // لیست فیلدهای مجاز
    const allowedFields = [
      'siteName', 'siteDescription', 'phone', 'email', 'address',
      'instagram', 'telegram', 'whatsapp',
      'shippingCost', 'freeShippingThreshold',
      'primaryColor', 'secondaryColor',
      'heroTitle', 'heroSubtitle',
      'maintenanceMode', 'allowRegistration',
    ];
    
    // بروزرسانی فیلدهای مجاز
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });
    
    // تبدیل مقادیر عددی
    if (req.body.shippingCost !== undefined) {
      settings.shippingCost = Number(req.body.shippingCost);
    }
    if (req.body.freeShippingThreshold !== undefined) {
      settings.freeShippingThreshold = Number(req.body.freeShippingThreshold);
    }
    
    // تبدیل boolean
    if (req.body.maintenanceMode !== undefined) {
      settings.maintenanceMode = req.body.maintenanceMode === 'true' || req.body.maintenanceMode === true;
    }
    if (req.body.allowRegistration !== undefined) {
      settings.allowRegistration = req.body.allowRegistration === 'true' || req.body.allowRegistration === true;
    }
    
    // ✅ ذخیره لوگو اگر آپلود شده
    if (req.files && req.files.logo && req.files.logo[0]) {
      // حذف لوگوی قدیمی
      if (settings.logo) {
        const oldLogoPath = path.join(__dirname, '../../', settings.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
          console.log('🗑️ لوگوی قدیمی حذف شد');
        }
      }
      settings.logo = `/uploads/${req.files.logo[0].filename}`;
      console.log('📸 لوگوی جدید:', settings.logo);
    }
    
    settings.updatedAt = Date.now();
    await settings.save();
    
    console.log('✅ تنظیمات ذخیره شد');
    
    res.json({
      success: true,
      message: 'تنظیمات با موفقیت ذخیره شد',
      data: settings,
    });
  } catch (error) {
    console.error('❌ Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در بروزرسانی تنظیمات',
      error: error.message,
    });
  }
};