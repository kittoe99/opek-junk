import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Camera, Upload, Loader2, Check, Plus, Minus, Trash2, Search, ListChecks, Armchair, Plug, Monitor, TreePine, HardHat, Warehouse, Package, ChevronDown, BedDouble, ScanSearch, Receipt, ArrowRight, ArrowLeft, X, MapPin, AlertCircle, CheckCircle2, Heart, HeartHandshake, Truck, BicepsFlexed, Download, RefreshCw, Home, Clock, PackagePlus, PackageMinus, ArrowLeftRight, Boxes, ShieldCheck, Container, Users, Sliders, ClipboardList, Eye, CalendarCheck, Sparkles, Sun, Maximize, Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JunkIcon, MovingLaborIcon, DumpsterIcon, LoadingIcon, UnloadingIcon, LoadingUnloadingIcon, StorageUnitIcon, BoxTruckIcon, InsideHomeIcon, OtherMoveIcon, TwoHelpersIcon, InputZipIcon, InputMessageIcon } from './icons/ServiceIcons';
import { ITEM_CATALOG, type CatalogItem, type CatalogCategory } from '../lib/itemCatalog';
import { JunkRemovalEstimateFlow, type EstimateMode } from './shared/JunkRemovalEstimateFlow';
import { MovingLaborEstimateFlow } from './shared/MovingLaborEstimateFlow';
import { detectItemsFromPhotos } from '../services/openaiService';
import { ItemIconRenderer } from './icons/JunkItemIcons';
import { calculateStaticPrice, calculateDumpsterRentalPrice, calculateMovingLaborPrice } from '../services/pricingService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState, MovingLaborOptions } from '../types';
import { BookingDetailsForm } from './BookingDetailsForm';
import { supabase } from '../lib/supabase';
import { persistBookingPhotos, withBookingPhotos } from '../lib/bookingPhotos';
import { withSmsMarketingConsent } from '../lib/customerConsent';
import { toStoredMovingOptions } from '../lib/bookingPayloads';
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
  const [movingOptions, setMovingOptions] = useState<MovingLaborOptions | null>(null);
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
