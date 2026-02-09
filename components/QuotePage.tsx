import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Loader2, CheckCircle, Plus, Minus, Trash2, Search, List, Armchair, Plug, Monitor, TreePine, HardHat, Warehouse, Package, ChevronDown, BedDouble } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { detectItemsFromPhoto, getPriceForItems } from '../services/openaiService';
import { DetectedItem, PriceEstimate, QuoteEstimate, LoadingState } from '../types';
import { supabase } from '../lib/supabase';
import { Breadcrumb } from './Breadcrumb';

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(ITEM_CATALOG[0].label);
  const [manualStep, setManualStep] = useState<'select' | 'result'>('select');
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
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 md:p-8 border border-gray-200 rounded-lg">
        <div className="mb-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700">
                {item.quantity > 1 && <span className="font-bold">{item.quantity}x</span>}
                {item.name}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estimated Volume</div>
          <div className="text-2xl font-black">{price.estimatedVolume}</div>
        </div>
        <div className="mb-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price Range</div>
          <div className="text-4xl font-black">${price.priceRange.min} &ndash; ${price.priceRange.max}</div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-6 pb-6 border-b border-gray-200">{price.summary}</p>
        <button
          onClick={() => navigate('/booking', { state: { estimate, image } })}
          className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg"
        >
          Confirm Booking
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">* Final price confirmed on-site</p>
      </div>
      <button onClick={onEditBack} className="w-full py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors">
        ← {backLabel}
      </button>
    </div>
  );

  // ── Submitted screen ──
  if (submitted) {
    return (
      <div className="min-h-screen pt-[88px] md:pt-[108px] pb-20 bg-white">
        <Breadcrumb items={[{ label: 'Get a Quote' }]} />
        <section className="py-16 md:py-20 lg:py-32">
          <div className="flex items-center justify-center">
            <div className="max-w-lg mx-auto px-4 text-center">
              <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-full">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-4xl font-black mb-4">Request Received</h2>
              <p className="text-gray-600 mb-8">
                You'll be contacted within 15 minutes to confirm your estimate.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors rounded-lg"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Selection screen ──
  if (!selectedOption) {
    return (
      <div className="min-h-screen pt-[88px] md:pt-[108px] pb-20 bg-white">
        <Breadcrumb items={[{ label: 'Get a Quote' }]} />
        <section className="py-16 md:py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black mb-3">Get a Quote</h1>
              <p className="text-gray-600">Choose your method</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              <button
                onClick={() => setSelectedOption('ai')}
                className="group p-6 border border-gray-200 hover:border-black transition-all text-left bg-white shadow-sm hover:shadow-lg rounded-lg"
              >
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform rounded-lg">
                  <Camera size={28} />
                </div>
                <h3 className="text-xl font-black mb-2">AI Photo Estimate</h3>
                <p className="text-gray-600 text-sm mb-4">Snap a photo for instant AI pricing</p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-black">
                  Continue
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
              <button
                onClick={() => setSelectedOption('manual')}
                className="group p-6 border border-gray-200 hover:border-black transition-all text-left bg-white shadow-sm hover:shadow-lg rounded-lg"
              >
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform rounded-lg">
                  <List size={28} />
                </div>
                <h3 className="text-xl font-black mb-2">Select Your Items</h3>
                <p className="text-gray-600 text-sm mb-4">Pick items from our catalog for a quote</p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-black">
                  Continue
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </div>
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl max-w-3xl mx-auto">
              <img src="/opek2.webp" loading="lazy" alt="Professional junk removal service" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                <p className="text-white text-sm md:text-base font-bold text-center">Fast, reliable service with transparent pricing</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Main flow ──
  return (
    <div className="min-h-screen pt-[88px] md:pt-[108px] pb-20 bg-white">
      <Breadcrumb items={[{ label: 'Get a Quote' }]} />
      <section className="py-16 md:py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedOption(null)}
            className="mb-8 text-sm font-bold text-gray-600 hover:text-black transition-colors"
          >
            ← Back to options
          </button>

          <div ref={contentTopRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {selectedOption === 'ai' ? 'AI Photo Estimate' : 'Select Your Items'}
            </h1>
            {selectedOption === 'manual' && manualStep === 'select' && (
              <p className="text-gray-500">Browse categories, pick items, then get your AI-powered estimate</p>
            )}
          </div>

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
                          isComplete || isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isComplete ? <CheckCircle size={18} /> : i + 1}
                        </div>
                        <span className="text-[10px] font-bold mt-1.5 uppercase tracking-wider text-gray-500">{label}</span>
                      </div>
                      {i < 2 && <div className={`w-12 h-0.5 mx-2 mb-5 ${isComplete ? 'bg-black' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Step 1: Upload */}
              {aiStep === 'upload' && (
                <>
                  {!image ? (
                    <div className="space-y-4">
                      <div
                        className="border border-dashed border-gray-300 p-12 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Take Photo</h3>
                        <p className="text-gray-600">Use your camera to capture the junk</p>
                        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Or</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                      <div
                        className="border border-dashed border-gray-300 p-12 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer rounded-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload Photo</h3>
                        <p className="text-gray-600">Choose a photo from your device</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                        <img src={image} alt="Upload" className="w-full" />
                        {loadingState !== LoadingState.ANALYZING && (
                          <button
                            onClick={() => { setImage(null); setEstimate(null); setDetectedItems([]); }}
                            className="absolute top-4 right-4 bg-white text-black px-4 py-2 text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors rounded-lg"
                          >
                            Change Photo
                          </button>
                        )}
                      </div>
                      {loadingState === LoadingState.IDLE && (
                        <button onClick={handleAnalyze} className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg">
                          Analyze Photo
                        </button>
                      )}
                      {loadingState === LoadingState.ANALYZING && (
                        <div className="py-12 text-center">
                          <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                          <p className="text-gray-600">Identifying items in your photo...</p>
                        </div>
                      )}
                      {loadingState === LoadingState.ERROR && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                          <p className="text-red-700 text-sm font-bold mb-2">Failed to analyze photo</p>
                          <button onClick={handleAnalyze} className="text-sm font-bold text-black underline">Try again</button>
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
                    <div className="flex gap-4 items-start">
                      <img src={image} alt="Your photo" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                      <div>
                        <p className="text-sm font-bold text-black">{detectedItems.length} items detected</p>
                        <p className="text-xs text-gray-500 mt-1">Review, edit quantities, remove items, or add anything we missed.</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {detectedItems.map((item) => (
                      <div key={item.id} className="relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-black bg-black/5 shadow-sm text-center">
                        <button onClick={() => removeItem(item.id)} className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors">
                          <Trash2 size={10} className="text-red-500" />
                        </button>
                        <div className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center">
                          <img src={getItemImage(item.name)} alt={item.name} className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-medium leading-tight line-clamp-2">{item.name}</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateItemQuantity(item.id, -1)} className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors">
                            <Minus size={12} className="text-gray-500" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateItemQuantity(item.id, 1)} className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors">
                            <Plus size={12} className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Add an item</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addManualItem()}
                        placeholder="e.g. Old Desk"
                        className="flex-1 border border-gray-200 px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                      />
                      <button onClick={addManualItem} disabled={!newItemName.trim()} className="px-4 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setAiStep('upload'); setLoadingState(LoadingState.IDLE); }} className="flex-1 py-3.5 border border-black text-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors rounded-lg">
                      Back
                    </button>
                    <button onClick={handleGetPrice} disabled={detectedItems.length === 0} className="flex-1 py-3.5 bg-black text-white font-bold uppercase text-sm hover:bg-gray-800 transition-colors rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed">
                      Get Estimate
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing loading */}
              {pricingLoading && (
                <div className="py-16 text-center">
                  <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Calculating your estimate...</p>
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
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search items..."
                      className="w-full border border-gray-200 pl-10 pr-4 py-3 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  {/* Category accordion */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {filteredCatalog.map((category) => {
                      const isExpanded = expandedCategory === category.label || catalogSearch.trim() !== '';
                      const selectedInCategory = category.items.filter(i => isItemSelected(i.name)).length;
                      return (
                        <div key={category.label} ref={(el) => { categoryRefs.current[category.label] = el; }}>
                          <button
                            onClick={() => {
                              const newCat = isExpanded && !catalogSearch ? null : category.label;
                              setExpandedCategory(newCat);
                              if (newCat) {
                                setTimeout(() => scrollToElement(categoryRefs.current[category.label], -20), 80);
                              }
                            }}
                            className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200 text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-black">{category.icon}</span>
                              <span className="text-sm font-bold text-gray-800">{category.label}</span>
                              {selectedInCategory > 0 && (
                                <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                  {selectedInCategory}
                                </span>
                              )}
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {isExpanded && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-3">
                              {category.items.map((item) => {
                                const selected = isItemSelected(item.name);
                                return (
                                  <button
                                    key={item.name}
                                    onClick={() => toggleCatalogItem(item.name)}
                                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                                      selected
                                        ? 'border-black bg-black/5 shadow-sm'
                                        : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                  >
                                    {selected && (
                                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                        <CheckCircle size={12} className="text-white" />
                                      </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                                      selected ? 'bg-black/10' : 'bg-gray-100'
                                    }`}>
                                      <img src={item.image} alt={item.name} className="w-7 h-7" />
                                    </div>
                                    <span className="text-xs font-medium leading-tight line-clamp-2">{item.name}</span>
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
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Don't see your item?</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualNewItemName}
                        onChange={(e) => setManualNewItemName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addManualSelectedItem()}
                        placeholder="Type item name and add"
                        className="flex-1 border border-gray-200 px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-black transition-colors"
                      />
                      <button
                        onClick={addManualSelectedItem}
                        disabled={!manualNewItemName.trim()}
                        className="px-4 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Selected items summary */}
                  {selectedItems.length > 0 && (
                    <div ref={selectedItemsRef} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Items ({totalSelectedCount})</span>
                        <button onClick={() => setSelectedItems([])} className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors">
                          Clear All
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {selectedItems.map((item) => (
                          <div key={item.id} className="relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-black bg-black/5 shadow-sm text-center">
                            <button onClick={() => removeSelectedItem(item.id)} className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors">
                              <Trash2 size={10} className="text-red-500" />
                            </button>
                            <div className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center">
                              <img src={getItemImage(item.name)} alt={item.name} className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-medium leading-tight line-clamp-2">{item.name}</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateSelectedQuantity(item.id, -1)} className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors">
                                <Minus size={12} className="text-gray-500" />
                              </button>
                              <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => updateSelectedQuantity(item.id, 1)} className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center hover:bg-white transition-colors">
                                <Plus size={12} className="text-gray-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Get Estimate button */}
                  <button
                    onClick={handleGetManualPrice}
                    disabled={selectedItems.length === 0}
                    className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {selectedItems.length === 0 ? 'Select items to continue' : `Get Estimate (${totalSelectedCount} item${totalSelectedCount !== 1 ? 's' : ''})`}
                  </button>
                </div>
              )}

              {/* Pricing loading */}
              {manualPricingLoading && (
                <div className="py-16 text-center">
                  <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Calculating your estimate...</p>
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
      </section>
    </div>
  );
};
