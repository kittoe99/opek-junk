import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { BOOKING_DEPOSIT_AMOUNT } from '../../lib/deposit';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface BookingDepositIntroProps {
  onBack: () => void;
  onContinue: () => void;
  serviceType?: string;
  source?: string;
}

export const BookingDepositIntro: React.FC<BookingDepositIntroProps> = ({
  onBack,
  onContinue,
  serviceType,
  source,
}) => {
  const viewIdRef = useRef<string | null>(null);
  const viewPromiseRef = useRef<Promise<string | null> | null>(null);
  const outcomeRef = useRef<'viewed' | 'continued' | 'exited'>('viewed');

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    const promise = Promise.resolve(
      supabase.rpc('track_deposit_view', {
        p_service_type: serviceType ?? null,
        p_source: source ?? null,
        p_deposit_amount: BOOKING_DEPOSIT_AMOUNT,
      })
    )
      .then(({ data, error }: { data: unknown; error: unknown }) => {
        if (error) {
          console.warn('Failed to record deposit screen view:', error);
          return null;
        }
        const id = (data as string) ?? null;
        if (!cancelled) viewIdRef.current = id;
        return id;
      })
      .catch((err) => {
        console.warn('Failed to record deposit screen view:', err);
        return null;
      });
    viewPromiseRef.current = promise;

    const recordExit = () => {
      if (outcomeRef.current !== 'viewed') return;
      outcomeRef.current = 'exited';
      const id = viewIdRef.current;
      if (!id) return;
      Promise.resolve(
        supabase.rpc('track_deposit_outcome', { p_id: id, p_outcome: 'exited' })
      ).catch(() => {});
    };

    window.addEventListener('beforeunload', recordExit);

    return () => {
      cancelled = true;
      window.removeEventListener('beforeunload', recordExit);
      recordExit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    outcomeRef.current = 'continued';
    if (isSupabaseConfigured) {
      const send = (id: string | null) => {
        if (!id) return;
        Promise.resolve(
          supabase.rpc('track_deposit_outcome', { p_id: id, p_outcome: 'continued' })
        ).catch(() => {});
      };
      if (viewIdRef.current) send(viewIdRef.current);
      else if (viewPromiseRef.current) viewPromiseRef.current.then(send).catch(() => {});
    }
    onContinue();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <h2 className="text-lg font-black text-secondary uppercase tracking-wider font-display">Refundable Deposit</h2>
        <p className="text-secondary-400 text-xs">One last step before you confirm your booking.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-secondary-100 shadow-sm text-center space-y-4">
        <p className="text-4xl font-black text-brand">${BOOKING_DEPOSIT_AMOUNT}</p>
        <p className="text-sm text-secondary-600 leading-relaxed">
          A <span className="font-bold text-secondary">${BOOKING_DEPOSIT_AMOUNT} deposit</span> is required to confirm your booking. It is fully refundable and will be applied toward your remaining balance.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
