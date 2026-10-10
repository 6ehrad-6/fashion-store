import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const NO_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';

const Wishlist = () => {
  const { wishlist, toggleWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert('❌ این محصول موجود نیست!');
      return;
    }
    const success = addToCart(product, 'M', 'مشکی', 1);
    if (success) {
      alert('✅ محصول به سبد خرید اضافه شد!');
    }
  };

  // اگر لیست خالی است
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative inline-block">
              <div className="w-40 h-40 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center animate-float border border-white/20">
                <Heart size={64} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mt-8 mb-4 text-white">لیست علاقه‌مندی‌ها خالی است!</h2>
            <p className="text-white/70 mb-8 text-lg">
              هنوز هیچ محصولی را لایک نکرده‌اید.
            </p>
            
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B51F4] text-white rounded-2xl font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30"
            >
              شروع خرید
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
      <div className="container mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Heart size={28} className="text-red-500 fill-red-500" />
            علاقه‌مندی‌ها
            <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">
              {wishlist.length} محصول
            </span>
          </h1>
          <button
            onClick={clearWishlist}
            className="text-red-400 hover:text-red-300 transition flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <Trash2 size={18} />
            <span>حذف همه</span>
          </button>
        </div>

        {/* لیست محصولات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product, index) => {
            const mainImage = getImageUrl(product.mainImage) || NO_IMAGE;
            const productId = product._id || product.id;

            return (
              <div
                key={productId}
                className="group relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/10 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* تصویر */}
                <Link to={`/product/${productId}`} className="block overflow-hidden relative">
                  <div className="relative w-full h-64 overflow-hidden bg-[#2a2a2a]">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition duration-700"
                      onError={(e) => { e.target.src = NO_IMAGE; }}
                    />
                  </div>

                  {/* برچسب‌ها */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {product.isNew && (
                      <span className="bg-[#0B51F4] text-white text-xs px-3 py-1 rounded-full animate-pulse">
                        جدید
                      </span>
                    )}
                    {product.isRare && (
                      <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                        💎 کمیاب
                      </span>
                    )}
                    {product.stock <= 0 && (
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                        ناموجود
                      </span>
                    )}
                  </div>
                </Link>

                {/* دکمه حذف از علاقه‌مندی‌ها */}
                <button
                  onClick={() => removeFromWishlist(productId)}
                  className="absolute top-3 right-3 p-2.5 bg-red-500 rounded-full shadow-md transform transition-all duration-300 z-10 hover:scale-110"
                  title="حذف از علاقه‌مندی‌ها"
                >
                  <Heart size={18} className="fill-white text-white" />
                </button>

                {/* اطلاعات */}
                <div className="p-4">
                  <Link to={`/product/${productId}`}>
                    <h3 className="font-medium text-white hover:text-[#0B51F4] transition line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{product.rating || 0}</span>
                    <span className="text-xs text-white/40">({product.numReviews || 0} نظر)</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-white">
                      {product.price?.toLocaleString()} تومان
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-sm text-white/40 line-through">
                        {product.oldPrice?.toLocaleString()} تومان
                      </span>
                    )}
                  </div>

                  {/* دکمه‌ها */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="flex-1 py-2.5 bg-[#0B51F4] text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      <ShoppingBag size={18} className="group-hover:rotate-6 transition" />
                      {product.stock <= 0 ? 'ناموجود' : 'افزودن به سبد'}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(productId)}
                      className="p-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* دکمه بازگشت */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#0B51F4] hover:text-[#0943c9] transition"
          >
            <ArrowRight size={18} className="rotate-180" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;