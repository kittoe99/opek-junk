import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Truck, MapPin, Calendar, User } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 pt-[88px] md:pt-[108px] px-4">
        <Breadcrumb items={[{ label: 'Become a Provider' }]} />
        <div className="py-16 md:py-20 lg:py-32 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Application Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for your interest in joining the OPEK provider network. Our team will review your application and contact you within 1-2 business days.
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
    <div className="min-h-screen bg-gray-50 pt-[88px] md:pt-[108px]">
      <Breadcrumb items={[{ label: 'Become a Provider' }]} />
      <div className="py-16 md:py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
            Provider Network
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
            Join Our Provider Network
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Connect with customers nationwide. Grow your junk removal business with OPEK's booking platform.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl">
            <img 
              src="/opek2.webp" 
              loading="lazy"
              alt="Professional junk removal provider" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8 text-white text-center">
                <div className="flex items-center gap-2">
                  <User size={16} className="shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">500+ Providers</span>
                </div>
                <span className="hidden md:block text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">50+ Cities</span>
                </div>
                <span className="hidden md:block text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">Flexible Schedule</span>
                </div>
                <span className="hidden md:block text-white/40">•</span>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">Grow Your Business</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
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
                    placeholder="(831) 318-7139"
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
      </div>
    </div>
  );
};
