import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye, Filter } from 'lucide-react';
import api from '../../services/api';

const Products = () => {
  // State‌ها
  const [products, setProducts] = useState([]); // لیست محصولات
  const [loading, setLoading] = useState(true); // وضعیت لودینگ
  const [searchTerm, setSearchTerm] = useState(''); // عبارت جستجو
  const [categoryFilter, setCategoryFilter] = useState('all'); // فیلتر دسته‌بندی
  const [selectedProducts, setSelectedProducts] = useState([]); // محصولات انتخاب شده
  const [showDeleteModal, setShowDeleteModal] = useState(false); // نمایش مودال حذف
  const [productToDelete, setProductToDelete] = useState(null); // محصولی که قرار است حذف شود

  // دریافت محصولات از سرور
  useEffect(() => {
    fetchProducts();
  }, []);

  // تابع دریافت محصولات
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  // تابع حذف محصول
  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این محصول مطمئن هستید؟')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        setProductToDelete(null);
        setShowDeleteModal(false);
        alert('✅ محصول با موفقیت حذف شد!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ خطا در حذف محصول!');
      }
    }
  };

  // تابع حذف چندگانه
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('لطفاً حداقل یک محصول را انتخاب کنید');
      return;
    }
    
    if (window.confirm(`آیا از حذف ${selectedProducts.length} محصول انتخاب شده مطمئن هستید؟`)) {
      try {
        await Promise.all(
          selectedProducts.map(id => api.delete(`/products/${id}`))
        );
        setProducts(products.filter(p => !selectedProducts.includes(p._id)));
        setSelectedProducts([]);
        alert('✅ محصولات با موفقیت حذف شدند!');
      } catch (error) {
        console.error('Error deleting products:', error);
        alert('❌ خطا در حذف محصولات!');
      }
    }
  };

  // تابع انتخاب/عدم انتخاب محصول
  const toggleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // تابع انتخاب همه
  const selectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  // فیلتر محصولات بر اساس جستجو و دسته‌بندی
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // نمایش لودینگ
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B51F4] border-t-transparent"></div>
      </div>
    );
  }

  // دسته‌بندی‌ها برای فیلتر
  const categories = [
    { name: 'همه', slug: 'all' },
    { name: 'تیشرت', slug: 'tshirt' },
    { name: 'شلوار', slug: 'pants' },
    { name: 'جکت', slug: 'jacket' },
    { name: 'کفش', slug: 'shoes' },
    { name: 'کمیاب‌ترین‌ها', slug: 'rare' },
  ];

  return (
    <div className="p-6">
      {/* هدر صفحه */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت محصولات</h1>
          <p className="text-white/60 text-sm mt-1">
            {filteredProducts.length} محصول از {products.length} محصول
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* دکمه حذف چندگانه */}
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition"
            >
              <Trash2 size={18} />
              <span>حذف انتخاب‌شده ({selectedProducts.length})</span>
            </button>
          )}
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#0B51F4] text-white rounded-xl hover:scale-105 transition"
          >
            <Plus size={18} />
            <span>محصول جدید</span>
          </Link>
        </div>
      </div>

      {/* فیلترها و جستجو */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* جستجو */}
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="جستجوی محصولات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4]"
          />
        </div>

        {/* فیلتر دسته‌بندی */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
          <Filter size={18} className="text-white/40 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategoryFilter(cat.slug)}
              className={`px-3 py-1.5 rounded-xl text-sm transition ${
                categoryFilter === cat.slug
                  ? 'bg-[#0B51F4] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* لیست محصولات */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-right text-white/60 text-sm w-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#0B51F4] focus:ring-[#0B51F4] cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">تصویر</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">نام</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">دسته‌بندی</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">قیمت</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">تخفیف</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">موجودی</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-white/40">
                    محصولی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleSelectProduct(product._id)}
                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#0B51F4] focus:ring-[#0B51F4] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={product.images?.[0] || product.image || 'https://via.placeholder.com/50'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-white text-sm">{product.name}</td>
                    <td className="px-4 py-3 text-white/60 text-sm">
                      {product.category === 'tshirt' ? 'تیشرت' :
                       product.category === 'pants' ? 'شلوار' :
                       product.category === 'jacket' ? 'جکت' :
                       product.category === 'shoes' ? 'کفش' :
                       product.category === 'rare' ? 'کمیاب' : product.category}
                    </td>
                    <td className="px-4 py-3 text-white text-sm">{product.price.toLocaleString()} تومان</td>
                    <td className="px-4 py-3">
                      {product.discount > 0 ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          {product.discount}%
                        </span>
                      ) : (
                        <span className="text-white/40 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock > 10 ? 'bg-green-500/20 text-green-400' :
                        product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-2 hover:bg-[#0B51F4]/20 rounded-lg transition text-[#0B51F4]"
                          title="ویرایش"
                        >
                          <Edit size={18} />
                        </Link>
                        <Link
                          to={`/product/${product._id}`}
                          target="_blank"
                          className="p-2 hover:bg-white/10 rounded-lg transition text-white/40 hover:text-white"
                          title="مشاهده در سایت"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;