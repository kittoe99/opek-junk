import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export const CharityBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Content Column - Editorial Style */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Community Impact</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight">
              Five percent.<br />
              <span className="text-brand">For the neighborhood.</span>
            </h2>
            
            <div className="w-12 h-0.5 bg-secondary-100" />
            
            <p className="text-secondary-500 text-base md:text-lg leading-relaxed max-w-xl font-medium">
              We believe junk removal can be a force for good. For every job completed, we donate 5% of the total sale to local community shelters, youth programs, and environmental cleanup projects. No formulas, no loopholes.
            </p>

            <div className="pt-2">
              <button 
                onClick={() => navigate('/quote')}
                className="group inline-flex items-center gap-3 text-xs font-black text-secondary uppercase tracking-[0.2em] hover:text-brand transition-colors duration-300"
              >
                <span>Book With Purpose</span>
                <div className="w-10 h-10 rounded-full bg-secondary-50 group-hover:bg-brand/10 flex items-center justify-center transition-colors">
                  <ArrowRight size={15} className="text-secondary group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Media Column - Asymmetrical Offset Layout */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[360px] md:max-w-[400px] aspect-square group">
              
              {/* Decorative Offset Frame */}
              <div className="absolute inset-0 bg-brand/5 border border-brand/10 rounded-3xl translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
              
              {/* Floating Certified Badge */}
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-white rounded-full shadow-2xl border border-secondary-100/80 flex flex-col items-center justify-center text-center p-2 z-20 rotate-[-12deg] group-hover:rotate-0 transition-transform duration-500 ease-out select-none">
                <Heart size={14} className="text-brand fill-brand animate-pulse mb-0.5" />
                <span className="text-base font-black text-secondary leading-none">5%</span>
                <span className="text-[7px] font-black text-secondary-400 uppercase tracking-widest mt-1">Donated</span>
              </div>
              
              {/* Main Photo Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-secondary-200/50 shadow-xl bg-secondary-50">
                <img
                  src="/charity-people.png"
                  alt="Real community volunteers carrying donation box"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
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
