import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Send, Check, Phone, Mail, MapPin, Clock } from 'lucide-react';
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

  const subjectOptions = [
    'General Inquiry',
    'Residential Service',
    'Commercial Service',
    'Property Cleanout',
    'Partnership Opportunity'
  ];

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
            className="px-8 py-4 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center gap-2 shadow-md"
          >
            Return Home <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const channels = [
    { icon: Phone, label: 'Call', value: '(831) 318-7139', href: 'tel:8313187139', desc: 'Mon–Sat, 7am–8pm' },
    { icon: Mail, label: 'Email', value: 'hello@opek.com', href: 'mailto:hello@opek.com', desc: 'Replies within 30 min' },
    { icon: MapPin, label: 'Service Area', value: 'All 50 states', desc: 'Local crews near you' },
    { icon: Clock, label: 'Response', value: '< 30 minutes', desc: 'During business hours' },
  ];

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

      {/* Contact Channels */}
      <section className="py-12 md:py-16 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {channels.map((c) => {
              const Wrapper: any = c.href ? 'a' : 'div';
              return (
                <Wrapper
                  key={c.label}
                  {...(c.href ? { href: c.href } : {})}
                  className="group p-6 bg-white rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-secondary-100 block"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand transition-colors">
                    <c.icon size={20} className="text-brand group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1">{c.label}</p>
                  <p className="font-black text-secondary text-base mb-1">{c.value}</p>
                  <p className="text-secondary-500 text-xs">{c.desc}</p>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Send a Message</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-3">
              Tell us what you need.
            </h2>
            <p className="text-secondary-500 text-base leading-relaxed">
              Fill out the form and we'll be in touch shortly. For urgent requests, call us directly.
            </p>
          </div>

          <div className="border border-secondary-100 rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Subject *</label>
                  <select
                    name="subject" value={formData.subject} onChange={handleInputChange} required
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  >
                    <option value="">Select a subject</option>
                    {subjectOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
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
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit" disabled={submitting}
                className="group w-full py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? 'Sending...' : <><Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="block w-8 h-px bg-brand" />
                  <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Need a Quote Instead?</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-4">
                  Skip the form. <span className="text-brand">Get a price.</span>
                </h2>
                <p className="text-secondary-500 text-base leading-relaxed">
                  Transparent pricing in under two minutes. No obligations, no spam, no hidden fees.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/quote')}
                  className="px-8 py-4 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                >
                  Get a Free Quote <ArrowRight size={16} />
                </button>
                <a
                  href="tel:8313187139"
                  className="px-8 py-4 bg-brand text-white font-bold text-sm uppercase tracking-wider hover:bg-brand-600 transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                >
                  <Phone size={16} /> (831) 318-7139
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
