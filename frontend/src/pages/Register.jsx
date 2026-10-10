import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, error, setError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // اگر کاربر قبلاً لاگین کرده، به صفحه اصلی برود
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // بررسی قدرت رمز عبور
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');
    setError('');

    // بررسی تطابق رمز عبور
    if (password !== confirmPassword) {
      setLocalError('رمز عبور و تکرار آن مطابقت ندارند');
      setIsLoading(false);
      return;
    }

    try {
      // شبیه‌سازی درخواست به سرور
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const success = register(email, password, fullName);
      
      if (success) {
        // ثبت‌نام موفق - useEffect به خانه می‌برد
        setIsLoading(false);
      } else {
        // خطا از داخل تابع register می‌آید
        setLocalError(error || 'خطا در ثبت‌نام');
        setIsLoading(false);
      }
    } catch (err) {
      setLocalError('خطا در ارتباط با سرور');
      setIsLoading(false);
    }
  };

  const getStrengthText = () => {
    const texts = ['ضعیف', 'متوسط', 'خوب', 'قوی', 'بسیار قوی'];
    return texts[passwordStrength];
  };

  const getStrengthColor = () => {
    const colors = ['#FF4444', '#FF8800', '#FFCC00', '#44BB44', '#2ECC71'];
    return colors[passwordStrength];
  };

  // نمایش خطا
  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-br from-[#0B51F4]/10 via-[#4A90D9]/5 to-[#2ECC71]/10">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 animate-slide-up">
          
          {/* لوگو و عنوان */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl shadow-lg shadow-[#2ECC71]/30 mb-4 animate-float">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">ثبت‌نام</h1>
            <p className="text-white/60 mt-2">یک حساب کاربری جدید بسازید</p>
          </div>

          {/* نمایش خطا */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-sm animate-fade-in">
              {displayError}
            </div>
          )}

          {/* فرم */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* نام کامل */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                نام و نام خانوادگی
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#2ECC71] transition" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setLocalError('');
                    setError('');
                  }}
                  placeholder="علی رضایی"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition"
                  required
                />
              </div>
            </div>

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
              
              {/* نشانگر قدرت رمز عبور */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 rounded-full"
                        style={{ 
                          width: `${(passwordStrength / 4) * 100}%`,
                          background: getStrengthColor()
                        }}
                      />
                    </div>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: getStrengthColor() }}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    حداقل ۶ کاراکتر، شامل حروف و اعداد
                  </p>
                </div>
              )}
            </div>

            {/* تکرار رمز عبور */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                تکرار رمز عبور
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#2ECC71] transition" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setLocalError('');
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* دکمه ثبت‌نام */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-[#2ECC71]/30 hover:shadow-[#2ECC71]/50 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>ایجاد حساب کاربری</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* لینک ورود */}
          <div className="mt-6 text-center">
            <p className="text-white/60">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-[#0B51F4] hover:text-[#4A90D9] transition font-medium">
                وارد شوید
              </Link>
            </p>
          </div>

          {/* شرایط و قوانین */}
          <p className="mt-6 text-center text-xs text-white/40">
            با ثبت‌نام، شما شرایط و قوانین ما را می‌پذیرید
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;