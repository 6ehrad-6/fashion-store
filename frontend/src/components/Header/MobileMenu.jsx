import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, ChevronRight, Heart, User, ShoppingBag, ChevronDown } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    { 
      name: 'تیشرت', 
      slug: 'tshirt', 
      icon: '👕',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    { 
      name: 'شلوار', 
      slug: 'pants', 
      icon: '👖',
      sizes: ['28', '30', '32', '34', '36', '38']
    },
    { 
      name: 'جکت', 
      slug: 'jacket', 
      icon: '🧥',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    { 
      name: 'کفش', 
      slug: 'shoes', 
      icon: '👟',
      sizes: ['38', '39', '40', '41', '42', '43', '44', '45']
    },
    { 
      name: 'کمیاب‌ترین‌ها', 
      slug: 'rare', 
      icon: '💎',
      isHot: true,
      isRare: true, // ✅ اضافه کردن این پراپ
      sizes: ['Limited', 'Special', 'Pre-order']
    },
  ];

  const toggleCategory = (slug) => {
    if (expandedCategory === slug) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(slug);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            منو
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-transform hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 pb-20">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug} className="border-b border-gray-50 last:border-0">
                <div className="flex items-center justify-between">
                  <NavLink
                    to={`/category/${cat.slug}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 flex-1 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700'
                          : 'hover:bg-gray-50'
                      }`
                    }
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                    {cat.isHot && (
                      <span className="text-[10px] bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                        🔥
                      </span>
                    )}
                  </NavLink>
                  
                  <button
                    onClick={() => toggleCategory(cat.slug)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-300 ${
                        expandedCategory === cat.slug ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {expandedCategory === cat.slug && (
                  <div className="mt-1 mr-4 mb-2 pr-4 border-r-2 border-purple-200">
                    {/* ✅ شرط: اگر isRare بود، "سایزهای" نمایش داده نشود */}
                    <p className="text-xs text-gray-400 mb-2 pr-4">
                      {cat.isRare ? '' : 'سایزهای موجود:'}
                    </p>
                    <div className="flex flex-wrap gap-2 pr-4">
                      {cat.sizes.map((size) => (
                        <NavLink
                          key={size}
                          to={`/category/${cat.slug}/size/${size}`}
                          onClick={onClose}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-purple-100 rounded-lg text-sm text-gray-600 hover:text-purple-600 transition"
                        >
                          {size}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <hr className="my-4" />

          <div className="space-y-1">
            <NavLink to="/wishlist" className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 rounded-xl transition group">
              <Heart size={20} className="group-hover:scale-110 transition" />
              <span>علاقه‌مندی‌ها</span>
            </NavLink>
            <NavLink to="/cart" className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 rounded-xl transition group">
              <ShoppingBag size={20} className="group-hover:scale-110 transition" />
              <span>سبد خرید</span>
            </NavLink>
            <NavLink to="/profile" className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 rounded-xl transition group">
              <User size={20} className="group-hover:scale-110 transition" />
              <span>حساب کاربری</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;