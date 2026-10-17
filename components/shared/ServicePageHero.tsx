import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

interface CtaProps { label: string; onClick?: () => void; href?: string; }
export interface ServicePageHeroProps {
  eyebrow?: string; title: React.ReactNode; subtitle: string; image: string; imageAlt: string;
  primaryCta?: CtaProps; secondaryCta?: CtaProps;
  /** Short label shown in the pill above the headline on phones. Falls back to the eyebrow. */
  chip?: string;
  children?: React.ReactNode; finePrint?: string;
}

function Action({ cta, className }: { cta: CtaProps; className: string }) {
  return cta.href ? <a href={cta.href} className={className}>{cta.label}</a>
    : <button type="button" onClick={cta.onClick} className={className}>{cta.label}</button>;
}

/** Interior-page hero built on the same structure as the homepage hero (desktop split, phone promo block). */
export const ServicePageHero: React.FC<ServicePageHeroProps> = ({
  eyebrow, title, subtitle, image, imageAlt, primaryCta, secondaryCta, chip, children,
  finePrint = 'Services are performed by independent local providers. Pricing, availability and same-day service vary by area.',
}) => {
  const badge = chip || eyebrow;
  return (
    <section className={`home-hero interior-hero ${image.includes('dump') ? 'interior-hero-vehicle' : ''} relative overflow-hidden bg-[#f4eefc]`}>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
        <div className="home-hero-copy relative flex md:justify-end px-5 sm:px-6 lg:px-8 pt-7 pb-8 sm:pt-14 md:py-16 lg:py-20">
          <div className="w-full max-w-[600px] md:pr-6 lg:pr-12 self-center">
            {badge && <span className="home-hero-badge home-hero-badge-text md:hidden">{badge}</span>}
            {eyebrow && <p className="home-eyebrow mb-3 hidden md:block">{eyebrow}</p>}
            <h1 className="home-display text-[2.2rem] leading-[0.95] sm:text-[3.2rem] md:text-[2.4rem] lg:text-[3.3rem] xl:text-[3.5rem] text-[#140a1f]">{title}</h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] leading-relaxed text-[#2b2236] max-w-md">{subtitle}</p>

            {/* Phone actions: one button, the second action as a quiet link */}
            {(primaryCta || secondaryCta) && (
              <div className="md:hidden mt-7 flex flex-col items-center gap-4">
                {primaryCta && <Action cta={primaryCta} className="home-hero-mobile-cta" />}
                {secondaryCta && <Action cta={secondaryCta} className="home-hero-mobile-link" />}
              </div>
            )}

            {/* Desktop actions */}
            <div className="hidden md:flex mt-7 items-center gap-6">
              {primaryCta && <Action cta={primaryCta} className="home-cta min-w-[200px]" />}
              {secondaryCta && <Action cta={secondaryCta} className="interior-hero-secondary" />}
            </div>
            <div className="hidden md:flex mt-6 flex-wrap gap-x-6 gap-y-2 text-[14px] font-semibold text-[#2b2236]">
              <a href="tel:8313187139" className="inline-flex items-center gap-2 hover:text-[#520f96]"><Phone size={16} className="text-[#520f96]" aria-hidden />Call (831) 318-7139</a>
              <a href="sms:8313187139" className="inline-flex items-center gap-2 hover:text-[#520f96]"><MessageSquare size={16} className="text-[#520f96]" aria-hidden />Text us</a>
            </div>
            {children && <div className="mt-5 text-sm">{children}</div>}
          </div>
        </div>
        <div className="home-hero-visual home-hero-photo relative min-h-[340px] sm:min-h-[440px] md:min-h-[540px] overflow-hidden">
          <img src={image} alt={imageAlt} className="absolute bottom-0 left-[48%] -translate-x-1/2 h-[92%] w-[96%] max-w-none object-contain object-bottom select-none" fetchPriority="high" />
        </div>
      </div>
      <div className="home-hero-fine-print relative z-10 hidden md:block bg-[#3a3340] text-white">
        <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] sm:text-[12px] leading-snug">{finePrint}</p>
      </div>
    </section>
  );
};
