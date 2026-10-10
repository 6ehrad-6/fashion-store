import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const NO_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const productId = product?._id || product?.id;

  if (!product) return null;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  let mainImage = NO_IMAGE;
  if (product.mainImage) {
    const url = getImageUrl(product.mainImage);
    if (url) mainImage = url;
  } else if (product.images?.main) {
    const url = getImageUrl(product.images.main);
    if (url) mainImage = url;
  }

  let hoverImage = mainImage;
  if (product.hoverImage) {
    const url = getImageUrl(product.hoverImage);
    if (url) hoverImage = url;
  } else if (product.images?.hover) {
    const url = getImageUrl(product.images.hover);
    if (url) hoverImage = url;
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert('❌ این محصول موجود نیست!');
      return;
    }
    
    const success = addToCart(product, 'M', 'مشکی', 1);
    
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div 
      className="group relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${productId}`} className="block overflow-hidden relative">
        <div className="relative w-full h-64 overflow-hidden bg-[#2a2a2a]">
          <img
            src={mainImage}
            alt={product.name}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-all duration-700 ease-in-out ${
              isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            }`}
            onError={(e) => { e.target.src = NO_IMAGE; }}
          />
          <img
            src={hoverImage}
            alt={product.name}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-all duration-700 ease-in-out ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            onError={(e) => { e.target.src = NO_IMAGE; }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-[#0B51F4] text-white text-xs px-3 py-1 rounded-full animate-pulse shadow-lg shadow-[#0B51F4]/30">
              جدید
            </span>
          )}
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg shadow-red-500/30">
              {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-lg shadow-orange-500/30">
              {product.discount}% تخفیف
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg shadow-red-500/30">
              ناموجود
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 bg-white/10 backdrop-blur-md rounded-full shadow-md transform transition-all duration-300 z-10 ${
            isInWishlist(productId) ? 'scale-110' : 'scale-100'
          } hover:scale-110`}
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isInWishlist(productId) ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/product/${productId}`}>
          <h3 className="font-medium text-white hover:text-[#0B51F4] transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-white">{product.rating || 0}</span>
          <span className="text-xs text-white/40">({product.numReviews || 0})</span>
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
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || added}
          className="w-full mt-4 py-2.5 bg-[#0B51F4] text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          <ShoppingBag size={18} className="group-hover:rotate-6 transition" />
          {added ? 'اضافه شد ✓' : product.stock <= 0 ? 'ناموجود' : 'افزودن به سبد'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;