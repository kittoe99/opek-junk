import React from 'react';
import { Loader2 } from 'lucide-react';

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
}) => (
  <div
    className={`fixed bottom-0 left-0 right-0 z-30 bg-[#070709]/92 backdrop-blur-md border-t border-white/[0.08] px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(0,0,0,0.45)] ${className}`}
  >
    <div className="max-w-lg mx-auto flex gap-3">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className={`${showContinue ? 'flex-1' : 'w-full'} py-3.5 text-sm font-semibold border border-white/15 text-[var(--text)] bg-transparent hover:bg-white/[0.06] rounded-full transition-colors`}
        >
          {backLabel}
        </button>
      )}
      {showContinue && (
        <button
          type={continueType}
          form={continueForm}
          onClick={continueType === 'button' ? onContinue : undefined}
          disabled={continueDisabled || continueLoading}
          className={`${showBack && onBack ? 'flex-[2]' : 'flex-1 w-full'} py-3.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-[0_0_24px_-6px_rgba(255,0,110,0.55)]`}
        >
          {continueLoading ? <Loader2 size={16} className="animate-spin" /> : continueLabel}
        </button>
      )}
    </div>
  </div>
);
