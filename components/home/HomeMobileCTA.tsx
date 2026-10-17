import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

const SITE_PHONE = '8313187139';

/**
 * Phone-only sticky action bar for the homepage. It appears once the hero is
 * scrolled past and hides again when the footer comes into view.
 */
export const HomeMobileCTA: React.FC<{ onGetQuote: () => void }> = ({ onGetQuote }) => {
  const [pastHero, setPastHero] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.home-hero');
    const footer = document.querySelector('footer');
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const o = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0 });
      o.observe(hero);
      observers.push(o);
    }
    if (footer) {
      const o = new IntersectionObserver(([entry]) => setAtFooter(entry.isIntersecting), { threshold: 0 });
      o.observe(footer);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visible = pastHero && !atFooter;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-[#e4e0e8] bg-white/95 backdrop-blur px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-18px_rgba(40,10,80,0.45)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex gap-2.5">
        <button type="button" onClick={onGetQuote} className="home-cta flex-1 min-h-[50px]" tabIndex={visible ? 0 : -1}>
          Get my price
        </button>
        <a
          href={`tel:${SITE_PHONE}`}
          className="flex w-[50px] shrink-0 items-center justify-center border-2 border-[#520f96] text-[#520f96]"
          aria-label="Call Opek Junk Removal"
          tabIndex={visible ? 0 : -1}
        >
          <Phone size={20} strokeWidth={2.4} aria-hidden />
        </a>
      </div>
    </div>
  );
};
