import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Truck, MapPin, Calendar, User } from 'lucide-react';
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
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in joining the OPEK provider network. Our team will review your application and contact you within 1-2 business days.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
            Provider Network
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
            Join Our Provider Network
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with customers nationwide. Grow your junk removal business with OPEK's booking platform.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-lg">
              <User size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">More Customers</h3>
            <p className="text-gray-600 text-sm">Access to nationwide customer base</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-lg">
              <Calendar size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Flexible Schedule</h3>
            <p className="text-gray-600 text-sm">Work on your own terms</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-lg">
              <Truck size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Grow Your Business</h3>
            <p className="text-gray-600 text-sm">Scale with reliable bookings</p>
          </div>
        </div>

        {/* Image Section */}
        <div className="my-12 max-w-5xl mx-auto">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
            <img 
              src="/opek2.png" 
              alt="Professional junk removal provider with truck" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 text-white justify-center">
                <CheckCircle2 size={18}/>
                <span className="text-sm font-bold">Licensed Providers • Nationwide Network • Flexible Earnings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-black mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder="Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder="(303) 555-0199"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Business Name (Optional)</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
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
                <label className="block text-sm font-bold mb-2">Primary Service Area *</label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
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
                <label className="block text-sm font-bold mb-2">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
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
                <label className="block text-sm font-bold mb-4">When are you typically available? (Select all that apply) *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scheduleOptions.map(option => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black transition-colors"
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
              <label className="block text-sm font-bold mb-2">Additional Information (Optional)</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                placeholder="Tell us about your experience, equipment, certifications, or anything else you'd like us to know..."
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
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
  );
};
