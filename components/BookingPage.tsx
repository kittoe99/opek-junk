import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Upload, Loader2, Camera, ScanSearch, CalendarCheck, Receipt, PackageCheck, ClipboardList, Truck, X, MapPin, AlertCircle, CheckCircle2, Search, Package, Heart, Trash2, HeartHandshake, Armchair, Container, Clock, Plus, Minus, Warehouse, Home, Boxes, PackagePlus, PackageMinus, ArrowLeftRight, ShieldCheck, Sliders, Sparkles, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JunkIcon, MovingLaborIcon, DumpsterIcon, LoadingIcon, UnloadingIcon, LoadingUnloadingIcon, StorageUnitIcon, BoxTruckIcon, InsideHomeIcon, OtherMoveIcon, TwoHelpersIcon, ThreeHelpersIcon, PhotoEstimateIcon, ManualEntryIcon, InputZipIcon } from './icons/ServiceIcons';
import { QuoteEstimate, LoadingState } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { calculateDumpsterRentalPrice, DumpsterRentalOptions, calculateMovingLaborPrice } from '../services/pricingService';
import { supabase, sendConfirmationEmail, uploadBookingPhoto } from '../lib/supabase';
import { TrustBadges } from './TrustBadges';
import { BookingDetailsForm } from './BookingDetailsForm';
import { ContactIntakeForm } from './shared/ContactIntakeForm';
import { BookingSuccessView } from './shared/BookingSuccessView';

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
  const rawServiceType = estimateData?.serviceType;
  const initialServiceType = rawServiceType
    ? (rawServiceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
      : rawServiceType.toLowerCase().includes('moving') ? 'Moving Labor'
      : rawServiceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
      : 'Junk Removal')
    : 'Junk Removal';
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

  // Dumpster Rental State
  const [dumpsterSize, setDumpsterSize] = useState<'10-yard' | '15-yard' | '20-yard' | '30-yard'>('20-yard');
  const [dumpsterDuration, setDumpsterDuration] = useState<number>(7);
  const [dumpsterStep, setDumpsterStep] = useState<'size' | 'duration' | 'result'>('size');

  // Moving Labor State
  const [movingServiceType, setMovingServiceType] = useState<'Loading Only' | 'Unloading Only' | 'Both'>('Both');
  const [movingType, setMovingType] = useState<'Storage Unit' | 'Box Truck' | 'Inside Home' | 'Other'>('Inside Home');
  const [movingHelpers, setMovingHelpers] = useState<2 | 3>(2);
  const [movingHours, setMovingHours] = useState<number>(2);
  const [movingStep, setMovingStep] = useState<'service' | 'type' | 'crew' | 'result'>('service');
  const [movingPricingLoading, setMovingPricingLoading] = useState(false);
  const [movingPricingError, setMovingPricingError] = useState<string | null>(null);

  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
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
    serviceType: initialServiceType,
    details: '',
    estimatedItems: [] as string[],
    estimatedVolume: '',
    price: 0,
    estimateSummary: '',
    photoUrl: ''
  });

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [partialBookingId, setPartialBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (formData.serviceType !== 'Moving Labor') {
      setMovingStep('service');
    }
  }, [formData.serviceType]);

  // Pre-fill estimate data if available from QuotePage
  useEffect(() => {
    if (estimateData?.estimate) {
      const { estimate: est, image: img, serviceType } = estimateData;
      setEstimate(est);
      setImage(img || null);
      setLoadingState(LoadingState.SUCCESS);
      
      const prefName = (estimateData as any).prefilledName || '';
      const prefPhone = (estimateData as any).prefilledPhone || '';
      const partId = (estimateData as any).partialBookingId || null;

      if (prefName) setContactName(prefName);
      if (prefPhone) setContactPhone(prefPhone);
      if (partId) setPartialBookingId(partId);
      if (prefName && prefPhone) setContactSubmitted(true);

      const normalizedService = serviceType
        ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
          : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
          : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
          : 'Junk Removal')
        : 'Junk Removal';

      setFormData(prev => ({
        ...prev,
        name: prefName,
        phone: prefPhone,
        serviceType: normalizedService,
        estimatedItems: est.itemsDetected,
        estimatedVolume: est.estimatedVolume,
        price: est.price,
        estimateSummary: est.summary,
        photoUrl: img || '',
        details: `Items: ${est.itemsDetected.join(', ')}\nEstimated Volume: ${est.estimatedVolume}\nEstimated Price: $${est.price}`
      }));
      setCurrentStep(normalizedService === 'Junk Removal' ? 2 : 3); // skip ZIP, Service, and photo steps when coming from QuotePage
    }
  }, [estimateData]);

  const handleContactReveal = async (name: string, phone: string, est: QuoteEstimate) => {
    setContactLoading(true);
    try {
      const detailsText = `Items: ${est.itemsDetected.join(', ')}\nEstimated Volume: ${est.estimatedVolume}\nEstimated Price: $${est.price}`;

      let partialId = `mock-lead-${Date.now()}`;
      try {
        let uploadedUrl = image || '';
        if (uploadedUrl && uploadedUrl.startsWith('data:')) {
          const fileName = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
          const publicUrl = await uploadBookingPhoto(uploadedUrl, fileName);
          if (publicUrl) {
            uploadedUrl = publicUrl;
            setImage(publicUrl);
          }
        }

        const customerInfo = {
          name,
          phone,
          email: ''
        };

        const bookingDetails = {
          service_type: formData.serviceType,
          zip_code: zipValue || null,
          details: detailsText,
          estimated_items: est.itemsDetected,
          estimated_volume: est.estimatedVolume,
          price: est.price,
          estimate_summary: est.summary,
          photo_url: uploadedUrl
        };

        const { data, error: dbError } = await supabase
          .from('Prebooking')
          .insert([
            {
              customer_info: customerInfo,
              booking_details: bookingDetails,
              status: 'partially_submitted'
            }
          ])
          .select('id')
          .single();

        if (dbError) {
          console.warn('Supabase lead capture failed in BookingPage, proceeding in mock mode:', dbError);
        } else if (data?.id) {
          partialId = data.id;
        }
      } catch (err) {
        console.warn('Supabase lead capture failed in BookingPage, proceeding in mock mode:', err);
      }

      setPartialBookingId(partialId);
      setContactName(name);
      setContactPhone(phone);
      setFormData(prev => ({ ...prev, name, phone }));
      setContactSubmitted(true);
    } catch (err) {
      console.error('Error in handleContactReveal in BookingPage:', err);
      setContactName(name);
      setContactPhone(phone);
      setFormData(prev => ({ ...prev, name, phone }));
      setContactSubmitted(true);
    } finally {
      setContactLoading(false);
    }
  };

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
      const customerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      const locationInfo = {
        address: formData.address,
        unit_number: formData.unitNumber || null,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      };

      const bookingDetails = {
        service_type: formData.serviceType,
        preferred_date: formData.date,
        details: formData.details,
        estimated_items: formData.estimatedItems,
        estimated_volume: formData.estimatedVolume,
        price: formData.price,
        estimate_summary: formData.estimateSummary,
        photo_url: formData.photoUrl
      };

      const generatedOrderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { data: insertedData, error: insertError } = await supabase
        .from('bookings')
        .insert([
          {
            order_number: generatedOrderNumber,
            customer_info: customerInfo,
            location_info: locationInfo,
            booking_details: bookingDetails,
            status: 'pending'
          }
        ])
        .select('order_number')
        .single();

      if (insertError) throw insertError;
      
      const finalOrderNumber = insertedData?.order_number || generatedOrderNumber;
      if (insertedData?.order_number) setOrderNumber(insertedData.order_number);

      // Trigger booking confirmation email
      sendConfirmationEmail('booking', {
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
        price: formData.price || null,
        order_number: finalOrderNumber
      }).catch(err => console.warn('Failed to send booking confirmation email:', err));

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting booking:', err);
      setError(err.message || 'Failed to submit booking. Please try again.');
      setSubmitting(false);
    }
  };

  const stepLabels = formData.serviceType === 'Junk Removal'
    ? ['ZIP Check', 'Service', 'Booking']
    : [
        'ZIP Check', 
        'Service', 
        formData.serviceType === 'Moving Labor' ? 'Options' : formData.serviceType === 'Dumpster Rental' ? 'Options' : 'Photo', 
        'Booking'
      ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand/5 to-white flex items-center justify-center px-4 py-12 md:py-24 animate-fade-in">
        <BookingSuccessView
          orderNumber={orderNumber}
          serviceType={formData.serviceType}
          name={formData.name}
          phone={formData.phone}
          email={formData.email}
          address={formData.address}
          unitNumber={formData.unitNumber}
          city={formData.city}
          state={formData.state}
          zipCode={formData.zipCode}
          date={formData.date}
          details={formData.details}
          price={formData.price}
          itemsDetected={formData.estimatedItems}
          estimatedVolume={formData.estimatedVolume}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep === 2 && formData.serviceType === 'Moving Labor' ? (
          movingStep !== 'result' ? (
            <>
              <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">
                Book <span className="text-brand">moving labor.</span>
              </h1>
              <p className="text-sm text-secondary-400">
                Professional heavy-lifting assistance. 2-hour minimum applies.
              </p>
            </>
          ) : null
        ) : (
          <>
            <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">
              Schedule your <span className="text-brand">{formData.serviceType === 'Moving Labor' ? 'service' : 'pickup'}.</span>
            </h1>
            <p className="text-sm text-secondary-400">
              Four quick steps — contact, schedule, address, review, and deposit. A matched provider confirms within 15 minutes.
            </p>
          </>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Form */}
        <div>

          {/* ═══ Step 0: ZIP Check ═══ */}
          {currentStep === 0 && (
            <div className="max-w-md mx-auto space-y-6 animate-fade-in">
              <div className="text-center space-y-2 mb-8">
                <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
                  <MapPin className="w-6 h-6 text-brand" />
                </div>
                <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Confirm Your ZIP Code</h2>
                <p className="text-secondary-400 text-xs">Nationwide service in all 50 states.</p>
              </div>

              <div className="relative group flex items-center bg-white border border-secondary-100 hover:border-brand/40 hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 focus-within:shadow-[0_4px_20px_rgba(255,0,110,0.15)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 mb-4 p-1 rounded-xl w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zipValue}
                  onChange={(e) => { setZipValue(e.target.value.replace(/\D/g, '')); setZipError(null); setZipResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                  placeholder="Enter ZIP code"
                  className="flex-1 px-4 py-2.5 text-base bg-transparent border-none text-secondary placeholder:text-secondary-300 focus:outline-none font-mono tracking-wider"
                  style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                />
                <button
                  onClick={handleZipCheck}
                  disabled={zipValue.length !== 5 || zipLoading}
                  className="px-5 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 shrink-0 rounded-lg"
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
              <div className="bg-white rounded-2xl p-5 border border-secondary-100 mb-4">
                {formData.serviceType !== 'Moving Labor' && formData.serviceType !== 'Dumpster Rental' && (
                  <div className="space-y-3 mb-4 pb-4 border-b border-secondary-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary-600 font-medium">Pick up & Admin fee</span>
                      <span className="text-secondary-900 font-bold">${Math.round(formData.price * 0.65)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-secondary-600 font-medium">Disposal & Landfill fee</span>
                      <span className="text-secondary-900 font-bold">${formData.price - Math.round(formData.price * 0.65)}</span>
                    </div>
                  </div>
                )}
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
                    navigate('/quote', { 
                      state: { 
                        zipResult: zipResult ? { city: zipResult.city, state: zipResult.state } : null, 
                        zipValue, 
                        serviceType: 'Junk Removal' 
                      } 
                    });
                  }}
                  className={`w-full bg-white border ${formData.serviceType === 'Junk Removal' ? 'border-brand shadow-md shadow-brand/5 scale-[1.01]' : 'border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 hover:scale-[1.01]'} transition-all p-4 rounded-2xl text-left flex items-center gap-4 group`}
                >
                  <div className="w-14 h-14 shrink-0 text-secondary-400 group-hover:text-secondary-900 transition-colors ml-1">
                    <JunkIcon className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm md:text-base font-black mb-0.5 transition-colors ${formData.serviceType === 'Junk Removal' ? 'text-brand' : 'text-secondary group-hover:text-brand'}`}>Junk Removal</h3>
                    <p className="text-secondary-400 text-xs md:text-sm">Service providers haul away your unwanted items</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                    <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, serviceType: 'Moving Labor' }));
                    handleNextStep();
                  }}
                  className={`w-full bg-white border ${formData.serviceType === 'Moving Labor' ? 'border-brand shadow-md shadow-brand/5 scale-[1.01]' : 'border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 hover:scale-[1.01]'} transition-all p-4 rounded-2xl text-left flex items-center gap-4 group`}
                >
                  <div className="w-14 h-14 shrink-0 text-secondary-400 group-hover:text-secondary-900 transition-colors ml-1">
                    <MovingLaborIcon className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm md:text-base font-black mb-0.5 transition-colors ${formData.serviceType === 'Moving Labor' ? 'text-brand' : 'text-secondary group-hover:text-brand'}`}>Moving Labor</h3>
                    <p className="text-secondary-400 text-xs md:text-sm">Hourly labor for heavy lifting</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                    <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                  </div>
                </button>

                <button
                  disabled
                  type="button"
                  className="w-full bg-white border border-secondary-100 p-4 rounded-2xl text-left flex items-center gap-4 cursor-not-allowed opacity-60"
                >
                  <div className="w-14 h-14 shrink-0 text-secondary-400 grayscale opacity-60 ml-1">
                    <DumpsterIcon className="w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm md:text-base font-black text-secondary-500">Dumpster Rental</h3>
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-secondary-100 text-secondary-500 rounded-full">Coming Soon</span>
                    </div>
                    <p className="text-secondary-400 text-xs md:text-sm">Roll-off container delivered to your site</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-secondary-100 flex items-center justify-center bg-white text-secondary-300">
                    <ArrowRight size={14} />
                  </div>
                </button>
              </div>
              
              <div className="pt-4 flex">
                <button type="button" onClick={handlePrevStep} className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-lg flex items-center justify-center gap-2">
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </div>
          )}

          {/* ═══ Step 2: Photo Upload & Estimate (Junk Removal / Donation Pick Up) ═══ */}
          {currentStep === 2 && formData.serviceType !== 'Dumpster Rental' && formData.serviceType !== 'Moving Labor' && formData.serviceType !== 'Junk Removal' && (
            <div className="space-y-4">
              <div className="mb-2 flex items-start gap-3">
                <ScanSearch size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <h2 className="text-base font-black text-secondary">Photo Estimate</h2>
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
                    <div className="w-12 h-12 bg-white group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
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
                    <div className="w-12 h-12 bg-white group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                      <PhotoEstimateIcon size={24} className="text-secondary group-hover:text-brand transition-colors" />
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
                    <div className="w-12 h-12 bg-white group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                      <ManualEntryIcon size={24} className="text-secondary group-hover:text-brand transition-colors" />
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
                  <div className="overflow-hidden">
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
                    !contactSubmitted ? (
                      <div className="max-w-md mx-auto">
                        <ContactIntakeForm
                          serviceType={formData.serviceType}
                          isLoading={contactLoading}
                          onReveal={async (name, phone) => {
                            await handleContactReveal(name, phone, estimate);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="border border-brand/20 bg-brand/5 p-5 rounded-xl">
                        {/* Elegant Shrunk Image Service Card */}
                        <div className="bg-white border border-secondary-100 rounded-xl p-3 flex items-center gap-3.5 mb-4 shadow-sm">
                          <div className="w-20 h-16 shrink-0">
                            <img 
                              src={formData.serviceType === 'Donation Pick Up' ? '/opek-nav.svg' : '/process-step-1.svg'} 
                              alt="Service" 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 bg-brand/10 text-brand text-[8px] font-black uppercase tracking-wider rounded border border-brand/20">
                                Instant Estimate
                              </span>
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-wider rounded border border-emerald-100">
                                Guaranteed
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-secondary mt-1">{formData.serviceType}</h4>
                            <p className="text-secondary-400 text-[10px] mt-0.5 leading-normal">{estimate.estimatedVolume}</p>
                          </div>
                        </div>
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
                        {/* Safe Protect Sticker */}
                        <div className="bg-emerald-50 border border-emerald-100/80 rounded-2xl p-4 flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
                            <ShieldCheck size={18} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-black text-emerald-950">Safe Protect™ Included</p>
                              <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Covered</span>
                            </div>
                            <p className="text-[11px] text-emerald-700 mt-1 leading-normal">
                              All bookings are covered by platform damage protection.{' '}
                              <button 
                                type="button"
                                onClick={() => setShowInsuranceModal(true)} 
                                className="text-emerald-900 font-bold hover:underline"
                              >
                                Learn more
                              </button>
                            </p>
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
                    )
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

          {/* ═══ Step 2: Dumpster Rental Flow ═══ */}
          {currentStep === 2 && formData.serviceType === 'Dumpster Rental' && (
            <div className="space-y-4">
              <div className="mb-2 flex items-start gap-3">
                <Container size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <h2 className="text-base font-black text-secondary">Dumpster Rental Options</h2>
                  <p className="text-secondary-400 text-xs">Select size and rental duration</p>
                </div>
              </div>

              {/* SIZE SELECTION */}
              {dumpsterStep === 'size' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-secondary-400 uppercase tracking-wider mb-3">Select Dumpster Size</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: '10-Yard', desc: 'Small projects, garage cleanouts', price: '$350' },
                        { label: '15-Yard', desc: 'Medium renovations, yard debris', price: '$400' },
                        { label: '20-Yard', desc: 'Large cleanouts, roofing', price: '$450' },
                        { label: '30-Yard', desc: 'Construction, major demolition', price: '$550' }
                      ].map((size) => {
                        const isSelected = dumpsterSize === `${size.label.toLowerCase()}` as any;
                        return (
                          <button
                            key={size.label}
                            onClick={() => setDumpsterSize(`${size.label.toLowerCase()}` as any)}
                            className={`group p-4 border rounded-xl flex items-start gap-3 transition-all duration-200 w-full text-left ${
                              isSelected 
                                ? 'border-brand bg-white' 
                                : 'border-secondary-100 bg-white hover:border-secondary-300'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                              isSelected ? 'border-brand bg-brand' : 'border-secondary-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <Container size={16} className={`shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-brand' : 'text-secondary-400'}`} />
                            <div>
                              <span className="block text-sm font-semibold text-secondary transition-colors">
                                {size.label}
                              </span>
                              <span className="block text-[11px] mt-0.5 font-normal text-secondary-400 leading-normal">
                                {size.desc}
                              </span>
                              <span className="block text-xs mt-1.5 font-semibold text-brand">
                                {size.price} / 7 days
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setDumpsterStep('duration')}
                      className="group w-full py-3.5 text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-brand text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* DURATION SELECTION */}
              {dumpsterStep === 'duration' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-secondary-400 uppercase tracking-wider mb-3">Rental Duration</label>
                    <div className="flex items-center justify-between p-4 bg-white border border-secondary-100 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-secondary">
                          <CalendarCheck size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-secondary">Rental Period</div>
                          <div className="text-[10px] text-secondary-400 font-bold">{dumpsterDuration} day{dumpsterDuration > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-white border border-secondary-100 rounded-xl p-1.5 w-max">
                        <button
                          onClick={() => setDumpsterDuration(d => Math.max(1, d - 1))}
                          disabled={dumpsterDuration <= 1}
                          className="w-10 h-10 rounded-lg bg-white text-secondary hover:text-brand hover:border-brand border border-transparent shadow-sm disabled:opacity-50 disabled:hover:border-transparent disabled:hover:text-secondary flex items-center justify-center transition-all"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <span className="w-8 text-center text-lg font-black text-brand">{dumpsterDuration}</span>
                        <button
                          onClick={() => setDumpsterDuration(d => Math.min(30, d + 1))}
                          className="w-10 h-10 rounded-lg bg-white text-secondary hover:text-brand hover:border-brand border border-transparent shadow-sm flex items-center justify-center transition-all"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-secondary-400 mt-2">
                      Base rate includes 7 days. Extra days: $25/day. 14+ day rentals get 10% discount.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={async () => {
                        try {
                          const dumpsterPrice = await calculateDumpsterRentalPrice({ size: dumpsterSize, duration: dumpsterDuration });
                          setEstimate({
                            itemsDetected: [`${dumpsterSize} dumpster rental - ${dumpsterDuration} days`],
                            estimatedVolume: dumpsterPrice.estimatedVolume,
                            price: dumpsterPrice.price,
                            summary: dumpsterPrice.summary
                          });
                          setFormData(prev => ({
                            ...prev,
                            estimatedItems: [`${dumpsterSize} dumpster rental - ${dumpsterDuration} days`],
                            estimatedVolume: dumpsterPrice.estimatedVolume,
                            price: dumpsterPrice.price,
                            estimateSummary: dumpsterPrice.summary,
                            details: `${dumpsterSize} dumpster rental for ${dumpsterDuration} days. ${dumpsterPrice.summary}`
                          }));
                          setDumpsterStep('result');
                        } catch (err) {
                          console.error('Failed to get dumpster price:', err);
                        }
                      }}
                      className="group w-full py-3.5 text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-brand text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                    >
                      Get Estimate <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                    <button
                      onClick={() => setDumpsterStep('size')}
                      className="w-full py-2 mt-4 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={14} /> Back to size
                    </button>
                  </div>
                </div>
              )}

              {/* ESTIMATE RESULT */}
              {dumpsterStep === 'result' && estimate && (
                !contactSubmitted ? (
                  <div className="max-w-md mx-auto">
                    <ContactIntakeForm
                      serviceType={formData.serviceType}
                      isLoading={contactLoading}
                      onReveal={async (name, phone) => {
                        await handleContactReveal(name, phone, estimate);
                      }}
                    />
                  </div>
                ) : (
                  <div className="border border-brand/20 bg-brand/5 p-5 rounded-xl">
                    {/* Elegant Shrunk Image Service Card */}
                    <div className="bg-white border border-secondary-100 rounded-xl p-3 flex items-center gap-3.5 mb-4 shadow-sm">
                      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-secondary-100 relative">
                        <img 
                          src="/dumpster-rental.svg" 
                          alt="Dumpster Rental" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 bg-brand/10 text-brand text-[8px] font-black uppercase tracking-wider rounded border border-brand/20">
                            Instant Estimate
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-wider rounded border border-emerald-100">
                            Guaranteed
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-secondary mt-1">Dumpster Rental</h4>
                        <p className="text-secondary-400 text-[10px] mt-0.5 leading-normal">{estimate.estimatedVolume}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Rental Details</div>
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
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</div>
                          <div className="text-xs text-secondary-500 mt-0.5">{estimate.estimatedVolume}</div>
                        </div>
                        <div className="text-2xl font-black text-brand">${estimate.price}</div>
                      </div>
                    </div>
                    {/* Safe Protect Sticker */}
                    <div className="bg-emerald-50 border border-emerald-100/80 rounded-2xl p-4 flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-emerald-950">Safe Protect™ Included</p>
                          <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Covered</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 mt-1 leading-normal">
                          All bookings are covered by platform damage protection.{' '}
                          <button 
                            type="button"
                            onClick={() => setShowInsuranceModal(true)} 
                            className="text-emerald-900 font-bold hover:underline"
                          >
                            Learn more
                          </button>
                        </p>
                      </div>
                    </div>
                    <p className="text-secondary-600 text-xs leading-relaxed mt-4 mb-4">{estimate.summary}</p>
                    <button
                      onClick={() => handleNextStep()}
                      className="group w-full py-3.5 text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-brand hover:shadow-lg text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                    >
                      Continue to Booking <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                    <button
                      onClick={() => setDumpsterStep('duration')}
                      className="w-full py-2 mt-4 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={14} /> Back to duration
                    </button>
                  </div>
                )
              )}
            </div>
          )}

          {/* ═══ Step 2: Moving Labor Flow ═══ */}
          {currentStep === 2 && formData.serviceType === 'Moving Labor' && (
            <div className="space-y-8 pb-24">

              {/* STEP 1: SERVICE SELECTION */}
              {movingStep === 'service' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2.5">Service Selection</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { label: 'Loading Only', desc: 'Pack a rental truck, container, or storage unit' },
                        { label: 'Unloading Only', desc: 'Unpack into your new home, office, or storage' },
                        { label: 'Both', desc: 'Help with both loading and unloading' }
                      ].map((service) => {
                        const isSelected = movingServiceType === service.label;
                        return (
                          <button
                            key={service.label}
                            type="button"
                            onClick={() => setMovingServiceType(service.label as typeof movingServiceType)}
                            className={`group p-4 border rounded-xl flex items-start gap-3 transition-all duration-200 w-full text-left bg-white ${
                              isSelected
                                ? 'border-brand bg-white ring-1 ring-brand/10'
                                : 'border-secondary-100 bg-white hover:border-brand/40'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isSelected ? 'border-brand bg-brand border-brand' : 'border-secondary-200 group-hover:border-secondary-400'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`block text-sm font-bold transition-colors ${isSelected ? 'text-brand' : 'text-secondary'}`}>
                                {service.label}
                              </span>
                              <span className="block text-[11px] text-secondary-400 mt-1 leading-normal">
                                {service.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Back to services
                    </button>
                  </div>

                  <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                    <button
                      type="button"
                      onClick={() => setMovingStep('type')}
                      className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Continue</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TYPE OF MOVE */}
              {movingStep === 'type' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2.5">Type of Move</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { label: 'Storage Unit', desc: 'PODS, U-Pack, or local storage facility' },
                        { label: 'Box Truck', desc: 'Rental trucks like U-Haul, Penske, or Ryder' },
                        { label: 'Inside Home', desc: 'Rearranging furniture staging or room-to-room loading' },
                        { label: 'Other', desc: 'Custom labor requests and heavy lifting' }
                      ].map((type) => {
                        const isSelected = movingType === type.label;
                        return (
                          <button
                            key={type.label}
                            type="button"
                            onClick={() => setMovingType(type.label as typeof movingType)}
                            className={`group p-4 border rounded-xl flex items-start gap-3 transition-all duration-200 w-full text-left bg-white ${
                              isSelected
                                ? 'border-brand bg-white ring-1 ring-brand/10'
                                : 'border-secondary-100 bg-white hover:border-brand/40'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isSelected ? 'border-brand bg-brand border-brand' : 'border-secondary-200 group-hover:border-secondary-400'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`block text-sm font-bold transition-colors ${isSelected ? 'text-brand' : 'text-secondary'}`}>
                                {type.label}
                              </span>
                              <span className="block text-[11px] text-secondary-400 mt-1 leading-normal">
                                {type.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setMovingStep('service')}
                      className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Back to service selection
                    </button>
                  </div>

                  <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                    <button
                      type="button"
                      onClick={() => setMovingStep('crew')}
                      className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-sm font-black uppercase tracking-wider">Continue</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CREW & TIME */}
              {movingStep === 'crew' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2.5">Number of Helpers</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { helpers: 2, desc: 'Apartment moves, loading containers, and light lifting' },
                        { helpers: 3, desc: 'House moves, large trucks, and heavy items' }
                      ].map((option) => {
                        const isSelected = movingHelpers === option.helpers;
                        return (
                          <button
                            key={option.helpers}
                            type="button"
                            onClick={() => setMovingHelpers(option.helpers as 2 | 3)}
                            className={`group p-4 border rounded-xl flex items-start gap-3 transition-all duration-200 w-full text-left bg-white ${
                              isSelected
                                ? 'border-brand bg-white ring-1 ring-brand/10'
                                : 'border-secondary-100 bg-white hover:border-brand/40'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isSelected ? 'border-brand bg-brand border-brand' : 'border-secondary-200 group-hover:border-secondary-400'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`block text-sm font-bold transition-colors ${isSelected ? 'text-brand' : 'text-secondary'}`}>
                                {option.helpers} Helpers
                              </span>
                              <span className="block text-[11px] text-secondary-400 mt-1 leading-normal">
                                {option.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2.5">Estimated Hours (2 hr min)</label>
                    <div className="flex items-center justify-between p-4 bg-white border border-secondary-100 rounded-xl gap-4 transition-all duration-200 hover:border-secondary-300">
                      <div>
                        <div className="text-sm font-bold text-secondary">Time Needed</div>
                        <div className="text-xs text-secondary-400 mt-0.5">{movingHours} hours selected</div>
                      </div>
                      <div className="flex items-center gap-1 border border-secondary-100 rounded-lg p-1 bg-white">
                        <button
                          type="button"
                          onClick={() => setMovingHours(h => Math.max(2, h - 1))}
                          disabled={movingHours <= 2}
                          className="w-8 h-8 rounded bg-transparent hover:bg-secondary-50 text-secondary disabled:opacity-30 flex items-center justify-center transition-colors"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-secondary">{movingHours}</span>
                        <button
                          type="button"
                          onClick={() => setMovingHours(h => Math.min(12, h + 1))}
                          className="w-8 h-8 rounded bg-transparent hover:bg-secondary-50 text-secondary flex items-center justify-center transition-colors"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {movingPricingError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
                      {movingPricingError}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setMovingStep('type')}
                      disabled={movingPricingLoading}
                      className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                    >
                      <ArrowLeft size={12} /> Back to type of move
                    </button>
                  </div>

                  <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                    <button
                      type="button"
                      onClick={async () => {
                        setMovingPricingLoading(true);
                        setMovingPricingError(null);
                        try {
                          const result = await calculateMovingLaborPrice(movingHelpers, movingHours);
                          setEstimate({
                            itemsDetected: [`${movingServiceType} (${movingType}) - ${movingHelpers} Helpers, ${movingHours} hrs`],
                            estimatedVolume: result.estimatedVolume,
                            price: result.price,
                            summary: result.summary
                          });
                          setFormData(prev => ({
                            ...prev,
                            estimatedItems: [`${movingServiceType} (${movingType}) - ${movingHelpers} Helpers, ${movingHours} hrs`],
                            estimatedVolume: result.estimatedVolume,
                            price: result.price,
                            estimateSummary: result.summary,
                            details: `${movingServiceType} service for ${movingType} with ${movingHelpers} helpers for ${movingHours} hours.`
                          }));
                          setMovingStep('result');
                        } catch (err) {
                          console.error('Moving labor pricing error:', err);
                          setMovingPricingError('Failed to calculate price. Please try again.');
                        } finally {
                          setMovingPricingLoading(false);
                        }
                      }}
                      disabled={movingPricingLoading}
                      className="group w-full flex items-center justify-center gap-2 px-5 py-4 bg-brand hover:bg-brand-600 text-white rounded-xl shadow-2xl shadow-brand/40 hover:shadow-brand/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <ScanSearch size={16} className="transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-black uppercase tracking-wider">Get My Estimate</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}

              {movingPricingLoading && movingStep === 'crew' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
                    <p className="text-secondary-600 text-sm font-medium">Calculating your estimate...</p>
                  </div>
                </div>
              )}

              {/* STEP 4: ESTIMATE RESULT */}
              {movingStep === 'result' && estimate && (
                !contactSubmitted ? (
                  <div className="max-w-md mx-auto">
                    <ContactIntakeForm
                      serviceType={formData.serviceType}
                      isLoading={contactLoading}
                      onReveal={async (name, phone) => {
                        await handleContactReveal(name, phone, estimate);
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white border border-secondary-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-24 h-20 md:w-32 md:h-24 shrink-0">
                        <img
                          src="/process-step-2.svg"
                          alt="Moving Labor"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="px-2 py-0.5 bg-brand/10 text-brand text-[9px] font-black uppercase tracking-wider rounded-full border border-brand/20">
                            Instant Estimate
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                            Guaranteed
                          </span>
                        </div>
                        <h3 className="text-sm md:text-base font-black text-secondary">Moving Labor</h3>
                        <p className="text-secondary-400 text-xs mt-1 leading-normal">{estimate.estimatedVolume}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 md:p-6 border border-secondary-100">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] md:text-xs font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</p>
                          <p className="text-xs text-secondary-500 mt-1">{estimate.estimatedVolume}</p>
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-brand">${estimate.price}</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100/80 rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-emerald-950">Safe Protect™ Included</p>
                          <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Covered</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 mt-1 leading-normal">
                          All bookings are covered by platform damage protection.{' '}
                          <button
                            type="button"
                            onClick={() => setShowInsuranceModal(true)}
                            className="text-emerald-900 font-bold hover:underline"
                          >
                            Learn more
                          </button>
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium text-secondary-400 uppercase tracking-wider mb-3">1 item</p>
                      <div className="space-y-1">
                        {estimate.itemsDetected.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-secondary-600">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-secondary-500 leading-relaxed">{estimate.summary}</p>

                    <div className="space-y-3 pt-2">
                      <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                        <button
                          type="button"
                          onClick={() => handleNextStep()}
                          className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span className="text-sm font-black uppercase tracking-wider">
                            Continue to Booking
                          </span>
                          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMovingStep('crew')}
                        className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <ArrowLeft size={14} /> Back to crew & time
                      </button>
                      <p className="text-[10px] text-secondary-300 text-center">* Final price confirmed on-site</p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* ═══ Step 3+: Contact + Address + Review (shared form) ═══ */}
          {(currentStep >= 3 || (currentStep === 2 && formData.serviceType === 'Junk Removal')) && (
            <BookingDetailsForm
              estimate={estimate}
              image={image}
              serviceType={formData.serviceType}
              defaultZip={zipResult ? { city: zipResult.city, state: zipResult.state, zipCode: zipValue } : undefined}
              onBack={() => setCurrentStep(formData.serviceType === 'Junk Removal' ? 1 : 2)}
              backLabel="Back"
              prefilledName={contactName}
              prefilledPhone={contactPhone}
              partialBookingId={partialBookingId}
            />
          )}

        </div>
      </div>
      <div>
        <TrustBadges />
      </div>

      {/* Insurance Modal */}
      {showInsuranceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-secondary-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <ShieldCheck size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-secondary text-lg">Safe Protect™</h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Platform Coverage Included</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowInsuranceModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-secondary-100 flex items-center justify-center text-secondary transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4 text-left">
              <p className="text-xs text-secondary-500 leading-relaxed">
                Safety and peace of mind are prioritized. Every booking is covered by platform damage protection at no extra charge.
              </p>
              <div className="h-px bg-secondary-100"></div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-secondary">Damage Protection</p>
                    <p className="text-[11px] text-secondary-400 mt-0.5 leading-normal">Protects residential and commercial property from accidental damage during service.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-secondary">Same Day Service</p>
                    <p className="text-[11px] text-secondary-400 mt-0.5 leading-normal">Subject to availability, local service providers can get to your site on the same day.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-secondary">Satisfaction Guarantee</p>
                    <p className="text-[11px] text-secondary-400 mt-0.5 leading-normal">If you're not satisfied with the quality of the job, the support team will resolve it quickly.</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowInsuranceModal(false)}
              className="w-full mt-6 py-3 bg-secondary hover:bg-brand text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-secondary/15 transition-all"
            >
              Got it, thanks
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
