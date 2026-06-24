import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, BedDouble, Calendar, Mail, Home, Layers, Package, Minus, Plus, X, ShieldCheck } from 'lucide-react';
import { supabase, sendConfirmationEmail } from '../../lib/supabase';
import { TrustBadges } from '../TrustBadges';
import { ITEM_CATALOG } from '../QuotePage';
import { ItemIconRenderer } from '../icons/JunkItemIcons';
import { ContactIntakeForm } from '../shared/ContactIntakeForm';
import { MattressDepositPayment, MATTRESS_DEPOSIT_AMOUNT } from '../shared/MattressDepositPayment';
import { BookingDepositIntro } from '../shared/BookingDepositIntro';

type MattressType = 'Mattress Only' | 'Mattress + Box Spring' | 'Full Set';

const MINIMUM_JUNK_REMOVAL_PRICE = 169;
const MATTRESS_PRICE = 105;
const BOX_SPRING_PRICE = 66;
const BED_FRAME_PRICE = 72;
const MATTRESS_TWO_ITEM_BUNDLE_PRICE = 189;
const MATTRESS_FULL_SET_PRICE = 269;

interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  icon: React.ComponentType<{ className?: string }>;
  basePriceEstimate: number;
}

interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const MattressIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24">
    <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 4"/>
    <circle cx="8" cy="12" r="1" className="stroke-brand" strokeWidth="1.5"/>
    <circle cx="16" cy="12" r="1" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const BoxSpringIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24">
    <rect x="3" y="10" width="18" height="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10v8M12 10v8M18 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 14h18" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BedFrameIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24">
    <path d="M4 4v16M20 10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8h5" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 11h5" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MattressBoxSpringIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24">
    <rect x="4" y="6" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8.5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3"/>
    <rect x="4" y="12" width="16" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 12v5M12 12v5M17 12v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FullSetIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24">
    <rect x="5" y="4" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="5" y="9" width="14" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 9v4M12 9v4M16 9v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 14h18M4 14v5M20 14v4M7 14v2M17 14v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MattressBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingState = location.state as {
    preselectItems?: { name: string; quantity: number }[];
  } | null;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(1); // Step 7 deposit intro, step 8 payment, step 9 success
  
  // Step 1: Zip
  const [zipCode, setZipCode] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  
  // Step 2: Items Selection & Custom Additions
  const [selectedItems, setSelectedItems] = useState<BookingItem[]>(() => {
    const defaultItems: BookingItem[] = [
      { id: 'mattress', name: 'Mattress', quantity: 1, icon: MattressIcon, basePriceEstimate: MATTRESS_PRICE },
      { id: 'boxspring', name: 'Box Spring', quantity: 0, icon: BoxSpringIcon, basePriceEstimate: BOX_SPRING_PRICE },
      { id: 'bedframe', name: 'Bed Frame', quantity: 0, icon: BedFrameIcon, basePriceEstimate: BED_FRAME_PRICE },
      { id: 'dresser', name: 'Dresser', quantity: 0, icon: Layers, basePriceEstimate: 99 },
      { id: 'nightstand', name: 'Nightstand', quantity: 0, icon: BedDouble, basePriceEstimate: 50 },
      { id: 'bedding', name: 'Bedding / Pillows (Bagged)', quantity: 0, icon: Package, basePriceEstimate: 20 }
    ];

    if (incomingState?.preselectItems) {
      const items = defaultItems.map(item => ({ ...item, quantity: 0 }));
      incomingState.preselectItems.forEach(preItem => {
        const name = preItem.name.toLowerCase();
        if (name.includes('mattress')) {
          const found = items.find(i => i.id === 'mattress');
          if (found) found.quantity = preItem.quantity;
        } else if (name.includes('box spring') || name.includes('boxspring')) {
          const found = items.find(i => i.id === 'boxspring');
          if (found) found.quantity = preItem.quantity;
        } else if (name.includes('bed frame') || name.includes('bedframe')) {
          const found = items.find(i => i.id === 'bedframe');
          if (found) found.quantity = preItem.quantity;
        } else {
          const foundStandard = items.find(i => i.name.toLowerCase() === name);
          if (foundStandard) {
            foundStandard.quantity = preItem.quantity;
          } else {
            items.push({
              id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: preItem.name,
              quantity: preItem.quantity,
              icon: Package,
              basePriceEstimate: 50
            });
          }
        }
      });

      const anyQuantity = items.some(i => i.quantity > 0);
      if (!anyQuantity) {
        const found = items.find(i => i.id === 'mattress');
        if (found) found.quantity = 1;
      }

      return items;
    }
    return defaultItems;
  });

  const [customItemInput, setCustomItemInput] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('Popular Items');
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Reservation details shared across the final booking steps
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    unitNumber: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zipCode)) {
      setZipError('Please enter a valid 5-digit ZIP code.');
      return;
    }
    setZipError(null);
    setZipLoading(true);
    // Simulate ZIP check (all US ZIPs supported)
    await new Promise(resolve => setTimeout(resolve, 800));
    setZipLoading(false);
    setStep(2);
  };

  const updateItemQuantity = (id: string, delta: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => {
      // Keep standard items even if quantity is 0; remove custom items if quantity is 0
      if (['mattress', 'boxspring', 'bedframe', 'dresser', 'nightstand', 'bedding'].includes(item.id)) return true;
      return item.quantity > 0;
    }));
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity > 0 ? 0 : 1 };
      }
      return item;
    }));
  };

  const toggleCatalogItem = (name: string) => {
    setSelectedItems(prev => {
      const isPredefined = ['mattress', 'boxspring', 'bedframe', 'dresser', 'nightstand', 'bedding'].some(
        id => {
          const item = prev.find(i => i.id === id);
          return item?.name.toLowerCase() === name.toLowerCase();
        }
      );

      if (isPredefined) {
        return prev.map(item => {
          const match = item.name.toLowerCase() === name.toLowerCase();
          if (match) {
            return { ...item, quantity: item.quantity > 0 ? 0 : 1 };
          }
          return item;
        });
      }

      const existing = prev.find(i => i.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        return prev.filter(i => i.name.toLowerCase() !== name.toLowerCase());
      }

      return [...prev, {
        id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        quantity: 1,
        icon: Package,
        basePriceEstimate: 50
      }];
    });
  };

  const handleAddCustomItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSelectedItems(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        return prev.map(i => i.name.toLowerCase() === trimmed.toLowerCase() ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: trimmed,
        quantity: 1,
        icon: Package,
        basePriceEstimate: 50 // Default custom item estimate
      }];
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(e.target as Node)) {
        setShowAddressSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (addressDebounceRef.current) {
        clearTimeout(addressDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const scrollTarget = stepContentRef.current;
    if (!scrollTarget) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.requestAnimationFrame(() => {
      scrollTarget.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  }, [step]);

  const fetchAddressSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    setAddressLoading(true);
    try {
      const biasedQuery = zipCode ? `${query} ${zipCode}` : query;
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(biasedQuery)}&limit=5&lang=en&osm_tag=place:house&osm_tag=building`
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
          const suggestionZip = p.postcode || '';
          const display = [street, city, state, suggestionZip].filter(Boolean).join(', ');
          return { display, street: street.trim(), city, state, zipCode: suggestionZip };
        })
        .filter((s: AddressSuggestion) => s.street);

      setAddressSuggestions(results);
      setShowAddressSuggestions(results.length > 0);
    } catch {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    } finally {
      setAddressLoading(false);
    }
  }, [zipCode]);

  const handleAddressInput = (value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
    if (addressDebounceRef.current) {
      clearTimeout(addressDebounceRef.current);
    }
    addressDebounceRef.current = setTimeout(() => fetchAddressSuggestions(value), 300);
  };

  const selectAddressSuggestion = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode
    }));
    if (suggestion.zipCode) {
      setZipCode(suggestion.zipCode);
    }
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const calculateTotal = () => {
    let m = 0;
    let b = 0;
    let f = 0;
    let extraCost = 0;

    selectedItems.forEach(item => {
      if (item.id === 'mattress') {
        m += item.quantity;
      } else if (item.id === 'boxspring') {
        b += item.quantity;
      } else if (item.id === 'bedframe') {
        f += item.quantity;
      } else {
        extraCost += item.quantity * item.basePriceEstimate;
      }
    });

    const mattressItemCount = m + b + f;
    if (extraCost > 0) {
      const itemizedSubtotal = (m * MATTRESS_PRICE) + (b * BOX_SPRING_PRICE) + (f * BED_FRAME_PRICE) + extraCost;
      return Math.max(MINIMUM_JUNK_REMOVAL_PRICE, itemizedSubtotal);
    }

    if (extraCost === 0) {
      if (m === 1 && b === 1 && f === 1) {
        return MATTRESS_FULL_SET_PRICE;
      }

      if (mattressItemCount === 2) {
        return MATTRESS_TWO_ITEM_BUNDLE_PRICE;
      }
    }

    let bundleTotal = 0;

    // 1. Triple sets (Mattress + Box Spring + Bed Frame) -> target package price
    const tripleSets = Math.min(m, b, f);
    bundleTotal += tripleSets * MATTRESS_FULL_SET_PRICE;
    m -= tripleSets;
    b -= tripleSets;
    f -= tripleSets;

    // 2. Mattress + Box Spring sets
    const doubleSets = Math.min(m, b);
    bundleTotal += doubleSets * (MATTRESS_PRICE + BOX_SPRING_PRICE);
    m -= doubleSets;
    b -= doubleSets;

    // 3. Mattress + Bed Frame sets
    const mfSets = Math.min(m, f);
    bundleTotal += mfSets * (MATTRESS_PRICE + BED_FRAME_PRICE);
    m -= mfSets;
    f -= mfSets;

    // 4. Box Spring + Bed Frame sets
    const bfSets = Math.min(b, f);
    bundleTotal += bfSets * (BOX_SPRING_PRICE + BED_FRAME_PRICE);
    b -= bfSets;
    f -= bfSets;

    // 5. Standalone items
    bundleTotal += m * MATTRESS_PRICE;
    bundleTotal += b * BOX_SPRING_PRICE;
    bundleTotal += f * BED_FRAME_PRICE;

    const subtotal = bundleTotal + extraCost;
    return subtotal > 0 ? Math.max(MINIMUM_JUNK_REMOVAL_PRICE, subtotal) : 0;
  };

  const handleContactReveal = async (name: string, phone: string) => {
    setContactLoading(true);
    try {
      const totalPrice = calculateTotal();
      const itemsList = selectedItems.filter(i => i.quantity > 0).map(i => `${i.quantity}x ${i.name}`);

      try {
        const { error } = await supabase.rpc('create_prebooking', {
          p_customer_info: {
            name,
            phone,
            email: ''
          },
          p_booking_details: {
            service_type: 'Mattress Disposal',
            zip_code: zipCode || null,
            details: `Mattress Disposal service. Items: ${itemsList.join(', ')}. Estimated Price: $${totalPrice}`,
            estimated_items: itemsList,
            price: totalPrice
          },
          p_status: 'partially_submitted'
        });

        if (error) {
          console.warn('Supabase mattress lead capture failed, proceeding to price reveal:', error);
        }
      } catch (err) {
        console.warn('Supabase mattress lead capture failed, proceeding to price reveal:', err);
      }

      setFormData(prev => ({ ...prev, name, phone }));
      setStep(4);
    } finally {
      setContactLoading(false);
    }
  };

  const handleFinalSubmit = async (paymentIntentId: string) => {
    setSubmitLoading(true);

    try {
      const generatedOrderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const itemsList = selectedItems.filter(i => i.quantity > 0).map(i => `${i.quantity}x ${i.name}`);
      const totalPrice = calculateTotal();
      const itemsSummaryText = itemsList.join(', ');
      
      const customerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      const bookingDetails = {
        service_type: 'Mattress Disposal',
        items: selectedItems.filter(i => i.quantity > 0).map(i => ({ name: i.name, quantity: i.quantity })),
        details: `Mattress Disposal service. Items: ${itemsSummaryText}. Total Price: $${totalPrice}`,
        preferred_date: formData.date,
        price: totalPrice,
        deposit_amount: MATTRESS_DEPOSIT_AMOUNT,
        deposit_paid: true,
        stripe_payment_intent_id: paymentIntentId,
        terms_accepted_at: new Date().toISOString()
      };

      const locationInfo = {
        address: formData.address,
        unit_number: formData.unitNumber || null,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zipCode || zipCode
      };

      const { error } = await supabase
        .from('bookings')
        .insert([{
          order_number: generatedOrderNumber,
          customer_info: customerInfo,
          location_info: locationInfo,
          booking_details: bookingDetails,
          status: 'pending'
        }]);

      if (error) {
        console.warn('Supabase booking error:', error);
      }

      // Send email
      await sendConfirmationEmail('booking', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        unit_number: formData.unitNumber || null,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zipCode || zipCode,
        date: formData.date,
        service: `Mattress Disposal`,
        details: itemsSummaryText,
        price: totalPrice,
        orderNumber: generatedOrderNumber
      });

      setOrderNumber(generatedOrderNumber);
      setStep(9);
    } catch (err) {
      console.error('Error submitting booking:', err);
      throw err instanceof Error ? err : new Error('Failed to complete booking after payment.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
          <MapPin className="w-6 h-6 text-brand" />
        </div>
        <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Confirm Your ZIP Code</h2>
        <p className="text-secondary-400 text-xs">Available in all 50 states with vetted local crews.</p>
      </div>

      <form onSubmit={handleZipSubmit} className="space-y-4">
        <div className="relative group flex items-center bg-white border border-secondary-100 hover:border-brand/40 hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 focus-within:shadow-[0_4px_20px_rgba(255,0,110,0.15)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 p-1 rounded-xl w-full">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value.replace(/\D/g, ''));
              setZipError(null);
            }}
            placeholder="Enter ZIP code"
            className="flex-1 px-4 py-3 text-base bg-transparent border-none text-secondary placeholder:text-secondary-300 focus:outline-none font-mono tracking-wider"
            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
            required
          />
          <button
            type="submit"
            disabled={zipCode.length !== 5 || zipLoading}
            className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 shrink-0 rounded-lg"
          >
            {zipLoading ? <Loader2 size={16} className="animate-spin" /> : 'Check'}
          </button>
        </div>
        {zipError && <p className="text-xs text-red-500 font-semibold text-center">{zipError}</p>}
      </form>
    </div>
  );

  const renderStep2 = () => {
    const hasSelectedItems = selectedItems.some(i => i.quantity > 0);

    const primaryOptions = [
      {
        id: 'mattress',
        name: 'Mattress',
        desc: 'Any size mattress (Twin to CA King).',
        icon: MattressIcon
      },
      {
        id: 'boxspring',
        name: 'Box Spring',
        desc: 'Matching box spring foundation.',
        icon: BoxSpringIcon
      },
      {
        id: 'bedframe',
        name: 'Bed Frame',
        desc: 'Metal or wooden bed frame.',
        icon: BedFrameIcon
      }
    ];

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-lg font-black text-secondary uppercase tracking-wider">What are we picking up?</h2>
          <p className="text-secondary-400 text-xs">Select your items, then reveal your custom estimate.</p>
        </div>

        {/* Primary Options Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {primaryOptions.map((option) => {
            const selectedItem = selectedItems.find(i => i.id === option.id);
            const quantity = selectedItem?.quantity || 0;
            const selected = quantity > 0;
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                type="button"
                className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 md:p-5 rounded-2xl border transition-all duration-300 text-center cursor-pointer min-h-[132px] sm:min-h-[172px] ${
                  selected
                    ? 'bg-brand/[0.03] border-brand ring-2 ring-brand/10 shadow-lg shadow-brand/5 scale-[1.02]'
                    : 'bg-white border-secondary-100 hover:border-secondary-100 hover:shadow-lg hover:shadow-secondary-100/50 hover:-translate-y-1 active:translate-y-0 active:shadow-sm'
                }`}
                onClick={() => toggleItemSelection(option.id)}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-4.5 h-4.5 bg-brand text-white rounded-full flex items-center justify-center shadow-md animate-scale-in z-10">
                    <Check size={10} strokeWidth={4} />
                  </div>
                )}
                
                <div className="flex flex-col items-center flex-1 w-full justify-center">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${
                    selected ? 'bg-brand/10 text-brand' : 'bg-secondary-50 text-secondary-400 group-hover:bg-secondary-100 group-hover:text-secondary-500'
                  }`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  
                  <span className={`text-[10px] sm:text-xs md:text-sm font-black leading-tight transition-colors px-0.5 ${
                    selected ? 'text-brand' : 'text-secondary-800 group-hover:text-secondary'
                  }`}>
                    {option.name}
                  </span>
                  
                  <span className="hidden sm:block text-[10px] text-secondary-400 mt-1 leading-normal max-w-[160px]">
                    {option.desc}
                  </span>
                </div>
                
                <div className="mt-2 flex flex-col items-center shrink-0 w-full" onClick={(e) => e.stopPropagation()}>
                  {selected ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 bg-white border border-secondary-100 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 shadow-sm hover:shadow-md transition-shadow duration-205">
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(option.id, -1)}
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Minus size={8} className="text-secondary-500" />
                      </button>
                      <span className="w-4 sm:w-5 text-center text-[10px] sm:text-xs font-black text-secondary leading-none">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateItemQuantity(option.id, 1)}
                        className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white flex items-center justify-center hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                      >
                        <Plus size={8} className="text-secondary-500" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => toggleItemSelection(option.id)}
                      className="px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-lg border border-secondary-100 text-secondary-400 group-hover:border-brand group-hover:text-brand group-hover:bg-brand/5 transition-all cursor-pointer"
                    >
                      + Select
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Suggested Add-ons (Upsells) / Full Catalog Selection Trigger Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="w-full flex items-center justify-between p-4 bg-white border border-dashed border-secondary-200 hover:border-brand hover:bg-brand/[0.01] rounded-2xl transition-all group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary-500 group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center transition-colors">
                <Plus size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wider text-secondary">Add more items</p>
                <p className="text-[10px] text-secondary-400 mt-0.5">Need to dispose of other items like dressers, TVs, or junk?</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all shrink-0">
              <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
            </div>
          </button>
        </div>

        {/* Aggregated Selected Items Summary list */}
        {selectedItems.some(i => i.quantity > 0) && (
          <div className="border border-secondary-100 rounded-2xl divide-y divide-secondary-100 overflow-hidden bg-white mt-8 animate-fade-in">
            <div className="bg-secondary-50/50 px-4 py-2.5 border-b border-secondary-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-secondary-400">Selected Items Summary</p>
            </div>
            {selectedItems.filter(i => i.quantity > 0).map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-between p-3 px-4 bg-white hover:bg-secondary-50/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-secondary-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-secondary">{item.name}</p>
                      <p className="text-[10px] text-secondary-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors cursor-pointer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-secondary">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateItemQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors cursor-pointer"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!hasSelectedItems && (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-secondary-100 rounded-2xl bg-secondary-50/10">
            <div className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center mb-2">
              <BedDouble className="w-5 h-5 text-secondary-300" />
            </div>
            <p className="text-xs font-semibold text-secondary-400">No items selected</p>
            <p className="text-[10px] text-secondary-300 mt-0.5">Please select a package or add bedroom items above.</p>
          </div>
        )}

        <div className="pt-6 flex gap-3">
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            type="button"
            onClick={() => {
              if (calculateTotal() > 0) {
                setStep(3);
              }
            }}
            disabled={calculateTotal() === 0}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
          >
            Reveal Price <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <ContactIntakeForm
        serviceType="Mattress Disposal"
        isLoading={contactLoading}
        onReveal={handleContactReveal}
      />

      <button 
        type="button" 
        onClick={() => setStep(2)} 
        className="w-full py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to Items
      </button>
    </div>
  );

  const renderStep4 = () => {
    const total = calculateTotal();
    const pickupFee = Math.round(total * 0.65);
    const disposalFee = total - pickupFee;
    const visibleItems = selectedItems.filter(i => i.quantity > 0);
    const totalItems = visibleItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-6">
          <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Estimate Ready
          </span>
          <h2 className="text-lg font-black text-secondary uppercase tracking-wider font-display">Your Mattress Removal Price</h2>
          <p className="text-secondary-400 text-xs">Review your estimate and selected items before booking pickup.</p>
        </div>

        <div className="bg-white border border-secondary-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-24 h-20 shrink-0 rounded-xl overflow-hidden bg-secondary-50 border border-secondary-100">
            <img 
              src="/mattress-pickup.webp"
              alt="Mattress removal estimate"
              className="w-full h-full object-cover"
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
            <h3 className="text-sm font-black text-secondary">Mattress Disposal</h3>
            <p className="text-secondary-400 text-xs mt-1 leading-normal">
              {totalItems} item{totalItems === 1 ? '' : 's'} selected
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-secondary-100">
          <div className="space-y-3 mb-5 pb-5 border-b border-secondary-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-secondary-600 font-medium">Pick up & Admin fee</span>
              <span className="text-secondary-900 font-bold">${pickupFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-secondary-600 font-medium">Disposal & Landfill fee</span>
              <span className="text-secondary-900 font-bold">${disposalFee}</span>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</p>
              <p className="text-xs text-secondary-500 mt-1">Minimum order is ${MINIMUM_JUNK_REMOVAL_PRICE}</p>
            </div>
            <p className="text-3xl font-black text-brand">${total}</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
            <ShieldCheck size={18} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black text-emerald-950">Safe Protect™ Included</p>
              <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Covered</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 leading-normal">
              All bookings are covered by platform damage protection.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-medium text-secondary-400 uppercase tracking-wider">
              {totalItems} item{totalItems === 1 ? '' : 's'}
            </p>
            <button 
              type="button"
              onClick={() => setStep(2)} 
              className="text-brand text-xs font-black uppercase tracking-wider hover:underline transition-colors border-none bg-transparent cursor-pointer shrink-0"
            >
              Change
            </button>
          </div>
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">{item.name}</span>
                {item.quantity > 1 && <span className="text-secondary-400 text-xs">×{item.quantity}</span>}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-secondary-500 leading-relaxed">
          Upfront flat-rate pricing for mattress pickup and disposal. Final details are confirmed by your matched local provider.
        </p>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setStep(5)}
            className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="text-sm font-black uppercase tracking-wider">
              Continue to Booking
            </span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1 bg-transparent cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <p className="text-[10px] text-secondary-300 text-center">* Final price confirmed on-site</p>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-lg font-black text-secondary uppercase tracking-wider font-display">Schedule Pickup</h2>
        <p className="text-secondary-400 text-xs">Choose your preferred date and confirmation email.</p>
      </div>

      <div className="p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100 flex justify-between items-center shadow-sm">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Selected Items</p>
          <p className="font-bold text-secondary text-xs mt-0.5 truncate">
            {selectedItems.filter(i => i.quantity > 0).map(i => `${i.quantity}x ${i.name}`).join(', ')}
          </p>
        </div>
        <button 
          type="button"
          onClick={() => setStep(4)} 
          className="text-brand text-xs font-black uppercase tracking-wider hover:underline transition-colors border-none bg-transparent cursor-pointer shrink-0"
        >
          Review
        </button>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-secondary-100 flex justify-between items-center shadow-sm">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Contact Info</p>
          <p className="font-bold text-secondary text-xs mt-0.5 truncate">
            {formData.name} - {formData.phone}
          </p>
        </div>
        <button 
          type="button"
          onClick={() => setStep(3)} 
          className="text-brand text-xs font-black uppercase tracking-wider hover:underline transition-colors border-none bg-transparent cursor-pointer shrink-0"
        >
          Change
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setStep(6);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Preferred Date</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand">
              <Calendar className="w-5 h-5 text-secondary-400 group-focus-within:text-brand/70" />
            </div>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button 
            type="button" 
            onClick={() => setStep(4)} 
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            type="submit"
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
          >
            Continue to Address <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep6 = () => (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-lg font-black text-secondary uppercase tracking-wider font-display">Pickup Address</h2>
        <p className="text-secondary-400 text-xs">Tell us where to pick up your mattress.</p>
      </div>

      <div className="p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100 flex justify-between items-center shadow-sm">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Schedule</p>
          <p className="font-bold text-secondary text-xs mt-0.5 truncate">
            {formData.date ? new Date(formData.date).toLocaleDateString() : 'Date not selected'} - {formData.email}
          </p>
        </div>
        <button 
          type="button"
          onClick={() => setStep(5)} 
          className="text-brand text-xs font-black uppercase tracking-wider hover:underline transition-colors border-none bg-transparent cursor-pointer shrink-0"
        >
          Change
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setStep(7);
        }}
        className="space-y-4"
      >
        <div ref={addressDropdownRef} className="relative">
          <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Pickup Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Home className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              required
              autoComplete="street-address"
              value={formData.address}
              onChange={e => handleAddressInput(e.target.value)}
              onFocus={() => addressSuggestions.length > 0 && setShowAddressSuggestions(true)}
              placeholder="Start typing your pickup address..."
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
            />
            {addressLoading && (
              <Loader2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-secondary-300" />
            )}
          </div>
          {showAddressSuggestions && addressSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-xl shadow-lg max-h-52 overflow-y-auto">
              {addressSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.display}-${index}`}
                  type="button"
                  onClick={() => selectAddressSuggestion(suggestion)}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-secondary-50 transition-colors border-b border-secondary-100 last:border-b-0 flex items-start gap-2 text-secondary"
                >
                  <MapPin size={14} className="text-brand mt-0.5 shrink-0" />
                  <span>{suggestion.display}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">
            Apartment / Unit / Suite <span className="text-secondary-300 normal-case tracking-normal">(optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Home className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              autoComplete="address-line2"
              value={formData.unitNumber}
              onChange={e => setFormData({ ...formData, unitNumber: e.target.value })}
              placeholder="Apt 4B, Suite 200, Gate code..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
          <div>
            <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">City</label>
            <input
              type="text"
              autoComplete="address-level2"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
              className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">State</label>
            <input
              type="text"
              autoComplete="address-level1"
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              placeholder="State"
              className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">ZIP</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={formData.zipCode || zipCode}
              onChange={e => {
                const nextZip = e.target.value.replace(/\D/g, '').slice(0, 5);
                setFormData({ ...formData, zipCode: nextZip });
                setZipCode(nextZip);
              }}
              placeholder="ZIP"
              className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand transition-all duration-300"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button 
            type="button" 
            onClick={() => setStep(5)} 
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            type="submit"
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
          >
            Continue <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep7 = () => (
    <BookingDepositIntro
      onBack={() => setStep(6)}
      onContinue={() => setStep(8)}
    />
  );

  const renderStep8 = () => (
    <MattressDepositPayment
      appointmentDate={formData.date}
      estimatedTotal={calculateTotal()}
      customerEmail={formData.email}
      customerName={formData.name}
      customerPhone={formData.phone}
      serviceType="Mattress Disposal"
      isLoading={submitLoading}
      onBack={() => setStep(7)}
      onPaymentSuccess={handleFinalSubmit}
    />
  );

  const renderSuccess = () => (
    <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in py-12">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
        <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-secondary tracking-tight">Booking Confirmed!</h2>
      <p className="text-secondary-500 text-sm leading-relaxed">
        Your mattress disposal is scheduled for <span className="font-bold text-secondary">{new Date(formData.date).toLocaleDateString()}</span>.<br/>
        We've sent a confirmation email with details.
      </p>
      
      <div className="bg-secondary-50/50 p-4 rounded-2xl border border-secondary-100 text-left space-y-2 max-w-sm mx-auto shadow-sm mb-6">
        <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Scheduled Items</p>
        <p className="text-secondary font-bold text-xs leading-normal">
          {selectedItems.filter(i => i.quantity > 0).map(i => `${i.quantity}x ${i.name}`).join(', ')}
        </p>
        <div className="pt-2 border-t border-secondary-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Confirmed Price</span>
          <span className="text-brand font-black text-sm">${calculateTotal()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider">Deposit Paid</span>
          <span className="text-emerald-600 font-black text-sm">${MATTRESS_DEPOSIT_AMOUNT}</span>
        </div>
      </div>

      {orderNumber && (
        <div className="inline-block px-6 py-3.5 bg-secondary-50 rounded-2xl border border-secondary-100 font-mono font-black text-lg text-secondary shadow-sm">
          {orderNumber}
        </div>
      )}

      <div className="pt-8">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3.5 bg-secondary hover:bg-secondary-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  const catalogQuery = catalogSearch.trim().toLowerCase();
  const visibleCatalogItems = catalogQuery
    ? ITEM_CATALOG.flatMap(cat => cat.items).filter(item => item.name.toLowerCase().includes(catalogQuery))
    : ITEM_CATALOG.find(cat => cat.label === expandedCategory)?.items || [];
  const selectedCatalogCount = selectedItems.filter(i => !['mattress', 'boxspring', 'bedframe'].includes(i.id) && i.quantity > 0).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Asymmetric Typography Header */}
      <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">
          Book mattress <span className="text-brand">removal.</span>
        </h1>
        <p className="text-sm text-secondary-400">
          A few quick steps to check availability, select options, reveal your price, and complete booking. A matched local provider confirms within 15 minutes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">


        <div ref={stepContentRef} className="mt-8 scroll-mt-28 md:scroll-mt-36">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
          {step === 7 && renderStep7()}
          {step === 8 && renderStep8()}
          {step === 9 && renderSuccess()}
        </div>
      </div>
      
      <div className="mt-20">
        <TrustBadges />
      </div>

      {/* Junk Removal Catalog Modal Overlay */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center p-2 sm:p-4 md:p-6 bg-secondary/70 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="bg-white w-full h-full max-h-full sm:max-w-5xl sm:rounded-3xl shadow-2xl border border-secondary-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-secondary-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Plus size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-secondary text-sm sm:text-base uppercase tracking-wider">Junk Removal Catalog</h3>
                  <p className="hidden sm:block text-[10px] text-secondary-400 mt-0.5 font-bold uppercase tracking-wider">Select any other items to haul away</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="w-10 h-10 rounded-full bg-secondary-50 hover:bg-brand/10 hover:text-brand text-secondary-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Search box */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-secondary-100 bg-secondary-50/40 flex items-center gap-3 shrink-0">
              <div className="relative group flex-1">
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search catalog items (e.g. Refrigerator, Sofa)..."
                  className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-secondary-100 rounded-2xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-3 focus:ring-brand/8 shadow-sm transition-all duration-200"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-secondary-200 hover:bg-secondary-300 flex items-center justify-center transition-colors"
                  >
                    <X size={10} className="text-secondary-600" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            {/* Main Content: Sidebar and Grid */}
            <div className="flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden bg-secondary-50/20">
              {/* Left Sidebar Categories Selector */}
              <div className="w-full sm:w-[210px] md:w-[230px] shrink-0 flex flex-row sm:flex-col gap-1 sm:gap-0.5 border-b sm:border-b-0 sm:border-r border-secondary-100 p-3 sm:p-4 overflow-x-auto sm:overflow-y-auto scrollbar-none bg-white">
                {ITEM_CATALOG.map((category) => {
                  const isActive = expandedCategory === category.label && !catalogSearch.trim();
                  const selectedCount = selectedItems.filter(i => {
                    const inCat = category.items.some(ci => ci.name.toLowerCase() === i.name.toLowerCase());
                    return inCat && i.quantity > 0;
                  }).length;

                  return (
                    <button
                      key={category.label}
                      type="button"
                      onClick={() => {
                        setExpandedCategory(category.label);
                        setCatalogSearch('');
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group shrink-0 w-auto sm:w-full ${
                        isActive
                          ? 'bg-brand/10 text-brand'
                          : 'hover:bg-secondary-50 text-secondary-500 hover:text-secondary'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-brand/20 text-brand' : 'bg-secondary-100 text-secondary-400 group-hover:bg-brand/10 group-hover:text-brand'
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
                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-brand text-white rounded-full ml-auto shrink-0">
                          {selectedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Items Grid & Custom Entry */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 md:p-6">
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                      {catalogSearch.trim() ? 'Search Results' : expandedCategory}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-secondary-100 text-secondary-400 text-[10px] font-bold">
                      {visibleCatalogItems.length}
                    </span>
                  </div>
                  
                  {/* Grid */}
                  {visibleCatalogItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-secondary-100 rounded-3xl bg-white">
                      <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center mb-3">
                        <Package size={20} className="text-secondary-300" />
                      </div>
                      <p className="text-sm font-semibold text-secondary-400">No items found</p>
                      <p className="text-xs text-secondary-300 mt-1">Try another search or add a custom item below.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {visibleCatalogItems.map((item) => {
                      const selectedItem = selectedItems.find(i => i.name.toLowerCase() === item.name.toLowerCase());
                      const quantity = selectedItem?.quantity || 0;
                      const selected = quantity > 0;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          className={`group relative flex flex-col items-center gap-1 p-2 sm:p-3 rounded-2xl border transition-all duration-300 text-center cursor-pointer min-h-[104px] sm:min-h-[150px] ${
                            selected
                              ? 'bg-brand/[0.03] border-brand ring-2 ring-brand/10 shadow-lg shadow-brand/5 scale-[1.02]'
                              : 'bg-white border-secondary-100 hover:border-secondary-100 hover:shadow-lg hover:shadow-secondary-100/50 hover:-translate-y-1 active:translate-y-0 active:shadow-sm'
                          }`}
                          onClick={() => toggleCatalogItem(item.name)}
                        >
                          {selected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center shadow-md animate-scale-in z-10">
                              <Check size={11} strokeWidth={3.5} />
                            </div>
                          )}
                          
                          <div className="flex flex-col items-center flex-1 w-full justify-center gap-1 sm:gap-1.5">
                            <div className={`w-9 h-9 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              selected ? 'bg-brand/10' : 'bg-white group-hover:bg-secondary-100'
                            }`}>
                              <ItemIconRenderer
                                imagePath={item.image}
                                className="w-5.5 h-5.5 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            
                            <span className={`text-[9px] sm:text-[11px] font-bold leading-tight line-clamp-2 transition-colors px-0.5 ${
                              selected ? 'text-brand' : 'text-secondary-700 group-hover:text-secondary'
                            }`}>
                              {item.name}
                            </span>
                          </div>
                          
                          <div className="mt-1 flex flex-col items-center shrink-0 w-full" onClick={(e) => e.stopPropagation()}>
                            {selected && selectedItem ? (
                              <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 bg-white border border-secondary-100 rounded-full px-1.5 sm:px-2 py-0.5 shadow-sm hover:shadow-md transition-shadow duration-205">
                                <button
                                  type="button"
                                  onClick={() => updateItemQuantity(selectedItem.id, -1)}
                                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <Minus size={8} className="text-secondary-500" />
                                </button>
                                <span className="w-4 sm:w-5 text-center text-[10px] sm:text-xs font-black text-secondary leading-none">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateItemQuantity(selectedItem.id, 1)}
                                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white flex items-center justify-center hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                                >
                                  <Plus size={8} className="text-secondary-500" />
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => toggleCatalogItem(item.name)}
                                className="mt-0.5 sm:mt-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[7px] sm:text-[8px] font-black uppercase tracking-wider rounded-lg border border-secondary-100 text-secondary-400 group-hover:border-brand group-hover:text-brand group-hover:bg-brand/5 transition-all cursor-pointer"
                              >
                                + Add
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                    </div>
                  )}

                {/* Custom entry at the bottom */}
                <div className="border border-dashed border-secondary-100 rounded-2xl p-4 bg-white">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-3">Don't see your item?</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customItemInput}
                      onChange={(e) => setCustomItemInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomItem(customItemInput);
                          setCustomItemInput('');
                        }
                      }}
                      placeholder="Type item name and press Enter"
                      className="flex-1 px-4 py-2.5 text-sm bg-white border border-secondary-100 rounded-xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/8 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddCustomItem(customItemInput);
                        setCustomItemInput('');
                      }}
                      disabled={!customItemInput.trim()}
                      className="px-4 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span className="hidden sm:inline text-xs">Add</span>
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-4 sm:px-6 py-4 border-t border-secondary-100 bg-white flex items-center justify-between shrink-0 shadow-[0_-8px_24px_rgba(15,23,42,0.04)]">
              <span className="text-xs font-bold text-secondary-500">
                {selectedCatalogCount} catalog item(s) selected
              </span>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-6 py-3 bg-secondary hover:bg-brand text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-secondary/10 hover:shadow-brand/20 cursor-pointer"
              >
                Confirm & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
