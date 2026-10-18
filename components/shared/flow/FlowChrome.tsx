import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, X } from 'lucide-react';
import { HomeLogo } from '../../home/HomeLogo';
import { FlowProgressBar } from './FlowProgressBar';

const SUPPORT_PHONE_DISPLAY = '(831) 318-7139';
const SUPPORT_PHONE_TEL = 'tel:8313187139';

interface FlowChromeProps {
  /** Used in the leave-confirm copy */
  flowLabel: string;
  /** Current step name, shown in the header */
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
  stepLabel,
  progress,
  hasProgress = false,
  exitTo = '/',
}) => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);

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
  }, [leaveOpen]);

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
        className="site-flow-header sticky top-0 z-[70] bg-[var(--surface)] backdrop-blur-xl border-b border-[var(--border)]"
      >
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3">
          <button
            type="button"
            onClick={requestLeave}
            className="relative z-10 shrink-0 rounded-lg px-1 py-1 hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Opek home"
          >
            <HomeLogo className="h-7 sm:h-8 w-auto" />
          </button>

          <div className="pointer-events-none absolute inset-0 hidden sm:flex flex-col items-center justify-center px-24 sm:px-40 leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">{flowLabel}</span>
            {stepLabel && (
              <span className="truncate max-w-full text-[13px] font-extrabold text-[var(--text)]">{stepLabel}</span>
            )}
          </div>

          <div className="relative z-10 ml-auto flex items-center gap-2 sm:gap-3">
            <a
              href={SUPPORT_PHONE_TEL}
              className="inline-flex items-center gap-1.5 shrink-0 min-h-11 text-[13px] font-black whitespace-nowrap text-brand hover:opacity-80 transition-opacity"
              aria-label={`Call ${SUPPORT_PHONE_DISPLAY}`}
            >
              <Phone size={15} strokeWidth={3} aria-hidden />
              <span className="underline underline-offset-4">{SUPPORT_PHONE_DISPLAY}</span>
            </a>

            <button
              type="button"
              onClick={requestLeave}
              className="shrink-0 h-9 w-9 rounded-full border border-[var(--border)] text-[var(--text)] hover:text-brand hover:bg-[var(--surface-2)] flex items-center justify-center transition-colors"
              aria-label="Close and go home"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="sm:hidden flex flex-wrap items-center justify-center gap-x-2 px-4 pb-2 text-center leading-tight">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">{flowLabel}</span>
          {stepLabel && <span className="text-[12px] font-extrabold text-[var(--text)]">{stepLabel}</span>}
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
            className="absolute inset-0 bg-[#140a1f]/50"
            aria-label="Dismiss"
            onClick={() => setLeaveOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-[0_24px_60px_-20px_rgba(40,10,80,0.55)]">
            <h2 id="flow-leave-title" className="font-sans text-lg font-bold text-[var(--text)] tracking-tight">
              Leave this {flowLabel.toLowerCase()}?
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
              Your progress on this page may be lost if you leave now.
            </p>
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setLeaveOpen(false)}
                className="flow-btn flow-btn-back flex-1"
              >
                Keep going
              </button>
              <button
                type="button"
                onClick={confirmLeave}
                className="flow-btn flow-btn-primary flex-1"
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
