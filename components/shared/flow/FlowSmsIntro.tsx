import React from 'react';
import { FlowStepTitle } from './FlowStepTitle';
import { FlowStickyNav } from './FlowStickyNav';

interface FlowSmsIntroProps {
  onContinue: () => void;
}

export const FlowSmsIntro: React.FC<FlowSmsIntroProps> = ({ onContinue }) => (
  <>
    <FlowStepTitle
      title="Get Quote Sent To Your Phone"
      subtitle="Tell us what you need — we'll send a clear price estimate straight to your phone."
    />

    <div className="flex justify-center mb-2">
      <div
        className="relative w-[220px] select-none"
        aria-hidden
      >
        {/* Phone frame */}
        <div className="rounded-[2rem] border border-white/20 bg-[#0c0c10] p-2.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7),0_0_40px_-12px_rgba(255,0,110,0.25)]">
          {/* Notch */}
          <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-white/15" />

          {/* Screen */}
          <div className="rounded-[1.35rem] bg-[#121218] overflow-hidden min-h-[280px] px-3 pt-3 pb-4">
            {/* Status / app header */}
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="h-8 w-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-brand tracking-tight">O</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[var(--text)] leading-tight truncate">
                  Opek Junk Removal
                </p>
                <p className="text-[9px] text-[var(--text-muted)]">Text Message</p>
              </div>
            </div>

            {/* Incoming SMS bubble */}
            <div className="max-w-[92%]">
              <div className="rounded-2xl rounded-bl-md bg-white/[0.08] border border-white/10 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <p className="text-[11px] leading-relaxed text-[var(--text)]">
                  Hi Jordan — your junk removal estimate is ready:
                </p>
                <p className="mt-2 text-[15px] font-extrabold text-brand tracking-tight">
                  $219
                </p>
                <p className="mt-1.5 text-[10px] text-[var(--text-muted)] leading-relaxed">
                  Based on the items you listed. Reply BOOK to schedule or call us anytime.
                </p>
              </div>
              <p className="mt-1.5 text-[9px] text-[var(--text-muted)] px-1">Just now</p>
            </div>

            {/* Typing indicator / second beat */}
            <div className="mt-3 flex items-center gap-1.5 px-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand/70 animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand/50 animate-pulse [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand/30 animate-pulse [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <p className="text-xs text-[var(--text-muted)] text-center leading-relaxed px-2">
      Free estimate · No obligation · Nationwide coverage
    </p>

    <FlowStickyNav
      showBack={false}
      onContinue={onContinue}
      continueLabel="Get my quote"
    />
  </>
);
