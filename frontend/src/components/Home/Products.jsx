import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import api from '../../services/api';

const Products = () => {
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      const products = res.data?.data || [];
      setDisplayProducts(products.slice(0, 4));
    } catch (error) {
      console.error('❌ خطا در دریافت محصولات:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="h-10 w-48 bg-white/10 rounded animate-pulse mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-shimmer rounded-2xl h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        
        {/* ===== هدر با دکمه زیبا ===== */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-[#0B51F4] animate-pulse" />
            <h2 className="text-3xl font-bold text-white">محصولات ویژه</h2>
          </div>
          
          {/* دکمه مشاهده همه - زیبا */}
          <Link 
            to="/products" 
            className="group relative overflow-hidden flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#0B51F4] to-[#4A90D9] text-white rounded-2xl font-medium shadow-lg shadow-[#0B51F4]/30 hover:shadow-2xl hover:shadow-[#0B51F4]/50 transition-all duration-500 hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative z-10">مشاهده همه</span>
            <ArrowLeft 
              size={20} 
              className="relative z-10 group-hover:-translate-x-1 transition-transform duration-300" 
            />
          </Link>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-white/60">هیچ محصولی یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <div
                key={product._id || product.id || index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;