import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';
import { JUNK_REMOVAL_MIN_PRICE } from '../lib/junkRemovalPricing';

interface HeroProps {
  onGetQuote: () => void;
  onBookOnline?: () => void;
}

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onBookOnline }) => {
  return (
    <section className="home-hero relative overflow-hidden bg-[#f4eefc]" aria-labelledby="home-hero-heading">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
        {/* Copy */}
        <div className="home-hero-copy relative flex md:justify-end px-5 sm:px-6 lg:px-8 pt-7 pb-8 sm:pt-14 md:py-16 lg:py-20">
          <div className="w-full max-w-[600px] md:pr-6 lg:pr-12 self-center">
            {/* Mobile badge */}
            <span className="home-hero-badge md:hidden">
              <img src="/opek-logo-white.png" alt="" className="h-[16px] w-auto" />
            </span>

            <p className="home-eyebrow mb-3 hidden md:block">Nationwide junk removal · All 50 states</p>
            <h1
              id="home-hero-heading"
              className="home-display text-[2.2rem] leading-[0.95] sm:text-[3.2rem] md:text-[2.4rem] lg:text-[3.3rem] xl:text-[3.5rem] text-[#140a1f]"
            >
              Junk hauled away
              <br />
              from only <span className="home-hero-price">${JUNK_REMOVAL_MIN_PRICE}</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] leading-relaxed text-[#2b2236] max-w-md">
              <span className="md:hidden">
                It’s easy to book junk removal online. Pick your items, see your upfront price, and a local crew hauls it
                away.
              </span>
              <span className="hidden md:inline">
                Furniture, appliances, mattresses and more — picked up by vetted local providers, often the same day.
                See your upfront price online in about a minute.
              </span>
            </p>

            {/* Mobile action */}
            <div className="md:hidden mt-7 flex justify-center">
              <button type="button" onClick={onGetQuote} className="home-hero-mobile-cta">
                Get pricing
              </button>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex mt-7 items-center gap-6">
              <button type="button" onClick={onGetQuote} className="home-cta min-w-[200px]">
                Get my price
              </button>
              {onBookOnline && (
                <button
                  type="button"
                  onClick={onBookOnline}
                  className="ui-button ui-button--secondary"
                >
                  Book a pickup
                </button>
              )}
            </div>

            <div className="hidden md:flex mt-6 flex-wrap gap-x-6 gap-y-2 text-[14px] font-semibold text-[#2b2236]">
              <a href={`tel:${SITE_PHONE}`} className="inline-flex items-center gap-2 hover:text-[#520f96]">
                <Phone size={16} className="text-[#520f96]" aria-hidden />
                Call {SITE_PHONE_DISPLAY}
              </a>
              <a href={`sms:${SITE_PHONE}`} className="inline-flex items-center gap-2 hover:text-[#520f96]">
                <MessageSquare size={16} className="text-[#520f96]" aria-hidden />
                Text us
              </a>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="home-hero-visual home-hero-photo relative min-h-[340px] sm:min-h-[440px] md:min-h-[540px] overflow-hidden">
          <img
            src="/optimized/hero-backgrounds/opek-crew-high-five.webp"
            alt="Two Opek providers in purple shirts high-fiving beside a junk removal truck on a residential street"
            fetchPriority="high"
            className="absolute bottom-0 left-[44%] -translate-x-1/2 h-[92%] w-auto max-w-none object-contain object-bottom select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Fine print (desktop) */}
      <div className="home-hero-fine-print relative z-10 hidden md:block bg-[#3a3340] text-white">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] sm:text-[12px] leading-snug">
          ${JUNK_REMOVAL_MIN_PRICE} order minimum for junk removal. Your final price is confirmed once your items are
          reviewed; heavy, bulky or specialty items may cost more. Services are performed by independent local providers.
          Availability and same-day service vary by area.
        </p>
      </div>
    </section>
  );
};
