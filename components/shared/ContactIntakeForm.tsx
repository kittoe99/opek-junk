import React, { useState } from 'react';
import { Check, Phone, MessageSquare } from 'lucide-react';
import { SMS_MARKETING_CONSENT_TEXT, SMS_TRANSACTIONAL_NOTICE } from '../../lib/customerConsent';
import { FLOW_INPUT, FLOW_LABEL } from '../../lib/flowPageLayout';
import { InputUserIcon, InputPhoneIcon } from '../icons/ServiceIcons';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { FlowStickyNav } from './flow/FlowStickyNav';

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

interface ContactIntakeFormProps {
  serviceType: string;
  onReveal: (name: string, phone: string, smsMarketingConsentAt: string | null) => Promise<void>;
  isLoading?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  continueLabel?: string;
  phoneHint?: string;
}

function ConsentCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors ${
        checked
          ? 'bg-brand/10 border border-brand/35'
          : 'bg-[var(--bg)] border border-white/10 hover:border-white/20'
      }`}
    >
      <div className="relative shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            checked ? 'bg-brand border-white/20' : 'bg-[var(--surface)] border-white/20'
          }`}
        >
          {checked && <Check size={12} className="text-white" strokeWidth={3.5} />}
        </div>
      </div>
      <span className="text-xs text-[var(--text-muted)] leading-relaxed">{SMS_MARKETING_CONSENT_TEXT}</span>
    </label>
  );
}

export const ContactIntakeForm: React.FC<ContactIntakeFormProps> = ({
  serviceType,
  onReveal,
  isLoading = false,
  onBack,
  title = 'Where should we send your quote?',
  subtitle = "Enter your details and we'll text your estimate to this number.",
  continueLabel = 'Send my quote',
  phoneHint,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [showCallAlternative, setShowCallAlternative] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revealQuote = async () => {
    const trimmedName = name.trim();
    const digitsOnly = phone.replace(/\D/g, '');
    const formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    const consentAt = new Date().toISOString();
    await onReveal(trimmedName, formattedPhone, consentAt);
  };

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

    if (!smsConsent) {
      setShowCallAlternative(true);
      return;
    }

    try {
      await revealQuote();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit. Please try again.');
    }
  };

  const handleConsentAndSend = async () => {
    if (!smsConsent) {
      setError('Please check the consent box to receive your quote by text.');
      return;
    }
    setError(null);
    try {
      await revealQuote();
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

  if (showCallAlternative) {
    return (
      <>
        <FlowStepTitle
          title="How do you want your quote?"
          subtitle="Choose text delivery, or talk with us by phone."
        />

        <div className="space-y-3">
          {/* Text path */}
          <div
            className={`rounded-2xl border p-4 transition-all ${
              smsConsent
                ? 'border-brand bg-brand/[0.07] shadow-[0_0_32px_-12px_rgba(255,0,110,0.4)]'
                : 'border-white/15 bg-[var(--surface)]'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 border ${
                  smsConsent
                    ? 'bg-brand border-brand/40 text-white shadow-[0_0_24px_-6px_rgba(255,0,110,0.55)]'
                    : 'bg-white/[0.04] border-white/10 text-brand'
                }`}
              >
                <MessageSquare size={20} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-[var(--text)]">Get it by text</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                  Agree to SMS and we&apos;ll send your estimate to your phone.
                </p>
              </div>
            </div>

            <ConsentCheckbox
              checked={smsConsent}
              onChange={(checked) => {
                setSmsConsent(checked);
                setError(null);
              }}
              disabled={isLoading}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-white/10" aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              or
            </span>
            <span className="h-px flex-1 bg-white/10" aria-hidden />
          </div>

          {/* Call path */}
          <a
            href={`tel:${SITE_PHONE}`}
            className="group flex items-start gap-3 rounded-2xl border border-white/15 bg-[var(--surface)] p-4 hover:border-white/25 hover:bg-white/[0.03] transition-colors"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-[var(--text)] group-hover:border-brand/40 group-hover:text-brand shrink-0 transition-colors">
              <Phone size={20} />
            </span>
            <span className="min-w-0 pt-0.5 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="block text-sm font-semibold text-[var(--text)]">Call for a quote</span>
                <span className="text-xs font-medium text-brand shrink-0">{SITE_PHONE_DISPLAY}</span>
              </span>
              <span className="block text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                Prefer not to text? We&apos;ll quote you over the phone.
              </span>
            </span>
          </a>

          {error && <p className="text-brand text-sm pt-1">{error}</p>}
        </div>

        <FlowStickyNav
          showBack
          onBack={() => {
            setShowCallAlternative(false);
            setError(null);
          }}
          backLabel="Back"
          onContinue={handleConsentAndSend}
          continueLabel="Send my quote"
          continueDisabled={isLoading || !smsConsent}
          continueLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <form id="contact-intake-form" onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="serviceType" value={serviceType} />

        <FlowStepTitle title={title} subtitle={subtitle} />

        <div className="flex justify-center mb-1" aria-hidden>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-[11px] font-semibold text-brand tracking-wide">
              Quote arrives by text
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={FLOW_LABEL}>Full name *</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <InputUserIcon size={18} />
              </span>
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
                className={`${FLOW_INPUT} pl-11`}
              />
            </div>
          </div>

          <div>
            <label className={FLOW_LABEL}>Mobile number *</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <InputPhoneIcon size={18} />
              </span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                required
                disabled={isLoading}
                value={formatDisplayPhone(phone)}
                onChange={handlePhoneChange}
                placeholder="(555) 000-0000"
                className={`${FLOW_INPUT} pl-11`}
              />
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
              {phoneHint || SMS_TRANSACTIONAL_NOTICE}
            </p>
          </div>
        </div>

        <ConsentCheckbox
          checked={smsConsent}
          onChange={setSmsConsent}
          disabled={isLoading}
        />

        {error && <p className="text-brand text-sm">{error}</p>}
      </form>

      <FlowStickyNav
        showBack={Boolean(onBack)}
        onBack={onBack}
        continueType="submit"
        continueForm="contact-intake-form"
        continueLabel={continueLabel}
        continueDisabled={isLoading || !name.trim() || phone.length < 10}
        continueLoading={isLoading}
      />
    </>
  );
};
