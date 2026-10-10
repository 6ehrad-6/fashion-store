import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // بارگذاری از localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // ذخیره در localStorage و محاسبه مجموع
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setTotalItems(items);
    setTotalPrice(price);
  }, [cartItems]);

  // ✅ افزودن به سبد خرید با بررسی موجودی
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    if (product.stock <= 0) {
      alert('❌ این محصول موجود نیست!');
      return false;
    }

    const existingItem = cartItems.find(
      item => item._id === product._id && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
    );

    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > product.stock) {
      alert(`❌ فقط ${product.stock} عدد از این محصول موجود است!`);
      return false;
    }

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === product._id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          selectedSize: selectedSize || 'M',
          selectedColor: selectedColor || 'مشکی',
          quantity: quantity
        }
      ]);
    }
    
    return true;
  };

  // ✅ حذف از سبد خرید
  const removeFromCart = (productId, size, color) => {
    setCartItems(cartItems.filter(item =>
      !(item._id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color)
    ));
  };

  // ✅ بروزرسانی تعداد با بررسی موجودی
  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size, color);
      return;
    }

    const item = cartItems.find(
      i => i._id === productId && 
           i.selectedSize === size && 
           i.selectedColor === color
    );

    if (item) {
      if (newQuantity > item.stock) {
        alert(`❌ فقط ${item.stock} عدد از این محصول موجود است!`);
        return;
      }

      setCartItems(cartItems.map(i =>
        i._id === productId &&
        i.selectedSize === size &&
        i.selectedColor === color
          ? { ...i, quantity: newQuantity }
          : i
      ));
    }
  };

  // ✅ خالی کردن سبد خرید
  const clearCart = () => {
    if (cartItems.length === 0) return;
    if (window.confirm('آیا از حذف همه محصولات از سبد خرید مطمئن هستید؟')) {
      setCartItems([]);
    }
  };

  // ✅ محاسبه قیمت کل
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // ✅ محاسبه هزینه ارسال
  const getShippingCost = () => {
    const total = getTotalPrice();
    return total > 1000000 ? 0 : 50000;
  };

  // ✅ محاسبه مبلغ نهایی (بدون کد تخفیف)
  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost();
  };

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getShippingCost,
    getFinalTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};