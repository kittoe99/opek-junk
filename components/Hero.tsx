import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onGetQuote: () => void;
  onBookOnline?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onBookOnline }) => {
  return (
    <section className="relative bg-white overflow-hidden">

      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col bg-white pt-28">
        <div className="px-6 py-6">
          <div className="mb-3 animate-fade-in">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400">Nationwide Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-secondary tracking-tight mb-4 leading-[1.05] animate-slide-up" style={{animationDelay: '0.1s'}}>
            Junk gone.
            <br/>
            Today.
          </h1>
          <p className="text-sm sm:text-base text-secondary-500 max-w-lg leading-relaxed mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Professional junk removal services nationwide. Get instant quotes and same-day service from trusted local providers.
          </p>
          <div className="flex flex-row gap-3 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <button
              onClick={onGetQuote}
              className="flex-1 px-4 py-3.5 text-xs font-black uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-xl shadow-md"
            >
              View Pricing
            </button>
            <button
              onClick={onBookOnline}
              className="flex-1 px-4 py-3.5 text-xs font-black uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-xl shadow-md"
            >
              Book Online
            </button>
          </div>
        </div>

        {/* Mascot Graphic container */}
        <div className="px-6 pb-10 flex justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
          <div className="w-full max-w-[280px] aspect-square flex items-center justify-center">
            <img
              src="/hero-provider.png"
              alt="Matched Service Provider Partner"
              className="w-full h-full object-contain p-0"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen flex-col items-center justify-center pt-40 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-12 gap-16 items-center">

            {/* Left Column */}
            <div className="col-span-7">
              <div className="mb-4 animate-fade-in">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Nationwide Service</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black text-secondary tracking-tight mb-6 leading-[1.05] animate-slide-up" style={{animationDelay: '0.1s'}}>
                Junk gone.
                <br/>
                Today.
              </h1>
              <p className="text-lg text-secondary mb-8 max-w-lg leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                Professional junk removal services nationwide. Get instant quotes and same-day service from trusted local providers.
              </p>
              <div className="flex flex-row gap-3 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <button
                  onClick={onGetQuote}
                  className="px-8 py-4 text-xs font-black uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-xl shadow-md hover:shadow-xl"
                >
                  View Pricing
                </button>
                <button
                  onClick={onBookOnline}
                  className="px-8 py-4 text-xs font-black uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-xl shadow-md hover:shadow-xl"
                >
                  Book Online
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="col-span-5 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="relative aspect-square flex items-center justify-center group">
                <img
                  src="/hero-provider.png"
                  alt="Matched Service Provider Partner"
                  className="w-full h-full object-contain p-0 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};