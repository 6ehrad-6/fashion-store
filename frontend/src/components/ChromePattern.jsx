import React from 'react';

const ChromePattern = () => {
  // ایجاد یک آرایه از صلیب‌ها برای چیدمان شبکه‌ای (Pattern)
  const rows = 8;
  const cols = 10;
  const crosses = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // فاصله‌گذاری تصادفی برای ایجاد ظاهر طبیعی‌تر
      const xOffset = (Math.random() - 0.5) * 40;
      const yOffset = (Math.random() - 0.5) * 40;
      const rotation = Math.random() * 360;
      const scale = 0.7 + Math.random() * 0.6;
      
      crosses.push({
        id: `${i}-${j}`,
        left: (j / (cols - 1)) * 100 + xOffset * 0.2,
        top: (i / (rows - 1)) * 100 + yOffset * 0.2,
        rotation,
        scale,
        delay: (i + j) * 0.15, // تاخیر پله‌ای برای انیمیشن موج‌دار
      });
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      {/* لایه پس‌زمینه با بافت ظریف */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8A8D91] to-[#4E5055] opacity-50" />
      
      {/* پترن صلیب‌ها */}
      {crosses.map((cross) => (
        <div
          key={cross.id}
          className="absolute animate-float"
          style={{
            left: `${cross.left}%`,
            top: `${cross.top}%`,
            width: '60px',
            height: '60px',
            transform: `translate(-50%, -50%) rotate(${cross.rotation}deg) scale(${cross.scale})`,
            animationDelay: `${cross.delay}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
            opacity: 0.4 + Math.random() * 0.3,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          >
            {/* بدنه صلیب با گرادیان نقره‌ای/کرومی */}
            <path
              d="M35 0H65V35H100V65H65V100H35V65H0V35H35V0Z"
              fill="url(#chromeGradient)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            {/* هایلایت برای حالت فلزی */}
            <path
              d="M40 5H60V40H95V60H60V95H40V60H5V40H40V5Z"
              fill="url(#shineGradient)"
              opacity="0.3"
            />
            {/* یک جزئیات داخلی برای شبیه‌سازی طرح کراس */}
            <path
              d="M42 12H58V42H88V58H58V88H42V58H12V42H42V12Z"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              fill="none"
            />
            <defs>
              <linearGradient id="chromeGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="20%" stopColor="#F3F4F6" />
                <stop offset="50%" stopColor="#9CA3AF" />
                <stop offset="80%" stopColor="#D1D5DB" />
                <stop offset="100%" stopColor="#6B7280" />
              </linearGradient>
              <linearGradient id="shineGradient" x1="0.2" y1="0.2" x2="0.8" y2="0.8">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* نقاط ریز برای ایجاد عمق و بافت بیشتر */}
      {[...Array(50)].map((_, i) => (
        <div
          key={`dot-${i}`}
          className="absolute rounded-full animate-pulse-slow"
          style={{
            width: `${2 + Math.random() * 6}px`,
            height: `${2 + Math.random() * 6}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'rgba(255,255,255,0.2)',
            boxShadow: '0 0 5px rgba(255,255,255,0.1)',
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
};

export default ChromePattern;