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
    <section className="relative py-14 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-brand/40 to-transparent" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-14">
          <h2 className="font-sans font-extrabold text-[1.7rem] sm:text-[2.2rem] md:text-[2.4rem] text-[var(--text)] tracking-tight leading-none shrink-0">
            {title}
          </h2>
          <span className="hidden sm:block h-px flex-1 bg-gradient-to-r from-brand/50 via-white/15 to-transparent" aria-hidden />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-9 sm:gap-y-10 md:gap-y-12">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="font-sans font-bold text-[1.05rem] sm:text-[1.15rem] text-[var(--text)] tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-[13px] sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
