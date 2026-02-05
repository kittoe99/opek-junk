import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Calendar, MapPin, User, Mail, Phone, Upload, Loader2, Camera } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { QuoteEstimate, LoadingState } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { supabase } from '../lib/supabase';
import { Breadcrumb } from './Breadcrumb';

export const BookingPage: React.FC = () => {
  const location = useLocation();
  const estimateData = location.state as { estimate?: QuoteEstimate; image?: string } | null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const maxWidth = 1920;
          const maxHeight = 1920;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.8 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setImage(compressedImage);
        setEstimate(null);
        setLoadingState(LoadingState.IDLE);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
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
      <div className="min-h-screen pt-[88px] md:pt-[108px] pb-16 bg-white">
        <Breadcrumb items={[{ label: 'Book Online' }]} />
        <div className="py-16 md:py-20 lg:py-32 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-lg">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-3xl font-black mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Matched service providers will contact you within 15 minutes to confirm your appointment details.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
          >
            Book Another Service
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[88px] md:pt-[108px] pb-12 md:pb-16 bg-white">
      <Breadcrumb items={[{ label: 'Book Online' }]} />
      <div className="py-16 md:py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">Book Your Service</h1>
          <p className="text-sm md:text-base text-gray-600">Complete the form to schedule your junk removal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/2] lg:aspect-[4/3] overflow-hidden rounded-2xl sticky top-32">
              <img 
                src="/junk-removal.png" 
                alt="Professional junk removal service" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4">
                <p className="text-white text-xs font-bold">
                  Fast, professional service across Denver Metro
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            
            {/* Estimate Summary (if available) */}
            {estimateData?.estimate && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                <h3 className="text-base font-black mb-3">Your Estimate</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Volume</div>
                    <div className="font-bold text-sm">{formData.estimatedVolume}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Price Range</div>
                    <div className="font-bold">${formData.priceRangeMin} - ${formData.priceRangeMax}</div>
                  </div>
                </div>
                {formData.estimatedItems.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Items Detected</div>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.estimatedItems.map((item, index) => (
                        <span key={index} className="px-2.5 py-0.5 bg-white border border-gray-300 rounded-full text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6 md:mb-8">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-colors ${
                      currentStep >= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step}
                    </div>
                    <span className={`text-[9px] md:text-[10px] font-bold mt-1.5 uppercase tracking-wider ${
                      currentStep >= step ? 'text-black' : 'text-gray-400'
                    }`}>
                      {step === 1 ? 'Photo' : step === 2 ? 'Contact' : step === 3 ? 'Location' : 'Details'}
                    </span>
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-0.5 mx-2 mb-5 transition-colors ${
                      currentStep > step ? 'bg-black' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Photo Upload & Estimate */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {!image ? (
                  <div className="space-y-3">
                    {/* Camera Capture */}
                    <div 
                      className="border border-dashed border-gray-300 p-8 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg shadow-sm"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                        <Camera size={24} className="text-white" />
                      </div>
                      <h3 className="text-base font-bold mb-1">Take Photo</h3>
                      <p className="text-gray-600 text-sm">Use your camera to capture the junk</p>
                      <input 
                        type="file" 
                        ref={cameraInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handleFileChange} 
                      />
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Or</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* File Upload */}
                    <div 
                      className="border border-dashed border-gray-300 p-8 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg shadow-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-base font-bold mb-1">Upload Photo</h3>
                      <p className="text-gray-600 text-sm">Choose a photo from your device</p>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-md">
                      <img src={image} alt="Upload" className="w-full" />
                      {loadingState !== LoadingState.ANALYZING && (
                        <button 
                          onClick={() => { setImage(null); setEstimate(null); setLoadingState(LoadingState.IDLE); }} 
                          className="absolute top-3 right-3 bg-white text-black px-3 py-1.5 text-xs font-bold shadow-lg hover:bg-gray-100 transition-colors rounded-lg"
                        >
                          Change Photo
                        </button>
                      )}
                    </div>

                    {loadingState === LoadingState.IDLE && (
                      <button 
                        onClick={handleAnalyze}
                        className="w-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase hover:bg-gray-800 bg-black text-white transition-colors rounded-lg shadow-md"
                      >
                        Analyze Photo
                      </button>
                    )}

                    {loadingState === LoadingState.ANALYZING && (
                      <div className="py-8 text-center">
                        <Loader2 size={40} className="animate-spin mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">Analyzing your photo...</p>
                      </div>
                    )}

                    {loadingState === LoadingState.SUCCESS && estimate && (
                      <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg shadow-md">
                        <div className="mb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items Detected</div>
                          <ul className="space-y-1.5">
                            {estimate.itemsDetected.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-black mt-0.5">•</span>
                                <span className="text-gray-700 text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-4 pt-4 border-t border-gray-300">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Volume</div>
                          <div className="text-2xl font-black">{estimate.estimatedVolume}</div>
                        </div>
                        <div className="mb-4">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price Range</div>
                          <div className="text-3xl font-black">
                            ${estimate.priceRange.min} - ${estimate.priceRange.max}
                          </div>
                        </div>
                        <div className="mb-5 pb-4 border-b border-gray-300">
                          <p className="text-gray-700 text-sm leading-relaxed">{estimate.summary}</p>
                        </div>
                        <button 
                          onClick={() => handleNextStep()}
                          className="w-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase hover:bg-gray-800 bg-black text-white transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                        >
                          Continue to Booking
                          <ArrowRight size={18} />
                        </button>
                        <p className="text-[10px] text-gray-500 text-center mt-3">
                          * Final price confirmed on-site
                        </p>
                      </div>
                    )}

                    {loadingState === LoadingState.ERROR && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center shadow-md">
                        <p className="text-red-700 text-sm font-bold mb-3">Failed to analyze photo</p>
                        <button 
                          onClick={handleAnalyze}
                          className="px-5 py-2 bg-black text-white font-bold uppercase text-xs hover:bg-gray-800 transition-colors rounded-lg"
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
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    type="email"
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    type="tel"
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase hover:bg-gray-800 bg-black text-white transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Service Address
                  </label>
                  <input 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Zip Code
                  </label>
                  <input 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    pattern="80\d{3}"
                    placeholder="80xxx"
                    className={`w-full border px-3 py-2.5 text-sm focus:outline-none transition-colors rounded-lg shadow-md ${
                      zipError ? 'border-red-500' : 'border-gray-200 focus:border-black'
                    }`}
                  />
                  {zipError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{zipError}</p>
                  )}
                  <p className="text-[10px] text-gray-500 mt-1.5">We serve the Denver Metro area (80xxx zip codes)</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold uppercase border border-black text-black hover:bg-black hover:text-white transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={!!zipError}
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Service Details */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Service Type
                  </label>
                  <select 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"
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
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Preferred Date
                  </label>
                  <input 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                    Additional Details
                  </label>
                  <textarea 
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tell us about the items you need removed..."
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors rounded-lg shadow-sm"
                  ></textarea>
                </div>

                {/* Review Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-md">
                  <h3 className="text-sm font-black mb-3">Review Your Information</h3>
                  <div className="space-y-1.5 text-xs">
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
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-xs font-bold">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={handlePrevStep}
                    disabled={submitting}
                    className="flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold uppercase border border-black text-black hover:bg-black hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={18} />
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold uppercase bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Booking'}
                    {!submitting && <CheckCircle size={18} />}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
      </div>
    </div>
  );
};
