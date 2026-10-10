const multer = require('multer');
const path = require('path');
const fs = require('fs');

// اطمینان از وجود پوشه uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 پوشه uploads ایجاد شد در:', uploadDir);
} else {
  console.log('📁 پوشه uploads وجود دارد در:', uploadDir);
}

// تنظیمات ذخیره‌سازی
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'mainImage' ? 'main' : 'hover';
    const filename = prefix + '-' + uniqueSuffix + ext;
    console.log(`📄 فایل ذخیره شد: ${filename}`);
    cb(null, filename);
  }
});

// لیست فرمت‌های مجاز
const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

// فیلتر فایل‌ها
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`فرمت ${file.mimetype} پشتیبانی نمی‌شود`), false);
  }
};

// تنظیمات multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// Middleware برای آپلود دو عکس
const uploadImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'hoverImage', maxCount: 1 }
]);

module.exports = uploadImages;