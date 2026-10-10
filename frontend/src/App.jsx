import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext'; // ✅ اضافه شد
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer'; // ✅ اضافه شد
import ChromePattern from './components/ChromePattern';
import ProtectedRoute from './components/common/ProtectedRoute';

// صفحات اصلی
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import AllProducts from './pages/AllProducts';

// صفحات ادمین
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminUsers from './pages/Admin/Users';
import AdminOrders from './pages/Admin/Orders';
import AdminSettings from './pages/Admin/Settings';
import ProductForm from './pages/Admin/ProductForm';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B51F4] border-t-transparent"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B51F4]/10 to-[#2ECC71]/10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#0B51F4]/30 border-t-[#0B51F4] rounded-full animate-spin" />
          <p className="text-white/60 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <ChromePattern />
      <div className="relative z-10 flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* مسیرهای عمومی */}
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            } />
            
            {/* مسیرهای محافظت‌شده */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><AllProducts /></ProtectedRoute>} />
            <Route path="/category/:slug" element={<ProtectedRoute><Category /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            
            {/* مسیرهای ادمین */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* ✅ Footer - فقط در صفحات غیر ادمین نمایش داده شود */}
        <FooterShower />
      </div>
    </div>
  );
}

// کامپوننت کمکی برای مخفی کردن Footer در پنل ادمین
function FooterShower() {
  const location = window.location.pathname;
  const isAdminRoute = location.startsWith('/admin');
  
  if (isAdminRoute) return null;
  
  return <Footer />;
}

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;