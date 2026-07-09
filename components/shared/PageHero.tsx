import React from 'react';
import { Star } from 'lucide-react';
import { HERO_PRIMARY_CTA } from '../../lib/flowPageLayout';

interface CtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  imageAlt: string;
  primaryCta?: CtaProps;
  secondaryCta?: CtaProps;
  children?: React.ReactNode;
  compact?: boolean;
  showRating?: boolean;
  /** @deprecated Accepted for compatibility; no longer rendered */
  imageCaption?: string;
  /** @deprecated Accepted for compatibility; no longer rendered */
  EyebrowIcon?: React.ComponentType<{ size?: number; className?: string }>;
}

function RatingBadge({ centered }: { centered?: boolean }) {
  return (
    <p className={`text-sm font-medium text-[#5c6bc0] mb-4 ${centered ? 'text-center' : ''}`}>
      4.8{' '}
      <Star size={14} className="inline -mt-0.5 text-[#5c6bc0] fill-[#5c6bc0]" strokeWidth={0} />{' '}
      average rating
    </p>
  );
}

function Eyebrow({ label, centered }: { label: string; centered?: boolean }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-wider text-brand mb-3 ${centered ? 'text-center' : ''}`}>
      {label}
    </p>
  );
}

function PrimaryCta({ cta, className }: { cta: CtaProps; className: string }) {
  const cls = `${className} ${HERO_PRIMARY_CTA}`;
  if (cta.href) {
    return (
      <a href={cta.href} className={cls}>
        {cta.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={cta.onClick} className={cls}>
      {cta.label}
    </button>
  );
}

function SecondaryCta({ cta, className }: { cta: CtaProps; className: string }) {
  if (cta.href) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={cta.onClick} className={className}>
      {cta.label}
    </button>
  );
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  primaryCta,
  secondaryCta,
  children,
  showRating = true,
}) => {
  const mobileSecondaryCls =
    'shrink-0 py-3 text-sm font-medium text-secondary hover:text-brand transition-colors whitespace-nowrap';
  const desktopSecondaryCls =
    'inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-secondary hover:text-brand transition-colors whitespace-nowrap';

  return (
    <section className="hero-section relative bg-white overflow-hidden">
      {/* Mobile — centered copy, CTA, image */}
      <div className="lg:hidden">
        <div className="px-5 pt-2.5 pb-6 text-center max-w-lg mx-auto">
          {showRating ? <RatingBadge centered /> : eyebrow ? <Eyebrow label={eyebrow} centered /> : null}

          <h1 className="font-serif text-[2rem] sm:text-[2.25rem] font-semibold text-secondary tracking-tight leading-[1.12] mb-4">
            {title}
          </h1>

          <p className="text-[15px] sm:text-base text-secondary-500 leading-relaxed mb-6 max-w-[20rem] mx-auto">
            {subtitle}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2 w-full mb-2">
              {primaryCta && (
                <PrimaryCta
                  cta={primaryCta}
                  className="shrink-0 px-6 py-3 text-[15px] font-semibold !rounded-full whitespace-nowrap"
                />
              )}
              {secondaryCta && <SecondaryCta cta={secondaryCta} className={mobileSecondaryCls} />}
            </div>
          )}

          <div className="mt-7 rounded-2xl overflow-hidden bg-secondary-100 aspect-[4/3] sm:aspect-[16/11]">
            <img src={image} alt={imageAlt} className="w-full h-full object-cover object-center" />
          </div>

          {children && (
            <div className="mt-7 flex justify-center text-left">{children}</div>
          )}
        </div>
      </div>

      {/* Desktop — split hero matching homepage */}
      <div className="hidden lg:block">
        <div className="max-w-[72rem] mx-auto px-8 xl:px-10 pt-8 xl:pt-10 pb-10 xl:pb-12">
          <div className="grid grid-cols-2 gap-12 xl:gap-14 items-center">
            <div className="max-w-[28rem] animate-slide-up" style={{ animationDelay: '0.05s' }}>
              {showRating ? <RatingBadge /> : eyebrow ? <Eyebrow label={eyebrow} /> : null}

              <h1 className="font-serif text-[2.625rem] xl:text-[3.125rem] font-semibold text-secondary tracking-tight mb-4 leading-[1.1]">
                {title}
              </h1>

              <p className="text-lg text-[#6b7c78] mb-7 leading-relaxed">{subtitle}</p>

              {(primaryCta || secondaryCta) && (
                <div className="flex flex-wrap items-center gap-3">
                  {primaryCta && (
                    <PrimaryCta
                      cta={primaryCta}
                      className="!rounded-full px-7 py-3 text-[15px] font-semibold"
                    />
                  )}
                  {secondaryCta && <SecondaryCta cta={secondaryCta} className={desktopSecondaryCls} />}
                </div>
              )}

              {children && <div className="mt-7">{children}</div>}
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="aspect-[5/4] w-full overflow-hidden rounded-[1.5rem] bg-secondary-100">
                <img src={image} alt={imageAlt} className="w-full h-full object-cover object-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
