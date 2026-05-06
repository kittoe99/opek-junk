import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onGetQuote: () => void;
  onBookOnline?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onBookOnline }) => {
  return (
    <section className="relative bg-white pt-32 md:pt-40 pb-20 md:pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">

          {/* Heading & CTA */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500 animate-fade-in">
              <span className="inline-block h-px w-8 bg-gray-300" />
              <span>Nationwide</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light text-gray-900 tracking-tight leading-[1.02] mb-8 animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Junk gone.
              <br />
              <span className="text-gray-400">Today.</span>
            </h1>

            <p
              className="text-base md:text-lg text-gray-500 mb-10 max-w-md leading-relaxed animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              Instant quotes. Same-day pickup. Trusted local pros.
            </p>

            <div
              className="flex flex-wrap items-center gap-6 animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <button
                onClick={onGetQuote}
                className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
              >
                Get a quote
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
              <button
                onClick={onBookOnline}
                className="text-sm font-medium text-gray-700 underline-offset-4 hover:text-gray-900 hover:underline transition-colors"
              >
                Book online
              </button>
            </div>
          </div>

          {/* Image */}
          <div
            className="lg:col-span-5 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src="/junk-removal.webp"
                alt="Professional junk removal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        {/* Stat strip */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-gray-200 grid grid-cols-3 gap-6 max-w-3xl">
          {[
            { k: 'Same-day', v: 'Pickup' },
            { k: '70%', v: 'Recycled' },
            { k: '50 states', v: 'Coverage' },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-xl md:text-2xl text-gray-900 font-light tracking-tight">
                {s.k}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-gray-500 mt-1">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};