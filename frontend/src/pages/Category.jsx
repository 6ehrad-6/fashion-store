import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, List, ChevronDown } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import api from '../services/api';

const Category = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');

  const categoryNames = {
    tshirt: 'تیشرت',
    pants: 'شلوار',
    jacket: 'جکت',
    shoes: 'کفش',
    rare: 'کمیاب‌ترین‌ها',
    new: 'جدیدترین‌ها',
    sale: 'تخفیف‌ها'
  };

  const categoryIcons = {
    tshirt: '👕',
    pants: '👖',
    jacket: '🧥',
    shoes: '👟',
    rare: '💎',
    new: '✨',
    sale: '🔥'
  };

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📤 دریافت محصولات برای دسته:', slug);
      
      const res = await api.get('/products');
      console.log('📦 همه محصولات:', res.data);
      
      let allProducts = res.data?.data || [];
      
      // لاگ گرفتن از همه محصولات و وضعیت isRare
      console.log('📋 لیست محصولات و وضعیت کمیاب بودن:');
      allProducts.forEach(p => {
        console.log(`  - ${p.name}: isRare = ${p.isRare}`);
      });
      
      // فیلتر بر اساس دسته‌بندی
      let filtered = [];
      
      if (slug === 'new') {
        filtered = allProducts.filter(p => p.isNew === true);
      } else if (slug === 'sale') {
        filtered = allProducts.filter(p => p.oldPrice && p.oldPrice > p.price);
      } else if (slug === 'rare') {
        // فیلتر محصولات کمیاب
        filtered = allProducts.filter(p => p.isRare === true);
        console.log(`💎 محصولات کمیاب پیدا شد:`, filtered.length);
      } else {
        filtered = allProducts.filter(p => p.category === slug);
      }
      
      console.log(`🔍 محصولات فیلتر شده برای ${slug}:`, filtered.length);
      
      setProducts(filtered);
      setLoading(false);
    } catch (error) {
      console.error('❌ خطا در دریافت محصولات:', error);
      setLoading(false);
    }
  };

  // مرتب‌سازی
  useEffect(() => {
    let sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setProducts(sorted);
  }, [sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
        <div className="container mx-auto px-4 py-8">
          <div className="h-12 w-48 bg-white/10 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-shimmer rounded-2xl h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{categoryIcons[slug] || '📦'}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {categoryNames[slug] || slug}
            </h1>
            <p className="text-white/60 mt-1">
              {products.length} محصول پیدا شد
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid' 
                  ? 'bg-[#0B51F4] text-white shadow-lg shadow-[#0B51F4]/30' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list' 
                  ? 'bg-[#0B51F4] text-white shadow-lg shadow-[#0B51F4]/30' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <List size={18} />
            </button>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 text-sm cursor-pointer hover:bg-white/20 transition"
            >
              <option value="default" className="text-gray-800">مرتب‌سازی</option>
              <option value="price-low" className="text-gray-800">ارزان‌ترین</option>
              <option value="price-high" className="text-gray-800">گران‌ترین</option>
              <option value="rating" className="text-gray-800">بالاترین امتیاز</option>
            </select>
            <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-white/60">محصولی در این دسته‌بندی یافت نشد</p>
            <p className="text-white/40 text-sm mt-2">دسته‌بندی: {slug}</p>
            <Link 
              to="/" 
              className="mt-4 text-[#0B51F4] hover:text-[#0943c9] transition inline-block"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        ) : (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          } gap-6`}>
            {products.map((product, index) => (
              <div
                key={product._id || product.id || index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;