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
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
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
      const { data: insertedData, error: insertError } = await supabase
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
        ])
        .select('order_number')
        .single();

      if (insertError) throw insertError;
      if (insertedData?.order_number) setOrderNumber(insertedData.order_number);
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
      <div className="min-h-screen bg-white pt-[80px] md:pt-[104px] px-4">
        <Breadcrumb items={[{ label: 'Book Online' }]} />
        <div className="py-24 md:py-32 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-900">
              <CheckCircle size={20} strokeWidth={1.25} />
            </div>
            <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-4">Booking confirmed</h2>
            {orderNumber && (
              <div className="mb-8 py-6 border-y border-gray-200">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Your Order Number</p>
                <p className="text-2xl font-mono text-gray-900 tracking-tight">{orderNumber}</p>
                <p className="text-[11px] text-gray-400 mt-2">Save this to track your order status</p>
              </div>
            )}
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">
              Matched service providers will contact you within 15 minutes to confirm your appointment details.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => navigate('/track-order')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
              >
                Track Order
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[80px] md:pt-[104px]">
      <Breadcrumb items={[{ label: 'Book Online' }]} />
      <div className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pb-24">

          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-16">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
                <span className="inline-block h-px w-8 bg-gray-300" />
                <span>Book online</span>
              </div>
            </div>
            <div className="md:col-span-8">
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 tracking-tight leading-[1.05]">
                Book your service.
              </h1>
              <p className="text-gray-500 mt-6 max-w-lg leading-relaxed">
                Three quick steps to schedule your junk removal pickup.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-xs text-gray-500">
                <a href="tel:8313187139" className="inline-flex items-center gap-1.5 hover:text-gray-900">
                  <Phone size={12} strokeWidth={1.5} /> (831) 318-7139
                </a>
                <span className="text-gray-300">/</span>
                <a href="mailto:Support@opekjunkremoval.com" className="inline-flex items-center gap-1.5 hover:text-gray-900 break-all">
                  <Mail size={12} strokeWidth={1.5} /> Support@opekjunkremoval.com
                </a>
                <span className="text-gray-300 hidden sm:inline">/</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} strokeWidth={1.5} /> 24/7 service
                </span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="border-t border-gray-200 pt-12 md:pt-16">
            <div className="max-w-2xl mx-auto">

              {/* Estimate Summary (if available) */}
              {estimateData?.estimate && (
                <div className="border-t border-b border-gray-200 py-6 mb-10">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Your estimate</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Estimated Volume</div>
                      <div className="text-sm text-gray-900">{formData.estimatedVolume}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Price Range</div>
                      <div className="text-sm text-gray-900">${formData.priceRangeMin} - ${formData.priceRangeMax}</div>
                    </div>
                  </div>
                  {formData.estimatedItems.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Items</div>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.estimatedItems.map((item, index) => (
                          <span key={index} className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-700">{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-12">
                {stepLabels.map((label, i) => {
                  const step = i + 1;
                  return (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs transition-colors ${
                          currentStep > step ? 'bg-gray-900 text-white border border-gray-900' : currentStep === step ? 'bg-gray-900 text-white border border-gray-900' : 'bg-white text-gray-400 border border-gray-300'
                        }`}>
                          {currentStep > step ? <CheckCircle size={16} /> : step}
                        </div>
                        <span className={`text-[10px] mt-2 uppercase tracking-[0.18em] ${
                          currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {label}
                        </span>
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-0.5 mx-2 mb-5 transition-colors ${
                          currentStep > step ? 'bg-gray-900' : 'bg-gray-200'
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
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-2">Upload a Photo</h2>
                    <p className="text-gray-500 text-sm">Take or upload a photo of the items for an instant AI estimate</p>
                  </div>

                  {!image ? (
                    <div className="space-y-3">
                      <div
                        className="border border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer rounded-sm"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <div className="w-12 h-12 border border-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-900">
                          <Camera size={18} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-light text-gray-900 tracking-tight mb-1">Take Photo</h3>
                        <p className="text-gray-500 text-sm">Use your camera to capture the junk</p>
                        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>

                      <div
                        className="border border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer rounded-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                          <Upload size={18} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-light text-gray-900 tracking-tight mb-1">Upload Photo</h3>
                        <p className="text-gray-500 text-sm">Choose a photo from your device</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => handleNextStep()}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border border-gray-300 text-gray-700 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors"
                        >
                          Skip — I'll describe my items
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative border border-gray-200 rounded-sm overflow-hidden">
                        <img src={image} alt="Upload" className="w-full" />
                        {loadingState !== LoadingState.ANALYZING && (
                          <button
                            onClick={() => { setImage(null); setEstimate(null); setLoadingState(LoadingState.IDLE); }}
                            className="absolute top-3 right-3 bg-white text-gray-900 px-4 py-2 text-xs font-medium border border-gray-200 hover:border-gray-900 transition-colors rounded-full"
                          >
                            Change Photo
                          </button>
                        )}
                      </div>

                      {loadingState === LoadingState.IDLE && (
                        <button
                          onClick={handleAnalyze}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
                        >
                          Analyze Photo
                        </button>
                      )}

                      {loadingState === LoadingState.ANALYZING && (
                        <div className="py-8 text-center">
                          <Loader2 size={40} className="animate-spin mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">Analyzing your photo...</p>
                        </div>
                      )}

                      {loadingState === LoadingState.SUCCESS && estimate && (
                        <div className="border-t border-b border-gray-200 py-8">
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
                            <div className="text-2xl font-light text-gray-900 tracking-tight">{estimate.estimatedVolume}</div>
                          </div>
                          <div className="mb-4">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price Range</div>
                            <div className="text-3xl font-light text-gray-900 tracking-tight">${estimate.priceRange.min} - ${estimate.priceRange.max}</div>
                          </div>
                          <div className="mb-5 pb-4 border-b border-gray-200">
                            <p className="text-gray-500 text-sm leading-relaxed">{estimate.summary}</p>
                          </div>
                          <button
                            onClick={() => handleNextStep()}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
                          >
                            Continue to Booking
                            <ArrowRight size={18} />
                          </button>
                          <p className="text-[10px] text-gray-400 text-center mt-4">* Final price confirmed on-site</p>
                        </div>
                      )}

                      {loadingState === LoadingState.ERROR && (
                        <div className="border-t border-b border-red-200 py-6 text-center">
                          <p className="text-red-600 text-sm mb-4">Failed to analyze photo</p>
                          <button
                            onClick={handleAnalyze}
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
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
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-2">Your Information</h2>
                    <p className="text-gray-500 text-sm">Tell us how to reach you and where to pick up</p>
                  </div>

                  {/* Contact fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Full Name *</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Smith"
                        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Email *</label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Phone *</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  {/* Address with autocomplete */}
                  <div ref={addressDropdownRef} className="relative">
                    <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">
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
                      className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                    />
                    {addressLoading && (
                      <Loader2 size={14} className="absolute right-3 top-[34px] animate-spin text-gray-400" />
                    )}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-sm shadow-sm max-h-48 overflow-y-auto">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => selectSuggestion(s)}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-2"
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
                    <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Apt / Unit / Suite <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      name="unitNumber"
                      value={formData.unitNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. Apt 4B, Suite 200"
                      className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">City *</label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Denver"
                        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">State *</label>
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="CO"
                        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Zip Code *</label>
                      <input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        placeholder="80202"
                        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border border-gray-300 text-gray-700 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
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
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight mb-2">Service Details</h2>
                    <p className="text-gray-500 text-sm">Choose your service type, date, and review your booking</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Service Type *</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
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
                      <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Preferred Date *</label>
                      <input
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">Additional Details</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us about the items you need removed, access instructions, etc."
                      className="w-full px-0 py-3 text-base bg-transparent border-0 border-b border-gray-200 rounded-none focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400"
                    />
                  </div>

                  {/* Review Section */}
                  <div className="border-t border-b border-gray-200 py-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Review</h3>
                    <div className="space-y-2 text-xs">
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
                    <div className="py-2">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border border-gray-300 text-gray-700 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft size={18} />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Confirm Booking'}
                      {!submitting && <CheckCircle size={18} />}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-4">
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
