import React, { useState } from 'react';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { SMS_MARKETING_CONSENT_TEXT } from '../../lib/customerConsent';


interface ContactIntakeFormProps {
  serviceType: string;
  onReveal: (name: string, phone: string, smsMarketingConsentAt: string) => Promise<void>;
  isLoading?: boolean;
}

export const ContactIntakeForm: React.FC<ContactIntakeFormProps> = ({
  serviceType,
  onReveal,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputCls = "w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 disabled:opacity-55";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const digitsOnly = phone.replace(/\D/g, '');

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }

    if (digitsOnly.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!consentAccepted) {
      setError('Please agree to be contacted before continuing.');
      return;
    }

    try {
      // Format phone as (XXX) XXX-XXXX for database consistency
      const formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
      await onReveal(trimmedName, formattedPhone, new Date().toISOString());
    } catch (err: any) {
      setError(err?.message || 'Failed to submit. Please try again.');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 11 && val.startsWith('1')) {
      val = val.slice(1);
    }
    setPhone(val.slice(0, 10));
  };

  const formatDisplayPhone = (val: string) => {
    if (!val) return '';
    if (val.length <= 3) return val;
    if (val.length <= 6) return `(${val.slice(0, 3)}) ${val.slice(3)}`;
    return `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
  };

  return (
    <div className="w-full transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="serviceType" value={serviceType} />

        <div className="text-center space-y-2 mb-6">
          <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Estimate Ready
          </span>
          <h3 className="text-2xl font-black text-secondary tracking-tight">
            Reveal Your <span className="text-brand">Price.</span>
          </h3>
          <p className="text-secondary-400 text-xs leading-relaxed max-w-sm mx-auto font-medium">
            You're one step away! Enter your details to instantly reveal your custom pricing estimate.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
              Full Name *
            </label>
            <div className="relative group">
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                disabled={isLoading}
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="John Smith"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
              Phone Number *
            </label>
            <div className="relative group">
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                required
                disabled={isLoading}
                value={formatDisplayPhone(phone)}
                onChange={handlePhoneChange}
                placeholder="(555) 000-0000"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 p-4 bg-secondary-50/50 border border-secondary-100 rounded-2xl cursor-pointer hover:border-brand/30 transition-colors">
          <div className="relative shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => {
                setConsentAccepted(e.target.checked);
                if (e.target.checked) setError(null);
              }}
              disabled={isLoading}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                consentAccepted ? 'bg-brand border-brand' : 'bg-white border-secondary-300'
              }`}
            >
              {consentAccepted && <Check size={12} className="text-white" strokeWidth={3.5} />}
            </div>
          </div>
          <span className="text-[10px] text-secondary-500 leading-relaxed">
            {SMS_MARKETING_CONSENT_TEXT}
          </span>
        </label>

        {error && (
          <p className="text-red-500 text-xs font-bold flex items-center gap-1.5 px-1 animate-pulse-slow">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !name.trim() || phone.length < 10 || !consentAccepted}
            className="group w-full py-4 bg-secondary text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-brand active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(53,80,112,0.1)] hover:shadow-[0_6px_20px_rgba(255,0,110,0.2)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <span>Reveal Estimate</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
