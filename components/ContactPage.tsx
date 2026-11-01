import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Loader2, MessageCircle, MessageSquare, Phone, Send } from 'lucide-react';
import { CONTACT_SMS_CONSENT, CONTACT_SUBJECTS, createContactSubmitter } from '../lib/crmContact';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import { ServicePageHero } from './shared/ServicePageHero';
import { UTILITY_INPUT, UTILITY_LABEL, UTILITY_PRIMARY_BUTTON } from '../lib/flowPageLayout';

const SUBJECTS = CONTACT_SUBJECTS;

const SITE_PHONE = '18777574365';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECTS[0],
    message: '',
    smsOptIn: false,
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitContact = useRef(createContactSubmitter());

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      await submitContact.current(formData);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We couldn’t send your message. Please try again, or call us.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SubmissionSuccessView
        title="Message sent"
        description="Thanks — we’ve received your message. Our team will get back to you during business hours."
        summary={[
          { label: 'Topic', value: formData.subject },
          { label: 'Name', value: formData.name },
          { label: 'Phone', value: formData.phone },
          { label: 'Email', value: formData.email },
        ]}
      />
    );
  }

  return (
    <div className="site-page home-light interior-home soft-page">
      <ServicePageHero
        rating={false}
        title={<>Real people.<br />Quick answers.</>}
        subtitle="Questions about a quote, a booking or an order? Call, text or send a message. We usually reply within 30 minutes."
        image="/optimized/hero-backgrounds/opek-crew-high-five-unbranded.webp"
        imageAlt="Two Opek providers high-fiving beside their truck"
        primaryCta={{ label: 'Send a message', href: '#contact-form' }}
        secondaryCta={{ label: 'Call (877) 757-4365', href: `tel:+${SITE_PHONE}` }}
      />

      <div id="contact-form" className="soft-wrap contact-wrap scroll-mt-[var(--site-header-height)]">
        <div className="contact-options">
          <a href={`tel:+${SITE_PHONE}`} className="soft-surface contact-option" aria-label="Call (877) 757-4365">
            <Phone size={20} aria-hidden />
            <span>Call</span>
          </a>
          <a href={`sms:+${SITE_PHONE}`} className="soft-surface contact-option" aria-label="Text (877) 757-4365">
            <MessageSquare size={20} aria-hidden />
            <span>Text</span>
          </a>
          <button type="button" onClick={() => navigate('/chat?mode=text')} className="soft-surface contact-option">
            <MessageCircle size={20} aria-hidden />
            <span>Live chat</span>
          </button>
        </div>

        <div className="soft-card contact-card">
          <h2 className="contact-card-title">Send a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={submitting} className="space-y-4 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className={UTILITY_LABEL}>Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={200}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Smith"
                  className={UTILITY_INPUT}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className={UTILITY_LABEL}>Phone</label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(555) 123-4567"
                  className={UTILITY_INPUT}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-email" className={UTILITY_LABEL}>Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={320}
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@email.com"
                className={UTILITY_INPUT}
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className={UTILITY_LABEL}>Topic</label>
              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={UTILITY_INPUT}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className={UTILITY_LABEL}>Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                maxLength={2000}
                placeholder="How can we help?"
                className={UTILITY_INPUT}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
              <input
                type="checkbox"
                name="smsOptIn"
                checked={formData.smsOptIn}
                onChange={(e) => setFormData((prev) => ({ ...prev, smsOptIn: e.target.checked }))}
                className="mt-1 h-4 w-4 shrink-0 accent-[#520f96]"
              />
              <span>{CONTACT_SMS_CONSENT}</span>
            </label>
            <p className="text-xs text-[var(--text-muted)]">
              Opt in to receive an immediate text acknowledgment. You can also submit without SMS.
              {' '}<Link to="/privacy" className="underline">Privacy policy</Link>
            </p>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field blank</label>
              <input id="contact-website" name="website" value={formData.website} onChange={handleInputChange} tabIndex={-1} autoComplete="off" />
            </div>

            {error && (
              <p className="soft-error" role="alert">
                <AlertCircle size={16} aria-hidden />
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className={UTILITY_PRIMARY_BUTTON}>
              {submitting ? (
                <Loader2 size={18} className="animate-spin" aria-label="Sending" />
              ) : (
                <>
                  Send message
                  <Send size={16} aria-hidden />
                </>
              )}
            </button>
            </fieldset>
          </form>
        </div>

        <p className="soft-help">
          Need a price? <Link to="/quote">Get a free quote <ArrowRight size={14} className="inline -mt-0.5" aria-hidden /></Link>
        </p>
      </div>
    </div>
  );
};
