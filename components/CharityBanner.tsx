import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export const CharityBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-secondary py-8 md:py-10 overflow-hidden border-b border-secondary-800">
      {/* Background subtle glowing effect */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Left Side: Thumbnail Image + Text Copy */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-secondary-800">
              <img 
                src="/charity-childrens-heart-clean.png" 
                alt="Clean illustration of children holding a glowing heart" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Heart size={12} className="text-brand fill-brand animate-pulse" />
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Community Impact</span>
              </div>
              <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-wide leading-tight">
                Five percent. <span className="text-brand">For children's health.</span>
              </h3>
              <p className="text-white/60 text-xs font-medium">
                We donate 5% of all sales directly to children's hospitals.
              </p>
            </div>
          </div>

          {/* Right Side: CTA Button */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate('/quote')}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded bg-brand hover:bg-brand-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:shadow-xl transition-all duration-300 whitespace-nowrap"
            >
              <span>Book With Purpose</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
