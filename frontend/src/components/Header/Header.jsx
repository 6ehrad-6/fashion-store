import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // ✅ تغییر نام به isHeaderVisible
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // تشخیص اینکه در مسیر ادمین هستیم یا نه
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      // تغییر سایه و شفافیت
      setIsScrolled(currentScrollY > 50);
      
      // منطق نمایش/مخفی کردن هدر
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setIsHeaderVisible(false); // اسکرول به پایین → مخفی
        } else {
          setIsHeaderVisible(true); // اسکرول به بالا → نمایش
        }
      } else {
        setIsHeaderVisible(true); // در بالای صفحه → همیشه نمایش
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader, { passive: true });
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  // اگر در مسیر ادمین هستیم، هدر را نمایش نده
  if (isAdminRoute) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isHeaderVisible 
          ? 'translate-y-0' 
          : '-translate-y-full'
      } ${
        isScrolled && isHeaderVisible
          ? 'bg-[#4E5055]/95 backdrop-blur-md shadow-2xl'
          : 'bg-[#4E5055]/80 backdrop-blur-sm'
      }`}
    >
      <TopBar />
      <MainHeader
        toggleMobileMenu={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      <Navigation />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;