import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2, MapPin, BedDouble, Calendar, User, Phone, Mail, Home, Layers, Package, Minus, Plus, X } from 'lucide-react';
import { supabase, sendConfirmationEmail } from '../../lib/supabase';
import { TrustBadges } from '../TrustBadges';
import { ITEM_CATALOG } from '../QuotePage';
import { ItemIconRenderer } from '../icons/JunkItemIcons';

type MattressType = 'Mattress Only' | 'Mattress + Box Spring' | 'Full Set';

interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  icon: React.ComponentType<{ className?: string }>;
  basePriceEstimate: number;
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

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Step 4 is success
  
  // Step 1: Zip
  const [zipCode, setZipCode] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  
  // Step 2: Items Selection & Custom Additions
  const [selectedItems, setSelectedItems] = useState<BookingItem[]>(() => {
    const defaultItems: BookingItem[] = [
      { id: 'mattress', name: 'Mattress', quantity: 1, icon: MattressIcon, basePriceEstimate: 75 },
      { id: 'boxspring', name: 'Box Spring', quantity: 0, icon: BoxSpringIcon, basePriceEstimate: 65 },
      { id: 'bedframe', name: 'Bed Frame', quantity: 0, icon: BedFrameIcon, basePriceEstimate: 70 },
      { id: 'dresser', name: 'Dresser', quantity: 0, icon: Layers, basePriceEstimate: 75 },
      { id: 'nightstand', name: 'Nightstand', quantity: 0, icon: BedDouble, basePriceEstimate: 45 },
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

  // Step 3: Reservation Details Form
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
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

    let bundleTotal = 0;

    // 1. Triple sets (Mattress + Box Spring + Bed Frame) -> $175
    const tripleSets = Math.min(m, b, f);
    bundleTotal += tripleSets * 175;
    m -= tripleSets;
    b -= tripleSets;
    f -= tripleSets;

    // 2. Mattress + Box Spring sets -> $125
    const doubleSets = Math.min(m, b);
    bundleTotal += doubleSets * 125;
    m -= doubleSets;
    b -= doubleSets;

    // 3. Mattress + Bed Frame sets -> $125
    const mfSets = Math.min(m, f);
    bundleTotal += mfSets * 125;
    m -= mfSets;
    f -= mfSets;

    // 4. Box Spring + Bed Frame sets -> $115
    const bfSets = Math.min(b, f);
    bundleTotal += bfSets * 115;
    b -= bfSets;
    f -= bfSets;

    // 5. Standalone items
    bundleTotal += m * 75;
    bundleTotal += b * 65;
    bundleTotal += f * 70;

    return bundleTotal + extraCost;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        price: totalPrice
      };

      const locationInfo = {
        address: formData.address,
        zip_code: zipCode
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
        date: formData.date,
        service: `Mattress Disposal`,
        details: itemsSummaryText,
        price: totalPrice,
        orderNumber: generatedOrderNumber
      });

      setOrderNumber(generatedOrderNumber);
      setStep(4);
    } catch (err) {
      console.error('Error submitting booking:', err);
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
          <p className="text-secondary-400 text-xs">Select your items. Transparent upfront flat-rates.</p>
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
                className={`group relative flex flex-col items-center justify-between p-2 sm:p-4 md:p-5 rounded-2xl border transition-all duration-300 text-center cursor-pointer min-h-[140px] sm:min-h-[180px] ${
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
                  <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-1.5 sm:mb-3 transition-all duration-300 ${
                    selected ? 'bg-brand/10 text-brand' : 'bg-secondary-50 text-secondary-400 group-hover:bg-secondary-100 group-hover:text-secondary-500'
                  }`}>
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110" />
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

        {/* Total Price and Proceed */}
        <div className="bg-secondary-50/50 rounded-3xl p-5 md:p-6 border border-secondary-100 mt-8 flex justify-between items-end">
          <div>
            <p className="text-[10px] md:text-xs font-bold text-secondary-400 uppercase tracking-wider">Estimated Total</p>
            <p className="text-xs text-secondary-500 mt-1">Upfront Flat-Rate pricing</p>
          </div>
          <p className="text-2xl md:text-3xl font-black text-brand">${calculateTotal()}</p>
        </div>

        <div className="pt-6 flex gap-3">
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-lg flex items-center justify-center gap-2 bg-transparent cursor-pointer"
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
            className="flex-1 py-4 bg-brand hover:bg-brand-600 text-white font-black text-sm uppercase tracking-widest rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
          >
            Continue to Booking <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-lg font-black text-secondary uppercase tracking-wider font-display">Reservation Details</h2>
        <p className="text-secondary-400 text-xs">Tell us when and where to pick up your mattress.</p>
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
          onClick={() => setStep(2)} 
          className="text-brand text-xs font-black uppercase tracking-wider hover:underline transition-colors border-none bg-transparent cursor-pointer shrink-0"
        >
          Change
        </button>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-4">
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
          <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Phone</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-secondary-400" />
              </div>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
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
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Pickup Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Home className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-100 rounded-xl outline-none font-medium text-secondary text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button 
            type="button" 
            onClick={() => setStep(2)} 
            className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider border border-secondary-100 text-secondary hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 bg-transparent cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="flex-1 py-3.5 bg-brand hover:bg-brand-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-[0.99] cursor-pointer"
          >
            {submitLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Asymmetric Typography Header */}
      <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">
          Book mattress <span className="text-brand">removal.</span>
        </h1>
        <p className="text-sm text-secondary-400">
          Three quick steps — check availability, select options, complete booking. A matched local provider confirms within 15 minutes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">


        <div className="mt-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderSuccess()}
        </div>
      </div>
      
      <div className="mt-20">
        <TrustBadges />
      </div>

      {/* Junk Removal Catalog Modal Overlay */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-secondary/70 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="bg-white w-full h-full sm:h-[85vh] sm:max-w-4xl sm:rounded-3xl shadow-2xl border border-secondary-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-secondary-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Plus size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-secondary text-sm sm:text-base uppercase tracking-wider">Junk Removal Catalog</h3>
                  <p className="text-[10px] text-secondary-400 mt-0.5 font-bold uppercase tracking-wider">Select any other items to haul away</p>
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
            <div className="px-6 py-3 border-b border-secondary-100 bg-secondary-50/30 flex items-center gap-3 shrink-0">
              <div className="relative group flex-1">
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search catalog items (e.g. Refrigerator, Sofa)..."
                  className="w-full px-4 py-2.5 text-xs bg-white border border-secondary-100 rounded-xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/8 transition-all"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary-200 hover:bg-secondary-300 flex items-center justify-center transition-colors"
                  >
                    <X size={8} className="text-secondary-600" strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>

            {/* Main Content: Sidebar and Grid */}
            <div className="flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden bg-white">
              {/* Left Sidebar Categories Selector */}
              <div className="w-full sm:w-[200px] shrink-0 flex flex-row sm:flex-col gap-1 sm:gap-0.5 border-b sm:border-b-0 sm:border-r border-secondary-100 p-3 overflow-x-auto sm:overflow-y-auto scrollbar-none">
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 group shrink-0 w-auto sm:w-full ${
                        isActive
                          ? 'bg-brand/10 text-brand font-black'
                          : 'hover:bg-secondary-50 text-secondary-500 hover:text-secondary'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-brand/20 text-brand' : 'bg-secondary-100 text-secondary-400 group-hover:bg-brand/10 group-hover:text-brand'
                      }`}>
                        <span className="scale-75">{category.icon}</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] leading-tight truncate whitespace-nowrap sm:whitespace-normal font-semibold">
                        {category.label}
                      </span>
                      {selectedCount > 0 && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 bg-brand text-white rounded-full ml-auto">
                          {selectedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Items Grid & Custom Entry */}
              <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 overflow-y-auto bg-secondary-50/10">
                <div className="flex-1 min-h-0">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                      {catalogSearch.trim() ? 'Search Results' : expandedCategory}
                    </h4>
                  </div>
                  
                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {(catalogSearch.trim()
                      ? ITEM_CATALOG.flatMap(cat => cat.items).filter(i => i.name.toLowerCase().includes(catalogSearch.toLowerCase()))
                      : ITEM_CATALOG.find(cat => cat.label === expandedCategory)?.items || []
                    ).map((item) => {
                      const selectedItem = selectedItems.find(i => i.name.toLowerCase() === item.name.toLowerCase());
                      const quantity = selectedItem?.quantity || 0;
                      const selected = quantity > 0;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          className={`group relative flex flex-col items-center justify-between p-2 sm:p-3.5 rounded-2xl border transition-all duration-300 text-center cursor-pointer min-h-[110px] sm:min-h-[145px] ${
                            selected
                              ? 'bg-brand/[0.03] border-brand ring-2 ring-brand/10 shadow-lg shadow-brand/5 scale-[1.02]'
                              : 'bg-white border-secondary-100 hover:border-secondary-100 hover:shadow-lg hover:shadow-secondary-100/50 hover:-translate-y-1 active:translate-y-0 active:shadow-sm'
                          }`}
                          onClick={() => toggleCatalogItem(item.name)}
                        >
                          {selected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand text-white rounded-full flex items-center justify-center shadow-sm animate-scale-in z-10">
                              <Check size={9} strokeWidth={4} />
                            </div>
                          )}
                          
                          <div className="flex flex-col items-center flex-1 w-full justify-center">
                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center mb-1 sm:mb-1.5 transition-all duration-300 ${
                              selected ? 'bg-brand/10 text-brand' : 'bg-secondary-50 text-secondary-400 group-hover:bg-secondary-100 group-hover:text-secondary-500'
                            }`}>
                              <ItemIconRenderer
                                imagePath={item.image}
                                className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            
                            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold leading-tight line-clamp-2 px-0.5 text-secondary-700 group-hover:text-secondary">
                              {item.name}
                            </span>
                          </div>
                          
                          <div className="mt-1 flex flex-col items-center shrink-0 w-full" onClick={(e) => e.stopPropagation()}>
                            {selected ? (
                              <div className="flex items-center gap-0.5 sm:gap-1 mt-1 bg-white border border-secondary-100 rounded-full px-1 py-0.5 sm:px-1.5 sm:py-0.5 shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => updateItemQuantity(selectedItem.id, -1)}
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                  <Minus size={7} className="text-secondary-500" />
                                </button>
                                <span className="w-3.5 sm:w-4 text-center text-[9px] sm:text-[10px] font-black text-secondary leading-none">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateItemQuantity(selectedItem.id, 1)}
                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white flex items-center justify-center hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                                >
                                  <Plus size={7} className="text-secondary-500" />
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => toggleCatalogItem(item.name)}
                                className="mt-1 px-1.5 py-0.5 text-[7px] sm:text-[8px] font-black uppercase tracking-wider rounded border border-secondary-100 text-secondary-400 group-hover:border-brand group-hover:text-brand group-hover:bg-brand/5 transition-all cursor-pointer"
                              >
                                + Add
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom entry at the bottom */}
                <div className="pt-4 mt-4 border-t border-dashed border-secondary-200 shrink-0">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-2">Don't see your item?</p>
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
                      placeholder="e.g. Old Chair, Lamp, Rug"
                      className="flex-1 px-4 py-2.5 text-xs bg-white border border-secondary-100 rounded-xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/8 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddCustomItem(customItemInput);
                        setCustomItemInput('');
                      }}
                      disabled={!customItemInput.trim()}
                      className="px-4 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-4 border-t border-secondary-100 bg-secondary-50/30 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-secondary-500">
                {selectedItems.filter(i => !['mattress', 'boxspring', 'bedframe'].includes(i.id) && i.quantity > 0).length} catalog item(s) selected
              </span>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-6 py-3 bg-brand hover:bg-brand-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand/10 hover:shadow-brand/20 cursor-pointer"
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
