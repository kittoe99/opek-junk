import React from 'react';
import { Star } from 'lucide-react';

interface CtaProps { label: string; onClick?: () => void; href?: string; }
export interface ServicePageHeroProps {
  eyebrow?: string; title: React.ReactNode; subtitle: string; image: string; imageAlt: string;
  primaryCta?: CtaProps; secondaryCta?: CtaProps;
  /** Kept for compatibility; every page now uses the homepage hero layout. */
  variant?: 'full' | 'banner';
  imagePosition?: string;
  /** Kept for compatibility; no longer shown. */
  chip?: string;
  children?: React.ReactNode; finePrint?: string;
  /** Show the customer rating under the headline (customer-facing pages). */
  rating?: boolean;
}

const SITE_PHONE = '+18777574365';
const SITE_PHONE_DISPLAY = '(877) 757-4365';

function Action({ cta, className }: { cta: CtaProps; className: string }) {
  return cta.href ? <a href={cta.href} className={className}>{cta.label}</a>
    : <button type="button" onClick={cta.onClick} className={className}>{cta.label}</button>;
}

/** Page hero matching the homepage: headline and rating above a full-width photo, with an action card overlapping its bottom edge. */
export const ServicePageHero: React.FC<ServicePageHeroProps> = ({
  title, subtitle, image, imageAlt, primaryCta, secondaryCta, children, imagePosition, rating = true,
  finePrint = 'Services are performed by independent local providers. Pricing, availability and same-day service vary by area.',
}) => (
  <section className="home-hero zip-hero page-hero" aria-labelledby="page-hero-heading">
    <div className="zip-hero-head">
      <h1 id="page-hero-heading" className="home-display zip-hero-title">{title}</h1>
      <p className="zip-hero-sub">{subtitle}</p>
      {rating && (
        <p className="zip-hero-rating">
          <span className="zip-hero-stars" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={20} className="fill-current" />)}
          </span>
          <strong>4.8 average rating</strong>
        </p>
      )}
    </div>

    <div className="zip-hero-media">
      <img src={image} alt={imageAlt} style={imagePosition ? { objectPosition: imagePosition } : undefined} fetchPriority="high" />
    </div>

    <div className="zip-hero-card-wrap">
      <div className="zip-hero-card">
        {primaryCta && <Action cta={primaryCta} className="home-cta zip-hero-submit" />}
        {secondaryCta && <Action cta={secondaryCta} className="page-hero-secondary" />}
        {!secondaryCta?.href?.startsWith('tel:') && (
          <p className="zip-hero-call">
            Or call <a href={`tel:${SITE_PHONE}`}>{SITE_PHONE_DISPLAY}</a>
          </p>
        )}
        {children && <div className="mt-4 text-sm">{children}</div>}
      </div>
      <p className="zip-hero-fine">{finePrint}</p>
    </div>
  </section>
);
