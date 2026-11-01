import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { HomeLogo } from '../../home/HomeLogo';
import { FlowProgressBar } from './FlowProgressBar';

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
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center gap-3">
          <button
            type="button"
            onClick={requestLeave}
            className="relative z-10 shrink-0 rounded-none"
            aria-label="Opek home"
          >
            <HomeLogo className="h-12 sm:h-14 w-auto" />
          </button>

          <div className="pointer-events-none absolute inset-0 hidden sm:flex flex-col items-center justify-center px-24 sm:px-40 leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">{flowLabel}</span>
            {stepLabel && (
              <span className="truncate max-w-full text-[13px] font-extrabold text-[var(--text)]">{stepLabel}</span>
            )}
          </div>

          <div className="relative z-10 ml-auto -mr-2 flex items-center">
            <button
              type="button"
              onClick={requestLeave}
              className="mnav-icon"
              aria-label="Close and go home"
            >
              <X size={26} strokeWidth={2.2} aria-hidden />
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
          <div className="ui-dialog relative z-10 w-full max-w-sm bg-white p-6 border border-[var(--border)]">
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
