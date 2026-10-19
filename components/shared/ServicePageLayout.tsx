import React from 'react';
import { ServicePageHero } from './ServicePageHero';
import { ServiceIncludeItem } from './ServiceSplitSection';
import { ServiceFeatureItem } from './ServiceFeatureGrid';
import { HomeHowItWorks, HomeWaysToBook, HomeReviews, HomeStep } from '../home/HomeSections';
import { HomeCoverageSection } from '../home/HomeCoverageSection';
import { HomeEditorialCards } from '../home/HomePagePatterns';

interface CtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface ServicePageLayoutProps {
  path: string;
  onZipCheck?: (zip: string) => void;
  bookingPath?: string;
  bookingState?: Record<string, unknown>;
  processTitle?: string;
  processSteps?: HomeStep[];
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
  /** Optional mid-page block (e.g. ZIP magnet, FAQ) */
  children?: React.ReactNode;
  showHustleMuscle?: boolean;
  showRelatedServices?: boolean;
  showFeatures?: boolean;
  /** Rendered after testimonials — e.g. final CTA strip */
  afterTestimonials?: React.ReactNode;
}

export const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  path, eyebrow, title, subtitle, heroImage, heroImageAlt, heroChip, primaryCta, secondaryCta,
  split, features, serviceArea, children, afterTestimonials, onZipCheck, bookingPath, bookingState,
  processTitle, processSteps,
}) => {
  const moving = path.includes('move');
  const dumpster = path.includes('dumpster');
  const cleanout = path.includes('cleanout');
  const mattress = path.includes('mattress');
  const steps: HomeStep[] = processSteps || [
    { title: moving ? 'Tell us about your move' : dumpster ? 'Choose your container' : cleanout ? 'Show us the space' : 'Pick your items',
      body: moving ? 'Choose truck and crew or labor only, then tell us what needs moving.' : dumpster ? 'Choose a roll-off size for your project, from a garage cleanout to a renovation.' : cleanout ? 'Tell us about the property and what needs to go. Arrange an estimate for larger jobs.' : mattress ? 'Tell us how many mattresses, box springs and bed frames you need removed.' : 'Tell us what is going — one couch or a whole garage — and see your upfront price.',
      image: mattress || (!moving && !dumpster && !cleanout) ? '/optimized/service-scenes/mattress-pickup.webp' : heroImage, alt: mattress || (!moving && !dumpster && !cleanout) ? 'Provider carrying a mattress' : heroImageAlt },
    { title: 'Choose a time', body: 'Book a window that works for you. Same-day options depend on local provider availability.', image: '/optimized/service-scenes/pickup-scheduling.webp', alt: 'Hand holding a phone with pickup time choices' },
    { title: moving ? 'Settle into your space' : dumpster ? 'Fill it. We collect it.' : 'Leave the lifting to us',
      body: moving ? 'Your crew loads, transports and unloads, so you can focus on your new place.' : dumpster ? 'Load the container at your pace. Your provider returns for pickup and disposal.' : 'Your matched crew loads everything and handles disposal, donation or recycling.',
      image: moving ? '/optimized/service-scenes/local-moving.webp' : '/optimized/service-scenes/junk-truck.webp', alt: moving ? 'Moving providers loading a sofa' : 'Purple dump truck ready for hauling' },
  ];
  return <div className="home-light interior-home">
    <ServicePageHero eyebrow={eyebrow} title={title} subtitle={subtitle} image={heroImage} imageAlt={heroImageAlt}
      chip={heroChip} primaryCta={primaryCta} secondaryCta={secondaryCta}
    />
    <HomeHowItWorks title={processTitle || (moving ? 'A few taps. A fresh start.' : dumpster ? 'Your project. Three easy steps.' : 'Three steps. One clear space.')}
      description={`Booking ${moving ? 'local moving help' : dumpster ? 'a dumpster' : 'your pickup'} online has never been easier.`} items={steps} />
    <HomeCoverageSection titleStart={serviceArea.titleStart} titleAccent={serviceArea.titleAccent} onCheck={onZipCheck} />
    <HomeEditorialCards title={split.title} description={split.body} cards={[
      { title: split.eyebrow, image: split.image, alt: split.imageAlt,
        body: <><p className="font-semibold mb-4">{split.includesLabel || 'We take care of the whole job.'}</p><div className="grid grid-cols-2 gap-4 text-left">{split.includes.map(({ title: label, Icon }) => <div key={label} className="flex items-center gap-2 text-sm font-semibold"><Icon size={20} className="shrink-0 text-[#520f96]" />{label}</div>)}</div></>,
        action: { label: primaryCta.label, onClick: primaryCta.onClick }, details: features.items.slice(0,3) },
      { title: features.title || 'Make room for what matters', image: heroImage, alt: heroImageAlt,
        body: 'Vetted local providers, clear pricing and convenient booking. Get the help you need, on your schedule.',
        action: secondaryCta ? { label: secondaryCta.label, onClick: secondaryCta.onClick } : undefined,
        details: features.items.slice(3) },
    ]} />
    {children}
    <HomeWaysToBook bookingPath={bookingPath} bookingState={bookingState} />
    <HomeReviews />
    {afterTestimonials}
  </div>;
};
