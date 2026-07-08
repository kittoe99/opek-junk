import React from 'react';
import { Star } from 'lucide-react';

interface HeroProps {
  onGetQuote: () => void;
  onBookOnline?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onBookOnline }) => {
  const ratingBadge = (light?: boolean) => (
    <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className="text-[#00B67A] fill-[#00B67A]" />
        ))}
      </div>
      <span className={`text-sm font-semibold ${light ? 'text-white' : 'text-secondary'}`}>4.8</span>
      <span className={`text-sm ${light ? 'text-white/80' : 'text-secondary-400'}`}>average rating</span>
    </div>
  );

  return (
    <section className="hero-section relative bg-white overflow-hidden">

      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col">
        {/* Content area: background image + dark overlay, ends right at buttons */}
        <div
          className="relative pt-32 pb-10 px-4"
          style={{
            backgroundImage: 'url(/opek2.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } as React.CSSProperties}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10">
            <div className="mb-3 animate-fade-in">
              {ratingBadge(true)}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-[1.05] animate-slide-up" style={{animationDelay: '0.1s'}}>
              Junk gone.
              <br/>
              Today.
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Professional junk removal services nationwide. Get instant quotes and same-day service from trusted local providers.
            </p>
          </div>
        </div>

        {/* Buttons sit flush below the image background */}
        <div className="hero-mobile-cta flex flex-row animate-slide-up" style={{animationDelay: '0.3s'}}>
          <button
            onClick={onGetQuote}
            className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
          >
            View Pricing
          </button>
          <button
            onClick={onBookOnline}
            className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
          >
            Book Online
          </button>
        </div>
      </div>

      {/* Desktop layout — full-bleed image with floating card */}
      <div className="hidden lg:block relative min-h-[min(620px,calc(100vh-var(--site-header-height)))]">
        <img
          src="/opek2.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="relative z-10 flex items-center min-h-[min(620px,calc(100vh-var(--site-header-height)))] px-6 xl:px-12 py-16">
          <div className="max-w-7xl mx-auto w-full">
            <div
              className="hero-desktop-card bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(53,80,112,0.12)] p-10 xl:p-14 max-w-[34rem] animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              {ratingBadge()}
              <h1 className="font-serif text-[2.75rem] xl:text-5xl font-semibold text-secondary tracking-tight mb-5 leading-[1.1]">
                Here for the
                <br />
                heavy lifting.
              </h1>
              <p className="text-base xl:text-lg text-secondary-400 mb-8 leading-relaxed">
                Nationwide platform for on-demand junk removal, hauling, and cleanouts. Get instant quotes and same-day service from trusted local providers.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onGetQuote}
                  className="px-7 py-3.5 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 transition-colors duration-200 rounded-xl shadow-sm"
                >
                  Get a quote
                </button>
                {onBookOnline && (
                  <button
                    onClick={onBookOnline}
                    className="px-7 py-3.5 text-sm font-semibold text-secondary border border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50 transition-colors duration-200 rounded-xl"
                  >
                    Book online
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
