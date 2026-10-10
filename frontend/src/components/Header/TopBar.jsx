import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const TopBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentText, setCurrentText] = useState(0);
  
  const messages = [
    '🔥 تخفیف ویژه تابستان تا ۵۰٪',
    '🚀 ارسال رایگان بالای ۱ میلیون تومان',
    '🎁 کد تخفیف ۱۰٪ برای اولین خرید',
  ];

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-[#0B51F4] text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay animate-pulse" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay animate-pulse delay-700" />
      </div>
      
      <div className="relative container mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex-1 text-center overflow-hidden">
          <div
            className="transition-transform duration-700 ease-in-out"
            style={{ transform: `translateY(-${currentText * 100}%)` }}
          >
            {messages.map((msg, index) => (
              <div key={index} className="h-6 flex items-center justify-center gap-2 text-sm font-medium text-white">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:rotate-180 transition-transform duration-500 text-white/80 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;