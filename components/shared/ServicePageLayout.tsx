import React from 'react';
import { ServicePageHero } from '../shared/ServicePageHero';
import { ServiceSplitSection } from '../shared/ServiceSplitSection';
import { ServiceFeatureGrid } from '../shared/ServiceFeatureGrid';
import { HustleMuscle } from '../HustleMuscle';
import { RelatedServices } from '../RelatedServices';
import { ServiceArea } from '../ServiceArea';
import { Testimonials } from '../Testimonials';
import { ServiceIncludeItem } from '../shared/ServiceSplitSection';
import { ServiceFeatureItem } from '../shared/ServiceFeatureGrid';

interface CtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface ServicePageLayoutProps {
  path: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  heroImage: string;
  heroImageAlt: string;
  heroChip?: string;
  primaryCta: CtaProps;
  secondaryCta?: CtaProps;
  split: {
    eyebrow: string;
    title: string;
    body: React.ReactNode;
    includesLabel?: string;
    includes: ServiceIncludeItem[];
    image: string;
    imageAlt: string;
  };
  features: {
    title?: string;
    items: ServiceFeatureItem[];
  };
  serviceArea: {
    titleStart: string;
    titleAccent: string;
  };
  /** Optional mid-page block (e.g. mattress pricing) */
  children?: React.ReactNode;
  showHustleMuscle?: boolean;
}

export const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  path,
  eyebrow,
  title,
  subtitle,
  heroImage,
  heroImageAlt,
  heroChip,
  primaryCta,
  secondaryCta,
  split,
  features,
  serviceArea,
  children,
  showHustleMuscle = true,
}) => {
  return (
    <div className="home-dark min-h-screen">
      <ServicePageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        image={heroImage}
        imageAlt={heroImageAlt}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        chip={heroChip}
      />

      <ServiceSplitSection
        eyebrow={split.eyebrow}
        title={split.title}
        body={split.body}
        includesLabel={split.includesLabel}
        includes={split.includes}
        image={split.image}
        imageAlt={split.imageAlt}
      />

      {children}

      {showHustleMuscle && <HustleMuscle />}

      <ServiceFeatureGrid title={features.title} items={features.items} />

      <RelatedServices excludePath={path} />

      <ServiceArea
        titleStart={serviceArea.titleStart}
        titleAccent={serviceArea.titleAccent}
        theme="dark"
      />

      <Testimonials theme="dark" />
    </div>
  );
};
