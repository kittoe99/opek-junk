import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

import {
  UTILITY_FORM_CARD,
  UTILITY_INPUT,
  UTILITY_LABEL,
  UTILITY_PAGE_CONTENT,
  UTILITY_PAGE_SHELL,
  UTILITY_PRIMARY_BUTTON,
} from '../lib/flowPageLayout';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import { TrustBadges } from './TrustBadges';
import { UtilityPageHeader } from './shared/UtilityPageHeader';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const messageText = `${formData.subject}: ${formData.message}`;
      const { error: insertError } = await supabase
        .from('contacts')
        .insert([{
          customer_info: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          contact_info: {
            message: messageText
          }
        }]);

      if (insertError) throw insertError;

      // Confirmation + admin emails are sent automatically by the
      // send_notification_on_insert trigger on public.contacts.
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
    <div className={UTILITY_PAGE_SHELL}>
      <UtilityPageHeader
        eyebrow="Contact"
        title={<>Get in <span className="text-brand">touch.</span></>}
        description="Question, quote, or partnership — drop a line and we'll reply within 30 minutes."
      />

      <div className={UTILITY_PAGE_CONTENT}>
        <div className={`${UTILITY_FORM_CARD} max-w-lg mx-auto animate-fade-in`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={UTILITY_LABEL}>Name *</label>
              <div className="relative group">
                <input
                  type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required placeholder="John Smith"
                  className={UTILITY_INPUT}
                />
              </div>
            </div>
            <div>
              <label className={UTILITY_LABEL}>Phone *</label>
              <div className="relative group">
                <input
                  type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                  className={UTILITY_INPUT}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={UTILITY_LABEL}>Email *</label>
            <div className="relative group">
              <input
                type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
                className={UTILITY_INPUT}
              />
            </div>
          </div>

          <div>
            <label className={UTILITY_LABEL}>Message *</label>
            <div className="relative group">
              <textarea
                name="message" value={formData.message} onChange={handleInputChange} required rows={5}
                placeholder="Describe the service needs..."
                className={`${UTILITY_INPUT} resize-none`}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-xs font-bold">{error}</p>
          )}

          <button
            type="submit" disabled={submitting}
            className={UTILITY_PRIMARY_BUTTON}
          >
            {submitting ? 'Sending...' : <><Send size={14} /> Send Message</>}
          </button>

          <div className="flex items-center justify-between pt-2">
            <a href="tel:8313187139" className="text-sm font-semibold text-secondary hover:text-brand transition-colors flex items-center gap-1.5">
              <Phone size={14} /> (831) 318-7139
            </a>
            <button type="button" onClick={() => navigate('/quote')} className="text-sm font-semibold text-brand hover:text-brand-600 transition-colors flex items-center gap-1">
              Get a quote <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
      </div>

      <TrustBadges />
    </div>
  );
};
