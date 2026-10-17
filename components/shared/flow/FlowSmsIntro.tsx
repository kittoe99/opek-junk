import React from 'react';
import { ServicePageHero } from '../ServicePageHero';
import { HomeHowItWorks } from '../../home/HomeSections';
import { HomeCallout } from '../../home/HomePagePatterns';

interface FlowSmsIntroProps { onContinue: () => void; }
export const FlowSmsIntro: React.FC<FlowSmsIntroProps> = ({ onContinue }) => {
  const continueAtTop = () => {
    onContinue();
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  };
  return (
  <div className="home-light interior-home flow-home-intro">
    <ServicePageHero eyebrow="Your free online estimate" title={<>Know the price.<br />Then make room.</>}
      subtitle="Share what you need removed and we’ll send the estimate straight to your phone. Free, with no obligation."
      image="/service-scenes/pickup-scheduling.png" imageAlt="Phone showing pickup time choices" chip="A few easy taps"
      primaryCta={{ label: 'Get my quote', onClick: continueAtTop }} secondaryCta={{ label: 'Call us', href: 'tel:8313187139' }}
      finePrint="Your estimate is based on the items you list. Pricing and availability vary by location. Services are performed by independent local providers."
    />
    <HomeHowItWorks title="A clear price. In a few taps." description="See what your pickup could cost before you book." items={[
      { title: 'Choose your service', body: 'Start with your ZIP code and tell us what kind of help you need.', image: '/service-scenes/junk-truck.png', alt: 'Purple junk removal dump truck' },
      { title: 'Pick your items', body: 'Choose your items from the catalog to build an itemized estimate.', image: '/service-scenes/mattress-pickup.png', alt: 'Provider carrying a mattress' },
      { title: 'Get your estimate', body: 'We send your estimate to your phone. When you are ready, choose a pickup time.', image: '/service-scenes/pickup-scheduling.png', alt: 'Pickup scheduling on a phone' },
    ]} />
    <HomeCallout title="Ready to clear your space?" body="Start your free estimate. No obligation to book." label="Get my quote" onClick={continueAtTop} />
  </div>
  );
};
