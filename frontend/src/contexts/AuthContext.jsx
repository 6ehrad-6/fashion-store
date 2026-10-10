import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // بررسی وضعیت لاگین در localStorage هنگام بارگذاری
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // تنظیم توکن در هدر axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ثبت‌نام کاربر جدید
  const register = async (email, password, fullName) => {
    setError('');
    
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName,
      });

      if (response.data.success) {
        const { data, token } = response.data;
        // ذخیره کاربر در state
        setUser(data);
        // ذخیره در localStorage
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', token);
        // تنظیم توکن در هدر axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      setError(error.response?.data?.message || 'خطا در ثبت‌نام');
      return false;
    }
  };

  // ورود کاربر
  const login = async (email, password) => {
    setError('');
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { data, token } = response.data;
        // ذخیره کاربر در state
        setUser(data);
        // ذخیره در localStorage
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', token);
        // تنظیم توکن در هدر axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      setError(error.response?.data?.message || 'ایمیل یا رمز عبور اشتباه است');
      return false;
    }
  };

  // خروج از حساب
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  // بروزرسانی پروفایل
  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      setError(error.response?.data?.message || 'خطا در بروزرسانی پروفایل');
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};