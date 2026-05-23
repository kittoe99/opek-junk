import React from 'react';
import { Lock, ShieldCheck, Star } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="bg-white border-b border-secondary-100 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          
          {/* Trustpilot */}
          <div className="flex items-center gap-3 cursor-default">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#00B67A] p-1 rounded-sm">
                  <Star size={14} className="text-white fill-white" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest text-secondary-500">Excellent 4.8</span>
              <span className="text-[10px] font-bold text-secondary">Based on 1,000+ reviews</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-secondary-100" />

          {/* Secure Payment */}
          <div className="flex items-center gap-3 cursor-default">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Lock size={18} className="text-[#635BFF]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary">Secure Payment</span>
              <span className="text-[10px] uppercase tracking-wider text-secondary-500 font-bold">Powered by Stripe</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-secondary-100" />

          {/* Damage Protection */}
          <div className="flex items-center gap-3 cursor-default">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <ShieldCheck size={18} className="text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary">Vetted Providers</span>
              <span className="text-[10px] uppercase tracking-wider text-secondary-500 font-bold">Same Day Service</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
