import React, { useState } from 'react';
import { Loader2, Minus, Plus, ShieldCheck } from 'lucide-react';
import { calculateMovingLaborPrice } from '../../services/pricingService';
import { PriceEstimate, QuoteEstimate } from '../../types';
import { ContactIntakeForm } from './ContactIntakeForm';
import { FlowSelectionCard } from './flow/FlowSelectionCard';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { FlowStickyNav } from './flow/FlowStickyNav';
import {
  LoadingIcon,
  UnloadingIcon,
  LoadingUnloadingIcon,
  StorageUnitIcon,
  BoxTruckIcon,
  InsideHomeIcon,
  OtherMoveIcon,
  TwoHelpersIcon,
  ThreeHelpersIcon,
} from '../icons/ServiceIcons';

const MOVING_ICON_CLASS = 'w-full h-full text-secondary [&_.stroke-brand]:stroke-current';

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

export const MovingLaborEstimateFlow: React.FC<MovingLaborEstimateFlowProps> = ({
  onBack,
  onComplete,
  onContactReveal,
  continueLabel = 'Continue to book',
  initialContact,
}) => {
  const [movingServiceType, setMovingServiceType] = useState<'Loading Only' | 'Unloading Only' | 'Both'>('Both');
  const [movingType, setMovingType] = useState<'Storage Unit' | 'Box Truck' | 'Inside Home' | 'Other'>('Inside Home');
  const [movingHelpers, setMovingHelpers] = useState<2 | 3>(2);
  const [movingHours, setMovingHours] = useState(2);
  const [step, setStep] = useState<'service' | 'type' | 'crew' | 'result'>('service');
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(Boolean(initialContact?.name && initialContact?.phone));
  const [contactName, setContactName] = useState(initialContact?.name ?? '');
  const [contactPhone, setContactPhone] = useState(initialContact?.phone ?? '');
  const [contactLoading, setContactLoading] = useState(false);
  const [smsMarketingConsentAt, setSmsMarketingConsentAt] = useState<string | null>(initialContact?.consentAt ?? null);

  const serviceLabel = `${movingServiceType} (${movingType}) — ${movingHelpers} helpers, ${movingHours} hrs`;

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
      const price = await calculateMovingLaborPrice(movingHelpers, movingHours);
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

  if (step === 'service') {
    return (
      <>
        <FlowStepTitle title="What type of help?" subtitle="Choose loading, unloading, or both. 2-hour minimum applies." />
        <div className="space-y-3">
          {[
            { label: 'Loading Only' as const, desc: 'Pack a rental truck, container, or storage unit', Icon: LoadingIcon },
            { label: 'Unloading Only' as const, desc: 'Unpack into your new home, office, or storage', Icon: UnloadingIcon },
            { label: 'Both' as const, desc: 'Help with both loading and unloading', Icon: LoadingUnloadingIcon },
          ].map((service) => (
            <FlowSelectionCard
              key={service.label}
              title={service.label}
              description={service.desc}
              icon={<service.Icon className={MOVING_ICON_CLASS} />}
              selected={movingServiceType === service.label}
              onClick={() => setMovingServiceType(service.label)}
            />
          ))}
        </div>
        <FlowStickyNav showBack onBack={onBack} onContinue={() => setStep('type')} />
      </>
    );
  }

  if (step === 'type') {
    return (
      <>
        <FlowStepTitle title="Where is the move?" subtitle="Tell us what kind of location you're working with." />
        <div className="space-y-3">
          {[
            { label: 'Storage Unit' as const, desc: 'PODS, U-Pack, or local storage facility', Icon: StorageUnitIcon },
            { label: 'Box Truck' as const, desc: 'Rental trucks like U-Haul, Penske, or Ryder', Icon: BoxTruckIcon },
            { label: 'Inside Home' as const, desc: 'Rearranging furniture or room-to-room loading', Icon: InsideHomeIcon },
            { label: 'Other' as const, desc: 'Custom labor requests and heavy lifting', Icon: OtherMoveIcon },
          ].map((type) => (
            <FlowSelectionCard
              key={type.label}
              title={type.label}
              description={type.desc}
              icon={<type.Icon className={MOVING_ICON_CLASS} />}
              selected={movingType === type.label}
              onClick={() => setMovingType(type.label)}
            />
          ))}
        </div>
        <FlowStickyNav showBack onBack={() => setStep('service')} onContinue={() => setStep('crew')} />
      </>
    );
  }

  if (step === 'crew') {
    return (
      <>
        <FlowStepTitle title="Crew size & duration" subtitle="2-hour minimum. Adjust helpers and estimated hours." />
        <div className="space-y-3 mb-6">
          {[
            { helpers: 2 as const, desc: 'Apartment moves, loading containers, and light lifting', Icon: TwoHelpersIcon },
            { helpers: 3 as const, desc: 'House moves, large trucks, and heavy items', Icon: ThreeHelpersIcon },
          ].map((option) => (
            <FlowSelectionCard
              key={option.helpers}
              title={`${option.helpers} helpers`}
              description={option.desc}
              icon={<option.Icon className={MOVING_ICON_CLASS} />}
              selected={movingHelpers === option.helpers}
              onClick={() => setMovingHelpers(option.helpers)}
            />
          ))}
        </div>

        <div className="bg-white border border-secondary-200 rounded-xl p-4 flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-secondary">Estimated hours</p>
            <p className="text-xs text-secondary-500 mt-0.5">{movingHours} hours (2 hr min)</p>
          </div>
          <div className="flex items-center gap-2 border border-secondary-200 rounded-full px-2 py-1">
            <button
              type="button"
              onClick={() => setMovingHours((h) => Math.max(2, h - 1))}
              disabled={movingHours <= 2}
              className="w-8 h-8 rounded-full hover:bg-secondary-50 text-secondary disabled:opacity-30 flex items-center justify-center"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-secondary">{movingHours}</span>
            <button
              type="button"
              onClick={() => setMovingHours((h) => Math.min(12, h + 1))}
              className="w-8 h-8 rounded-full hover:bg-secondary-50 text-secondary flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {pricingError && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
            {pricingError}
          </div>
        )}

        <FlowStickyNav
          showBack
          onBack={() => setStep('type')}
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
        serviceType="Moving Labor"
        isLoading={contactLoading}
        onReveal={handleContactReveal}
      />
    );
  }

  return (
    <>
      <FlowStepTitle title="Your estimate" subtitle="Review your price, then continue to book." />
      <div className="bg-white border border-secondary-200 rounded-xl p-4 flex items-center gap-4 mb-4">
        <div className="w-20 h-16 shrink-0">
          <img src="/process-step-2.svg" alt="Moving Labor" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-secondary">Moving Labor</h3>
          <p className="text-secondary-500 text-xs mt-0.5">{priceEstimate.estimatedVolume}</p>
        </div>
        <p className="text-2xl font-semibold text-secondary shrink-0">${priceEstimate.price}</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 mb-4">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-800 leading-normal">Safe Protect™ damage coverage included on every booking.</p>
      </div>

      <p className="text-sm text-secondary-500 mb-2">{priceEstimate.summary}</p>

      <FlowStickyNav
        showBack
        onBack={() => {
          setContactSubmitted(false);
          setStep('crew');
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
