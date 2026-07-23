import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { SMS_MARKETING_CONSENT_TEXT, SMS_TRANSACTIONAL_NOTICE } from '../../lib/customerConsent';
import { FLOW_INPUT, FLOW_LABEL } from '../../lib/flowPageLayout';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { FlowStickyNav } from './flow/FlowStickyNav';

interface ContactIntakeFormProps {
  serviceType: string;
  onReveal: (name: string, phone: string, smsMarketingConsentAt: string | null) => Promise<void>;
  isLoading?: boolean;
  onBack?: () => void;
}

export const ContactIntakeForm: React.FC<ContactIntakeFormProps> = ({
  serviceType,
  onReveal,
  isLoading = false,
  onBack,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsMarketingConsent, setSmsMarketingConsent] = useState(false);
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
      const formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
      const consentAt = smsMarketingConsent ? new Date().toISOString() : null;
      await onReveal(trimmedName, formattedPhone, consentAt);
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
    <>
      <form id="contact-intake-form" onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="serviceType" value={serviceType} />

        <FlowStepTitle
          title="Reveal your price"
          subtitle="Enter your details to see your custom estimate."
        />

        <div className="space-y-4">
          <div>
            <label className={FLOW_LABEL}>Full name *</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              disabled={isLoading}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="John Smith"
              className={FLOW_INPUT}
            />
          </div>

          <div>
            <label className={FLOW_LABEL}>Phone number *</label>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              required
              disabled={isLoading}
              value={formatDisplayPhone(phone)}
              onChange={handlePhoneChange}
              placeholder="(555) 000-0000"
              className={FLOW_INPUT}
            />
            <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">{SMS_TRANSACTIONAL_NOTICE}</p>
          </div>
        </div>

        <label className="flex items-start gap-3 p-4 bg-[var(--surface)] border border-white/15 rounded-xl cursor-pointer hover:border-white/25 transition-colors">
          <div className="relative shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={smsMarketingConsent}
              onChange={(e) => setSmsMarketingConsent(e.target.checked)}
              disabled={isLoading}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                smsMarketingConsent ? 'bg-brand border-white/20' : 'bg-[var(--surface)] border-white/20'
              }`}
            >
              {smsMarketingConsent && <Check size={12} className="text-white" strokeWidth={3.5} />}
            </div>
          </div>
          <span className="text-xs text-[var(--text-muted)] leading-relaxed">{SMS_MARKETING_CONSENT_TEXT}</span>
        </label>

        {error && <p className="text-brand text-sm">{error}</p>}
      </form>

      <FlowStickyNav
        showBack={Boolean(onBack)}
        onBack={onBack}
        continueType="submit"
        continueForm="contact-intake-form"
        continueLabel="Reveal estimate"
        continueDisabled={isLoading || !name.trim() || phone.length < 10}
        continueLoading={isLoading}
      />
    </>
  );
};
