import React, { useEffect, useMemo, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Loader2, Lock } from 'lucide-react';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { BOOKING_DEPOSIT_AMOUNT, BOOKING_DEPOSIT_AMOUNT_CENTS } from '../../lib/deposit';
import { SMS_MARKETING_CONSENT_TEXT } from '../../lib/customerConsent';
import { apiUrl } from '../../lib/apiBase';
import { isStripeConfigured, stripePromise } from '../../lib/stripe';

const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#ff006e',
    borderRadius: '12px',
  },
};

const STRIPE_ELEMENT_STYLE = {
  base: {
    fontSize: '14px',
    color: '#1f2937',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSmoothing: 'antialiased',
    '::placeholder': {
      color: '#9ca3af',
    },
    iconColor: '#9ca3af',
    lineHeight: '24px',
  },
  invalid: {
    color: '#ef4444',
    iconColor: '#ef4444',
  },
  complete: {
    color: '#1f2937',
    iconColor: '#10b981',
  },
} as const;

const CARD_FIELD_WRAPPER =
  'px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus-within:ring-4 focus-within:ring-brand/10 focus-within:border-brand focus-within:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300';

const FIELD_LABEL =
  'block text-[10px] font-black uppercase tracking-widest text-secondary-400 mb-1.5';

async function parseJsonResponse(response: Response) {
  const responseText = await response.text();
  const trimmed = responseText.trimStart();

  if (trimmed.startsWith('<')) {
    throw new Error('Payment API is unavailable. Please try again in a moment.');
  }

  try {
    return JSON.parse(responseText) as Record<string, unknown>;
  } catch {
    const plain = trimmed.replace(/\s+/g, ' ').slice(0, 180);
    throw new Error(
      plain
        ? `Payment server error: ${plain}`
        : 'Payment server returned an invalid response. Please try again.'
    );
  }
}

async function syncDepositPaymentIntent(paymentIntentId: string) {
  const response = await fetch(apiUrl('/api/sync-payment-intent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId }),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(
      (typeof data.error === 'string' && data.error) ||
        'Failed to save your card for future charges.'
    );
  }

  return data;
}

async function createDepositPaymentIntent(input: {
  email: string;
  name?: string;
  phone?: string;
  serviceType?: string;
}) {
  const paymentResponse = await fetch(apiUrl('/api/create-payment-intent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      name: input.name,
      phone: input.phone,
      serviceType: input.serviceType,
    }),
  });

  const paymentData = await parseJsonResponse(paymentResponse);
  if (!paymentResponse.ok) {
    throw new Error(
      (typeof paymentData.error === 'string' && paymentData.error) ||
        'Failed to initialize payment.'
    );
  }

  const clientSecret =
    typeof paymentData.clientSecret === 'string' ? paymentData.clientSecret : null;
  if (!clientSecret) {
    throw new Error('Failed to initialize payment.');
  }

  return clientSecret;
}

interface DepositPaymentFormProps {
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  serviceType?: string;
  isLoading?: boolean;
  smsMarketingConsentAt?: string | null;
  onSmsMarketingConsentChange?: (consentAt: string | null) => void;
  onBack: () => void;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void>;
}

