import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const ProviderSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    serviceArea: '',
    vehicleType: '',
    scheduleAvailability: [] as string[],
    additionalInfo: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vehicleTypes = [
    'Pickup Truck',
    'Box Truck (14-16 ft)',
    'Box Truck (18-20 ft)',
    'Box Truck (22-26 ft)',
    'Dump Truck',
    'Trailer',
    'Multiple Vehicles'
  ];

  const scheduleOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings',
    'Flexible/On-Call'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      scheduleAvailability: prev.scheduleAvailability.includes(option)
        ? prev.scheduleAvailability.filter(item => item !== option)
        : [...prev.scheduleAvailability, option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('provider_signups')
        .insert([
          {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            service_area: formData.serviceArea,
            vehicle_type: formData.vehicleType,
            availability: {
              schedule: formData.scheduleAvailability,
              businessName: formData.businessName,
              additionalInfo: formData.additionalInfo
            },
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting provider signup:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
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
          <h2 className="text-xl font-black text-secondary mb-2">Application Submitted!</h2>
          <p className="text-secondary-400 text-sm mb-6">
            Our team will review your application and contact you within 1–2 business days.
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
          <UserPlus size={14} className="text-brand" strokeWidth={2.5} />
          <span className="text-sm font-bold text-secondary-400 uppercase tracking-wider">Provider Network</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
          Grow your business<br className="hidden sm:block" />
          <span className="text-brand">with Opek.</span>
        </h1>
        <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
          Join our provider network and connect with customers nationwide. Flexible scheduling, fast payouts, and a platform built for haulers.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Form */}
        <div className="border border-secondary-100 rounded-2xl p-6 md:p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div>
              <h2 className="text-base font-black text-secondary mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Smith"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Business Name (Optional)</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Your Business Name"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors" />
                </div>
              </div>
            </div>

            {/* Service Area */}
            <div>
              <h2 className="text-base font-black text-secondary mb-4">Service Area</h2>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Primary Service Area *</label>
              <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleInputChange} required
                placeholder="e.g., Denver Metro Area, Los Angeles County"
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors" />
              <p className="text-xs text-secondary-300 mt-2">Specify the city, county, or region you primarily serve</p>
            </div>

            {/* Vehicle Information */}
            <div>
              <h2 className="text-base font-black text-secondary mb-4">Vehicle Information</h2>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Vehicle Type *</label>
              <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} required
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors">
                <option value="">Select vehicle type</option>
                {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Schedule Availability */}
            <div>
              <h2 className="text-base font-black text-secondary mb-4">Schedule Availability</h2>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-3">When are you typically available? (Select all that apply) *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scheduleOptions.map(option => (
                  <label key={option} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.scheduleAvailability.includes(option)
                      ? 'border-brand bg-brand/5'
                      : 'border-secondary-100 hover:border-secondary-300'
                  }`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                      formData.scheduleAvailability.includes(option) ? 'bg-brand' : 'border-2 border-secondary-200'
                    }`}>
                      {formData.scheduleAvailability.includes(option) && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <input type="checkbox" checked={formData.scheduleAvailability.includes(option)} onChange={() => handleScheduleChange(option)} className="sr-only" />
                    <span className="text-sm font-medium text-secondary">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1.5">Additional Information (Optional)</label>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={4}
                placeholder="Tell us about your experience, equipment, certifications, or anything else..."
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors resize-none" />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs font-bold">{error}</p>
              </div>
            )}

            <button type="submit" disabled={submitting}
              className="w-full py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <p className="text-xs text-secondary-300 text-center">By submitting, you agree to our provider terms and conditions</p>

          </form>
        </div>

        {/* Bottom CTA */}
        <div className="border-l-2 border-brand pl-6">
          <h2 className="text-xl font-black text-secondary mb-2">Have questions first?</h2>
          <p className="text-secondary-400 text-sm mb-4">Reach out before applying — we're happy to answer any questions about the network.</p>
          <div className="flex flex-wrap gap-3 items-center">
            <button onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center gap-2">
              Contact Us <ArrowRight size={16} />
            </button>
            <a href="tel:8313187139"
              className="text-secondary font-bold text-sm uppercase tracking-wider underline underline-offset-4 decoration-secondary-300 hover:decoration-brand hover:text-brand transition-colors">
              (831) 318-7139
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
