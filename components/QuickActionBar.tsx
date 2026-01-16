import React from 'react';
import { Phone, Calendar } from 'lucide-react';

interface QuickActionBarProps {
  onBookOnline: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onBookOnline }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-500">
      <div className="bg-black text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4 border border-white/10">
        {/* Phone Number */}
        <a 
          href="tel:3035550199"
          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Phone size={18} />
          <span className="font-bold text-sm">(303) 555-0199</span>
        </a>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Book Online Button */}
        <button
          onClick={onBookOnline}
          className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-100 transition-colors"
        >
          <Calendar size={18} />
          <span>Book Online</span>
        </button>
      </div>
    </div>
  );
};
