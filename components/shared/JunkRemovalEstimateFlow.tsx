import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  Loader2,
  Check,
  Plus,
  Minus,
  Trash2,
  ScanSearch,
  Receipt,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DetectedItem, LoadingState, PriceEstimate, QuoteEstimate } from '../../types';
import { detectItemsFromPhotos } from '../../services/openaiService';
import { calculateStaticPrice } from '../../services/pricingService';
import { supabase } from '../../lib/supabase';
import { persistBookingPhotos, withBookingPhotos } from '../../lib/bookingPhotos';
import { withSmsMarketingConsent } from '../../lib/customerConsent';
import { ContactIntakeForm } from './ContactIntakeForm';
import { EstimateMethodSelection } from './EstimateMethodSelection';
import { JunkItemCatalogSelector, getCatalogItemImage } from './JunkItemCatalogSelector';
import { JunkRemovalPriceBreakdown } from './JunkRemovalPriceBreakdown';
import { FLOW_STEP_ANCHOR, scrollToFlowStep } from '../../lib/flowPageLayout';
import { ItemIconRenderer } from '../icons/JunkItemIcons';

export interface JunkRemovalEstimateResult {
  estimate: QuoteEstimate;
  items: DetectedItem[];
  price: PriceEstimate;
  contactName: string;
  contactPhone: string;
  smsMarketingConsentAt: string | null;
  partialBookingId: string | null;
  image: string | null;
  images: string[];
}

interface JunkRemovalEstimateFlowProps {
  zipValue: string;
  onContinue: (result: JunkRemovalEstimateResult) => void;
  onBack: () => void;
  onModeChange?: (mode: EstimateMode, manualStep: 'select' | 'review' | 'result') => void;
  resumeState?: {
    selectedItems: DetectedItem[];
    manualPriceEstimate: PriceEstimate;
    contactSubmitted: boolean;
    contactName: string;
    contactPhone: string;
    smsMarketingConsentAt: string | null;
    partialBookingId: string | null;
    image: string | null;
  };
}

export type EstimateMode = 'method' | 'ai' | 'manual';

