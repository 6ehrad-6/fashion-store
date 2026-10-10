import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const Logo = ({ size = 'default', showText = true, className = '' }) => {
  const { settings } = useSettings();

  // اندازه‌ها
  const sizes = {
    small: { box: 'w-8 h-8', text: 'text-lg', sub: 'text-[8px]' },
    default: { box: 'w-12 h-12', text: 'text-2xl', sub: 'text-[10px]' },
    large: { box: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* اگر لوگو آپلود شده بود */}
      {settings.logo ? (
        <img
          src={`http://localhost:5000${settings.logo}`}
          alt={settings.siteName}
          className={`${currentSize.box} object-contain rounded-2xl`}
        />
      ) : (
        // ✅ لوگوی پیش‌فرض 6SwagDirT
        <div className="flex items-center gap-3">
          {/* آیکون 6 */}
          <div className={`${currentSize.box} bg-gradient-to-br from-[#0B51F4] to-[#4A90D9] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0B51F4]/30`}>
            <span className="text-white font-black text-xl">6</span>
          </div>
          
          {showText && (
            <div className="flex flex-col leading-tight">
              <div className={`${currentSize.text} font-extrabold tracking-tight`}>
                <span className="text-white">Swag</span>
                <span className="text-[#0B51F4]">Dir</span>
                <span className="text-white">T</span>
              </div>
              <span className={`${currentSize.sub} text-white/40 tracking-widest`}>FASHION</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;