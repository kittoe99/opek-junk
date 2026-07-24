import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { SMS_MARKETING_CONSENT_TEXT, SMS_TRANSACTIONAL_NOTICE } from '../lib/customerConsent';
import { FLOW_INPUT, FLOW_LABEL } from '../lib/flowPageLayout';
import { InputUserIcon, InputPhoneIcon } from './icons/ServiceIcons';

/**
 * Public proof-of-consent page for Twilio A2P campaign registration.
 * Shows the same SMS opt-in presented on /quote and /booking forms.
 */
export const SmsConsentPage: React.FC = () => {
  const [checked, setChecked] = useState(true);

  return (
    <div className="home-dark min-h-[calc(100vh-var(--site-header-height))] bg-[var(--bg)] text-[var(--text)]">
      <section className="relative border-b border-[var(--border)] overflow-hidden">
        <div
          className="absolute -top-24 right-[-8%] h-[280px] w-[280px] rounded-full bg-brand/[0.08] blur-[110px] pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">SMS compliance</p>
          <h1 className="font-sans font-extrabold text-[1.85rem] sm:text-[2.5rem] text-[var(--text)] tracking-tight leading-[1.1] mb-4">
            SMS opt-in consent
          </h1>
          <p className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
            This page documents how customers consent to receive texts from Opek Junk Removal. The
            checkbox and disclosure below match the opt-in shown on our quote and booking forms at{' '}
            <a href="https://opekjunkremoval.com/quote" className="text-brand font-semibold hover:underline">
              /quote
            </a>{' '}
            and{' '}
            <a href="https://opekjunkremoval.com/booking" className="text-brand font-semibold hover:underline">
              /booking
            </a>
            .
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)]">How opt-in works</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
            <li>
              Customers enter their name and phone number when requesting a quote or booking.
            </li>
            <li>
              A transactional notice explains we will use their phone number to contact them about
              that quote or booking.
            </li>
            <li>
              An optional checkbox lets customers agree to receive texts from Opek Junk Removal.
              Consent is not required to get a quote or complete a booking.
            </li>
            <li>
              Message frequency varies. Msg &amp; data rates may apply. Reply <strong>STOP</strong>{' '}
              to unsubscribe, <strong>HELP</strong> for help.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text)] mb-4">
            Live opt-in (as shown on quote &amp; booking forms)
          </h2>
          <div
            id="sms-consent-demo"
            className="max-w-lg rounded-2xl border border-white/15 bg-[var(--surface)] p-5 sm:p-6 space-y-5"
          >
            <div>
              <label className={FLOW_LABEL}>Full name *</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <InputUserIcon size={18} />
                </span>
                <input
                  type="text"
                  readOnly
                  value="Jane Customer"
                  className={`${FLOW_INPUT} pl-11`}
                  aria-label="Example full name"
                />
              </div>
            </div>

            <div>
              <label className={FLOW_LABEL}>Phone *</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <InputPhoneIcon size={18} />
                </span>
                <input
                  type="tel"
                  readOnly
                  value="(555) 123-4567"
                  className={`${FLOW_INPUT} pl-11`}
                  aria-label="Example phone number"
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
                {SMS_TRANSACTIONAL_NOTICE}
              </p>
            </div>

            <label className="flex items-start gap-3 p-4 bg-[var(--bg)] border border-white/15 rounded-xl cursor-pointer hover:border-white/25 transition-colors">
              <div className="relative shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
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
              <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                {SMS_MARKETING_CONSENT_TEXT}
              </span>
            </label>
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Demo fields above are for review only and do not submit data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Consent language (exact text)</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed border border-white/10 rounded-xl p-4 bg-[var(--surface)]">
            {SMS_MARKETING_CONSENT_TEXT}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Screenshot proof</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Static screenshot of the opt-in checkbox as shown on quote and booking forms (for Twilio
            campaign registration upload):
          </p>
          <a
            href="/sms-consent-opt-in.png"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-white/15 overflow-hidden max-w-lg"
          >
            <img
              src="/sms-consent-opt-in.png"
              alt="Opek Junk Removal SMS opt-in checkbox on quote and booking forms"
              className="w-full h-auto"
            />
          </a>
          <p className="text-xs text-[var(--text-muted)]">
            Direct image URL:{' '}
            <a
              href="https://opekjunkremoval.com/sms-consent-opt-in.png"
              className="text-brand font-semibold hover:underline break-all"
            >
              https://opekjunkremoval.com/sms-consent-opt-in.png
            </a>
          </p>
        </section>

        <section className="space-y-2 text-sm text-[var(--text-muted)]">
          <p>
            Related policies:{' '}
            <Link to="/privacy" className="text-brand font-semibold hover:underline">
              Privacy Policy
            </Link>
            {' · '}
            <Link to="/terms" className="text-brand font-semibold hover:underline">
              Terms of Service
            </Link>
          </p>
          <p>
            Contact:{' '}
            <a
              href="mailto:Support@opekjunkremoval.com"
              className="text-brand font-semibold hover:underline"
            >
              Support@opekjunkremoval.com
            </a>{' '}
            · (831) 318-7139
          </p>
        </section>
      </div>
    </div>
  );
};
