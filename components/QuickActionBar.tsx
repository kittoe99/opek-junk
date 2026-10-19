import React, { useState, useEffect } from 'react';
import { Phone, Calendar } from 'lucide-react';

interface QuickActionBarProps {
  onBookOnline: () => void;
  /** Light/purple styling for the homepage; other pages use the default dark bar. */
  variant?: 'dark' | 'light';
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onBookOnline, variant = 'dark' }) => {
  const light = variant === 'light';
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
      className={`quick-action-bar ${light ? 'home-quick-action' : ''} fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div
        className={`max-w-md md:max-w-lg mx-auto backdrop-blur-xl rounded-full px-2 py-2 flex items-center gap-1 ${
          light
            ? 'bg-white/95 border border-[#e4e0e8] shadow-[0_12px_36px_-10px_rgba(40,10,80,0.35)]'
            : 'bg-[#101014]/90 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,0,110,0.08),0_0_32px_-8px_rgba(255,0,110,0.35)]'
        }`}
      >
        <a
          href="tel:8313187139"
          className={`flex items-center justify-center gap-2 flex-1 md:flex-initial px-3 py-2.5 md:px-4 rounded-full transition-colors ${
            light ? 'text-[#140a1f] hover:bg-[#f2ecfa]' : 'text-neutral-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <span
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              light ? 'bg-[#f2ecfa]' : 'bg-white/5 border border-white/10'
            }`}
          >
            <Phone size={15} className={light ? 'text-[#520f96]' : 'text-brand'} />
          </span>
          <span className="font-semibold text-xs md:text-sm whitespace-nowrap">(831) 318-7139</span>
        </a>

        <div className={`w-px h-7 shrink-0 ${light ? 'bg-[#e4e0e8]' : 'bg-white/10'}`} />

        <button
          type="button"
          onClick={onBookOnline}
          className="ui-button ui-button--compact flex-1 md:flex-initial"
        >
          <Calendar size={15} className="shrink-0" />
          <span className="whitespace-nowrap text-xs md:text-sm">Book Online</span>
        </button>
      </div>
    </div>
  );
};
