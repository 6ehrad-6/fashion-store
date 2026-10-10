import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, ShoppingBag, 
  Settings, LogOut, Menu, X, Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // بررسی صفحه‌نمایش موبایل
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // بررسی اینکه کاربر ادمین است
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'داشبورد' },
    { path: '/admin/products', icon: Package, label: 'محصولات' },
    { path: '/admin/users', icon: Users, label: 'کاربران' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'سفارشات' },
    { path: '/admin/settings', icon: Settings, label: 'تنظیمات' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
      {/* ===== سایدبار - سمت راست ===== */}
      <div 
        className={`fixed top-0 h-full bg-[#4E5055]/95 backdrop-blur-md border-l border-white/10 transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isMobile && !isSidebarOpen ? 'translate-x-full' : 'translate-x-0'}`}
        style={{ right: 0 }} // ✅ به جای right-0
      >
        {/* دکمه تاگل سایدبار */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full p-2 bg-white/10 rounded-xl text-white/60 hover:text-white transition flex items-center justify-center"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* لوگوی کوچک */}
        {isSidebarOpen && (
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-white font-bold text-lg text-center">پنل مدیریت</h2>
            <p className="text-white/40 text-xs text-center">فروشگاه مدآرنا</p>
          </div>
        )}

        {/* منوی اصلی */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-160px)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#0B51F4] text-white shadow-lg shadow-[#0B51F4]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title={!isSidebarOpen ? item.label : ''}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}

          {/* جداکننده */}
          <div className="border-t border-white/10 my-4"></div>

          {/* بازگشت به سایت */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-white/60 hover:text-white hover:bg-white/10"
            title={!isSidebarOpen ? 'بازگشت به سایت' : ''}
          >
            <Home size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">بازگشت به سایت</span>}
          </Link>

          {/* خروج */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/20"
            title={!isSidebarOpen ? 'خروج' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm">خروج</span>}
          </button>
        </nav>

        {/* نسخه */}
        {isSidebarOpen && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white/20 text-xs">نسخه 1.0.0</p>
          </div>
        )}
      </div>

      {/* ===== محتوای اصلی ===== */}
      <div 
        className={`flex-1 transition-all duration-300 min-h-screen ${
          isSidebarOpen ? 'mr-64' : 'mr-20'
        }`}
        style={{ marginRight: isSidebarOpen ? '16rem' : '5rem' }} // ✅ به جای ml
      >
        {/* هدر کوچک برای نمایش در موبایل */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <h1 className="text-white font-bold">پنل مدیریت</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/10 rounded-xl text-white"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* محتوای صفحات */}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;