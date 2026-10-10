import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Heart, ShoppingBag, Minus, Plus, 
  Truck, Shield, RefreshCw, Share2, Check,
  X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  // ✅ State برای مودال تصویر
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const modalRef = useRef(null);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // ✅ لیست تصاویر برای اسلاید
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📤 دریافت محصول با ID:', id);
      
      const res = await api.get(`/products/${id}`);
      console.log('✅ پاسخ دریافت محصول:', res.data);
      
      if (res.data.success && res.data.data) {
        const productData = res.data.data;
        setProduct(productData);
        
        // ✅ ساخت لیست تصاویر (اصلی و hover)
        const imageList = [];
        if (productData.mainImage) {
          imageList.push({ src: productData.mainImage, type: 'main' });
        }
        if (productData.hoverImage) {
          imageList.push({ src: productData.hoverImage, type: 'hover' });
        }
        if (productData.images?.main) {
          imageList.push({ src: productData.images.main, type: 'main' });
        }
        if (productData.images?.hover) {
          imageList.push({ src: productData.images.hover, type: 'hover' });
        }
        
        // اگر تصویری وجود نداشت، یک placeholder اضافه کن
        if (imageList.length === 0) {
          imageList.push({ src: null, type: 'placeholder' });
        }
        
        setImages(imageList);
        
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } else {
        setError('محصول یافت نشد');
      }
    } catch (error) {
      console.error('❌ خطا در دریافت محصول:', error);
      setError('خطا در دریافت اطلاعات محصول');
    } finally {
      setLoading(false);
    }
  };



