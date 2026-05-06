import React from 'react';
import { Phone } from 'lucide-react';

interface QuickActionBarProps {
  onBookOnline: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onBookOnline }) => {
  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40">
      <div className="mx-auto max-w-md flex items-center justify-between gap-3 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full pl-5 pr-1.5 py-1.5 shadow-sm">
        <a
          href="tel:8313187139"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap"
        >
          <Phone size={14} strokeWidth={1.75} />
          <span>(831) 318-7139</span>
        </a>
        <button
          onClick={onBookOnline}
          className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
        >
          Book online
        </button>
      </div>
    </div>
  );
};
