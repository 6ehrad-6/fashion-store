import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, error, setError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // اگر کاربر قبلاً لاگین کرده، به صفحه اصلی برود
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    setError('');
    
    try {
      // شبیه‌سازی درخواست به سرور
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const success = login(email, password);
      
      if (success) {
        // لاگین موفق - useEffect به خانه می‌برد
        setIsLoading(false);
      } else {
        // خطا از داخل تابع login می‌آید
        setLocalError(error || 'ایمیل یا رمز عبور اشتباه است');
        setIsLoading(false);
      }
    } catch (err) {
      setLocalError('خطا در ارتباط با سرور');
      setIsLoading(false);
    }
  };

  // نمایش خطا (از state یا local)
  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-br from-[#0B51F4]/10 via-[#4A90D9]/5 to-[#2ECC71]/10">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 animate-slide-up">
          
          {/* لوگو و عنوان */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0B51F4] to-[#4A90D9] rounded-2xl shadow-lg shadow-[#0B51F4]/30 mb-4 animate-float">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">خوش آمدید!</h1>
            <p className="text-white/60 mt-2">وارد حساب کاربری خود شوید</p>
          </div>

          {/* نمایش خطا */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-sm animate-fade-in">
              {displayError}
            </div>
          )}

          {/* فرم */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ایمیل */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                ایمیل
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#0B51F4] transition" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError('');
                    setError('');
                  }}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* رمز عبور */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                رمز عبور
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#0B51F4] transition" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError('');
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* گزینه‌ها */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#0B51F4] focus:ring-[#0B51F4] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-white/60 group-hover:text-white transition">مرا به خاطر بسپار</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#2ECC71] hover:text-[#27AE60] transition">
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>

            {/* دکمه ورود */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#0B51F4] to-[#4A90D9] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-[#0B51F4]/30 hover:shadow-[#0B51F4]/50 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به حساب</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* لینک ثبت‌نام */}
          <div className="mt-6 text-center">
            <p className="text-white/60">
              حساب کاربری ندارید؟{' '}
              <Link to="/register" className="text-[#2ECC71] hover:text-[#27AE60] transition font-medium">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;