<div align="center">

# 🛍️ 6SwagDirT

### فروشگاه آنلاین لباس با طراحی مدرن

<img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-4.5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />

<br />
<br />

**یک فروشگاه آنلاین کامل و حرفه‌ای با React، Node.js و MongoDB**

[مشاهده امکانات](#-امکانات) • [نصب و راه‌اندازی](#-نصب-و-راه‌اندازی) • [ورود ادمین](#-ورود-به-پنل-مدیریت) • [تکنولوژی‌ها](#-تکنولوژیهای-استفاده-شده)

</div>

---

## 📖 درباره پروژه

**6SwagDirT** یک فروشگاه آنلاین لباس است که با **React** در فرانت‌اند و **Node.js + Express + MongoDB** در بک‌اند ساخته شده. این پروژه یک سیستم کامل فروشگاهی شامل **پنل مدیریت**، **سبد خرید**، **علاقه‌مندی‌ها**، **سیستم احراز هویت** و **پنل تنظیمات کامل** می‌باشد.

### 🎯 اهداف پروژه

- 🎨 طراحی مدرن و حرفه‌ای
- ⚡ عملکرد سریع و بهینه
- 🔒 امنیت بالا با JWT
- 📱 کاملاً واکنش‌گرا (Responsive)
- 🛒 تجربه خرید روان

---

## ⚡ شروع سریع

### 🔑 اطلاعات ورود ادمین

| | |
|---|---|
| 🌐 **آدرس ورود** | `http://localhost:5173/login` |
| 📧 **ایمیل** | `admin@fashion.com` |
| 🔑 **رمز عبور** | `Admin123!` |
| 🎯 **آدرس پنل ادمین** | `http://localhost:5173/admin` |

> 💡 برای مشاهده پنل مدیریت، پس از راه‌اندازی پروژه با این اطلاعات وارد شوید.

### 🚀 راه‌اندازی در ۵ دقیقه

```bash
# ۱. کلون پروژه
git clone https://github.com/6ehrad-6/fashion-store.git
cd fashion-store

# ۲. نصب وابستگی‌ها
cd backend
npm install

cd ../frontend
npm install

# ۳. تنظیم فایل .env
cd ../backend
cp .env.example .env
# فایل .env را با MongoDB URI خودتان ویرایش کنید

# ۴. اضافه کردن محصولات نمونه و ساخت ادمین
npm run seed
npm run create-admin

# ۵. اجرای پروژه

# ترمینال ۱ - بک‌اند:
npm run dev

# ترمینال ۲ - فرانت‌اند:
cd ../frontend
npm run dev