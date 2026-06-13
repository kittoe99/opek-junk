import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Loader2, Check, Plus, Minus, Trash2, Search, ListChecks, Armchair, Plug, Monitor, TreePine, HardHat, Warehouse, Package, ChevronDown, BedDouble, ScanSearch, Receipt, ArrowRight, ArrowLeft, X, MapPin, AlertCircle, CheckCircle2, Heart, HeartHandshake, Truck, BicepsFlexed, Download, RefreshCw, Home, Clock, PackagePlus, PackageMinus, ArrowLeftRight, Boxes, ShieldCheck, Container, Users, Sliders, ClipboardList, Eye, CalendarCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectItemsFromPhoto } from '../services/openaiService';
import { calculateStaticPrice, calculateDumpsterRentalPrice, DumpsterRentalOptions, calculateMovingLaborPrice } from '../services/pricingService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState } from '../types';
import { TrustBadges } from './TrustBadges';
import { BookingDetailsForm } from './BookingDetailsForm';
import { supabase } from '../lib/supabase';
import { ContactIntakeForm } from './shared/ContactIntakeForm';

// ── Item Catalog ──
interface CatalogItem {
  name: string;
  image: string;
}
interface CatalogCategory {
  label: string;
  icon: React.ReactNode;
  items: CatalogItem[];
}

const ITEM_CATALOG: CatalogCategory[] = [
  {
    label: 'Popular Items',
    icon: <Heart size={18} className="text-brand fill-brand/10" />,
    items: [
      { name: 'Sofa / Couch', image: '/items/sofa.svg' },
      { name: 'Mattress', image: '/items/mattress.svg' },
      { name: 'Box Spring', image: '/items/box-spring.svg' },
      { name: 'Dresser', image: '/items/dresser.svg' },
      { name: 'Refrigerator / Freezer', image: '/items/fridge.svg' },
      { name: 'Washer / Dryer', image: '/items/washer.svg' },
      { name: 'TV', image: '/items/tv.svg' },
      { name: 'Bags of Trash', image: '/items/trash-bags.svg' },
      { name: 'Boxes of Junk', image: '/items/junk-boxes.svg' },
      { name: 'Yard Debris / Brush', image: '/items/yard-debris.svg' },
    ],
  },
  {
    label: 'Furniture',
    icon: <Armchair size={18} />,
    items: [
      { name: 'Sofa / Couch', image: '/items/sofa.svg' },
      { name: 'Sectional Couch (2 piece)', image: '/items/sofa.svg' },
      { name: 'Loveseat', image: '/items/loveseat.svg' },
      { name: 'Chair', image: '/items/chair.svg' },
      { name: 'Ottoman', image: '/items/ottoman.svg' },
      { name: 'Table', image: '/items/table.svg' },
      { name: 'TV Stand / Entertainment Center', image: '/items/tv-stand.svg' },
      { name: 'Bookshelf', image: '/items/bookshelf.svg' },
      { name: 'Desk', image: '/items/desk.svg' },
      { name: 'Filing Cabinet', image: '/items/cabinet.svg' },
      { name: 'Dresser', image: '/items/dresser.svg' },
      { name: 'Nightstand', image: '/items/nightstand.svg' },
      { name: 'Wardrobe / Armoire', image: '/items/wardrobe.svg' },
      { name: 'China Cabinet', image: '/items/cabinet.svg' },
      { name: 'Patio Furniture Set', image: '/items/patio-set.svg' },
    ],
  },
  {
    label: 'Mattresses & Bedding',
    icon: <BedDouble size={18} />,
    items: [
      { name: 'Mattress', image: '/items/mattress.svg' },
      { name: 'Box Spring', image: '/items/box-spring.svg' },
      { name: 'Bed Frame', image: '/items/bed-frame.svg' },
      { name: 'Futon', image: '/items/futon.svg' },
      { name: 'Bunk Bed', image: '/items/bunk-bed.svg' },
      { name: 'Crib', image: '/items/crib.svg' },
    ],
  },
  {
    label: 'Appliances',
    icon: <Plug size={18} />,
    items: [
      { name: 'Refrigerator / Freezer', image: '/items/fridge.svg' },
      { name: 'Washer / Dryer', image: '/items/washer.svg' },
      { name: 'Dishwasher', image: '/items/dishwasher.svg' },
      { name: 'Oven / Stove', image: '/items/oven.svg' },
      { name: 'Microwave', image: '/items/microwave.svg' },
      { name: 'AC Unit', image: '/items/ac-unit.svg' },
      { name: 'Water Heater', image: '/items/water-heater.svg' },
      { name: 'Vacuum Cleaner', image: '/items/vacuum.svg' },
      { name: 'Exercise Equipment', image: '/items/exercise.svg' },
    ],
  },
  {
    label: 'Electronics',
    icon: <Monitor size={18} />,
    items: [
      { name: 'TV', image: '/items/tv.svg' },
      { name: 'Computer / Monitor', image: '/items/computer.svg' },
      { name: 'Printer / Scanner', image: '/items/printer.svg' },
      { name: 'Stereo / Speakers', image: '/items/speakers.svg' },
      { name: 'Gaming Console', image: '/items/gaming.svg' },
      { name: 'Electronics Box', image: '/items/electronics-box.svg' },
    ],
  },
  {
    label: 'Yard & Outdoor',
    icon: <TreePine size={18} />,
    items: [
      { name: 'Lawn Mower', image: '/items/lawn-mower.svg' },
      { name: 'Grill / BBQ', image: '/items/grill.svg' },
      { name: 'Trampoline', image: '/items/trampoline.svg' },
      { name: 'Swing Set / Playground', image: '/items/swing-set.svg' },
      { name: 'Hot Tub / Spa', image: '/items/hot-tub.svg' },
      { name: 'Shed', image: '/items/shed.svg' },
      { name: 'Fencing', image: '/items/fencing.svg' },
      { name: 'Yard Debris / Brush', image: '/items/yard-debris.svg' },
      { name: 'Garden Tools', image: '/items/garden-tools.svg' },
      { name: 'Firewood Pile', image: '/items/firewood.svg' },
    ],
  },
  {
    label: 'Construction & Debris',
    icon: <HardHat size={18} />,
    items: [
      { name: 'Drywall / Sheetrock', image: '/items/drywall.svg' },
      { name: 'Lumber / Wood', image: '/items/lumber.svg' },
      { name: 'Carpet / Padding', image: '/items/carpet.svg' },
      { name: 'Tile / Flooring', image: '/items/tile.svg' },
      { name: 'Concrete / Brick', image: '/items/concrete.svg' },
      { name: 'Roofing Shingles', image: '/items/roofing.svg' },
      { name: 'Windows / Doors', image: '/items/windows-doors.svg' },
      { name: 'Cabinets / Countertop', image: '/items/cabinets.svg' },
      { name: 'Plumbing Fixtures', image: '/items/plumbing.svg' },
      { name: 'Paint Cans', image: '/items/paint-cans.svg' },
      { name: 'Insulation', image: '/items/insulation.svg' },
    ],
  },
  {
    label: 'Garage & Storage',
    icon: <Warehouse size={18} />,
    items: [
      { name: 'Tires', image: '/items/tires.svg' },
      { name: 'Car Battery', image: '/items/car-battery.svg' },
      { name: 'Bicycle', image: '/items/bicycle.svg' },
      { name: 'Toolbox / Workbench', image: '/items/toolbox.svg' },
      { name: 'Shelving Unit', image: '/items/shelving.svg' },
      { name: 'Storage Bins / Boxes', image: '/items/storage-bins.svg' },
      { name: 'Clothing / Bags', image: '/items/clothing.svg' },
      { name: 'Luggage', image: '/items/luggage.svg' },
      { name: 'Sports Equipment', image: '/items/sports.svg' },
      { name: 'Kids Toys', image: '/items/kids-toys.svg' },
    ],
  },
  {
    label: 'Miscellaneous',
    icon: <Package size={18} />,
    items: [
      { name: 'Piano / Organ', image: '/items/piano.svg' },
      { name: 'Pool / Game Table', image: '/items/game-table.svg' },
      { name: 'Aquarium / Fish Tank', image: '/items/aquarium.svg' },
      { name: 'Rug', image: '/items/rug.svg' },
      { name: 'Mirror', image: '/items/mirror.svg' },
      { name: 'Light Fixture', image: '/items/light-fixture.svg' },
      { name: 'Bags of Trash', image: '/items/trash-bags.svg' },
      { name: 'Boxes of Junk', image: '/items/junk-boxes.svg' },
      { name: 'Miscellaneous Item', image: '/items/misc-item.svg' },
    ],
  },
];

