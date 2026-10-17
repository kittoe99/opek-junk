import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

interface CtaProps { label: string; onClick?: () => void; href?: string; }
export interface ServicePageHeroProps {
  eyebrow?: string; title: React.ReactNode; subtitle: string; image: string; imageAlt: string;
  primaryCta?: CtaProps; secondaryCta?: CtaProps; chip?: string; children?: React.ReactNode;
  showRating?: boolean; bannerTitle?: React.ReactNode; bannerDetail?: string; finePrint?: string;
}
function Action({ cta, secondary = false }: { cta: CtaProps; secondary?: boolean }) {
  const className = secondary ? 'interior-hero-secondary' : 'home-cta w-full sm:w-auto sm:min-w-[200px]';
  return cta.href ? <a href={cta.href} className={className}>{cta.label}</a>
    : <button type="button" onClick={cta.onClick} className={className}>{cta.label}</button>;
}

/** Mirrors the homepage hero structure, including its mobile editorial image banner. */
export const ServicePageHero: React.FC<ServicePageHeroProps> = ({
  eyebrow, title, subtitle, image, imageAlt, primaryCta, secondaryCta, chip, children,
  bannerTitle = <>Less work.<br />More living.</>, bannerDetail = 'We do the heavy lifting.',
  finePrint = 'Services are performed by independent local providers. Pricing, availability and same-day service vary by area.',
}) => (
  <section className={`home-hero interior-hero ${image.includes('dump') ? 'interior-hero-vehicle' : ''} relative overflow-hidden bg-[#f4eefc]`}>
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
      <div className="home-hero-copy relative flex md:justify-end px-4 sm:px-6 lg:px-8 pt-10 pb-10 sm:pt-14 md:py-16 lg:py-20">
        <div className="w-full max-w-[600px] md:pr-6 lg:pr-12 self-center">
          {eyebrow && <p className="home-eyebrow mb-3">{eyebrow}</p>}
          <h1 className="home-display text-[2.2rem] leading-[0.95] sm:text-[3.2rem] md:text-[2.4rem] lg:text-[3.3rem] xl:text-[3.5rem] text-[#140a1f]">{title}</h1>
          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] leading-relaxed text-[#2b2236] max-w-md">{subtitle}</p>
          <div className="home-hero-actions mt-6 sm:mt-7 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            {primaryCta && <Action cta={primaryCta} />}
            {secondaryCta && <Action cta={secondaryCta} secondary />}
          </div>
          <div className="home-hero-contact mt-6 flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-[14px] font-semibold text-[#2b2236]">
            <a href="tel:8313187139" className="inline-flex items-center gap-2"><Phone size={16} className="text-[#520f96]" />Call (831) 318-7139</a>
            <a href="sms:8313187139" className="inline-flex items-center gap-2"><MessageSquare size={16} className="text-[#520f96]" />Text us</a>
          </div>
          {children && <div className="mt-5 text-sm">{children}</div>}
        </div>
      </div>
      <div className="home-hero-visual home-street-backdrop relative min-h-[340px] sm:min-h-[440px] md:min-h-[540px] overflow-hidden">
        <div className="home-hero-banner-copy md:hidden">
          <span className="home-hero-banner-label">{chip || 'A fresh start'}</span>
          <p className="home-display">{bannerTitle}</p>
          <span className="home-hero-banner-detail">{bannerDetail}</span>
        </div>
        <img src={image} alt={imageAlt} className="absolute bottom-0 left-[48%] -translate-x-1/2 h-[92%] w-[96%] max-w-none object-contain object-bottom select-none" fetchPriority="high" />
      </div>
    </div>
    <div className="home-hero-fine-print relative z-10 bg-[#3a3340] text-white">
      <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-[11px] sm:text-[12px] leading-snug">{finePrint}</p>
    </div>
  </section>
);
