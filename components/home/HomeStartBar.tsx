import React from 'react';
import { Phone } from 'lucide-react';

const SITE_PHONE = '+18777574365';

interface HomeStartBarProps {
  /** Button label; defaults to the homepage's "Get my price". */
  label?: string;
  onGetQuote?: () => void;
  href?: string;
}

/** Primary action bar: sticky under the header on desktop, fixed to the bottom with a call button on phones. */
export const HomeStartBar: React.FC<HomeStartBarProps> = ({ label = 'Get my price', onGetQuote, href }) => (
  <div className="home-start-bar">
    {href ? (
      <a href={href} className="home-cta home-start-bar-btn">{label}</a>
    ) : (
      <button type="button" onClick={onGetQuote} className="home-cta home-start-bar-btn">{label}</button>
    )}
    <a href={`tel:${SITE_PHONE}`} className="home-start-bar-call" aria-label="Call Opek Junk Removal">
      <Phone size={20} strokeWidth={2.2} aria-hidden />
    </a>
  </div>
);
