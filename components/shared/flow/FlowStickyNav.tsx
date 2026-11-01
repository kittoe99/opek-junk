import React from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface FlowStickyNavProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueType?: 'button' | 'submit';
  continueForm?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  backLabel?: string;
  showBack?: boolean;
  showContinue?: boolean;
  className?: string;
}

export const FlowStickyNav: React.FC<FlowStickyNavProps> = ({
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueType = 'button',
  continueForm,
  continueDisabled = false,
  continueLoading = false,
  backLabel = 'Back',
  showBack = true,
  showContinue = true,
  className = '',
}) => {
  const hasBack = showBack && !!onBack;
  return (
    <div
      className={`site-flow-nav fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-white/95 backdrop-blur px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] ${className}`}
    >
      <div className="max-w-lg mx-auto flex gap-2.5">
        {hasBack && (
          <button
            type="button"
            onClick={onBack}
            className={`flow-btn flow-btn-back ${showContinue ? 'shrink-0 px-4' : 'w-full'}`}
            aria-label={showContinue ? backLabel : undefined}
          >
            <ArrowLeft size={18} aria-hidden />
            <span className={showContinue ? 'sr-only sm:not-sr-only' : ''}>{backLabel}</span>
          </button>
        )}
        {showContinue && (
          <button
            type={continueType}
            form={continueForm}
            onClick={continueType === 'button' ? onContinue : undefined}
            disabled={continueDisabled || continueLoading}
            aria-busy={continueLoading}
            className="flow-btn flow-btn-primary flex-1"
          >
            {continueLoading ? (
              <><Loader2 size={18} className="animate-spin" aria-hidden /><span>{continueLabel}</span></>
            ) : (
              <>
                {continueLabel}
                <ArrowRight size={18} aria-hidden />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
