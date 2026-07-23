import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  MapPin,
  MessageSquare,
  Phone,
  Star,
} from 'lucide-react';
import { LocalServiceAreas } from '../LocalServiceAreas';
import { ServiceArea } from '../ServiceArea';
import { Testimonials } from '../Testimonials';
import { ZipFinder } from '../ZipFinder';
import { ServiceFeatureGrid } from '../shared/ServiceFeatureGrid';
import { trackMattressConversion } from '../../lib/googleAds';

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

const tickerItems = [
  'Mattress Pickup',
  'Box Spring Removal',
  'Bed Frame Hauling',
  'Any Room Retrieval',
  'Same-Day Crews',
  'Eco Recycling',
  'Insured Providers',
  'All 50 States',
  'Stairs & Elevators',
  'No Curb Dragging',
];

const approaches = [
  {
    title: 'Easy Booking',
    body: 'Schedule mattress pickup online in minutes — no phone tag required.',
  },
  {
    title: 'In-Home Retrieval',
    body: 'Providers carry mattresses out of bedrooms, basements, and upper floors.',
  },
  {
    title: 'Same Day Pickup',
    body: 'Same-day and next-day windows when local capacity allows in your area.',
  },
  {
    title: '100% Transparent',
    body: 'Know what’s included before you confirm. No surprise add-ons at the door.',
  },
  {
    title: 'Order Tracking',
    body: 'Check status, get an ETA, contact your provider, or reschedule with ease.',
  },
  {
    title: 'Thoughtful Disposal',
    body: 'Mattress components recycled whenever possible — not left on the curb.',
  },
];

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();

  const goToBooking = (zip?: string) => {
    trackMattressConversion(zip ? 'mattress_zip_check' : 'mattress_view_pricing');
    navigate('/booking/mattress', {
      state: zip
        ? {
            zipResult: { city: '', state: '', served: true },
            zipValue: zip,
            preselectItems: [{ name: 'Mattress', quantity: 1 }],
          }
        : { preselectItems: [{ name: 'Mattress', quantity: 1 }] },
    });
  };

  return (
    <div className="home-dark">
      {/* ── Hero (homepage pattern) ── */}
      <section className="relative overflow-hidden bg-[var(--bg)]">
        <div className="absolute inset-0 bg-dark-grid [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" aria-hidden />
        <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-brand/20 blur-[140px] animate-glow-pulse" aria-hidden />
        <div className="absolute bottom-[-20%] left-[-10%] h-[380px] w-[380px] rounded-full bg-brand/10 blur-[130px]" aria-hidden />
        <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" aria-hidden />

        <div className="relative z-10 px-4 sm:px-8 lg:px-14 xl:px-20 pt-10 pb-14 sm:pt-14 md:pt-16 md:pb-16">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-8 md:gap-6 lg:gap-10">
            <div className="relative z-10 max-w-xl md:max-w-none">
              <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3 sm:mb-4 animate-fade-in-up">
                Mattress Pickup &amp; Recycling — All 50 States
              </p>

              <h1 className="font-sans font-extrabold text-[2.35rem] sm:text-[3.2rem] md:text-[3.5rem] lg:text-[3.85rem] leading-[1.06] tracking-tight text-white mb-4 sm:mb-5 animate-fade-in-up delay-100">
                Old mattress?
                <br className="hidden sm:block" /> We&apos;ll haul it today
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
                Local providers pick up mattresses, box springs, and frames from any room — same-day windows available in most areas.
              </p>

              <div className="mb-5 sm:mb-6 animate-fade-in-up delay-250">
                <div className="flex items-start gap-2.5">
                  <MapPin size={18} className="text-brand shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] sm:text-[15px] font-bold text-[var(--text)] leading-tight">
                      Book pickup online in minutes
                    </p>
                    <p className="text-[12px] sm:text-[13px] text-[var(--text-muted)] mt-0.5">
                      Matched with insured local crews — no curb dragging required.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-stretch sm:items-start gap-4 animate-fade-in-up delay-300">
                <button
                  type="button"
                  onClick={() => goToBooking()}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 sm:px-9 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-bold text-white transition-all hover:bg-brand-600 shadow-[0_0_28px_-6px_rgba(255,0,110,0.7)] hover:shadow-[0_0_38px_-4px_rgba(255,0,110,0.85)] border-2 border-white/10"
                >
                  View Pricing
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <div className="w-full sm:w-auto">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-px flex-1 bg-white/10" aria-hidden />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Or</span>
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
            </div>

            <div className="relative justify-self-center md:justify-self-end w-full max-w-[380px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[640px] -mx-2 sm:mx-0 animate-fade-in delay-200">
              <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 h-[65%] w-[65%] rounded-full bg-brand/25 blur-[90px] animate-glow-pulse" aria-hidden />
              <img
                src="/opek-mattress-hero.png?v=1"
                alt="Provider carrying a queen mattress for disposal"
                className="relative z-10 w-full h-auto max-h-[360px] sm:max-h-[520px] md:max-h-[min(680px,78vh)] scale-[1.12] sm:scale-[1.18] origin-bottom object-contain object-bottom select-none drop-shadow-[0_28px_56px_rgba(0,0,0,0.55)]"
                draggable={false}
              />
            </div>
          </div>
        </div>

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

      {/* ── Hustle + Muscle pattern ── */}
      <section className="relative bg-[var(--bg-alt)] border-t border-[var(--border)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[480px]">
          <div className="relative order-2 lg:order-1 lg:col-span-5 flex items-end justify-center px-6 pt-4 sm:pt-6 lg:pt-8 pb-0 overflow-hidden min-h-[280px] sm:min-h-[340px] lg:min-h-[360px]">
            <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 h-[55%] w-[55%] rounded-full bg-brand/20 blur-[90px]" aria-hidden />
            <img
              src="/opek-mattress-crew.png?v=2"
              alt="Providers carrying a mattress and box spring from the home"
              className="relative z-10 h-full max-h-[340px] sm:max-h-[420px] lg:max-h-[520px] w-auto object-contain object-bottom drop-shadow-[0_28px_48px_rgba(0,0,0,0.55)]"
              loading="lazy"
            />
            <div
              className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-[var(--bg-alt)] z-20 pointer-events-none"
              style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
              aria-hidden
            />
          </div>
          <div className="relative order-1 lg:order-2 lg:col-span-7 flex items-center px-5 sm:px-8 lg:px-12 xl:px-16 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 lg:py-16">
            <div className="max-w-xl w-full">
              <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">Hustle + Muscle</p>
              <h2 className="font-sans font-extrabold text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] text-[var(--text)] tracking-tight leading-[1.1] mb-4 sm:mb-5">
                Pros carry it out — from any room
              </h2>
              <p className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed mb-6">
                Book fully insured, background-checked local haulers. Your matched crew shows up ready to
                remove the mattress from bedrooms, basements, or upper floors.
              </p>
              <blockquote className="border-l-2 border-brand pl-4 sm:pl-5 mb-8">
                <p className="text-[14px] sm:text-[15px] text-[var(--text)] leading-relaxed">
                  Other junk companies say, &ldquo;All you have to do is point.&rdquo; With{' '}
                  <span className="font-bold text-brand">Opek</span>, you won&apos;t lift a finger — even on stairs.
                </p>
              </blockquote>
              <button
                type="button"
                onClick={() => goToBooking()}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-transparent px-6 sm:px-7 py-3 sm:py-3.5 text-[13px] sm:text-sm font-semibold text-[var(--text)] hover:border-brand/50 hover:bg-white/[0.04] transition-all"
              >
                <Calendar size={16} className="text-brand" />
                Book A Pickup
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="absolute bottom-6 right-5 sm:bottom-8 sm:right-8 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#121218]/95 backdrop-blur px-3.5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col items-start">
                <span className="text-lg font-extrabold text-white leading-none">4.8</span>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} className="text-brand fill-brand" />
                  ))}
                </div>
              </div>
              <div className="pl-2 border-l border-white/10">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 leading-tight">Google</p>
                <p className="text-[11px] font-semibold text-neutral-300 leading-tight mt-0.5">Top-rated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceFeatureGrid items={approaches} />

      <LocalServiceAreas />

      <ServiceArea
        titleStart="Clear the bedroom."
        titleAccent="Providers handle the rest."
        theme="dark"
      />

      <div id="testimonials">
        <Testimonials theme="dark" />
      </div>

      <ZipFinder
        onResolved={(zip) => goToBooking(zip)}
        eyebrow="Instant coverage check"
        title={
          <>
            Check mattress pickup{' '}
            <span className="font-serif italic font-normal text-brand">near you</span>
          </>
        }
        subtitle="Enter your ZIP — we’ll connect you with local providers ready to haul your mattress."
        buttonLabel="Find Mattress Pickup Near Me"
        pricingHref={null}
      />
    </div>
  );
};
