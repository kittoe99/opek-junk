import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Phone, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { PageHero } from './shared/PageHero';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';

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

  const inputCls = "w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300";
  const labelCls = "block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5";
  const primaryButtonCls = "group w-full py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20";

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Contact"
        title={<>Get in <span className="text-brand">touch.</span></>}
        subtitle="Question, quote, or partnership — drop a line and an agent will respond within 30 minutes during business hours."
        image="/process-step-3.svg"
        imageAlt="Opek independent service provider ready to help"
        imageCaption="Real humans • Fast replies • Nationwide"
        primaryCta={{ label: 'Call Now', href: 'tel:8313187139' }}
        secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        compact
      />

      <div className="flex items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <div className="relative group">
                <input
                  type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required placeholder="John Smith"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Phone *</label>
              <div className="relative group">
                <input
                  type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Email *</label>
            <div className="relative group">
              <input
                type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Message *</label>
            <div className="relative group">
              <textarea
                name="message" value={formData.message} onChange={handleInputChange} required rows={5}
                placeholder="Describe the service needs..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-xs font-bold">{error}</p>
          )}

          <button
            type="submit" disabled={submitting}
            className={primaryButtonCls}
          >
            {submitting ? 'Sending...' : <><Send size={14} /> Send Message</>}
          </button>

          <div className="flex items-center justify-between pt-2">
            <a href="tel:8313187139" className="text-sm font-bold text-secondary hover:text-brand transition-colors flex items-center gap-1.5">
              <Phone size={14} /> (831) 318-7139
            </a>
            <button type="button" onClick={() => navigate('/quote')} className="text-sm font-bold text-brand hover:text-brand-600 transition-colors flex items-center gap-1">
              Get a quote <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};
