import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { FLOW_INPUT, FLOW_LABEL } from '../../../lib/flowPageLayout';
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
  <div className="home-light interior-home flow-zip-layout">
    <div className="flow-zip-art home-street-backdrop">
      <div className="flow-zip-banner"><span className="home-eyebrow">A fresh start</span><p className="home-display">Less junk.<br />More space.</p></div>
      <img src="/home-transparent/junk-dump-truck.png" alt="Purple dump truck ready for your pickup" />
    </div>
    <div className="flow-zip-content">
    <FlowStepTitle title={title} subtitle={subtitle} />

    <div className="space-y-4">
      <div>
        <label htmlFor="flow-zip" className={`${FLOW_LABEL} text-center`}>ZIP code</label>
        <input
          id="flow-zip"
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
        <div className="flex items-start gap-2 p-3 bg-brand/10 border border-brand/30 rounded-lg">
          <AlertCircle size={15} className="text-brand shrink-0 mt-0.5" />
          <p className="text-brand text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="flex items-center gap-2 p-3 bg-white/10 border border-white/30 rounded-xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 border border-brand/30 text-brand shrink-0">
            <Check size={16} strokeWidth={2.5} />
          </span>
          <span className="text-sm font-medium text-[var(--text)]">
            {result.city}, {result.state}
          </span>
          <span className="text-xs text-[var(--text-muted)] ml-auto">Continuing…</span>
        </div>
      )}

      <p className="text-xs text-[var(--text-muted)] text-center">Nationwide coverage · All 50 states</p>
    </div>
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
  </div>
);
