import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Upload, Trash2, Store, Phone, Mail, MapPin,
  Send, MessageCircle, Palette, Globe,
  Truck, Gift, Bell, Shield
} from 'lucide-react';
import api from '../../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const logoInputRef = useRef(null);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [settings, setSettings] = useState({
    siteName: 'مدآرنا',
    siteDescription: '',
    phone: '',
    email: '',
    address: '',
    instagram: '',
    telegram: '',
    whatsapp: '',
    shippingCost: 50000,
    freeShippingThreshold: 1000000,
    primaryColor: '#0B51F4',
    secondaryColor: '#2ECC71',
    heroTitle: 'improve your swag',
    heroSubtitle: '',
    maintenanceMode: false,
    allowRegistration: true,
    logo: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data.success) {
        setSettings(res.data.data);
        setLogoPreview(res.data.data.logo ? `http://localhost:5000${res.data.data.logo}` : '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showMessage('error', '❌ خطا در دریافت تنظیمات');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', '❌ فرمت لوگو پشتیبانی نمی‌شود');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', '❌ حجم لوگو بیشتر از ۵MB است');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setSettings(prev => ({ ...prev, logo: '' }));
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      
      Object.keys(settings).forEach(key => {
        if (key !== 'logo' && key !== '_id' && key !== '__v' && key !== 'updatedAt' && key !== 'createdAt') {
          formData.append(key, settings[key]);
        }
      });

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        showMessage('success', '✅ تنظیمات با موفقیت ذخیره شد');
        setSettings(res.data.data);
        if (res.data.data.logo) {
          setLogoPreview(`http://localhost:5000${res.data.data.logo}`);
        }
        setLogoFile(null);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', `❌ ${error.response?.data?.message || 'خطا در ذخیره تنظیمات'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B51F4] border-t-transparent"></div>
      </div>
    );
  }

  // ✅ تب‌ها با آیکون‌های موجود در lucide-react
  const tabs = [
    { id: 'general', label: 'اطلاعات فروشگاه', icon: Store },
    { id: 'contact', label: 'اطلاعات تماس', icon: Phone },
    { id: 'social', label: 'شبکه‌های اجتماعی', icon: Send },
    { id: 'appearance', label: 'ظاهر و رنگ', icon: Palette },
    { id: 'shipping', label: 'ارسال و پرداخت', icon: Truck },
    { id: 'system', label: 'تنظیمات سیستم', icon: Shield },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">تنظیمات فروشگاه</h1>
          <p className="text-white/60 text-sm mt-1">مدیریت کامل تنظیمات سایت</p>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl animate-fade-in ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-300'
            : 'bg-red-500/20 border border-red-500/30 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* تب‌ها */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition text-sm font-medium ${
              activeTab === tab.id
                ? 'bg-[#0B51F4] text-white shadow-lg shadow-[#0B51F4]/30'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        
        {/* ===== تب اطلاعات فروشگاه ===== */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Store size={20} className="text-[#0B51F4]" />
              اطلاعات فروشگاه
            </h2>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                لوگوی فروشگاه
              </label>
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#0B51F4] cursor-pointer flex items-center justify-center transition group overflow-hidden"
                >
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    className="hidden"
                  />
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="لوگو" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-white/40 group-hover:text-[#0B51F4] transition" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white/60 text-sm mb-2">
                    یک تصویر برای لوگوی فروشگاه انتخاب کنید
                  </p>
                  <p className="text-white/40 text-xs">
                    فرمت‌های مجاز: PNG, JPG, SVG - حداکثر ۵MB
                  </p>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="mt-2 text-sm text-red-400 hover:text-red-300 transition flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      حذف لوگو
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                نام فروشگاه <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                placeholder="مدآرنا"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                توضیحات فروشگاه
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                placeholder="توضیح کوتاه درباره فروشگاه..."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition resize-none"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                عنوان اصلی سایت (Hero)
              </label>
              <input
                type="text"
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                placeholder="improve your swag"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                زیرعنوان Hero
              </label>
              <textarea
                name="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={handleChange}
                placeholder="بهترین و کمیاب ترین لباس ها..."
                rows="2"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition resize-none"
              />
            </div>
          </div>
        )}

        {/* ===== تب اطلاعات تماس ===== */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Phone size={20} className="text-[#0B51F4]" />
              اطلاعات تماس
            </h2>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                شماره تماس
              </label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="info@example.com"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                آدرس
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                placeholder="تهران، خیابان..."
                rows="3"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition resize-none"
              />
            </div>
          </div>
        )}

        {/* ===== تب شبکه‌های اجتماعی ===== */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Send size={20} className="text-[#0B51F4]" />
              شبکه‌های اجتماعی
            </h2>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                اینستاگرام
              </label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                تلگرام
              </label>
              <input
                type="text"
                name="telegram"
                value={settings.telegram}
                onChange={handleChange}
                placeholder="https://t.me/username"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                واتساپ
              </label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="https://wa.me/989123456789"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              />
            </div>
          </div>
        )}

        {/* ===== تب ظاهر و رنگ ===== */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Palette size={20} className="text-[#0B51F4]" />
              ظاهر و رنگ‌بندی
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  رنگ اصلی
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleChange}
                    className="w-16 h-12 rounded-xl cursor-pointer border border-white/20"
                  />
                  <input
                    type="text"
                    name="primaryColor"
                    value={settings.primaryColor}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  رنگ ثانویه
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleChange}
                    className="w-16 h-12 rounded-xl cursor-pointer border border-white/20"
                  />
                  <input
                    type="text"
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-3">پیش‌نمایش رنگ‌ها:</p>
              <div className="flex gap-3">
                <div 
                  className="w-20 h-20 rounded-xl shadow-lg"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <div 
                  className="w-20 h-20 rounded-xl shadow-lg"
                  style={{ backgroundColor: settings.secondaryColor }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ===== تب ارسال و پرداخت ===== */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck size={20} className="text-[#0B51F4]" />
              ارسال و پرداخت
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  هزینه ارسال (تومان)
                </label>
                <input
                  type="number"
                  name="shippingCost"
                  value={settings.shippingCost}
                  onChange={handleChange}
                  placeholder="۵۰۰۰۰"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  ارسال رایگان از (تومان)
                </label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={settings.freeShippingThreshold}
                  onChange={handleChange}
                  placeholder="۱۰۰۰۰۰۰"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
                />
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
              <p className="text-blue-300 text-sm flex items-center gap-2">
                <Gift size={16} />
                سفارش‌های بالای {Number(settings.freeShippingThreshold).toLocaleString()} تومان ارسال رایگان دارند
              </p>
            </div>
          </div>
        )}

        {/* ===== تب تنظیمات سیستم ===== */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={20} className="text-[#0B51F4]" />
              تنظیمات سیستم
            </h2>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-yellow-400" />
                <div>
                  <p className="text-white font-medium">حالت تعمیر</p>
                  <p className="text-white/50 text-xs">با فعال کردن این گزینه، سایت در حالت تعمیر قرار می‌گیرد</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                className={`relative w-14 h-8 rounded-full transition ${
                  settings.maintenanceMode ? 'bg-yellow-500' : 'bg-white/20'
                }`}
              >
                <span 
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                    settings.maintenanceMode ? 'right-1' : 'right-7'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-green-400" />
                <div>
                  <p className="text-white font-medium">اجازه ثبت‌نام</p>
                  <p className="text-white/50 text-xs">کاربران جدید می‌توانند ثبت‌نام کنند</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, allowRegistration: !prev.allowRegistration }))}
                className={`relative w-14 h-8 rounded-full transition ${
                  settings.allowRegistration ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <span 
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                    settings.allowRegistration ? 'right-1' : 'right-7'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* دکمه ذخیره */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-4 bg-[#0B51F4] text-white rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
          <button
            type="button"
            onClick={fetchSettings}
            className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition"
          >
            بازگردانی
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;