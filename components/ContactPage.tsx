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

      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">Contact Us</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 leading-tight">
                We're here to help clear your space.
              </h1>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                Have a question about our services? Need a custom quote? Our team responds within 30 minutes during business hours.
              </p>
              {/* Contact Cards */}
              <div className="space-y-3">
                <a href="tel:(303)555-0199" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Call Us</div>
                    <div className="text-white font-bold">(303) 555-0199</div>
                  </div>
                </a>
                <a href="mailto:Support@opekjunkremoval.com" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</div>
                    <div className="text-white font-bold">Support@opekjunkremoval.com</div>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hours</div>
                    <div className="text-white font-bold">7 Days a Week, 7AM - 7PM</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className="hidden lg:block relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img 
                src="/opek2.webp" 
                loading="lazy"
                alt="Professional junk removal service" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Zap size={18} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-bold text-black">Fast Response</div>
                <div className="text-xs text-gray-500">Reply within 30 minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Shield size={18} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-bold text-black">Licensed & Insured</div>
                <div className="text-xs text-gray-500">Fully covered professionals</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-bold text-black">No Obligation</div>
                <div className="text-xs text-gray-500">Free quotes, no pressure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
          <div className="max-w-2xl mx-auto">
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
        </div>
      </section>
    </div>
  );
};
