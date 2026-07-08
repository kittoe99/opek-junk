import React from 'react';
import { Star } from 'lucide-react';

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

function HeroCta({ cta, primary, className }: { cta: CtaProps; primary: boolean; className: string }) {
  const colors = primary
    ? 'bg-secondary text-white hover:bg-secondary-600'
    : 'border border-secondary-200 text-secondary hover:border-secondary-300 hover:bg-secondary-50';

  if (cta.href) {
    return (
      <a href={cta.href} className={className + ' ' + colors}>
        {cta.label}
      </a>
    );
  }

  return (
    <button type="button" onClick={cta.onClick} className={className + ' ' + colors}>
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
  compact = false,
  showRating = true,
}) => {
  const ratingBadge = (light?: boolean) =>
    showRating ? (
      <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="text-[#00B67A] fill-[#00B67A]" />
          ))}
        </div>
        <span className={`text-sm font-semibold ${light ? 'text-white' : 'text-secondary'}`}>4.8</span>
        <span className={`text-sm ${light ? 'text-white/80' : 'text-secondary-400'}`}>average rating</span>
      </div>
    ) : eyebrow ? (
      <p className={`text-[11px] font-semibold uppercase tracking-wider mb-4 ${light ? 'text-white/90' : 'text-brand'}`}>
        {eyebrow}
      </p>
    ) : null;

  const desktopMinH = compact
    ? 'min-h-[min(520px,calc(100vh-var(--site-header-height)))]'
    : 'min-h-[min(620px,calc(100vh-var(--site-header-height)))]';

  const mobileTitleClass = compact
    ? 'text-3xl sm:text-4xl font-serif font-semibold'
    : 'text-4xl sm:text-5xl font-serif font-semibold';

  const desktopTitleClass = compact
    ? 'font-serif text-[2.25rem] xl:text-4xl font-semibold'
    : 'font-serif text-[2.75rem] xl:text-5xl font-semibold';

  return (
    <section className="hero-section relative bg-white overflow-hidden">
      <div className="lg:hidden flex flex-col">
        <div
          className="relative pt-32 pb-10 px-4"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10">
            {ratingBadge(true)}
            <h1
              className={`${mobileTitleClass} text-white tracking-tight mb-4 leading-[1.1] animate-slide-up`}
              style={{ animationDelay: '0.1s' }}
            >
              {title}
            </h1>
            <p
              className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {(primaryCta || secondaryCta) && (
          <div className="hero-mobile-cta flex flex-row animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {primaryCta && (
              <HeroCta
                cta={primaryCta}
                primary
                className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
              />
            )}
            {secondaryCta && (
              <HeroCta
                cta={secondaryCta}
                primary={false}
                className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl border-0"
              />
            )}
          </div>
        )}

        {children && (
          <div className="px-4 py-8 animate-slide-up bg-white" style={{ animationDelay: '0.35s' }}>
            {children}
          </div>
        )}
      </div>

      <div className={`hidden lg:block relative ${desktopMinH}`}>
        <img src={image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center" />

        <div className={`relative z-10 flex items-center ${desktopMinH} px-6 xl:px-12 py-16`}>
          <div className="max-w-7xl mx-auto w-full">
            <div
              className="hero-desktop-card bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(53,80,112,0.12)] p-10 xl:p-14 max-w-[34rem] animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              {ratingBadge()}
              <h1 className={`${desktopTitleClass} text-secondary tracking-tight mb-5 leading-[1.1]`}>{title}</h1>
              <p className="text-base xl:text-lg text-secondary-400 mb-8 leading-relaxed">{subtitle}</p>

              {(primaryCta || secondaryCta) && (
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  {primaryCta && (
                    <HeroCta
                      cta={primaryCta}
                      primary
                      className="px-7 py-3.5 text-sm font-semibold transition-colors duration-200 rounded-xl shadow-sm"
                    />
                  )}
                  {secondaryCta && (
                    <HeroCta
                      cta={secondaryCta}
                      primary={false}
                      className="px-7 py-3.5 text-sm font-semibold transition-colors duration-200 rounded-xl"
                    />
                  )}
                </div>
              )}

              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
