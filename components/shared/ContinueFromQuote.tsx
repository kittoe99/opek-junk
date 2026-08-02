import React, { useState } from 'react';
import { ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
import {
  hydrateFromQuoteResume,
  requestQuoteLookupOtp,
  verifyQuoteLookupOtp,
  type QuoteResumePayload,
  type HydratedQuoteResume,
} from '../../lib/lookupQuoteByPhone';
import {
  FLOW_BACK_BUTTON,
  FLOW_CONTINUE_BUTTON,
  FLOW_INPUT,
  FLOW_LABEL,
} from '../../lib/flowPageLayout';
import { InputPhoneIcon } from '../icons/ServiceIcons';
import { FlowStepTitle } from './flow/FlowStepTitle';

type Step = 'phone' | 'otp' | 'summary';

interface ContinueFromQuoteProps {
  onContinue: (hydrated: HydratedQuoteResume) => void;
  onStartNew: () => void;
  onBack: () => void;
}

function formatDisplayPhone(val: string) {
  if (!val) return '';
  if (val.length <= 3) return val;
  if (val.length <= 6) return `(${val.slice(0, 3)}) ${val.slice(3)}`;
  return `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
}

function formatQuoteDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export const ContinueFromQuote: React.FC<ContinueFromQuoteProps> = ({
  onContinue,
  onStartNew,
  onBack,
}) => {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<QuoteResumePayload | null>(null);
  const [hydrated, setHydrated] = useState<HydratedQuoteResume | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 11 && val.startsWith('1')) val = val.slice(1);
    setPhone(val.slice(0, 10));
  };

  const sendCode = async () => {
    setError(null);
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      const result = await requestQuoteLookupOtp(formatDisplayPhone(phone));
      if (!result.ok) {
        if (result.reason === 'no_quote') {
          setError('No open quote found for that number. Start a new booking instead.');
        } else {
          setError(result.error || 'Could not send verification code.');
        }
        return;
      }
      setStep('otp');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError(null);
    const digits = code.replace(/\D/g, '');
    if (digits.length !== 6) {
      setError('Enter the 6-digit code we texted you.');
      return;
    }
    setLoading(true);
    try {
      const result = await verifyQuoteLookupOtp(formatDisplayPhone(phone), digits);
      if (!result.ok || !result.prebooking) {
        setError(result.error || 'Verification failed.');
        return;
      }
      const next = hydrateFromQuoteResume(result.prebooking);
      setPayload(result.prebooking);
      setHydrated(next);
      setStep('summary');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'summary' && payload && hydrated) {
    const price = hydrated.estimate.price;
    return (
      <>
        <FlowStepTitle
          title="We found your quote"
          subtitle="Continue with this estimate, or start a new booking from scratch."
        />

        <div className="rounded-2xl border border-white/10 bg-[var(--surface)] p-5 mb-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{hydrated.serviceType}</p>
              {payload.created_at ? (
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Quoted {formatQuoteDate(payload.created_at)}
                </p>
              ) : null}
            </div>
            {price > 0 ? (
              <p className="text-xl font-bold text-[var(--text)] shrink-0">${price}</p>
            ) : null}
          </div>
          {hydrated.estimate.summary ? (
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{hydrated.estimate.summary}</p>
          ) : null}
          {hydrated.prefilledPhone ? (
            <p className="text-xs text-[var(--text-muted)]">Phone: {hydrated.prefilledPhone}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => onContinue(hydrated)}
            className={FLOW_CONTINUE_BUTTON.replace('flex-[2]', 'w-full')}
          >
            Continue this quote
          </button>
          <button
            type="button"
            onClick={onStartNew}
            className={FLOW_BACK_BUTTON.replace('flex-1', 'w-full')}
          >
            Start a new quote
          </button>
        </div>
      </>
    );
  }

  if (step === 'otp') {
    return (
      <>
        <FlowStepTitle
          title="Enter your code"
          subtitle={`We texted a 6-digit code to ${formatDisplayPhone(phone)}.`}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void verifyCode();
          }}
          className="space-y-4"
        >
          <div>
            <label className={FLOW_LABEL} htmlFor="quote-otp">
              Verification code
            </label>
            <input
              id="quote-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => {
                setError(null);
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              }}
              placeholder="######"
              className={`${FLOW_INPUT} tracking-[0.35em] text-center text-lg font-semibold`}
              disabled={loading}
            />
          </div>

          {error ? (
            <div className="p-3 bg-brand/10 border border-brand/30 rounded-xl">
              <p className="text-brand text-xs font-bold">{error}</p>
            </div>
          ) : null}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError(null);
              }}
              className={FLOW_BACK_BUTTON}
              disabled={loading}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button type="submit" className={FLOW_CONTINUE_BUTTON} disabled={loading || code.length !== 6}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Verify
            </button>
          </div>

          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={loading}
            className="w-full text-center text-xs font-semibold text-neutral-400 hover:text-white transition-colors py-2"
          >
            Resend code
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <FlowStepTitle
        title="Continue from a quote"
        subtitle="Enter the phone number you used for your estimate. We’ll text a code to unlock it."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendCode();
        }}
        className="space-y-4"
      >
        <div>
          <label className={FLOW_LABEL} htmlFor="quote-lookup-phone">
            Phone number
          </label>
          <div className="relative">
            <InputPhoneIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
            />
            <input
              id="quote-lookup-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={formatDisplayPhone(phone)}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              className={`${FLOW_INPUT} pl-10`}
              disabled={loading}
            />
          </div>
        </div>

        {error ? (
          <div className="p-3 bg-brand/10 border border-brand/30 rounded-xl space-y-2">
            <p className="text-brand text-xs font-bold">{error}</p>
            {error.includes('No open quote') ? (
              <button
                type="button"
                onClick={onStartNew}
                className="text-xs font-semibold text-neutral-200 underline underline-offset-2"
              >
                Start a new booking
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="flex gap-2.5 pt-1">
          <button type="button" onClick={onBack} className={FLOW_BACK_BUTTON} disabled={loading}>
            <ArrowLeft size={16} /> Back
          </button>
          <button type="submit" className={FLOW_CONTINUE_BUTTON} disabled={loading || phone.length < 10}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
            Text me a code
          </button>
        </div>
      </form>
    </>
  );
};
