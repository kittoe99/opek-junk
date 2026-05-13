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

    t1.current = window.setTimeout(() => setActive(false), 550);   // start fade
    t2.current = window.setTimeout(() => setVisible(false), 900);  // unmount

    return () => {
      if (t1.current) window.clearTimeout(t1.current);
      if (t2.current) window.clearTimeout(t2.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out bg-white/30 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src="/logo1.png"
        alt="Opek"
        className="h-14 w-auto object-contain animate-pl-breathe"
        draggable={false}
      />

      <style>{`
        @keyframes pl-breathe {
          0%, 100% { opacity: 0.45; transform: scale(0.96); }
          50%      { opacity: 1;    transform: scale(1); }
        }
        .animate-pl-breathe { animation: pl-breathe 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
