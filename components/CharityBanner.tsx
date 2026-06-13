import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export const CharityBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary-50/50 rounded-3xl overflow-hidden border border-secondary-100/80 shadow-md relative text-secondary">
          
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary-100/30 blur-2xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 md:p-12 lg:p-16 relative z-10">
            
            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-[0.25em] rounded-lg">
                <Heart size={12} className="fill-brand animate-pulse" />
                Community Impact
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] text-secondary">
                Doing good in your <span className="text-brand">neighborhood.</span>
              </h2>
              
              <p className="text-secondary-500 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                We believe in lifting up the communities we serve. That is why <span className="font-black text-secondary">5% of all sales</span> from every single job goes directly to local charities and neighborhood improvement projects.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/quote')}
                  className="group px-6 py-4 bg-secondary hover:bg-brand text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-secondary/15 hover:shadow-brand/20 hover:scale-[1.01]"
                >
                  Book With Purpose <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-[320px] md:max-w-[360px] lg:max-w-full rounded-2xl overflow-hidden border border-secondary-100 shadow-lg group">
                <img
                  src="/charity-people.png"
                  alt="Real community volunteers carrying donation box"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/5 to-transparent pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
