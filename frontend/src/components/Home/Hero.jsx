import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const Hero = () => {
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#AAACB1] to-[#4E5055] py-20">
      {/* انیمیشن پس‌زمینه */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay animate-float delay-700" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium tracking-wider bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              🔥 {settings.siteName || 'تخفیف ویژه'}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0B51F4] to-white">
              {settings.heroTitle || 'improve your swag'}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {settings.heroSubtitle || 'بهترین و کمیاب ترین لباس های استوک و وینتیج اورجینال'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="group px-8 py-4 bg-[#0B51F4] text-white rounded-2xl font-medium hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#0B51F4]/30 hover:shadow-[#0B51F4]/50 flex items-center gap-2"
            >
              مشاهده محصولات
              <ArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/category/sale"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-medium hover:bg-white/20 transition-all hover:scale-105 flex items-center gap-2"
            >
              تخفیف‌های ویژه
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;