const handleAddToCart = () => {
  if (!product) return;
  
  if (product.stock <= 0) {
    alert('❌ این محصول موجود نیست!');
    return;
  }
  
  const success = addToCart(product, selectedSize, selectedColor, quantity);
  
  if (success) {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  }
};

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  // ✅ توابع کنترل مودال
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setZoomLevel(1);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  // ✅ زوم با اسکرول ماوس
  const handleWheel = (e) => {
    if (!isZooming) {
      setIsZooming(true);
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
      setTimeout(() => setIsZooming(false), 100);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-shimmer rounded-2xl h-96" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse" />
              <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
              <div className="h-12 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-24 w-full bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055] flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">❌ محصول یافت نشد</h2>
          <p className="text-white/60 mb-6">{error || 'محصول مورد نظر وجود ندارد'}</p>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-[#0B51F4] text-white rounded-xl hover:scale-105 transition"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = getImageUrl(product.mainImage) || getImageUrl(product.images?.main);
  const hoverImage = getImageUrl(product.hoverImage) || getImageUrl(product.images?.hover);

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
      <div className="container mx-auto px-4 py-8">
        {/* مسیر یابی */}
        <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
          <Link to="/" className="hover:text-[#0B51F4] transition">خانه</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-[#0B51F4] transition">
            {product.category === 'tshirt' ? 'تیشرت' : 
             product.category === 'pants' ? 'شلوار' :
             product.category === 'jacket' ? 'جکت' :
             product.category === 'shoes' ? 'کفش' :
             product.category === 'rare' ? 'کمیاب‌ترین‌ها' : 'سایر'}
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ===== بخش تصویر ===== */}
          <div>
            {/* ✅ تصویر اصلی با قابلیت کلیک */}
            <div 
              className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer group"
              onClick={() => openModal(0)}
            >
              <img
                src={getImageUrl(images[0]?.src) || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-[500px] object-contain group-hover:scale-105 transition duration-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
              {/* ✅ دکمه بزرگنمایی */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <ZoomIn size={16} />
                <span>برای بزرگنمایی کلیک کنید</span>
              </div>
            </div>

            {/* ✅ تصاویر کوچک زیر عکس اصلی (اسلاید) */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition flex-shrink-0 ${
                      index === 0 ? 'border-[#0B51F4]' : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => openModal(index)}
                  >
                    <img
                      src={getImageUrl(img.src) || 'https://via.placeholder.com/80x80?text=No+Image'}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                    {img.type === 'hover' && (
                      <span className="absolute bottom-1 right-1 text-[8px] bg-black/50 text-white px-1 rounded">
                        hover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== اطلاعات محصول ===== */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}
                    />
                  ))}
                  <span className="text-sm font-medium text-white ml-1">{product.rating || 0}</span>
                </div>
                <span className="text-sm text-white/40">({product.numReviews || 0} نظر)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-white">
                {product.price?.toLocaleString()} تومان
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xl text-white/40 line-through">
                  {product.oldPrice?.toLocaleString()} تومان
                </span>
              )}
            </div>

            <p className="text-white/70 leading-relaxed">{product.description}</p>

            {/* رنگ‌ها */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h4 className="font-medium text-white mb-2">رنگ: {selectedColor}</h4>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl border-2 transition ${
                        selectedColor === color
                          ? 'border-[#0B51F4] bg-[#0B51F4]/20 text-white'
                          : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* سایزها */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="font-medium text-white mb-2">سایز: {selectedSize}</h4>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl border-2 transition ${
                        selectedSize === size
                          ? 'border-[#0B51F4] bg-[#0B51F4]/20 text-white'
                          : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* تعداد */}
            <div>
              <h4 className="font-medium text-white mb-2">تعداد</h4>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 w-fit p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white/20 rounded-lg transition text-white"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-medium text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white/20 rounded-lg transition text-white"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* دکمه‌ها */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#0B51F4] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30 hover:shadow-[#0B51F4]/50 flex items-center justify-center gap-2 group"
              >
                {addedToCart ? (
                  <>
                    <Check size={22} className="animate-bounce" />
                    اضافه شد!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={22} className="group-hover:rotate-6 transition" />
                    افزودن به سبد خرید
                  </>
                )}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`py-4 px-6 rounded-2xl border-2 transition flex items-center justify-center gap-2 ${
                  isInWishlist(product._id)
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-white/20 text-white hover:border-[#0B51F4] hover:text-[#0B51F4]'
                }`}
              >
                <Heart size={22} className={isInWishlist(product._id) ? 'fill-red-500' : ''} />
                <span className="hidden sm:inline">
                  {isInWishlist(product._id) ? 'حذف از علاقه‌مندی' : 'علاقه‌مندی'}
                </span>
              </button>
              <button className="p-4 rounded-2xl border border-white/20 hover:bg-white/10 transition text-white">
                <Share2 size={22} />
              </button>
            </div>

            {/* مزایا */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="text-center">
                <Truck className="w-6 h-6 text-[#0B51F4] mx-auto" />
                <p className="text-xs text-white/60 mt-1">ارسال سریع</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-[#0B51F4] mx-auto" />
                <p className="text-xs text-white/60 mt-1">ضمانت کیفیت</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-[#0B51F4] mx-auto" />
                <p className="text-xs text-white/60 mt-1">بازگشت ۷ روزه</p>
              </div>
            </div>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/10">
          <div className="flex border-b border-white/10">
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition relative text-white ${
                  activeTab === tab
                    ? 'text-[#0B51F4] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0B51F4]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'description' && 'توضیحات'}
                {tab === 'reviews' && 'نظرات'}
                {tab === 'shipping' && 'ارسال و بازگشت'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <p className="text-white/70 leading-relaxed">
                {product.description || 'توضیحاتی برای این محصول ثبت نشده است.'}
              </p>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-8 text-white/60">
                <p>هنوز نظری برای این محصول ثبت نشده است.</p>
                <button className="mt-4 text-[#0B51F4] hover:text-[#0943c9] transition">
                  ثبت اولین نظر
                </button>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-4 text-white/70">
                <p>🚚 ارسال رایگان برای سفارش‌های بالای ۱ میلیون تومان</p>
                <p>📦 زمان تحویل: ۲ تا ۴ روز کاری</p>
                <p>🔄 ضمانت بازگشت کالا تا ۷ روز</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== مودال بزرگنمایی تصویر ===== */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* دکمه بستن */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
            >
              <X size={28} />
            </button>

            {/* دکمه‌های ناوبری */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* دکمه‌های زوم */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-3 bg-black/50 backdrop-blur-sm rounded-2xl p-3">
              <button
                onClick={zoomOut}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white"
                title="کوچک‌نمایی"
              >
                <ZoomOut size={22} />
              </button>
              <span className="text-white text-sm font-medium flex items-center px-3">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white"
                title="بزرگ‌نمایی"
              >
                <ZoomIn size={22} />
              </button>
            </div>

            {/* شمارنده تصاویر */}
            <div className="absolute top-4 left-4 z-10 text-white/60 text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded-xl">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* تصویر با قابلیت زوم */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onWheel={handleWheel}
            >
              <img
                src={getImageUrl(images[currentImageIndex]?.src) || 'https://via.placeholder.com/800x800?text=No+Image'}
                alt={product.name}
                className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x800?text=No+Image';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;