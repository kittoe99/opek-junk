import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

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
          <ol className="flow-intro-steps" aria-label="How it works">
            {['Pick your items', 'Get your price by text', 'Book a time'].map((step, i) => (
              <li key={step}>
                <span className="flow-intro-step-num" aria-hidden>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <button type="button" onClick={continueAtTop} className="flow-btn flow-btn-primary flow-intro-cta">
            Get my free quote
            <ArrowRight size={18} aria-hidden />
          </button>
          <p className="flow-intro-note">
            No obligation to book
            <span aria-hidden> · </span>
            <span className="inline-flex items-center gap-1">
              <Star size={13} className="fill-[#520f96] text-[#520f96]" aria-hidden />
              Rated 4.8
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
