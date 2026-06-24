import React, { useEffect, useMemo, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Loader2, Lock, AlertCircle } from 'lucide-react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { BOOKING_DEPOSIT_AMOUNT } from '../../lib/deposit';
import { isStripeConfigured, isStripeTestMode, stripePromise } from '../../lib/stripe';

const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  disableAnimations: true,
  variables: {
    colorPrimary: '#ff006e',
    borderRadius: '12px',
  },
};

interface DepositPaymentFormProps {
  appointmentDate: string;
  estimatedTotal: number;
  isLoading?: boolean;
  onBack: () => void;
  onPaymentSuccess: (paymentIntentId: string) => Promise<void>;
}

const DepositPaymentForm: React.FC<DepositPaymentFormProps> = ({
  appointmentDate,
  estimatedTotal,
  isLoading = false,
  onBack,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentLoadError, setPaymentLoadError] = useState<string | null>(null);

  useEffect(() => {
    setPaymentReady(false);
    setPaymentLoadError(null);
  }, []);

  const formattedDate = appointmentDate
    ? new Date(`${appointmentDate}T12:00:00`).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'your scheduled date';

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

    if (!paymentReady || !elements.getElement('payment')) {
      setError('Payment form is still loading. Please wait a moment and try again.');
      return;
    }

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Please check your payment details and try again.');
        return;
      }

      setProcessing(true);

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}${window.location.pathname}${window.location.search}`,
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
  const canPay = Boolean(stripe && elements && paymentReady && !paymentLoadError);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-2xl border border-secondary-100 p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-secondary-400 uppercase tracking-wider">Payment details</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary-400 uppercase tracking-wider">
            <Lock size={12} className="text-[#635BFF]" />
            Secured by Stripe
          </div>
        </div>

        <div className="min-h-[220px]">
          {!paymentReady && !paymentLoadError && (
            <div className="flex items-center justify-center gap-2 py-10 text-secondary-400 text-xs">
              <Loader2 className="animate-spin w-4 h-4" />
              Loading payment form...
            </div>
          )}
          <PaymentElement
            id="booking-deposit-payment-element"
            onReady={() => setPaymentReady(true)}
            onLoadError={(event) => {
              setPaymentLoadError(event.error?.message || 'Unable to load payment form.');
              setPaymentReady(false);
            }}
          />
        </div>

        {paymentLoadError && (
          <p className="text-xs text-red-500 font-semibold text-center">{paymentLoadError}</p>
        )}
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
            <>Pay ${BOOKING_DEPOSIT_AMOUNT} Deposit</>
          )}
        </button>
      </div>

      <p className="text-[10px] text-secondary-400 text-center leading-relaxed">
        Scheduled for {formattedDate}
        {estimatedTotal > 0 ? ` · Estimated total $${estimatedTotal}` : ''}
      </p>
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
  appointmentDate,
  estimatedTotal,
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
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
          <CreditCard className="w-6 h-6 text-[#635BFF]" />
        </div>
        <h2 className="text-lg font-black text-secondary uppercase tracking-wider font-display">Secure Deposit</h2>
        <p className="text-secondary-400 text-xs">Pay a small deposit to confirm your reservation.</p>
      </div>

      {isStripeTestMode && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 text-center">
          <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">Stripe test mode</p>
          <p className="text-[11px] text-indigo-700 mt-1">
            Use card <span className="font-mono font-bold">4242 4242 4242 4242</span>, any future expiry, any CVC.
          </p>
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 border border-secondary-100 shadow-sm">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Booking deposit</p>
            <p className="text-xs text-secondary-500 mt-1">Due today to hold your appointment</p>
          </div>
          <p className="text-3xl font-black text-brand">${BOOKING_DEPOSIT_AMOUNT}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <span className="font-black">Important:</span> You may be charged an additional deposit up to 24 hours before your scheduled appointment. Any remaining balance is due on the day of service.
        </p>
      </div>

      {initializing && (
        <div className="flex items-center justify-center gap-2 py-8 text-secondary-400 text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          Preparing secure checkout...
        </div>
      )}

      {initError && !initializing && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center space-y-2">
          <p className="text-xs text-red-700 font-semibold">{initError}</p>
          <p className="text-[10px] text-red-600">
            Add Stripe test keys to <span className="font-mono">.env.local</span> and restart <span className="font-mono">npm run dev</span>.
          </p>
        </div>
      )}

      {!initializing && !initError && clientSecret && !stripeInstance && (
        <div className="flex items-center justify-center gap-2 py-8 text-secondary-400 text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading Stripe...
        </div>
      )}

      {checkoutReady && (
        <Elements key={clientSecret} stripe={stripeInstance} options={elementsOptions}>
          <DepositPaymentForm
            appointmentDate={appointmentDate}
            estimatedTotal={estimatedTotal}
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
