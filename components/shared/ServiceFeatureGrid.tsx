import React from 'react';

export interface ServiceFeatureItem {
  title: string;
  body: React.ReactNode;
}

interface ServiceFeatureGridProps {
  title?: string;
  items: ServiceFeatureItem[];
}

export const ServiceFeatureGrid: React.FC<ServiceFeatureGridProps> = ({
  title = 'The Opek Approach',
  items,
}) => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-brand/40 to-transparent" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-7 sm:mb-12 md:mb-14">
          <div className="flex items-end gap-4 sm:gap-6">
            <h2 className="font-sans font-extrabold text-[1.85rem] leading-[1.12] sm:text-[2.2rem] sm:leading-none md:text-[2.4rem] text-[var(--text)] tracking-tight">
              {title}
            </h2>
            <span
              className="hidden sm:block h-px flex-1 mb-2 bg-gradient-to-r from-brand/50 via-white/15 to-transparent"
              aria-hidden
            />
          </div>
          <span className="mt-3.5 sm:hidden block h-1 w-11 rounded-full bg-brand" aria-hidden />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8 lg:gap-x-10 sm:gap-y-10 md:gap-y-12">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="flex gap-3.5 sm:block py-4 first:pt-0 last:pb-0 border-b border-white/[0.07] last:border-b-0 sm:border-b-0 sm:py-0"
            >
              <span
                className="shrink-0 w-7 sm:w-auto pt-0.5 sm:pt-0 sm:mb-3 font-sans text-[11px] sm:text-[12px] font-bold tracking-[0.14em] text-brand tabular-nums"
                aria-hidden
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-sans font-bold text-[1.05rem] sm:text-[1.15rem] text-[var(--text)] tracking-tight mb-1.5 sm:mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[13px] sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
