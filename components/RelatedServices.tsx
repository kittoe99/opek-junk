import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const relatedServices = [
  {
    title: 'Mattress Disposal',
    path: '/services/mattress-disposal',
    image: '/opek-related-mattress.png?v=1',
    alt: 'Provider carrying a mattress for disposal',
  },
  {
    title: 'Dumpster Rental',
    path: '/services/dumpster-rental',
    image: '/opek-related-dumpster.png?v=1',
    alt: 'Roll-off dumpster for debris and renovation waste',
  },
  {
    title: 'Moving Labor',
    path: '/services/moving-labor',
    image: '/opek-related-moving.png?v=1',
    alt: 'Hourly moving labor carrying furniture',
  },
  {
    title: 'Small Local Moves',
    path: '/services/small-local-moves',
    image: '/opek-related-local-moves.png?v=1',
    alt: 'Provider loading boxes into a cargo van',
  },
];

export const RelatedServices: React.FC = () => {
  return (
    <section className="relative py-14 sm:py-16 md:py-20 bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* Intro */}
          <div className="lg:pt-1">
            <p className="text-[13px] sm:text-sm font-medium text-[var(--text-muted)] mb-2">
              Related removal services
            </p>
            <h2 className="font-sans font-extrabold text-[1.6rem] sm:text-[1.9rem] md:text-[2.15rem] text-[var(--text)] tracking-tight leading-[1.15] mb-4">
              We can also help with:
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--text-muted)] leading-relaxed max-w-sm">
              <strong className="font-semibold text-neutral-300">Opek</strong> partners with independent
              contractors and connects you with top-rated local service providers.{' '}
              <Link to="/terms" className="text-brand hover:text-brand-400 font-semibold transition-colors">
                Terms
              </Link>
            </p>
          </div>

          {/* Service cutouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-4 md:gap-6">
            {relatedServices.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                className="group flex flex-col items-start text-left"
              >
                <div className="relative w-full aspect-square mb-3 flex items-end justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--surface)] transition-colors duration-300 group-hover:border-brand/40">
                  <div className="absolute inset-x-4 bottom-4 h-1/2 rounded-full bg-brand/10 blur-[28px] opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden />
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="relative z-10 h-[88%] w-[88%] object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.05] drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
                    loading="lazy"
                  />
                </div>
                <span className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-brand group-hover:text-brand-400 transition-colors">
                  {service.title}
                  <ChevronRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
