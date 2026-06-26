import React, { useEffect, useMemo, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { BOOKING_DEPOSIT_AMOUNT } from '../../lib/deposit';
import { isStripeConfigured, stripePromise } from '../../lib/stripe';

const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#ff006e',
    borderRadius: '12px',
  },
};

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: false,
  style: {
    base: {
      fontSize: '14px',
      color: '#1f2937',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
} as const;

interface DepositPaymentFormProps {
  clientSecret: string;
  isLoading?: boolean;
  onBack: () => void;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void>;
}

const DepositPaymentForm: React.FC<DepositPaymentFormProps> = ({
  clientSecret,
  isLoading = false,
  onBack,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardReady, setCardReady] = useState(false);

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

    const cardElement = elements.getElement(CardElement);
    if (!cardElement || !cardReady) {
      setError('Payment form is still loading. Please wait a moment and try again.');
      return;
    }

    try {
      setProcessing(true);

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed. Please try again.');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
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
      <div className="rounded-xl border border-secondary-100 bg-white p-4">
        {!cardReady && (
          <div className="flex items-center justify-center gap-2 py-6 text-secondary-400 text-xs">
            <Loader2 className="animate-spin w-4 h-4" />
            Loading card form...
          </div>
        )}
        <CardElement
          id="booking-deposit-card-element"
          options={CARD_ELEMENT_OPTIONS}
          onReady={() => setCardReady(true)}
          onChange={(event) => {
            if (event.error) {
              setError(event.error.message || 'Please check your card details.');
              return;
            }
            if (error) {
              setError(null);
            }
          }}
        />
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
          and authorize Opek Junk Removal to charge my payment method for the ${BOOKING_DEPOSIT_AMOUNT} deposit and any additional deposits or balances as described.
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
  onBack: () => void;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void>;
}

export const BookingDepositPayment: React.FC<BookingDepositPaymentProps> = ({
  customerEmail,
  customerName,
  customerPhone,
  serviceType,
  isLoading = false,
  onBack,
  onPaymentSuccess,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  const elementsOptions = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance: STRIPE_APPEARANCE,
          }
        : undefined,
    [clientSecret]
  );

  useEffect(() => {
    if (!stripePromise) {
      return;
    }

    let cancelled = false;
    stripePromise.then((stripe) => {
      if (!cancelled && stripe) {
        setStripeInstance(stripe);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const createPaymentIntent = async () => {
      setInitializing(true);
      setInitError(null);
      setClientSecret(null);

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            serviceType,
          }),
        });

        const responseText = await response.text();
        let data: { clientSecret?: string; error?: string };
        try {
          data = JSON.parse(responseText) as { clientSecret?: string; error?: string };
        } catch {
          throw new Error(
            responseText.trimStart().startsWith('<')
              ? 'Payment API is unavailable. If testing locally, add Stripe keys to .env.local and restart npm run dev.'
              : 'Payment server returned an invalid response. Please try again.'
          );
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment.');
        }

        if (!data.clientSecret) {
          throw new Error('Failed to initialize payment.');
        }

        if (!cancelled) {
          setClientSecret(data.clientSecret);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to initialize payment.';
          setInitError(message);
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    };

    if (isStripeConfigured) {
      createPaymentIntent();
    } else {
      setInitError('Stripe publishable key is missing. Add VITE_STRIPE_PUBLISHABLE_KEY to your environment.');
      setInitializing(false);
    }

    return () => {
      cancelled = true;
    };
  }, [customerEmail, customerName, customerPhone, serviceType]);

  const checkoutReady = Boolean(clientSecret && stripeInstance && elementsOptions && !initError);

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-sm font-black text-secondary uppercase tracking-wider">Card payment</h2>
          <p className="text-xs text-secondary-400 mt-0.5">${BOOKING_DEPOSIT_AMOUNT} deposit due today</p>
        </div>
      </div>

      {initializing && (
        <div className="flex items-center justify-center gap-2 py-8 text-secondary-400 text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading...
        </div>
      )}

      {initError && !initializing && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
          <p className="text-xs text-red-700 font-semibold">{initError}</p>
        </div>
      )}

      {!initializing && !initError && clientSecret && !stripeInstance && (
        <div className="flex items-center justify-center gap-2 py-8 text-secondary-400 text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading...
        </div>
      )}

      {checkoutReady && clientSecret && (
        <Elements key={clientSecret} stripe={stripeInstance} options={elementsOptions}>
          <DepositPaymentForm
            clientSecret={clientSecret}
            isLoading={isLoading}
            onBack={onBack}
            onPaymentSuccess={onPaymentSuccess}
          />
        </Elements>
      )}
    </div>
  );
};

export { BOOKING_DEPOSIT_AMOUNT } from '../../lib/deposit';
