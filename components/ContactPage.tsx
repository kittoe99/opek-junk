import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Check, Phone, Mail } from 'lucide-react';
import { supabase, sendConfirmationEmail } from '../lib/supabase';
import { InputUserIcon, InputPhoneIcon, InputMailIcon, InputMessageIcon } from './icons/ServiceIcons';
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
  const [countdown, setCountdown] = useState(5);

  React.useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, navigate]);

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

      // Trigger confirmation email
      sendConfirmationEmail('contact', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: messageText
      }).catch(err => console.warn('Failed to send contact confirmation email:', err));

      setSubmitted(true);
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
              <h2 className="text-2xl md:text-3xl font-black text-secondary">Submission Successful</h2>
              <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
                Your submission was successful.
              </p>
            </div>

            {/* Redirect Notice countdown bar */}
            <div className="pt-4 border-t border-secondary-100 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-secondary-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                Redirecting to home page in <span className="text-brand font-black">{countdown}</span> seconds...
              </div>
              <div className="w-full h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>
            </div>
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
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-300 group-focus-within:text-brand transition-colors">
                  <InputUserIcon size={18} />
                </div>
                <input
                  type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-100 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-300 group-focus-within:text-brand transition-colors">
                  <InputPhoneIcon size={18} />
                </div>
                <input
                  type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-100 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary-300 group-focus-within:text-brand transition-colors">
                <InputMailIcon size={18} />
              </div>
              <input
                type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-100 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Message *</label>
            <div className="relative group">
              <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-secondary-300 group-focus-within:text-brand transition-colors">
                <InputMessageIcon size={18} />
              </div>
              <textarea
                name="message" value={formData.message} onChange={handleInputChange} required rows={5}
                placeholder="Describe the service needs..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-100 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors resize-none"
              />
            </div>
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
