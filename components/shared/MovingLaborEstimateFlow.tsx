import React, { useState } from 'react';
import { Loader2, ShieldCheck, Check } from 'lucide-react';
import { calculateMovingLaborPrice } from '../../services/pricingService';
import {
  MovingAccessType,
  MovingHomeSize,
  MovingLaborOptions,
  MovingServiceScope,
  PriceEstimate,
  QuoteEstimate,
} from '../../types';
import {
  LoadingUnloadingIcon,
  LoadingIcon,
  UnloadingIcon,
  RearrangeIcon,
  BringTruckIcon,
  OwnTruckIcon,
  StudioHomeIcon,
  MultiHomeIcon,
  OneHelperIcon,
  TwoHelpersIcon,
  GroundFloorIcon,
  ElevatorIcon,
  StairsAccessIcon,
  PianoIcon,
  GymEquipmentIcon,
  SafeVaultIcon,
  PoolTableIcon,
  HotTubIcon,
  PackingHelpIcon,
  DisassemblyIcon,
} from '../icons/ServiceIcons';
import { ContactIntakeForm } from './ContactIntakeForm';
import { FlowSelectionCard } from './flow/FlowSelectionCard';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { FlowStickyNav } from './flow/FlowStickyNav';

const MOVING_ICON_CLASS = 'w-full h-full';
type FlowIcon = React.FC<{ className?: string; size?: number }>;

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

type FlowStep = 'scope' | 'truck' | 'size' | 'crew' | 'access' | 'extras' | 'result';

const SERVICE_SCOPES: {
  id: MovingServiceScope;
  label: string;
  desc: string;
  icon: FlowIcon;
}[] = [
  {
    id: 'both',
    label: 'Load & unload',
    desc: 'Full local move — load at pickup and unload at drop-off',
    icon: LoadingUnloadingIcon,
  },
  {
    id: 'loading',
    label: 'Loading only',
    desc: 'Crew loads your truck, POD, or storage unit',
    icon: LoadingIcon,
  },
  {
    id: 'unloading',
    label: 'Unloading only',
    desc: 'Crew unloads into your home, office, or storage',
    icon: UnloadingIcon,
  },
  {
    id: 'rearrange',
    label: 'In-home rearrange',
    desc: 'Move furniture between rooms — no truck needed',
    icon: RearrangeIcon,
  },
];

const HOME_SIZES: {
  id: MovingHomeSize;
  label: string;
  desc: string;
  hours: number;
}[] = [
  { id: 'studio', label: 'Studio / Efficiency', desc: 'Fits in a small truck — minimal furniture', hours: 2 },
  { id: '1bed', label: '1-Bedroom', desc: 'Apartment or small home — sofa, bed, boxes', hours: 3 },
  { id: '2bed', label: '2-Bedroom', desc: 'Medium home — multiple rooms of furniture', hours: 4 },
  { id: '3plus', label: '3+ Bedrooms', desc: 'Large home or full house move', hours: 6 },
];

const CREW_OPTIONS = [
  {
    helpers: 1 as const,
    label: '1 helper — I will help',
    desc: 'Best when you can assist with lifting',
    icon: OneHelperIcon,
  },
  {
    helpers: 2 as const,
    label: '2 helpers',
    desc: 'A complete crew handles the lifting',
    icon: TwoHelpersIcon,
  },
];

const ACCESS_OPTIONS: {
  id: MovingAccessType;
  label: string;
  desc: string;
  icon: FlowIcon;
  hourAddon: number;
}[] = [
  {
    id: 'ground',
    label: 'Ground floor / street level',
    desc: 'Easy access — no stairs or elevator',
    icon: GroundFloorIcon,
    hourAddon: 0,
  },
  {
    id: 'elevator',
    label: 'Elevator available',
    desc: 'Building has a working elevator for furniture',
    icon: ElevatorIcon,
    hourAddon: 0,
  },
  {
    id: 'stairs',
    label: 'Stairs required',
    desc: 'Upper floor, basement, or walk-up — no elevator',
    icon: StairsAccessIcon,
    hourAddon: 1,
  },
];

