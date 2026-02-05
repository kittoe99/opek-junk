import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, Mail, Clock, ArrowLeft } from 'lucide-react';
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
            Thank you for contacting OPEK. We'll respond within 30 minutes during business hours.
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
    <div className="min-h-screen bg-gray-50 pt-[88px] md:pt-[108px]">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />
      <div className="py-16 md:py-20 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
            Get In Touch
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Connect with local junk removal professionals. We're here to help clear your space.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
            <img 
              src="/opek2.png" 
              alt="Professional junk removal service" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white text-center md:text-left">
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span className="text-sm font-bold">(303) 555-0199</span>
                </div>
                <span className="hidden md:block text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span className="text-sm font-bold">hello@opekjunk.com</span>
                </div>
                <span className="hidden md:block text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="text-sm font-bold">24/7 Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
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
      </div>
    </div>
  );
};
