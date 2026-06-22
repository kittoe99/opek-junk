import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Loader2, Lock, AlertCircle } from 'lucide-react';

const DEPOSIT_AMOUNT = 1;

interface BookingDepositPaymentProps {
  appointmentDate: string;
  estimatedTotal: number;
  isLoading?: boolean;
  onBack: () => void;
  onPay: () => Promise<void>;
}

export const BookingDepositPayment: React.FC<BookingDepositPaymentProps> = ({
  appointmentDate,
  estimatedTotal,
  isLoading = false,
  onBack,
  onPay,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      await onPay();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(message);
    }
  };

  const inputCls =
    'w-full px-4 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300';

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
          <CreditCard className="w-6 h-6 text-[#635BFF]" />
        </div>
        <h2 className="text-lg font-black text-secondary uppercase tracking-wider font-display">Secure Deposit</h2>
        <p className="text-secondary-400 text-xs">Pay a small deposit to confirm your reservation.</p>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-secondary-100 shadow-sm">
        <div className="flex justify-between items-start gap-4 pb-4 border-b border-secondary-100">
          <div>
            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Booking deposit</p>
            <p className="text-xs text-secondary-500 mt-1">Due today to hold your appointment</p>
          </div>
          <p className="text-3xl font-black text-brand">${DEPOSIT_AMOUNT}</p>
        </div>
        <div className="pt-4 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-secondary-600">Scheduled service</span>
            <span className="text-secondary-900 font-semibold text-xs text-right max-w-[55%]">{formattedDate}</span>
          </div>
          {estimatedTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-secondary-600">Estimated service total</span>
              <span className="text-secondary-900 font-bold">${estimatedTotal}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <span className="font-black">Important:</span> You may be charged an additional deposit up to 24 hours before your scheduled appointment. Any remaining balance is due on the day of service.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-secondary-100 p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-wider">Payment details</p>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-secondary-400 uppercase tracking-wider">
              <Lock size={12} className="text-[#635BFF]" />
              Secured by Stripe
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">
              Name on card
            </label>
            <input
              type="text"
              required
              autoComplete="cc-name"
              placeholder="Jane Doe"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">
              Card number
            </label>
            <input
              type="text"
              required
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">
                Expiry
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM / YY"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">
                CVC
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                className={inputCls}
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
            and authorize Opek Junk Removal to charge my payment method for the ${DEPOSIT_AMOUNT} deposit and any additional deposits or balances as described.
          </span>
        </label>

        {error && (
          <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
        )}

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            type="submit"
            disabled={isLoading || !termsAccepted}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Processing...
              </>
            ) : (
              <>Pay ${DEPOSIT_AMOUNT} Deposit</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export const BOOKING_DEPOSIT_AMOUNT = DEPOSIT_AMOUNT;
