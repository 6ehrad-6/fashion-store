import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Trash2, Plus } from 'lucide-react';
import api from '../../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const mainImageInputRef = useRef(null);
  const hoverImageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: 'tshirt',
    colors: [],
    sizes: [],
    stock: 10,
    discount: 0,
    isNew: false,
    isSale: false,
    isRare: false,
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [hoverImage, setHoverImage] = useState(null);
  const [hoverImagePreview, setHoverImagePreview] = useState('');
  const [existingImages, setExistingImages] = useState({ main: '', hover: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const product = res.data.data;
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() || '',
        category: product.category,
        colors: product.colors || [],
        sizes: product.sizes || [],
        stock: product.stock || 10,
        discount: product.discount || 0,
        isNew: product.isNew || false,
        isSale: product.isSale || false,
        isRare: product.isRare || false,
      });
      setExistingImages({
        main: product.mainImage || '',
        hover: product.hoverImage || '',
      });
      console.log('📸 تصاویر موجود:', product.mainImage, product.hoverImage);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('❌ خطا در دریافت اطلاعات محصول');
    }
  };

  const handleMainImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('❌ فرمت تصویر اصلی پشتیبانی نمی‌شود');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('❌ حجم تصویر اصلی بیشتر از ۱۰MB است');
      return;
    }

    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleHoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('❌ فرمت تصویر hover پشتیبانی نمی‌شود');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('❌ حجم تصویر hover بیشتر از ۱۰MB است');
      return;
    }

    setHoverImage(file);
    setHoverImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview('');
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const removeHoverImage = () => {
    setHoverImage(null);
    setHoverImagePreview('');
    if (hoverImageInputRef.current) {
      hoverImageInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()]
      }));
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()]
      }));
      setSizeInput('');
    }
  };

  const removeSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('❌ نام محصول الزامی است');
      setLoading(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('❌ قیمت محصول الزامی است');
      setLoading(false);
      return;
    }

    try {
      const productData = new FormData();
      
      productData.append('name', formData.name.trim());
      productData.append('description', formData.description || '');
      productData.append('price', formData.price.toString());
      productData.append('category', formData.category);
      productData.append('stock', formData.stock.toString());
      productData.append('discount', formData.discount.toString());
      productData.append('isNew', formData.isNew ? 'true' : 'false');
      productData.append('isSale', formData.isSale ? 'true' : 'false');
      productData.append('isRare', formData.isRare ? 'true' : 'false');
      
      if (formData.oldPrice) {
        productData.append('oldPrice', formData.oldPrice.toString());
      }
      
      productData.append('colors', JSON.stringify(formData.colors));
      productData.append('sizes', JSON.stringify(formData.sizes));

      if (mainImage) {
        productData.append('mainImage', mainImage);
        console.log('📸 تصویر اصلی جدید:', mainImage.name);
      }
      if (hoverImage) {
        productData.append('hoverImage', hoverImage);
        console.log('📸 تصویر hover جدید:', hoverImage.name);
      }

      let response;
      if (isEditing) {
        response = await api.put(`/products/${id}`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/products', productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        setSuccess(`✅ محصول با موفقیت ${isEditing ? 'ویرایش' : 'افزوده'} شد!`);
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      }
    } catch (error) {
      console.error('❌ خطا:', error);
      if (error.response?.data?.message) {
        setError(`❌ ${error.response.data.message}`);
      } else {
        setError('❌ خطا در ذخیره محصول. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? '✏️ ویرایش محصول' : '➕ افزودن محصول جدید'}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {isEditing ? 'اطلاعات محصول را ویرایش کنید' : 'اطلاعات محصول جدید را وارد کنید'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition"
        >
          <X size={18} />
          <span>بازگشت</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 animate-fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-300 animate-fade-in">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              نام محصول <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="مثال: تیشرت کلاسیک"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              دسته‌بندی <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
            >
              <option value="tshirt" className="text-gray-800">👕 تیشرت</option>
              <option value="pants" className="text-gray-800">👖 شلوار</option>
              <option value="jacket" className="text-gray-800">🧥 جکت</option>
              <option value="shoes" className="text-gray-800">👟 کفش</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              قیمت (تومان) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="۲۵۰۰۰۰"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              قیمت قبلی (تومان)
            </label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              placeholder="۳۵۰۰۰۰"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              تخفیف (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="۱۰"
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              موجودی <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="۱۰"
              min="0"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              required
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#0B51F4] focus:ring-[#0B51F4] cursor-pointer"
            />
            <label className="text-white/80 text-sm cursor-pointer">✨ محصول جدید</label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              name="isSale"
              checked={formData.isSale}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#0B51F4] focus:ring-[#0B51F4] cursor-pointer"
            />
            <label className="text-white/80 text-sm cursor-pointer">🔥 تخفیف ویژه</label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              name="isRare"
              checked={formData.isRare}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#0B51F4] focus:ring-[#0B51F4] cursor-pointer"
            />
            <label className="text-white/80 text-sm cursor-pointer">💎 کمیاب</label>
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            توضیحات محصول
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیحات کامل محصول را وارد کنید..."
            rows="4"
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition resize-none"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            رنگ‌های موجود
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="مثال: مشکی"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <button
              type="button"
              onClick={addColor}
              className="px-4 py-3 bg-[#0B51F4] text-white rounded-2xl hover:scale-105 transition"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color) => (
              <span
                key={color}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white text-sm"
              >
                <span 
                  className="w-3 h-3 rounded-full border border-white/20" 
                  style={{ 
                    backgroundColor: color === 'سفید' ? '#ffffff' : 
                                    color === 'مشکی' ? '#000000' : 
                                    color === 'قرمز' ? '#FF0000' :
                                    color === 'آبی' ? '#0000FF' :
                                    color === 'سبز' ? '#00FF00' :
                                    color === 'زرد' ? '#FFFF00' :
                                    color === 'نارنجی' ? '#FF8C00' :
                                    color === 'بنفش' ? '#800080' :
                                    color === 'صورتی' ? '#FF69B4' :
                                    color === 'قهوه‌ای' ? '#8B4513' :
                                    color === 'خاکستری' ? '#808080' :
                                    '#888888' 
                  }} 
                />
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="hover:text-red-400 transition"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            سایزهای موجود
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="مثال: M"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] transition"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            />
            <button
              type="button"
              onClick={addSize}
              className="px-4 py-3 bg-[#0B51F4] text-white rounded-2xl hover:scale-105 transition"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.sizes.map((size) => (
              <span
                key={size}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white text-sm"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="hover:text-red-400 transition"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              تصویر اصلی <span className="text-red-400">*</span>
            </label>
            
            <div 
              onClick={() => mainImageInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:border-[#0B51F4] transition group"
            >
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageSelect}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-white/40 group-hover:text-[#0B51F4] transition" />
              <p className="text-white/60 mt-2 group-hover:text-white transition text-sm">
                انتخاب تصویر اصلی
              </p>
              <p className="text-white/30 text-xs mt-1">
                فرمت‌های مجاز: JPG, PNG, WEBP, GIF
              </p>
            </div>

            {(mainImagePreview || existingImages.main) && (
              <div className="mt-3 relative">
                <img
                  src={mainImagePreview || `http://localhost:5000${existingImages.main}`}
                  alt="تصویر اصلی"
                  className="w-full h-48 object-cover rounded-xl border border-white/10"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:scale-110 transition"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
                <span className="absolute bottom-2 left-2 text-white/60 text-xs bg-black/50 px-2 py-0.5 rounded-full">
                  اصلی
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              تصویر hover <span className="text-red-400">*</span>
            </label>
            
            <div 
              onClick={() => hoverImageInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center cursor-pointer hover:border-[#0B51F4] transition group"
            >
              <input
                ref={hoverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleHoverImageSelect}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-white/40 group-hover:text-[#0B51F4] transition" />
              <p className="text-white/60 mt-2 group-hover:text-white transition text-sm">
                انتخاب تصویر hover
              </p>
              <p className="text-white/30 text-xs mt-1">
                فرمت‌های مجاز: JPG, PNG, WEBP, GIF
              </p>
            </div>

            {(hoverImagePreview || existingImages.hover) && (
              <div className="mt-3 relative">
                <img
                  src={hoverImagePreview || `http://localhost:5000${existingImages.hover}`}
                  alt="تصویر hover"
                  className="w-full h-48 object-cover rounded-xl border border-white/10"
                />
                <button
                  type="button"
                  onClick={removeHoverImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:scale-110 transition"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
                <span className="absolute bottom-2 left-2 text-white/60 text-xs bg-black/50 px-2 py-0.5 rounded-full">
                  hover
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-[#0B51F4] text-white rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? 'در حال ذخیره...' : isEditing ? 'ویرایش محصول' : 'افزودن محصول'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;