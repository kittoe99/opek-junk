import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export const CharityBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-secondary px-3 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <div className="relative shrink-0 w-10 h-7 rounded overflow-hidden border border-white/20 shadow-md hidden sm:block">
          <img
            src="/charity-childrens-heart-clean.png"
            alt="Clean illustration of children holding a glowing heart"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="min-w-0 text-white text-[11px] md:text-xs font-black uppercase tracking-wide sm:tracking-wider leading-tight flex items-center gap-2">
          <Heart size={12} className="text-brand fill-brand animate-pulse shrink-0" />
          <span className="hidden sm:inline">Community Impact — We donate 5% of all sales to children's hospitals</span>
          <span className="sm:hidden">5% of sales goes to children's hospitals</span>
        </span>
        <button
          onClick={() => navigate('/quote')}
          className="group flex-shrink-0 rounded bg-brand px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-white hover:bg-brand-600 hover:shadow-lg transition-all duration-300 whitespace-nowrap inline-flex items-center gap-1"
        >
          Book With Purpose
          <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
