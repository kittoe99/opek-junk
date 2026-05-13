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

    t1.current = window.setTimeout(() => setActive(false), 700);  // start fade after entrance completes
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
      className={`fixed inset-0 z-[200] flex items-center justify-center pointer-events-none transition-opacity duration-300 ease-out bg-white/15 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 select-none">
        {/* Slanted brand bars */}
        <div className="flex gap-1.5">
          <span className="pl-bar pl-bar-1" />
          <span className="pl-bar pl-bar-2" />
        </div>

        {/* Wordmark + tagline */}
        <div className="flex flex-col -space-y-0.5 mt-0.5">
          <div className="overflow-hidden leading-none">
            <h1 className="pl-word text-5xl md:text-6xl font-black italic tracking-tighter text-secondary leading-[0.85] flex items-start">
              Opek
              <span className="text-[10px] md:text-xs font-medium not-italic tracking-normal mt-1 ml-0.5 opacity-70">TM</span>
            </h1>
          </div>
          <div className="overflow-hidden leading-none">
            <p className="pl-tag text-base md:text-lg font-light italic tracking-tight text-secondary/80">Junk Removal</p>
          </div>
        </div>
      </div>

      <style>{`
        .pl-bar {
          width: 1.25rem;
          height: 2.75rem;
          background: #ff006e;
          border-radius: 2px;
          transform: skewX(-18deg) scaleY(0);
          transform-origin: bottom;
          animation: pl-bar-rise 0.4s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
        .pl-bar-2 { animation-delay: 0.06s; opacity: 0.85; }

        .pl-word {
          transform: translateY(100%) skewX(-10deg);
          animation: pl-rise 0.45s cubic-bezier(0.33, 1, 0.68, 1) 0.15s forwards;
        }
        .pl-tag {
          transform: translateY(-100%);
          opacity: 0;
          animation: pl-drop 0.45s cubic-bezier(0.33, 1, 0.68, 1) 0.28s forwards;
        }

        @keyframes pl-bar-rise { to { transform: skewX(-18deg) scaleY(1); } }
        @keyframes pl-rise     { to { transform: translateY(0) skewX(0); } }
        @keyframes pl-drop     { to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};
