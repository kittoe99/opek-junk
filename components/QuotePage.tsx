import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Camera, Upload, Loader2, Check, Plus, Minus, Trash2, Search, ListChecks, Armchair, Plug, Monitor, TreePine, HardHat, Warehouse, Package, ChevronDown, BedDouble, ScanSearch, Receipt, ArrowRight, ArrowLeft, X, MapPin, AlertCircle, CheckCircle2, Heart, HeartHandshake, Truck, BicepsFlexed, Download, RefreshCw, Home, Clock, PackagePlus, PackageMinus, ArrowLeftRight, Boxes, ShieldCheck, Container, Users, Sliders, ClipboardList, Eye, CalendarCheck, Sparkles, Sun, Maximize, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JunkIcon, MovingLaborIcon, DumpsterIcon, LoadingIcon, UnloadingIcon, LoadingUnloadingIcon, StorageUnitIcon, BoxTruckIcon, InsideHomeIcon, OtherMoveIcon, TwoHelpersIcon, ThreeHelpersIcon, InputZipIcon, InputMessageIcon } from './icons/ServiceIcons';
import { ITEM_CATALOG, type CatalogItem, type CatalogCategory } from '../lib/itemCatalog';
import { JunkRemovalEstimateFlow, type EstimateMode } from './shared/JunkRemovalEstimateFlow';
import { MovingLaborEstimateFlow } from './shared/MovingLaborEstimateFlow';
import { detectItemsFromPhotos } from '../services/openaiService';
import { ItemIconRenderer } from './icons/JunkItemIcons';
import { calculateStaticPrice, calculateDumpsterRentalPrice, DumpsterRentalOptions, calculateMovingLaborPrice } from '../services/pricingService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState } from '../types';
import { BookingDetailsForm } from './BookingDetailsForm';
import { supabase } from '../lib/supabase';
import { persistBookingPhotos, withBookingPhotos } from '../lib/bookingPhotos';
import { withSmsMarketingConsent } from '../lib/customerConsent';
import { ContactIntakeForm } from './shared/ContactIntakeForm';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import { JunkItemCatalogSelector, getCatalogItemImage } from './shared/JunkItemCatalogSelector';
import { JunkRemovalPriceBreakdown } from './shared/JunkRemovalPriceBreakdown';
import {
  FLOW_PAGE_SHELL,
  FLOW_PAGE_CONTENT,
  flowPageMaxWidth,
  scrollToFlowStep,
} from '../lib/flowPageLayout';
import { FlowProgressBar } from './shared/flow/FlowProgressBar';
import { FlowZipCheck } from './shared/flow/FlowZipCheck';
import { FlowStickyNav } from './shared/flow/FlowStickyNav';
import { FlowStepTitle } from './shared/flow/FlowStepTitle';
import { FlowSelectionCard } from './shared/flow/FlowSelectionCard';
import { ServiceTypePicker, type ServicePickerId } from './shared/flow/ServiceTypePicker';

export { ITEM_CATALOG, type CatalogItem, type CatalogCategory };

// Nationwide coverage — any valid US ZIP is served.
type ServedCity = { city: string; state: string };

