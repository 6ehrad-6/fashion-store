const multer = require('multer');
const path = require('path');
const fs = require('fs');

// اطمینان از وجود پوشه uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تنظیمات ذخیره‌سازی
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'logo-' + uniqueSuffix + ext;
    console.log('📄 لوگو ذخیره شد:', filename);
    cb(null, filename);
  }
});

// فرمت‌های مجاز
const allowedTypes = [
  'image/jpeg', 'image/png', 'image/jpg', 
  'image/webp', 'image/gif', 'image/svg+xml'
];

// فیلتر فایل‌ها
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`فرمت ${file.mimetype} برای لوگو پشتیبانی نمی‌شود`), false);
  }
};

// تنظیمات multer برای لوگو
const uploadLogo = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Middleware برای آپلود لوگو
const uploadLogoMiddleware = uploadLogo.fields([
  { name: 'logo', maxCount: 1 }
]);

module.exports = uploadLogoMiddleware;