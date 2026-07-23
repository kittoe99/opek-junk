import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import {
  Loader2,
  Check,
  Plus,
  Minus,
  Trash2,
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
import { CameraCaptureIcon, UploadPhotoIcon } from '../icons/ServiceIcons';
import { ContactIntakeForm } from './ContactIntakeForm';
import { EstimateMethodSelection, EstimateMethodHero } from './EstimateMethodSelection';
import { FlowSelectionCard } from './flow/FlowSelectionCard';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { FlowStickyNav } from './flow/FlowStickyNav';
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
  continueLabel?: string;
  preselectItems?: { name: string; quantity: number }[];
  initialMode?: EstimateMode;
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
  continueLabel = 'Continue',
  preselectItems,
  initialMode,
  resumeState,
}) => {
  const hasPreselect = Boolean(preselectItems?.length);
  const [mode, setMode] = useState<EstimateMode>(
    resumeState ? 'manual' : initialMode ?? (hasPreselect ? 'manual' : 'method')
  );
  const [aiStep, setAiStep] = useState<'tips' | 'upload'>('tips');
  const [manualStep, setManualStep] = useState<'select' | 'review' | 'result'>(
    resumeState ? 'result' : hasPreselect ? 'review' : 'select'
  );
  const [images, setImages] = useState<string[]>(resumeState?.image ? [resumeState.image] : []);
  const [selectedItems, setSelectedItems] = useState<DetectedItem[]>(
    resumeState?.selectedItems ??
      (preselectItems?.map((item, idx) => ({
        id: `pre-${idx}-${Date.now()}`,
        name: item.name,
        quantity: item.quantity,
      })) ?? [])
  );
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
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 shadow-none">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-white/[0.06] text-[var(--text)] text-[10px] font-semibold rounded-full">
                  Instant Estimate
                </span>
                <span className="px-2 py-0.5 bg-emerald-400/10 text-emerald-300 text-[10px] font-semibold rounded-full">
                  Guaranteed
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text)] mt-1">Junk Removal</h3>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{price.estimatedVolume}</p>
            </div>
            <p className="text-xl font-bold text-[var(--text)]">${price.price}</p>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={15} className="text-emerald-300 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-emerald-800">Safe Protect™ Included</p>
                <span className="bg-emerald-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">Covered</span>
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                All bookings are covered by platform damage protection.{' '}
                <button type="button" onClick={() => setShowInsuranceModal(true)} className="font-medium hover:underline">Learn more</button>
              </p>
            </div>
          </div>
        </div>

        <JunkRemovalPriceBreakdown price={price} />

        {!price.lines?.length && (
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] mb-2">
            {items.reduce((sum, i) => sum + i.quantity, 0)} items
          </p>
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">{item.name}</span>
                {item.quantity > 1 && <span className="text-[var(--text-muted)] text-xs">×{item.quantity}</span>}
              </div>
            ))}
          </div>
        </div>
        )}

        <p className="text-sm text-[var(--text-muted)] leading-relaxed">{price.summary}</p>

        <FlowStickyNav
          showBack
          onBack={onEditBack}
          backLabel={backLabel}
          onContinue={() => {
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
          continueLabel={continueLabel}
        />
        <p className="text-xs text-[var(--text-muted)] text-center pb-4">* Final price confirmed on-site</p>

        {showInsuranceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300">
            <div className="bg-[var(--surface)] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[var(--border)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <ShieldCheck size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text)] text-lg">Safe Protect™</h3>
                    <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Platform Coverage Included</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowInsuranceModal(false)} className="w-8 h-8 rounded-full bg-[var(--surface)] hover:bg-white/[0.06] flex items-center justify-center text-[var(--text)] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                Safety and peace of mind are prioritized. Every booking is covered by platform damage protection at no extra charge.
              </p>
              <button type="button" onClick={() => setShowInsuranceModal(false)} className="w-full py-3 bg-brand hover:bg-brand-600 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-[0_0_24px_-8px_rgba(255,0,110,0.4)] transition-all">
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
      <>
        <EstimateMethodHero />
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
        <FlowStickyNav showBack onBack={onBack} showContinue={false} />
      </>
    );
  }

  return (
    <div>
      <div ref={contentTopRef} className={FLOW_STEP_ANCHOR}>
        <FlowStepTitle
          title={
            mode === 'ai'
              ? 'AI photo estimate'
              : manualStep === 'review'
                ? 'Review your list'
                : manualStep === 'result'
                  ? 'Your estimate'
                  : 'Pick your items'
          }
          subtitle={
            mode === 'ai'
              ? "Upload a photo and we'll estimate the cost automatically."
              : manualStep === 'review'
                ? 'Confirm your items to calculate the estimate.'
                : manualStep === 'result'
                  ? 'Review your price breakdown, then continue.'
                  : 'Browse categories and pick what you need.'
          }
        />
      </div>

      {mode === 'ai' && (
        <div>
          {aiStep === 'tips' && (
            <div className="space-y-5">
              {[
                { title: 'Good lighting', desc: 'Take photos in daylight or well-lit areas. Avoid dark shadows.' },
                { title: 'All items visible', desc: 'Make sure everything you want removed is in the frame.' },
                { title: 'Items only', desc: 'Photos of just the junk items work best. Avoid people or pets.' },
                { title: 'Multiple angles', desc: 'For large piles, you can upload several photos of different sections.' },
              ].map((tip) => (
                <div key={tip.title} className="flex gap-3 bg-[var(--surface)] border border-white/15 rounded-xl p-4">
                  <Check size={16} className="text-[var(--text)] shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text)] mb-0.5">{tip.title}</h4>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
              <FlowStickyNav
                showBack
                onBack={() => setMode('method')}
                onContinue={() => setAiStep('upload')}
              />
            </div>
          )}

          {aiStep === 'upload' && (
            <>
              <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" multiple onChange={handleFileChange} />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />

              {images.length === 0 ? (
                <div className="space-y-3">
                  <FlowSelectionCard
                    title="Take photo"
                    description="Use your camera to capture the junk"
                    icon={<CameraCaptureIcon className="w-full h-full" />}
                    onClick={() => cameraInputRef.current?.click()}
                  />
                  <FlowSelectionCard
                    title="Upload photo"
                    description="Choose an existing photo from your device"
                    icon={<UploadPhotoIcon className="w-full h-full" />}
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <FlowStickyNav showBack onBack={() => setAiStep('tips')} showContinue={false} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((imgSrc, index) => (
                      <div key={index} className="relative aspect-[4/3] border border-white/15 bg-[var(--surface)] overflow-hidden rounded-xl">
                        <img src={imgSrc} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
                        {loadingState !== LoadingState.ANALYZING && (
                          <button type="button" onClick={() => removeUploadedImage(index)} className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center text-xs rounded-full" aria-label="Remove photo">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {loadingState !== LoadingState.ANALYZING && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 py-3 border border-white/15 bg-[var(--surface)] text-[var(--text)] text-sm font-medium rounded-full hover:bg-white/[0.04] transition-colors">
                        Take another
                      </button>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 border border-white/15 bg-[var(--surface)] text-[var(--text)] text-sm font-medium rounded-full hover:bg-white/[0.04] transition-colors">
                        Add more
                      </button>
                    </div>
                  )}
                  {loadingState === LoadingState.IDLE && (
                    <FlowStickyNav
                      showBack
                      onBack={() => setAiStep('tips')}
                      onContinue={handleAnalyze}
                      continueLabel={images.length === 1 ? 'Analyze photo' : `Analyze ${images.length} photos`}
                    />
                  )}
                  {loadingState === LoadingState.ANALYZING && (
                    <div className="py-12 text-center">
                      <Loader2 size={40} className="animate-spin mx-auto mb-3 text-brand" />
                      <p className="text-[var(--text-muted)] text-sm">Identifying items in your {images.length === 1 ? 'photo' : 'photos'}...</p>
                    </div>
                  )}
                  {loadingState === LoadingState.ERROR && (
                    <div className="p-4 bg-brand/10 border border-brand/30 rounded-xl text-center">
                      <p className="text-brand text-sm font-medium mb-1">Failed to analyze photo{images.length > 1 ? 's' : ''}</p>
                      {error && <p className="text-brand text-xs mb-2">{error}</p>}
                      <button type="button" onClick={handleAnalyze} className="text-sm font-medium text-[var(--text)] underline hover:text-brand transition-colors">Try again</button>
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
            <JunkItemCatalogSelector selectedItems={selectedItems} onSelectedItemsChange={setSelectedItems} hideHeader />
          )}

          {manualStep === 'select' && (
            <FlowStickyNav
              showBack
              onBack={() => setMode('method')}
              showContinue={selectedItems.length > 0}
              onContinue={() => setManualStep('review')}
              continueLabel={totalSelectedCount > 0 ? `Review ${totalSelectedCount} item${totalSelectedCount === 1 ? '' : 's'}` : 'Continue'}
              continueDisabled={selectedItems.length === 0}
            />
          )}

          {manualStep === 'review' && !manualPricingLoading && (
            <div className="space-y-4">
              <div className="border border-white/15 rounded-xl divide-y divide-secondary-100 overflow-hidden bg-[var(--surface)]">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 md:p-4">
                    <div className="w-12 h-12 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <ItemIconRenderer imagePath={getItemImage(item.name)} className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{item.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button" onClick={() => updateSelectedQuantity(item.id, -1)} className="w-8 h-8 rounded-full border border-white/15 bg-[var(--surface)] flex items-center justify-center hover:border-white/20 text-[var(--text-muted)] transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-[var(--text)]">{item.quantity}</span>
                      <button type="button" onClick={() => updateSelectedQuantity(item.id, 1)} className="w-8 h-8 rounded-full border border-white/15 bg-[var(--surface)] flex items-center justify-center hover:border-white/20 text-[var(--text-muted)] transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => toggleCatalogItem(item.name)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-brand/10 transition-colors shrink-0" aria-label={`Remove ${item.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => setManualStep('select')} className="w-full py-3 text-sm font-medium text-[var(--text)] border border-dashed border-white/15 rounded-xl hover:border-white/25 transition-colors">
                + Add more items
              </button>

              <FlowStickyNav
                showBack
                onBack={() => setManualStep('select')}
                onContinue={handleGetManualPrice}
                continueLabel="Get estimate"
                continueDisabled={selectedItems.length === 0}
                continueLoading={manualPricingLoading}
              />
            </div>
          )}

          {manualPricingLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm">
              <div className="text-center">
                <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
                <p className="text-[var(--text-muted)] text-sm font-medium">Calculating your estimate...</p>
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
