import React from 'react';
import { Phone, Calendar } from 'lucide-react';

interface QuickActionBarProps {
  onBookOnline: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onBookOnline }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-500">
      <div className="bg-black text-white rounded-full shadow-2xl px-4 py-3 md:px-6 md:py-4 flex items-center justify-between md:justify-center gap-3 md:gap-4 border border-white/10 max-w-2xl mx-auto">
        {/* Phone Number */}
        <a 
          href="tel:8313187139"
          className="flex items-center gap-2 px-3 py-2 md:px-4 hover:bg-white/10 rounded-full transition-colors flex-1 md:flex-initial justify-center"
        >
          <Phone size={18} className="flex-shrink-0" />
          <span className="font-bold text-xs md:text-sm whitespace-nowrap">(831) 318-7139</span>
        </a>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20 hidden md:block" />

        {/* Book Online Button */}
        <button
          onClick={onBookOnline}
          className="flex items-center gap-2 px-4 py-2 md:px-6 bg-white text-black rounded-full font-bold text-xs md:text-sm hover:bg-gray-100 transition-colors flex-1 md:flex-initial justify-center"
        >
          <Calendar size={18} className="flex-shrink-0" />
          <span className="whitespace-nowrap">Book Online</span>
        </button>
      </div>
    </div>
  );
};
