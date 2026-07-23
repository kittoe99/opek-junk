import React from 'react';

const stats = [
  { value: '50', label: 'States covered', accent: false },
  { value: '4.8', label: 'Average rating', accent: true },
  { value: '24hr', label: 'Same-day options', accent: false },
  { value: '100%', label: 'Upfront pricing', accent: true },
];

export const ContentSection: React.FC = () => {
  return (
    <section className="relative bg-[var(--bg-alt)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute -bottom-10 left-0 right-0 pointer-events-none select-none overflow-hidden" aria-hidden>
        <p className="font-sans font-extrabold text-[22vw] leading-[0.8] tracking-tighter text-white/[0.025] text-center whitespace-nowrap">
          OPEK
        </p>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-brand/40 to-transparent" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-8 lg:gap-14 mb-14 md:mb-16">
          <h2 className="font-sans font-extrabold text-[1.85rem] sm:text-[2.5rem] md:text-[2.9rem] text-[var(--text)] tracking-tight leading-[1.1]">
            Built for junk that{' '}
            <span className="font-serif italic font-normal text-brand">needs to go</span>
            —today.
          </h2>
          <div className="space-y-5 text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed lg:pt-2">
            <p>
              Opek connects customers with independent local junk removal providers across all 50 states.
              Tell us what you need hauled—furniture, appliances, construction debris, or a full cleanout—
              and we’ll match you with a vetted crew that shows up ready to load.
            </p>
            <p>
              Whether it’s a single mattress, a garage full of clutter, or a dumpster for your renovation,
              you get flat-rate pricing, same-day options in most areas, and a team that handles the heavy lifting end to end.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative border-t border-white/10 pt-5 transition-colors duration-500 hover:border-brand/60"
            >
              <p className={`font-sans font-extrabold text-[2.1rem] sm:text-[2.6rem] md:text-[3rem] leading-none tracking-tight mb-2 ${
                stat.accent ? 'text-brand' : 'text-[var(--text)]'
              }`}>
                {stat.value}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {stat.label}
              </p>
              <span className="absolute -top-px left-0 h-px w-0 bg-brand transition-all duration-700 group-hover:w-full" aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
