import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight, Send, Check, Calendar, Clock, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const InHomeEstimatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeOptions = [
    'Morning (8am - 12pm)',
    'Afternoon (12pm - 4pm)',
    'Evening (4pm - 7pm)',
    'Anytime - Flexible'
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
        .from('in_home_estimates')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            preferred_date: formData.preferredDate,
            preferred_time: formData.preferredTime,
            message: formData.message
          }
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (err: any) {
      console.error('Error submitting in-home estimate form:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
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
          <h2 className="text-xl font-black text-secondary mb-2">Request Received!</h2>
          <p className="text-secondary-400 text-sm mb-6">
            We'll contact you within 24 hours to confirm your in-home estimate appointment.
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
          <Home size={14} className="text-brand" strokeWidth={2.5} />
          <span className="text-sm font-bold text-secondary-400 uppercase tracking-wider">Free In-Home Estimate</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
          We'll come to <span className="text-brand">you.</span>
        </h1>
        <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
          Schedule a free, no-obligation in-home estimate. Our team will visit your property and provide an accurate quote on the spot.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Estimate Form */}
        <div className="border border-secondary-100 rounded-2xl p-6 md:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-2">
              <h2 className="text-lg font-black text-secondary mb-1">Request your free estimate</h2>
              <p className="text-secondary-400 text-sm">Fill out the form and we'll schedule a visit to your home.</p>
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
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin size={10} /> Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Main St, City, State ZIP"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar size={10} /> Preferred Date
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock size={10} /> Preferred Time
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary-200 transition-colors"
                >
                  <option value="">Select a time preference</option>
                  {timeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Additional Details</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Tell us about the items you need removed, access conditions, or any special requirements..."
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
              {submitting ? 'Sending...' : <><Send size={14} /> Request Free Estimate</>}
            </button>

            <p className="text-[10px] text-secondary-400 text-center">
              No obligation. We'll confirm your appointment within 24 hours.
            </p>
          </form>
        </div>

        {/* Bottom CTA */}
        <div className="border-l-2 border-brand pl-6">
          <h2 className="text-xl font-black text-secondary mb-2">Prefer to talk now?</h2>
          <p className="text-secondary-400 text-sm mb-4">Call us for an immediate quote over the phone.</p>
          <div className="flex flex-wrap gap-3 items-center">
            <a
              href="tel:8313187139"
              className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center gap-2"
            >
              <Phone size={16} /> (831) 318-7139
            </a>
            <button
              onClick={() => navigate('/quote')}
              className="text-secondary font-bold text-sm uppercase tracking-wider underline underline-offset-4 decoration-secondary-300 hover:decoration-brand hover:text-brand transition-colors"
            >
              Get Instant Quote Online
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