export const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingState = location.state as {
    zipResult?: { city: string; state: string; served?: boolean } | null;
    zipValue?: string;
    serviceType?: string;
    preselectItems?: { name: string; quantity: number }[];
    quoteMethod?: 'method' | 'manual' | 'ai';
  } | null;

  // Map incoming serviceType string to internal service type if present
  const mappedServiceType: 'junk_removal' | 'moving_labor' | 'dumpster_rental' | 'donation_pickup' | null =
    incomingState?.serviceType
      ? (incomingState.serviceType.toLowerCase().includes('moving') ? 'moving_labor'
        : incomingState.serviceType.toLowerCase().includes('dumpster') ? 'dumpster_rental'
        : incomingState.serviceType.toLowerCase().includes('donation') ? 'donation_pickup'
        : 'junk_removal')
      : null;

  const [zipVerified, setZipVerified] = useState(!!incomingState?.zipResult);
  const [zipValue, setZipValue] = useState(incomingState?.zipValue || '');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [zipResult, setZipResult] = useState<({ city: string; state: string; servedCity: ServedCity | null }) | null>(
    incomingState?.zipResult
      ? { city: incomingState.zipResult.city, state: incomingState.zipResult.state, servedCity: { city: incomingState.zipResult.city, state: incomingState.zipResult.state } }
      : null
  );
  const [selectedService, setSelectedService] = useState<'junk_removal' | 'moving_labor' | 'dumpster_rental' | 'donation_pickup' | null>(
    incomingState?.preselectItems ? 'junk_removal' : mappedServiceType
  );
  const [selectedOption, setSelectedOption] = useState<'method' | 'ai' | 'manual' | 'moving_labor' | 'donation_pickup' | 'dumpster_rental' | null>(
    incomingState?.preselectItems
      ? 'manual'
      : mappedServiceType === 'junk_removal'
        ? 'method'
        : mappedServiceType
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [junkQuoteMode, setJunkQuoteMode] = useState<EstimateMode>('method');
  const [junkQuoteManualStep, setJunkQuoteManualStep] = useState<'select' | 'review' | 'result'>('select');

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [partialBookingId, setPartialBookingId] = useState<string | null>(null);
  const [smsMarketingConsentAt, setSmsMarketingConsentAt] = useState<string | null>(null);

  // Moving Labor State
  const [movingServiceType, setMovingServiceType] = useState<'Loading Only' | 'Unloading Only' | 'Both'>('Both');
  const [movingType, setMovingType] = useState<'Storage Unit' | 'Box Truck' | 'Inside Home' | 'Other'>('Inside Home');
  const [movingHelpers, setMovingHelpers] = useState<2 | 3>(2);
  const [movingHours, setMovingHours] = useState<number>(2);
  const [movingStep, setMovingStep] = useState<'service' | 'type' | 'crew' | 'result'>('service');

  useEffect(() => {
    if (selectedOption !== 'moving_labor') {
      setMovingStep('service');
      setMovingServiceType('Both');
    }
  }, [selectedOption]);

  // Donation Pickup State
  const [donationCharity, setDonationCharity] = useState<'No Preference' | 'Goodwill' | 'Habitat ReStore' | 'Local Shelter'>('No Preference');
  const [donationReceipt, setDonationReceipt] = useState<boolean>(true);
  const [donationSize, setDonationSize] = useState<'Bagged/Boxed Items' | 'Few Furniture Items' | 'Full Room/Multiple Items'>('Few Furniture Items');
  const [donationLocation, setDonationLocation] = useState<'Curbside/Outside' | 'Garage/Porch' | 'Inside Home (Ground Floor)' | 'Inside Home (Stairs)'>('Garage/Porch');
  const [donationStep, setDonationStep] = useState<'details' | 'size' | 'result'>('details');

  useEffect(() => {
    if (selectedOption !== 'donation_pickup') {
      setDonationStep('details');
    }
  }, [selectedOption]);

  // Dumpster Rental State
  const [dumpsterSize, setDumpsterSize] = useState<'10-yard' | '15-yard' | '20-yard' | '30-yard'>('20-yard');
  const [dumpsterDuration, setDumpsterDuration] = useState<number>(7);
  const [dumpsterStep, setDumpsterStep] = useState<'size' | 'duration' | 'result'>('size');

  useEffect(() => {
    if (selectedOption !== 'dumpster_rental') {
      setDumpsterStep('size');
    }
  }, [selectedOption]);

  // Sync flow when navigating to /quote with router state (component may stay mounted)
  useEffect(() => {
    const state = location.state as typeof incomingState;
    if (!state) return;

    if (state.zipResult && state.zipValue) {
      setZipVerified(true);
      setZipValue(state.zipValue);
      setZipResult({
        city: state.zipResult.city,
        state: state.zipResult.state,
        servedCity: { city: state.zipResult.city, state: state.zipResult.state },
      });
    }

    if (state.preselectItems?.length) {
      setSelectedService('junk_removal');
      setSelectedOption('manual');
      setManualStep('select');
      return;
    }

    if (state.quoteMethod === 'manual') {
      setSelectedService('junk_removal');
      setSelectedOption('manual');
      setManualStep('select');
      return;
    }

    if (state.quoteMethod === 'ai') {
      setSelectedService('junk_removal');
      setSelectedOption('ai');
      setAiStep('tips');
      return;
    }

    if (state.serviceType) {
      const st = state.serviceType.toLowerCase();
      const service =
        st.includes('moving') ? 'moving_labor'
          : st.includes('dumpster') ? 'dumpster_rental'
            : st.includes('donation') ? 'donation_pickup'
              : 'junk_removal';

      setSelectedService(service);
      if (service === 'junk_removal') {
        setSelectedOption('method');
        setAiStep('tips');
        setManualStep('select');
      } else {
        setSelectedOption(service);
      }
    }
  }, [location.key]);

  useEffect(() => {
    if (zipResult?.servedCity) {
      const t = setTimeout(() => setZipVerified(true), 2000);
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
      // Nationwide — every valid US ZIP is in-area
      setZipResult({ city, state, servedCity: { city, state } });
    } catch {
      setZipError('Unable to verify ZIP code. Please try again.');
    } finally {
      setZipLoading(false);
    }
  };

  // AI Photo State
  const [images, setImages] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [dumpsterPriceEstimate, setDumpsterPriceEstimate] = useState<PriceEstimate | null>(null);
  const [movingPriceEstimate, setMovingPriceEstimate] = useState<PriceEstimate | null>(null);
  const [aiStep, setAiStep] = useState<'tips' | 'upload' | 'items' | 'result'>('tips');
  const [newItemName, setNewItemName] = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);

  // Item Selection State
  const [selectedItems, setSelectedItems] = useState<DetectedItem[]>(() => {
    if (incomingState?.preselectItems) {
      return incomingState.preselectItems.map((item, idx) => ({
        id: `pre-${idx}-${Date.now()}`,
        name: item.name,
        quantity: item.quantity
      }));
    }
    return [];
  });
  const [manualStep, setManualStep] = useState<'select' | 'review' | 'result'>('select');
  const [manualPriceEstimate, setManualPriceEstimate] = useState<PriceEstimate | null>(null);
  const [manualPricingLoading, setManualPricingLoading] = useState(false);

  // Scroll refs
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const selectedItemsRef = useRef<HTMLDivElement>(null);
  const contentTopRef = useRef<HTMLDivElement>(null);

  const prevSelectedOptionRef = useRef(selectedOption);

  // Auto-scroll when moving between steps inside a flow (not when first entering from method picker)
  useEffect(() => {
    const prev = prevSelectedOptionRef.current;
    prevSelectedOptionRef.current = selectedOption;
    if (!selectedOption) return;
    if (prev === 'method' && (selectedOption === 'ai' || selectedOption === 'manual')) return;
    scrollToFlowStep(contentTopRef.current);
  }, [aiStep, manualStep, movingStep, donationStep, dumpsterStep, selectedOption]);

  // If all items get removed while on review, send user back to selection
  useEffect(() => {
    if (manualStep === 'review' && selectedItems.length === 0) {
      setManualStep('select');
    }
  }, [manualStep, selectedItems.length]);

  // ── Shared helpers ──
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

  // ── AI Photo handlers ──
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const compressedList = await Promise.all(
          Array.from(files).map(file => compressImage(file))
        );
        setImages(prev => [...prev, ...compressedList]);
        setEstimate(null);
        setDetectedItems([]);
        setLoadingState(LoadingState.IDLE);
      } catch (err) {
        console.error('Error compressing images:', err);
      }
      // Reset input value so the same file can be selected/taken again
      event.target.value = '';
    }
  };

  const removeUploadedImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    try {
      const payloadImages = images.map((imgStr) => {
        const base64Image = imgStr.split(',')[1];
        const mimeType = imgStr.split(';')[0].split(':')[1];
        return { base64Image, mimeType };
      });
      
      const allDetectedItems = await detectItemsFromPhotos(payloadImages);
      
      // Add detected items to standard selectedItems state
      setSelectedItems(prev => {
        const newItems = [...prev];
        allDetectedItems.forEach(newItem => {
          const existing = newItems.find(item => item.name.toLowerCase() === newItem.name.toLowerCase());
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            newItems.push({
              id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: newItem.name,
              quantity: newItem.quantity
            });
          }
        });
        return newItems;
      });

      // Clear AI temporary upload state and set loading state
      setImages([]);
      setDetectedItems([]);
      setLoadingState(LoadingState.IDLE);
      
      // Navigate user to manual review screen with auto-selected items
      setSelectedOption('manual');
      setManualStep('review');
    } catch (err: any) {
      console.error('AI analysis error:', err);
      setError(err?.message || 'Failed to analyze photos. Please try again.');
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleGetPrice = async () => {
    if (detectedItems.length === 0) return;
    setPricingLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const price = await calculateStaticPrice(detectedItems);
      setPriceEstimate(price);
      setEstimate({
        itemsDetected: detectedItems.map(i => `${i.quantity}x ${i.name}`),
        estimatedVolume: price.estimatedVolume,
        price: price.price,
        summary: price.summary,
        subtotal: price.subtotal,
        onlineBookingDiscount: price.onlineBookingDiscount,
      });
      setAiStep('result');
    } catch (err: any) {
      console.error('Pricing error:', err);
      setError(err?.message || 'Failed to calculate price. Please try again.');
    } finally {
      setPricingLoading(false);
    }
  };

  const updateItemQuantity = (id: string, delta: number) => {
    setDetectedItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setDetectedItems(prev => prev.filter(item => item.id !== id));
  };

  const addManualItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    setDetectedItems(prev => [...prev, { id: `manual-${Date.now()}`, name, quantity: 1 }]);
    setNewItemName('');
  };

  const getItemImage = getCatalogItemImage;

  // ── Item Selection handlers ──
  const toggleCatalogItem = (itemName: string) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.name === itemName);
      if (existing) {
        return prev.filter(i => i.name !== itemName);
      }
      return [...prev, { id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: itemName, quantity: 1 }];
    });
  };

  const updateSelectedQuantity = (id: string, delta: number) => {
    setSelectedItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeSelectedItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleGetManualPrice = async () => {
    if (selectedItems.length === 0) return;
    setManualPricingLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const price = await calculateStaticPrice(selectedItems);
      setManualPriceEstimate(price);
      setEstimate({
        itemsDetected: selectedItems.map(i => `${i.quantity}x ${i.name}`),
        estimatedVolume: price.estimatedVolume,
        price: price.price,
        summary: price.summary,
        subtotal: price.subtotal,
        onlineBookingDiscount: price.onlineBookingDiscount,
      });
      setManualStep('result');
    } catch (err: any) {
      console.error('Pricing error:', err);
      setError(err?.message || 'Failed to calculate price. Please try again.');
    } finally {
      setManualPricingLoading(false);
    }
  };

  // Auto-trigger review step if preselected items are provided from service page
  useEffect(() => {
    if (zipVerified && incomingState?.preselectItems && selectedItems.length > 0 && manualStep === 'select') {
      setManualStep('review');
    }
  }, [zipVerified, incomingState, selectedItems, manualStep]);

  const isItemSelected = (itemName: string) => selectedItems.some(i => i.name === itemName);

  const totalSelectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleContactReveal = async (
    name: string,
    phone: string,
    consentAt: string | null,
    items: DetectedItem[],
    price: PriceEstimate
  ) => {
    setContactLoading(true);
    try {
      const detailsText = `Items: ${items.map(i => `${i.quantity}x ${i.name}`).join(', ')}\nEstimated Items: ${price.estimatedVolume}\nEstimated Price: $${price.price}`;
      
      const serviceTypeLabel = 
        selectedService === 'junk_removal' ? 'Junk Removal' :
        selectedService === 'donation_pickup' ? 'Donation Pick Up' :
        selectedService === 'moving_labor' ? 'Local Moving' :
        selectedService === 'dumpster_rental' ? 'Dumpster Rental' :
        'Junk Removal';

      let partialId = `mock-lead-${Date.now()}`;
      try {
        const photos = await persistBookingPhotos(images, `lead_${Date.now()}`);
        if (photos.photo_urls.length > 0) {
          setImages(photos.photo_urls);
        }

        const customerInfo = withSmsMarketingConsent({ name, phone, email: '' }, consentAt);

        const bookingDetails = withBookingPhotos(
          {
            service_type: serviceTypeLabel,
            zip_code: zipValue || null,
            details: detailsText,
            estimated_items: items.map(i => `${i.quantity}x ${i.name}`),
            estimated_volume: price.estimatedVolume,
            price: price.price,
            estimate_summary: price.summary,
            ...(price.onlineBookingDiscount && price.onlineBookingDiscount > 0
              ? { online_booking_discount: price.onlineBookingDiscount }
              : {}),
          },
          photos
        );

        const { data, error: dbError } = await supabase.rpc('create_prebooking', {
          p_customer_info: customerInfo,
          p_booking_details: bookingDetails,
          p_status: 'partially_submitted'
        });

        if (dbError) {
          console.warn('Supabase lead capture failed, proceeding in mock mode:', dbError);
        } else if (data) {
          partialId = data as string;
        }
      } catch (err) {
        console.warn('Supabase lead capture failed, proceeding in mock mode:', err);
      }

      setPartialBookingId(partialId);
      setContactName(name);
      setContactPhone(phone);
      setSmsMarketingConsentAt(consentAt);
      setContactSubmitted(true);
    } catch (err) {
      console.error('Error in handleContactReveal:', err);
      setContactName(name);
      setContactPhone(phone);
      setSmsMarketingConsentAt(consentAt);
      setContactSubmitted(true);
    } finally {
      setContactLoading(false);
    }
  };

  // ── Shared price result renderer ──
  const renderPriceResult = (
    items: DetectedItem[],
    price: PriceEstimate,
    onEditBack: () => void,
    backLabel: string
  ) => {
    if (!contactSubmitted) {
      const serviceTypeLabel = 
        selectedService === 'junk_removal' ? 'Junk Removal' :
        selectedService === 'donation_pickup' ? 'Donation Pick Up' :
        selectedService === 'moving_labor' ? 'Local Moving' :
        selectedService === 'dumpster_rental' ? 'Dumpster Rental' :
        'Junk Removal';

      return (
        <div className="max-w-md mx-auto">
          <ContactIntakeForm
            serviceType={serviceTypeLabel}
            isLoading={contactLoading}
            onReveal={async (name, phone, consentAt) => {
              await handleContactReveal(name, phone, consentAt, items, price);
            }}
          />
        </div>
      );
    }

    const isSpecialService = selectedOption === 'moving_labor' || selectedOption === 'donation_pickup';

    return (
      <div className="space-y-6">
        <FlowStepTitle title="Your estimate" subtitle="Review your price breakdown, then continue to book." />

        <div className="bg-white border border-secondary-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-20 h-16 md:w-24 md:h-20 shrink-0">
            <img
              src={
                selectedService === 'junk_removal' ? '/process-step-1.svg' :
                selectedService === 'donation_pickup' ? '/opek-nav.svg' :
                selectedService === 'moving_labor' ? '/process-step-2.svg' :
                selectedService === 'dumpster_rental' ? '/dumpster-rental.svg' :
                '/process-step-1.svg'
              }
              alt="Service breakdown"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-secondary">
              {selectedService === 'junk_removal' ? 'Junk Removal' :
               selectedService === 'donation_pickup' ? 'Donation Pick Up' :
               selectedService === 'moving_labor' ? 'Local Moving' :
               selectedService === 'dumpster_rental' ? 'Dumpster Rental' :
               'Junk Removal'}
            </h3>
            <p className="text-secondary-500 text-xs mt-0.5">{price.estimatedVolume}</p>
          </div>
          <p className="text-2xl font-semibold text-secondary shrink-0">${price.price}</p>
        </div>

        {!isSpecialService ? (
          <JunkRemovalPriceBreakdown price={price} />
        ) : null}

        <p className="text-sm text-secondary-500 leading-relaxed">{price.summary}</p>

        <FlowStickyNav
          showBack
          onBack={onEditBack}
          backLabel={backLabel}
          onContinue={() => {
            setEstimate({
              itemsDetected: items.map(i => `${i.quantity}x ${i.name}`),
              estimatedVolume: price.estimatedVolume,
              price: price.price,
              summary: price.summary,
              subtotal: price.subtotal,
              onlineBookingDiscount: price.onlineBookingDiscount,
            });
            setShowBookingForm(true);
          }}
          continueLabel="Continue to book"
        />
        <p className="text-xs text-secondary-400 text-center">* Final price confirmed on-site</p>
      </div>
    );

  };

  // ── Booking form screen (embedded contact + address + review) ──
  if (showBookingForm && estimate) {
    const serviceTypeLabel =
      selectedService === 'junk_removal' ? 'Junk Removal'
      : selectedService === 'donation_pickup' ? 'Donation Pick Up'
      : selectedService === 'moving_labor' ? 'Moving Labor'
      : selectedService === 'dumpster_rental' ? 'Dumpster Rental'
      : 'Junk Removal';
    const defaultZip = zipResult ? { city: zipResult.city, state: zipResult.state, zipCode: zipValue } : undefined;

    return (
      <div className={FLOW_PAGE_SHELL}>
        <FlowProgressBar progress={0.95} />
        <div className={FLOW_PAGE_CONTENT}>
          <BookingDetailsForm
            estimate={estimate}
            image={images.length > 0 ? images[0] : null}
            images={images}
            serviceType={serviceTypeLabel}
            defaultZip={defaultZip}
            onBack={() => setShowBookingForm(false)}
            backLabel="Back"
            prefilledName={contactName}
            prefilledPhone={contactPhone}
            partialBookingId={partialBookingId}
            smsMarketingConsentAt={smsMarketingConsentAt}
            depositSource="quote"
          />
        </div>
      </div>
    );
  }

  // ── Submitted screen ──
  if (submitted) {
    const serviceTypeLabel =
      selectedService === 'junk_removal' ? 'Junk Removal'
      : selectedService === 'donation_pickup' ? 'Donation Pick Up'
      : selectedService === 'moving_labor' ? 'Moving Labor'
      : selectedService === 'dumpster_rental' ? 'Dumpster Rental'
      : 'Junk Removal';

    const activeEstimate = estimate ?? priceEstimate ?? manualPriceEstimate ?? movingPriceEstimate ?? dumpsterPriceEstimate;

    return (
      <SubmissionSuccessView
        title="Quote submitted"
        description="We saved your estimate. Use the details below when you're ready to book."
        summary={[
          { label: 'Service', value: serviceTypeLabel },
          ...(contactName ? [{ label: 'Name', value: contactName }] : []),
          ...(contactPhone ? [{ label: 'Phone', value: contactPhone }] : []),
          ...(zipValue ? [{ label: 'ZIP', value: zipValue }] : []),
          ...(activeEstimate?.estimatedVolume ? [{ label: 'Items', value: activeEstimate.estimatedVolume }] : []),
          ...(activeEstimate?.price != null ? [{ label: 'Estimate', value: `$${activeEstimate.price}` }] : []),
          ...(detectedItems.length
            ? [{ label: 'Items', value: detectedItems.map(i => `${i.quantity}x ${i.name}`).join(', ') }]
            : selectedItems.length
              ? [{ label: 'Items', value: selectedItems.map(i => `${i.quantity}x ${i.name}`).join(', ') }]
              : []),
        ]}
      />
    );
  }

  // ── ZIP check screen ──
  if (!zipVerified) {
    return (
      <div className={FLOW_PAGE_SHELL}>
        <FlowProgressBar progress={0.2} />
        <div className={FLOW_PAGE_CONTENT}>
          <FlowZipCheck
            title="Get a free quote"
            subtitle="Nationwide coverage in all 50 states — start with your ZIP code."
            zipValue={zipValue}
            onZipChange={(v) => { setZipValue(v); setZipError(null); setZipResult(null); }}
            onCheck={handleZipCheck}
            loading={zipLoading}
            error={zipError}
            result={zipResult?.servedCity ? { city: zipResult.city, state: zipResult.state } : null}
          />
        </div>
      </div>
    );
  }

  const handleQuoteServicePick = (id: ServicePickerId) => {
    setSelectedService(id);
    if (id === 'junk_removal') setSelectedOption('method');
    else setSelectedOption(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Service Selection screen ──
  if (!selectedService) {
    return (
      <div className={FLOW_PAGE_SHELL}>
        <FlowProgressBar progress={0.4} />
        <div className={FLOW_PAGE_CONTENT}>
          <ServiceTypePicker
            onSelect={handleQuoteServicePick}
            onBack={() => { setZipVerified(false); setZipResult(null); }}
          />
        </div>
      </div>
    );
  }

  // ── Junk Removal estimate flow (shared with booking) ──
  if (selectedService === 'junk_removal') {
    const junkWide = junkQuoteMode === 'manual' && junkQuoteManualStep === 'select';
    const junkProgress =
      junkQuoteManualStep === 'result' ? 0.9
      : junkQuoteMode === 'manual' && junkQuoteManualStep === 'review' ? 0.75
      : junkQuoteMode !== 'method' ? 0.65
      : 0.55;

    return (
      <div className={FLOW_PAGE_SHELL}>
        <FlowProgressBar progress={junkProgress} />
        <div className={`${flowPageMaxWidth(junkWide)} transition-all duration-300`}>
          <JunkRemovalEstimateFlow
            zipValue={zipValue}
            preselectItems={incomingState?.preselectItems}
            initialMode={
              incomingState?.quoteMethod === 'manual' || incomingState?.preselectItems?.length
                ? 'manual'
                : incomingState?.quoteMethod === 'ai'
                  ? 'ai'
                  : undefined
            }
            continueLabel="Continue to book"
            onContinue={(result) => {
              setEstimate(result.estimate);
              setImages(result.images);
              setContactName(result.contactName);
              setContactPhone(result.contactPhone);
              setSmsMarketingConsentAt(result.smsMarketingConsentAt);
              setPartialBookingId(result.partialBookingId);
              setContactSubmitted(true);
              setShowBookingForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setSelectedService(null);
              setSelectedOption(null);
            }}
            onModeChange={(mode, manualStep) => {
              setJunkQuoteMode(mode);
              setJunkQuoteManualStep(manualStep);
            }}
          />
        </div>
      </div>
    );
  }

  // ── Dedicated Moving Labor Quote Form ──
  if (selectedOption === 'moving_labor') {
    return (
      <div className={FLOW_PAGE_SHELL}>
        <FlowProgressBar progress={0.6} />
        <div className={FLOW_PAGE_CONTENT}>
          <MovingLaborEstimateFlow
            onBack={() => {
              setSelectedService(null);
              setSelectedOption(null);
            }}
            onContactReveal={async (name, phone, consentAt, est, price) => {
              await handleContactReveal(
                name,
                phone,
                consentAt,
                [{ id: 'moving-labor', name: est.itemsDetected[0] ?? 'Local Moving', quantity: 1 }],
                price
              );
            }}
            onComplete={(result) => {
              setEstimate(result.estimate);
              setMovingPriceEstimate(result.price);
              setContactName(result.contactName);
              setContactPhone(result.contactPhone);
              setSmsMarketingConsentAt(result.smsMarketingConsentAt);
              setContactSubmitted(true);
              setShowBookingForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            continueLabel="Continue to book"
            initialContact={
              contactName && contactPhone
                ? { name: contactName, phone: contactPhone, consentAt: smsMarketingConsentAt }
                : undefined
            }
          />
        </div>
      </div>
    );
  }

  // ── Dedicated Donations Pickup Quote Form ──
  if (selectedOption === 'donation_pickup') {
    const basePrice = donationSize === 'Bagged/Boxed Items' ? 95
      : donationSize === 'Few Furniture Items' ? 185
      : 325;
    
    const locationAdj = donationLocation === 'Curbside/Outside' ? -15
      : donationLocation === 'Garage/Porch' ? 0
      : donationLocation === 'Inside Home (Ground Floor)' ? 30
      : 60;
      
    const donationTotal = basePrice + locationAdj;

    const donationProgress = donationStep === 'result' ? 0.9 : donationStep === 'size' ? 0.75 : 0.6;

    return (
      <div className={FLOW_PAGE_SHELL}>
        <FlowProgressBar progress={donationProgress} />
        <div className={FLOW_PAGE_CONTENT}>

          {/* STEP 1: DETAILS */}
          {donationStep === 'details' && (
            <>
              <FlowStepTitle
                title="Schedule donation pickup"
                subtitle="Gently used items picked up and delivered to charity. Upfront pricing."
              />

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Preferred charity partner</label>
                  <div className="space-y-3">
                    {[
                      { label: 'No Preference', desc: 'First available partner charity' },
                      { label: 'Goodwill', desc: 'Deliver to nearest Goodwill drop-off' },
                      { label: 'Habitat ReStore', desc: 'Deliver to Habitat for Humanity ReStore' },
                      { label: 'Local Shelter', desc: 'Deliver to a local shelter or mission' },
                    ].map((charity) => (
                      <FlowSelectionCard
                        key={charity.label}
                        title={charity.label}
                        description={charity.desc}
                        selected={donationCharity === charity.label}
                        onClick={() => setDonationCharity(charity.label as any)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Tax donation receipt</label>
                  <div className="space-y-3">
                    {[
                      { label: 'Receipt Requested', value: true, desc: 'A tax receipt from the charity will be emailed' },
                      { label: 'No Receipt Needed', value: false, desc: 'Simply pick up and deliver the items' },
                    ].map((option) => (
                      <FlowSelectionCard
                        key={option.label}
                        title={option.label}
                        description={option.desc}
                        selected={donationReceipt === option.value}
                        onClick={() => setDonationReceipt(option.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <FlowStickyNav
                showBack
                onBack={() => { setSelectedService(null); setSelectedOption(null); }}
                onContinue={() => setDonationStep('size')}
              />
            </>
          )}

          {/* STEP 2: SIZE & LOCATION */}
          {donationStep === 'size' && (
            <>
              <FlowStepTitle
                title="Size & access"
                subtitle="Tell us how much there is and where the items are located."
              />

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Estimated size</label>
                  <div className="space-y-3">
                    {[
                      { label: 'Bagged/Boxed Items', desc: 'Clothes, toys, small housewares' },
                      { label: 'Few Furniture Items', desc: '1-3 large furniture pieces' },
                      { label: 'Full Room/Multiple Items', desc: 'Entire room set or major cleanout' },
                    ].map((size) => (
                      <FlowSelectionCard
                        key={size.label}
                        title={size.label}
                        description={size.desc}
                        selected={donationSize === size.label}
                        onClick={() => setDonationSize(size.label as any)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">Donation item location</label>
                  <div className="space-y-3">
                    {[
                      { label: 'Curbside/Outside', desc: 'Items are outside, ready on curb/driveway' },
                      { label: 'Garage/Porch', desc: 'Easy access, ground level external access' },
                      { label: 'Inside Home (Ground Floor)', desc: 'Ground floor inside entry' },
                      { label: 'Inside Home (Stairs)', desc: 'Upper floor, basement, or multi-level stairs' },
                    ].map((loc) => (
                      <FlowSelectionCard
                        key={loc.label}
                        title={loc.label}
                        description={loc.desc}
                        selected={donationLocation === loc.label}
                        onClick={() => setDonationLocation(loc.label as any)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <FlowStickyNav
                showBack
                onBack={() => setDonationStep('details')}
                onContinue={() => setDonationStep('result')}
                continueLabel="Get estimate"
              />
            </>
          )}

          {/* STEP 3: ESTIMATE RESULT */}
          {donationStep === 'result' && (
            <div>
              {renderPriceResult(
                [{ id: 'donation-pickup', name: `${donationSize} - Pickup from ${donationLocation} to ${donationCharity}`, quantity: 1 }],
                {
                  price: donationTotal,
                  estimatedVolume: donationSize,
                  summary: `Eco-friendly donation pickup service. The provider will deliver items to ${donationCharity === 'No Preference' ? 'a local partner charity' : donationCharity}. ${donationReceipt ? 'A tax donation receipt will be emailed.' : 'No tax receipt requested.'}`
                },
                () => setDonationStep('size'),
                "Back"
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Dedicated Dumpster Rental Quote Form ──
  if (selectedOption === 'dumpster_rental') {
    const dumpsterProgress = dumpsterStep === 'result' ? 0.9 : dumpsterStep === 'duration' ? 0.75 : 0.6;

    return (
      <div className={FLOW_PAGE_SHELL}>
        <FlowProgressBar progress={dumpsterProgress} />
        <div className={FLOW_PAGE_CONTENT}>

          {/* STEP 1: SIZE SELECTION */}
          {dumpsterStep === 'size' && (
            <>
              <FlowStepTitle
                title="Rent a dumpster"
                subtitle="Roll-off dumpster delivered to your site. Flat-rate pricing, flexible rental periods."
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
                    selected={dumpsterSize === `${size.label.toLowerCase()}` as any}
                    onClick={() => setDumpsterSize(`${size.label.toLowerCase()}` as any)}
                  />
                ))}
              </div>

              <FlowStickyNav
                showBack
                onBack={() => { setSelectedService(null); setSelectedOption(null); }}
                onContinue={() => setDumpsterStep('duration')}
              />
            </>
          )}

          {/* STEP 2: DURATION SELECTION */}
          {dumpsterStep === 'duration' && (
            <>
              <FlowStepTitle
                title="Rental duration"
                subtitle="Base rate includes 7 days. Extra days: $25/day. 14+ day rentals get 10% off."
              />
              <div className="bg-white border border-secondary-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-secondary">Rental period</p>
                  <p className="text-xs text-secondary-500 mt-0.5">{dumpsterDuration} day{dumpsterDuration > 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 border border-secondary-200 rounded-full px-2 py-1">
                  <button
                    onClick={() => setDumpsterDuration(d => Math.max(1, d - 1))}
                    disabled={dumpsterDuration <= 1}
                    className="w-8 h-8 rounded-full hover:bg-secondary-50 text-secondary disabled:opacity-30 flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-secondary">{dumpsterDuration}</span>
                  <button
                    onClick={() => setDumpsterDuration(d => Math.min(30, d + 1))}
                    className="w-8 h-8 rounded-full hover:bg-secondary-50 text-secondary flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 mt-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <FlowStickyNav
                showBack
                onBack={() => setDumpsterStep('size')}
                continueLabel="Get estimate"
                continueLoading={pricingLoading}
                onContinue={async () => {
                  setPricingLoading(true);
                  setError(null);
                  try {
                    const price = await calculateDumpsterRentalPrice({ size: dumpsterSize, duration: dumpsterDuration });
                    setDumpsterPriceEstimate(price);
                    setDumpsterStep('result');
                  } catch (err: any) {
                    console.error('Pricing error:', err);
                    setError(err?.message || 'Failed to calculate price. Please try again.');
                  } finally {
                    setPricingLoading(false);
                  }
                }}
              />
            </>
          )}

          {/* STEP 3: ESTIMATE RESULT */}
          {dumpsterStep === 'result' && dumpsterPriceEstimate && (
            <div>
              {renderPriceResult(
                [{ id: 'dumpster-rental', name: `${dumpsterSize} dumpster rental - ${dumpsterDuration} days`, quantity: 1 }],
                dumpsterPriceEstimate,
                () => setDumpsterStep('duration'),
                "Back"
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

};
