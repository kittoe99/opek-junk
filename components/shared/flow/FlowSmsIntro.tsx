import React from 'react';
import { Check, Star } from 'lucide-react';
import { ServicePageHero } from '../ServicePageHero';

interface FlowSmsIntroProps { onContinue: () => void; }

/** First screen of /quote: one message, one button. Kept short on purpose to maximise starts. */
export const FlowSmsIntro: React.FC<FlowSmsIntroProps> = ({ onContinue }) => {
  const continueAtTop = () => {
    onContinue();
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  };
  return (
    <div className="home-light interior-home flow-home-intro">
      <ServicePageHero
        eyebrow="Free online estimate"
        chip="Free estimate"
        title={<>Know the price.<br />Then make room.</>}
        subtitle="Pick your items and get your estimate by text in about a minute."
        image="/service-scenes/pickup-scheduling.png"
        imageAlt="Phone showing pickup time choices"
        primaryCta={{ label: 'Get my free quote', onClick: continueAtTop }}
        finePrint="Your estimate is based on the items you list. Pricing and availability vary by location. Services are performed by independent local providers."
      >
        <ul className="intro-trust" aria-label="Why get a quote">
          <li><Star size={14} className="intro-trust-star" aria-hidden />Rated 4.8</li>
          <li><Check size={14} strokeWidth={3} aria-hidden />No obligation</li>
          <li><Check size={14} strokeWidth={3} aria-hidden />100% free</li>
        </ul>
      </ServicePageHero>
    </div>
  );
};
