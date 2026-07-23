import React, { useState, useEffect } from 'react';
import { Phone, Calendar } from 'lucide-react';

interface QuickActionBarProps {
  onBookOnline: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onBookOnline }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsVisible(true);
        return;
      }

      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top < window.innerHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className={`quick-action-bar fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div className="max-w-md md:max-w-lg mx-auto bg-[#101014]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,0,110,0.08),0_0_32px_-8px_rgba(255,0,110,0.35)] px-2 py-2 flex items-center gap-1">
        <a
          href="tel:8313187139"
          className="flex items-center justify-center gap-2 flex-1 md:flex-initial px-3 py-2.5 md:px-4 text-neutral-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Phone size={15} className="text-brand" />
          </span>
          <span className="font-semibold text-xs md:text-sm whitespace-nowrap">(831) 318-7139</span>
        </a>

        <div className="w-px h-7 bg-white/10 shrink-0" />

        <button
          type="button"
          onClick={onBookOnline}
          className="flex items-center justify-center gap-2 flex-1 md:flex-initial px-4 py-2.5 md:px-5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors shadow-[0_0_20px_-4px_rgba(255,0,110,0.6)]"
        >
          <Calendar size={15} className="shrink-0" />
          <span className="whitespace-nowrap text-xs md:text-sm">Book Online</span>
        </button>
      </div>
    </div>
  );
};