const HEAVY_ITEMS = [
  { id: 'piano', label: 'Piano', icon: PianoIcon },
  { id: 'treadmill', label: 'Treadmill / Gym', icon: GymEquipmentIcon },
  { id: 'safe', label: 'Safe / Vault', icon: SafeVaultIcon },
  { id: 'pool_table', label: 'Pool Table', icon: PoolTableIcon },
  { id: 'hot_tub', label: 'Hot Tub', icon: HotTubIcon },
  { id: 'gun_safe', label: 'Gun Safe', icon: SafeVaultIcon },
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

  return { helpers: options.helpers ?? 2, hours };
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
  const [helpers, setHelpers] = useState<1 | 2 | null>(null);
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
    serviceScope && homeSize && helpers && accessType && (serviceScope === 'rearrange' || needsTruck !== null) &&
    (accessType !== 'stairs' || flightsOfStairs !== null)
      ? (() => {
          const resolvedFlights = accessType === 'stairs' ? (flightsOfStairs ?? 1) : 0;
          const { helpers: resolvedHelpers, hours } = computeMovingLaborHours({
            serviceScope,
            needsTruck: serviceScope === 'rearrange' ? false : Boolean(needsTruck),
            homeSize,
            accessType,
            flightsOfStairs: resolvedFlights,
            heavyItems,
            needsPackingHelp,
            needsDisassembly,
            helpers,
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
            helpers: resolvedHelpers,
            hours,
          };
        })()
      : null;

  const totalHelpers = draftOptions?.helpers ?? helpers ?? 2;
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
      const price = await calculateMovingLaborPrice(draftOptions.helpers, draftOptions.hours, draftOptions.needsTruck);
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
                icon={<Icon className={MOVING_ICON_CLASS} />}
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
            description="Add a moving truck"
            icon={<BringTruckIcon className={MOVING_ICON_CLASS} />}
            selected={needsTruck === true}
            onClick={() => setNeedsTruck(true)}
          />
          <FlowSelectionCard
            title="No, I have a truck"
            description="Just need a crew to help load and unload"
            icon={<OwnTruckIcon className={MOVING_ICON_CLASS} />}
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
              description={`${size.desc} · ~${size.hours} hrs`}
              icon={
                size.id === 'studio' || size.id === '1bed' ? (
                  <StudioHomeIcon className={MOVING_ICON_CLASS} />
                ) : (
                  <MultiHomeIcon className={MOVING_ICON_CLASS} />
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
          onContinue={() => setStep('crew')}
          continueDisabled={!homeSize}
        />
      </>
    );
  }

  if (step === 'crew') {
    return (
      <>
        <FlowStepTitle title="How many helpers?" subtitle="Moving labor is billed hourly. Choose the level of help you need." />
        <div className="space-y-3">
          {CREW_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <FlowSelectionCard
                key={option.helpers}
                title={option.label}
                description={option.desc}
                icon={<Icon className={MOVING_ICON_CLASS} />}
                selected={helpers === option.helpers}
                onClick={() => setHelpers(option.helpers)}
              />
            );
          })}
        </div>
        <FlowStickyNav
          showBack
          onBack={() => setStep('size')}
          onContinue={() => setStep('access')}
          continueDisabled={!helpers}
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
                icon={<Icon className={MOVING_ICON_CLASS} />}
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
          <div className="flow-card mt-4 p-4">
            <p className="flow-section-label">How many flights of stairs?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFlightsOfStairs(n)}
                  aria-pressed={flightsOfStairs === n}
                  className="flow-chip flex-1"
                >
                  {n === 4 ? '4+' : n}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-[var(--text-muted)] mt-2.5">Each extra flight adds about 1 hour.</p>
          </div>
        )}

        <FlowStickyNav
          showBack
          onBack={() => setStep('crew')}
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

        <p className="flow-section-label">Heavy or bulky items</p>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {HEAVY_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = heavyItems.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleHeavyItem(item.id)}
                aria-pressed={selected}
                className="flow-tile"
              >
                <span className={`flow-option-radio flow-tile-check ${selected ? 'is-on' : ''}`} aria-hidden>
                  {selected && <Check size={12} strokeWidth={3} />}
                </span>
                <Icon size={22} className="text-[#520f96]" />
                <span className="mt-2 block text-[13px] font-bold text-[var(--text)]">{item.label}</span>
              </button>
            );
          })}
        </div>

        <p className="flow-section-label">Extra help</p>
        <div className="flow-options mb-5">
          <FlowSelectionCard
            title="Packing help"
            description="Help boxing items before the move · +~1 hr"
            icon={<PackingHelpIcon className={MOVING_ICON_CLASS} />}
            selected={needsPackingHelp}
            onClick={() => setNeedsPackingHelp((v) => !v)}
          />
          <FlowSelectionCard
            title="Disassembly & reassembly"
            description="Beds, tables, and large pieces · +~1 hr"
            icon={<DisassemblyIcon className={MOVING_ICON_CLASS} />}
            selected={needsDisassembly}
            onClick={() => setNeedsDisassembly((v) => !v)}
          />
        </div>

        <p className="flow-summary-pill mb-4">
          {totalHelpers} helper{totalHelpers === 1 ? '' : 's'} · ~{totalHours} hours estimated
        </p>
        {pricingError && (
          <div className="mb-3 p-3 bg-brand/10 border border-brand/30 rounded-xl">
            <p className="text-brand text-xs font-bold">{pricingError}</p>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--surface-2)] backdrop-blur-sm">
            <div className="text-center">
              <Loader2 size={48} className="animate-spin mx-auto mb-4 text-brand" />
              <p className="text-[var(--text-muted)] text-sm font-medium">Calculating your estimate...</p>
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

  const hourlyRate = draftOptions.helpers === 1 ? 69 : 99;

  return (
    <>
      <FlowStepTitle title="Your estimate" subtitle="Review your rate, then continue to book." />
      <div className="flow-card flow-estimate mb-4 overflow-hidden">
        <div className="flow-estimate-head">
          <div className="flex items-center justify-between gap-2">
            <span className="flow-option-title">Local Moving</span>
            <span className="flow-option-badge">{SCOPE_LABELS[draftOptions.serviceScope]}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="flow-estimate-price">${hourlyRate}</span>
            <span className="text-sm font-semibold text-[var(--text-muted)]">/hour</span>
          </div>
          <p className="mt-1 text-[13px] text-[var(--text-muted)]">
            {totalHelpers} helper{totalHelpers === 1 ? '' : 's'}
            {draftOptions.needsTruck && ' · +$99 truck'}
          </p>
        </div>

        <div className="border-t border-[var(--border)] px-4 pt-3 pb-1">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            <span>Size <span className="font-medium text-[var(--text)]">{HOME_SIZE_LABELS[draftOptions.homeSize]}</span></span>
            <span className="select-none mx-1.5 text-[var(--text-muted)]">·</span>
            <span>Access <span className="font-medium text-[var(--text)]">{ACCESS_LABELS[draftOptions.accessType]}</span></span>
            {draftOptions.heavyItems.length > 0 && (
              <>
                <span className="select-none mx-1.5 text-[var(--text-muted)]">·</span>
                <span>Heavy items <span className="font-medium text-[var(--text)]">{draftOptions.heavyItems.length}</span></span>
              </>
            )}
            {draftOptions.needsPackingHelp && (
              <>
                <span className="select-none mx-1.5 text-[var(--text-muted)]">·</span>
                <span>Packing help</span>
              </>
            )}
            {draftOptions.needsDisassembly && (
              <>
                <span className="select-none mx-1.5 text-[var(--text-muted)]">·</span>
                <span>Disassembly</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-start gap-2.5 px-4 py-3 bg-[#f1faf4]">
          <ShieldCheck size={15} className="text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-emerald-800 leading-normal">
            Safe Protect™ damage coverage included on every booking.
          </p>
        </div>
      </div>

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
      <p className="text-xs text-[var(--text-muted)] text-center">* Final price confirmed on-site</p>
    </>
  );
};
