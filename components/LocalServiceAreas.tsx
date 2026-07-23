import React from 'react';
import { Link } from 'react-router-dom';

const featuredAreas = [
  { label: 'Atlanta', slug: 'atlanta', hasPage: true },
  { label: 'Dallas–Fort Worth', slug: 'dallas-fort-worth', hasPage: true },
  { label: 'Jacksonville', slug: 'jacksonville', hasPage: true },
  { label: 'Chicago', slug: 'chicago', hasPage: false },
  { label: 'Denver', slug: 'denver', hasPage: false },
  { label: 'Miami', slug: 'miami', hasPage: false },
];

export const LocalServiceAreas: React.FC = () => {
  return (
    <section className="relative py-14 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg-alt)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute -bottom-20 right-[-6%] h-[280px] w-[280px] rounded-full bg-brand/[0.06] blur-[110px] pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Copy */}
          <div>
            <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">
              Nationwide service areas
            </p>
            <h2 className="font-sans font-extrabold text-[1.75rem] sm:text-[2.3rem] md:text-[2.55rem] text-[var(--text)] tracking-tight leading-[1.1] mb-4 sm:mb-5">
              Affordable junk removal near you
            </h2>
            <p className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed mb-5 max-w-lg">
              At Opek, we care about our neighbors nationwide and offer fast, affordable junk removal.
              Whether you&apos;re clearing out a home in <strong className="text-[var(--text)] font-semibold">Atlanta</strong>,
              decluttering in <strong className="text-[var(--text)] font-semibold">Dallas</strong>, or renovating in{' '}
              <strong className="text-[var(--text)] font-semibold">Jacksonville</strong>, local pros provide
              eco-friendly pickup throughout your metro.
            </p>
            <p className="text-[14px] sm:text-[15px] font-bold italic text-[var(--text)] mb-4">
              Covering all 50 states &amp; surrounding areas!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 max-w-md">
              {featuredAreas.map((area) =>
                area.hasPage ? (
                  <Link
                    key={area.slug}
                    to={`/locations/${area.slug}`}
                    className="text-[13px] sm:text-sm font-semibold text-brand hover:text-brand-400 transition-colors"
                  >
                    {area.label}
                  </Link>
                ) : (
                  <Link
                    key={area.slug}
                    to="/quote"
                    className="text-[13px] sm:text-sm font-semibold text-brand hover:text-brand-400 transition-colors"
                  >
                    {area.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex items-end justify-center">
            <div className="absolute inset-10 rounded-full bg-brand/15 blur-[80px]" aria-hidden />
            <img
              src="/opek-service-areas.png?v=1"
              alt="Opek junk removal provider greeting a customer after a pickup"
              className="relative z-10 w-full max-w-md h-auto max-h-[380px] sm:max-h-[440px] object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.55)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
