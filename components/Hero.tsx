import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onGetQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pt-24 pb-12 md:pt-32 md:pb-32">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Heading & CTA */}
          <div className="lg:col-span-7">
            <div className="mb-4 animate-fade-in">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Nationwide Service</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight mb-4 md:mb-6 leading-[1.05] animate-slide-up" style={{animationDelay: '0.1s'}}>
              Junk gone.
              <br/>
              Today.
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-lg leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Professional junk removal services nationwide. Get instant quotes and same-day service from trusted local providers.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <button 
                onClick={onGetQuote}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300 rounded-lg shadow-md hover:shadow-xl"
              >
                View Pricing
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth'})}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border border-black text-black bg-white hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
              >
                Book Online
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="lg:col-span-5 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 group">
              <img 
                src="/junk-removal.png" 
                alt="Professional junk removal truck" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18} className="animate-pulse"/>
                  <span className="text-sm font-bold">Fully Insured • 70% Recycled • Same-Day Available</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-12 md:bottom-40 left-1/2 transform -translate-x-1/2 text-white/10 lg:hidden">
        <ChevronDown size={32} className="animate-bounce" />
      </div>
    </section>
  );
};