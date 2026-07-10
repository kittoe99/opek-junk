import React, { useState } from 'react';
import { Loader2, ShieldCheck, Truck, Home, Building2, Warehouse, Piano, Dumbbell, Weight, Cog, ArmchairIcon as Armchair } from 'lucide-react';
import { calculateMovingLaborPrice } from '../../services/pricingService';
import { PriceEstimate, QuoteEstimate } from '../../types';
import { ContactIntakeForm } from './ContactIntakeForm';
import { FlowSelectionCard } from './flow/FlowSelectionCard';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { FlowStickyNav } from './flow/FlowStickyNav';

const HERO_ICON_CLASS = 'w-full h-full text-secondary [&_.stroke-brand]:stroke-current';

export interface MovingLaborEstimateResult {
  estimate: QuoteEstimate;
  price: PriceEstimate;
  contactName: string;
  contactPhone: string;
  smsMarketingConsentAt: string | null;
  serviceLabel: string;
}

interface MovingLaborEstimateFlowProps {
  onBack: () => void;
  onComplete: (result: MovingLaborEstimateResult) => void;
  onContactReveal?: (name: string, phone: string, consentAt: string | null, estimate: QuoteEstimate, price: PriceEstimate) => Promise<void>;
  continueLabel?: string;
  initialContact?: { name: string; phone: string; consentAt: string | null };
}

type HomeSize = 'studio' | '1bed' | '2bed' | '3plus';

const HOME_SIZES: { id: HomeSize; label: string; desc: string; helpers: 2 | 3; hours: number }[] = [
  { id: 'studio', label: 'Studio / Efficiency', desc: 'Fits in a small truck — minimal furniture', helpers: 2, hours: 2 },
  { id: '1bed', label: '1-Bedroom', desc: 'Apartment or small home — sofa, bed, boxes', helpers: 2, hours: 3 },
  { id: '2bed', label: '2-Bedroom', desc: 'Medium home — multiple rooms of furniture', helpers: 3, hours: 4 },
  { id: '3plus', label: '3+ Bedrooms', desc: 'Large home or full house move', helpers: 3, hours: 6 },
];

const HEAVY_ITEMS = [
  { id: 'piano', label: 'Piano', icon: Piano },
  { id: 'treadmill', label: 'Treadmill / Gym', icon: Dumbbell },
  { id: 'safe', label: 'Safe / Vault', icon: Weight },
  { id: 'pool_table', label: 'Pool Table', icon: Cog },
  { id: 'hot_tub', label: 'Hot Tub', icon: Warehouse },
  { id: 'gun_safe', label: 'Gun Safe', icon: Armchair },
];

