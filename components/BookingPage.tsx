import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Calendar, MapPin, User, Mail, Phone, Upload, Loader2, Camera } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { QuoteEstimate, LoadingState } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { supabase } from '../lib/supabase';

export const BookingPage: React.FC = () => {
  const location = useLocation();
  const estimateData = location.state as { estimate?: QuoteEstimate; image?: string } | null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    date: '',
    serviceType: 'Residential Junk Removal',
    details: '',
    // Estimate fields
    estimatedItems: [] as string[],
    estimatedVolume: '',
    priceRangeMin: 0,
    priceRangeMax: 0,
    estimateSummary: '',
    photoUrl: ''
  });
  const [zipError, setZipError] = useState<string>('');

  // Pre-fill estimate data if available from QuotePage
  useEffect(() => {
    if (estimateData?.estimate) {
      const { estimate: est, image: img } = estimateData;
      setEstimate(est);
      setImage(img || null);
      setLoadingState(LoadingState.SUCCESS);
      setFormData(prev => ({
        ...prev,
        estimatedItems: est.itemsDetected,
        estimatedVolume: est.estimatedVolume,
        priceRangeMin: est.priceRange.min,
        priceRangeMax: est.priceRange.max,
        estimateSummary: est.summary,
        photoUrl: img || '',
        details: `Items: ${est.itemsDetected.join(', ')}\nEstimated Volume: ${est.estimatedVolume}\nPrice Range: $${est.priceRange.min} - $${est.priceRange.max}`
      }));
      setCurrentStep(2); // Skip to step 2 if coming from quote page
    }
  }, [estimateData]);

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
      setFormData(prev => ({
        ...prev,
        estimatedItems: result.itemsDetected,
        estimatedVolume: result.estimatedVolume,
        priceRangeMin: result.priceRange.min,
        priceRangeMax: result.priceRange.max,
        estimateSummary: result.summary,
        photoUrl: image,
        details: `Items: ${result.itemsDetected.join(', ')}\nEstimated Volume: ${result.estimatedVolume}\nPrice Range: $${result.priceRange.min} - $${result.priceRange.max}`
      }));
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

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

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            zip_code: formData.zipCode,
            service_type: formData.serviceType,
            preferred_date: formData.date,
            details: formData.details,
            estimated_items: formData.estimatedItems,
            estimated_volume: formData.estimatedVolume,
            price_range_min: formData.priceRangeMin,
            price_range_max: formData.priceRangeMax,
            estimate_summary: formData.estimateSummary,
            photo_url: formData.photoUrl,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting booking:', err);
      setError(err.message || 'Failed to submit booking. Please try again.');
      setSubmitting(false);
    }
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
            Matched service providers will contact you within 15 minutes to confirm your appointment details.
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
            
            {/* Estimate Summary (if available) */}
            {estimateData?.estimate && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-black mb-4">Your Estimate</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Volume</div>
                    <div className="font-bold">{formData.estimatedVolume}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price Range</div>
                    <div className="font-bold text-lg">${formData.priceRangeMin} - ${formData.priceRangeMax}</div>
                  </div>
                </div>
                {formData.estimatedItems.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items Detected</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.estimatedItems.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                      {step === 1 ? 'Photo' : step === 2 ? 'Contact' : step === 3 ? 'Location' : 'Details'}
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

            {/* Step 1: Photo Upload & Estimate */}
            {currentStep === 1 && (
              <div className="space-y-6">
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
                          onClick={() => { setImage(null); setEstimate(null); setLoadingState(LoadingState.IDLE); }} 
                          className="absolute top-4 right-4 bg-white text-black px-4 py-2 text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors rounded-lg"
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
                          onClick={() => handleNextStep()}
                          className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                        >
                          Continue to Booking
                          <ArrowRight size={20} />
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-4">
                          * Final price confirmed on-site
                        </p>
                      </div>
                    )}

                    {loadingState === LoadingState.ERROR && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-700 font-bold mb-4">Failed to analyze photo</p>
                        <button 
                          onClick={handleAnalyze}
                          className="px-6 py-2 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Contact Info */}
            {currentStep === 2 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
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

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
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

            {/* Step 4: Service Details */}
            {currentStep === 4 && (
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
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
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
                    className="flex-1 py-4 border-2 border-black text-black font-bold uppercase hover:bg-black hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Booking'}
                    {!submitting && <CheckCircle size={20} />}
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
