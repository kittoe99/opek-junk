import React, { useState, useRef, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Camera, Upload, Loader2, Check, Plus, Minus, Trash2, Search, ListChecks, Armchair, Plug, Monitor, TreePine, HardHat, Warehouse, Package, ChevronDown, BedDouble, ScanSearch, Receipt, ArrowRight, ArrowLeft, X, MapPin, AlertCircle, CheckCircle2, Heart, HeartHandshake, Truck, BicepsFlexed, Download, RefreshCw, Home, Clock, PackagePlus, PackageMinus, ArrowLeftRight, Boxes, ShieldCheck, Container, Users, Sliders, ClipboardList, Eye, CalendarCheck, Sparkles, Sun, Maximize, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JunkIcon, MovingLaborIcon, DumpsterIcon, LoadingIcon, UnloadingIcon, LoadingUnloadingIcon, StorageUnitIcon, BoxTruckIcon, InsideHomeIcon, OtherMoveIcon, TwoHelpersIcon, ThreeHelpersIcon, InputZipIcon, InputMessageIcon } from './icons/ServiceIcons';
import { ITEM_CATALOG, type CatalogItem, type CatalogCategory } from '../lib/itemCatalog';
import { EstimateMethodHero, EstimateMethodSelection } from './shared/EstimateMethodSelection';
import { detectItemsFromPhotos } from '../services/openaiService';
import { ItemIconRenderer } from './icons/JunkItemIcons';
import { calculateStaticPrice, calculateDumpsterRentalPrice, DumpsterRentalOptions, calculateMovingLaborPrice } from '../services/pricingService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState } from '../types';
import { TrustBadges } from './TrustBadges';
import { BookingDetailsForm } from './BookingDetailsForm';
import { supabase, uploadBookingPhoto } from '../lib/supabase';
import { ContactIntakeForm } from './shared/ContactIntakeForm';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import { JunkItemCatalogSelector, getCatalogItemImage } from './shared/JunkItemCatalogSelector';

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

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [partialBookingId, setPartialBookingId] = useState<string | null>(null);

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

  // ── Smooth scroll helper ──
  const scrollToElement = useCallback((el: HTMLElement | null, offset = -100) => {
    if (!el) return;
    setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  }, []);

  const prevSelectedOptionRef = useRef(selectedOption);

  // Auto-scroll when moving between steps inside a flow (not when first entering from method picker)
  useEffect(() => {
    const prev = prevSelectedOptionRef.current;
    prevSelectedOptionRef.current = selectedOption;
    if (!selectedOption) return;
    if (prev === 'method' && (selectedOption === 'ai' || selectedOption === 'manual')) return;
    scrollToElement(contentTopRef.current, -120);
  }, [aiStep, manualStep, movingStep, donationStep, dumpsterStep, scrollToElement, selectedOption]);

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

  const handleContactReveal = async (name: string, phone: string, items: DetectedItem[], price: PriceEstimate) => {
    setContactLoading(true);
    try {
      const detailsText = `Items: ${items.map(i => `${i.quantity}x ${i.name}`).join(', ')}\nEstimated Volume: ${price.estimatedVolume}\nEstimated Price: $${price.price}`;
      
      const serviceTypeLabel = 
        selectedService === 'junk_removal' ? 'Junk Removal' :
        selectedService === 'donation_pickup' ? 'Donation Pick Up' :
        selectedService === 'moving_labor' ? 'Moving Labor' :
        selectedService === 'dumpster_rental' ? 'Dumpster Rental' :
        'Junk Removal';

      let partialId = `mock-lead-${Date.now()}`;
      try {
        let uploadedUrl = images[0] || '';
        if (uploadedUrl && uploadedUrl.startsWith('data:')) {
          const fileName = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
          const publicUrl = await uploadBookingPhoto(uploadedUrl, fileName);
          if (publicUrl) {
            uploadedUrl = publicUrl;
            setImages(prev => [publicUrl, ...prev.slice(1)]);
          }
        }

        const customerInfo = {
          name,
          phone,
          email: ''
        };

        const bookingDetails = {
          service_type: serviceTypeLabel,
          zip_code: zipValue || null,
          details: detailsText,
          estimated_items: items.map(i => `${i.quantity}x ${i.name}`),
          estimated_volume: price.estimatedVolume,
          price: price.price,
          estimate_summary: price.summary,
          photo_url: uploadedUrl
        };

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
      setContactSubmitted(true);
    } catch (err) {
      console.error('Error in handleContactReveal:', err);
      setContactName(name);
      setContactPhone(phone);
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
        selectedService === 'moving_labor' ? 'Moving Labor' :
        selectedService === 'dumpster_rental' ? 'Dumpster Rental' :
        'Junk Removal';

      return (
        <div className="max-w-md mx-auto">
          <ContactIntakeForm
            serviceType={serviceTypeLabel}
            isLoading={contactLoading}
            onReveal={async (name, phone) => {
              await handleContactReveal(name, phone, items, price);
            }}
          />
        </div>
      );
    }

    const pickupFee = Math.round(price.price * 0.65);
    const disposalFee = price.price - pickupFee;
    const isSpecialService = selectedOption === 'moving_labor' || selectedOption === 'donation_pickup';

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2 mb-2">
          <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
            <Receipt className="w-6 h-6 text-brand" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Your Estimate</h2>
          <p className="text-secondary-400 text-xs">Review your price breakdown, then continue to book.</p>
        </div>

        {/* Elegant Premium Service Card with Shrunk Image */}
        <div className="bg-white border border-secondary-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-24 h-20 md:w-32 md:h-24 shrink-0">
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
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-brand/10 text-brand text-[9px] font-black uppercase tracking-wider rounded-full border border-brand/20">
                Instant Estimate
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                Guaranteed
              </span>
            </div>
            <h3 className="text-sm md:text-base font-black text-secondary">
              {selectedService === 'junk_removal' ? 'Junk Removal' :
               selectedService === 'donation_pickup' ? 'Donation Pick Up' :
               selectedService === 'moving_labor' ? 'Moving Labor' :
               selectedService === 'dumpster_rental' ? 'Dumpster Rental' :
               'Junk Removal'}
            </h3>
            <p className="text-secondary-400 text-xs mt-1 leading-normal">
              {price.estimatedVolume}
            </p>
          </div>
        </div>

        {/* Price header breakdown */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-secondary-100">
          {!isSpecialService && (
            <div className="space-y-3 mb-5 pb-5 border-b border-secondary-100">
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-secondary-600 font-medium">Pick up & Admin fee</span>
                <span className="text-secondary-900 font-bold">${pickupFee}</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base">
                <span className="text-secondary-600 font-medium">Disposal & Landfill fee</span>
                <span className="text-secondary-900 font-bold">${disposalFee}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] md:text-xs font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</p>
              <p className="text-xs text-secondary-500 mt-1">{price.estimatedVolume}</p>
            </div>
            <p className="text-3xl md:text-4xl font-black text-brand">${price.price}</p>
          </div>
        </div>

        {/* Safe Protect Sticker */}
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
                onClick={() => setShowInsuranceModal(true)} 
                className="text-emerald-900 font-bold hover:underline"
              >
                Learn more
              </button>
            </p>
          </div>
        </div>

        {/* Items list - minimal */}
        <div>
          <p className="text-[10px] font-medium text-secondary-400 uppercase tracking-wider mb-3">
            {items.reduce((sum, i) => sum + i.quantity, 0)} items
          </p>
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">{item.name}</span>
                {item.quantity > 1 && <span className="text-secondary-400 text-xs">×{item.quantity}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-secondary-500 leading-relaxed">{price.summary}</p>

        {/* CTA */}
        <div className="space-y-3 pt-2">
          <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
            <button
              onClick={() => {
                setEstimate({
                  itemsDetected: items.map(i => `${i.quantity}x ${i.name}`),
                  estimatedVolume: price.estimatedVolume,
                  price: price.price,
                  summary: price.summary,
                });
                setShowBookingForm(true);
              }}
              className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-sm font-black uppercase tracking-wider">
                Continue
              </span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
          <button onClick={onEditBack} className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> {backLabel}
          </button>
          <p className="text-[10px] text-secondary-300 text-center">* Final price confirmed on-site</p>
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
                  onClick={() => setShowInsuranceModal(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-secondary-100 flex items-center justify-center text-secondary transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
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
                      <p className="text-[11px] text-secondary-400 mt-0.5 leading-normal">Subject to availability, local crews can get to your site on the same day.</p>
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
                onClick={() => setShowInsuranceModal(false)}
                className="w-full mt-6 py-3 bg-secondary hover:bg-brand text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-secondary/15 transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        )}
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
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-8 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowBookingForm(false)}
            className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">
            Book your <span className="text-brand">{selectedService === 'moving_labor' ? 'service' : 'pickup'}.</span>
          </h1>
          <p className="text-sm text-secondary-400">Contact, schedule, address, review, and deposit. A matched provider confirms within 15 minutes.</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Mini estimate banner */}
          <div className="bg-secondary-50/50 rounded-3xl p-5 md:p-6 border border-secondary-100 mb-8 flex items-end justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</p>
              <p className="text-xs text-secondary-500 mt-0.5">{estimate.estimatedVolume}</p>
            </div>
            <p className="text-2xl font-black text-brand">${estimate.price}</p>
          </div>

          <BookingDetailsForm
            estimate={estimate}
            image={images.length > 0 ? images[0] : null}
            serviceType={serviceTypeLabel}
            defaultZip={defaultZip}
            onBack={() => setShowBookingForm(false)}
            backLabel="Back"
            prefilledName={contactName}
            prefilledPhone={contactPhone}
            partialBookingId={partialBookingId}
          />
        </div>

        <div>
          <TrustBadges />
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
          ...(activeEstimate?.estimatedVolume ? [{ label: 'Volume', value: activeEstimate.estimatedVolume }] : []),
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
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">Get a <span className="text-brand">free quote.</span></h1>
          <p className="text-sm text-secondary-400">Nationwide coverage in all 50 states — start by confirming your ZIP.</p>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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

            {/* Error */}
            {zipError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{zipError}</p>
              </div>
            )}

            {/* Served */}
            {zipResult?.servedCity && (
              <div className="flex items-center gap-2 pt-1 mb-4">
                <Check size={14} className="text-brand shrink-0" strokeWidth={3} />
                <span className="text-sm font-bold text-secondary">{zipResult.city}, {zipResult.state}</span>
                <span className="text-xs text-secondary-400 ml-auto">Continuing...</span>
              </div>
            )}

            <p className="text-[10px] text-secondary-300 mt-4 text-center">
              Nationwide coverage · Available in all 50 states
            </p>
          </div>

        </div>

        <div>
          <TrustBadges />
        </div>
      </div>
    );
  }

  // ── Service Selection screen ──
  if (!selectedService) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">What do you <span className="text-brand">need?</span></h1>
          <p className="text-sm text-secondary-400">Select a service below to continue.</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 gap-3 mb-12 max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedService('junk_removal');
                setSelectedOption('method');
              }}
              className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 hover:scale-[1.01] transition-all p-4 rounded-2xl text-left flex items-center gap-4 group"
            >
              <div className="w-14 h-14 shrink-0 text-secondary-400 group-hover:text-secondary-900 transition-colors ml-1">
                <JunkIcon className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-black text-secondary mb-0.5 group-hover:text-brand transition-colors">Junk Removal</h3>
                <p className="text-secondary-400 text-xs md:text-sm">Service providers haul away your unwanted items</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedService('moving_labor');
                setSelectedOption('moving_labor');
              }}
              className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 hover:scale-[1.01] transition-all p-4 rounded-2xl text-left flex items-center gap-4 group"
            >
              <div className="w-14 h-14 shrink-0 text-secondary-400 group-hover:text-secondary-900 transition-colors ml-1">
                <MovingLaborIcon className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-black text-secondary mb-0.5 group-hover:text-brand transition-colors">Moving Labor</h3>
                <p className="text-secondary-400 text-xs md:text-sm">Hourly labor for heavy lifting</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
              </div>
            </button>
            <button
              disabled
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
        </div>
      </div>
    );
  }

  // ── Dedicated Moving Labor Quote Form ──
  if (selectedOption === 'moving_labor') {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {movingStep !== 'result' && (
            <>
              <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">Book <span className="text-brand">moving labor.</span></h1>
              <p className="text-sm text-secondary-400">Professional heavy-lifting assistance. 2-hour minimum applies.</p>
            </>
          )}
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

          {/* STEP 1: SERVICE SELECTION */}
          {movingStep === 'service' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Service Selection */}
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
                        onClick={() => setMovingServiceType(service.label as any)}
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
                  onClick={() => { setSelectedService(null); setSelectedOption(null); }}
                  className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft size={12} /> Back
                </button>
              </div>

              <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                <button
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
              {/* Move Type */}
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
                        onClick={() => setMovingType(type.label as any)}
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
                  onClick={() => setMovingStep('service')}
                  className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft size={12} /> Back
                </button>
              </div>

              <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                <button
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
               {/* Helpers Selection */}
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

              {/* Hours Selection */}
              <div>
                <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2.5">Estimated Hours (2 hr min)</label>
                <div className="flex items-center justify-between p-4 bg-white border border-secondary-100 rounded-xl gap-4 transition-all duration-200 hover:border-secondary-300">
                  <div>
                    <div className="text-sm font-bold text-secondary">Time Needed</div>
                    <div className="text-xs text-secondary-400 mt-0.5">{movingHours} hours selected</div>
                  </div>
                  <div className="flex items-center gap-1 border border-secondary-100 rounded-lg p-1 bg-white">
                    <button
                      onClick={() => setMovingHours(h => Math.max(2, h - 1))}
                      disabled={movingHours <= 2}
                      className="w-8 h-8 rounded bg-transparent hover:bg-secondary-50 text-secondary disabled:opacity-30 flex items-center justify-center transition-colors"
                    >
                      <Minus size={14} strokeWidth={2.5} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-secondary">{movingHours}</span>
                    <button
                      onClick={() => setMovingHours(h => Math.min(12, h + 1))}
                      className="w-8 h-8 rounded bg-transparent hover:bg-secondary-50 text-secondary flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={() => setMovingStep('type')}
                  disabled={pricingLoading}
                  className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <ArrowLeft size={12} /> Back
                </button>
              </div>

              <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                <button
                  onClick={async () => {
                    setPricingLoading(true);
                    setError(null);
                    try {
                      const price = await calculateMovingLaborPrice(movingHelpers, movingHours);
                      setMovingPriceEstimate(price);
                      setMovingStep('result');
                    } catch (err: any) {
                      console.error('Pricing error:', err);
                      setError(err?.message || 'Failed to calculate price. Please try again.');
                    } finally {
                      setPricingLoading(false);
                    }
                  }}
                  disabled={pricingLoading}
                  className="group w-full flex items-center justify-center gap-2 px-5 py-4 bg-brand hover:bg-brand-600 text-white rounded-xl shadow-2xl shadow-brand/40 hover:shadow-brand/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ScanSearch size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-black uppercase tracking-wider">Get Estimate</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {pricingLoading && movingStep === 'crew' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
                <p className="text-secondary-600 text-sm font-medium">Calculating your estimate...</p>
              </div>
            </div>
          )}

          {/* STEP 4: ESTIMATE RESULT */}
          {movingStep === 'result' && movingPriceEstimate && (
            <div>
              {renderPriceResult(
                [{ id: 'moving-labor', name: `${movingServiceType} (${movingType}) - ${movingHelpers} Helpers, ${movingHours} hrs`, quantity: 1 }],
                movingPriceEstimate,
                () => setMovingStep('crew'),
                "Back"
              )}
            </div>
          )}
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

    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              if (donationStep === 'size') {
                setDonationStep('details');
              } else if (donationStep === 'result') {
                setDonationStep('size');
              } else {
                setSelectedService(null);
                setSelectedOption(null);
              }
            }}
            className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
          {donationStep !== 'result' && (
            <>
              <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">Schedule <span className="text-brand">donation pickup.</span></h1>
              <p className="text-sm text-secondary-400">Gently used items picked up and delivered to charity. Upfront pricing.</p>
            </>
          )}
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8 animate-in fade-in duration-300">

          {/* STEP 1: DETAILS */}
          {donationStep === 'details' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Charity Preference */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Preferred Charity Partner</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'No Preference', desc: 'First available partner charity', icon: HeartHandshake },
                    { label: 'Goodwill', desc: 'Deliver to nearest Goodwill drop-off', icon: Truck },
                    { label: 'Habitat ReStore', desc: 'Deliver to Habitat for Humanity ReStore', icon: Home },
                    { label: 'Local Shelter', desc: 'Deliver to a local shelter or mission', icon: Heart }
                  ].map((charity) => {
                    const isSelected = donationCharity === charity.label;
                    const Icon = charity.icon;
                    return (
                      <button
                        key={charity.label}
                        onClick={() => setDonationCharity(charity.label as any)}
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
                        <Icon size={16} className={`shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-brand' : 'text-secondary-400'}`} />
                        <div>
                          <span className="block text-sm font-semibold text-secondary transition-colors">
                            {charity.label}
                          </span>
                          <span className="block text-[11px] mt-0.5 font-normal text-secondary-400 leading-normal">
                            {charity.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tax Receipt Needed */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Tax Donation Receipt</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Receipt Requested', value: true, desc: 'A tax receipt from the charity will be emailed', icon: Receipt },
                    { label: 'No Receipt Needed', value: false, desc: 'Simply pick up and deliver the items', icon: Check }
                  ].map((option) => {
                    const isSelected = donationReceipt === option.value;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.label}
                        onClick={() => setDonationReceipt(option.value)}
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
                        <Icon size={16} className={`shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-brand' : 'text-secondary-400'}`} />
                        <div>
                          <span className="block text-sm font-semibold text-secondary transition-colors">
                            {option.label}
                          </span>
                          <span className="block text-[11px] mt-0.5 font-normal text-secondary-400 leading-normal">
                            {option.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setDonationStep('size')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-brand text-white rounded-full transition-all duration-300 font-semibold text-xs uppercase tracking-wider"
                >
                  Continue <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => { setSelectedService(null); setSelectedOption(null); }}
                  className="w-full py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-secondary-400 hover:text-secondary-600 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SIZE & LOCATION */}
          {donationStep === 'size' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Size estimation */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Estimated Size</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Bagged/Boxed Items', desc: 'Clothes, toys, small housewares', icon: Package },
                    { label: 'Few Furniture Items', desc: '1-3 large furniture pieces', icon: Armchair },
                    { label: 'Full Room/Multiple Items', desc: 'Entire room set or major cleanout', icon: Boxes }
                  ].map((size) => {
                    const isSelected = donationSize === size.label;
                    const Icon = size.icon;
                    return (
                      <button
                        key={size.label}
                        onClick={() => setDonationSize(size.label as any)}
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
                        <Icon size={16} className={`shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-brand' : 'text-secondary-400'}`} />
                        <div>
                          <span className="block text-sm font-semibold text-secondary transition-colors">
                            {size.label}
                          </span>
                          <span className="block text-[11px] mt-0.5 font-normal text-secondary-400 leading-normal">
                            {size.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Access Location */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Donation Item Location</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Curbside/Outside', desc: 'Items are outside, ready on curb/driveway', icon: Truck },
                    { label: 'Garage/Porch', desc: 'Easy access, ground level external access', icon: Warehouse },
                    { label: 'Inside Home (Ground Floor)', desc: 'Ground floor inside entry', icon: Home },
                    { label: 'Inside Home (Stairs)', desc: 'Upper floor, basement, or multi-level stairs', icon: ArrowLeftRight }
                  ].map((loc) => {
                    const isSelected = donationLocation === loc.label;
                    const Icon = loc.icon;
                    return (
                      <button
                        key={loc.label}
                        onClick={() => setDonationLocation(loc.label as any)}
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
                        <Icon size={16} className={`shrink-0 mt-0.5 transition-colors ${isSelected ? 'text-brand' : 'text-secondary-400'}`} />
                        <div>
                          <span className="block text-sm font-semibold text-secondary transition-colors">
                            {loc.label}
                          </span>
                          <span className="block text-[11px] mt-0.5 font-normal text-secondary-400 leading-normal">
                            {loc.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setDonationStep('result')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-brand text-white rounded-full transition-all duration-300 font-semibold text-xs uppercase tracking-wider"
                >
                  Get Estimate <ArrowRight size={14} />
                </button>
              </div>
            </div>
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
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              if (dumpsterStep === 'duration') {
                setDumpsterStep('size');
              } else if (dumpsterStep === 'result') {
                setDumpsterStep('duration');
              } else {
                setSelectedService(null);
                setSelectedOption(null);
              }
            }}
            className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
          {dumpsterStep !== 'result' && (
            <>
              <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">Rent a <span className="text-brand">dumpster.</span></h1>
              <p className="text-sm text-secondary-400">Roll-off dumpster delivered to your site. Flat-rate pricing, flexible rental periods.</p>
            </>
          )}
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">

          {/* STEP 1: SIZE SELECTION */}
          {dumpsterStep === 'size' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Select Dumpster Size</label>
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-brand text-white rounded-full transition-all duration-300 font-semibold text-xs uppercase tracking-wider"
                >
                  Continue <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => { setSelectedService(null); setSelectedOption(null); }}
                  className="w-full py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-secondary-400 hover:text-secondary-600 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DURATION SELECTION */}
          {dumpsterStep === 'duration' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Rental Duration</label>
                <div className="flex items-center justify-between p-4 bg-white border border-secondary-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-secondary-400" />
                    <div>
                      <div className="text-sm font-semibold text-secondary">Rental Period</div>
                      <div className="text-[11px] text-secondary-400">{dumpsterDuration} day{dumpsterDuration > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 bg-white border border-secondary-100 rounded-xl p-1.5 w-max">
                    <button
                      onClick={() => setDumpsterDuration(d => Math.max(1, d - 1))}
                      disabled={dumpsterDuration <= 1}
                      className="w-8 h-8 rounded-lg bg-white text-secondary hover:text-brand hover:border-brand border border-transparent shadow-sm disabled:opacity-50 disabled:hover:border-transparent disabled:hover:text-secondary flex items-center justify-center transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-base font-bold text-brand">{dumpsterDuration}</span>
                    <button
                      onClick={() => setDumpsterDuration(d => Math.min(30, d + 1))}
                      className="w-8 h-8 rounded-lg bg-white text-secondary hover:text-brand hover:border-brand border border-transparent shadow-sm flex items-center justify-center transition-all"
                    >
                      <Plus size={14} />
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
                  disabled={pricingLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-brand text-white rounded-full transition-all duration-300 font-semibold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {pricingLoading ? 'Calculating...' : 'Get Estimate'}
                  {pricingLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </button>
                <button
                  onClick={() => setDumpsterStep('size')}
                  className="w-full py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-secondary-400 hover:text-secondary-600 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </div>
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

  // ── Method Selection screen ──
  if (selectedOption === 'method') {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <EstimateMethodHero />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <EstimateMethodSelection
                onPhotoEstimate={() => {
                  setAiStep('tips');
                  setSelectedOption('ai');
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }}
                onSelectItems={() => {
                  flushSync(() => {
                    setManualStep('select');
                    setSelectedOption('manual');
                  });
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }}
              />
        </div>
      </div>
    );
  }

  // ── Main flow ──
  return (
    <div className="min-h-screen bg-white">
      <div className={`pt-32 pb-10 md:pt-40 md:pb-12 mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${selectedOption === 'manual' && manualStep === 'select' ? 'max-w-5xl' : 'max-w-2xl'}`}>

        {((selectedOption === 'ai' && aiStep !== 'result') || (selectedOption === 'manual' && manualStep !== 'result')) && (
          <div ref={contentTopRef} className="mb-6">
            <h2 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">
              {selectedOption === 'ai'
                ? <><span className="text-brand">AI photo</span> estimate.</>  
                : manualStep === 'review'
                  ? <>Review your <span className="text-brand">list.</span></>  
                  : <>Pick your <span className="text-brand">items.</span></>}
            </h2>
            <p className="text-sm text-secondary-400">
              {selectedOption === 'ai'
                ? 'Upload a photo and we\'ll estimate the cost automatically.'
                : manualStep === 'review'
                  ? 'Confirm your items to calculate the estimate.'
                  : 'Browse categories and pick what you need.'}
            </p>
          </div>
        )}
      </div>

      <div className={`mx-auto px-4 sm:px-6 lg:px-8 pb-8 transition-all duration-300 ${selectedOption === 'manual' && manualStep === 'select' ? 'max-w-5xl' : 'max-w-2xl'}`}>

          {/* ===== AI PHOTO CONTENT ===== */}
          {selectedOption === 'ai' && (
            <div>

              {/* Step 0: Photo Tips */}
              {aiStep === 'tips' && (
                <div className="space-y-6">
                  <div className="text-center mb-2">
                    <p className="text-[10px] font-black text-brand uppercase tracking-wider mb-2">Photo Tips</p>
                    <h3 className="text-lg md:text-xl font-black text-secondary">Take clear photos for best results</h3>
                  </div>

                  {/* Photo Tips Minimalist Layout */}
                  <div className="space-y-5">
                    {[
                      {
                        title: 'Good lighting',
                        desc: 'Take photos in daylight or well-lit areas. Avoid dark shadows.'
                      },
                      {
                        title: 'All items visible',
                        desc: 'Make sure everything you want removed is in the frame.'
                      },
                      {
                        title: 'Items only',
                        desc: 'Photos of just the junk items work best. Avoid people or pets.'
                      },
                      {
                        title: 'Multiple angles',
                        desc: 'For large piles, you can upload several photos of different sections.'
                      }
                    ].map((tip, idx) => (
                      <div key={idx} className="flex gap-4">
                        <Check size={16} className="text-brand shrink-0 mt-0.5" strokeWidth={3} />
                        <div>
                          <h4 className="text-sm font-bold text-secondary mb-0.5">{tip.title}</h4>
                          <p className="text-xs text-secondary-400 leading-relaxed">{tip.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setAiStep('upload')}
                    className="w-full py-4 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand transition-colors rounded-xl inline-flex items-center justify-center gap-2 mt-4"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Step 1: Upload */}
              {aiStep === 'upload' && (
                <>
                  {/* Hidden inputs defined once at the top level */}
                  <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" multiple onChange={handleFileChange} />
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />

                  {images.length === 0 ? (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full md:border border-secondary-100 hover:border-brand transition-all p-6 bg-white rounded-2xl text-left flex items-center gap-4 group"
                      >
                        <Camera size={24} className="text-brand shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-base font-black text-secondary mb-0.5">Take Photo</h3>
                          <p className="text-secondary-400 text-sm">Use your camera to capture the junk</p>
                        </div>
                        <ArrowRight size={18} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full md:border border-secondary-100 hover:border-brand transition-all p-6 bg-white rounded-2xl text-left flex items-center gap-4 group"
                      >
                        <Upload size={24} className="text-secondary shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-base font-black text-secondary mb-0.5">Upload Photo</h3>
                          <p className="text-secondary-400 text-sm">Choose an existing photo from your device</p>
                        </div>
                        <ArrowRight size={18} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                      </button>

                      <button
                        onClick={() => setAiStep('tips')}
                        className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Grid of thumbnails */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {images.map((imgSrc, index) => (
                          <div key={index} className="relative aspect-[4/3] border border-secondary-100 bg-white overflow-hidden rounded-xl">
                            <img src={imgSrc} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
                            {loadingState !== LoadingState.ANALYZING && (
                              <button
                                onClick={() => removeUploadedImage(index)}
                                className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center transition-colors text-xs font-bold border border-white/20 rounded-full shadow"
                                aria-label="Remove photo"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Sequential upload/capture buttons */}
                      {loadingState !== LoadingState.ANALYZING && (
                        <div className="flex gap-2.5">
                          <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex-1 py-3 border border-secondary-100 hover:border-brand hover:text-brand bg-white text-secondary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-xl"
                          >
                            <Camera size={14} /> Take another
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 py-3 border border-secondary-100 hover:border-brand hover:text-brand bg-white text-secondary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-xl"
                          >
                            <Upload size={14} /> Add more
                          </button>
                        </div>
                      )}

                      {loadingState === LoadingState.IDLE && (
                        <button onClick={handleAnalyze} className="group w-full py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand hover:shadow-lg transition-all duration-300 rounded-xl inline-flex items-center justify-center gap-2">
                          <ScanSearch size={14} /> Analyze {images.length === 1 ? 'Photo' : `${images.length} Photos`}
                        </button>
                      )}
                      
                      {loadingState === LoadingState.ANALYZING && (
                        <div className="py-12 text-center">
                          <Loader2 size={40} className="animate-spin mx-auto mb-3 text-brand" />
                          <p className="text-secondary-400 text-sm">Identifying items in your {images.length === 1 ? 'photo' : 'photos'}...</p>
                        </div>
                      )}
                      
                      {loadingState === LoadingState.ERROR && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                          <p className="text-red-700 text-sm font-bold mb-1">Failed to analyze photo{images.length > 1 ? 's' : ''}</p>
                          {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
                          <button onClick={handleAnalyze} className="text-sm font-bold text-secondary underline hover:text-brand transition-colors">Try again</button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Review & Edit Items */}
              {aiStep === 'items' && (
                <div className="space-y-6">
                  {images.length > 0 && (
                    <div className="flex gap-4 items-start p-4 border border-secondary-100 rounded-xl bg-white">
                      <img src={images[0]} alt="Your photo" className="w-20 h-20 object-cover rounded-lg border border-secondary-100" />
                      <div>
                        <p className="text-sm font-black text-secondary">{detectedItems.length} items detected</p>
                        <p className="text-xs text-secondary-400 mt-1">Review, edit quantities, remove items, or add any additional items.</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    {detectedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-secondary-100 bg-white">
                        <ItemIconRenderer imagePath={getItemImage(item.name)} className="w-10 h-10 object-contain" />
                        <span className="flex-1 text-sm font-medium text-secondary">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateItemQuantity(item.id, -1)} className="w-7 h-7 rounded-md border border-secondary-100 bg-white flex items-center justify-center hover:border-brand transition-colors">
                            <Minus size={14} className="text-secondary-500" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-secondary">{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item.id, 1)} className="w-7 h-7 rounded-md border border-secondary-100 bg-white flex items-center justify-center hover:border-brand transition-colors">
                            <Plus size={14} className="text-secondary-500" />
                          </button>
                          <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors ml-1">
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Add an item</p>
                    <div className="flex gap-2">
                      <div className="relative group flex-1">
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addManualItem()}
                          placeholder="e.g. Old Desk"
                          className="w-full px-4 py-3 text-sm bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors"
                        />
                      </div>
                      <button onClick={addManualItem} disabled={!newItemName.trim()} className="group px-4 bg-secondary text-white text-sm font-bold rounded-lg hover:bg-brand hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
                        <Plus size={16} className="transition-transform duration-300 group-hover:scale-110" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setAiStep('upload'); setLoadingState(LoadingState.IDLE); }} className="group flex-1 py-3.5 border border-secondary-100 text-secondary font-bold uppercase text-xs tracking-wider hover:border-brand hover:text-brand hover:shadow-lg transition-all duration-300 rounded-lg inline-flex items-center justify-center gap-2">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={handleGetPrice} disabled={detectedItems.length === 0} className="group flex-1 py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand hover:shadow-lg transition-all duration-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                      Get Estimate <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing loading - full screen centered */}
              {pricingLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
                    <p className="text-secondary-600 text-sm font-medium">Calculating your estimate...</p>
                  </div>
                </div>
              )}

              {/* Step 3: Price Result */}
              {aiStep === 'result' && priceEstimate && renderPriceResult(
                detectedItems,
                priceEstimate,
                () => { setAiStep('items'); setPriceEstimate(null); },
                'Back'
              )}
            </div>
          )}

          {/* ===== ITEM SELECTION CONTENT ===== */}
          {selectedOption === 'manual' && (
            <div>

              {/* Selection step */}
              {manualStep === 'select' && !manualPricingLoading && (
                <JunkItemCatalogSelector
                  selectedItems={selectedItems}
                  onSelectedItemsChange={setSelectedItems}
                />
              )}

              {/* Sticky floating Review CTA — scrolls with page */}
              {manualStep === 'select' && selectedItems.length > 0 && (
                <div ref={selectedItemsRef} className="sticky bottom-4 z-30 mt-6 mx-auto max-w-2xl px-2">
                  <button
                    onClick={() => setManualStep('review')}
                    className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand group-hover:bg-white text-white group-hover:text-brand text-xs font-black transition-colors shrink-0">
                        {totalSelectedCount}
                      </span>
                      <span className="text-sm font-black uppercase tracking-wider truncate">
                        Review {totalSelectedCount === 1 ? 'item' : 'items'}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                      Continue
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              )}

              {/* ===== REVIEW STEP ===== */}
              {manualStep === 'review' && !manualPricingLoading && (
                <div className="space-y-6">

                  {/* Items list */}
                  <div className="border border-secondary-100 rounded-2xl divide-y divide-secondary-100 overflow-hidden bg-white">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 md:p-4 hover:bg-white transition-colors">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <ItemIconRenderer
                            imagePath={getItemImage(item.name)}
                            className="w-8 h-8 md:w-9 md:h-9"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-secondary truncate">{item.name}</p>
                          <p className="text-[11px] text-secondary-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => updateSelectedQuantity(item.id, -1)} className="w-8 h-8 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-black text-secondary">{item.quantity}</span>
                          <button onClick={() => updateSelectedQuantity(item.id, 1)} className="w-8 h-8 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => toggleCatalogItem(item.name)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition-colors shrink-0"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Add-ons (Upsells) */}
                  <div className="border border-secondary-100 shadow-sm rounded-2xl bg-white p-4 md:p-5 space-y-3">
                    <p className="text-xs font-black uppercase tracking-wider text-secondary flex items-center gap-1.5">
                      <span>Suggested Add-ons</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { name: 'Box Spring', desc: 'Dispose of the matching box spring' },
                        { name: 'Bed Frame', desc: 'Dispose of the metal or wooden bed frame' }
                      ].map((upsell) => {
                        const isAdded = isItemSelected(upsell.name);
                        return (
                          <div key={upsell.name} className="bg-white border border-secondary-100 p-3 flex items-center justify-between gap-3 shadow-sm hover:shadow transition-shadow rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                                <ItemIconRenderer
                                  imagePath={getItemImage(upsell.name)}
                                  className="w-6 h-6 object-contain"
                                />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-secondary leading-tight">{upsell.name}</p>
                                <p className="text-[10px] text-secondary-400">{upsell.desc}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleCatalogItem(upsell.name)}
                              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all duration-200 ${
                                isAdded
                                  ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 font-bold'
                                  : 'bg-brand border-brand text-white hover:bg-brand-600 font-bold'
                              }`}
                            >
                              {isAdded ? 'Added ✓' : '+ Add'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Add More Items Option */}
                    <button
                      onClick={() => setManualStep('select')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-dashed border-secondary-100 text-secondary-600 hover:border-brand hover:text-brand font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      <Plus size={14} />
                      <span>Add more items</span>
                    </button>
                  </div>

                  {/* Helper actions */}
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => setManualStep('select')}
                      className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Add more items
                    </button>
                    <button
                      onClick={() => { setSelectedItems([]); setManualStep('select'); }}
                      className="font-bold text-red-400 hover:text-red-600 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Sticky Get Estimate CTA */}
                  <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                    <button
                      onClick={handleGetManualPrice}
                      disabled={selectedItems.length === 0}
                      className="group w-full flex items-center justify-center gap-2 px-5 py-4 bg-brand hover:bg-brand-600 text-white rounded-xl shadow-2xl shadow-brand/40 hover:shadow-brand/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <ScanSearch size={16} className="transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-black uppercase tracking-wider">Get Estimate</span>
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing loading - full screen centered */}
              {manualPricingLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
                    <p className="text-secondary-600 text-sm font-medium">Calculating your estimate...</p>
                  </div>
                </div>
              )}

              {/* Price result */}
              {manualStep === 'result' && manualPriceEstimate && renderPriceResult(
                selectedItems,
                manualPriceEstimate,
                () => { setManualStep('select'); setManualPriceEstimate(null); },
                'Back'
              )}
            </div>
          )}

      </div>
      <div>
        <TrustBadges />
      </div>
    </div>
  );
};
