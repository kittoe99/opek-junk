import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Loader2, Check, Plus, Minus, Trash2, Search, ListChecks, Armchair, Plug, Monitor, TreePine, HardHat, Warehouse, Package, ChevronDown, BedDouble, ScanSearch, Receipt, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { detectItemsFromPhoto, getPriceForItems } from '../services/openaiService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState } from '../types';
import { supabase } from '../lib/supabase';

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
    label: 'Furniture',
    icon: <Armchair size={18} />,
    items: [
      { name: 'Sofa / Couch', image: '/items/sofa.svg' },
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

export const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'ai' | 'manual' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Photo State
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [aiStep, setAiStep] = useState<'upload' | 'items' | 'result'>('upload');
  const [newItemName, setNewItemName] = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);

  // Item Selection State
  const [selectedItems, setSelectedItems] = useState<DetectedItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
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
  }, [aiStep, manualStep, selectedOption, scrollToElement]);

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
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const items = await detectItemsFromPhoto(base64Data, mimeType);
      setDetectedItems(items);
      setAiStep('items');
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error('AI analysis error:', err);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleGetPrice = async () => {
    if (detectedItems.length === 0) return;
    setPricingLoading(true);
    try {
      const price = await getPriceForItems(detectedItems);
      setPriceEstimate(price);
      setEstimate({
        itemsDetected: detectedItems.map(i => `${i.quantity}x ${i.name}`),
        estimatedVolume: price.estimatedVolume,
        priceRange: price.priceRange,
        summary: price.summary,
      });
      setAiStep('result');
    } catch (err) {
      console.error('Pricing error:', err);
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
    try {
      const price = await getPriceForItems(selectedItems);
      setManualPriceEstimate(price);
      setEstimate({
        itemsDetected: selectedItems.map(i => `${i.quantity}x ${i.name}`),
        estimatedVolume: price.estimatedVolume,
        priceRange: price.priceRange,
        summary: price.summary,
      });
      setManualStep('result');
    } catch (err) {
      console.error('Pricing error:', err);
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

  // ── Shared price result renderer ──
  const renderPriceResult = (
    items: DetectedItem[],
    price: PriceEstimate,
    onEditBack: () => void,
    backLabel: string
  ) => (
    <div className="space-y-4">
      <div className="border border-brand/20 bg-brand/5 p-6 md:p-8 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={14} className="text-brand" strokeWidth={2.5} />
          <h3 className="text-[10px] font-bold text-brand uppercase tracking-wider">Your Estimate</h3>
        </div>
        <div className="mb-5">
          <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">
            Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-secondary-100 rounded-md text-xs font-medium text-secondary-600">
                {item.quantity > 1 && <span className="font-bold text-brand">{item.quantity}x</span>}
                {item.name}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-brand/20">
          <div>
            <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Volume</div>
            <div className="text-lg font-black text-secondary">{price.estimatedVolume}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Price Range</div>
            <div className="text-2xl font-black text-brand">${price.priceRange.min} &ndash; ${price.priceRange.max}</div>
          </div>
        </div>
        <p className="text-sm text-secondary-600 leading-relaxed mt-4 mb-5">{price.summary}</p>
        <button
          onClick={() => navigate('/booking', { state: { estimate, image } })}
          className="w-full py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand transition-colors rounded-lg inline-flex items-center justify-center gap-2"
        >
          Continue to Booking <ArrowRight size={14} />
        </button>
        <p className="text-[10px] text-secondary-300 text-center mt-3">* Final price confirmed on-site</p>
      </div>
      <button onClick={onEditBack} className="w-full py-3 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1">
        <ArrowLeft size={14} /> {backLabel}
      </button>
    </div>
  );

  // ── Submitted screen ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Receipt size={26} className="text-brand" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-secondary mb-3">Request Received</h2>
          <p className="text-secondary-400 text-sm mb-6 max-w-sm mx-auto">
            We'll contact you within 15 minutes to confirm your estimate.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-secondary text-white font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center justify-center gap-2"
          >
            Submit Another Request <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Selection screen ──
  if (!selectedOption) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="pt-32 pb-10 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={14} className="text-brand" strokeWidth={2.5} />
            <span className="text-sm font-bold text-secondary-400 uppercase tracking-wider">Get a Quote</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
            Free quote in <span className="text-brand">two minutes.</span>
          </h1>
          <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
            Snap a photo for instant AI pricing, or pick items from our catalog. Either way, you get an upfront estimate — no obligations.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <button
              onClick={() => setSelectedOption('ai')}
              className="group p-6 border border-secondary-100 hover:border-brand hover:bg-brand/5 transition-all text-left md:rounded-2xl rounded-xl"
            >
              <ScanSearch size={24} className="text-brand mb-4" strokeWidth={2} />
              <h3 className="text-lg font-black text-secondary mb-1">AI Photo Estimate</h3>
              <p className="text-secondary-400 text-sm mb-4">Snap a photo for instant AI pricing</p>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary group-hover:text-brand transition-colors">
                Start <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button
              onClick={() => setSelectedOption('manual')}
              className="group p-6 border border-secondary-100 hover:border-brand hover:bg-brand/5 transition-all text-left md:rounded-2xl rounded-xl"
            >
              <ListChecks size={24} className="text-secondary mb-4" strokeWidth={2} />
              <h3 className="text-lg font-black text-secondary mb-1">Select Your Items</h3>
              <p className="text-secondary-400 text-sm mb-4">Pick items from our catalog for a quote</p>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary group-hover:text-brand transition-colors">
                Start <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Bottom CTA */}
          <div className="border-l-2 border-brand pl-6">
            <h2 className="text-xl font-black text-secondary mb-2">Prefer to talk to someone?</h2>
            <p className="text-secondary-400 text-sm mb-4">Call us for a phone estimate or to ask any questions — we're here 24/7.</p>
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
      <div className="pt-32 pb-8 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSelectedOption(null)}
          className="mb-6 text-sm font-bold text-secondary-400 hover:text-brand transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to options
        </button>

        <div ref={contentTopRef} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {selectedOption === 'ai' ? (
              <ScanSearch size={14} className="text-brand" strokeWidth={2.5} />
            ) : (
              <ListChecks size={14} className="text-brand" strokeWidth={2.5} />
            )}
            <span className="text-sm font-bold text-secondary-400 uppercase tracking-wider">
              {selectedOption === 'ai' ? 'AI Photo Estimate' : 'Item Catalog'}
            </span>
          </div>
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
            <p className="text-secondary-400 text-base">Confirm your items and we'll calculate your estimate.</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

          {/* ===== AI PHOTO CONTENT ===== */}
          {selectedOption === 'ai' && (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-center mb-10">
                {['Upload', 'Review Items', 'Estimate'].map((label, i) => {
                  const isComplete = (i === 0 && aiStep !== 'upload') || (i === 1 && aiStep === 'result');
                  const isActive = (i === 0 && aiStep === 'upload') || (i === 1 && aiStep === 'items') || (i === 2 && aiStep === 'result');
                  return (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          isComplete ? 'bg-brand text-white' : isActive ? 'bg-secondary text-white' : 'bg-secondary-50 text-secondary-300'
                        }`}>
                          {isComplete ? <Check size={16} strokeWidth={3} /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${isComplete || isActive ? 'text-secondary' : 'text-secondary-300'}`}>{label}</span>
                      </div>
                      {i < 2 && <div className={`w-12 h-0.5 mx-2 mb-5 ${isComplete ? 'bg-brand' : 'bg-secondary-100'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>

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
                          <p className="text-red-700 text-sm font-bold mb-2">Failed to analyze photo</p>
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
                        <p className="text-xs text-secondary-400 mt-1">Review, edit quantities, remove items, or add anything we missed.</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {detectedItems.map((item) => (
                      <div key={item.id} className="relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-brand bg-brand/5 text-center">
                        <button onClick={() => removeItem(item.id)} className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors">
                          <Trash2 size={10} className="text-red-500" />
                        </button>
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                          <img src={getItemImage(item.name)} alt={item.name} className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-medium text-secondary leading-tight line-clamp-2">{item.name}</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateItemQuantity(item.id, -1)} className="w-6 h-6 rounded-md border border-secondary-200 bg-white flex items-center justify-center hover:border-brand transition-colors">
                            <Minus size={12} className="text-secondary-400" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-secondary">{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item.id, 1)} className="w-6 h-6 rounded-md border border-secondary-200 bg-white flex items-center justify-center hover:border-brand transition-colors">
                            <Plus size={12} className="text-secondary-400" />
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

              {/* Pricing loading */}
              {pricingLoading && (
                <div className="py-16 text-center">
                  <Loader2 size={40} className="animate-spin mx-auto mb-4 text-brand" />
                  <p className="text-secondary-400 text-sm">Calculating your estimate...</p>
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
              {/* Selection step */}
              {manualStep === 'select' && !manualPricingLoading && (
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-300" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search items..."
                      className="w-full pl-11 pr-4 py-3 text-sm bg-secondary-50 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors"
                    />
                  </div>

                  {/* Category accordion */}
                  <div className="border border-secondary-100 rounded-2xl overflow-hidden">
                    {filteredCatalog.map((category) => {
                      const isExpanded = expandedCategory === category.label || catalogSearch.trim() !== '';
                      const selectedInCategory = category.items.filter(i => isItemSelected(i.name)).length;
                      return (
                        <div key={category.label} ref={(el) => { categoryRefs.current[category.label] = el; }} className="border-b border-secondary-100 last:border-b-0">
                          <button
                            onClick={() => {
                              const newCat = isExpanded && !catalogSearch ? null : category.label;
                              setExpandedCategory(newCat);
                              if (newCat) {
                                setTimeout(() => scrollToElement(categoryRefs.current[category.label], -20), 80);
                              }
                            }}
                            className="w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-secondary-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-brand">{category.icon}</span>
                              <span className="text-sm font-bold text-secondary">{category.label}</span>
                              {selectedInCategory > 0 && (
                                <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                  {selectedInCategory}
                                </span>
                              )}
                            </div>
                            <ChevronDown size={16} className={`text-secondary-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {isExpanded && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-2 bg-secondary-50/50">
                              {category.items.map((item) => {
                                const selected = isItemSelected(item.name);
                                const selectedItem = selectedItems.find(i => i.name === item.name);
                                return (
                                  <button
                                    key={item.name}
                                    className={`group relative flex flex-col items-center gap-1.5 p-2 transition-all duration-200 text-center cursor-pointer ${
                                      selected ? 'scale-[1.05]' : 'hover:scale-105 active:scale-95'
                                    }`}
                                    onClick={() => !selected && toggleCatalogItem(item.name)}
                                  >
                                    {selected && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); toggleCatalogItem(item.name); }}
                                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                      >
                                        <X size={8} className="text-white" strokeWidth={3} />
                                      </button>
                                    )}
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10 transition-all duration-200"
                                      style={{
                                        filter: selected
                                          ? 'brightness(0) saturate(100%) invert(54%) sepia(88%) saturate(2476%) hue-rotate(316deg) brightness(101%) contrast(101%)'
                                          : 'brightness(0) saturate(100%) invert(28%) sepia(31%) saturate(745%) hue-rotate(178deg) brightness(94%) contrast(91%)'
                                      }}
                                    />
                                    <span className={`text-[10px] font-bold leading-tight line-clamp-2 transition-colors ${
                                      selected ? 'text-brand' : 'text-secondary group-hover:text-brand'
                                    }`}>{item.name}</span>
                                    {selected && selectedItem && (
                                      <div className="flex items-center gap-1 mt-0.5" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => updateSelectedQuantity(selectedItem.id, -1)} className="w-5 h-5 rounded border border-secondary-200 bg-white flex items-center justify-center hover:border-brand transition-colors">
                                          <Minus size={10} className="text-secondary-400" />
                                        </button>
                                        <span className="w-4 text-center text-[10px] font-bold text-secondary">{selectedItem.quantity}</span>
                                        <button onClick={() => updateSelectedQuantity(selectedItem.id, 1)} className="w-5 h-5 rounded border border-secondary-200 bg-white flex items-center justify-center hover:border-brand transition-colors">
                                          <Plus size={10} className="text-secondary-400" />
                                        </button>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom item entry */}
                  <div>
                    <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-2">Don't see your item?</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualNewItemName}
                        onChange={(e) => setManualNewItemName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addManualSelectedItem()}
                        placeholder="Type item name and add"
                        className="flex-1 px-4 py-3 text-sm bg-secondary-50 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary/10 transition-colors"
                      />
                      <button
                        onClick={addManualSelectedItem}
                        disabled={!manualNewItemName.trim()}
                        className="px-4 bg-secondary text-white text-sm font-bold rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
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
                  <div className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border border-brand/20 rounded-2xl p-5 md:p-6">
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

              {/* Pricing loading */}
              {manualPricingLoading && (
                <div className="py-16 text-center">
                  <Loader2 size={40} className="animate-spin mx-auto mb-4 text-brand" />
                  <p className="text-secondary-400 text-sm">Calculating your estimate...</p>
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
    </div>
  );
};
