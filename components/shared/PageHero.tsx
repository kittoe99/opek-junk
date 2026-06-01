import React from 'react';
import { CheckCircle2, LucideIcon } from 'lucide-react';

interface CtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface PageHeroProps {
  eyebrow: string;
  EyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  imageAlt: string;
  imageCaption?: string;
  primaryCta?: CtaProps;
  secondaryCta?: CtaProps;
  /** Render compact (no min-h-screen, smaller text) */
  compact?: boolean;
}

const ctaButton = (cta: CtaProps, isPrimary: boolean, fullWidth = false) => {
  const base = `${
    fullWidth ? 'flex-1 px-4' : 'px-8'
  } py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-none shadow-md hover:shadow-xl text-center`;
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
  EyebrowIcon,
  title,
  subtitle,
  image,
  imageAlt,
  imageCaption,
  primaryCta,
  secondaryCta,
  compact = false,
}) => {
  const headingClass = compact
    ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight mb-4 leading-[1.05]'
    : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-secondary tracking-tight mb-4 md:mb-6 leading-[1.05]';

  const ctas = (fullWidth = false) => (
    <>
      {primaryCta && ctaButton(primaryCta, true, fullWidth)}
      {secondaryCta && ctaButton(secondaryCta, false, fullWidth)}
    </>
  );

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Mobile layout */}
      <div className="lg:hidden flex flex-col">
        <div
          className="relative pt-12 pb-10 px-4"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">
                {eyebrow}
              </span>
            </div>
            <h1 className={`${headingClass} text-white animate-slide-up`} style={{ animationDelay: '0.1s' }}>
              {title}
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {subtitle}
            </p>
          </div>
        </div>

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-row animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {ctas(true)}
          </div>
        )}
      </div>

      {/* Desktop layout */}
      <div className={`hidden lg:flex ${compact ? 'py-20' : 'min-h-[80vh] py-24'} flex-col items-center justify-center`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-12 gap-16 items-center">
            <div className="col-span-7">
              <div className="inline-flex items-center gap-2 mb-4 animate-fade-in">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">
                  {eyebrow}
                </span>
              </div>
              <h1 className={`${headingClass} animate-slide-up`} style={{ animationDelay: '0.1s' }}>
                {title}
              </h1>
              <p className="text-lg text-secondary mb-8 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {subtitle}
              </p>
              {(primaryCta || secondaryCta) && (
                <div className="flex flex-row gap-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  {ctas(false)}
                </div>
              )}
            </div>

            <div className="col-span-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative aspect-[4/5] group">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
                {imageCaption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle2 size={18} className="text-brand shrink-0" />
                      <span className="text-sm font-bold">{imageCaption}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
