import React from 'react';
import { ServicePageHero } from './ServicePageHero';
import { HomeHowItWorks, HomeWaysToBook, HomeReviews, HomeStep } from '../home/HomeSections';
import { HomeCoverageSection } from '../home/HomeCoverageSection';
import { HomeStartBar } from '../home/HomeStartBar';

interface CtaProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface ServicePageLayoutProps {
  path: string;
  onZipCheck?: (zip: string, place: { city: string; state: string }) => void;
  bookingPath?: string;
  bookingState?: Record<string, unknown>;
  processTitle?: string;
  processDescription?: string;
  processSteps?: HomeStep[];
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  heroImage: string;
  heroImageAlt: string;
  heroChip?: string;
  primaryCta: CtaProps;
  secondaryCta?: CtaProps;
  /** Short plain-text section with in-text links, written for search. */
  content: {
    title: string;
    body: React.ReactNode;
  };
  serviceArea: {
    titleStart: string;
    titleAccent: string;
    subtitle?: string;
    showSameDay?: boolean;
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
  content, serviceArea, children, afterTestimonials, onZipCheck, bookingPath, bookingState,
  processTitle, processDescription, processSteps,
}) => {
  const moving = path.includes('moving-labor');
  const dumpster = path.includes('dumpster');
  const cleanout = path.includes('cleanout');
  const cleaning = path.includes('move-out');
  const photoLine = moving ? 'Muscle for your move'
    : dumpster ? 'Load it at your own pace'
    : cleanout ? 'Every room. Cleared out.'
    : cleaning ? 'Move out. We’ll clean up.'
    : 'We do the heavy lifting';
  const steps: HomeStep[] = processSteps || [
    { title: moving ? 'Tell us what you need' : dumpster ? 'Choose your container' : cleanout ? 'Show us the space' : 'Pick your items',
      body: moving ? 'Choose loading, unloading or rearranging, then tell us about the job.' : dumpster ? 'Choose a roll-off size for your project, from a garage cleanout to a renovation.' : cleanout ? 'Tell us about the property and what needs to go. Arrange an estimate for larger jobs.' : 'Tell us what is going — one couch or a whole garage — and see your upfront price.',
      image: heroImage, alt: heroImageAlt },
    { title: 'Choose a time', body: 'Book a window that works for you. Same-day options depend on local provider availability.', image: '/optimized/service-scenes/scheduling-natural.webp', alt: 'Hand holding a phone with pickup time choices' },
    { title: moving ? 'Helpers do the lifting' : dumpster ? 'Fill it. We collect it.' : 'Leave the lifting to us',
      body: moving ? 'Helpers load and unload while you handle the truck, POD or storage.' : dumpster ? 'Load the container at your pace. Your provider returns for pickup and disposal.' : 'Your matched crew loads everything and handles disposal, donation or recycling.',
      image: moving ? '/optimized/service-scenes/mattress-pickup-natural.webp' : cleanout || dumpster ? heroImage : '/optimized/service-scenes/junk-truck-unbranded.webp', alt: moving ? 'Two helpers carrying a mattress' : cleanout || dumpster ? heroImageAlt : 'Purple dump truck loaded with household junk' },
  ];
  return <div className="home-light interior-home has-start-bar">
    <HomeStartBar label={primaryCta.label} onGetQuote={primaryCta.onClick} href={primaryCta.href} />
    <ServicePageHero eyebrow={eyebrow} title={title} subtitle={subtitle} image={heroImage} imageAlt={heroImageAlt}
      variant={path.startsWith('/services/') ? 'banner' : 'full'}
      imagePosition={moving || cleanout ? 'center top' : undefined}
      photoLine={photoLine}
      chip={heroChip} primaryCta={primaryCta} secondaryCta={secondaryCta}
    />
    <HomeHowItWorks title={processTitle || (moving ? 'A few taps. Extra muscle.' : dumpster ? 'Your project. Three easy steps.' : 'Three steps. One clear space.')}
      description={processDescription || `Booking ${moving ? 'moving labor' : dumpster ? 'a dumpster' : 'your pickup'} online has never been easier.`} items={steps} />
    <HomeCoverageSection titleStart={serviceArea.titleStart} titleAccent={serviceArea.titleAccent} subtitle={serviceArea.subtitle} showSameDay={serviceArea.showSameDay} onCheck={onZipCheck} />
    <section className="service-copy home-soft-band">
      <h2 className="home-display text-[#140a1f]">{content.title}</h2>
      {content.body}
    </section>
    {children}
    <HomeWaysToBook bookingPath={bookingPath} bookingState={bookingState} />
    <HomeReviews />
    {afterTestimonials}
  </div>;
};
