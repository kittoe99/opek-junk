import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { QuoteEstimate, LoadingState } from '../types';
import { supabase } from '../lib/supabase';

export const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'ai' | 'manual' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // AI State
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    address: '',
    zipCode: '',
    date: '',
    details: '' 
  });
  const [zipError, setZipError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEstimate(null);
        setLoadingState(LoadingState.IDLE);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoadingState(LoadingState.ANALYZING);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const result = await getJunkQuoteFromPhoto(base64Data, mimeType);
      setEstimate(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('schedule_visits')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            zip_code: formData.zipCode,
            preferred_date: formData.date,
            details: formData.details,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting schedule visit:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
      setSubmitting(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate zip code for Denver area (80xxx)
    if (name === 'zipCode') {
      if (value && !/^80\d{3}$/.test(value)) {
        setZipError('Please enter a valid Denver area zip code (80xxx)');
      } else {
        setZipError('');
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-4xl font-black mb-4">Request Received</h2>
          <p className="text-gray-600 mb-8">
            You'll be contacted by matched service providers within 15 minutes to confirm your {selectedOption === 'ai' ? 'estimate' : 'appointment'}.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  // Initial selection screen
  if (!selectedOption) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-3">Get a Quote</h1>
            <p className="text-gray-600">Choose your method</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {/* AI Option */}
            <button
              onClick={() => setSelectedOption('ai')}
              className="group p-6 border-2 border-gray-200 hover:border-black transition-all text-left bg-white hover:shadow-lg rounded-lg"
            >
              <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform rounded-lg">
                <Camera size={28} />
              </div>
              <h3 className="text-xl font-black mb-2">AI Photo Estimate</h3>
              <p className="text-gray-600 text-sm mb-4">
                Instant pricing from a photo
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-black">
                Continue
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>

            {/* Manual Option */}
            <button
              onClick={() => setSelectedOption('manual')}
              className="group p-6 border-2 border-gray-200 hover:border-black transition-all text-left bg-white hover:shadow-lg rounded-lg"
            >
              <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform rounded-lg">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-black mb-2">Schedule Visit</h3>
              <p className="text-gray-600 text-sm mb-4">
                In-person quote for accuracy
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-black">
                Continue
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>

          {/* Image */}
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl max-w-3xl mx-auto">
            <img 
              src="/opek2.png" 
              alt="Professional junk removal service" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
              <p className="text-white text-sm md:text-base font-bold text-center">
                Fast, reliable service with transparent pricing
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => setSelectedOption(null)}
          className="mb-8 text-sm font-bold text-gray-600 hover:text-black transition-colors"
        >
          ← Back to options
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {selectedOption === 'ai' ? 'AI Photo Estimate' : 'Schedule Visit'}
          </h1>
        </div>

        {/* AI Content */}
        {selectedOption === 'ai' && (
          <div>

            {!image ? (
              <div 
                className="border-2 border-dashed border-gray-300 p-16 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Photo</h3>
                <p className="text-gray-600 mb-2">Click to upload a photo of your junk</p>
                <p className="text-sm text-gray-400">JPG or PNG, max 10MB</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                  <img src={image} alt="Upload" className="w-full" />
                  {loadingState !== LoadingState.ANALYZING && (
                    <button 
                      onClick={() => { setImage(null); setEstimate(null); }} 
                      className="absolute top-4 right-4 bg-white text-black px-4 py-2 text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      Change Photo
                    </button>
                  )}
                </div>

                {loadingState === LoadingState.IDLE && (
                  <button 
                    onClick={handleAnalyze}
                    className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                  >
                    Analyze Photo
                  </button>
                )}

                {loadingState === LoadingState.ANALYZING && (
                  <div className="py-12 text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Analyzing your photo...</p>
                  </div>
                )}

                {loadingState === LoadingState.SUCCESS && estimate && (
                  <div className="bg-gray-50 p-8 border-2 border-gray-200 rounded-lg">
                    <div className="mb-6">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Items Detected</div>
                      <ul className="space-y-2">
                        {estimate.itemsDetected.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-black mt-1">•</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-6 pt-6 border-t border-gray-300">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Volume</div>
                      <div className="text-3xl font-black">{estimate.estimatedVolume}</div>
                    </div>
                    <div className="mb-6">
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Price Range</div>
                      <div className="text-4xl font-black">
                        ${estimate.priceRange.min} - ${estimate.priceRange.max}
                      </div>
                    </div>
                    <div className="mb-8 pb-6 border-b border-gray-300">
                      <p className="text-gray-700 leading-relaxed">{estimate.summary}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/booking', { state: { estimate, image } })}
                      className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                    >
                      Confirm Booking
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      * Final price confirmed on-site
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Content */}
        {selectedOption === 'manual' && (
          <div>
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-12">
              {[1, 2, 3, 4].map((step) => (
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
                      {step === 1 ? 'Zip Code' : step === 2 ? 'Contact' : step === 3 ? 'Details' : 'Review'}
                    </span>
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-0.5 mx-2 mb-6 transition-colors ${
                      currentStep > step ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Zip Code Validation */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black mb-3">Check Service Availability</h3>
                  <p className="text-gray-600">Enter your zip code to verify we service your area</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Zip Code</label>
                  <input 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required 
                    pattern="80\d{3}"
                    placeholder="80xxx"
                    maxLength={5}
                    className={`w-full border-2 px-4 py-4 text-lg focus:outline-none transition-colors rounded-lg ${
                      zipError ? 'border-red-500' : 'border-gray-200 focus:border-black'
                    }`}
                  />
                  {zipError && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{zipError}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-2">We serve Denver area zip codes (80xxx within 50-mile radius)</p>
                </div>

                <button 
                  type="submit"
                  disabled={!!zipError || !formData.zipCode}
                  className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Verify & Continue
                </button>
              </form>
            )}

            {/* Step 2: Contact Info */}
            {currentStep === 2 && (
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email</label>
                    <input 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone</label>
                    <input 
                      name="phone"
                      type="tel" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                      className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                >
                  Next Step
                </button>
              </form>
            )}

            {/* Step 3: Service Details */}
            {currentStep === 3 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Address</label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Preferred Date</label>
                  <input 
                    name="date"
                    type="date" 
                    value={formData.date}
                    onChange={handleInputChange}
                    required 
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Details</label>
                  <textarea 
                    name="details"
                    rows={4} 
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Describe what needs to be removed"
                    className="w-full border-2 border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors rounded-lg" 
                  ></textarea>
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
                    className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                  >
                    Next Step
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 space-y-4">
                  <h3 className="text-xl font-black mb-4">Review Your Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</div>
                      <div className="font-bold">{formData.name}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                      <div className="font-bold">{formData.email}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                      <div className="font-bold">{formData.phone}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</div>
                      <div className="font-bold">{formData.date}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</div>
                    <div className="font-bold">{formData.address}</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Zip Code</div>
                    <div className="font-bold">{formData.zipCode}</div>
                  </div>

                  {formData.details && (
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Details</div>
                      <div className="text-gray-700">{formData.details}</div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm font-bold">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    disabled={submitting}
                    className="flex-1 py-4 border-2 border-black text-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleManualSubmit}
                    disabled={submitting}
                    className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Confirm & Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};