// Nationwide coverage — any valid US ZIP is served.
type ServedCity = { city: string; state: string };

export const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingState = location.state as {
    zipResult?: { city: string; state: string; served?: boolean } | null;
    zipValue?: string;
    serviceType?: string;
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
  const [selectedService, setSelectedService] = useState<'junk_removal' | 'moving_labor' | 'dumpster_rental' | 'donation_pickup' | null>(mappedServiceType);
  const [selectedOption, setSelectedOption] = useState<'ai' | 'manual' | 'moving_labor' | 'donation_pickup' | 'dumpster_rental' | null>(
    mappedServiceType === 'junk_removal' ? 'manual' : (incomingState?.serviceType ? 'manual' : null)
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
  const [movingStep, setMovingStep] = useState<'details' | 'crew' | 'result'>('details');

  useEffect(() => {
    if (selectedOption !== 'moving_labor') {
      setMovingStep('details');
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

  // Auto-advance for service selections
  useEffect(() => {
    if (selectedService === 'moving_labor') {
      setSelectedOption('moving_labor');
    } else if (selectedService === 'donation_pickup') {
      setSelectedOption('donation_pickup');
    } else if (selectedService === 'dumpster_rental') {
      setSelectedOption('dumpster_rental');
    } else if (selectedService === 'junk_removal') {
      setSelectedOption('manual');
    } else if (selectedService === null) {
      setSelectedOption(null);
    }
  }, [selectedService]);
  useEffect(() => {
    if (zipResult?.servedCity) {
      const t = setTimeout(() => setZipVerified(true), 2000);
      return () => clearTimeout(t);
    }
  }, [zipResult]);

  // Load moving labor rates from Supabase config
  const [movingRates, setMovingRates] = useState<{ rate2: number; rate3: number }>({ rate2: 149, rate3: 189 });

  useEffect(() => {
    async function loadMovingRates() {
      try {
        const { data, error } = await supabase
          .from('pricing_config')
          .select('value')
          .eq('key', 'moving_labor_rules')
          .single();
        if (data && data.value) {
          setMovingRates({
            rate2: data.value.price_per_hour_2_helpers || 149,
            rate3: data.value.price_per_hour_3_helpers || 189
          });
        }
      } catch (err) {
        console.error('Failed to load moving rates:', err);
      }
    }
    loadMovingRates();
  }, []);

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
  const [image, setImage] = useState<string | null>(null);
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
  const [selectedItems, setSelectedItems] = useState<DetectedItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Popular Items');
  const [manualStep, setManualStep] = useState<'select' | 'review' | 'result'>('select');
  const [manualPriceEstimate, setManualPriceEstimate] = useState<PriceEstimate | null>(null);
  const [manualPricingLoading, setManualPricingLoading] = useState(false);
  const [manualNewItemName, setManualNewItemName] = useState('');

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

  // Auto-scroll to top when step changes
  useEffect(() => {
    scrollToElement(contentTopRef.current, -120);
  }, [aiStep, manualStep, selectedOption, movingStep, donationStep, dumpsterStep, scrollToElement]);

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
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setImage(compressedImage);
        setEstimate(null);
        setDetectedItems([]);
        setLoadingState(LoadingState.IDLE);
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const items = await detectItemsFromPhoto(base64Data, mimeType);
      setDetectedItems(items);
      setAiStep('items');
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error('AI analysis error:', err);
      setError(err?.message || 'Failed to analyze photo. Please try again.');
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

  // ── Image lookup helper ──
  const getItemImage = (itemName: string): string => {
    for (const cat of ITEM_CATALOG) {
      const found = cat.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (found) return found.image;
    }
    return '/items/misc-item.svg';
  };

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

  const addManualSelectedItem = () => {
    const name = manualNewItemName.trim();
    if (!name) return;
    setSelectedItems(prev => [...prev, { id: `custom-${Date.now()}`, name, quantity: 1 }]);
    setManualNewItemName('');
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

  const isItemSelected = (itemName: string) => selectedItems.some(i => i.name === itemName);

  const filteredCatalog = catalogSearch.trim()
    ? ITEM_CATALOG.map(cat => ({
        ...cat,
        items: cat.items.filter(i => i.name.toLowerCase().includes(catalogSearch.toLowerCase())),
      })).filter(cat => cat.items.length > 0)
    : ITEM_CATALOG;

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
          photo_url: image || ''
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
          console.warn('Supabase lead capture failed, proceeding in mock mode:', dbError);
        } else if (data?.id) {
          partialId = data.id;
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
        <div className="bg-secondary-50 rounded-2xl p-5 md:p-6 border border-secondary-100">
          {!isSpecialService && (
            <div className="space-y-3 mb-5 pb-5 border-b border-secondary-200">
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
                Continue to Booking
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
                  className="w-8 h-8 rounded-full bg-secondary-50 hover:bg-secondary-100 flex items-center justify-center text-secondary transition-colors"
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
                Got it, thanks
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
        <div className="pt-32 pb-8 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowBookingForm(false)}
            className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back to estimate
          </button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary tracking-tight leading-[1.1] mb-3">
            Book your <span className="text-brand">{selectedService === 'moving_labor' ? 'service' : 'pickup'}.</span>
          </h1>
          <p className="text-secondary-400 text-base">A matched provider confirms within 15 minutes.</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Mini estimate banner */}
          <div className="bg-secondary-50 rounded-2xl p-4 border border-secondary-100 mb-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</p>
              <p className="text-xs text-secondary-500 mt-0.5">{estimate.estimatedVolume}</p>
            </div>
            <p className="text-2xl font-black text-brand">${estimate.price}</p>
          </div>

          <BookingDetailsForm
            estimate={estimate}
            image={image}
            serviceType={serviceTypeLabel}
            defaultZip={defaultZip}
            onBack={() => setShowBookingForm(false)}
            backLabel="Back to estimate"
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl shadow-secondary/5 border border-secondary-100 p-8 md:p-10 text-center">
            {/* Animated success icon */}
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
                <Receipt size={32} className="text-brand" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-secondary">Submission Successful</h2>
              <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
                Your submission was successful.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const serviceTypeLabel =
                    selectedService === 'junk_removal' ? 'Junk Removal'
                    : selectedService === 'donation_pickup' ? 'Donation Pick Up'
                    : selectedService === 'moving_labor' ? 'Moving Labor'
                    : selectedService === 'dumpster_rental' ? 'Dumpster Rental'
                    : 'Junk Removal';
                  navigate('/booking', { state: { estimate, image, serviceType: serviceTypeLabel, prefilledName: contactName, prefilledPhone: contactPhone, partialBookingId } });
                }}
                className="flex-1 py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-brand transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Book Now <ArrowRight size={14} />
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3.5 border border-secondary-200 text-secondary font-bold uppercase text-xs tracking-wider rounded-xl hover:border-brand hover:text-brand transition-all duration-300"
              >
                New Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ZIP check screen ──
  if (!zipVerified) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
            Free quote in <span className="text-brand">two minutes.</span>
          </h1>
          <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
            Nationwide coverage in all 50 states — start by confirming your ZIP.
          </p>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div>
            <div className="flex items-start gap-3 mb-6">
              <MapPin size={18} className="text-brand shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-black text-secondary">Confirm Your ZIP Code</h2>
                <p className="text-secondary-400 text-xs">Nationwide service in all 50 states.</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
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
                className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => { setZipVerified(false); setZipResult(null); setZipValue(''); }}
            className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
            What do you <span className="text-brand">need?</span>
          </h1>
          <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
            Select a service below to continue.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 gap-3 mb-12 max-w-xl">
            <button
              onClick={() => setSelectedService('junk_removal')}
              className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 hover:scale-[1.01] transition-all p-4 rounded-2xl text-left flex items-center gap-4 group"
            >
              <div className="w-16 h-16 shrink-0">
                <img src="/process-step-1.svg" alt="Junk Removal" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
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
              onClick={() => setSelectedService('moving_labor')}
              className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 hover:scale-[1.01] transition-all p-4 rounded-2xl text-left flex items-center gap-4 group"
            >
              <div className="w-16 h-16 shrink-0">
                <img src="/process-step-2.svg" alt="Moving Labor" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
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
              className="w-full bg-secondary-50/50 border border-secondary-100 p-4 rounded-2xl text-left flex items-center gap-4 cursor-not-allowed opacity-60"
            >
              <div className="w-16 h-16 shrink-0 grayscale">
                <img src="/dumpster-rental.svg" alt="Dumpster Rental" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm md:text-base font-black text-secondary-500">Dumpster Rental</h3>
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-secondary-100 text-secondary-500 rounded-full">Coming Soon</span>
                </div>
                <p className="text-secondary-400 text-xs md:text-sm">Roll-off container delivered to your site</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-secondary-100 flex items-center justify-center bg-secondary-50 text-secondary-300">
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
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              if (movingStep === 'crew') {
                setMovingStep('details');
              } else if (movingStep === 'result') {
                setMovingStep('crew');
              } else {
                setSelectedService(null);
                setSelectedOption(null);
              }
            }}
            className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> {movingStep === 'crew' ? 'Back to details' : movingStep === 'result' ? 'Back to crew & time' : 'Back to services'}
          </button>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
            Book <span className="text-brand">Moving Labor.</span>
          </h1>
          <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
            Get professional heavy-lifting assistance. 2-hour minimum applies.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
          {/* Progress Stepper */}
          {(() => {
            const movingSteps = [
              { label: 'Details', icon: ClipboardList },
              { label: 'Crew & Time', icon: Users },
              { label: 'Estimate', icon: Receipt }
            ];
            const movingStepIndex = movingStep === 'details' ? 0 : movingStep === 'crew' ? 1 : 2;
            return (
              <div className="relative mb-14 px-1">
                {/* Background Connecting Line */}
                <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-secondary-100 -translate-y-1/2 pointer-events-none">
                  {/* Active Connecting Line */}
                  <div 
                    className="h-full bg-brand transition-all duration-500 ease-out"
                    style={{ width: `${(movingStepIndex / (movingSteps.length - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps Nodes */}
                <div className="flex items-center justify-between relative">
                  {movingSteps.map((step, i) => {
                    const StepIcon = step.icon;
                    const isCompleted = i < movingStepIndex;
                    const isActive = i === movingStepIndex;
                    
                    return (
                      <div key={step.label} className="relative flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-brand border-brand text-white shadow-sm' 
                            : isActive 
                              ? 'bg-white border-brand text-brand ring-4 ring-brand/10' 
                              : 'bg-white border-secondary-200 text-secondary-300'
                        }`}>
                          {isCompleted ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <StepIcon size={14} />
                          )}
                        </div>
                        <span className={`absolute top-11 whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                          isActive || isCompleted ? 'text-secondary' : 'text-secondary-300'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* STEP 1: DETAILS */}
          {movingStep === 'details' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Service Selection */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Service Selection</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Loading Only', icon: PackagePlus },
                    { label: 'Unloading Only', icon: PackageMinus },
                    { label: 'Both', icon: ArrowLeftRight }
                  ].map((service) => {
                    const isSelected = movingServiceType === service.label;
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.label}
                        onClick={() => setMovingServiceType(service.label as any)}
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
                            {service.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Move Type */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Type of Move</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Storage Unit', icon: Warehouse },
                    { label: 'Box Truck', icon: Truck },
                    { label: 'Inside Home', icon: Home },
                    { label: 'Other', icon: Boxes }
                  ].map((type) => {
                    const isSelected = movingType === type.label;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.label}
                        onClick={() => setMovingType(type.label as any)}
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
                            {type.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setMovingStep('crew')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-brand text-white rounded-full transition-all duration-300 font-semibold text-xs uppercase tracking-wider"
                >
                  Continue <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => { setSelectedService(null); setSelectedOption(null); }}
                  className="w-full py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-secondary-400 hover:text-secondary-600 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back to services
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CREW & TIME */}
          {movingStep === 'crew' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               {/* Helpers Selection */}
               <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Number of Helpers</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { helpers: 2, price: `$${movingRates.rate2} / hour`, icon: Users },
                    { helpers: 3, price: `$${movingRates.rate3} / hour`, icon: Users }
                  ].map((option) => {
                    const isSelected = movingHelpers === option.helpers;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.helpers}
                        onClick={() => setMovingHelpers(option.helpers as 2 | 3)}
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
                            {option.helpers} Helpers
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hours Selection */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-wider mb-3">Estimated Hours (2 hr min)</label>
                <div className="flex items-center justify-between p-4 bg-white border border-secondary-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-secondary-400" />
                    <div>
                      <div className="text-sm font-semibold text-secondary">Time Needed</div>
                      <div className="text-[11px] text-secondary-400">{movingHours} hours selected</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 bg-secondary-50 border border-secondary-100 rounded-xl p-1.5 w-max">
                    <button
                      onClick={() => setMovingHours(h => Math.max(2, h - 1))}
                      disabled={movingHours <= 2}
                      className="w-8 h-8 rounded-lg bg-white text-secondary hover:text-brand hover:border-brand border border-transparent shadow-sm disabled:opacity-50 disabled:hover:border-transparent disabled:hover:text-secondary flex items-center justify-center transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-base font-bold text-brand">{movingHours}</span>
                    <button
                      onClick={() => setMovingHours(h => Math.min(12, h + 1))}
                      className="w-8 h-8 rounded-lg bg-white text-secondary hover:text-brand hover:border-brand border border-transparent shadow-sm flex items-center justify-center transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="pt-4">
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
                      setError('Failed to calculate price. Please try again.');
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
                  onClick={() => setMovingStep('details')}
                  className="w-full py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-secondary-400 hover:text-secondary-600 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Back to details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ESTIMATE RESULT */}
          {movingStep === 'result' && movingPriceEstimate && (
            <div>
              {renderPriceResult(
                [{ id: 'moving-labor', name: `${movingServiceType} (${movingType}) - ${movingHelpers} Helpers, ${movingHours} hrs`, quantity: 1 }],
                movingPriceEstimate,
                () => setMovingStep('crew'),
                "Back to crew & time"
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
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <ArrowLeft size={14} /> {donationStep === 'size' ? 'Back to details' : donationStep === 'result' ? 'Back to size & location' : 'Back to services'}
          </button>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
            Schedule <span className="text-brand">Donation Pickup.</span>
          </h1>
          <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
            Get your gently used items picked up and delivered to charity. Upfront pricing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8 animate-in fade-in duration-300">
          {/* Progress Stepper */}
          {(() => {
            const donationSteps = [
              { label: 'Charity', icon: HeartHandshake },
              { label: 'Size & Location', icon: Package },
              { label: 'Estimate', icon: Receipt }
            ];
            const donationStepIndex = donationStep === 'details' ? 0 : donationStep === 'size' ? 1 : 2;
            return (
              <div className="relative mb-14 px-1">
                {/* Background Connecting Line */}
                <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-secondary-100 -translate-y-1/2 pointer-events-none">
                  {/* Active Connecting Line */}
                  <div 
                    className="h-full bg-brand transition-all duration-500 ease-out"
                    style={{ width: `${(donationStepIndex / (donationSteps.length - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps Nodes */}
                <div className="flex items-center justify-between relative">
                  {donationSteps.map((step, i) => {
                    const StepIcon = step.icon;
                    const isCompleted = i < donationStepIndex;
                    const isActive = i === donationStepIndex;
                    
                    return (
                      <div key={step.label} className="relative flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-brand border-brand text-white shadow-sm' 
                            : isActive 
                              ? 'bg-white border-brand text-brand ring-4 ring-brand/10' 
                              : 'bg-white border-secondary-200 text-secondary-300'
                        }`}>
                          {isCompleted ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <StepIcon size={14} />
                          )}
                        </div>
                        <span className={`absolute top-11 whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                          isActive || isCompleted ? 'text-secondary' : 'text-secondary-300'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

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
                  <ArrowLeft size={14} /> Back to services
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
                "Back to size & location"
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
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <ArrowLeft size={14} /> {dumpsterStep === 'duration' ? 'Back to size' : dumpsterStep === 'result' ? 'Back to duration' : 'Back to services'}
          </button>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
            Rent a <span className="text-brand">Dumpster.</span>
          </h1>
          <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
            Roll-off dumpster delivered to your site. Flat-rate pricing with flexible rental periods.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
          {/* Progress Stepper */}
          {(() => {
            const dumpsterSteps = [
              { label: 'Size', icon: Container },
              { label: 'Duration', icon: CalendarCheck },
              { label: 'Estimate', icon: Receipt }
            ];
            const dumpsterStepIndex = dumpsterStep === 'size' ? 0 : dumpsterStep === 'duration' ? 1 : 2;
            return (
              <div className="relative mb-14 px-1">
                {/* Background Connecting Line */}
                <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-secondary-100 -translate-y-1/2 pointer-events-none">
                  {/* Active Connecting Line */}
                  <div 
                    className="h-full bg-brand transition-all duration-500 ease-out"
                    style={{ width: `${(dumpsterStepIndex / (dumpsterSteps.length - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps Nodes */}
                <div className="flex items-center justify-between relative">
                  {dumpsterSteps.map((step, i) => {
                    const StepIcon = step.icon;
                    const isCompleted = i < dumpsterStepIndex;
                    const isActive = i === dumpsterStepIndex;
                    
                    return (
                      <div key={step.label} className="relative flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-brand border-brand text-white shadow-sm' 
                            : isActive 
                              ? 'bg-white border-brand text-brand ring-4 ring-brand/10' 
                              : 'bg-white border-secondary-200 text-secondary-300'
                        }`}>
                          {isCompleted ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <StepIcon size={14} />
                          )}
                        </div>
                        <span className={`absolute top-11 whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                          isActive || isCompleted ? 'text-secondary' : 'text-secondary-300'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

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
                  <ArrowLeft size={14} /> Back to services
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
                  <div className="flex items-center gap-3 sm:gap-4 bg-secondary-50 border border-secondary-100 rounded-xl p-1.5 w-max">
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
                      setError('Failed to calculate price. Please try again.');
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
                  <ArrowLeft size={14} /> Back to size
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
                "Back to duration"
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Method Selection screen ──
  if (!selectedOption) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedService(null)}
            className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back to services
          </button>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
            Free quote in <span className="text-brand">two minutes.</span>
          </h1>
          <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
            Snap a photo for instant AI pricing, or pick items from the catalog. Either way, you get an upfront estimate — no obligations.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* Method Selection */}
          <div className="grid grid-cols-1 gap-3 mb-12 max-w-xl">
            <button
              onClick={() => setSelectedOption('ai')}
              className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 transition-all p-5 rounded-2xl text-left flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-secondary-50 group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                <ScanSearch size={22} className="text-secondary group-hover:text-brand transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-black text-secondary mb-0.5 group-hover:text-brand transition-colors">AI Photo Estimate</h3>
                <p className="text-secondary-400 text-xs md:text-sm">Snap a photo for instant AI pricing</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
              </div>
            </button>
            <button
              onClick={() => setSelectedOption('manual')}
              className="w-full bg-white border border-secondary-100 hover:border-brand hover:shadow-md hover:shadow-brand/5 transition-all p-5 rounded-2xl text-left flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-secondary-50 group-hover:bg-brand/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                <ListChecks size={22} className="text-secondary group-hover:text-brand transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-black text-secondary mb-0.5 group-hover:text-brand transition-colors">Select Your Items</h3>
                <p className="text-secondary-400 text-xs md:text-sm">Pick items from the catalog for a quote</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all">
                <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 md:mt-24">
            <h2 className="text-xl font-black text-secondary mb-2">Prefer to talk to someone?</h2>
            <p className="text-secondary-400 text-sm mb-4">Call support for a phone estimate or to ask any questions — support is available 24/7.</p>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => navigate('/contact')}
                className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center gap-2"
              >
                Contact Us <ArrowRight size={16} />
              </button>
              <a
                href="tel:8313187139"
                className="text-secondary font-bold text-sm uppercase tracking-wider underline underline-offset-4 decoration-secondary-300 hover:decoration-brand hover:text-brand transition-colors"
              >
                (831) 318-7139
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main flow ──
  return (
    <div className="min-h-screen bg-white">
      <div className={`pt-32 pb-8 md:pt-40 md:pb-12 mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${selectedOption === 'manual' && manualStep === 'select' ? 'max-w-4xl' : 'max-w-3xl'}`}>
        <button
          onClick={() => setSelectedService(null)}
          className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to services
        </button>

        <div ref={contentTopRef} className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary tracking-tight leading-[1.1] mb-3">
            {selectedOption === 'ai'
              ? <>Snap, <span className="text-brand">price.</span></>
              : manualStep === 'review'
                ? <>Review your <span className="text-brand">list.</span></>
                : <>Pick your <span className="text-brand">items.</span></>}
          </h1>
          {selectedOption === 'manual' && manualStep === 'select' && (
            <p className="text-secondary-400 text-base">Browse categories, pick what you need, get your AI-powered estimate.</p>
          )}
          {selectedOption === 'manual' && manualStep === 'review' && (
            <p className="text-secondary-400 text-base">Confirm your items to calculate the estimate.</p>
          )}
        </div>
      </div>

      <div className={`mx-auto px-4 sm:px-6 lg:px-8 pb-8 transition-all duration-300 ${selectedOption === 'manual' && manualStep === 'select' ? 'max-w-4xl' : 'max-w-3xl'}`}>

          {/* ===== AI PHOTO CONTENT ===== */}
          {selectedOption === 'ai' && (
            <div>
              {/* Step indicator */}
              {(() => {
                const aiSteps = ['Tips', 'Upload', 'Review Items', 'Estimate'];
                const aiStepIndex = aiStep === 'tips' ? 0 : aiStep === 'upload' ? 1 : aiStep === 'items' ? 2 : 3;
                return (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-2">
                      {aiSteps.map((label, i) => (
                        <span key={label} className={`text-[10px] font-black uppercase tracking-wider transition-colors ${
                          i < aiStepIndex ? 'text-brand' : i === aiStepIndex ? 'text-secondary' : 'text-secondary-300'
                        }`}>
                          {i < aiStepIndex ? <Check size={11} className="inline mb-0.5 mr-0.5" strokeWidth={3} /> : null}{label}
                        </span>
                      ))}
                    </div>
                    <div className="relative h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-brand rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(aiStepIndex / (aiSteps.length - 1)) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-secondary-400 mt-1.5">Step {aiStepIndex + 1} of {aiSteps.length}</p>
                  </div>
                );
              })()}

              {/* Step 0: Photo Tips */}
              {aiStep === 'tips' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-[10px] font-medium text-brand uppercase tracking-wider mb-2">Photo Tips</p>
                    <h3 className="text-lg font-black text-secondary">Take clear photos for best results</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-brand">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary">Good lighting</p>
                        <p className="text-xs text-secondary-400">Take photos in daylight or well-lit areas. Avoid dark shadows.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-brand">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary">All items visible</p>
                        <p className="text-xs text-secondary-400">Make sure everything you want removed is in the frame.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-brand">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary">Items only</p>
                        <p className="text-xs text-secondary-400">Photos of just the junk items work best. Avoid people or pets.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-50 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-brand">4</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary">Multiple angles</p>
                        <p className="text-xs text-secondary-400">For large piles, you can upload several photos of different sections.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setAiStep('upload')}
                    className="w-full py-4 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand transition-colors rounded-lg inline-flex items-center justify-center gap-2 mt-4"
                  >
                    Got it — Continue <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Step 1: Upload */}
              {aiStep === 'upload' && (
                <>
                  {!image ? (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full md:border border-secondary-100 hover:border-brand hover:bg-brand/5 transition-all p-6 md:rounded-2xl rounded-xl text-left flex items-center gap-4 group"
                      >
                        <Camera size={24} className="text-brand shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-base font-black text-secondary mb-0.5">Take Photo</h3>
                          <p className="text-secondary-400 text-sm">Use your camera to capture the junk</p>
                        </div>
                        <ArrowRight size={18} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full md:border border-secondary-100 hover:border-brand hover:bg-brand/5 transition-all p-6 md:rounded-2xl rounded-xl text-left flex items-center gap-4 group"
                      >
                        <Upload size={24} className="text-secondary shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-base font-black text-secondary mb-0.5">Upload Photo</h3>
                          <p className="text-secondary-400 text-sm">Choose an existing photo from your device</p>
                        </div>
                        <ArrowRight size={18} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </button>

                      <button
                        onClick={() => setAiStep('tips')}
                        className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <ArrowLeft size={14} /> Back to photo tips
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative border border-secondary-100 rounded-xl overflow-hidden">
                        <img src={image} alt="Upload" className="w-full" />
                        {loadingState !== LoadingState.ANALYZING && (
                          <button
                            onClick={() => { setImage(null); setEstimate(null); setDetectedItems([]); }}
                            className="absolute top-3 right-3 bg-white text-secondary px-3 py-1.5 text-xs font-bold shadow-lg hover:text-brand transition-colors rounded-lg"
                          >
                            Change Photo
                          </button>
                        )}
                      </div>
                      {loadingState === LoadingState.IDLE && (
                        <button onClick={handleAnalyze} className="group w-full py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand hover:shadow-lg transition-all duration-300 rounded-lg inline-flex items-center justify-center gap-2">
                          <ScanSearch size={14} /> Analyze Photo
                        </button>
                      )}
                      {loadingState === LoadingState.ANALYZING && (
                        <div className="py-12 text-center">
                          <Loader2 size={40} className="animate-spin mx-auto mb-3 text-brand" />
                          <p className="text-secondary-400 text-sm">Identifying items in your photo...</p>
                        </div>
                      )}
                      {loadingState === LoadingState.ERROR && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                          <p className="text-red-700 text-sm font-bold mb-1">Failed to analyze photo</p>
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
                  {image && (
                    <div className="flex gap-4 items-start p-4 border border-secondary-100 rounded-xl bg-secondary-50/50">
                      <img src={image} alt="Your photo" className="w-20 h-20 object-cover rounded-lg border border-secondary-100" />
                      <div>
                        <p className="text-sm font-black text-secondary">{detectedItems.length} items detected</p>
                        <p className="text-xs text-secondary-400 mt-1">Review, edit quantities, remove items, or add any additional items.</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    {detectedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-secondary-100 bg-white">
                        <img src={getItemImage(item.name)} alt={item.name} className="w-10 h-10 object-contain" />
                        <span className="flex-1 text-sm font-medium text-secondary">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateItemQuantity(item.id, -1)} className="w-7 h-7 rounded-md border border-secondary-200 bg-secondary-50 flex items-center justify-center hover:border-brand transition-colors">
                            <Minus size={14} className="text-secondary-500" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-secondary">{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item.id, 1)} className="w-7 h-7 rounded-md border border-secondary-200 bg-secondary-50 flex items-center justify-center hover:border-brand transition-colors">
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
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addManualItem()}
                        placeholder="e.g. Old Desk"
                        className="flex-1 px-4 py-3 text-sm bg-secondary-50 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors"
                      />
                      <button onClick={addManualItem} disabled={!newItemName.trim()} className="group px-4 bg-secondary text-white text-sm font-bold rounded-lg hover:bg-brand hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
                        <Plus size={16} className="transition-transform duration-300 group-hover:scale-110" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setAiStep('upload'); setLoadingState(LoadingState.IDLE); }} className="group flex-1 py-3.5 border border-secondary-200 text-secondary font-bold uppercase text-xs tracking-wider hover:border-brand hover:text-brand hover:shadow-lg transition-all duration-300 rounded-lg inline-flex items-center justify-center gap-2">
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
                'Edit items and re-estimate'
              )}
            </div>
          )}

          {/* ===== ITEM SELECTION CONTENT ===== */}
          {selectedOption === 'manual' && (
            <div>
              {/* Progress Stepper */}
              {manualStep !== 'select' && (() => {
                const manualSteps = [
                  { label: 'Select Items', icon: ClipboardList },
                  { label: 'Review', icon: Eye },
                  { label: 'Estimate', icon: Receipt }
                ];
                const manualStepIndex = manualStep === 'select' ? 0 : manualStep === 'review' ? 1 : 2;
                return (
                  <div className="relative mb-14 px-1">
                    {/* Background Connecting Line */}
                    <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-secondary-100 -translate-y-1/2 pointer-events-none">
                      {/* Active Connecting Line */}
                      <div 
                        className="h-full bg-brand transition-all duration-500 ease-out"
                        style={{ width: `${(manualStepIndex / (manualSteps.length - 1)) * 100}%` }}
                      />
                    </div>
                    
                    {/* Steps Nodes */}
                    <div className="flex items-center justify-between relative">
                      {manualSteps.map((step, i) => {
                        const StepIcon = step.icon;
                        const isCompleted = i < manualStepIndex;
                        const isActive = i === manualStepIndex;
                        
                        return (
                          <div key={step.label} className="relative flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-brand border-brand text-white shadow-sm' 
                                : isActive 
                                  ? 'bg-white border-brand text-brand ring-4 ring-brand/10' 
                                  : 'bg-white border-secondary-200 text-secondary-300'
                            }`}>
                              {isCompleted ? (
                                <Check size={14} strokeWidth={3} />
                              ) : (
                                <StepIcon size={14} />
                              )}
                            </div>
                            <span className={`absolute top-11 whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                              isActive || isCompleted ? 'text-secondary' : 'text-secondary-300'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Selection step */}
              {manualStep === 'select' && !manualPricingLoading && (
                <div className="space-y-5">
                  {/* Search bar - enhanced */}
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search items..."
                      className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-secondary-200 rounded-2xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-3 focus:ring-brand/8 shadow-sm transition-all duration-200"
                    />
                    {catalogSearch && (
                      <button
                        onClick={() => setCatalogSearch('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-secondary-200 hover:bg-secondary-300 flex items-center justify-center transition-colors"
                      >
                        <X size={10} className="text-secondary-600" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>

                  {/* Sidebar and Grid split layout */}
                  <div className="flex flex-col sm:flex-row gap-0 md:gap-0">
                    {/* Left Sidebar */}
                    <div className="w-full sm:w-[190px] md:w-[220px] shrink-0 flex flex-row sm:flex-col gap-1 sm:gap-0.5 border-b sm:border-b-0 sm:border-r border-secondary-100 pb-3 sm:pb-0 pr-0 sm:pr-3 overflow-x-auto sm:overflow-y-visible scrollbar-none py-1 sm:py-0 sm:sticky sm:top-36 sm:self-start">
                      {ITEM_CATALOG.map((category, idx) => {
                        const isActive = expandedCategory === category.label && !catalogSearch.trim();
                        const selectedCount = category.items.filter(i => isItemSelected(i.name)).length;
                        return (
                          <button
                            key={category.label}
                            onClick={() => {
                              setExpandedCategory(category.label);
                              setCatalogSearch('');
                            }}
                            className={`flex flex-row items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-left transition-all duration-200 group shrink-0 w-auto sm:w-full ${
                              isActive
                                ? 'bg-brand text-white shadow-sm shadow-brand/30'
                                : 'hover:bg-secondary-50 text-secondary-500 hover:text-secondary'
                            }`}
                          >
                            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive ? 'bg-white/20 text-white' : 'bg-secondary-100 text-secondary-400 group-hover:bg-brand/10 group-hover:text-brand'
                            }`}>
                              <span className="scale-75">{category.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className={`text-[10px] sm:text-[11px] leading-tight truncate whitespace-nowrap sm:whitespace-normal ${
                                isActive ? 'font-black' : 'font-semibold'
                              }`}>
                                {category.label}
                              </p>
                            </div>
                            {selectedCount > 0 && (
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                                isActive ? 'bg-white text-brand' : 'bg-brand text-white'
                              }`}>
                                {selectedCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Items Grid */}
                    <div className="flex-1 min-w-0 sm:pl-4 md:pl-5 pt-3 sm:pt-0">
                      {catalogSearch.trim() ? (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                              Results
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-500 text-[10px] font-bold">
                              {filteredCatalog.reduce((sum, cat) => sum + cat.items.length, 0)}
                            </span>
                          </div>
                          {filteredCatalog.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center mb-3">
                                <Search size={20} className="text-secondary-300" />
                              </div>
                              <p className="text-sm font-semibold text-secondary-400">No items found</p>
                              <p className="text-xs text-secondary-300 mt-1">Try a different search term</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                              {filteredCatalog.flatMap(cat => cat.items).map((item) => {
                                const selected = isItemSelected(item.name);
                                const selectedItem = selectedItems.find(i => i.name === item.name);
                                return (
                                  <button
                                    key={item.name}
                                    className={`group relative flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl border transition-all duration-200 text-center cursor-pointer ${
                                      selected
                                        ? 'bg-brand/5 border-brand/30 shadow-sm shadow-brand/10'
                                        : 'bg-white border-secondary-100 hover:border-secondary-200 hover:shadow-md hover:shadow-secondary/8 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm'
                                    }`}
                                    onClick={() => !selected && toggleCatalogItem(item.name)}
                                  >
                                    {selected && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); toggleCatalogItem(item.name); }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm transition-colors z-10"
                                      >
                                        <X size={9} className="text-white" strokeWidth={3} />
                                      </button>
                                    )}
                                    {selected && (
                                      <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-brand rounded-full flex items-center justify-center z-10">
                                        <Check size={8} className="text-white" strokeWidth={3} />
                                      </div>
                                    )}
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                      selected ? 'bg-brand/10' : 'bg-secondary-50 group-hover:bg-secondary-100'
                                    }`}>
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-7 h-7 sm:w-8 sm:h-8 transition-all duration-200"
                                        style={{
                                          filter: selected
                                            ? 'brightness(0) saturate(100%) invert(54%) sepia(88%) saturate(2476%) hue-rotate(316deg) brightness(101%) contrast(101%)'
                                            : 'brightness(0) saturate(100%) invert(28%) sepia(31%) saturate(745%) hue-rotate(178deg) brightness(94%) contrast(91%)'
                                        }}
                                      />
                                    </div>
                                    <span className={`text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2 transition-colors px-0.5 ${
                                      selected ? 'text-brand' : 'text-secondary-700 group-hover:text-secondary'
                                    }`}>{item.name}</span>
                                    
                                    {selected && selectedItem && (
                                      <div className="flex items-center gap-1 mt-0.5 bg-white border border-secondary-150 rounded-full px-1.5 py-0.5 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => updateSelectedQuantity(selectedItem.id, -1)} className="w-4 h-4 rounded-full bg-secondary-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                          <Minus size={9} className="text-secondary-500" />
                                        </button>
                                        <span className="w-5 text-center text-[11px] font-black text-secondary leading-none">{selectedItem.quantity}</span>
                                        <button onClick={() => updateSelectedQuantity(selectedItem.id, 1)} className="w-4 h-4 rounded-full bg-secondary-50 flex items-center justify-center hover:bg-brand/10 hover:text-brand transition-colors">
                                          <Plus size={9} className="text-secondary-500" />
                                        </button>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {ITEM_CATALOG.filter(cat => cat.label === (expandedCategory || 'Popular Items')).map((category) => (
                            <div key={category.label}>
                              <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                                  {category.label}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-400 text-[10px] font-bold">
                                  {category.items.length}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                {category.items.map((item) => {
                                  const selected = isItemSelected(item.name);
                                  const selectedItem = selectedItems.find(i => i.name === item.name);
                                  return (
                                    <button
                                      key={item.name}
                                      className={`group relative flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl border transition-all duration-200 text-center cursor-pointer ${
                                        selected
                                          ? 'bg-brand/5 border-brand/30 shadow-sm shadow-brand/10'
                                          : 'bg-white border-secondary-100 hover:border-secondary-200 hover:shadow-md hover:shadow-secondary/8 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm'
                                      }`}
                                      onClick={() => !selected && toggleCatalogItem(item.name)}
                                    >
                                      {selected && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleCatalogItem(item.name); }}
                                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm transition-colors z-10"
                                        >
                                          <X size={9} className="text-white" strokeWidth={3} />
                                        </button>
                                      )}
                                      {selected && (
                                        <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-brand rounded-full flex items-center justify-center z-10">
                                          <Check size={8} className="text-white" strokeWidth={3} />
                                        </div>
                                      )}
                                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                        selected ? 'bg-brand/10' : 'bg-secondary-50 group-hover:bg-secondary-100'
                                      }`}>
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-7 h-7 sm:w-8 sm:h-8 transition-all duration-200"
                                          style={{
                                            filter: selected
                                              ? 'brightness(0) saturate(100%) invert(54%) sepia(88%) saturate(2476%) hue-rotate(316deg) brightness(101%) contrast(101%)'
                                              : 'brightness(0) saturate(100%) invert(28%) sepia(31%) saturate(745%) hue-rotate(178deg) brightness(94%) contrast(91%)'
                                          }}
                                        />
                                      </div>
                                      <span className={`text-[10px] sm:text-[11px] font-bold leading-tight line-clamp-2 transition-colors px-0.5 ${
                                        selected ? 'text-brand' : 'text-secondary-700 group-hover:text-secondary'
                                      }`}>{item.name}</span>
                                      
                                      {selected && selectedItem && (
                                        <div className="flex items-center gap-1 mt-0.5 bg-white border border-secondary-150 rounded-full px-1.5 py-0.5 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                          <button onClick={() => updateSelectedQuantity(selectedItem.id, -1)} className="w-4 h-4 rounded-full bg-secondary-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                            <Minus size={9} className="text-secondary-500" />
                                          </button>
                                          <span className="w-5 text-center text-[11px] font-black text-secondary leading-none">{selectedItem.quantity}</span>
                                          <button onClick={() => updateSelectedQuantity(selectedItem.id, 1)} className="w-4 h-4 rounded-full bg-secondary-50 flex items-center justify-center hover:bg-brand/10 hover:text-brand transition-colors">
                                            <Plus size={9} className="text-secondary-500" />
                                          </button>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom item entry */}
                  <div className="border border-dashed border-secondary-200 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-3">Don't see your item?</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualNewItemName}
                        onChange={(e) => setManualNewItemName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addManualSelectedItem()}
                        placeholder="Type item name and press Enter"
                        className="flex-1 px-4 py-2.5 text-sm bg-white border border-secondary-200 rounded-xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/8 transition-all"
                      />
                      <button
                        onClick={addManualSelectedItem}
                        disabled={!manualNewItemName.trim()}
                        className="px-4 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <Plus size={14} />
                        <span className="hidden sm:inline text-xs">Add</span>
                      </button>
                    </div>
                  </div>

                </div>
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
                  {/* Header card */}
                  <div className="rounded-2xl p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt size={14} className="text-brand" strokeWidth={2.5} />
                      <span className="text-[10px] font-black text-brand uppercase tracking-widest">Review your list</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-secondary leading-tight mb-1">
                      {totalSelectedCount} {totalSelectedCount === 1 ? 'item' : 'items'} ready for pickup
                    </h2>
                    <p className="text-sm text-secondary-400">Adjust quantities or remove items before getting your estimate.</p>
                  </div>

                  {/* Items list */}
                  <div className="border border-secondary-100 rounded-2xl divide-y divide-secondary-100 overflow-hidden bg-white">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 md:p-4 hover:bg-secondary-50/50 transition-colors">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-secondary-50 flex items-center justify-center shrink-0">
                          <img
                            src={getItemImage(item.name)}
                            alt={item.name}
                            className="w-8 h-8 md:w-9 md:h-9"
                            style={{ filter: 'brightness(0) saturate(100%) invert(28%) sepia(31%) saturate(745%) hue-rotate(178deg) brightness(94%) contrast(91%)' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-secondary truncate">{item.name}</p>
                          <p className="text-[11px] text-secondary-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => updateSelectedQuantity(item.id, -1)} className="w-8 h-8 rounded-lg border border-secondary-200 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-black text-secondary">{item.quantity}</span>
                          <button onClick={() => updateSelectedQuantity(item.id, 1)} className="w-8 h-8 rounded-lg border border-secondary-200 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors">
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
                      className="group w-full flex items-center justify-center gap-2 px-5 py-4 bg-brand hover:bg-brand-600 text-white rounded-full shadow-2xl shadow-brand/40 hover:shadow-brand/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <ScanSearch size={16} className="transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-sm font-black uppercase tracking-wider">Get My Estimate</span>
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
                'Edit items and re-estimate'
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
