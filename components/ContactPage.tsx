import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Breadcrumb } from './Breadcrumb';

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
    'Construction Debris',
    'E-Waste Recycling',
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
      <div className="min-h-screen bg-white pt-[80px] md:pt-[104px] px-4">
        <Breadcrumb items={[{ label: 'Contact' }]} />
        <div className="py-24 md:py-32 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-900">
              <CheckCircle2 size={20} strokeWidth={1.25} />
            </div>
            <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-4">Message received</h2>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">
              Thanks for reaching out. We&apos;ll respond within 30 minutes during business hours.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
            >
              Return home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400";
  const labelClass = "block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2";

  return (
    <div className="min-h-screen bg-white pt-[80px] md:pt-[104px]">
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-12 pb-24 md:pb-32">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-24">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
              <span className="inline-block h-px w-8 bg-gray-300" />
              <span>Contact</span>
            </div>
          </div>
          <div className="md:col-span-8">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight leading-[1.05]">
              Get in touch.
            </h1>
            <p className="text-gray-500 mt-6 max-w-lg leading-relaxed">
              We&apos;re here to help clear your space. Drop us a message and we&apos;ll be in touch shortly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Contact details */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="border-t border-gray-200 pt-8 space-y-8">
              <div>
                <div className={labelClass}>Phone</div>
                <a href="tel:8313187139" className="flex items-center gap-2 text-base text-gray-900 hover:text-gray-600">
                  <Phone size={14} strokeWidth={1.5} />
                  (831) 318-7139
                </a>
              </div>
              <div>
                <div className={labelClass}>Email</div>
                <a href="mailto:Support@opekjunkremoval.com" className="flex items-center gap-2 text-base text-gray-900 hover:text-gray-600 break-all">
                  <Mail size={14} strokeWidth={1.5} />
                  Support@opekjunkremoval.com
                </a>
              </div>
              <div>
                <div className={labelClass}>Hours</div>
                <div className="flex items-center gap-2 text-base text-gray-900">
                  <Clock size={14} strokeWidth={1.5} />
                  24/7 service
                </div>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-8 border-t border-gray-200 pt-8">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                    placeholder="(555) 555-5555"
                  />
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={inputClass + " appearance-none cursor-pointer"}
                  >
                    <option value="">Select a subject</option>
                    {subjectOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={inputClass + " resize-none"}
                  placeholder="Tell us about your junk removal needs..."
                />
              </div>

              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              <div className="pt-4 flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
                <p className="text-xs text-gray-400">
                  We respond within 30 minutes during business hours.
                </p>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
