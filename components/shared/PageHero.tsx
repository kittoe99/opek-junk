import React from 'react';

interface CtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  imageAlt: string;
  primaryCta?: CtaProps;
  secondaryCta?: CtaProps;
  /** Optional content rendered below CTAs (e.g. ZIP checker) */
  children?: React.ReactNode;
  /** Shorter hero for utility pages */
  compact?: boolean;
  /** @deprecated Accepted for compatibility; no longer rendered */
  imageCaption?: string;
  /** @deprecated Accepted for compatibility; no longer rendered */
  EyebrowIcon?: React.ComponentType<{ size?: number; className?: string }>;
}

const ctaButton = (cta: CtaProps, isPrimary: boolean, fullWidth = false) => {
  const base = `${
    fullWidth ? 'flex-1 px-4' : 'px-8'
  } py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hero-cta shadow-md hover:shadow-xl text-center`;
  const colors = isPrimary
    ? 'bg-secondary text-white hover:bg-secondary-600'
    : 'bg-brand text-white hover:bg-brand-600';
  if (cta.href) {
    return (
      <a href={cta.href} className={`${base} ${colors}`}>
        {cta.label}
      </a>
    );
  }
  return (
    <button onClick={cta.onClick} className={`${base} ${colors}`}>
      {cta.label}
    </button>
  );
};

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
}) => {
  const headingClass = compact
    ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-6 leading-[1.05]'
    : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-[1.05]';
  const ctas = (fullWidth = false) => (
    <>
      {primaryCta && ctaButton(primaryCta, true, fullWidth)}
      {secondaryCta && ctaButton(secondaryCta, false, fullWidth)}
    </>
  );

  return (
    <section className="hero-section relative bg-white overflow-hidden">
      {/* Mobile layout */}
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
            <div className="mb-3 animate-fade-in">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">{eyebrow}</span>
            </div>
            <h1
              className={`${headingClass} text-white animate-slide-up`}
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
          <div className="flex flex-row animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {ctas(true)}
          </div>
        )}

        {children && (
          <div className="px-4 py-8 animate-slide-up" style={{ animationDelay: '0.35s' }}>
            {children}
          </div>
        )}
      </div>

      {/* Desktop layout */}
      <div className={`hidden lg:flex ${compact ? 'py-20' : 'min-h-screen pt-40 pb-32'} flex-col items-center justify-center`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-12 gap-16 items-center">
            <div className="col-span-7">
              <div className="mb-4 animate-fade-in">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">{eyebrow}</span>
              </div>
              <h1
                className={`${headingClass} text-secondary animate-slide-up`}
                style={{ animationDelay: '0.1s' }}
              >
                {title}
              </h1>
              <p
                className="text-lg text-secondary mb-8 max-w-lg leading-relaxed animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                {subtitle}
              </p>
              {(primaryCta || secondaryCta) && (
                <div className="flex flex-row gap-0 animate-slide-up mb-8" style={{ animationDelay: '0.3s' }}>
                  {ctas(false)}
                </div>
              )}
              {children && (
                <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
                  {children}
                </div>
              )}
            </div>

            <div className="col-span-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative aspect-square flex items-center justify-center group">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-cover rounded-2xl shadow-lg border border-secondary-100 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
