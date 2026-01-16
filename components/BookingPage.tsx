import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Calendar, MapPin, User, Mail, Phone } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    date: '',
    serviceType: 'Residential Junk Removal',
    details: ''
  });
  const [zipError, setZipError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'zipCode') {
      if (value && !/^80\d{3}$/.test(value)) {
        setZipError('Please enter a valid Denver area zip code (80xxx)');
      } else {
        setZipError('');
      }
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-lg">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-4xl font-black mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            We'll contact you within 15 minutes to confirm your appointment details.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors rounded-lg"
          >
            Book Another Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Book Your Service</h1>
          <p className="text-gray-600 text-lg">Complete the form to schedule your junk removal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sticky top-32">
              <img 
                src="/junk-removal.png" 
                alt="Professional junk removal service" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                <p className="text-white text-sm font-bold">
                  Fast, professional service across Denver Metro
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-12">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      currentStep >= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step}
                    </div>
                    <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${
                      currentStep >= step ? 'text-black' : 'text-gray-400'
                    }`}>
                      {step === 1 ? 'Contact' : step === 2 ? 'Location' : 'Details'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 mx-2 mb-6 transition-colors ${
                      currentStep > step ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Contact Info */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <User size={16} />
                    Full Name
                  </label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    type="email"
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    type="tel"
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              </form>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={16} />
                    Service Address
                  </label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Zip Code
                  </label>
                  <input 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    pattern="80\d{3}"
                    placeholder="80xxx"
                    className={`w-full border-2 px-4 py-3 focus:outline-none transition-colors rounded-lg ${
                      zipError ? 'border-red-500' : 'border-gray-200 focus:border-black'
                    }`}
                  />
                  {zipError && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{zipError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">We serve the Denver Metro area (80xxx zip codes)</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-4 border-2 border-black text-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={!!zipError}
                    className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400 rounded-lg shadow-md flex items-center justify-center gap-2"
                  >
                    Next Step
                    <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Service Details */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Service Type
                  </label>
                  <select 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  >
                    <option>Residential Junk Removal</option>
                    <option>Commercial Services</option>
                    <option>Construction Debris</option>
                    <option>Appliance Removal</option>
                    <option>Furniture Disposal</option>
                    <option>Yard Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} />
                    Preferred Date
                  </label>
                  <input 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Additional Details
                  </label>
                  <textarea 
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about the items you need removed..."
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  ></textarea>
                </div>

                {/* Review Section */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-lg font-black mb-4">Review Your Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-bold">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-bold">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-bold">{formData.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zip Code:</span>
                      <span className="font-bold">{formData.zipCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-bold">{formData.serviceType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-4 border-2 border-black text-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                  >
                    Confirm Booking
                    <CheckCircle size={20} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
