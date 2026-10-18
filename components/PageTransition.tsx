import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SESSION_KEY = 'opek:intro-played';
const LOGO_MS = 850;

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function introAlreadyPlayed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroPlayed(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* storage unavailable: the intro may simply replay */
  }
}

/**
 * Branded page transition: a small translucent Opek mark animates in the centre while the new page fades in.
 * Plays on first load (once per session) and whenever the pathname changes. Never blocks input.
 */
export const PageTransition: React.FC = () => {
  const { pathname } = useLocation();
  const firstRender = useRef(true);
  const [run, setRun] = useState<number | null>(() => {
    if (prefersReducedMotion() || introAlreadyPlayed()) return null;
    return 0;
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      if (run !== null) markIntroPlayed();
      return;
    }
    if (prefersReducedMotion()) return;
    setRun((n) => (n ?? 0) + 1);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (run === null) return;
    const timer = window.setTimeout(() => setRun(null), LOGO_MS);
    return () => window.clearTimeout(timer);
  }, [run]);

  if (run === null) return null;

  return (
    <div key={run} className="pt-logo" aria-hidden="true">
      <svg className="pt-mark" viewBox="0 0 32 32" width="40" height="40">
        <polygon className="pt-slash pt-slash-a" points="15.04,5.12 20.16,5.12 14.4,26.88 9.28,26.88" />
        <polygon className="pt-slash pt-slash-b" points="23.36,5.12 28.48,5.12 22.72,26.88 17.6,26.88" />
      </svg>
    </div>
  );
};

/** Wraps page content so it eases in on every route change. */
export const PageEnter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="pt-enter">
      {children}
    </div>
  );
};
