import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/** A quiet purple progress line while a route changes. */
export const PageLoader: React.FC = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  if (!visible) return null;
  return (
    <div key={pathname} aria-hidden="true" className="fixed inset-x-0 top-0 z-[200] h-[3px] pointer-events-none">
      <div className="site-route-progress h-full bg-brand" />
    </div>
  );
};
