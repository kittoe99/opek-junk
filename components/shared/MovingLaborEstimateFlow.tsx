import React, { useState } from 'react';
import {
  Loader2,
  ShieldCheck,
  Truck,
  Home,
  Building2,
  Warehouse,
  Piano,
  Dumbbell,
  Weight,
  Cog,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  RefreshCw,
  ArrowUpNarrowWide,
  Package,
  Wrench,
  Layers,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { calculateMovingLaborPrice } from '../../services/pricingService';
import {
  MovingAccessType,
  MovingHomeSize,
  MovingLaborOptions,
  MovingServiceScope,
  PriceEstimate,
  QuoteEstimate,
} from '../../types';
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
  movingOptions: MovingLaborOptions;
}

interface MovingLaborEstimateFlowProps {
  onBack: () => void;
  onComplete: (result: MovingLaborEstimateResult) => void;
  onContactReveal?: (
    name: string,
    phone: string,
    consentAt: string | null,
    estimate: QuoteEstimate,
    price: PriceEstimate,
    movingOptions: MovingLaborOptions
  ) => Promise<void>;
  continueLabel?: string;
  initialContact?: { name: string; phone: string; consentAt: string | null };
}

type FlowStep = 'scope' | 'truck' | 'size' | 'access' | 'extras' | 'result';

const SERVICE_SCOPES: {
  id: MovingServiceScope;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  {
    id: 'both',
    label: 'Load & unload',
    desc: 'Full local move — load at pickup and unload at drop-off',
    icon: ArrowLeftRight,
  },
  {
    id: 'loading',
    label: 'Loading only',
    desc: 'Crew loads your truck, POD, or storage unit',
    icon: ArrowUpFromLine,
  },
  {
    id: 'unloading',
    label: 'Unloading only',
    desc: 'Crew unloads into your home, office, or storage',
    icon: ArrowDownToLine,
  },
  {
    id: 'rearrange',
    label: 'In-home rearrange',
    desc: 'Move furniture between rooms — no truck needed',
    icon: RefreshCw,
  },
];

const HOME_SIZES: {
  id: MovingHomeSize;
  label: string;
  desc: string;
  helpers: 2 | 3;
  hours: number;
}[] = [
  { id: 'studio', label: 'Studio / Efficiency', desc: 'Fits in a small truck — minimal furniture', helpers: 2, hours: 2 },
  { id: '1bed', label: '1-Bedroom', desc: 'Apartment or small home — sofa, bed, boxes', helpers: 2, hours: 3 },
  { id: '2bed', label: '2-Bedroom', desc: 'Medium home — multiple rooms of furniture', helpers: 3, hours: 4 },
  { id: '3plus', label: '3+ Bedrooms', desc: 'Large home or full house move', helpers: 3, hours: 6 },
];

const ACCESS_OPTIONS: {
  id: MovingAccessType;
  label: string;
  desc: string;
  icon: LucideIcon;
  hourAddon: number;
}[] = [
  {
    id: 'ground',
    label: 'Ground floor / street level',
    desc: 'Easy access — no stairs or elevator',
    icon: Home,
    hourAddon: 0,
  },
  {
    id: 'elevator',
    label: 'Elevator available',
    desc: 'Building has a working elevator for furniture',
    icon: Layers,
    hourAddon: 0,
  },
  {
    id: 'stairs',
    label: 'Stairs required',
    desc: 'Upper floor, basement, or walk-up — no elevator',
    icon: ArrowUpNarrowWide,
    hourAddon: 1,
  },
];

const HEAVY_ITEMS = [
  { id: 'piano', label: 'Piano', icon: Piano },
  { id: 'treadmill', label: 'Treadmill / Gym', icon: Dumbbell },
  { id: 'safe', label: 'Safe / Vault', icon: Weight },
  { id: 'pool_table', label: 'Pool Table', icon: Cog },
  { id: 'hot_tub', label: 'Hot Tub', icon: Warehouse },
  { id: 'gun_safe', label: 'Gun Safe', icon: Weight },
];

const SCOPE_LABELS: Record<MovingServiceScope, string> = {
  both: 'Load & unload',
  loading: 'Loading only',
  unloading: 'Unloading only',
  rearrange: 'In-home rearrange',
};

const HOME_SIZE_LABELS: Record<MovingHomeSize, string> = {
  studio: 'Studio / Efficiency',
  '1bed': '1-Bedroom',
  '2bed': '2-Bedroom',
  '3plus': '3+ Bedrooms',
};

const ACCESS_LABELS: Record<MovingAccessType, string> = {
  ground: 'Ground floor',
  elevator: 'Elevator',
  stairs: 'Stairs',
};

