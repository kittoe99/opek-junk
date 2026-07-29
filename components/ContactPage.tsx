import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ServicePageHero } from './shared/ServicePageHero';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import {
  UTILITY_FORM_CARD,
  UTILITY_INPUT,
  UTILITY_LABEL,
  UTILITY_PRIMARY_BUTTON,
} from '../lib/flowPageLayout';

const SUBJECTS = [
  'General question',
  'Quote / pricing',
  'Existing order',
  'Partnership',
  'Something else',
];

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECTS[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const messageText = `${formData.subject}: ${formData.message}`;
      const { error: insertError } = await supabase.from('contacts').insert([
        {
          customer_info: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          contact_info: {
            message: messageText,
          },
        },
      ]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SubmissionSuccessView
        title="Message sent"
        description="We received your message and will get back to you soon."
        summary={[
          { label: 'Name', value: formData.name },
          { label: 'Email', value: formData.email },
          { label: 'Phone', value: formData.phone },
          { label: 'Subject', value: formData.subject },
          { label: 'Message', value: formData.message },
        ]}
      />
    );
  }

  return (
    <div className="home-dark min-h-screen pb-24">
      <ServicePageHero
        eyebrow="Contact"
        title={
          <>
            Get in
            <br />
            touch
          </>
        }
        subtitle="Question, quote, or partnership — drop a line and we'll reply within 30 minutes during business hours."
        image="/opek-contact-hero.png?v=2"
        imageAlt="Opek junk removal provider carrying a chair and box"
        chip="Fast replies"
        primaryCta={{ label: 'Call Now', href: 'tel:8313187139' }}
        secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className={UTILITY_FORM_CARD}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-2 mb-2">
              <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">Send a message</h2>
              <p className="text-[var(--text-muted)] text-xs">We typically respond within 30 minutes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={UTILITY_LABEL}>Name *</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Smith"
                  className={UTILITY_INPUT}
                />
              </div>
              <div>
                <label className={UTILITY_LABEL}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(831) 318-7139"
                  className={UTILITY_INPUT}
                />
              </div>
            </div>

            <div>
              <label className={UTILITY_LABEL}>Email *</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@email.com"
                className={UTILITY_INPUT}
              />
            </div>

            <div>
              <label className={UTILITY_LABEL}>Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className={UTILITY_INPUT}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={UTILITY_LABEL}>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="How can we help?"
                className={`${UTILITY_INPUT} resize-none`}
              />
            </div>

            {error && <p className="text-brand text-xs font-bold">{error}</p>}

            <button type="submit" disabled={submitting} className={UTILITY_PRIMARY_BUTTON}>
              {submitting ? (
                'Sending...'
              ) : (
                <>
                  <Send size={14} /> Send Message
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <a
                href="tel:8313187139"
                className="text-sm font-semibold text-[var(--text)] hover:text-brand transition-colors flex items-center gap-1.5"
              >
                <Phone size={14} /> (831) 318-7139
              </a>
              <button
                type="button"
                onClick={() => navigate('/quote')}
                className="text-sm font-semibold text-brand hover:text-brand-600 transition-colors flex items-center gap-1"
              >
                Get a quote <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