export const JunkRemovalEstimateFlow: React.FC<JunkRemovalEstimateFlowProps> = ({
  zipValue,
  onContinue,
  onBack,
  onModeChange,
  resumeState,
}) => {
  const [mode, setMode] = useState<EstimateMode>(resumeState ? 'manual' : 'method');
  const [aiStep, setAiStep] = useState<'tips' | 'upload'>('tips');
  const [manualStep, setManualStep] = useState<'select' | 'review' | 'result'>(resumeState ? 'result' : 'select');
  const [images, setImages] = useState<string[]>(resumeState?.image ? [resumeState.image] : []);
  const [selectedItems, setSelectedItems] = useState<DetectedItem[]>(resumeState?.selectedItems ?? []);
  const [manualPriceEstimate, setManualPriceEstimate] = useState<PriceEstimate | null>(resumeState?.manualPriceEstimate ?? null);
  const [manualPricingLoading, setManualPricingLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(resumeState?.contactSubmitted ?? false);
  const [contactName, setContactName] = useState(resumeState?.contactName ?? '');
  const [contactPhone, setContactPhone] = useState(resumeState?.contactPhone ?? '');
  const [smsMarketingConsentAt, setSmsMarketingConsentAt] = useState<string | null>(
    resumeState?.smsMarketingConsentAt ?? null
  );
  const [contactLoading, setContactLoading] = useState(false);
  const [partialBookingId, setPartialBookingId] = useState<string | null>(resumeState?.partialBookingId ?? null);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const selectedItemsRef = useRef<HTMLDivElement>(null);
  const contentTopRef = useRef<HTMLDivElement>(null);

  const getItemImage = getCatalogItemImage;
  const totalSelectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  const isItemSelected = (itemName: string) => selectedItems.some((i) => i.name === itemName);

  useEffect(() => {
    onModeChange?.(mode, manualStep);
  }, [mode, manualStep, onModeChange]);

  const prevModeRef = useRef(mode);
  useEffect(() => {
    const prev = prevModeRef.current;
    prevModeRef.current = mode;
    if (prev === 'method' && (mode === 'ai' || mode === 'manual')) return;
    scrollToFlowStep(contentTopRef.current);
  }, [aiStep, manualStep, mode]);

  useEffect(() => {
    if (manualStep === 'review' && selectedItems.length === 0) {
      setManualStep('select');
    }
  }, [manualStep, selectedItems.length]);

  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max = 1920;
          if (width > height) {
            if (width > max) {
              height = (height * max) / width;
              width = max;
            }
          } else if (height > max) {
            width = (width * max) / height;
            height = max;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    try {
      const compressedList = await Promise.all(Array.from(files).map((file) => compressImage(file)));
      setImages((prev) => [...prev, ...compressedList]);
      setLoadingState(LoadingState.IDLE);
    } catch (err) {
      console.error('Error compressing images:', err);
    }
    event.target.value = '';
  };

  const removeUploadedImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setLoadingState(LoadingState.ANALYZING);
    setError(null);
    try {
      const payloadImages = images.map((imgStr) => ({
        base64Image: imgStr.split(',')[1],
        mimeType: imgStr.split(';')[0].split(':')[1],
      }));
      const allDetectedItems = await detectItemsFromPhotos(payloadImages);
      setSelectedItems((prev) => {
        const newItems = [...prev];
        allDetectedItems.forEach((newItem) => {
          const existing = newItems.find(
            (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
          );
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            newItems.push({
              id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: newItem.name,
              quantity: newItem.quantity,
            });
          }
        });
        return newItems;
      });
      setImages([]);
      setLoadingState(LoadingState.IDLE);
      setMode('manual');
      setManualStep('review');
    } catch (err: unknown) {
      console.error('AI analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze photos. Please try again.');
      setLoadingState(LoadingState.ERROR);
    }
  };

  const toggleCatalogItem = (itemName: string) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.name === itemName);
      if (existing) return prev.filter((i) => i.name !== itemName);
      return [
        ...prev,
        { id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: itemName, quantity: 1 },
      ];
    });
  };

  const updateSelectedQuantity = (id: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleGetManualPrice = async () => {
    if (selectedItems.length === 0) return;
    setManualPricingLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const price = await calculateStaticPrice(selectedItems);
      setManualPriceEstimate(price);
      setContactSubmitted(false);
      setManualStep('result');
    } catch (err: unknown) {
      console.error('Pricing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate price. Please try again.');
    } finally {
      setManualPricingLoading(false);
    }
  };

  const handleContactReveal = async (
    name: string,
    phone: string,
    consentAt: string | null,
    items: DetectedItem[],
    price: PriceEstimate
  ) => {
    setContactLoading(true);
    try {
      const detailsText = `Items: ${items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}\nEstimated Items: ${price.estimatedVolume}\nEstimated Price: $${price.price}`;
      let partialId = `mock-lead-${Date.now()}`;
      try {
        const photos = await persistBookingPhotos(images, `lead_${Date.now()}`);
        if (photos.photo_urls.length > 0) {
          setImages(photos.photo_urls);
        }
        const { data, error: dbError } = await supabase.rpc('create_prebooking', {
          p_customer_info: withSmsMarketingConsent({ name, phone, email: '' }, consentAt),
          p_booking_details: withBookingPhotos(
            {
              service_type: 'Junk Removal',
              zip_code: zipValue || null,
              details: detailsText,
              estimated_items: items.map((i) => `${i.quantity}x ${i.name}`),
              estimated_volume: price.estimatedVolume,
              price: price.price,
              estimate_summary: price.summary,
              ...(price.onlineBookingDiscount && price.onlineBookingDiscount > 0
                ? { online_booking_discount: price.onlineBookingDiscount }
                : {}),
            },
            photos
          ),
          p_status: 'partially_submitted',
        });
        if (!dbError && data) partialId = data as string;
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

  const renderPriceResult = (items: DetectedItem[], price: PriceEstimate, onEditBack: () => void, backLabel: string) => {
    if (!contactSubmitted) {
      return (
        <div className="max-w-md mx-auto">
          <ContactIntakeForm
            serviceType="Junk Removal"
            isLoading={contactLoading}
            onReveal={async (name, phone, consentAt) => {
              await handleContactReveal(name, phone, consentAt, items, price);
            }}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2 mb-2">
          <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
            <Receipt className="w-6 h-6 text-brand" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Your Estimate</h2>
          <p className="text-secondary-400 text-xs">Review your price breakdown, then continue to book.</p>
        </div>

        <div className="bg-white border border-secondary-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-24 h-20 md:w-32 md:h-24 shrink-0">
            <img src="/process-step-1.svg" alt="Service breakdown" className="w-full h-full object-contain" />
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
            <h3 className="text-sm md:text-base font-black text-secondary">Junk Removal</h3>
            <p className="text-secondary-400 text-xs mt-1 leading-normal">{price.estimatedVolume}</p>
          </div>
        </div>

        <JunkRemovalPriceBreakdown price={price} />

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
              <button type="button" onClick={() => setShowInsuranceModal(true)} className="text-emerald-900 font-bold hover:underline">
                Learn more
              </button>
            </p>
          </div>
        </div>

        {!price.lines?.length && (
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
        )}

        <p className="text-xs text-secondary-500 leading-relaxed">{price.summary}</p>

        <div className="space-y-3 pt-2">
          <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
            <button
              type="button"
              onClick={() => {
                onContinue({
                  estimate: {
                    itemsDetected: items.map((i) => `${i.quantity}x ${i.name}`),
                    estimatedVolume: price.estimatedVolume,
                    price: price.price,
                    summary: price.summary,
                    subtotal: price.subtotal,
                    onlineBookingDiscount: price.onlineBookingDiscount,
                  },
                  items,
                  price,
                  contactName,
                  contactPhone,
                  smsMarketingConsentAt,
                  partialBookingId,
                  image: images[0] || null,
                  images,
                });
              }}
              className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-sm font-black uppercase tracking-wider">Continue</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
          <button
            type="button"
            onClick={onEditBack}
            className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1"
          >
            <ArrowLeft size={14} /> {backLabel}
          </button>
          <p className="text-[10px] text-secondary-300 text-center">* Final price confirmed on-site</p>
        </div>

        {showInsuranceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-secondary-100">
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
                <button type="button" onClick={() => setShowInsuranceModal(false)} className="w-8 h-8 rounded-full bg-white hover:bg-secondary-100 flex items-center justify-center text-secondary transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-secondary-500 leading-relaxed mb-4">
                Safety and peace of mind are prioritized. Every booking is covered by platform damage protection at no extra charge.
              </p>
              <button type="button" onClick={() => setShowInsuranceModal(false)} className="w-full py-3 bg-secondary hover:bg-brand text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-secondary/15 transition-all">
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (mode === 'method') {
    return (
      <div className="space-y-4">
        <EstimateMethodSelection
          onPhotoEstimate={() => {
            setAiStep('tips');
            setMode('ai');
            window.scrollTo({ top: 0, behavior: 'auto' });
          }}
          onSelectItems={() => {
            flushSync(() => {
              setManualStep('select');
              setMode('manual');
            });
            window.scrollTo({ top: 0, behavior: 'auto' });
          }}
        />
        <button
          type="button"
          onClick={onBack}
          className="w-full py-4 text-xs font-bold uppercase tracking-wider border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div ref={contentTopRef} className={`${FLOW_STEP_ANCHOR} mb-6`}>
        <h2 className="text-xl md:text-2xl font-black text-secondary tracking-tight mb-1">
          {mode === 'ai' ? (
            <><span className="text-brand">AI photo</span> estimate.</>
          ) : manualStep === 'review' ? (
            <>Review your <span className="text-brand">list.</span></>
          ) : manualStep === 'result' ? (
            <>Your <span className="text-brand">estimate.</span></>
          ) : (
            <>Pick your <span className="text-brand">items.</span></>
          )}
        </h2>
        <p className="text-sm text-secondary-400">
          {mode === 'ai'
            ? "Upload a photo and we'll estimate the cost automatically."
            : manualStep === 'review'
              ? 'Confirm your items to calculate the estimate.'
              : manualStep === 'result'
                ? 'Review your price breakdown, then continue to book.'
                : 'Browse categories and pick what you need.'}
        </p>
      </div>

      {mode === 'ai' && (
        <div>
          {aiStep === 'tips' && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <p className="text-[10px] font-black text-brand uppercase tracking-wider mb-2">Photo Tips</p>
                <h3 className="text-lg md:text-xl font-black text-secondary">Take clear photos for best results</h3>
              </div>
              <div className="space-y-5">
                {[
                  { title: 'Good lighting', desc: 'Take photos in daylight or well-lit areas. Avoid dark shadows.' },
                  { title: 'All items visible', desc: 'Make sure everything you want removed is in the frame.' },
                  { title: 'Items only', desc: 'Photos of just the junk items work best. Avoid people or pets.' },
                  { title: 'Multiple angles', desc: 'For large piles, you can upload several photos of different sections.' },
                ].map((tip) => (
                  <div key={tip.title} className="flex gap-4">
                    <Check size={16} className="text-brand shrink-0 mt-0.5" strokeWidth={3} />
                    <div>
                      <h4 className="text-sm font-bold text-secondary mb-0.5">{tip.title}</h4>
                      <p className="text-xs text-secondary-400 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setAiStep('upload')} className="w-full py-4 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand transition-colors rounded-xl inline-flex items-center justify-center gap-2 mt-4">
                Continue <ArrowRight size={14} />
              </button>
              <button type="button" onClick={() => setMode('method')} className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          )}

          {aiStep === 'upload' && (
            <>
              <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" multiple onChange={handleFileChange} />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />

              {images.length === 0 ? (
                <div className="space-y-3">
                  <button type="button" onClick={() => cameraInputRef.current?.click()} className="w-full md:border border-secondary-100 hover:border-brand transition-all p-6 bg-white rounded-2xl text-left flex items-center gap-4 group">
                    <Camera size={24} className="text-brand shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-base font-black text-secondary mb-0.5">Take Photo</h3>
                      <p className="text-secondary-400 text-sm">Use your camera to capture the junk</p>
                    </div>
                    <ArrowRight size={18} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full md:border border-secondary-100 hover:border-brand transition-all p-6 bg-white rounded-2xl text-left flex items-center gap-4 group">
                    <Upload size={24} className="text-secondary shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-base font-black text-secondary mb-0.5">Upload Photo</h3>
                      <p className="text-secondary-400 text-sm">Choose an existing photo from your device</p>
                    </div>
                    <ArrowRight size={18} className="text-secondary-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </button>
                  <button type="button" onClick={() => setAiStep('tips')} className="w-full py-2 text-xs font-bold uppercase tracking-wider text-secondary-400 hover:text-brand transition-colors inline-flex items-center justify-center gap-1">
                    <ArrowLeft size={14} /> Back
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((imgSrc, index) => (
                      <div key={index} className="relative aspect-[4/3] border border-secondary-100 bg-white overflow-hidden rounded-xl">
                        <img src={imgSrc} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
                        {loadingState !== LoadingState.ANALYZING && (
                          <button type="button" onClick={() => removeUploadedImage(index)} className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center transition-colors text-xs font-bold border border-white/20 rounded-full shadow" aria-label="Remove photo">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {loadingState !== LoadingState.ANALYZING && (
                    <div className="flex gap-2.5">
                      <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 py-3 border border-secondary-100 hover:border-brand hover:text-brand bg-white text-secondary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-xl">
                        <Camera size={14} /> Take another
                      </button>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 border border-secondary-100 hover:border-brand hover:text-brand bg-white text-secondary text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-xl">
                        <Upload size={14} /> Add more
                      </button>
                    </div>
                  )}
                  {loadingState === LoadingState.IDLE && (
                    <button type="button" onClick={handleAnalyze} className="group w-full py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider hover:bg-brand hover:shadow-lg transition-all duration-300 rounded-xl inline-flex items-center justify-center gap-2">
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
                      <button type="button" onClick={handleAnalyze} className="text-sm font-bold text-secondary underline hover:text-brand transition-colors">Try again</button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div>
          {manualStep === 'select' && !manualPricingLoading && (
            <JunkItemCatalogSelector selectedItems={selectedItems} onSelectedItemsChange={setSelectedItems} />
          )}

          {manualStep === 'select' && selectedItems.length > 0 && (
            <div ref={selectedItemsRef} className="sticky bottom-4 z-30 mt-6 mx-auto max-w-2xl px-2">
              <button type="button" onClick={() => setManualStep('review')} className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-secondary hover:bg-brand text-white rounded-full shadow-2xl shadow-secondary/30 hover:shadow-brand/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
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

          {manualStep === 'review' && !manualPricingLoading && (
            <div className="space-y-6">
              <div className="border border-secondary-100 rounded-2xl divide-y divide-secondary-100 overflow-hidden bg-white">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 md:p-4 hover:bg-white transition-colors">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <ItemIconRenderer imagePath={getItemImage(item.name)} className="w-8 h-8 md:w-9 md:h-9" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-secondary truncate">{item.name}</p>
                      <p className="text-[11px] text-secondary-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={() => updateSelectedQuantity(item.id, -1)} className="w-8 h-8 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-black text-secondary">{item.quantity}</span>
                      <button type="button" onClick={() => updateSelectedQuantity(item.id, 1)} className="w-8 h-8 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => toggleCatalogItem(item.name)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition-colors shrink-0" aria-label={`Remove ${item.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border border-secondary-100 shadow-sm rounded-2xl bg-white p-4 md:p-5 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-secondary">Suggested Add-ons</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Box Spring', desc: 'Dispose of the matching box spring' },
                    { name: 'Bed Frame', desc: 'Dispose of the metal or wooden bed frame' },
                  ].map((upsell) => {
                    const isAdded = isItemSelected(upsell.name);
                    return (
                      <div key={upsell.name} className="bg-white border border-secondary-100 p-3 flex items-center justify-between gap-3 shadow-sm hover:shadow transition-shadow rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                            <ItemIconRenderer imagePath={getItemImage(upsell.name)} className="w-6 h-6 object-contain" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-secondary leading-tight">{upsell.name}</p>
                            <p className="text-[10px] text-secondary-400">{upsell.desc}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => toggleCatalogItem(upsell.name)} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all duration-200 ${isAdded ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 font-bold' : 'bg-brand border-brand text-white hover:bg-brand-600 font-bold'}`}>
                          {isAdded ? 'Added ✓' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button type="button" onClick={() => setManualStep('select')} className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-dashed border-secondary-100 text-secondary-600 hover:border-brand hover:text-brand font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm">
                  <Plus size={14} />
                  <span>Add more items</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={() => setManualStep('select')} className="font-bold text-secondary-500 hover:text-brand transition-colors inline-flex items-center gap-1">
                  <ArrowLeft size={12} /> Add more items
                </button>
                <button type="button" onClick={() => { setSelectedItems([]); setManualStep('select'); }} className="font-bold text-red-400 hover:text-red-600 transition-colors">
                  Clear all
                </button>
              </div>

              <div className="sticky bottom-4 z-30 mt-4 mx-auto max-w-2xl px-2">
                <button type="button" onClick={handleGetManualPrice} disabled={selectedItems.length === 0} className="group w-full flex items-center justify-center gap-2 px-5 py-4 bg-brand hover:bg-brand-600 text-white rounded-xl shadow-2xl shadow-brand/40 hover:shadow-brand/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
                  <ScanSearch size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-black uppercase tracking-wider">Get Estimate</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}

          {manualPricingLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
                <p className="text-secondary-600 text-sm font-medium">Calculating your estimate...</p>
              </div>
            </div>
          )}

          {manualStep === 'result' && manualPriceEstimate && renderPriceResult(
            selectedItems,
            manualPriceEstimate,
            () => { setManualStep('review'); setManualPriceEstimate(null); setContactSubmitted(false); },
            'Back'
          )}
        </div>
      )}
    </div>
  );
};
