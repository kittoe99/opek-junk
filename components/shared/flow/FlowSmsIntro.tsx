import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FlowSmsIntroProps { onContinue: () => void; }

/** First screen of /quote: one image, one headline, one line, one button. */
export const FlowSmsIntro: React.FC<FlowSmsIntroProps> = ({ onContinue }) => {
  const continueAtTop = () => {
    onContinue();
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  };
  return (
    <section className="flow-intro" aria-labelledby="flow-intro-title">
      <div className="flow-intro-inner">
        <div className="flow-intro-art">
          <img
            src="/service-scenes/quote-estimate-two-phones-stripes.png"
            alt="Two tilted phones showing sofa and box pickup items beside a sample $169 junk removal estimate"
            className="flow-intro-image"
          />
        </div>
        <div className="flow-intro-copy">
          <h1 id="flow-intro-title" className="home-display flow-intro-title">
            Know the price.
            <br />
            Then make room.
          </h1>
          <p className="flow-intro-sub">Free estimate by text in about a minute.</p>
          <button type="button" onClick={continueAtTop} className="flow-btn flow-btn-primary flow-intro-cta">
            Get my free quote
            <ArrowRight size={18} aria-hidden />
          </button>
          <p className="flow-intro-note">No obligation to book.</p>
        </div>
      </div>
    </section>
  );
};
