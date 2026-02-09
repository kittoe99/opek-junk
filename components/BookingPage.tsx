import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, MapPin, Upload, Loader2, Camera, Phone, Mail, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuoteEstimate, LoadingState } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { supabase } from '../lib/supabase';
import { Breadcrumb } from './Breadcrumb';

// ── Address suggestion type ──
interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const estimateData = location.state as { estimate?: QuoteEstimate; image?: string } | null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);

  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    unitNumber: '',
    city: '',
    state: '',
    zipCode: '',
    date: '',
    serviceType: 'Residential Junk Removal',
    details: '',
    estimatedItems: [] as string[],
    estimatedVolume: '',
    priceRangeMin: 0,
    priceRangeMax: 0,
    estimateSummary: '',
    photoUrl: ''
  });

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
      setCurrentStep(2);
    }
  }, [estimateData]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Address autocomplete via Photon (free, no API key) ──
  const fetchAddressSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setAddressLoading(true);
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en&lat=39.7392&lon=-104.9903&osm_tag=place:house&osm_tag=building`
      );
      const data = await res.json();
      const results: AddressSuggestion[] = (data.features || [])
        .filter((f: any) => f.properties?.street || f.properties?.name)
        .map((f: any) => {
          const p = f.properties;
          const street = p.housenumber
            ? `${p.housenumber} ${p.street || p.name || ''}`
            : (p.street || p.name || '');
          const city = p.city || p.town || p.village || p.county || '';
          const state = p.state || '';
          const zipCode = p.postcode || '';
          const display = [street, city, state, zipCode].filter(Boolean).join(', ');
          return { display, street: street.trim(), city, state, zipCode };
        })
        .filter((s: AddressSuggestion) => s.street);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const handleAddressInput = (value: string) => {
    setAddressQuery(value);
    setFormData(prev => ({ ...prev, address: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchAddressSuggestions(value), 300);
  };

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    setAddressQuery(suggestion.street);
    setFormData(prev => ({
      ...prev,
      address: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          const maxHeight = 1920;
          if (width > height) {
            if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
          } else {
            if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
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
      } catch (err) {
        console.error('Error compressing image:', err);
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
    } catch {
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            unit_number: formData.unitNumber || null,
            city: formData.city,
            state: formData.state,
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

  const stepLabels = ['Photo', 'Info & Location', 'Details & Review'];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white pt-[88px] md:pt-[108px] px-4">
        <Breadcrumb items={[{ label: 'Book Online' }]} />
        <div className="py-16 md:py-20 lg:py-32 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-black mb-3">Booking Confirmed!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Matched service providers will contact you within 15 minutes to confirm your appointment details.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-black text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
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
      <Breadcrumb items={[{ label: 'Book Online' }]} />
      <div className="py-16 md:py-20 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
              Book Your Service
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Complete the form to schedule your junk removal pickup
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-12">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl">
              <img
                src="/junk-removal.webp"
                loading="lazy"
                alt="Professional junk removal service"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8 text-white text-center md:text-left">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">(831) 318-7139</span>
                  </div>
                  <span className="hidden md:block text-white/40">•</span>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">Support@opekjunkremoval.com</span>
                  </div>
                  <span className="hidden md:block text-white/40">•</span>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">24/7 Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
            <div className="max-w-2xl mx-auto">

              {/* Estimate Summary (if available) */}
              {estimateData?.estimate && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                  <h3 className="text-sm font-black mb-3">Your Estimate</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Volume</div>
                      <div className="font-bold text-sm">{formData.estimatedVolume}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Price Range</div>
                      <div className="font-bold text-sm">${formData.priceRangeMin} - ${formData.priceRangeMax}</div>
                    </div>
                  </div>
                  {formData.estimatedItems.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Items</div>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.estimatedItems.map((item, index) => (
                          <span key={index} className="px-2.5 py-0.5 bg-white border border-gray-300 rounded-full text-xs">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                {stepLabels.map((label, i) => {
                  const step = i + 1;
                  return (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          currentStep > step ? 'bg-emerald-500 text-white' : currentStep === step ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {currentStep > step ? <CheckCircle size={16} /> : step}
                        </div>
                        <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${
                          currentStep >= step ? 'text-black' : 'text-gray-400'
                        }`}>
                          {label}
                        </span>
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-0.5 mx-2 mb-5 transition-colors ${
                          currentStep > step ? 'bg-emerald-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* ═══ Step 1: Photo Upload & Estimate ═══ */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-lg md:text-xl font-black mb-1">Upload a Photo</h2>
                    <p className="text-gray-600 text-sm">Take or upload a photo of the items for an instant AI estimate</p>
                  </div>

                  {!image ? (
                    <div className="space-y-3">
                      <div
                        className="border border-dashed border-gray-300 p-8 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                          <Camera size={24} className="text-white" />
                        </div>
                        <h3 className="text-base font-bold mb-1">Take Photo</h3>
                        <p className="text-gray-600 text-sm">Use your camera to capture the junk</p>
                        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <div
                        className="border border-dashed border-gray-300 p-8 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Upload size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-base font-bold mb-1">Upload Photo</h3>
                        <p className="text-gray-600 text-sm">Choose a photo from your device</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => handleNextStep()}
                          className="w-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase border border-black text-black hover:bg-black hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2"
                        >
                          Skip — I'll describe my items
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
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
                        <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
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
                          <div className="mb-4 pt-4 border-t border-gray-200">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Volume</div>
                            <div className="text-2xl font-black">{estimate.estimatedVolume}</div>
                          </div>
                          <div className="mb-4">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price Range</div>
                            <div className="text-3xl font-black">${estimate.priceRange.min} - ${estimate.priceRange.max}</div>
                          </div>
                          <div className="mb-5 pb-4 border-b border-gray-200">
                            <p className="text-gray-700 text-sm leading-relaxed">{estimate.summary}</p>
                          </div>
                          <button
                            onClick={() => handleNextStep()}
                            className="w-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase hover:bg-gray-800 bg-black text-white transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                          >
                            Continue to Booking
                            <ArrowRight size={18} />
                          </button>
                          <p className="text-[10px] text-gray-500 text-center mt-3">* Final price confirmed on-site</p>
                        </div>
                      )}

                      {loadingState === LoadingState.ERROR && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
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

              {/* ═══ Step 2: Contact Info & Location ═══ */}
              {currentStep === 2 && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-lg md:text-xl font-black mb-1">Your Information</h2>
                    <p className="text-gray-600 text-sm">Tell us how to reach you and where to pick up</p>
                  </div>

                  {/* Contact fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">Full Name *</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Smith"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5">Email *</label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5">Phone *</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* Address with autocomplete */}
                  <div ref={addressDropdownRef} className="relative">
                    <label className="block text-xs font-bold mb-1.5">
                      <MapPin size={12} className="inline mr-1" />
                      Service Address *
                    </label>
                    <input
                      value={addressQuery}
                      onChange={(e) => handleAddressInput(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      required
                      placeholder="Start typing an address..."
                      autoComplete="off"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                    />
                    {addressLoading && (
                      <Loader2 size={14} className="absolute right-3 top-[34px] animate-spin text-gray-400" />
                    )}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => selectSuggestion(s)}
                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-2"
                          >
                            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                            <span>{s.display}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Unit number */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5">Apt / Unit / Suite <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. Apt 4B, Suite 200"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold mb-1.5">City *</label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Denver"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5">State *</label>
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="CO"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5">Zip Code *</label>
                      <input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        placeholder="80202"
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold uppercase border border-black text-black hover:bg-black hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-5 py-2.5 text-xs sm:text-sm font-bold uppercase bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
                    >
                      Next Step
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* ═══ Step 3: Service Details & Review ═══ */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-lg md:text-xl font-black mb-1">Service Details</h2>
                    <p className="text-gray-600 text-sm">Choose your service type, date, and review your booking</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5">Service Type *</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                      >
                        <option>Residential Junk Removal</option>
                        <option>Commercial Services</option>
                        <option>Construction Debris</option>
                        <option>Appliance Removal</option>
                        <option>Furniture Disposal</option>
                        <option>Yard Waste</option>
                        <option>E-Waste Recycling</option>
                        <option>Property Cleanout</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5">Preferred Date *</label>
                      <input
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5">Additional Details</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us about the items you need removed, access instructions, etc."
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* Review Section */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-black mb-3">Review Your Information</h3>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-bold">{formData.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-bold">{formData.email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-bold">{formData.phone}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-bold text-right max-w-[60%]">{formData.address}{formData.unitNumber ? `, ${formData.unitNumber}` : ''}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">City / State / Zip</span><span className="font-bold">{[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-bold">{formData.serviceType}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-bold">{formData.date || '—'}</span></div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-xs font-bold">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
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

                  <p className="text-xs text-gray-500 text-center mt-3">
                    We'll match you with a provider who will confirm within 15 minutes
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
