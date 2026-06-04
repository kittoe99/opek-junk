import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Check, Phone, Mail } from 'lucide-react';
import { supabase, sendConfirmationEmail } from '../lib/supabase';
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
      const messageText = `${formData.subject}: ${formData.message}`;
      const { error: insertError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: messageText
        }]);

      if (insertError) throw insertError;

      // Trigger confirmation email
      sendConfirmationEmail('contact', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: messageText
      }).catch(err => console.warn('Failed to send contact confirmation email:', err));

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
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl shadow-secondary/5 border border-secondary-100 p-8 md:p-10 text-center">
            {/* Animated success icon */}
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
                <Mail size={32} className="text-brand" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-[11px] font-bold text-brand uppercase tracking-widest">Message Sent</p>
              <h2 className="text-2xl md:text-3xl font-black text-secondary">Message Received</h2>
              <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
                Thanks for reaching out. An agent will respond within 30 minutes during business hours.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-brand transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Return Home <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              placeholder="Describe the service needs..."
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
