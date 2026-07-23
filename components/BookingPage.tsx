import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Loader2, ScanSearch, CalendarCheck, Receipt, PackageCheck, ClipboardList, Truck, X, MapPin, AlertCircle, CheckCircle2, Search, Package, Heart, Trash2, HeartHandshake, Armchair, Container, Clock, Plus, Minus, Warehouse, Home, Boxes, PackagePlus, PackageMinus, ArrowLeftRight, ShieldCheck, Sliders, Sparkles, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CameraCaptureIcon, UploadPhotoIcon, DumpsterSizeIcon } from './icons/ServiceIcons';
import { QuoteEstimate, LoadingState, DetectedItem, PriceEstimate, MovingLaborOptions } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { calculateDumpsterRentalPrice, DumpsterRentalOptions, calculateMovingLaborPrice } from '../services/pricingService';
import { supabase } from '../lib/supabase';
import { persistBookingPhotos, withBookingPhotos } from '../lib/bookingPhotos';
import { withSmsMarketingConsent } from '../lib/customerConsent';
import { toStoredMovingOptions } from '../lib/bookingPayloads';
import { BookingDetailsForm } from './BookingDetailsForm';
import { ContactIntakeForm } from './shared/ContactIntakeForm';
import { BookingSuccessView } from './shared/BookingSuccessView';
import { JunkRemovalEstimateFlow, type EstimateMode, type JunkRemovalEstimateResult } from './shared/JunkRemovalEstimateFlow';
import { MovingLaborEstimateFlow } from './shared/MovingLaborEstimateFlow';
import {
  FLOW_PAGE_SHELL,
  FLOW_PAGE_CONTENT,
  flowPageMaxWidth,
} from '../lib/flowPageLayout';
import { FlowProgressBar } from './shared/flow/FlowProgressBar';
import { FlowZipCheck } from './shared/flow/FlowZipCheck';
import { ServiceTypePicker, type ServicePickerId } from './shared/flow/ServiceTypePicker';
import { FlowStepTitle } from './shared/flow/FlowStepTitle';
import { FlowStickyNav } from './shared/flow/FlowStickyNav';
import { FlowSelectionCard } from './shared/flow/FlowSelectionCard';

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
  const [junkEstimateMode, setJunkEstimateMode] = useState<EstimateMode>('method');
  const [junkManualStep, setJunkManualStep] = useState<'select' | 'review' | 'result'>('select');
  const [junkFlowKey, setJunkFlowKey] = useState(0);
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
  const [estimateImages, setEstimateImages] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);

  // Dumpster Rental State
  const [dumpsterSize, setDumpsterSize] = useState<'10-yard' | '15-yard' | '20-yard' | '30-yard'>('20-yard');
  const [dumpsterDuration, setDumpsterDuration] = useState<number>(7);
  const [dumpsterStep, setDumpsterStep] = useState<'size' | 'duration' | 'result'>('size');

  // Moving Labor State
  const [movingServiceType, setMovingServiceType] = useState<'Loading Only' | 'Unloading Only' | 'Both'>('Both');
  const [movingType, setMovingType] = useState<'Storage Unit' | 'Box Truck' | 'Inside Home' | 'Other'>('Inside Home');
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
  const [smsMarketingConsentAt, setSmsMarketingConsentAt] = useState<string | null>(null);
  const [savedEstimateItems, setSavedEstimateItems] = useState<DetectedItem[]>([]);
  const [savedPriceEstimate, setSavedPriceEstimate] = useState<PriceEstimate | null>(null);
  const [resumeEstimateFlow, setResumeEstimateFlow] = useState(false);
  const [movingOptions, setMovingOptions] = useState<MovingLaborOptions | null>(null);

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
        details: `Items: ${est.itemsDetected.join(', ')}\nEstimated Items: ${est.estimatedVolume}\nEstimated Price: $${est.price}`
      }));
      setCurrentStep(3);
    }
  }, [estimateData]);

  const handleContactReveal = async (
    name: string,
    phone: string,
    consentAt: string | null,
    est: QuoteEstimate,
    movingOpts?: MovingLaborOptions | null
  ) => {
    setContactLoading(true);
    try {
      const detailsText = `Items: ${est.itemsDetected.join(', ')}\nEstimated Items: ${est.estimatedVolume}\nEstimated Price: $${est.price}`;

      let partialId = `mock-lead-${Date.now()}`;
      try {
        const photos = await persistBookingPhotos(
          estimateImages.length > 0 ? estimateImages : image ? [image] : [],
          `lead_${Date.now()}`
        );
        if (photos.photo_urls.length > 0) {
          setEstimateImages(photos.photo_urls);
          setImage(photos.photo_url);
        }

        const customerInfo = withSmsMarketingConsent({ name, phone, email: '' }, consentAt);

        const bookingDetails = withBookingPhotos(
          {
            service_type: formData.serviceType,
            zip_code: zipValue || null,
            details: detailsText,
            estimated_items: est.itemsDetected,
            estimated_volume: est.estimatedVolume,
            price: est.price,
            estimate_summary: est.summary,
            subtotal: est.subtotal ?? est.price,
            online_booking_discount: est.onlineBookingDiscount ?? null,
            ...(movingOpts ? { moving_options: toStoredMovingOptions(movingOpts) } : {}),
          },
          photos
        );

        const { data, error: dbError } = await supabase.rpc('create_prebooking', {
          p_customer_info: customerInfo,
          p_booking_details: bookingDetails,
          p_status: 'partially_submitted'
        });

        if (dbError) {
          console.warn('Supabase lead capture failed in BookingPage, proceeding in mock mode:', dbError);
        } else if (data) {
          partialId = data as string;
        }
      } catch (err) {
        console.warn('Supabase lead capture failed in BookingPage, proceeding in mock mode:', err);
      }

      setPartialBookingId(partialId);
      setContactName(name);
      setContactPhone(phone);
      setSmsMarketingConsentAt(consentAt);
      setFormData(prev => ({ ...prev, name, phone }));
      setContactSubmitted(true);
    } catch (err) {
      console.error('Error in handleContactReveal in BookingPage:', err);
      setContactName(name);
      setContactPhone(phone);
      setSmsMarketingConsentAt(consentAt);
      setFormData(prev => ({ ...prev, name, phone }));
      setContactSubmitted(true);
    } finally {
      setContactLoading(false);
    }
  };

  const handleEstimateComplete = (result: JunkRemovalEstimateResult) => {
    setEstimate(result.estimate);
    setImage(result.image);
    setEstimateImages(result.images.length > 0 ? result.images : result.image ? [result.image] : []);
    setContactName(result.contactName);
    setContactPhone(result.contactPhone);
    setSmsMarketingConsentAt(result.smsMarketingConsentAt);
    setPartialBookingId(result.partialBookingId);
    setSavedEstimateItems(result.items);
    setSavedPriceEstimate(result.price);
    setResumeEstimateFlow(false);
    setContactSubmitted(true);
    setFormData((prev) => ({
      ...prev,
      name: result.contactName,
      phone: result.contactPhone,
      estimatedItems: result.estimate.itemsDetected,
      estimatedVolume: result.estimate.estimatedVolume,
      price: result.estimate.price,
      estimateSummary: result.estimate.summary,
      photoUrl: result.image || '',
      details: `Items: ${result.estimate.itemsDetected.join(', ')}\nEstimated Items: ${result.estimate.estimatedVolume}\nEstimated Price: $${result.estimate.price}`,
    }));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        details: `Items: ${result.itemsDetected.join(', ')}\nEstimated Items: ${result.estimatedVolume}\nEstimated Price: $${result.price}`
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
      const generatedOrderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const photos = await persistBookingPhotos(
        formData.photoUrl ? [formData.photoUrl] : estimateImages.length > 0 ? estimateImages : image ? [image] : [],
        `booking_${generatedOrderNumber}`
      );

      const customerInfo = withSmsMarketingConsent(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        smsMarketingConsentAt
      );

      const locationInfo = {
        address: formData.address,
        unit_number: formData.unitNumber || null,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      };

      const bookingDetails = withBookingPhotos(
        {
          service_type: formData.serviceType,
          preferred_date: formData.date,
          details: formData.details,
          estimated_items: formData.estimatedItems,
          estimated_volume: formData.estimatedVolume,
          price: formData.price,
          estimate_summary: formData.estimateSummary,
        },
        photos
      );

      const { error: insertError } = await supabase
        .from('bookings')
        .insert([
          {
            order_number: generatedOrderNumber,
            customer_info: customerInfo,
            location_info: locationInfo,
            booking_details: bookingDetails,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;
      
      setOrderNumber(generatedOrderNumber);

      // Confirmation + admin emails are sent automatically by the
      // send_notification_on_insert trigger on public.bookings.
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting booking:', err);
      setError(err.message || 'Failed to submit booking. Please try again.');
      setSubmitting(false);
    }
  };

  const stepLabels = formData.serviceType === 'Junk Removal'
    ? ['ZIP Check', 'Service', 'Estimate', 'Booking']
    : [
        'ZIP Check', 
        'Service', 
        formData.serviceType === 'Moving Labor' ? 'Options' : formData.serviceType === 'Dumpster Rental' ? 'Options' : 'Photo', 
        'Booking'
      ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-start justify-center px-4 py-16 md:py-24">
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
          fullScreen={false}
        />
      </div>
    );
  }

  const isJunkEstimateStep = currentStep === 2 && formData.serviceType === 'Junk Removal';
  const junkUsesWideLayout = isJunkEstimateStep && junkEstimateMode === 'manual' && junkManualStep === 'select';
  const junkFlowActive = isJunkEstimateStep && junkEstimateMode !== 'method';
  const flowProgress =
    currentStep >= 3 ? 1
    : currentStep === 2 ? 0.75
    : currentStep === 1 ? 0.5
    : 0.25;

  const handleServicePick = (id: ServicePickerId) => {
    if (id === 'junk_removal') {
      setFormData((prev) => ({ ...prev, serviceType: 'Junk Removal' }));
      setJunkEstimateMode('method');
      setJunkManualStep('select');
      setJunkFlowKey((k) => k + 1);
      setCurrentStep(2);
    } else if (id === 'moving_labor') {
      setFormData((prev) => ({ ...prev, serviceType: 'Moving Labor' }));
      setCurrentStep(2);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={FLOW_PAGE_SHELL}>
      <FlowProgressBar progress={flowProgress} />

      <div className={`${FLOW_PAGE_CONTENT} transition-all duration-300 ${flowPageMaxWidth(junkUsesWideLayout)} ${junkFlowActive ? 'pt-4 md:pt-6' : ''}`}>
        {/* Form */}
        <div>

          {currentStep === 0 && (
            <FlowZipCheck
              title="Book your pickup"
              subtitle="Nationwide coverage in all 50 states — start with your ZIP code."
              zipValue={zipValue}
              onZipChange={(v) => { setZipValue(v); setZipError(null); setZipResult(null); }}
              onCheck={handleZipCheck}
              loading={zipLoading}
              error={zipError}
              result={zipResult?.served ? { city: zipResult.city, state: zipResult.state } : null}
            />
          )}

          {currentStep === 1 && (
            <ServiceTypePicker
              onSelect={handleServicePick}
              onBack={handlePrevStep}
              quoteLinkLabel="Just need a quote? Get a free estimate →"
            />
          )}

          {/* NOTE: pre-fill from QuotePage skips to step 3 with estimate banner above BookingDetailsForm */}

          {/* ═══ Step 2: Junk Removal — estimate flow (matches Quote page) ═══ */}
          {currentStep === 2 && formData.serviceType === 'Junk Removal' && (
            <JunkRemovalEstimateFlow
              key={resumeEstimateFlow ? 'resume' : junkFlowKey}
              zipValue={zipValue}
              onContinue={handleEstimateComplete}
              onBack={handlePrevStep}
              onModeChange={(mode, manualStep) => {
                setJunkEstimateMode(mode);
                setJunkManualStep(manualStep);
              }}
              resumeState={resumeEstimateFlow && savedPriceEstimate ? {
                selectedItems: savedEstimateItems,
                manualPriceEstimate: savedPriceEstimate,
                contactSubmitted: true,
                contactName,
                contactPhone,
                smsMarketingConsentAt,
                partialBookingId,
                image,
              } : undefined}
            />
          )}

          {/* ═══ Step 2: Photo Upload & Estimate (Donation Pick Up only) ═══ */}
          {currentStep === 2 && formData.serviceType === 'Donation Pick Up' && (
            <div className="space-y-4">
              <FlowStepTitle
                title="Photo estimate"
                subtitle="Snap a photo for instant volume and price detection."
              />

              {!image ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full bg-[var(--surface)] border border-white/15 hover:border-white/25 hover:shadow-none transition-all p-5 rounded-xl text-left flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-center shrink-0 text-[var(--text-muted)] group-hover:border-brand/30 group-hover:text-brand transition-colors">
                      <CameraCaptureIcon size={22} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[var(--text)] mb-0.5">Take photo</h3>
                      <p className="text-[var(--text-muted)] text-sm">Use your camera to capture the items</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/15 group-hover:border-white/20 group-hover:bg-brand flex items-center justify-center transition-all">
                      <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </div>
                    <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[var(--surface)] border border-white/15 hover:border-white/25 hover:shadow-none transition-all p-5 rounded-xl text-left flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-center shrink-0 text-[var(--text-muted)] group-hover:border-brand/30 group-hover:text-brand transition-colors">
                      <UploadPhotoIcon size={22} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[var(--text)] mb-0.5">Upload photo</h3>
                      <p className="text-[var(--text-muted)] text-sm">Choose an existing photo from your device</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/15 group-hover:border-white/20 group-hover:bg-brand flex items-center justify-center transition-all">
                      <ArrowRight size={14} className="text-[var(--text-muted)] group-hover:text-white transition-all group-hover:translate-x-0.5" />
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNextStep()}
                    className="w-full text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm font-medium py-2 inline-flex items-center justify-center gap-1.5"
                  >
                    Skip <ArrowRight size={13} />
                  </button>

                  <FlowStickyNav showBack onBack={handlePrevStep} showContinue={false} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl border border-white/15">
                    <img src={image} alt="Upload" className="w-full" />
                    {loadingState !== LoadingState.ANALYZING && (
                      <button
                        onClick={() => { setImage(null); setEstimate(null); setLoadingState(LoadingState.IDLE); }}
                        className="absolute top-3 right-3 bg-[var(--surface)] text-[var(--text)] px-3 py-1.5 text-xs font-semibold shadow-lg hover:text-[var(--text-muted)] transition-colors rounded-lg inline-flex items-center gap-1"
                      >
                        <X size={12} /> Change
                      </button>
                    )}
                  </div>

                  {loadingState === LoadingState.IDLE && (
                    <FlowStickyNav
                      showBack
                      onBack={() => { setImage(null); setEstimate(null); setLoadingState(LoadingState.IDLE); }}
                      backLabel="Change"
                      onContinue={handleAnalyze}
                      continueLabel="Analyze photo"
                    />
                  )}

                  {loadingState === LoadingState.ANALYZING && (
                    <div className="py-8 text-center">
                      <Loader2 size={36} className="animate-spin mx-auto mb-3 text-[var(--text)]" />
                      <p className="text-[var(--text-muted)] text-sm">Analyzing your photo...</p>
                    </div>
                  )}

                  {loadingState === LoadingState.SUCCESS && estimate && (
                    !contactSubmitted ? (
                      <div className="max-w-md mx-auto">
                        <ContactIntakeForm
                          serviceType={formData.serviceType}
                          isLoading={contactLoading}
                          onReveal={async (name, phone, consentAt) => {
                            await handleContactReveal(name, phone, consentAt, estimate);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <FlowStepTitle title="Your estimate" subtitle="Review your price, then continue to book." />

                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
                          <div className="w-20 h-16 shrink-0 flex items-end justify-center">
                            <img
                              src={
                                formData.serviceType === 'Donation Pick Up'
                                  ? '/opek-service-areas.png?v=1'
                                  : formData.serviceType === 'Moving Labor'
                                    ? '/opek-related-moving.png?v=1'
                                    : formData.serviceType === 'Dumpster Rental'
                                      ? '/opek-related-dumpster.png?v=1'
                                      : '/opek-hero-haulers.png?v=3'
                              }
                              alt="Service"
                              className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="px-2 py-0.5 bg-white/[0.06] text-[var(--text)] text-[10px] font-semibold uppercase tracking-wide rounded-full">
                                Instant Estimate
                              </span>
                              <span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-300 text-[10px] font-semibold uppercase tracking-wide rounded-full">
                                Guaranteed
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-[var(--text)]">{formData.serviceType}</h3>
                            <p className="text-[var(--text-muted)] text-xs mt-0.5">{estimate.estimatedVolume}</p>
                          </div>
                          <p className="text-2xl font-semibold text-[var(--text)] shrink-0">${estimate.price}</p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Items detected</p>
                          <ul className="space-y-1.5">
                            {estimate.itemsDetected.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Check size={14} className="text-[var(--text)] mt-0.5 shrink-0" strokeWidth={2.5} />
                                <span className="text-[var(--text-muted)] text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-emerald-400/10 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-emerald-950">Safe Protect™ Included</p>
                              <span className="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">Covered</span>
                            </div>
                            <p className="text-xs text-emerald-300 mt-1 leading-normal">
                              All bookings are covered by platform damage protection.{' '}
                              <button
                                type="button"
                                onClick={() => setShowInsuranceModal(true)}
                                className="text-emerald-900 font-medium hover:underline"
                              >
                                Learn more
                              </button>
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{estimate.summary}</p>

                        <FlowStickyNav
                          showBack
                          onBack={() => { setImage(null); setEstimate(null); setLoadingState(LoadingState.IDLE); }}
                          backLabel="Back"
                          onContinue={() => handleNextStep()}
                          continueLabel="Continue to book"
                        />
                        <p className="text-xs text-[var(--text-muted)] text-center">* Final price confirmed on-site</p>
                      </div>
                    )
                  )}

                  {loadingState === LoadingState.ERROR && (
                    <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 text-center">
                      <p className="text-brand text-sm font-semibold mb-3">Failed to analyze photo</p>
                      <button
                        onClick={handleAnalyze}
                        className="px-5 py-2.5 bg-brand text-white font-semibold text-sm hover:bg-brand-600 transition-colors rounded-full"
                      >
                        Try again
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
              {/* SIZE SELECTION */}
              {dumpsterStep === 'size' && (
                <>
                  <FlowStepTitle
                    title="Dumpster rental options"
                    subtitle="Roll-off container delivered to your site. Pick a size to start."
                  />
                  <div className="space-y-3">
                    {[
                      { label: '10-Yard', desc: 'Small projects, garage cleanouts', price: '$350' },
                      { label: '15-Yard', desc: 'Medium renovations, yard debris', price: '$400' },
                      { label: '20-Yard', desc: 'Large cleanouts, roofing', price: '$450' },
                      { label: '30-Yard', desc: 'Construction, major demolition', price: '$550' },
                    ].map((size) => (
                      <FlowSelectionCard
                        key={size.label}
                        title={size.label}
                        description={size.desc}
                        fromPrice={`${size.price} / 7 days`}
                        icon={<DumpsterSizeIcon className="w-full h-full" />}
                        selected={dumpsterSize === `${size.label.toLowerCase()}` as any}
                        onClick={() => setDumpsterSize(`${size.label.toLowerCase()}` as any)}
                      />
                    ))}
                  </div>

                  <FlowStickyNav
                    showBack
                    onBack={handlePrevStep}
                    onContinue={() => setDumpsterStep('duration')}
                  />
                </>
              )}

              {/* DURATION SELECTION */}
              {dumpsterStep === 'duration' && (
                <>
                  <FlowStepTitle
                    title="Rental duration"
                    subtitle="Base rate includes 7 days. Extra days: $25/day. 14+ day rentals get 10% off."
                  />
                  <div className="bg-[var(--surface)] border border-white/15 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">Rental period</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{dumpsterDuration} day{dumpsterDuration > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 border border-white/15 rounded-full px-2 py-1">
                      <button
                        onClick={() => setDumpsterDuration(d => Math.max(1, d - 1))}
                        disabled={dumpsterDuration <= 1}
                        className="w-8 h-8 rounded-full hover:bg-white/[0.04] text-[var(--text)] disabled:opacity-30 flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[var(--text)]">{dumpsterDuration}</span>
                      <button
                        onClick={() => setDumpsterDuration(d => Math.min(30, d + 1))}
                        className="w-8 h-8 rounded-full hover:bg-white/[0.04] text-[var(--text)] flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <FlowStickyNav
                    showBack
                    onBack={() => setDumpsterStep('size')}
                    continueLabel="Get estimate"
                    onContinue={async () => {
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
                  />
                </>
              )}

              {/* ESTIMATE RESULT */}
              {dumpsterStep === 'result' && estimate && (
                !contactSubmitted ? (
                  <div className="max-w-md mx-auto">
                    <ContactIntakeForm
                      serviceType={formData.serviceType}
                      isLoading={contactLoading}
                      onReveal={async (name, phone, consentAt) => {
                        await handleContactReveal(name, phone, consentAt, estimate);
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <FlowStepTitle title="Your estimate" subtitle="Review your price, then continue to book." />

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
                      <div className="w-20 h-16 shrink-0 flex items-end justify-center">
                        <img
                          src="/opek-related-dumpster.png?v=1"
                          alt="Dumpster Rental"
                          className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-white/[0.06] text-[var(--text)] text-[10px] font-semibold uppercase tracking-wide rounded-full">
                            Instant Estimate
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-300 text-[10px] font-semibold uppercase tracking-wide rounded-full">
                            Guaranteed
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--text)]">Dumpster Rental</h3>
                        <p className="text-[var(--text-muted)] text-xs mt-0.5">{estimate.estimatedVolume}</p>
                      </div>
                      <p className="text-2xl font-semibold text-[var(--text)] shrink-0">${estimate.price}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Rental details</p>
                      <ul className="space-y-1.5">
                        {estimate.itemsDetected.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check size={14} className="text-[var(--text)] mt-0.5 shrink-0" strokeWidth={2.5} />
                            <span className="text-[var(--text-muted)] text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-400/10 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-emerald-950">Safe Protect™ Included</p>
                          <span className="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">Covered</span>
                        </div>
                        <p className="text-xs text-emerald-300 mt-1 leading-normal">
                          All bookings are covered by platform damage protection.{' '}
                          <button
                            type="button"
                            onClick={() => setShowInsuranceModal(true)}
                            className="text-emerald-900 font-medium hover:underline"
                          >
                            Learn more
                          </button>
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{estimate.summary}</p>

                    <FlowStickyNav
                      showBack
                      onBack={() => setDumpsterStep('duration')}
                      onContinue={() => handleNextStep()}
                      continueLabel="Continue to book"
                    />
                    <p className="text-xs text-[var(--text-muted)] text-center">* Final price confirmed on-site</p>
                  </div>
                )
              )}
            </div>
          )}

          {/* ═══ Step 2: Moving Labor Flow ═══ */}
          {currentStep === 2 && formData.serviceType === 'Moving Labor' && (
            <MovingLaborEstimateFlow
              onBack={handlePrevStep}
              onContactReveal={async (name, phone, consentAt, est, _price, opts) => {
                setMovingOptions(opts);
                await handleContactReveal(name, phone, consentAt, est, opts);
              }}
              onComplete={(result) => {
                setEstimate(result.estimate);
                setMovingOptions(result.movingOptions);
                setContactName(result.contactName);
                setContactPhone(result.contactPhone);
                setSmsMarketingConsentAt(result.smsMarketingConsentAt);
                setContactSubmitted(true);
                setFormData((prev) => ({
                  ...prev,
                  name: result.contactName,
                  phone: result.contactPhone,
                  estimatedItems: result.estimate.itemsDetected,
                  estimatedVolume: result.estimate.estimatedVolume,
                  price: result.estimate.price,
                  estimateSummary: result.estimate.summary,
                  details: result.estimate.summary,
                }));
                setCurrentStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              continueLabel="Continue to book"
              initialContact={
                contactName && contactPhone
                  ? { name: contactName, phone: contactPhone, consentAt: smsMarketingConsentAt }
                  : undefined
              }
            />
          )}

          {/* ═══ Step 3+: Contact + Address + Review (shared form) ═══ */}
          {(currentStep >= 3) && (
            <>
              <FlowStepTitle
                title={`Book your ${formData.serviceType === 'Moving Labor' ? 'service' : 'pickup'}`}
                subtitle="Contact, schedule, address, review, and deposit."
              />
              <BookingDetailsForm
              estimate={estimate}
              image={image}
              images={estimateImages}
              serviceType={formData.serviceType}
              defaultZip={zipResult ? { city: zipResult.city, state: zipResult.state, zipCode: zipValue } : undefined}
              onBack={() => {
                if (formData.serviceType === 'Junk Removal' && savedPriceEstimate) {
                  setResumeEstimateFlow(true);
                  setJunkEstimateMode('manual');
                  setJunkManualStep('result');
                  setCurrentStep(2);
                } else {
                  setCurrentStep(2);
                }
              }}
              backLabel="Back"
              prefilledName={contactName}
              prefilledPhone={contactPhone}
              partialBookingId={partialBookingId}
              smsMarketingConsentAt={smsMarketingConsentAt}
              movingOptions={movingOptions}
            />
            </>
          )}

        </div>
      </div>

      {/* Insurance Modal */}
      {showInsuranceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[var(--surface)] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <ShieldCheck size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-[var(--text)] text-lg">Safe Protect™</h3>
                  <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Platform Coverage Included</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowInsuranceModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--surface)] hover:bg-white/[0.06] flex items-center justify-center text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4 text-left">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Safety and peace of mind are prioritized. Every booking is covered by platform damage protection at no extra charge.
              </p>
              <div className="h-px bg-white/[0.06]"></div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-[var(--text)]">Damage Protection</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-normal">Protects residential and commercial property from accidental damage during service.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-[var(--text)]">Same Day Service</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-normal">Subject to availability, local service providers can get to your site on the same day.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black text-[var(--text)]">Satisfaction Guarantee</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-normal">If you're not satisfied with the quality of the job, the support team will resolve it quickly.</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowInsuranceModal(false)}
              className="w-full mt-6 py-3 bg-brand hover:bg-brand-600 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-[0_0_24px_-8px_rgba(255,0,110,0.4)] transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
