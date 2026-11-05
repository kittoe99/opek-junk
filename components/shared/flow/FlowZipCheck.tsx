import React from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, MapPin, ShieldCheck, Star, Truck } from 'lucide-react';
import { FlowStepTitle } from './FlowStepTitle';

interface FlowZipCheckProps {
  title?: React.ReactNode;
  subtitle?: string;
  /** Optional "how it works" strip shown under the title. */
  steps?: string[];
  zipValue: string;
  onZipChange: (value: string) => void;
  onCheck: () => void;
  loading?: boolean;
  error?: string | null;
  result?: { city: string; state: string } | null;
  onBack?: () => void;
  showBack?: boolean;
  /** "split" pairs the form with a photo; "card" is the centered soft-card layout. */
  variant?: 'split' | 'card';
  /** Photo shown with the form. */
  image?: string;
}

/** ZIP coverage step shared by the quote and booking flows. */
export const FlowZipCheck: React.FC<FlowZipCheckProps> = ({
  title = 'Where do you need service?',
  subtitle = 'Enter your ZIP code to confirm nationwide coverage.',
  steps,
  zipValue,
  onZipChange,
  onCheck,
  loading = false,
  error = null,
  result = null,
  onBack,
  showBack = false,
  variant = 'split',
  image = '/optimized/service-scenes/junk-removal-natural.webp',
}) => {
  const ready = zipValue.length === 5;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ready && !loading && !result) onCheck();
  };

  const stepsStrip = steps && steps.length > 0 ? (
    <ol className="flow-zip-steps" aria-label="How it works">
      {steps.map((step, i) => (
        <li key={step}>
          <span className="flow-zip-step-num" aria-hidden>{i + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  ) : null;

  const card = variant === 'card';
  const form = (
    <form onSubmit={submit} className={card ? 'zip-hero-form' : 'flow-zip-form'} noValidate>
      <label htmlFor="flow-zip" className="sr-only">ZIP code</label>
      <div className={`${card ? 'zip-hero-field' : 'flow-zip-field'} ${error ? 'has-error' : ''} ${result ? 'is-ok' : ''}`}>
        <MapPin size={22} strokeWidth={card ? 1.8 : 2} className={card ? undefined : 'flow-zip-pin'} aria-hidden />
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
          placeholder={card ? 'Enter ZIP code' : 'ZIP code'}
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
        <button
          type="submit"
          disabled={!ready || loading}
          aria-busy={loading}
          className={card ? 'home-cta zip-hero-submit' : 'flow-btn flow-btn-primary w-full'}
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" aria-hidden /><span>Checking…</span></>
          ) : card ? (
            'Check availability'
          ) : (
            <>
              Check my area
              <ArrowRight size={18} aria-hidden />
            </>
          )}
        </button>
      )}
    </form>
  );

  const trust = (
    <ul className="flow-zip-trust">
      <li><Truck size={15} aria-hidden />All 50 states</li>
      <li><ShieldCheck size={15} aria-hidden />Vetted providers</li>
      <li><Star size={15} aria-hidden />Rated 4.8</li>
    </ul>
  );

  if (card) {
    // Same layout as the homepage hero: headline, photo, overlapping ZIP card.
    return (
      <div className="zip-hero flow-zip-hero">
        <div className="zip-hero-head">
          <h1 className="home-display zip-hero-title">{title}</h1>
          {subtitle && <p className="zip-hero-sub">{subtitle}</p>}
        </div>
        <div className="zip-hero-media" aria-hidden>
          <img src={image} alt="" />
        </div>
        <div className="zip-hero-card-wrap">
          <div className="zip-hero-card">
            <h2 className="home-display zip-hero-card-title">Start with your ZIP code</h2>
            {form}
            <p className="zip-hero-call">
              Or call <a href="tel:+18777574365">(877) 757-4365</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-light interior-home flow-zip-layout">
      <div className="flow-zip-art home-scene-photo" aria-hidden>
        <img src={image} alt="" />
      </div>

      <div className="flow-zip-content">
        {showBack && onBack && (
          <button type="button" onClick={onBack} className="flow-zip-back">
            <ArrowLeft size={16} aria-hidden />
            Back
          </button>
        )}

        <FlowStepTitle eyebrow="Check coverage" title={title} subtitle={subtitle} />
        {stepsStrip}
        {form}
        {trust}
      </div>
    </div>
  );
};
