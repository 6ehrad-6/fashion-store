import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Grid3x3 } from 'lucide-react';
import api from '../../services/api';

const Categories = () => {
const [categories, setCategories] = useState([
  { name: 'تیشرت', slug: 'tshirt', image: '', count: 0 },
  { name: 'شلوار', slug: 'pants', image: '', count: 0 },
  { name: 'جکت', slug: 'jacket', image: '', count: 0 },
  { name: 'کفش', slug: 'shoes', image: '', count: 0 },
]);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const res = await api.get('/products');
    const products = res.data?.data || [];
    
    setCategories(prev => prev.map(cat => {
      const categoryProducts = products.filter(p => p.category === cat.slug);
      const firstProduct = categoryProducts[0];
      
      return {
        ...cat,
        count: categoryProducts.length,
        // ✅ استفاده از اولین عکس محصول
        image: firstProduct?.mainImage 
          ? `http://localhost:5000${firstProduct.mainImage}`
          : cat.image,
      };
    }));
  } catch (error) {
    console.error('❌ خطا:', error);
  }
};

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        
        {/* ===== هدر با دکمه زیبا ===== */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Grid3x3 className="w-7 h-7 text-[#0B51F4]" />
            <h2 className="text-3xl font-bold text-white">دسته‌بندی‌ها</h2>
          </div>
          
          <Link 
            to="/products" 
            className="group relative overflow-hidden flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-2xl font-medium border-2 border-[#0B51F4]/50 hover:border-[#0B51F4] hover:bg-[#0B51F4]/20 transition-all duration-500 hover:scale-105"
          >
            <span className="relative z-10">مشاهده همه محصولات</span>
            <ArrowLeft 
              size={20} 
              className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300" 
            />
          </Link>
        </div>

        {/* ===== کارت‌های دسته‌بندی با عکس ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 hover:border-[#0B51F4]/50 transition-all duration-500 hover:scale-105 animate-fade-in shadow-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* ✅ عکس پس‌زمینه */}
              <div className="relative w-full h-72 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Category';
                  }}
                />

                {/* ✅ لایه تاری روی عکس */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* ✅ افکت آبی هنگام hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B51F4]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* ===== محتوای روی عکس ===== */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-2xl font-bold text-white mb-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                  {cat.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                    {cat.count} محصول
                  </span>
                  
                  <div className="flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>مشاهده</span>
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </div>

              {/* ===== دایره تزئینی ===== */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0B51F4]/30 rounded-full blur-3xl group-hover:bg-[#0B51F4]/50 transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;