import React, { useState, useEffect } from 'react';
import { Phone, Calendar } from 'lucide-react';

interface QuickActionBarProps {
  onBookOnline: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onBookOnline }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Apply visibility logic to mobile and tablet screens (< 1024px)
      if (window.innerWidth >= 1024) {
        setIsVisible(true);
        return;
      }

      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      // Hide the bar if the footer starts entering the viewport
      if (footerRect.top < window.innerHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial check
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
      <div className="bg-secondary-700 text-white rounded-full shadow-2xl px-4 py-3 md:px-6 md:py-4 flex items-center justify-between md:justify-center gap-3 md:gap-4 border border-white/10 max-w-2xl mx-auto">
        {/* Phone Number */}
        <a 
          href="tel:8313187139"
          className="flex items-center gap-2 px-3 py-2 md:px-4 hover:bg-white/10 rounded-full transition-colors flex-1 md:flex-initial justify-center"
        >
          <Phone size={18} className="flex-shrink-0 text-brand" />
          <span className="font-bold text-xs md:text-sm whitespace-nowrap">(831) 318-7139</span>
        </a>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20 hidden md:block" />

        {/* Book Online Button */}
        <button
          onClick={onBookOnline}
          className="flex items-center gap-2 px-4 py-2 md:px-6 bg-brand text-white rounded-full font-bold text-xs md:text-sm hover:bg-brand-600 transition-colors flex-1 md:flex-initial justify-center shadow-lg"
        >
          <Calendar size={18} className="flex-shrink-0 text-white" />
          <span className="whitespace-nowrap">Book Online</span>
        </button>
      </div>
    </div>
  );
};

