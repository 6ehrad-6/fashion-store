import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // بارگذاری از localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // ذخیره در localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // ✅ اضافه/حذف از علاقه‌مندی‌ها
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        // حذف از علاقه‌مندی‌ها
        return prev.filter(item => item._id !== product._id);
      } else {
        // اضافه به علاقه‌مندی‌ها
        return [...prev, product];
      }
    });
  };

  // ✅ بررسی وجود محصول در علاقه‌مندی‌ها
  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  // ✅ حذف از علاقه‌مندی‌ها
  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };

  // ✅ خالی کردن علاقه‌مندی‌ها
  const clearWishlist = () => {
    if (wishlist.length === 0) return;
    if (window.confirm('آیا از حذف همه علاقه‌مندی‌ها مطمئن هستید؟')) {
      setWishlist([]);
    }
  };

  const value = {
    wishlist,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    clearWishlist,
    totalWishlist: wishlist.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};