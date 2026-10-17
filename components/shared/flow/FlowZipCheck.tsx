import React from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, MapPin, ShieldCheck, Star, Truck } from 'lucide-react';
import { FlowStepTitle } from './FlowStepTitle';

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

/** ZIP coverage step shared by the quote and booking flows. */
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
}) => {
  const ready = zipValue.length === 5;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ready && !loading && !result) onCheck();
  };

  return (
    <div className="home-light interior-home flow-zip-layout">
      <div className="flow-zip-art home-scene-photo" aria-hidden>
        <img src="/service-scenes/junk-truck.png" alt="" />
      </div>

      <div className="flow-zip-content">
        {showBack && onBack && (
          <button type="button" onClick={onBack} className="flow-zip-back">
            <ArrowLeft size={16} aria-hidden />
            Back
          </button>
        )}

        <FlowStepTitle eyebrow="Check coverage" title={title} subtitle={subtitle} />

        <form onSubmit={submit} className="flow-zip-form" noValidate>
          <label htmlFor="flow-zip" className="sr-only">ZIP code</label>
          <div className={`flow-zip-field ${error ? 'has-error' : ''} ${result ? 'is-ok' : ''}`}>
            <MapPin size={22} className="flow-zip-pin" aria-hidden />
            <input
              id="flow-zip"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="postal-code"
              enterKeyHint="go"
              maxLength={5}
              value={zipValue}
              onChange={(e) => onZipChange(e.target.value.replace(/\D/g, ''))}
              placeholder="ZIP code"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'flow-zip-error' : result ? 'flow-zip-result' : undefined}
              disabled={Boolean(result)}
            />
            {result && <CheckCircle2 size={22} className="flow-zip-ok" aria-hidden />}
          </div>

          {error && (
            <p id="flow-zip-error" role="alert" className="flow-zip-error">
              <AlertCircle size={15} aria-hidden />
              {error}
            </p>
          )}

          {result ? (
            <p id="flow-zip-result" className="flow-zip-success" aria-live="polite">
              <CheckCircle2 size={18} aria-hidden />
              <span><strong>{result.city}, {result.state}</strong> is covered. Continuing…</span>
            </p>
          ) : (
            <button type="submit" disabled={!ready || loading} className="flow-btn flow-btn-primary w-full">
              {loading ? (
                <Loader2 size={18} className="animate-spin" aria-label="Checking" />
              ) : (
                <>
                  Check my area
                  <ArrowRight size={18} aria-hidden />
                </>
              )}
            </button>
          )}
        </form>

        <ul className="flow-zip-trust">
          <li><Truck size={15} aria-hidden />All 50 states</li>
          <li><ShieldCheck size={15} aria-hidden />Vetted providers</li>
          <li><Star size={15} aria-hidden />Rated 4.8</li>
        </ul>
      </div>
    </div>
  );
};
