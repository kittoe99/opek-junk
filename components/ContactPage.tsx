import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Send, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: `${formData.subject}: ${formData.message}`
          }
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={22} className="text-brand" strokeWidth={3} />
          </div>
          <h2 className="text-xl font-black text-secondary mb-2">Message Received!</h2>
          <p className="text-secondary-400 text-sm mb-6">
            We'll respond within 30 minutes during business hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center gap-2"
          >
            Return Home <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={14} className="text-brand" strokeWidth={2.5} />
          <span className="text-sm font-bold text-secondary-400 uppercase tracking-wider">Contact Us</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
          Get in <span className="text-brand">touch.</span>
        </h1>
        <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
          Have a question or ready to book? Reach out — we respond within 30 minutes during business hours.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Contact Form */}
        <div className="border border-secondary-100 rounded-2xl p-6 md:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2">
              <h2 className="text-lg font-black text-secondary mb-1">Send us a message</h2>
              <p className="text-secondary-400 text-sm">Fill out the form and we'll get back to you shortly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Smith"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(831) 318-7139"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors"
                >
                  <option value="">Select a subject</option>
                  {subjectOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Tell us about your junk removal needs..."
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : <><Send size={14} /> Send Message</>}
            </button>
          </form>
        </div>

        {/* Bottom CTA */}
        <div className="border-l-2 border-brand pl-6">
          <h2 className="text-xl font-black text-secondary mb-2">Need a quote instead?</h2>
          <p className="text-secondary-400 text-sm mb-4">Get transparent pricing in under two minutes. No obligations.</p>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => navigate('/quote')}
              className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center gap-2"
            >
              Get a Free Quote <ArrowRight size={16} />
            </button>
            <a
              href="tel:8313187139"
              className="text-secondary font-bold text-sm uppercase tracking-wider underline underline-offset-4 decoration-secondary-300 hover:decoration-brand hover:text-brand transition-colors"
            >
              (831) 318-7139
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