export function buildMovingServiceLabel(options: MovingLaborOptions): string {
  const parts: string[] = [SCOPE_LABELS[options.serviceScope]];
  if (options.needsTruck) parts.unshift('Truck +');
  parts.push(HOME_SIZE_LABELS[options.homeSize]);
  if (options.accessType === 'stairs' && options.flightsOfStairs > 0) {
    parts.push(`${options.flightsOfStairs} flight(s) of stairs`);
  } else if (options.accessType !== 'ground') {
    parts.push(ACCESS_LABELS[options.accessType]);
  }
  if (options.heavyItems.length) parts.push(`${options.heavyItems.length} heavy item(s)`);
  if (options.needsPackingHelp) parts.push('packing help');
  if (options.needsDisassembly) parts.push('disassembly');
  return parts.join(' · ');
}

export function computeMovingLaborHours(options: Omit<MovingLaborOptions, 'helpers' | 'hours'> & { helpers?: number }): {
  helpers: number;
  hours: number;
} {
  const size = HOME_SIZES.find((s) => s.id === options.homeSize)!;
  let hours = size.hours;

  // Single-end jobs take less time than a full load & unload.
  if (options.serviceScope === 'loading' || options.serviceScope === 'unloading') {
    hours = Math.max(2, Math.round(hours * 0.7));
  } else if (options.serviceScope === 'rearrange') {
    hours = Math.max(2, Math.round(hours * 0.6));
  }

  const access = ACCESS_OPTIONS.find((a) => a.id === options.accessType);
  hours += access?.hourAddon ?? 0;
  if (options.accessType === 'stairs' && options.flightsOfStairs > 1) {
    hours += options.flightsOfStairs - 1;
  }
  if (options.heavyItems.length > 0) hours += 1;
  if (options.needsPackingHelp) hours += 1;
  if (options.needsDisassembly) hours += 1;

  return { helpers: size.helpers, hours };
}

