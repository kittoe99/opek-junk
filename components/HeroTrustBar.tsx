import React from 'react';

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

const badges = [
  {
    key: 'rated',
    title: '4.8 / 5',
    sub: 'Top rated',
    icon: (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden>
          <path d="M12 2l2.9 6.6L22 10l-5 4.6L18.2 22 12 18.2 5.8 22 7 14.6 2 10l7.1-1.4L12 2z" />
        </svg>
      </span>
    ),
  },
  {
    key: 'quality',
    title: 'Vetted',
    sub: 'Insured providers',
    icon: (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 border border-brand/25 text-brand">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" strokeLinejoin="round" />
          <path d="M9 11.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    ),
  },
  {
    key: 'sameday',
    title: 'Same-Day',
    sub: 'Fast booking',
    icon: (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 border border-brand/25 text-brand">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" strokeLinejoin="round" />
        </svg>
      </span>
    ),
  },
];

export const HeroTrustBar: React.FC = () => {
  return (
    <div className="mt-8 sm:mt-10 w-full animate-fade-in-up delay-500">
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/[0.08] pt-5 sm:pt-6">
        {badges.map((b) => (
          <div key={b.key} className="flex items-center gap-2.5 min-w-0">
            {b.icon}
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-[var(--text)] tracking-tight leading-tight">{b.title}</p>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] leading-snug">{b.sub}</p>
            </div>
          </div>
        ))}
        <a
          href={`tel:${SITE_PHONE}`}
          className="group flex items-center gap-2.5 min-w-0 sm:ml-auto"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 text-neutral-300 transition-colors group-hover:border-brand/40 group-hover:text-brand">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-[var(--text)] tracking-tight leading-tight group-hover:text-brand transition-colors">
              {SITE_PHONE_DISPLAY}
            </p>
            <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] leading-snug">Call or text</p>
          </div>
        </a>
      </div>
    </div>
  );
};
