import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Upload, Loader2, Camera, ScanSearch, CalendarCheck, Receipt, PackageCheck, ClipboardList, Truck, X, MapPin, AlertCircle, CheckCircle2, Search, Package, Heart, Trash2, HeartHandshake, Armchair, Container, Clock, Plus, Minus, Warehouse, Home, Boxes, PackagePlus, PackageMinus, ArrowLeftRight, ShieldCheck, Sliders, Sparkles, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JunkIcon, MovingLaborIcon, DumpsterIcon, LoadingIcon, UnloadingIcon, LoadingUnloadingIcon, StorageUnitIcon, BoxTruckIcon, InsideHomeIcon, OtherMoveIcon, TwoHelpersIcon, PhotoEstimateIcon, InputZipIcon } from './icons/ServiceIcons';
import { QuoteEstimate, LoadingState, DetectedItem, PriceEstimate, MovingLaborOptions } from '../types';
import { getJunkQuoteFromPhoto } from '../services/openaiService';
import { calculateDumpsterRentalPrice, calculateMovingLaborPrice } from '../services/pricingService';
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
    if (query.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    setAddressLoading(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`);
      const data = await res.json();
      const results: AddressSuggestion[] = (data.features || [])
        .map((f: any) => {
          const p = f.properties || {};
          const street = [p.street, p.housenumber].filter(Boolean).join(' ');
          const city = p.city || p.town || p.village || '';
          const state = p.state || '';
          const zipCode = p.postcode || '';
          const display = [street, city, state, zipCode].filter(Boolean).join(', ');
          return { display, street: street.trim(), city, state, zipCode };
        })
        .filter((s: AddressSuggestion) => s.street);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch { setSuggestions([]); setShowSuggestions(false); }
    finally { setAddressLoading(false); }
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
