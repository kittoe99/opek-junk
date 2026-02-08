import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Truck, MapPin, Calendar, User, DollarSign, TrendingUp, Headphones, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Breadcrumb } from './Breadcrumb';

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
      <div className="min-h-screen bg-black pt-[88px] md:pt-[108px] px-4">
        <Breadcrumb items={[{ label: 'Become a Provider' }]} />
        <div className="py-16 md:py-20 lg:py-32 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Application Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for your interest in joining the Opek provider network. Our team will review your application and contact you within 1-2 business days.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-100 transition-colors rounded-lg shadow-md"
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
      <Breadcrumb items={[{ label: 'Become a Provider' }]} />

      {/* Hero Section */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1.5 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6 border border-white/20">
                Provider Network
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 leading-tight">
                Grow your business with Opek.
              </h1>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                Join a nationwide network of trusted junk removal providers. We bring the customers — you deliver the service. Set your own schedule, keep more of what you earn.
              </p>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl md:text-3xl font-black text-white">500+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Providers</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl md:text-3xl font-black text-white">50+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Cities</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl md:text-3xl font-black text-white">10K+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Jobs / Month</div>
                </div>
              </div>
            </div>
            {/* Image */}
            <div className="hidden lg:block relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img 
                src="/workers-opek.webp" 
                loading="lazy"
                alt="Professional junk removal provider team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-black mb-2">Why providers choose Opek</h2>
            <p className="text-gray-500 text-sm">Everything you need to grow your hauling business.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4">
                <DollarSign size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1.5">Competitive Pay</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Keep more of what you earn with transparent, competitive payouts on every job.</p>
            </div>
            <div className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4">
                <Clock size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1.5">Flexible Schedule</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Work when you want. Set your own availability and accept jobs that fit your schedule.</p>
            </div>
            <div className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4">
                <TrendingUp size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1.5">Steady Leads</h3>
              <p className="text-gray-500 text-xs leading-relaxed">We handle marketing and customer acquisition so you can focus on the work.</p>
            </div>
            <div className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4">
                <Headphones size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1.5">Dedicated Support</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Our provider support team is available 7 days a week to help you succeed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-black mb-2">Apply to join</h2>
            <p className="text-gray-500 text-sm">Fill out the form below and our team will be in touch within 1-2 business days.</p>
          </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-black mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold mb-1.5">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                    placeholder="Smith"
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
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1.5">Business Name (Optional)</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                    placeholder="Your Business Name"
                  />
                </div>
              </div>
            </div>

            {/* Service Area */}
            <div>
              <h2 className="text-2xl font-black mb-6">
                Service Area
              </h2>
              <div>
                <label className="block text-xs font-bold mb-1.5">Primary Service Area *</label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                  placeholder="e.g., Denver Metro Area, Los Angeles County, etc."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Specify the city, county, or region you primarily serve
                </p>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h2 className="text-2xl font-black mb-6">
                Vehicle Information
              </h2>
              <div>
                <label className="block text-xs font-bold mb-1.5">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule Availability */}
            <div>
              <h2 className="text-2xl font-black mb-6">
                Schedule Availability
              </h2>
              <div>
                <label className="block text-xs font-bold mb-4">When are you typically available? (Select all that apply) *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scheduleOptions.map(option => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-black transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.scheduleAvailability.includes(option)}
                        onChange={() => handleScheduleChange(option)}
                        className="w-5 h-5"
                      />
                      <span className="font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-xs font-bold mb-1.5">Additional Information (Optional)</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                placeholder="Tell us about your experience, equipment, certifications, or anything else you'd like us to know..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs font-bold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">
                By submitting, you agree to our provider terms and conditions
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
