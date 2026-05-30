import React, { useState } from 'react';
import { User, Phone, ArrowRight, Loader2, Info } from 'lucide-react';

interface ContactIntakeFormProps {
  serviceType: string;
  onReveal: (name: string, phone: string) => Promise<void>;
  isLoading?: boolean;
}

export const ContactIntakeForm: React.FC<ContactIntakeFormProps> = ({
  serviceType,
  onReveal,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

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

    try {
      // Format phone as (XXX) XXX-XXXX for database consistency
      const formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
      await onReveal(trimmedName, formattedPhone);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit. Please try again.');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setPhone(val);
    }
  };

  const formatDisplayPhone = (val: string) => {
    if (!val) return '';
    if (val.length <= 3) return val;
    if (val.length <= 6) return `(${val.slice(0, 3)}) ${val.slice(3)}`;
    return `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
  };

  return (
    <div className="bg-white border border-secondary-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Visual Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-300">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                disabled={isLoading}
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="John Smith"
                className="w-full pl-10 pr-4 py-3 bg-secondary-50/50 border border-secondary-200/60 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-300">
                <Phone size={16} />
              </span>
              <input
                type="tel"
                required
                disabled={isLoading}
                value={formatDisplayPhone(phone)}
                onChange={handlePhoneChange}
                placeholder="(555) 000-0000"
                className="w-full pl-10 pr-4 py-3 bg-secondary-50/50 border border-secondary-200/60 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold flex items-center gap-1.5 px-1 animate-pulse-slow">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !name.trim() || phone.length < 10}
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

        <div className="flex items-start gap-2 text-secondary-400 text-[10px] leading-relaxed pt-3 border-t border-secondary-100/50">
          <Info size={12} className="text-secondary-300 shrink-0 mt-0.5" />
          <p>
            By adding your contact details, you agree that you may be contacted via sms or phone call.
          </p>
        </div>
      </form>
    </div>
  );
};