export const MovingLaborEstimateFlow: React.FC<MovingLaborEstimateFlowProps> = ({
  onBack,
  onComplete,
  onContactReveal,
  continueLabel = 'Continue to book',
  initialContact,
}) => {
  const [homeSize, setHomeSize] = useState<HomeSize | null>(null);
  const [needsTruck, setNeedsTruck] = useState(false);
  const [heavyItems, setHeavyItems] = useState<string[]>([]);
  const [step, setStep] = useState<'truck' | 'size' | 'extras' | 'result'>('truck');
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(Boolean(initialContact?.name && initialContact?.phone));
  const [contactName, setContactName] = useState(initialContact?.name ?? '');
  const [contactPhone, setContactPhone] = useState(initialContact?.phone ?? '');
  const [contactLoading, setContactLoading] = useState(false);
  const [smsMarketingConsentAt, setSmsMarketingConsentAt] = useState<string | null>(initialContact?.consentAt ?? null);

  const selectedSize = homeSize ? HOME_SIZES.find((s) => s.id === homeSize)! : null;

  const totalHelpers = selectedSize?.helpers ?? 2;
  const totalHours = (selectedSize?.hours ?? 2) + (heavyItems.length > 0 ? 1 : 0);

  const serviceLabel = `${needsTruck ? 'Truck + ' : ''}${selectedSize?.label ?? ''} move${heavyItems.length ? ` + ${heavyItems.length} heavy item(s)` : ''}`;

  const buildEstimate = (price: PriceEstimate): QuoteEstimate => ({
    itemsDetected: [serviceLabel],
    estimatedVolume: price.estimatedVolume,
    price: price.price,
    summary: price.summary,
    subtotal: price.subtotal,
    onlineBookingDiscount: price.onlineBookingDiscount,
  });

  const handleGetEstimate = async () => {
    setPricingLoading(true);
    setPricingError(null);
    try {
      const price = await calculateMovingLaborPrice(totalHelpers, totalHours);
      setPriceEstimate(price);
      setEstimate(buildEstimate(price));
      setStep('result');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to calculate price. Please try again.';
      setPricingError(message);
    } finally {
      setPricingLoading(false);
    }
  };

  const handleContactReveal = async (name: string, phone: string, consentAt: string | null) => {
    if (!priceEstimate || !estimate) return;
    setContactLoading(true);
    try {
      if (onContactReveal) {
        await onContactReveal(name, phone, consentAt, estimate, priceEstimate);
      }
      setContactName(name);
      setContactPhone(phone);
      setSmsMarketingConsentAt(consentAt);
      setContactSubmitted(true);
    } finally {
      setContactLoading(false);
    }
  };

  const toggleHeavyItem = (id: string) => {
    setHeavyItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  if (step === 'truck') {
    return (
      <>
        <FlowStepTitle title="Do you need a truck?" subtitle="We can bring one or you can use your own." />
        <div className="space-y-3">
          <FlowSelectionCard
            title="Yes, bring a truck"
            description="We'll bring a truck and crew — everything included"
            icon={<Truck className="w-full h-full text-secondary" />}
            selected={needsTruck === true}
            onClick={() => { setNeedsTruck(true); setStep('size'); }}
          />
          <FlowSelectionCard
            title="No, I have a truck"
            description="Just need a crew to help load and unload"
            icon={<Home className="w-full h-full text-secondary" />}
            selected={needsTruck === false}
            onClick={() => { setNeedsTruck(false); setStep('size'); }}
          />
        </div>
        <FlowStickyNav showBack onBack={onBack} showContinue={false} />
      </>
    );
  }

  if (step === 'size') {
    return (
      <>
        <FlowStepTitle title="What size is your move?" subtitle="Select the option that best describes your home." />
        <div className="space-y-3">
          {HOME_SIZES.map((size) => (
            <FlowSelectionCard
              key={size.id}
              title={size.label}
              description={`${size.desc} · ${size.helpers} helpers, ~${size.hours} hrs`}
              icon={size.id === 'studio' ? <Home className={HERO_ICON_CLASS} /> : size.id === '3plus' ? <Building2 className={HERO_ICON_CLASS} /> : <Building2 className={HERO_ICON_CLASS} />}
              selected={homeSize === size.id}
              onClick={() => { setHomeSize(size.id); setStep('extras'); }}
            />
          ))}
        </div>
        <FlowStickyNav showBack onBack={() => setStep('truck')} showContinue={false} />
      </>
    );
  }

  if (step === 'extras') {
    return (
      <>
        <FlowStepTitle title="Any heavy or bulky items?" subtitle="Select any that apply. Adds ~1 hour to your move." />
        <div className="grid grid-cols-2 gap-3 mb-6">
          {HEAVY_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = heavyItems.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleHeavyItem(item.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selected ? 'border-brand bg-brand/5' : 'border-secondary-100 bg-white hover:border-brand/40'
                }`}
              >
                <Icon size={20} className={selected ? 'text-brand' : 'text-secondary-400'} />
                <p className={`text-xs font-semibold mt-2 ${selected ? 'text-brand' : 'text-secondary'}`}>{item.label}</p>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-secondary-400 text-center mb-4">{totalHelpers} helpers · ~{totalHours} hours estimated</p>
        <FlowStickyNav
          showBack
          onBack={() => setStep('size')}
          continueLabel="Get estimate"
          continueLoading={pricingLoading}
          onContinue={handleGetEstimate}
        />
        {pricingLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
              <p className="text-secondary-600 text-sm font-medium">Calculating your estimate...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  if (!priceEstimate || !estimate) return null;

  if (!contactSubmitted) {
    return (
      <ContactIntakeForm
        serviceType="Local Moving"
        isLoading={contactLoading}
        onReveal={handleContactReveal}
      />
    );
  }

  return (
    <>
      <FlowStepTitle title="Your estimate" subtitle="Review your price, then continue to book." />
      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-secondary-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-secondary">Local Moving</h3>
              {needsTruck && (
                <span className="px-2 py-0.5 bg-secondary-100 text-secondary text-[10px] font-semibold rounded-full flex items-center gap-1">
                  <Truck size={10} /> +Truck
                </span>
              )}
            </div>
            <p className="text-xs text-secondary-400 mt-0.5">{selectedSize?.label} · {totalHelpers} helpers · ~{totalHours} hrs{heavyItems.length ? ` · ${heavyItems.length} heavy item(s)` : ''}</p>
          </div>
          <p className="text-xl font-bold text-secondary">${priceEstimate.price}</p>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 leading-normal">Safe Protect™ damage coverage included on every booking.</p>
        </div>
      </div>

      <p className="text-xs text-secondary-400 mb-4">{priceEstimate.summary}</p>

      <FlowStickyNav
        showBack
        onBack={() => {
          setContactSubmitted(false);
          setStep('extras');
        }}
        onContinue={() =>
          onComplete({
            estimate,
            price: priceEstimate,
            contactName,
            contactPhone,
            smsMarketingConsentAt,
            serviceLabel,
          })
        }
        continueLabel={continueLabel}
      />
      <p className="text-xs text-secondary-400 text-center">* Final price confirmed on-site</p>
    </>
  );
};