export const MovingLaborEstimateFlow: React.FC<MovingLaborEstimateFlowProps> = ({
  onBack,
  onComplete,
  onContactReveal,
  continueLabel = 'Continue to book',
  initialContact,
}) => {
  const [serviceScope, setServiceScope] = useState<MovingServiceScope | null>(null);
  const [homeSize, setHomeSize] = useState<MovingHomeSize | null>(null);
  const [needsTruck, setNeedsTruck] = useState<boolean | null>(null);
  const [accessType, setAccessType] = useState<MovingAccessType | null>(null);
  const [flightsOfStairs, setFlightsOfStairs] = useState<number | null>(null);
  const [heavyItems, setHeavyItems] = useState<string[]>([]);
  const [needsPackingHelp, setNeedsPackingHelp] = useState(false);
  const [needsDisassembly, setNeedsDisassembly] = useState(false);
  const [step, setStep] = useState<FlowStep>('scope');
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

  const draftOptions: MovingLaborOptions | null =
    serviceScope && homeSize && accessType && (serviceScope === 'rearrange' || needsTruck !== null) &&
    (accessType !== 'stairs' || flightsOfStairs !== null)
      ? (() => {
          const resolvedFlights = accessType === 'stairs' ? (flightsOfStairs ?? 1) : 0;
          const { helpers, hours } = computeMovingLaborHours({
            serviceScope,
            needsTruck: serviceScope === 'rearrange' ? false : Boolean(needsTruck),
            homeSize,
            accessType,
            flightsOfStairs: resolvedFlights,
            heavyItems,
            needsPackingHelp,
            needsDisassembly,
          });
          return {
            serviceScope,
            needsTruck: serviceScope === 'rearrange' ? false : Boolean(needsTruck),
            homeSize,
            accessType,
            flightsOfStairs: resolvedFlights,
            heavyItems,
            needsPackingHelp,
            needsDisassembly,
            helpers,
            hours,
          };
        })()
      : null;

  const totalHelpers = draftOptions?.helpers ?? selectedSize?.helpers ?? 2;
  const totalHours = draftOptions?.hours ?? selectedSize?.hours ?? 2;
  const serviceLabel = draftOptions ? buildMovingServiceLabel(draftOptions) : 'Local Moving';

  const buildEstimate = (price: PriceEstimate, label: string): QuoteEstimate => ({
    itemsDetected: [label],
    estimatedVolume: price.estimatedVolume,
    price: price.price,
    summary: price.summary,
    subtotal: price.subtotal,
    onlineBookingDiscount: price.onlineBookingDiscount,
  });

  const handleGetEstimate = async () => {
    if (!draftOptions) return;
    setPricingLoading(true);
    setPricingError(null);
    try {
      const price = await calculateMovingLaborPrice(draftOptions.helpers, draftOptions.hours);
      const label = buildMovingServiceLabel(draftOptions);
      setPriceEstimate(price);
      setEstimate(buildEstimate(price, label));
      setStep('result');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to calculate price. Please try again.';
      setPricingError(message);
    } finally {
      setPricingLoading(false);
    }
  };

  const handleContactReveal = async (name: string, phone: string, consentAt: string | null) => {
    if (!priceEstimate || !estimate || !draftOptions) return;
    setContactLoading(true);
    try {
      if (onContactReveal) {
        await onContactReveal(name, phone, consentAt, estimate, priceEstimate, draftOptions);
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
    setHeavyItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const continueAfterScope = () => {
    if (!serviceScope) return;
    if (serviceScope === 'rearrange') {
      setNeedsTruck(null);
      setStep('size');
    } else {
      setStep('truck');
    }
  };

  if (step === 'scope') {
    return (
      <>
        <FlowStepTitle
          title="What do you need help with?"
          subtitle="Choose the option that best matches your local move."
        />
        <div className="space-y-3">
          {SERVICE_SCOPES.map((scope) => {
            const Icon = scope.icon;
            return (
              <FlowSelectionCard
                key={scope.id}
                title={scope.label}
                description={scope.desc}
                icon={<Icon className="w-full h-full text-secondary" />}
                selected={serviceScope === scope.id}
                onClick={() => setServiceScope(scope.id)}
              />
            );
          })}
        </div>
        <FlowStickyNav
          showBack
          onBack={onBack}
          onContinue={continueAfterScope}
          continueDisabled={!serviceScope}
        />
      </>
    );
  }

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
            onClick={() => setNeedsTruck(true)}
          />
          <FlowSelectionCard
            title="No, I have a truck"
            description="Just need a crew to help load and unload"
            icon={<Home className="w-full h-full text-secondary" />}
            selected={needsTruck === false}
            onClick={() => setNeedsTruck(false)}
          />
        </div>
        <FlowStickyNav
          showBack
          onBack={() => setStep('scope')}
          onContinue={() => setStep('size')}
          continueDisabled={needsTruck === null}
        />
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
              icon={
                size.id === 'studio' ? (
                  <Home className={HERO_ICON_CLASS} />
                ) : (
                  <Building2 className={HERO_ICON_CLASS} />
                )
              }
              selected={homeSize === size.id}
              onClick={() => setHomeSize(size.id)}
            />
          ))}
        </div>
        <FlowStickyNav
          showBack
          onBack={() => setStep(serviceScope === 'rearrange' ? 'scope' : 'truck')}
          onContinue={() => setStep('access')}
          continueDisabled={!homeSize}
        />
      </>
    );
  }

  if (step === 'access') {
    const accessReady = Boolean(accessType) && (accessType !== 'stairs' || flightsOfStairs !== null);
    return (
      <>
        <FlowStepTitle
          title="How is access at the main location?"
          subtitle={
            serviceScope === 'rearrange'
              ? 'Tell us about stairs or elevators in the home.'
              : serviceScope === 'unloading'
                ? 'Describe access at the drop-off location.'
                : 'Describe access at the pickup location. You can add drop-off details when booking.'
          }
        />
        <div className="space-y-3">
          {ACCESS_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <FlowSelectionCard
                key={option.id}
                title={option.label}
                description={
                  option.hourAddon > 0
                    ? `${option.desc} · +~${option.hourAddon} hr`
                    : option.desc
                }
                icon={<Icon className="w-full h-full text-secondary" />}
                selected={accessType === option.id}
                onClick={() => {
                  setAccessType(option.id);
                  if (option.id !== 'stairs') {
                    setFlightsOfStairs(null);
                  }
                }}
              />
            );
          })}
        </div>

        {accessType === 'stairs' && (
          <div className="mt-4 rounded-xl border border-secondary-100 bg-white p-4">
            <p className="text-xs font-semibold text-secondary-500 mb-3">How many flights of stairs?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFlightsOfStairs(n)}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-all inline-flex items-center justify-center gap-1.5 ${
                    flightsOfStairs === n
                      ? 'border-brand bg-brand/5 text-brand'
                      : 'border-secondary-100 bg-white text-secondary hover:border-brand/40'
                  }`}
                >
                  {flightsOfStairs === n && <Check size={14} strokeWidth={3} className="text-brand" />}
                  {n === 4 ? '4+' : n}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-secondary-400 mt-2">Each extra flight adds about 1 hour.</p>
          </div>
        )}

        <FlowStickyNav
          showBack
          onBack={() => setStep('size')}
          continueLabel="Continue"
          onContinue={() => setStep('extras')}
          continueDisabled={!accessReady}
        />
      </>
    );
  }

  if (step === 'extras') {
    return (
      <>
        <FlowStepTitle
          title="Anything else we should know?"
          subtitle="Heavy items and extra help affect your estimate. Optional — skip if none apply."
        />

        <p className="text-xs font-semibold text-secondary-500 mb-2">Heavy or bulky items</p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {HEAVY_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = heavyItems.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleHeavyItem(item.id)}
                className={`relative rounded-xl border p-4 text-left transition-all ${
                  selected ? 'border-brand bg-brand/5' : 'border-secondary-100 bg-white hover:border-brand/40'
                }`}
              >
                <div
                  className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected ? 'border-brand bg-brand' : 'border-secondary-200 bg-white'
                  }`}
                >
                  {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <Icon size={20} className={selected ? 'text-brand' : 'text-secondary-400'} />
                <p className={`text-xs font-semibold mt-2 ${selected ? 'text-brand' : 'text-secondary'}`}>
                  {item.label}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-xs font-semibold text-secondary-500 mb-2">Extra help</p>
        <div className="space-y-3 mb-4">
          <button
            type="button"
            onClick={() => setNeedsPackingHelp((v) => !v)}
            className={`w-full rounded-xl border p-4 text-left transition-all flex items-start gap-3 ${
              needsPackingHelp ? 'border-brand bg-brand/5' : 'border-secondary-100 bg-white hover:border-brand/40'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                needsPackingHelp ? 'border-brand bg-brand' : 'border-secondary-200 bg-white'
              }`}
            >
              {needsPackingHelp && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <Package size={20} className={needsPackingHelp ? 'text-brand shrink-0' : 'text-secondary-400 shrink-0'} />
            <div>
              <p className={`text-sm font-semibold ${needsPackingHelp ? 'text-brand' : 'text-secondary'}`}>
                Packing help
              </p>
              <p className="text-xs text-secondary-400 mt-0.5">Help boxing items before the move · +~1 hr</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setNeedsDisassembly((v) => !v)}
            className={`w-full rounded-xl border p-4 text-left transition-all flex items-start gap-3 ${
              needsDisassembly ? 'border-brand bg-brand/5' : 'border-secondary-100 bg-white hover:border-brand/40'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                needsDisassembly ? 'border-brand bg-brand' : 'border-secondary-200 bg-white'
              }`}
            >
              {needsDisassembly && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <Wrench size={20} className={needsDisassembly ? 'text-brand shrink-0' : 'text-secondary-400 shrink-0'} />
            <div>
              <p className={`text-sm font-semibold ${needsDisassembly ? 'text-brand' : 'text-secondary'}`}>
                Furniture disassembly / reassembly
              </p>
              <p className="text-xs text-secondary-400 mt-0.5">Beds, tables, and large pieces · +~1 hr</p>
            </div>
          </button>
        </div>

        <p className="text-xs text-secondary-400 text-center mb-4">
          {totalHelpers} helpers · ~{totalHours} hours estimated
        </p>
        {pricingError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-xs font-bold">{pricingError}</p>
          </div>
        )}
        <FlowStickyNav
          showBack
          onBack={() => setStep('access')}
          continueLabel="Get estimate"
          continueLoading={pricingLoading}
          onContinue={handleGetEstimate}
          continueDisabled={!draftOptions}
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

  if (!priceEstimate || !estimate || !draftOptions) return null;

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
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-bold text-secondary">Local Moving</h3>
              {draftOptions.needsTruck && (
                <span className="px-2 py-0.5 bg-secondary-100 text-secondary text-[10px] font-semibold rounded-full flex items-center gap-1">
                  <Truck size={10} /> +Truck
                </span>
              )}
              <span className="px-2 py-0.5 bg-secondary-100 text-secondary text-[10px] font-semibold rounded-full">
                {SCOPE_LABELS[draftOptions.serviceScope]}
              </span>
            </div>
            <p className="text-xs text-secondary-400 mt-0.5">
              {HOME_SIZE_LABELS[draftOptions.homeSize]} · {totalHelpers} helpers · ~{totalHours} hrs ·{' '}
              {ACCESS_LABELS[draftOptions.accessType]}
              {draftOptions.heavyItems.length ? ` · ${draftOptions.heavyItems.length} heavy` : ''}
              {draftOptions.needsPackingHelp ? ' · packing' : ''}
              {draftOptions.needsDisassembly ? ' · assembly' : ''}
            </p>
          </div>
          <p className="text-xl font-bold text-secondary">${priceEstimate.price}</p>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 leading-normal">
            Safe Protect™ damage coverage included on every booking.
          </p>
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
            movingOptions: draftOptions,
          })
        }
        continueLabel={continueLabel}
      />
      <p className="text-xs text-secondary-400 text-center">* Final price confirmed on-site</p>
    </>
  );
};
