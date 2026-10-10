import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      {/* حلقه‌های اصلی با ظاهر کرومی/فلزی */}
      {[...Array(12)].map((_, i) => {
        const size = 40 + i * 15; // اندازه‌های مختلف
        const left = Math.random() * 100; // موقعیت افقی تصادفی
        const top = Math.random() * 100; // موقعیت عمودی تصادفی
        const duration = 3 + Math.random() * 4; // سرعت متفاوت
        const delay = Math.random() * 5; // تاخیر متفاوت
        const scale = 0.8 + Math.random() * 0.6; // مقیاس متفاوت

        return (
          <div
            key={i}
            className="absolute rounded-full border-2 border-white/10 animate-float"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `scale(${scale})`,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`,
              boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.05)',
              borderColor: `rgba(255,255,255,${0.05 + Math.random() * 0.15})`,
              backdropFilter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* حلقه‌های کوچکتر برای عمق بیشتر */}
      {[...Array(20)].map((_, i) => {
        const size = 5 + i * 6;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 4 + Math.random() * 3;
        const delay = Math.random() * 6;

        return (
          <div
            key={`small-${i}`}
            className="absolute rounded-full bg-white/5 animate-pulse"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              boxShadow: '0 0 15px rgba(255,255,255,0.05)',
            }}
          />
        );
      })}

      {/* یک المان متمرکز شبیه به لوگوی قلب/فلزی */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-white/5 to-transparent blur-3xl animate-pulse" />
    </div>
  );
};

export default BackgroundPattern;