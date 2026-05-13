import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Upload, Loader2, Camera, ScanSearch, CalendarCheck, Receipt, PackageCheck, ClipboardList, Truck, X, MapPin, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuoteEstimate, LoadingState } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { supabase } from '../lib/supabase';

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

  const SERVED_STATES_CITIES = [
    { states: ['TX'], cities: ['Dallas','Fort Worth','Plano','Arlington','Irving','Garland','Frisco','McKinney','Mesquite','Grand Prairie','Carrollton','Denton','Allen','Richardson','Lewisville','Grapevine','Flower Mound','Euless','Bedford','Hurst'] },
    { states: ['FL'], cities: ['Jacksonville','Jacksonville Beach','Neptune Beach','Atlantic Beach','Ponte Vedra','Orange Park','Fleming Island','Fernandina Beach','Yulee','St. Augustine','Green Cove Springs','Middleburg'] },
    { states: ['GA'], cities: ['Atlanta','Decatur','Sandy Springs','Marietta','Alpharetta','Smyrna','Roswell','Dunwoody','Kennesaw','Peachtree City','Norcross','Duluth','Lawrenceville','Brookhaven','East Point','College Park','Union City','Fayetteville','Woodstock','Cumming'] },
  ];

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
      const normState = state.trim().toUpperCase();
      const normCity = city.trim().toLowerCase();
      const served = SERVED_STATES_CITIES.some(
        (s) => s.states.includes(normState) && s.cities.some((c) => normCity.includes(c.toLowerCase()) || c.toLowerCase().includes(normCity))
      );
      setZipResult({ city, state, served });
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
      setCurrentStep(2); // skip ZIP + photo steps when coming from QuotePage
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
    if (currentStep < 4) setCurrentStep(currentStep + 1);
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

  const stepLabels = ['ZIP Check', 'Photo', 'Contact', 'Address', 'Details & Review'];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <PackageCheck size={26} className="text-brand" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-secondary mb-3">Booking Confirmed!</h2>
          {orderNumber && (
            <div className="mb-5 p-5 border border-secondary-100 rounded-xl bg-secondary-50/50">
              <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Your Order Number</p>
              <p className="text-xl font-mono font-black text-secondary">{orderNumber}</p>
              <p className="text-[11px] text-secondary-300 mt-1">Save this to track your order status</p>
            </div>
          )}
          <p className="text-secondary-400 text-sm mb-6 max-w-sm mx-auto">
            A matched provider will contact you within 15 minutes to confirm your appointment details.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => navigate('/track-order')}
              className="group px-6 py-3 bg-secondary text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-brand hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Track Order <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white text-secondary font-bold uppercase text-xs tracking-wider rounded-lg border border-secondary-200 hover:border-brand hover:text-brand transition-colors"
            >
              Return Home
            </button>
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Form Card */}
        <div className="md:border md:border-secondary-100 md:rounded-2xl md:p-8">

          {/* ═══ Step 0: ZIP Check ═══ */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 mb-2">
                <MapPin size={18} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-black text-secondary">Check Your ZIP Code</h2>
                  <p className="text-secondary-400 text-xs">We're currently serving Dallas-Fort Worth, Jacksonville FL, and Atlanta GA.</p>
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
                  className="px-5 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
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

              {zipResult && !zipResult.served && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pt-1">
                    <AlertCircle size={14} className="text-secondary-400 shrink-0" />
                    <span className="text-sm font-bold text-secondary">{zipResult.city}, {zipResult.state}</span>
                    <span className="text-xs text-secondary-400 ml-auto">Outside coverage</span>
                  </div>
                  <p className="text-xs text-secondary-400">We're not in your area yet, but you can still book and we'll be in touch.</p>
                  <button onClick={() => setCurrentStep(1)} className="w-full py-3 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center justify-center gap-2">
                    Continue Anyway <ArrowRight size={13} />
                  </button>
                </div>
              )}

              <p className="text-[10px] text-secondary-300 text-center pt-2">
                Currently serving Dallas-Fort Worth TX · Jacksonville FL · Atlanta GA
              </p>
            </div>
          )}

          {/* Estimate Summary (if available) */}
          {estimateData?.estimate && (
            <div className="border-b border-secondary-100 pb-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-[10px] font-medium text-secondary-400 uppercase tracking-wider mb-1">Estimated Price</p>
                <p className="text-2xl font-black text-secondary">${formData.priceRangeMin} – ${formData.priceRangeMax}</p>
                <p className="text-xs text-secondary-400 mt-0.5">{formData.estimatedVolume}</p>
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

          {/* NOTE: pre-fill from QuotePage skips to step 2 */}

          {/* ═══ Step 1: Photo Upload & Estimate ═══ */}
          {currentStep === 1 && (
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
                    className="w-full border border-secondary-100 hover:border-brand hover:bg-brand/5 transition-all p-6 rounded-xl text-left flex items-center gap-4 group"
                  >
                    <Camera size={22} className="text-brand shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-secondary mb-0.5">Take Photo</h3>
                      <p className="text-secondary-400 text-xs">Use your camera to capture the junk</p>
                    </div>
                    <ArrowRight size={16} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                    <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-secondary-100 hover:border-brand hover:bg-brand/5 transition-all p-6 rounded-xl text-left flex items-center gap-4 group"
                  >
                    <Upload size={22} className="text-secondary shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-secondary mb-0.5">Upload Photo</h3>
                      <p className="text-secondary-400 text-xs">Choose an existing photo from your device</p>
                    </div>
                    <ArrowRight size={16} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNextStep()}
                    className="w-full text-secondary-400 hover:text-brand transition-colors text-xs font-bold uppercase tracking-wider underline underline-offset-4 decoration-secondary-200 hover:decoration-brand py-2 inline-flex items-center justify-center gap-2"
                  >
                    Skip — I'll describe my items <ArrowRight size={12} />
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
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand/20">
                        <div>
                          <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Volume</div>
                          <div className="text-lg font-black text-secondary">{estimate.estimatedVolume}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Price Range</div>
                          <div className="text-lg font-black text-brand">${estimate.priceRange.min} – ${estimate.priceRange.max}</div>
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

          {/* ═══ Step 2: Contact Info ═══ */}
          {currentStep === 2 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="mb-2 flex items-start gap-3">
                <CalendarCheck size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <h2 className="text-base font-black text-secondary">Your Contact Details</h2>
                  <p className="text-secondary-400 text-xs">How should we reach you to confirm?</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Full Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Smith"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handlePrevStep} className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors rounded-lg flex items-center justify-center gap-2">
                  <ArrowLeft size={14} /> Back
                </button>
                <button type="submit" className="flex-1 py-4 text-xs font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-colors rounded-lg flex items-center justify-center gap-2">
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* ═══ Step 3: Address ═══ */}
          {currentStep === 3 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="mb-2 flex items-start gap-3">
                <MapPinned size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <h2 className="text-base font-black text-secondary">Pickup Address</h2>
                  <p className="text-secondary-400 text-xs">Where should we come to collect?</p>
                </div>
              </div>

              {/* Address with autocomplete */}
              <div ref={addressDropdownRef} className="relative">
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
                  <MapPinned size={11} className="inline mr-1" />
                  Service Address *
                </label>
                <input
                  value={addressQuery}
                  onChange={(e) => handleAddressInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  required
                  placeholder="Start typing an address..."
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                />
                {addressLoading && (
                  <Loader2 size={14} className="absolute right-3 top-[38px] animate-spin text-secondary-300" />
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectSuggestion(s)}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-secondary-50 transition-colors border-b border-secondary-100 last:border-b-0 flex items-start gap-2 text-secondary"
                      >
                        <MapPinned size={14} className="text-brand mt-0.5 shrink-0" />
                        <span>{s.display}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Unit number */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Apt / Unit / Suite <span className="text-secondary-300 font-normal normal-case">(optional)</span></label>
                <input
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. Apt 4B, Suite 200"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">City *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Dallas"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">State *</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="TX"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Zip Code *</label>
                  <input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    placeholder="75201"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handlePrevStep} className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors rounded-lg flex items-center justify-center gap-2">
                  <ArrowLeft size={14} /> Back
                </button>
                <button type="submit" className="flex-1 py-4 text-xs font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-colors rounded-lg flex items-center justify-center gap-2">
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

              {/* ═══ Step 4: Service Details & Review ═══ */}
              {currentStep === 4 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-2 flex items-start gap-3">
                    <ClipboardList size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                      <h2 className="text-base font-black text-secondary">Service Details</h2>
                      <p className="text-secondary-400 text-xs">Pick a service type and date, then review</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Service Type *</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                      >
                        <option>Residential Junk Removal</option>
                        <option>Commercial Services</option>
                        <option>Property Cleanout</option>
                        <option>Appliance Removal</option>
                        <option>Furniture Disposal</option>
                        <option>Yard Waste</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5"><CalendarCheck size={11} className="inline mr-1" /> Preferred Date *</label>
                      <input
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us about the items you need removed, access instructions, etc."
                      className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                    />
                  </div>

                  {/* Review Section */}
                  <div className="border border-secondary-100 bg-secondary-50/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Receipt size={14} className="text-brand" strokeWidth={2.5} />
                      <h3 className="text-[10px] font-bold text-secondary uppercase tracking-wider">Review Your Booking</h3>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between gap-4"><span className="text-secondary-400">Name</span><span className="font-bold text-secondary text-right">{formData.name}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-secondary-400">Email</span><span className="font-bold text-secondary text-right">{formData.email}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-secondary-400">Phone</span><span className="font-bold text-secondary text-right">{formData.phone}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-secondary-400">Address</span><span className="font-bold text-secondary text-right max-w-[60%]">{formData.address}{formData.unitNumber ? `, ${formData.unitNumber}` : ''}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-secondary-400">City / State / Zip</span><span className="font-bold text-secondary text-right">{[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-secondary-400">Service</span><span className="font-bold text-secondary text-right">{formData.serviceType}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-secondary-400">Date</span><span className="font-bold text-secondary text-right">{formData.date || '—'}</span></div>
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
                      className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-4 text-xs font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : <>Confirm Booking <Check size={14} strokeWidth={3} /></>}
                    </button>
                  </div>

                  <p className="text-xs text-secondary-300 text-center mt-3">
                    We'll match you with a provider who confirms within 15 minutes
                  </p>
                </form>
              )}

        </div>
      </div>
    </div>
  );
};
