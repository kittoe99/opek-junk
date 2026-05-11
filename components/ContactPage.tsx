import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Check, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHero } from './shared/PageHero';

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
      const { error: insertError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `${formData.subject}: ${formData.message}`
        }]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => { navigate('/'); }, 3000);
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-brand" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-secondary mb-2">Message Received</h2>
          <p className="text-secondary-500 text-sm mb-6">
            We'll respond within 30 minutes during business hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center gap-2 shadow-md rounded-lg"
          >
            Return Home <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Contact"
        title={<>Get in <span className="text-brand">touch.</span></>}
        subtitle="Question, quote, or partnership — drop us a line and we'll respond within 30 minutes during business hours."
        image="/junk-removal.webp"
        imageAlt="Opek crew ready to help"
        imageCaption="Real humans • Fast replies • Nationwide"
        primaryCta={{ label: 'Call Now', href: 'tel:8313187139' }}
        secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        compact
      />

      <div className="flex items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Name *</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Smith"
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Message *</label>
            <textarea
              name="message" value={formData.message} onChange={handleInputChange} required rows={5}
              placeholder="Tell us about your junk removal needs..."
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs font-bold">{error}</p>
          )}

          <button
            type="submit" disabled={submitting}
            className="group w-full py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
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
