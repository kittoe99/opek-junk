import React, { useEffect, useRef } from 'react';
import { Phone } from 'lucide-react';

const SITE_PHONE = '+18777574365';

/** Largest shift we trust; anything bigger is a misreading rather than a browser toolbar. */
const MAX_SHIFT_PX = 120;

/**
 * Some Android browsers leave `position: fixed; bottom: 0` above the screen edge once their
 * bottom toolbar hides. This measures that gap against the visible area and closes it.
 */
function useStickToVisibleBottom(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const viewport = window.visualViewport;
    const bar = ref.current;
    if (!viewport || !bar) return;

    // A bare fixed element shows where `bottom: 0` lands, unaffected by the bar's own shift.
    const probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:0;bottom:0;width:0;height:0;visibility:hidden;pointer-events:none';
    document.body.appendChild(probe);

    let frame = 0;
    const sync = () => {
      frame = 0;
      const gap = viewport.offsetTop + viewport.height - probe.getBoundingClientRect().bottom;
      // Leave it alone when pinch-zoomed, and never chase the keyboard (a negative gap).
      const shift = viewport.scale > 1.01 || gap > MAX_SHIFT_PX ? 0 : Math.max(0, Math.round(gap));
      bar.style.transform = shift ? `translateY(${shift}px)` : '';
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(sync);
    };

    sync();
    viewport.addEventListener('resize', schedule);
    viewport.addEventListener('scroll', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      viewport.removeEventListener('resize', schedule);
      viewport.removeEventListener('scroll', schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(frame);
      probe.remove();
    };
  }, [ref]);
}

interface HomeStartBarProps {
  /** Button label; defaults to the homepage's "Get my price". */
  label?: string;
  onGetQuote?: () => void;
  href?: string;
}

/** Primary action bar: sticky under the header on desktop, fixed to the bottom with a call button on phones. */
export const HomeStartBar: React.FC<HomeStartBarProps> = ({ label = 'Get my price', onGetQuote, href }) => {
  const bar = useRef<HTMLDivElement>(null);
  useStickToVisibleBottom(bar);

  return (
    <div ref={bar} className="home-start-bar">
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
};
