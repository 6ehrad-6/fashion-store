import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import api from '../services/api';

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = [
    { name: 'همه', slug: 'all', icon: '📦' },
    { name: 'تیشرت', slug: 'tshirt', icon: '👕' },
    { name: 'شلوار', slug: 'pants', icon: '👖' },
    { name: 'جکت', slug: 'jacket', icon: '🧥' },
    { name: 'کفش', slug: 'shoes', icon: '👟' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📤 دریافت همه محصولات...');
      
      const res = await api.get('/products');
      console.log('📦 پاسخ:', res.data);
      
      const products = res.data?.data || [];
      console.log(`✅ ${products.length} محصول دریافت شد`);
      
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('❌ خطا در دریافت محصولات:', error);
    } finally {
      setLoading(false);
    }
  };

  // فیلتر و مرتب‌سازی
  useEffect(() => {
    let result = [...allProducts];

    // فیلتر دسته‌بندی
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // فیلتر قیمت
    result = result.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    // مرتب‌سازی
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategory, sortBy, priceRange, allProducts]);

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 100000000 });
    setSortBy('default');
  };

  // پیجینیشن
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
        <div className="container mx-auto px-4 py-8">
          <div className="h-12 w-64 bg-white/10 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        
        {/* ===== هدر ===== */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🛍️</span>
              همه محصولات
            </h1>
            <p className="text-white/60 mt-1">
              {filteredProducts.length} محصول پیدا شد
            </p>
          </div>
          
          {/* دکمه فیلتر موبایل */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl border border-white/20 hover:bg-white/20 transition"
          >
            <Grid size={18} />
            <span>فیلترها</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* ===== سایدبار فیلتر ===== */}
          <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 sticky top-32 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
              <div className="p-6">
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-lg">فیلترها</h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-white/40 hover:text-white transition flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10"
                  >
                    <X size={14} />
                    پاک کردن
                  </button>
                </div>

                {/* دسته‌بندی */}
                <div className="mb-6">
                  <h4 className="text-sm text-white/60 mb-3">دسته‌بندی</h4>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-right px-3 py-2.5 rounded-xl transition text-sm flex items-center gap-2 ${
                          selectedCategory === cat.slug
                            ? 'bg-[#0B51F4] text-white shadow-lg shadow-[#0B51F4]/30'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span className="flex-1">{cat.name}</span>
                        {selectedCategory === cat.slug && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* محدوده قیمت */}
                <div className="mb-6">
                  <h4 className="text-sm text-white/60 mb-3">محدوده قیمت (تومان)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/40">حداقل</label>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
                        placeholder="۰"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/40">حداکثر</label>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
                        placeholder="۱۰۰۰۰۰۰۰۰"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden w-full py-3 bg-[#0B51F4] text-white rounded-xl font-medium hover:scale-105 transition"
                >
                  اعمال فیلترها
                </button>
              </div>
            </div>
          </div>

          {/* ===== لیست محصولات ===== */}
          <div className="flex-1">
            
            {/* مرتب‌سازی */}
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
                  <option value="default" className="text-gray-800">مرتب‌سازی پیش‌فرض</option>
                  <option value="newest" className="text-gray-800">جدیدترین</option>
                  <option value="price-low" className="text-gray-800">ارزان‌ترین</option>
                  <option value="price-high" className="text-gray-800">گران‌ترین</option>
                  <option value="rating" className="text-gray-800">بالاترین امتیاز</option>
                </select>
                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* محصولات */}
            {currentItems.length === 0 ? (
              <div className="text-center py-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-white/60 text-lg mb-4">محصولی با این فیلترها یافت نشد</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#0B51F4] text-white rounded-xl hover:scale-105 transition"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            ) : (
              <>
                <div className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                } gap-6`}>
                  {currentItems.map((product, index) => (
                    <div
                      key={product._id || product.id || index}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* پیجینیشن */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition border border-white/10"
                    >
                      قبلی
                    </button>
                    
                    <div className="flex gap-1.5">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition ${
                            currentPage === i + 1
                              ? 'bg-[#0B51F4] text-white shadow-lg shadow-[#0B51F4]/30'
                              : 'bg-white/10 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/20 border border-white/10'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition border border-white/10"
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;