const DepositPaymentForm: React.FC<DepositPaymentFormProps> = ({
  customerEmail,
  customerName,
  customerPhone,
  serviceType,
  isLoading = false,
  smsMarketingConsentAt = null,
  onSmsMarketingConsentChange,
  onBack,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [smsMarketingConsent, setSmsMarketingConsent] = useState(Boolean(smsMarketingConsentAt));
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [elementsReady, setElementsReady] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const cardReady = elementsReady.number && elementsReady.expiry && elementsReady.cvc;

  const handleSmsMarketingConsentChange = (checked: boolean) => {
    setSmsMarketingConsent(checked);
    onSmsMarketingConsentChange?.(checked ? new Date().toISOString() : null);
  };

  const markElementReady = (key: 'number' | 'expiry' | 'cvc') => {
    setElementsReady((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termsAccepted) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    if (!stripe || !elements) {
      setError('Payment form is still loading. Please try again.');
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement || !cardReady) {
      setError('Payment form is still loading. Please wait a moment and try again.');
      return;
    }

    try {
      setProcessing(true);

      const clientSecret = await createDepositPaymentIntent({
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        serviceType,
      });

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            email: customerEmail,
            name: customerName?.trim() || undefined,
            address: {
              postal_code: postalCode.trim() || undefined,
            },
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed. Please try again.');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        await syncDepositPaymentIntent(paymentIntent.id);
        await onPaymentSuccess(paymentIntent.id);
        return;
      }

      setError('Payment could not be completed. Please try again.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const busy = processing || isLoading;
  const canPay = Boolean(stripe && elements && cardReady);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-secondary-100 bg-secondary-50/30 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white border border-secondary-100 flex items-center justify-center shadow-sm">
              <CreditCard size={16} className="text-secondary-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-secondary">Payment details</p>
              <p className="text-[10px] text-secondary-400">Enter your card information below</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary-400">
            <Lock size={12} />
            Secure
          </div>
        </div>

        {!cardReady && (
          <div className="flex items-center justify-center gap-2 py-4 text-secondary-400 text-xs">
            <Loader2 className="animate-spin w-4 h-4" />
            Loading card form...
          </div>
        )}

        <div className={cardReady ? 'space-y-4' : 'space-y-4 opacity-0 h-0 overflow-hidden'}>
          <div>
            <label htmlFor="booking-deposit-card-number" className={FIELD_LABEL}>
              Card number
            </label>
            <div className={CARD_FIELD_WRAPPER}>
              <CardNumberElement
                id="booking-deposit-card-number"
                options={{
                  style: STRIPE_ELEMENT_STYLE,
                  showIcon: true,
                  placeholder: '1234 5678 9012 3456',
                }}
                onReady={() => markElementReady('number')}
                onChange={(event) => {
                  if (event.error) {
                    setError(event.error.message || 'Please check your card number.');
                    return;
                  }
                  if (error) {
                    setError(null);
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="booking-deposit-card-expiry" className={FIELD_LABEL}>
                Expiry date
              </label>
              <div className={CARD_FIELD_WRAPPER}>
                <CardExpiryElement
                  id="booking-deposit-card-expiry"
                  options={{
                    style: STRIPE_ELEMENT_STYLE,
                    placeholder: 'MM / YY',
                  }}
                  onReady={() => markElementReady('expiry')}
                  onChange={(event) => {
                    if (event.error) {
                      setError(event.error.message || 'Please check the expiry date.');
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="booking-deposit-card-cvc" className={FIELD_LABEL}>
                Security code
              </label>
              <div className={CARD_FIELD_WRAPPER}>
                <CardCvcElement
                  id="booking-deposit-card-cvc"
                  options={{
                    style: STRIPE_ELEMENT_STYLE,
                    placeholder: 'CVC',
                  }}
                  onReady={() => markElementReady('cvc')}
                  onChange={(event) => {
                    if (event.error) {
                      setError(event.error.message || 'Please check the security code.');
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="booking-deposit-postal-code" className={FIELD_LABEL}>
              ZIP / Postal code
            </label>
            <input
              id="booking-deposit-postal-code"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="12345"
              autoComplete="postal-code"
              className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 bg-secondary-50/50 border border-secondary-100 rounded-2xl cursor-pointer hover:border-brand/30 transition-colors">
        <div className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.target.checked);
              if (e.target.checked) setError(null);
            }}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              termsAccepted ? 'bg-brand border-brand' : 'bg-white border-secondary-300'
            }`}
          >
            {termsAccepted && <Check size={12} className="text-white" strokeWidth={3.5} />}
          </div>
        </div>
        <span className="text-xs text-secondary-600 leading-relaxed">
          I agree to the{' '}
          <Link
            to="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand font-bold hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand font-bold hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </Link>{' '}
          and authorize Opek Junk Removal to charge my payment method for the ${BOOKING_DEPOSIT_AMOUNT} deposit and any additional deposits or balances as described.
        </span>
      </label>

      <label className="flex items-start gap-3 p-4 bg-secondary-50/50 border border-secondary-100 rounded-2xl cursor-pointer hover:border-brand/30 transition-colors">
        <div className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={smsMarketingConsent}
            onChange={(e) => handleSmsMarketingConsentChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              smsMarketingConsent ? 'bg-brand border-brand' : 'bg-white border-secondary-300'
            }`}
          >
            {smsMarketingConsent && <Check size={12} className="text-white" strokeWidth={3.5} />}
          </div>
        </div>
        <span className="text-xs text-secondary-600 leading-relaxed">
          {SMS_MARKETING_CONSENT_TEXT}
        </span>
      </label>

      {error && (
        <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
      )}

      <div className="pt-2 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          type="submit"
          disabled={busy || !termsAccepted || !canPay}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
        >
          {busy ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Processing...
            </>
          ) : (
            <>Pay ${BOOKING_DEPOSIT_AMOUNT}</>
          )}
        </button>
      </div>
    </form>
  );
};

interface BookingDepositPaymentProps {
  appointmentDate: string;
  estimatedTotal: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  serviceType?: string;
  isLoading?: boolean;
  smsMarketingConsentAt?: string | null;
  onSmsMarketingConsentChange?: (consentAt: string | null) => void;
  onBack: () => void;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void>;
}

export const BookingDepositPayment: React.FC<BookingDepositPaymentProps> = ({
  customerEmail,
  customerName,
  customerPhone,
  serviceType,
  isLoading = false,
  smsMarketingConsentAt,
  onSmsMarketingConsentChange,
  onBack,
  onPaymentSuccess,
}) => {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeLoading, setStripeLoading] = useState(true);

  const elementsOptions = useMemo(
    () => ({
      mode: 'payment' as const,
      amount: BOOKING_DEPOSIT_AMOUNT_CENTS,
      currency: 'usd',
      appearance: STRIPE_APPEARANCE,
    }),
    []
  );

  useEffect(() => {
    if (!stripePromise) {
      setStripeLoading(false);
      return;
    }

    let cancelled = false;
    stripePromise.then((stripe) => {
      if (!cancelled) {
        setStripeInstance(stripe);
        setStripeLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isStripeConfigured) {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
        <p className="text-xs text-red-700 font-semibold">
          Stripe publishable key is missing. Add VITE_STRIPE_PUBLISHABLE_KEY to your environment.
        </p>
      </div>
    );
  }

  if (!customerEmail?.includes('@')) {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
        <p className="text-xs text-red-700 font-semibold">
          A valid email is required before payment. Go back and add your email.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-sm font-black text-secondary uppercase tracking-wider">Card payment</h2>
          <p className="text-xs text-secondary-400 mt-0.5">${BOOKING_DEPOSIT_AMOUNT} deposit due today</p>
        </div>
      </div>

      {stripeLoading || !stripeInstance ? (
        <div className="flex items-center justify-center gap-2 py-8 text-secondary-400 text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading secure checkout...
        </div>
      ) : (
        <Elements stripe={stripeInstance} options={elementsOptions}>
          <DepositPaymentForm
            customerEmail={customerEmail}
            customerName={customerName}
            customerPhone={customerPhone}
            serviceType={serviceType}
            isLoading={isLoading}
            smsMarketingConsentAt={smsMarketingConsentAt}
            onSmsMarketingConsentChange={onSmsMarketingConsentChange}
            onBack={onBack}
            onPaymentSuccess={onPaymentSuccess}
          />
        </Elements>
      )}
    </div>
  );
};

export { BOOKING_DEPOSIT_AMOUNT } from '../../lib/deposit';
