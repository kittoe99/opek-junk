import React from 'react';
import { ArrowRight, MapPin, MessageSquare, Phone, Star } from 'lucide-react';

interface HeroProps {
  onGetQuote: () => void;
  onBookOnline?: () => void;
}

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

const tickerItems = [
  'Furniture Removal',
  'Appliance Hauling',
  'Mattress Pickup',
  'Estate Cleanouts',
  'Dumpster Rental',
  'Construction Debris',
  'Garage Cleanouts',
  'Same-Day Crews',
  'All 50 States',
  'Upfront Flat-Rate Pricing',
];

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onBookOnline }) => {
  return (
    <section className="relative overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 bg-dark-grid [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" aria-hidden />
      <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-brand/20 blur-[140px] animate-glow-pulse" aria-hidden />
      <div className="absolute bottom-[-20%] left-[-10%] h-[380px] w-[380px] rounded-full bg-brand/10 blur-[130px]" aria-hidden />
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" aria-hidden />

      <div className="relative z-10 px-4 sm:px-8 lg:px-14 xl:px-20 pt-10 pb-14 sm:pt-14 md:pt-16 md:pb-16">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-8 md:gap-6 lg:gap-10">
          {/* Copy */}
          <div className="relative z-10 max-w-xl md:max-w-none">
            <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3 sm:mb-4 animate-fade-in-up">
              Nationwide Junk Removal — All 50 States
            </p>

            <h1 className="font-sans font-extrabold text-[2.35rem] sm:text-[3.2rem] md:text-[3.5rem] lg:text-[3.85rem] leading-[1.06] tracking-tight text-white mb-4 sm:mb-5 animate-fade-in-up delay-100">
              Fast Junk Disposal
              <br className="hidden sm:block" /> Nationwide
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-5 animate-fade-in-up delay-150">
              <div className="flex items-center gap-0.5" aria-label="4.8 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-brand fill-brand" />
                ))}
              </div>
              <a
                href="#testimonials"
                className="text-[13px] sm:text-sm font-semibold text-[var(--text)] hover:text-brand transition-colors"
              >
                4.8 · Top-rated local providers →
              </a>
            </div>

            <p className="text-[14px] sm:text-base md:text-lg leading-relaxed text-[var(--text-muted)] mb-6 sm:mb-7 max-w-md animate-fade-in-up delay-200">
              Don&apos;t stress the mess! Affordable junk hauling nationwide is just a click away.
            </p>

            <div className="mb-5 sm:mb-6 animate-fade-in-up delay-250">
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] sm:text-[15px] font-bold text-[var(--text)] leading-tight">
                    Easy upfront pricing online!
                  </p>
                  <p className="text-[12px] sm:text-[13px] text-[var(--text-muted)] mt-0.5">
                    Select an option to start your custom quote.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch sm:items-start gap-4 animate-fade-in-up delay-300">
              <button
                type="button"
                onClick={onGetQuote}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 sm:px-9 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-bold text-white transition-all hover:bg-brand-600 shadow-[0_0_28px_-6px_rgba(255,0,110,0.7)] hover:shadow-[0_0_38px_-4px_rgba(255,0,110,0.85)] border-2 border-white/10"
              >
                Get Online Price
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px flex-1 bg-white/10" aria-hidden />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Or
                  </span>
                  <span className="h-px flex-1 bg-white/10" aria-hidden />
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5">
                  <a
                    href={`sms:${SITE_PHONE}`}
                    className="inline-flex items-center gap-2.5 text-[13px] sm:text-sm font-semibold text-[var(--text)] hover:text-brand transition-colors"
                  >
                    <MessageSquare size={16} className="text-brand shrink-0" />
                    Text {SITE_PHONE_DISPLAY}
                  </a>
                  <a
                    href={`tel:${SITE_PHONE}`}
                    className="inline-flex items-center gap-2.5 text-[13px] sm:text-sm font-semibold text-[var(--text)] hover:text-brand transition-colors"
                  >
                    <Phone size={16} className="text-brand shrink-0" />
                    Call {SITE_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>

            {onBookOnline && (
              <button
                type="button"
                onClick={onBookOnline}
                className="mt-5 text-[13px] font-semibold text-neutral-400 hover:text-brand transition-colors animate-fade-in-up delay-300"
              >
                Prefer to book online? Schedule a pickup →
              </button>
            )}
          </div>

          {/* Visual */}
          <div className="relative justify-self-center md:justify-self-end w-full max-w-[380px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[640px] -mx-2 sm:mx-0 animate-fade-in delay-200">
            <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 h-[65%] w-[65%] rounded-full bg-brand/25 blur-[90px] animate-glow-pulse" aria-hidden />

            <img
              src="/opek-hero-haulers.png?v=3"
              alt="Junk removal providers lifting a heavy tool chest together"
              className="relative z-10 w-full h-auto max-h-[360px] sm:max-h-[520px] md:max-h-[min(680px,78vh)] scale-[1.12] sm:scale-[1.18] origin-bottom object-contain object-bottom select-none drop-shadow-[0_28px_56px_rgba(0,0,0,0.55)]"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative z-10 border-t border-white/[0.07] bg-white/[0.015]">
        <div className="relative overflow-hidden py-3.5 marquee-paused">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[var(--bg)] to-transparent z-10" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[var(--bg)] to-transparent z-10" aria-hidden />
          <div className="flex w-max animate-marquee gap-0">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
                {tickerItems.map((item) => (
                  <span key={`${dup}-${item}`} className="flex items-center shrink-0">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 px-5 sm:px-7">
                      {item}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-brand shrink-0" aria-hidden>
                      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
                    </svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
