import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, X } from 'lucide-react';
import { useUserLocation } from '../../../lib/userLocation';
import { FlowProgressBar } from './FlowProgressBar';

const SUPPORT_PHONE_DISPLAY = '(831) 318-7139';
const SUPPORT_PHONE_TEL = 'tel:8313187139';

interface FlowChromeProps {
  /** Used in the leave-confirm copy */
  flowLabel: string;
  /** Optional step context (kept for callers; location chip is primary) */
  stepLabel?: string;
  /** 0–1 progress */
  progress: number;
  /** When true, logo/close ask before leaving */
  hasProgress?: boolean;
  /** Where to go after confirming leave */
  exitTo?: string;
}

export const FlowChrome: React.FC<FlowChromeProps> = ({
  flowLabel,
  progress,
  hasProgress = false,
  exitTo = '/',
}) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const { locationLabel, isDetectingLocation, fetchUserLocation } = useUserLocation();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    window.addEventListener('resize', syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [locationLabel, leaveOpen]);

  const requestLeave = () => {
    if (hasProgress) {
      setLeaveOpen(true);
      return;
    }
    navigate(exitTo);
  };

  const confirmLeave = () => {
    setLeaveOpen(false);
    navigate(exitTo);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[70] bg-[#08080b]/95 backdrop-blur-xl border-b border-white/[0.07]"
      >
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3">
          <button
            type="button"
            onClick={requestLeave}
            className="relative z-10 shrink-0 rounded-lg px-1 py-1 hover:bg-white/5 transition-colors"
            aria-label="Opek home"
          >
            <img
              src="/opek-logo-white.png"
              alt="Opek Junk Removal"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </button>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-20 sm:px-36">
            <button
              type="button"
              onClick={() => void fetchUserLocation()}
              disabled={isDetectingLocation}
              className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
              aria-label="Detect location"
            >
              <MapPin size={14} className="text-brand shrink-0" strokeWidth={2.25} aria-hidden />
              <span className="truncate max-w-[8.5rem] sm:max-w-[12rem]">{locationLabel}</span>
            </button>
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-2 sm:gap-3">
            <a
              href={SUPPORT_PHONE_TEL}
              className="hidden sm:inline-flex items-center gap-1.5 shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-white/20 hover:bg-white/[0.06] transition-colors"
            >
              <Phone size={13} className="text-brand" />
              {SUPPORT_PHONE_DISPLAY}
            </a>

            <a
              href={SUPPORT_PHONE_TEL}
              className="sm:hidden shrink-0 h-9 w-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-200 hover:bg-white/[0.06] transition-colors"
              aria-label={`Call ${SUPPORT_PHONE_DISPLAY}`}
            >
              <Phone size={15} className="text-brand" />
            </a>

            <button
              type="button"
              onClick={requestLeave}
              className="shrink-0 h-9 w-9 rounded-full border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors"
              aria-label="Close and go home"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <FlowProgressBar progress={progress} />
      </header>

      {leaveOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="flow-leave-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Dismiss"
            onClick={() => setLeaveOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#121218] p-6 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] animate-scale-in">
            <h2 id="flow-leave-title" className="font-sans text-lg font-bold text-white tracking-tight">
              Leave this {flowLabel.toLowerCase()}?
            </h2>
            <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
              Your progress on this page may be lost if you leave now.
            </p>
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setLeaveOpen(false)}
                className="flex-1 inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-neutral-100 hover:bg-white/[0.06] transition-colors"
              >
                Keep going
              </button>
              <button
                type="button"
                onClick={confirmLeave}
                className="flex-1 inline-flex items-center justify-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
