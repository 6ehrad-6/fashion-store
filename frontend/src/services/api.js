import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// ✅ اضافه کردن لاگ برای دیباگ
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 [API] درخواست به:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 [API] پاسخ از:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ [API] خطا:', error.message);
    if (error.response) {
      console.error('📝 [API] وضعیت:', error.response.status);
      console.error('📝 [API] داده:', error.response.data);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;