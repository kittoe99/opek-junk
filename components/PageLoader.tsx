import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageLoader — minimal top progress bar (NProgress style) shown on every
 * route change. Non-blocking, transparent background, brand-colored bar
 * with a soft glow that fills, then fades out.
 */
export const PageLoader: React.FC = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(true);
  const t1 = useRef<number | null>(null);
  const t2 = useRef<number | null>(null);

  useEffect(() => {
    if (t1.current) window.clearTimeout(t1.current);
    if (t2.current) window.clearTimeout(t2.current);

    setVisible(true);
    requestAnimationFrame(() => setActive(true));

    t1.current = window.setTimeout(() => setActive(false), 700);  // start fade
    t2.current = window.setTimeout(() => setVisible(false), 950); // unmount

    return () => {
      if (t1.current) window.clearTimeout(t1.current);
      if (t2.current) window.clearTimeout(t2.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
        className={`fixed inset-0 z-[200] flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out bg-black/40 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-end gap-2 md:gap-2.5 select-none">
        <span className="pl-bar pl-bar-1" />
        <span className="pl-bar pl-bar-2" />
      </div>

      <style>{`
        .pl-bar {
          width: 1.5rem;
          height: 3.5rem;
          background: #ff006e;
          border-radius: 2px;
          transform: skewX(-18deg) scaleY(0);
          transform-origin: bottom;
          animation: pl-bar 1.1s cubic-bezier(0.33, 1, 0.68, 1) infinite;
        }
        @media (min-width: 768px) {
          .pl-bar { width: 2rem; height: 4.5rem; }
        }
        .pl-bar-2 { animation-delay: 0.15s; }

        @keyframes pl-bar {
          0%   { transform: skewX(-18deg) scaleY(0); }
          50%  { transform: skewX(-18deg) scaleY(1); }
          100% { transform: skewX(-18deg) scaleY(0); }
        }
      `}</style>
    </div>
  );
};
