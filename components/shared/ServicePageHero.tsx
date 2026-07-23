import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

interface CtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface ServicePageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  imageAlt: string;
  primaryCta: CtaProps;
  secondaryCta?: CtaProps;
  chip?: string;
}

function CtaButton({
  cta,
  variant,
}: {
  cta: CtaProps;
  variant: 'primary' | 'secondary';
}) {
  const className =
    variant === 'primary'
      ? 'group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 sm:px-9 py-3.5 text-[14px] sm:text-[15px] font-bold text-white transition-all hover:bg-brand-600 shadow-[0_0_28px_-6px_rgba(255,0,110,0.7)] border-2 border-white/10'
      : 'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 sm:px-7 py-3 sm:py-3.5 text-[13px] sm:text-[15px] font-semibold text-neutral-200 transition-all hover:bg-white/[0.08] hover:border-white/25';

  if (cta.href) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
        {variant === 'primary' && (
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </a>
    );
  }

  return (
    <button type="button" onClick={cta.onClick} className={className}>
      {cta.label}
      {variant === 'primary' && (
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </button>
  );
}

export const ServicePageHero: React.FC<ServicePageHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  primaryCta,
  secondaryCta,
  chip,
}) => {
  return (
    <section className="relative overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 bg-dark-grid [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" aria-hidden />
      <div className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-brand/20 blur-[140px]" aria-hidden />
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" aria-hidden />

      <div className="relative z-10 px-4 sm:px-8 lg:px-14 xl:px-20 pt-10 pb-14 sm:pt-14 md:pt-16 md:pb-16">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center gap-8 md:gap-6 lg:gap-10">
          <div className="relative z-10 max-w-xl md:max-w-none">
            <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3 sm:mb-4">{eyebrow}</p>

            <h1 className="font-sans font-extrabold text-[2.35rem] sm:text-[3.2rem] md:text-[3.5rem] lg:text-[3.75rem] leading-[1.06] tracking-tight text-white mb-4 sm:mb-5">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-5">
              <div className="flex items-center gap-0.5" aria-label="4.8 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-brand fill-brand" />
                ))}
              </div>
              <span className="text-[13px] sm:text-sm font-semibold text-[var(--text)]">
                4.8 · Top-rated local providers
              </span>
            </div>

            <p className="text-[14px] sm:text-base md:text-lg leading-relaxed text-[var(--text-muted)] mb-7 sm:mb-8 max-w-md">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <CtaButton cta={primaryCta} variant="primary" />
              {secondaryCta && <CtaButton cta={secondaryCta} variant="secondary" />}
            </div>
          </div>

          <div className="relative justify-self-center md:justify-self-end w-full max-w-[380px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[640px]">
            <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 h-[65%] w-[65%] rounded-full bg-brand/25 blur-[90px]" aria-hidden />
            <img
              src={image}
              alt={imageAlt}
              className="relative z-10 w-full h-auto max-h-[320px] sm:max-h-[460px] md:max-h-[min(620px,72vh)] scale-[1.08] origin-bottom object-contain object-bottom select-none drop-shadow-[0_28px_56px_rgba(0,0,0,0.55)]"
              draggable={false}
            />
            {chip && (
              <div className="absolute right-0 sm:right-2 top-8 sm:top-12 z-20">
                <div className="rounded-lg border border-white/10 bg-[#121218]/95 backdrop-blur px-3 py-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
                  <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">{chip}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
