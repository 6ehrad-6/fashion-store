import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, User, ShoppingBag, Menu, X, Heart, 
  LogIn, ArrowRight, LogOut, Settings, UserCircle,
  LayoutDashboard
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { products } from '../../data/products';
import Logo from '../common/Logo';

const MainHeader = ({ toggleMobileMenu, isMenuOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const { settings } = useSettings();

  // بستن منو با کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // جستجوی کلمه به کلمه
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(term);
      const categoryMatch = product.category.toLowerCase().includes(term);
      const descMatch = product.description?.toLowerCase().includes(term);
      const colorMatch = product.colors?.some(color => 
        color.toLowerCase().includes(term)
      );
      
      return nameMatch || categoryMatch || descMatch || colorMatch;
    });

    setSearchResults(results);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && searchResults.length > 0) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchResults([]);
      setSearchTerm('');
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-20">
        {/* ===== لوگو ===== */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-transform hover:scale-110 text-white"
            aria-label="منوی موبایل"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="group">
            <Logo size="default" />
          </Link>
        </div>

        {/* ===== جستجو (دسکتاپ) ===== */}
        <div ref={searchRef} className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="جستجوی محصولات، برندها..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full px-6 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#0B51F4] focus:bg-white/20 transition-all duration-300 pr-24"
            />
            
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
              >
                <X size={18} />
              </button>
            )}
            
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#0B51F4] text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30"
            >
              <Search size={18} />
            </button>
          </form>

          {/* نتایج جستجو */}
          {isSearchOpen && searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-h-96 overflow-y-auto z-50 animate-fade-in">
              {searchResults.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-100">
                    {searchResults.length} نتیجه پیدا شد
                  </div>
                  {searchResults.slice(0, 6).map((product) => (
                    <button
                      key={product._id || product.id}
                      onClick={() => handleResultClick(product._id || product.id)}
                      className="w-full flex items-center gap-4 px-3 py-3 hover:bg-[#0B51F4]/10 rounded-xl transition group"
                    >
                      <img
                        src={product.mainImage ? `http://localhost:5000${product.mainImage}` : 'https://via.placeholder.com/50'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-[#0B51F4] transition text-right">
                          {product.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {product.category === 'tshirt' ? 'تیشرت' :
                             product.category === 'pants' ? 'شلوار' :
                             product.category === 'jacket' ? 'جکت' :
                             product.category === 'shoes' ? 'کفش' : ''}
                          </span>
                          <span className="text-sm font-bold text-[#0B51F4]">
                            {product.price?.toLocaleString()} تومان
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  <div className="px-3 py-2 border-t border-gray-100">
                    <button
                      onClick={handleSearch}
                      className="w-full py-2 text-sm text-[#0B51F4] hover:text-[#0943c9] transition font-medium"
                    >
                      مشاهده همه {searchResults.length} نتیجه →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">نتیجه‌ای یافت نشد</p>
                  <p className="text-xs text-gray-400 mt-1">کلمه دیگری را جستجو کنید</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== آیکون‌های کاربری ===== */}
        <div className="flex items-center gap-1">
          {/* جستجو موبایل */}
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition text-white"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={22} />
          </button>

          {/* علاقه‌مندی‌ها */}
          <Link to="/wishlist" className="relative p-2 hover:bg-white/10 rounded-full transition group text-white">
            <Heart size={22} className="group-hover:scale-110 transition" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-red-500/30">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* سبد خرید */}
          <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition group text-white">
            <ShoppingBag size={22} className="group-hover:scale-110 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0B51F4] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-lg shadow-[#0B51F4]/30">
                {totalItems}
              </span>
            )}
          </Link>

          {/* منوی کاربر */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-full transition text-white relative z-50"
              aria-label="حساب کاربری"
            >
              {isAuthenticated ? (
                <div className="w-8 h-8 bg-gradient-to-r from-[#0B51F4] to-[#4A90D9] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#0B51F4]/30">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              ) : (
                <User size={22} />
              )}
            </button>
            
            {/* منوی کشویی */}
            {isUserMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 animate-fade-in z-[999]">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0B51F4]/10 transition group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserCircle size={18} className="group-hover:text-[#0B51F4]" />
                      <span className="group-hover:text-[#0B51F4]">پروفایل</span>
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0B51F4]/10 transition group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart size={18} className="group-hover:text-[#0B51F4]" />
                      <span className="group-hover:text-[#0B51F4]">علاقه‌مندی‌ها</span>
                    </Link>
                    
                    {/* گزینه پنل مدیریت - فقط برای ادمین */}
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0B51F4]/10 transition group border-t border-gray-100 mt-1 pt-2"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={18} className="group-hover:text-[#0B51F4]" />
                        <span className="group-hover:text-[#0B51F4]">پنل مدیریت</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-red-500 group border-t border-gray-100 mt-1"
                    >
                      <LogOut size={18} className="group-hover:scale-110 transition" />
                      <span>خروج از حساب</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">حساب کاربری</p>
                      <p className="text-xs text-gray-500">وارد شوید یا ثبت‌نام کنید</p>
                    </div>
                    <Link 
                      to="/login" 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0B51F4]/10 transition group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LogIn size={18} className="group-hover:text-[#0B51F4]" />
                      <span className="group-hover:text-[#0B51F4]">ورود به حساب</span>
                      <ArrowRight size={14} className="mr-auto group-hover:translate-x-1 transition" />
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#2ECC71]/10 transition group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={18} className="group-hover:text-[#2ECC71]" />
                      <span className="group-hover:text-[#2ECC71]">ثبت‌نام</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* دکمه ورود/ثبت‌نام (دسکتاپ) */}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="hidden lg:block bg-[#0B51F4] text-white px-6 py-2.5 text-sm font-medium rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30"
            >
              ورود | ثبت‌نام
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="hidden lg:block bg-red-500/20 text-red-300 px-6 py-2.5 text-sm font-medium rounded-2xl hover:bg-red-500/30 transition-all duration-300"
            >
              خروج
            </button>
          )}
        </div>
      </div>

      {/* ===== جستجوی موبایل (کشویی) ===== */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 py-3 border-t border-white/10 bg-[#4E5055]/95">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی محصولات..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] pr-12"
              autoFocus
            />
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* نتایج جستجوی موبایل */}
          {searchTerm && searchResults.length > 0 && (
            <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-h-60 overflow-y-auto">
              {searchResults.slice(0, 5).map((product) => (
                <button
                  key={product._id || product.id}
                  onClick={() => handleResultClick(product._id || product.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition border-b border-white/5 last:border-0"
                >
                  <img
                    src={product.mainImage ? `http://localhost:5000${product.mainImage}` : 'https://via.placeholder.com/40'}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                    }}
                  />
                  <div className="flex-1 text-right">
                    <p className="text-sm text-white">{product.name}</p>
                    <p className="text-xs text-white/40">{product.price?.toLocaleString()} تومان</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainHeader;