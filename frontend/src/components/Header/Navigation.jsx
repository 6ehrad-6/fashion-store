import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Flame } from 'lucide-react';

const categories = [
  { 
    name: 'تیشرت', 
    slug: 'tshirt',
    icon: '👕',
    sub: [
      { name: 'اسمال (S)', size: 'S' },
      { name: 'مدیوم (M)', size: 'M' },
      { name: 'لارج (L)', size: 'L' },
      { name: 'اکسترالارج (XL)', size: 'XL' },
      { name: 'داکبل ایکس (XXL)', size: 'XXL' },
    ]
  },
  { 
    name: 'شلوار', 
    slug: 'pants',
    icon: '👖',
    sub: [
      { name: 'سایز ۲۸', size: '28' },
      { name: 'سایز ۳۰', size: '30' },
      { name: 'سایز ۳۲', size: '32' },
      { name: 'سایز ۳۴', size: '34' },
      { name: 'سایز ۳۶', size: '36' },
      { name: 'سایز ۳۸', size: '38' },
    ]
  },
  { 
    name: 'جکت', 
    slug: 'jacket',
    icon: '🧥',
    sub: [
      { name: 'اسمال (S)', size: 'S' },
      { name: 'مدیوم (M)', size: 'M' },
      { name: 'لارج (L)', size: 'L' },
      { name: 'اکسترالارج (XL)', size: 'XL' },
      { name: 'داکبل ایکس (XXL)', size: 'XXL' },
    ]
  },
  { 
    name: 'کفش', 
    slug: 'shoes',
    icon: '👟',
    sub: [
      { name: 'سایز ۳۸', size: '38' },
      { name: 'سایز ۳۹', size: '39' },
      { name: 'سایز ۴۰', size: '40' },
      { name: 'سایز ۴۱', size: '41' },
      { name: 'سایز ۴۲', size: '42' },
      { name: 'سایز ۴۳', size: '43' },
      { name: 'سایز ۴۴', size: '44' },
      { name: 'سایز ۴۵', size: '45' },
    ]
  },
  // ✅ "کمیاب‌ترین‌ها" به عنوان یک دسته‌بندی معمولی (بدون ساب‌منو)
  { 
    name: 'کمیاب‌ترین‌ها', 
    slug: 'rare',
    icon: '💎',
    isHot: true,
  },
];

const Navigation = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <nav className="hidden lg:block border-t border-white/10 bg-white/5 backdrop-blur-sm relative z-40">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center gap-1 py-2">
          {categories.map((cat) => (
            <li
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setHoveredCategory(cat.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <NavLink
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  `px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5 text-white ${
                    isActive
                      ? 'bg-[#0B51F4] text-white shadow-lg shadow-[#0B51F4]/30'
                      : 'hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                  {cat.isHot && (
                    <span className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                      <Flame size={12} />
                      🔥
                    </span>
                  )}
                  {cat.sub && <ChevronDown size={14} className="ml-1" />}
                </NavLink>

              {cat.sub && hoveredCategory === cat.slug && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 animate-fade-in z-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{cat.icon}</span>
                    <h4 className="font-bold text-sm text-gray-800">
                      سایزهای {cat.name}
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {cat.sub.map((sub) => (
                      <li key={sub.size}>
                        <NavLink
                          to={`/category/${cat.slug}/size/${sub.size}`}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#0B51F4]/10 text-sm text-gray-700 hover:text-[#0B51F4] transition-all group"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0B51F4] group-hover:bg-[#0B51F4] transition" />
                            {sub.name}
                          </span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <NavLink
                      to={`/category/${cat.slug}`}
                      className="block text-center text-sm text-[#0B51F4] hover:text-[#0943c9] transition font-medium"
                    >
                      مشاهده همه {cat.name}ها →
                    </NavLink>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;