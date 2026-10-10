import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  CreditCard, Truck, Shield, Gift
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    totalItems,
    getTotalPrice,
    getShippingCost,
    getFinalTotal
  } = useCart();

  const totalPrice = getTotalPrice();
  const shippingCost = getShippingCost();
  const finalTotal = getFinalTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative inline-block">
              <div className="w-40 h-40 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center animate-float border border-white/20">
                <ShoppingBag size={64} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0B51F4] rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-[#0B51F4]/30">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mt-8 mb-4 text-white">سبد خرید خالی است!</h2>
            <p className="text-white/70 mb-8 text-lg">
              به نظر می‌رسد هنوز محصولی به سبد خرید اضافه نکرده‌اید.
            </p>
            
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B51F4] text-white rounded-2xl font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30"
            >
              شروع خرید
              <ArrowRight size={20} />
            </Link>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <Truck className="w-8 h-8 text-[#0B51F4] mx-auto" />
                <h4 className="font-medium mt-2 text-white">ارسال رایگان</h4>
                <p className="text-xs text-white/50">برای خرید بالای ۱ میلیون</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <Shield className="w-8 h-8 text-[#0B51F4] mx-auto" />
                <h4 className="font-medium mt-2 text-white">ضمانت بازگشت</h4>
                <p className="text-xs text-white/50">۷ روز ضمانت بازگشت کالا</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <Gift className="w-8 h-8 text-[#0B51F4] mx-auto" />
                <h4 className="font-medium mt-2 text-white">هدیه ویژه</h4>
                <p className="text-xs text-white/50">به ازای هر خرید بالای ۵۰۰ هزار</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-[#AAACB1] to-[#4E5055]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <ShoppingBag size={28} className="text-[#0B51F4]" />
            سبد خرید
            <span className="text-sm bg-[#0B51F4] text-white px-3 py-1 rounded-full">
              {totalItems} محصول
            </span>
          </h1>
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 transition flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">حذف همه</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 flex flex-col sm:flex-row gap-4 animate-fade-in border border-white/10"
              >
                <Link to={`/product/${item._id}`} className="sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.mainImage ? `http://localhost:5000${item.mainImage}` : 'https://via.placeholder.com/400'}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                </Link>

                <div className="flex-1 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Link to={`/product/${item._id}`}>
                      <h3 className="font-medium text-white hover:text-[#0B51F4] transition line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-white/60">رنگ: {item.selectedColor || 'مشکی'}</span>
                      <span className="text-sm text-white/60">|</span>
                      <span className="text-sm text-white/60">سایز: {item.selectedSize || 'M'}</span>
                      <span className="text-sm text-white/60">|</span>
                      <span className="text-sm text-white/60">موجودی: {item.stock}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-white">
                        {(item.price * item.quantity).toLocaleString()} تومان
                      </span>
                      {item.oldPrice && (
                        <span className="text-sm text-white/40 line-through">
                          {item.oldPrice.toLocaleString()} تومان
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/10">
                      <button
                        onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium text-sm text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor)}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-32 border border-white/10">
              <h3 className="text-xl font-bold mb-6 text-white">خلاصه سفارش</h3>

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">جمع کل محصولات</span>
                  <span className="font-medium text-white">{totalPrice.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">هزینه ارسال</span>
                  <span className="font-medium text-white">
                    {shippingCost === 0 ? (
                      <span className="text-green-400">رایگان</span>
                    ) : (
                      `${shippingCost.toLocaleString()} تومان`
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">مبلغ قابل پرداخت</span>
                  <span className="text-2xl font-bold text-white">
                    {finalTotal.toLocaleString()} تومان
                  </span>
                </div>
                {shippingCost === 0 && (
                  <p className="text-xs text-green-400 mt-1">
                    🚀 ارسال رایگان برای این سفارش
                  </p>
                )}
              </div>

              <button className="w-full mt-6 py-4 bg-[#0B51F4] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30 hover:shadow-[#0B51F4]/50 flex items-center justify-center gap-3 group">
                <CreditCard size={22} />
                <span>پرداخت نهایی</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-sm text-[#0B51F4] hover:text-[#0943c9] transition"
              >
                ← ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;