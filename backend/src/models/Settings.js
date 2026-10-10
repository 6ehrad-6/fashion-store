const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // اطلاعات فروشگاه
  siteName: {
    type: String,
    default: 'مدآرنا',
  },
  siteDescription: {
    type: String,
    default: 'فروشگاه آنلاین لباس',
  },
  logo: {
    type: String,
    default: '',
  },
  
  // اطلاعات تماس
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  
  // شبکه‌های اجتماعی
  instagram: {
    type: String,
    default: '',
  },
  telegram: {
    type: String,
    default: '',
  },
  whatsapp: {
    type: String,
    default: '',
  },
  
  // تنظیمات فروشگاه
  shippingCost: {
    type: Number,
    default: 50000,
  },
  freeShippingThreshold: {
    type: Number,
    default: 1000000,
  },
  
  // تنظیمات ظاهری
  primaryColor: {
    type: String,
    default: '#0B51F4',
  },
  secondaryColor: {
    type: String,
    default: '#2ECC71',
  },
  
  // متون سایت
  heroTitle: {
    type: String,
    default: 'improve your swag',
  },
  heroSubtitle: {
    type: String,
    default: 'بهترین و کمیاب ترین لباس های استوک و وینتیج اورجینال',
  },
  
  // تنظیمات عمومی
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  allowRegistration: {
    type: Boolean,
    default: true,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);