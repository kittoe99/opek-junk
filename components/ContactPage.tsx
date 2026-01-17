
import React, { useState } from 'react';
import { Phone, Mail, Clock, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (formStatus === 'success') {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6">
            <Send size={40} />
          </div>
          <h2 className="text-4xl font-black mb-4">Message Sent</h2>
          <p className="text-gray-600 mb-8">
            Our team will connect you with service providers within 30 minutes during business hours.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">Get in touch with our Denver team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img 
                src="/opek2.png" 
                alt="Opek Junk Removal team" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4">
                <p className="text-white text-sm font-bold">
                  Denver's trusted junk removal experts since 2018
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-12">
              {[1, 2].map((step) => (
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
                      {step === 1 ? 'Info' : 'Message'}
                    </span>
                  </div>
                  {step < 2 && (
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email</label>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                  >
                    <option>General Inquiry</option>
                    <option>Residential Service</option>
                    <option>Commercial Service</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                >
                  Next Step
                </button>
              </form>
            )}

            {/* Step 2: Message & Review */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="How can we help you?"
                      className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg"
                    ></textarea>
                  </div>

                  {/* Review Section */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <h3 className="text-lg font-black mb-4">Your Information</h3>
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
                        <span className="text-gray-600">Subject:</span>
                        <span className="font-bold">{formData.subject}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-4 border-2 border-black text-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-lg"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400 rounded-lg shadow-md"
                    >
                      {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
