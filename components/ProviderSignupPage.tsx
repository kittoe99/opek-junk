import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone } from 'lucide-react';
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

      {/* Hero Section - matches service page style */}
      <section className="relative py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 block">
                Provider Network
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight mb-4 md:mb-6 leading-tight">
                You haul.<br/>We fill your calendar.
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                Own a truck? Already running jobs? Opek sends you pre-booked, pre-priced customers in your area. No cold calls, no chasing leads — just show up and get paid.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a 
                  href="#apply"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md inline-flex items-center justify-center gap-2"
                >
                  Apply Now
                </a>
                <a 
                  href="tel:(303)555-0199"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg shadow-sm inline-flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  Talk to Recruiting
                </a>
              </div>

              {/* Stats inline */}
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-black">500+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Providers</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-black">50+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Markets</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-black">10K+</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Jobs / Month</div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative aspect-[3/2] sm:aspect-[4/3] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
              <img 
                src="/workers-opek.webp" 
                loading="lazy"
                alt="Opek junk removal provider team on the job" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18}/>
                  <span className="text-sm font-bold">Be Your Own Boss • Set Your Schedule • Keep More Earnings</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it works for providers */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-black mb-2">How it works</h2>
            <p className="text-gray-500 text-sm">From signup to your first job in under 48 hours.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black mb-4">1</div>
              <h3 className="font-black text-sm mb-1.5">Apply below</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Takes 5 minutes. Tell us about your truck, your area, and your availability.</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black mb-4">2</div>
              <h3 className="font-black text-sm mb-1.5">Get approved</h3>
              <p className="text-gray-500 text-xs leading-relaxed">We verify your info and insurance. Most providers are approved within 1-2 days.</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black mb-4">3</div>
              <h3 className="font-black text-sm mb-1.5">Receive jobs</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Customers book through Opek. You get notified with job details, address, and pricing.</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black mb-4">4</div>
              <h3 className="font-black text-sm mb-1.5">Get paid</h3>
              <p className="text-gray-500 text-xs leading-relaxed">Complete the job, confirm pickup, and get paid directly. No invoicing, no chasing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="apply" className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block">Step 1 of 1</span>
            <h2 className="text-2xl md:text-3xl font-black text-black mb-2">Apply to join the network</h2>
            <p className="text-gray-500 text-sm">5 minutes. No fees. We'll be in touch within 1-2 business days.</p>
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
