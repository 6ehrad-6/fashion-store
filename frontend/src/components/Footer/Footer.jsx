import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Send, MessageCircle, 
  Heart, ArrowLeft, ShoppingBag
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import Logo from '../common/Logo';

const Footer = () => {
  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#3a3d42]/95 backdrop-blur-md border-t border-white/10 mt-20">
      {/* خط رنگی بالا */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B51F4] via-[#4A90D9] to-[#2ECC71]" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* ===== ستون اول: لوگو و توضیحات ===== */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo size="default" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {settings.siteDescription || 'بهترین و کمیاب ترین لباس های استوک و وینتیج اورجینال'}
            </p>
            
            {/* شبکه‌های اجتماعی */}
            <div className="flex gap-3">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-[#0B51F4] transition-all duration-300 hover:scale-110"
                  title="اینستاگرام"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              
              {settings.telegram && (
                <a
                  href={settings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-[#0B51F4] transition-all duration-300 hover:scale-110"
                  title="تلگرام"
                >
                  <Send size={20} />
                </a>
              )}
              
              {settings.whatsapp && (
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-[#2ECC71] transition-all duration-300 hover:scale-110"
                  title="واتساپ"
                >
                  <MessageCircle size={20} />
                </a>
              )}
            </div>
          </div>

          {/* ===== ستون دوم: دسترسی سریع ===== */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#0B51F4] rounded-full" />
              دسترسی سریع
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2 group">
                  <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition" />
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2 group">
                  <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition" />
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link to="/category/new" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2 group">
                  <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition" />
                  جدیدترین‌ها
                </Link>
              </li>
              <li>
                <Link to="/category/rare" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2 group">
                  <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition" />
                  کمیاب‌ترین‌ها 💎
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2 group">
                  <ArrowLeft size={14} className="opacity-0 group-hover:opacity-100 transition" />
                  سبد خرید
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== ستون سوم: دسته‌بندی‌ها ===== */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#0B51F4] rounded-full" />
              دسته‌بندی‌ها
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/tshirt" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2">
                  👕 تیشرت
                </Link>
              </li>
              <li>
                <Link to="/category/pants" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2">
                  👖 شلوار
                </Link>
              </li>
              <li>
                <Link to="/category/jacket" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2">
                  🧥 جکت
                </Link>
              </li>
              <li>
                <Link to="/category/shoes" className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-2">
                  👟 کفش
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== ستون چهارم: اطلاعات تماس ===== */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#0B51F4] rounded-full" />
              اطلاعات تماس
            </h3>
            <ul className="space-y-3">
              {settings.phone && (
                <li>
                  <a 
                    href={`tel:${settings.phone}`} 
                    className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#0B51F4]/20 transition">
                      <Phone size={16} />
                    </div>
                    <span dir="ltr">{settings.phone}</span>
                  </a>
                </li>
              )}
              
              {settings.email && (
                <li>
                  <a 
                    href={`mailto:${settings.email}`} 
                    className="text-white/60 hover:text-[#0B51F4] transition text-sm flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#0B51F4]/20 transition">
                      <Mail size={16} />
                    </div>
                    <span dir="ltr">{settings.email}</span>
                  </a>
                </li>
              )}
              
              {settings.address && (
                <li className="text-white/60 text-sm flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <span className="leading-relaxed">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ===== بخش پایین ===== */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm flex items-center gap-2">
            © {currentYear} تمامی حقوق برای 
            <span className="font-bold text-white/60">{settings.siteName || '6SwagDirT'}</span>
            محفوظ است.
          </p>
          
          <p className="text-white/40 text-sm flex items-center gap-2">
            ساخته شده با 
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            در ایران
          </p>
        </div>
      </div>

      {/* ✅ دکمه شناور سبد خرید (اختیاری) */}
      <Link
        to="/cart"
        className="fixed bottom-6 left-6 w-14 h-14 bg-[#0B51F4] text-white rounded-full shadow-2xl shadow-[#0B51F4]/40 flex items-center justify-center hover:scale-110 transition-all duration-300 z-40 md:hidden"
      >
        <ShoppingBag size={24} />
      </Link>
    </footer>
  );
};

export default Footer;