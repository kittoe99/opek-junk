import React from 'react';
import { ArrowRight, ChevronDown, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onGetQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pt-32 pb-20 md:pb-32">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Heading & CTA */}
          <div className="lg:col-span-7">
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Denver Metro</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight mb-6 leading-[1.05]">
              Junk gone.
              <br/>
              Today.
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Industrial-grade removal for the loads standard services won't touch. Same-day pickup across Greater Denver.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetQuote}
                className="px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
              >
                Get Quote Now
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth'})}
                className="px-10 py-4 text-base font-bold uppercase tracking-wider border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg"
              >
                Our Services
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1590650046871-92c887180603?q=80&w=2070&auto=format&fit=crop" 
                alt="Professional junk removal truck" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18}/>
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