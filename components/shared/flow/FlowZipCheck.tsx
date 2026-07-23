import React from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { FLOW_INPUT } from '../../../lib/flowPageLayout';
import { FlowStepTitle } from './FlowStepTitle';
import { FlowStickyNav } from './FlowStickyNav';

interface FlowZipCheckProps {
  title?: React.ReactNode;
  subtitle?: string;
  zipValue: string;
  onZipChange: (value: string) => void;
  onCheck: () => void;
  loading?: boolean;
  error?: string | null;
  result?: { city: string; state: string } | null;
  onBack?: () => void;
  showBack?: boolean;
}

export const FlowZipCheck: React.FC<FlowZipCheckProps> = ({
  title = 'Where do you need service?',
  subtitle = 'Enter your ZIP code to confirm nationwide coverage.',
  zipValue,
  onZipChange,
  onCheck,
  loading = false,
  error = null,
  result = null,
  onBack,
  showBack = false,
}) => (
  <>
    <FlowStepTitle title={title} subtitle={subtitle} />

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-secondary mb-1.5 text-center">ZIP code</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={zipValue}
          onChange={(e) => onZipChange(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && zipValue.length === 5 && onCheck()}
          placeholder="e.g. 90210"
          className={`${FLOW_INPUT} font-mono tracking-wider text-center text-lg py-4`}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="flex items-center gap-2 p-3 bg-white border border-brand/20 rounded-xl shadow-[0_2px_8px_rgba(53,80,112,0.06)]">
          <Check size={16} className="text-brand shrink-0" strokeWidth={2.5} />
          <span className="text-sm font-medium text-secondary">
            {result.city}, {result.state}
          </span>
          <span className="text-xs text-secondary-400 ml-auto">Continuing…</span>
        </div>
      )}

      <p className="text-xs text-secondary-400 text-center">Nationwide coverage · All 50 states</p>
    </div>

    {!result && (
      <FlowStickyNav
        showBack={showBack}
        onBack={onBack}
        onContinue={onCheck}
        continueLabel="Continue"
        continueDisabled={zipValue.length !== 5}
        continueLoading={loading}
      />
    )}
  </>
);
