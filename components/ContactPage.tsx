import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, Mail, Clock, MessageSquare, Shield, Zap } from 'lucide-react';
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
      <div className="min-h-screen bg-white pt-[88px] md:pt-[108px] px-4">
        <Breadcrumb items={[{ label: 'Contact Us' }]} />
        <div className="py-16 md:py-20 lg:py-32 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black mb-3">Message Received!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Thank you for contacting Opek. We'll respond within 30 minutes during business hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-black text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return Home
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[108px]">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      {/* Hero Section - matches service page style */}
      <section className="relative py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 block">
                Talk to our team
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight mb-4 md:mb-6 leading-tight">
                Let's get your<br/>space cleared.
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                Questions about pricing, scheduling, or what we can haul? Drop us a line — we respond within 30 minutes during business hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a 
                  href="tel:(303)555-0199"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md inline-flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  (303) 555-0199
                </a>
                <a 
                  href="mailto:Support@opekjunkremoval.com"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  Email Us
                </a>
              </div>

              {/* Quick info */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-black" /> Same-day callbacks</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-black" /> No obligation quotes</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-black" /> 7 days a week</span>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative aspect-[3/2] sm:aspect-[4/3] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
              <img 
                src="/opek2.webp" 
                loading="lazy"
                alt="Opek junk removal crew loading a truck" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18}/>
                  <span className="text-sm font-bold">Licensed & Insured • Eco-Friendly Disposal</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Form + Sidebar Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-black mb-1">Send Us a Message</h2>
              <p className="text-gray-600 text-sm">Fill out the form and we'll get back to you shortly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                  placeholder="(303) 555-0199"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                >
                  <option value="">Select a subject</option>
                  {subjectOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                placeholder="Tell us about your junk removal needs..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs font-bold">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                We'll respond within 30 minutes during business hours
              </p>
            </div>

          </form>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-6">

                {/* Direct Contact */}
                <div className="bg-black rounded-2xl p-6 md:p-8 text-white">
                  <h3 className="font-black text-lg mb-1">Prefer to talk?</h3>
                  <p className="text-gray-400 text-sm mb-6">Skip the form — reach us directly.</p>
                  <div className="space-y-4">
                    <a href="tel:(303)555-0199" className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
                        <Phone size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone</div>
                        <div className="font-bold text-sm">(303) 555-0199</div>
                      </div>
                    </a>
                    <a href="mailto:Support@opekjunkremoval.com" className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors shrink-0">
                        <Mail size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email</div>
                        <div className="font-bold text-sm">Support@opekjunkremoval.com</div>
                      </div>
                    </a>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hours</div>
                        <div className="font-bold text-sm">7AM – 7PM, 7 Days</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What to expect */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                  <h3 className="font-black text-sm mb-4">What happens next?</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-xs font-black">1</div>
                      <div>
                        <div className="text-sm font-bold">We receive your message</div>
                        <div className="text-xs text-gray-500">Your inquiry goes straight to our local team.</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-xs font-black">2</div>
                      <div>
                        <div className="text-sm font-bold">We respond fast</div>
                        <div className="text-xs text-gray-500">Expect a call or email within 30 minutes.</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0 text-xs font-black">3</div>
                      <div>
                        <div className="text-sm font-bold">Get a free quote</div>
                        <div className="text-xs text-gray-500">No obligation. Transparent pricing upfront.</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
