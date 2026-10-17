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
        <div className="home-hero-copy relative flex md:justify-end px-4 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-14 md:py-16 lg:py-20">
          <div className="w-full max-w-[600px] md:pr-6 lg:pr-12 self-center">
            <p className="home-eyebrow mb-3">Nationwide junk removal · All 50 states</p>
            <h1
              id="home-hero-heading"
              className="home-display text-[2.2rem] leading-[0.95] sm:text-[3.2rem] md:text-[2.4rem] lg:text-[3.3rem] xl:text-[3.5rem] text-[#140a1f]"
            >
              Junk hauled away
              <br />
              from only ${JUNK_REMOVAL_MIN_PRICE}
            </h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] leading-relaxed text-[#2b2236] max-w-md">
              Furniture, appliances, mattresses and more — picked up by vetted local providers, often the same day.
              See your upfront price online in about a minute.
            </p>

            <div className="home-hero-actions mt-6 sm:mt-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <button type="button" onClick={onGetQuote} className="home-cta w-full sm:w-auto sm:min-w-[200px]">
                Get my price
              </button>
              {onBookOnline && (
                <button
                  type="button"
                  onClick={onBookOnline}
                  className="rounded-none self-center sm:self-auto text-[14px] font-bold uppercase tracking-wide text-[#520f96] underline underline-offset-4 decoration-2 hover:text-[#3a0a6b]"
                >
                  Book a pickup
                </button>
              )}
            </div>

            <div className="home-hero-contact mt-6 flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-[14px] font-semibold text-[#2b2236]">
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
        <div className="home-hero-visual home-image-backdrop relative min-h-[340px] sm:min-h-[440px] md:min-h-[540px] overflow-hidden">
          <img
            src="/home-transparent/hero-branded.png"
            alt="Two junk removal providers lifting a heavy tool chest together"
            className="absolute bottom-0 left-[44%] -translate-x-1/2 h-[92%] w-auto max-w-none object-contain object-bottom select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Fine print */}
      <div className="home-hero-fine-print relative z-10 bg-[#3a3340] text-white">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] sm:text-[12px] leading-snug">
          ${JUNK_REMOVAL_MIN_PRICE} order minimum for junk removal. Your final price is confirmed once your items are
          reviewed; heavy, bulky or specialty items may cost more. Services are performed by independent local providers.
          Availability and same-day service vary by area.
        </p>
      </div>
    </section>
  );
};
