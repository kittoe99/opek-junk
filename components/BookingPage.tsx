import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Upload, Loader2, Camera, ScanSearch, CalendarCheck, Receipt, PackageCheck, ClipboardList, Truck, X, MapPin, AlertCircle, CheckCircle2, Search, Package, Heart, Trash2, HeartHandshake, Armchair, BicepsFlexed } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuoteEstimate, LoadingState } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { supabase } from '../lib/supabase';
import { TrustBadges } from './TrustBadges';
import { BookingDetailsForm } from './BookingDetailsForm';

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
  const estimateData = location.state as { estimate?: QuoteEstimate; image?: string; serviceType?: string } | null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ZIP check state
  const [zipValue, setZipValue] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [zipResult, setZipResult] = useState<{ city: string; state: string; served: boolean } | null>(null);

  // Auto-advance on served ZIP
  useEffect(() => {
    if (zipResult?.served) {
      const t = setTimeout(() => setCurrentStep(1), 2000);
      return () => clearTimeout(t);
    }
  }, [zipResult]);

  const handleZipCheck = async () => {
    const zip = zipValue.trim();
    if (!/^\d{5}$/.test(zip)) { setZipError('Please enter a valid 5-digit ZIP code.'); return; }
    setZipLoading(true);
    setZipError(null);
    setZipResult(null);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) { setZipError('ZIP code not found. Please check and try again.'); setZipLoading(false); return; }
      const data = await res.json();
      const city = data.places?.[0]?.['place name'] ?? '';
      const state = data.places?.[0]?.['state abbreviation'] ?? '';
      // Nationwide coverage — any valid US ZIP is served
      setZipResult({ city, state, served: true });
    } catch {
      setZipError('Unable to verify ZIP code. Please try again.');
    } finally {
      setZipLoading(false);
    }
  };
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
    price: 0,
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
        price: est.price,
        estimateSummary: est.summary,
        photoUrl: img || '',
        details: `Items: ${est.itemsDetected.join(', ')}\nEstimated Volume: ${est.estimatedVolume}\nEstimated Price: $${est.price}`
      }));
      setCurrentStep(3); // skip ZIP, Service, and photo steps when coming from QuotePage
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
        price: result.price,
        estimateSummary: result.summary,
        photoUrl: image,
        details: `Items: ${result.itemsDetected.join(', ')}\nEstimated Volume: ${result.estimatedVolume}\nEstimated Price: $${result.price}`
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
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else setCurrentStep(0);
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
            price: formData.price,
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

  const stepLabels = ['ZIP Check', 'Service', 'Photo', 'Booking'];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand/5 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl shadow-secondary/5 border border-secondary-100 p-8 md:p-10 text-center">
            {/* Animated success icon */}
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
                <PackageCheck size={32} className="text-brand" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-[11px] font-bold text-brand uppercase tracking-widest">Booking Confirmed</p>
              <h2 className="text-2xl md:text-3xl font-black text-secondary">You're All Set!</h2>
              <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
                A matched provider will contact you within 15 minutes to confirm your appointment.
              </p>
            </div>

            {orderNumber && (
              <div className="mb-6 p-4 bg-secondary-50 rounded-xl border border-secondary-100">
                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-xl font-mono font-black text-secondary tracking-wider">{orderNumber}</p>
                <p className="text-[11px] text-secondary-400 mt-1">Save this to track your order</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/track-order')}
                className="flex-1 py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-brand transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Track Order <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3.5 border border-secondary-200 text-secondary font-bold uppercase text-xs tracking-wider rounded-xl hover:border-brand hover:text-brand transition-all duration-300"
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
          Schedule your <span className="text-brand">pickup.</span>
        </h1>
        <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
          Three quick steps — photo, address, details. A matched provider confirms within 15 minutes.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-8">
        {/* Form */}
        <div>

          {/* ═══ Step 0: ZIP Check ═══ */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 mb-2">
                <MapPin size={18} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-black text-secondary">Confirm Your ZIP Code</h2>
                  <p className="text-secondary-400 text-xs">Nationwide service in all 50 states.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zipValue}
                  onChange={(e) => { setZipValue(e.target.value.replace(/\D/g, '')); setZipError(null); setZipResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                  placeholder="Enter ZIP code"
                  className="flex-1 px-4 py-3 text-sm bg-secondary-50 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors font-mono tracking-wider"
                />
                <button
                  onClick={handleZipCheck}
                  disabled={zipValue.length !== 5 || zipLoading}
                  className="px-5 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {zipLoading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={16} /> Check</>}
                </button>
              </div>

              {zipError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{zipError}</p>
                </div>
              )}

              {zipResult?.served && (
                <div className="flex items-center gap-2 pt-1">
                  <Check size={14} className="text-brand shrink-0" strokeWidth={3} />
                  <span className="text-sm font-bold text-secondary">{zipResult.city}, {zipResult.state}</span>
                  <span className="text-xs text-secondary-400 ml-auto">Continuing...</span>
                </div>
              )}

              <p className="text-[10px] text-secondary-300 text-center pt-2">
                Nationwide coverage · Available in all 50 states
              </p>
            </div>
          )}

          {/* Estimate Summary (if available) */}
          {estimateData?.estimate && (
            <div className="border-b border-secondary-100 pb-6 mb-6">
              {/* Price breakdown */}
              <div className="bg-secondary-50 rounded-2xl p-5 border border-secondary-100 mb-4">
                <div className="space-y-3 mb-4 pb-4 border-b border-secondary-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-600 font-medium">Pick up & Admin fee</span>
                    <span className="text-secondary-900 font-bold">${Math.round(formData.price * 0.65)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-600 font-medium">Disposal & Landfill fee</span>
                    <span className="text-secondary-900 font-bold">${formData.price - Math.round(formData.price * 0.65)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</p>
                    <p className="text-xs text-secondary-500 mt-1">{formData.estimatedVolume}</p>
                  </div>
                  <p className="text-3xl font-black text-brand">${formData.price}</p>
                </div>
              </div>

              {formData.estimatedItems.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-medium text-secondary-400 uppercase tracking-wider mb-2">
                    {formData.estimatedItems.length} items
                  </p>
                  <div className="space-y-1">
                    {formData.estimatedItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm py-1">
                        <span className="text-secondary-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-secondary-500 leading-relaxed">{formData.estimateSummary}</p>
            </div>
          )}

          {/* Step Indicator — only show on steps 1+ */}
          {currentStep > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {stepLabels.slice(1).map((label, i) => {
                const step = i + 1;
                return (
                  <span key={label} className={`text-[10px] font-black uppercase tracking-wider transition-colors ${
                    currentStep > step ? 'text-brand' : currentStep === step ? 'text-secondary' : 'text-secondary-300'
                  }`}>
                    {currentStep > step ? <Check size={11} className="inline mb-0.5 mr-0.5" strokeWidth={3} /> : null}{label}
                  </span>
                );
              })}
            </div>
            <div className="relative h-1.5 bg-secondary-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-brand rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (stepLabels.length - 2)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-secondary-400 mt-1.5">Step {currentStep} of {stepLabels.length - 1}</p>
          </div>
          )}

          {/* NOTE: pre-fill from QuotePage skips to step 3 */}

          {/* ═══ Step 1: Service Selection ═══ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="mb-2 flex items-start gap-3">
                <ClipboardList size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <h2 className="text-base font-black text-secondary">Select Service</h2>
                  <p className="text-secondary-400 text-xs">What kind of help do you need?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, serviceType: 'Junk Removal' }));
                    handleNextStep();
                  }}
                  className={`w-full bg-white border ${formData.serviceType === 'Junk Removal' ? 'border-brand shadow-md shadow-brand/5' : 'border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5'} transition-all p-5 rounded-2xl text-left flex items-center gap-4 group`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.serviceType === 'Junk Removal' ? 'bg-brand/10 text-brand' : 'bg-secondary-50 text-secondary group-hover:bg-brand/10 group-hover:text-brand'}`}>
                    <Armchair size={22} className="transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm md:text-base font-black mb-0.5 transition-colors ${formData.serviceType === 'Junk Removal' ? 'text-brand' : 'text-secondary group-hover:text-brand'}`}>Junk Removal</h3>
                    <p className="text-secondary-400 text-xs md:text-sm">We haul away your unwanted items</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${formData.serviceType === 'Junk Removal' ? 'border-brand bg-brand' : 'border-secondary-100 group-hover:border-brand group-hover:bg-brand'}`}>
                    <ArrowRight size={14} className={`transition-all ${formData.serviceType === 'Junk Removal' ? 'text-white translate-x-0.5' : 'text-secondary-300 group-hover:text-white group-hover:translate-x-0.5'}`} />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, serviceType: 'Donation Pick Up' }));
                    handleNextStep();
                  }}
                  className={`w-full bg-white border ${formData.serviceType === 'Donation Pick Up' ? 'border-brand shadow-md shadow-brand/5' : 'border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5'} transition-all p-5 rounded-2xl text-left flex items-center gap-4 group`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.serviceType === 'Donation Pick Up' ? 'bg-brand/10 text-brand' : 'bg-secondary-50 text-secondary group-hover:bg-brand/10 group-hover:text-brand'}`}>
                    <HeartHandshake size={22} className="transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm md:text-base font-black mb-0.5 transition-colors ${formData.serviceType === 'Donation Pick Up' ? 'text-brand' : 'text-secondary group-hover:text-brand'}`}>Donation Pick Up</h3>
                    <p className="text-secondary-400 text-xs md:text-sm">We deliver gently used items to local charities</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${formData.serviceType === 'Donation Pick Up' ? 'border-brand bg-brand' : 'border-secondary-100 group-hover:border-brand group-hover:bg-brand'}`}>
                    <ArrowRight size={14} className={`transition-all ${formData.serviceType === 'Donation Pick Up' ? 'text-white translate-x-0.5' : 'text-secondary-300 group-hover:text-white group-hover:translate-x-0.5'}`} />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, serviceType: 'Moving Labor' }));
                    handleNextStep();
                  }}
                  className={`w-full bg-white border ${formData.serviceType === 'Moving Labor' ? 'border-brand shadow-md shadow-brand/5' : 'border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5'} transition-all p-5 rounded-2xl text-left flex items-center gap-4 group`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.serviceType === 'Moving Labor' ? 'bg-brand/10 text-brand' : 'bg-secondary-50 text-secondary group-hover:bg-brand/10 group-hover:text-brand'}`}>
                    <BicepsFlexed size={22} className="transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm md:text-base font-black mb-0.5 transition-colors ${formData.serviceType === 'Moving Labor' ? 'text-brand' : 'text-secondary group-hover:text-brand'}`}>Moving Labor</h3>
                    <p className="text-secondary-400 text-xs md:text-sm">Hourly labor for heavy lifting</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${formData.serviceType === 'Moving Labor' ? 'border-brand bg-brand' : 'border-secondary-100 group-hover:border-brand group-hover:bg-brand'}`}>
                    <ArrowRight size={14} className={`transition-all ${formData.serviceType === 'Moving Labor' ? 'text-white translate-x-0.5' : 'text-secondary-300 group-hover:text-white group-hover:translate-x-0.5'}`} />
                  </div>
                </button>
              </div>
              
              <div className="pt-4 flex">
                <button type="button" onClick={handlePrevStep} className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors rounded-lg flex items-center justify-center gap-2">
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </div>
          )}

          {/* ═══ Step 2: Photo Upload & Estimate ═══ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-2 flex items-start gap-3">
                <ScanSearch size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <h2 className="text-base font-black text-secondary">AI Photo Estimate</h2>
                  <p className="text-secondary-400 text-xs">Snap a photo for instant volume + price detection</p>
                </div>
              </div>

              {!image ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 transition-all p-5 rounded-2xl text-left flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-secondary-50 group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                      <Camera size={22} className="text-secondary group-hover:text-brand transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-black text-secondary mb-0.5 group-hover:text-brand transition-colors">Take Photo</h3>
                      <p className="text-secondary-400 text-xs md:text-sm">Use your camera to capture the junk</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                      <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </div>
                    <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 transition-all p-5 rounded-2xl text-left flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-secondary-50 group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                      <Upload size={22} className="text-secondary group-hover:text-brand transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-black text-secondary mb-0.5 group-hover:text-brand transition-colors">Upload Photo</h3>
                      <p className="text-secondary-400 text-xs md:text-sm">Choose an existing photo from your device</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                      <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/quote', { state: { zipResult, zipValue, serviceType: formData.serviceType } })}
                    className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 transition-all p-5 rounded-2xl text-left flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-secondary-50 group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                      <ClipboardList size={22} className="text-secondary group-hover:text-brand transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-black text-secondary mb-0.5 group-hover:text-brand transition-colors">Select Items</h3>
                      <p className="text-secondary-400 text-xs md:text-sm">Browse and select items manually for a quote</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                      <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNextStep()}
                    className="w-full text-secondary-400 hover:text-brand transition-colors text-xs font-bold uppercase tracking-wider underline underline-offset-4 decoration-secondary-200 hover:decoration-brand py-2 inline-flex items-center justify-center gap-2"
                  >
                    Skip — Continue without estimate <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative border border-secondary-100 rounded-xl overflow-hidden">
                    <img src={image} alt="Upload" className="w-full" />
                    {loadingState !== LoadingState.ANALYZING && (
                      <button
                        onClick={() => { setImage(null); setEstimate(null); setLoadingState(LoadingState.IDLE); }}
                        className="absolute top-3 right-3 bg-white text-secondary px-3 py-1.5 text-xs font-bold shadow-lg hover:text-brand transition-colors rounded-lg inline-flex items-center gap-1"
                      >
                        <X size={12} /> Change
                      </button>
                    )}
                  </div>

                  {loadingState === LoadingState.IDLE && (
                    <button
                      onClick={handleAnalyze}
                      className="group w-full py-3.5 text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-brand hover:shadow-lg text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                    >
                      <ScanSearch size={14} className="transition-transform duration-300 group-hover:scale-110" /> Analyze Photo
                    </button>
                  )}

                  {loadingState === LoadingState.ANALYZING && (
                    <div className="py-8 text-center">
                      <Loader2 size={36} className="animate-spin mx-auto mb-3 text-brand" />
                      <p className="text-secondary-400 text-sm">Analyzing your photo...</p>
                    </div>
                  )}

                  {loadingState === LoadingState.SUCCESS && estimate && (
                    <div className="border border-brand/20 bg-brand/5 p-5 rounded-xl">
                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Items Detected</div>
                        <ul className="space-y-1.5">
                          {estimate.itemsDetected.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check size={14} className="text-brand mt-0.5 shrink-0" strokeWidth={3} />
                              <span className="text-secondary-600 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-brand/10 mb-4">
                        <div className="space-y-2 mb-3 pb-3 border-b border-secondary-100">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-secondary-600 font-medium">Pick up & Admin fee</span>
                            <span className="text-secondary-900 font-bold">${Math.round(estimate.price * 0.65)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-secondary-600 font-medium">Disposal & Landfill fee</span>
                            <span className="text-secondary-900 font-bold">${estimate.price - Math.round(estimate.price * 0.65)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</div>
                            <div className="text-xs text-secondary-500 mt-0.5">{estimate.estimatedVolume}</div>
                          </div>
                          <div className="text-2xl font-black text-brand">${estimate.price}</div>
                        </div>
                      </div>
                      <p className="text-secondary-600 text-xs leading-relaxed mt-4 mb-4">{estimate.summary}</p>
                      <button
                        onClick={() => handleNextStep()}
                        className="group w-full py-3.5 text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-brand hover:shadow-lg text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                      >
                        Continue to Booking <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </button>
                      <p className="text-[10px] text-secondary-300 text-center mt-3">* Final price confirmed on-site</p>
                    </div>
                  )}

                  {loadingState === LoadingState.ERROR && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <p className="text-red-700 text-sm font-bold mb-3">Failed to analyze photo</p>
                      <button
                        onClick={handleAnalyze}
                        className="px-5 py-2 bg-secondary text-white font-bold uppercase text-xs hover:bg-brand transition-colors rounded-lg"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══ Step 3+: Contact + Address + Review (shared form) ═══ */}
          {currentStep >= 3 && (
            <BookingDetailsForm
              estimate={estimate}
              image={image}
              serviceType={formData.serviceType}
              defaultZip={zipResult ? { city: zipResult.city, state: zipResult.state, zipCode: zipValue } : undefined}
              onBack={() => setCurrentStep(2)}
              backLabel="Back"
            />
          )}

        </div>
      </div>
      <div>
        <TrustBadges />
      </div>
    </div>
  );
};
