import React from 'react';
import { BadgeCheck, Clock, MessageSquare, Phone, Star, Tag } from 'lucide-react';
import { JUNK_REMOVAL_MIN_PRICE } from '../lib/junkRemovalPricing';

interface HeroProps {
  onGetQuote: () => void;
  onBookOnline?: () => void;
}

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

const trustItems = [
  { icon: Tag, label: 'Upfront pricing' },
  { icon: Clock, label: 'Same-day crews' },
  { icon: BadgeCheck, label: 'Vetted providers' },
];

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onBookOnline }) => {
  return (
    <section className="home-hero relative overflow-hidden bg-[#f4eefc]" aria-labelledby="home-hero-heading">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
        {/* Copy */}
        <div className="home-hero-copy relative flex md:justify-end px-5 sm:px-6 lg:px-8 pt-7 pb-8 sm:pt-14 md:py-16 lg:py-20">
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
              <span className="md:hidden">
                Vetted local providers, often the same day. See your upfront price in about a minute.
              </span>
              <span className="hidden md:inline">
                Furniture, appliances, mattresses and more — picked up by vetted local providers, often the same day.
                See your upfront price online in about a minute.
              </span>
            </p>

            {/* Mobile actions */}
            <div className={`md:hidden mt-6 grid gap-2.5 ${onBookOnline ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <button type="button" onClick={onGetQuote} className="home-cta home-cta-invert home-hero-pair">
                Get pricing
              </button>
              {onBookOnline && (
                <button type="button" onClick={onBookOnline} className="home-hero-ghost home-hero-pair">
                  Book a pickup
                </button>
              )}
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
                  className="rounded-none text-[14px] font-bold uppercase tracking-wide text-[#520f96] underline underline-offset-4 decoration-2 hover:text-[#3a0a6b]"
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

            {/* Mobile trust row */}
            <ul className="md:hidden mt-6 grid grid-cols-3 border-t border-white/25 pt-5">
              {trustItems.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-1.5 text-center text-[11px] font-semibold leading-tight text-white">
                  <Icon size={20} strokeWidth={2.2} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual */}
        <div className="home-hero-visual home-image-backdrop relative min-h-[340px] sm:min-h-[440px] md:min-h-[540px] overflow-hidden">
          {/* Mobile rating ticket */}
          <div className="home-hero-ticket md:hidden" aria-hidden>
            <p className="home-display text-[22px] leading-none text-[#140a1f]">Rated 4.8</p>
            <span className="mt-1.5 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-[#520f96] text-[#520f96]" />
              ))}
            </span>
            <p className="mt-2 border-t border-dashed border-[#140a1f]/40 pt-1.5 font-mono text-[9px] font-bold uppercase tracking-wide text-[#140a1f]">
              Local pros near you
            </p>
          </div>
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
