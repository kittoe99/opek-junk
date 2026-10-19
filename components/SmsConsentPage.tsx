import { ServicePageHero } from './shared/ServicePageHero';
import { HomeCallout } from './home/HomePagePatterns';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SMS_MARKETING_CONSENT_TEXT, SMS_TRANSACTIONAL_NOTICE } from '../lib/customerConsent';
import { FLOW_INPUT, FLOW_LABEL } from '../lib/flowPageLayout';
import { InputUserIcon, InputPhoneIcon } from './icons/ServiceIcons';
import { CheckboxCard } from './shared/CheckboxCard';

/**
 * Public proof-of-consent page for Twilio A2P campaign registration.
 * Shows the same SMS opt-in presented on /quote and /booking forms.
 */
export const SmsConsentPage: React.FC = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="site-page home-light interior-home min-h-[calc(100vh-var(--site-header-height))] bg-[var(--bg)] text-[var(--text)]">
      <ServicePageHero eyebrow="SMS consent" title={<>Your phone.<br />Your choice.</>}
        subtitle="Understand how Opek uses text messages for quotes, bookings and optional marketing, and how you can manage your preferences."
        image="/optimized/service-scenes/pickup-scheduling.webp" imageAlt="A phone displaying pickup time options" chip="Stay informed"
        primaryCta={{ label: 'See how it works', href: '#consent-details' }} secondaryCta={{ label: 'Privacy policy', href: '/privacy' }} />

      <div id="consent-details" className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20 space-y-12 scroll-mt-[var(--site-header-height)]">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)]">How opt-in works</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--text-muted)] leading-relaxed">
            <li>
              Customers enter their name and phone number when requesting a quote or booking.
            </li>
            <li>
              <strong>Service texts (informational):</strong> Submitting a phone number includes
              express consent for service messages about that quote or booking — status updates,
              appointment reminders, requested payment links, and support replies.
            </li>
            <li>
              <strong>Marketing texts (separate opt-in):</strong> An optional, unchecked-by-default
              checkbox is required before we send marketing texts or special offers. Marketing
              consent is not required to get a quote or complete a booking.
            </li>
            <li>
              Message frequency varies. Msg &amp; data rates may apply. Reply <strong>STOP</strong>{' '}
              to unsubscribe from marketing, <strong>HELP</strong> for help.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text)] mb-4">
            Live opt-in (as shown on quote &amp; booking forms)
          </h2>
          <div
            id="sms-consent-demo"
            className="max-w-lg soft-surface p-5 sm:p-6 space-y-5"
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

            <CheckboxCard checked={checked} onChange={setChecked}>
              {SMS_MARKETING_CONSENT_TEXT}
            </CheckboxCard>
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Demo fields above are for review only and do not submit data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Consent language (exact text)</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-[var(--text)] mb-1.5">Service / informational</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed border border-[var(--border)] rounded-xl p-4 bg-[var(--surface)]">
                {SMS_TRANSACTIONAL_NOTICE}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text)] mb-1.5">Marketing (optional checkbox)</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed border border-[var(--border)] rounded-xl p-4 bg-[var(--surface)]">
                {SMS_MARKETING_CONSENT_TEXT}
              </p>
            </div>
          </div>
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
            className="block rounded-2xl border border-[var(--border)] overflow-hidden max-w-lg"
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
      <HomeCallout title="Need help with your messages?" body="Ask our team about service updates, SMS preferences or your booking." label="Contact us" to="/contact" />
    </div>
  );
};
