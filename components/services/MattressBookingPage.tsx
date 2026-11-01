import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Minus, Package, Plus, ShieldCheck } from 'lucide-react';
import { trackMattressConversion } from '../../lib/googleAds';
import { resolveZipLocation } from '../../services/addressSearch';
import {
  formatOnlineBookingDiscountLabel,
  getMattressPricingBreakdown,
  MATTRESS_ONLINE_DISCOUNT_SUMMARY,
  MATTRESS_UNIT_PRICES,
} from '../../lib/mattressBookingPricing';
import {
  FLOW_INPUT,
  FLOW_LABEL,
  FLOW_PAGE_CONTENT,
  FLOW_PAGE_SHELL,
  FLOW_STEP_ANCHOR,
  scrollToFlowStep,
} from '../../lib/flowPageLayout';
import { FlowChrome } from '../shared/flow/FlowChrome';
import { FlowZipCheck } from '../shared/flow/FlowZipCheck';
import { FlowStepTitle } from '../shared/flow/FlowStepTitle';
import { FlowStickyNav } from '../shared/flow/FlowStickyNav';
import { ContactIntakeForm } from '../shared/ContactIntakeForm';
import { ScheduleDatePicker, TimeSlot, formatTimeSlotLabel } from '../shared/ScheduleDatePicker';
import {
  ServiceAddressField,
  ServiceAddressValue,
  isServiceAddressValidated,
} from '../shared/ServiceAddressField';
import { createBookingSubmitter, bookingLocalNow, BOOKING_SMS_CONSENT, BOOKING_TERMS } from '../../lib/crmBooking';
import { CheckboxCard } from '../shared/CheckboxCard';
import { BookingSuccessView } from '../shared/BookingSuccessView';
import { JunkItemCatalogSelector } from '../shared/JunkItemCatalogSelector';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9;

interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  basePriceEstimate: number;
}

interface IncomingState {
  preselectItems?: { name: string; quantity: number }[];
  zipValue?: string;
  zipResult?: { city: string; state: string; served?: boolean };
}

const CORE_OPTIONS: {
  id: string;
  name: string;
  desc: string;
  basePriceEstimate: number;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'mattress',
    name: 'Mattress',
    desc: 'Any size · foam, hybrid, innerspring',
    basePriceEstimate: MATTRESS_UNIT_PRICES.mattress,
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" />
        <circle cx="8" cy="12" r="1" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="12" r="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'boxspring',
    name: 'Box Spring',
    desc: 'Foundation or low-profile base',
    basePriceEstimate: MATTRESS_UNIT_PRICES.boxspring,
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="10" width="18" height="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 10v8M12 10v8M18 10v8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 14h18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'bedframe',
    name: 'Bed Frame',
    desc: 'Platform, rails, or adjustable',
    basePriceEstimate: MATTRESS_UNIT_PRICES.bedframe,
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 4v16M20 10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 14h16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 8h5M4 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function mapPreselectItems(
  preselect?: { name: string; quantity: number }[]
): BookingItem[] {
  const base: BookingItem[] = CORE_OPTIONS.map((opt) => ({
    id: opt.id,
    name: opt.name,
    quantity: 0,
    basePriceEstimate: opt.basePriceEstimate,
  }));

  if (!preselect?.length) {
    return base.map((item) =>
      item.id === 'mattress' ? { ...item, quantity: 1 } : item
    );
  }

  const next = [...base];
  for (const incoming of preselect) {
    const name = incoming.name.toLowerCase();
    let matched = false;
    for (const item of next) {
      const idMatch =
        (item.id === 'mattress' && name.includes('mattress')) ||
        (item.id === 'boxspring' && (name.includes('box spring') || name.includes('boxspring'))) ||
        (item.id === 'bedframe' && (name.includes('bed frame') || name.includes('bedframe')));
      if (idMatch || item.name.toLowerCase() === name) {
        item.quantity += incoming.quantity;
        matched = true;
        break;
      }
    }
    if (!matched) {
      next.push({
        id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: incoming.name,
        quantity: incoming.quantity,
        basePriceEstimate: MATTRESS_UNIT_PRICES.extraDefault,
      });
    }
  }

  if (!next.some((i) => i.quantity > 0)) {
    const mattress = next.find((i) => i.id === 'mattress');
    if (mattress) mattress.quantity = 1;
  }

  return next;
}

export const MattressBookingPage: React.FC = () => {
  const location = useLocation();
  const incomingState = (location.state as IncomingState | null) ?? null;
  const initialZip = incomingState?.zipValue ?? '';
  const hasVerifiedZip = Boolean(
    incomingState?.zipResult && /^\d{5}$/.test(incomingState?.zipValue ?? '')
  );

  const [step, setStep] = useState<Step>(hasVerifiedZip ? 2 : 1);
  const stepAnchorRef = useRef<HTMLDivElement>(null);
  const bookingStartTrackedRef = useRef(false);

  const [zipCode, setZipCode] = useState(initialZip);
  const [zipResult, setZipResult] = useState<{ city: string; state: string } | null>(
    incomingState?.zipResult
      ? { city: incomingState.zipResult.city, state: incomingState.zipResult.state }
      : null
  );
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const [selectedItems, setSelectedItems] = useState<BookingItem[]>(() =>
    mapPreselectItems(incomingState?.preselectItems)
  );
  const [showExtrasCatalog, setShowExtrasCatalog] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '' as TimeSlot | '',
    name: '',
    email: '',
    phone: '',
    address: '',
    unitNumber: '',
    city: incomingState?.zipResult?.city ?? '',
    state: incomingState?.zipResult?.state ?? '',
    zipCode: initialZip,
  });

  const [contactLoading, setContactLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const submitBooking = useRef(createBookingSubmitter());
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [addressValidated, setAddressValidated] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingStartTrackedRef.current) return;
    bookingStartTrackedRef.current = true;
    trackMattressConversion('mattress_booking_start');
  }, []);

  useEffect(() => {
    scrollToFlowStep(stepAnchorRef.current);
  }, [step]);

  const pricing = getMattressPricingBreakdown(selectedItems);
  const activeItems = selectedItems.filter((i) => i.quantity > 0);
  const progress = step === 9 ? 1 : Math.min(0.95, step / 8);
  const chromeStepLabel =
    step === 1 ? 'ZIP check'
    : step === 2 ? 'Items'
    : step === 3 ? 'Contact'
    : step === 4 ? 'Estimate'
    : step === 5 ? 'Schedule'
    : step === 6 ? 'Address'
    : step === 7 ? 'Review'
    : 'Request received';

  const goTo = (next: Step) => {
    setFormError(null);
    setStep(next);
  };

  const handleZipCheck = async () => {
    if (!/^\d{5}$/.test(zipCode)) {
      setZipError('Please enter a valid 5-digit ZIP code.');
      return;
    }
    setZipError(null);
    setZipLoading(true);
    try {
      const locationResult = await resolveZipLocation(zipCode);
      if (!locationResult) {
        setZipError('ZIP not found. Please check and try again.');
        return;
      }
      setZipResult({ city: locationResult.city, state: locationResult.state });
      setFormData((prev) => ({
        ...prev,
        city: locationResult.city,
        state: locationResult.state,
        zipCode: locationResult.zip,
      }));
      trackMattressConversion('mattress_zip_check');
      setTimeout(() => goTo(2), 600);
    } finally {
      setZipLoading(false);
    }
  };

  const setCoreQuantity = (id: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
    );
  };

  const toggleCoreItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity > 0 ? 0 : 1 } : item
      )
    );
  };

  const syncExtrasFromCatalog = (
    catalogItems: { id: string; name: string; quantity: number }[]
  ) => {
    setSelectedItems((prev) => {
      const cores = prev.filter((i) =>
        CORE_OPTIONS.some((opt) => opt.id === i.id)
      );
      const extras = catalogItems
        .filter((item) => {
          const name = item.name.toLowerCase();
          return !(
            name.includes('mattress') ||
            name.includes('box spring') ||
            name.includes('boxspring') ||
            name.includes('bed frame') ||
            name.includes('bedframe')
          );
        })
        .map((item) => ({
          id: item.id.startsWith('cat-') || item.id.startsWith('custom-')
            ? item.id
            : `cat-${item.id}`,
          name: item.name,
          quantity: item.quantity,
          basePriceEstimate: MATTRESS_UNIT_PRICES.extraDefault,
        }));
      return [...cores, ...extras];
    });
  };

  const extrasForCatalog = activeItems
    .filter((i) => !CORE_OPTIONS.some((opt) => opt.id === i.id))
    .map((i) => ({ id: i.id, name: i.name, quantity: i.quantity }));

  const handleContactReveal = async (name: string, phone: string, _consentAt: string | null, email?: string) => {
    setFormData(prev => ({ ...prev, name, phone, email: email || prev.email }));
    trackMattressConversion('mattress_lead');
    goTo(4);
  };

  const handleScheduleContinue = async () => {
    if (!formData.date || !formData.timeSlot) {
      setFormError('Please select a date and time slot.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid email.');
      return;
    }
    goTo(6);
  };

  const handleAddressContinue = () => {
    if (!addressValidated || !isServiceAddressValidated(formData)) {
      setAddressError('Please select your address from the suggestions list.');
      return;
    }
    goTo(7);
  };

  const handleAddressChange = (addressValue: ServiceAddressValue) => {
    setFormData((prev) => ({
      ...prev,
      address: addressValue.address,
      unitNumber: addressValue.unitNumber,
      city: addressValue.city,
      state: addressValue.state,
      zipCode: addressValue.zipCode,
    }));
    if (addressValue.zipCode) setZipCode(addressValue.zipCode);
  };

  const handleFinalSubmit = async () => {
    if (submitLoading) return;
    setSubmitLoading(true);
    setFormError(null);
    try {
      const id = await submitBooking.current({ ...formData, serviceType: 'Mattress Disposal',
        items: activeItems.map(i => `${i.quantity}x ${i.name}`), price: pricing.total,
        summary: `Mattress disposal. Subtotal $${pricing.subtotal}; online discount $${pricing.discount}.`,
        smsOptIn, termsAccepted });
      setOrderNumber(id);
      goTo(9);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to save your booking request. Please try again.');
    } finally { setSubmitLoading(false); }
  };

  return (
    <div className={FLOW_PAGE_SHELL}>
      {step < 9 && (
        <FlowChrome
          flowLabel="Mattress booking"
          stepLabel={chromeStepLabel}
          progress={progress}
          hasProgress={step > 1 || zipCode.trim().length > 0}
        />
      )}
      <div className={FLOW_PAGE_CONTENT}>
        <div ref={stepAnchorRef} className={FLOW_STEP_ANCHOR} />

        {step === 1 && (
          <FlowZipCheck
            title="Where should we pick up?"
            subtitle="Enter your ZIP to confirm coverage for mattress disposal."
            variant="card"
            image="/optimized/service-scenes/mattress-pickup.webp"
            zipValue={zipCode}
            onZipChange={(v) => {
              setZipCode(v);
              setZipError(null);
            }}
            onCheck={handleZipCheck}
            loading={zipLoading}
            error={zipError}
            result={zipResult}
          />
        )}

        {step === 2 && (
          <>
            <FlowStepTitle
              title="What are we picking up?"
              subtitle="Select mattress items, then add anything else if needed."
            />

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
              {CORE_OPTIONS.map((option) => {
                const item = selectedItems.find((i) => i.id === option.id);
                const quantity = item?.quantity ?? 0;
                const selected = quantity > 0;
                const Icon = option.icon;
                return (
                  <div
                    key={option.id}
                    className={`ui-selection-surface group relative flex flex-col border bg-[var(--surface)] transition-all ${
                      selected
                        ? 'border-brand shadow-[0_0_0_1px_rgba(82,15,150,0.12)]'
                        : 'border-[var(--border)] hover:border-[var(--border)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCoreItem(option.id)}
                      className="flex flex-col items-center flex-1 w-full p-3 text-center"
                      aria-pressed={selected}
                    >
                      <div
                        className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                          selected ? 'border-brand bg-brand' : 'border-[var(--border)] bg-[var(--surface)]'
                        }`}
                      >
                        {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 ${
                          selected ? 'bg-brand/[0.06] text-brand' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className={`text-[11px] sm:text-xs font-semibold ${selected ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                        {option.name}
                      </span>
                      <span className="hidden sm:block text-[10px] text-[var(--text-muted)] mt-0.5 leading-snug">
                        {option.desc}
                      </span>
                    </button>
                    {selected && (
                      <div className="px-3 pb-3 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-1">
                          <button
                            type="button"
                            onClick={() => setCoreQuantity(option.id, quantity - 1)}
                            aria-label={`Remove one ${option.name}`}
                            className="ui-icon-button w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]"
                          >
                            <Minus size={12} strokeWidth={2.5} />
                          </button>
                          <span className="min-w-[1.25rem] text-center text-xs font-bold tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCoreQuantity(option.id, quantity + 1)}
                            aria-label={`Add one ${option.name}`}
                            className="ui-icon-button w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]"
                          >
                            <Plus size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showExtrasCatalog ? (
              <button
                type="button"
                onClick={() => setShowExtrasCatalog(true)}
                className="w-full flex items-center gap-3 soft-surface px-4 py-3.5 text-left hover:border-[var(--border)] mb-5"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center">
                  <Package size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--text)]">Add other junk?</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Dressers, nightstands, bags, and more
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand">Browse</span>
              </button>
            ) : (
              <div className="mb-5 soft-surface p-4">
                <JunkItemCatalogSelector
                  selectedItems={extrasForCatalog}
                  onSelectedItemsChange={syncExtrasFromCatalog}
                  title="Add extra items"
                  subtitle="Anything else to haul with the mattress."
                  catalogModalTitle="Add more items"
                  emptyMessage="Optional — browse the catalog if you have extras."
                />
              </div>
            )}

            {activeItems.length > 0 && (
              <div className="soft-surface mb-4 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[var(--border)]">
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    Selected · {activeItems.reduce((s, i) => s + i.quantity, 0)}
                  </p>
                </div>
                <ul className="divide-y divide-secondary-50">
                  {activeItems.map((item) => (
                    <li key={item.id} className="flex justify-between px-4 py-2.5 text-sm">
                      <span className="font-medium text-[var(--text)]">{item.name}</span>
                      <span className="text-[var(--text-muted)] tabular-nums">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <FlowStickyNav
              showBack
              onBack={() => goTo(1)}
              continueLabel="Continue"
              continueDisabled={pricing.total <= 0}
              onContinue={() => goTo(3)}
            />
          </>
        )}

        {step === 3 && (
          <ContactIntakeForm
            bookingRequest
            title="Your contact details"
            subtitle="We will contact you to confirm your booking request."
            continueLabel="See estimate"
            serviceType="Mattress Disposal"
            isLoading={contactLoading}
            onReveal={handleContactReveal}
            onBack={() => goTo(2)}
          />
        )}

        {step === 4 && (
          <>
            <FlowStepTitle
              title="Your estimate"
              subtitle="Review your flat rate, then continue to schedule."
            />
            <div className="soft-surface p-4 mb-4">
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text)]">Mattress Disposal</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {activeItems.map((i) => `${i.quantity}× ${i.name}`).join(' · ')}
                  </p>
                </div>
                <p className="text-xl font-bold text-[var(--text)]">${pricing.total}</p>
              </div>
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Subtotal</span>
                  <span className="font-semibold text-[var(--text)]">${pricing.subtotal}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-brand">
                      {formatOnlineBookingDiscountLabel(pricing.itemCount)}
                    </span>
                    <span className="font-semibold text-brand">−${pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[var(--border)]">
                  <span className="font-semibold text-[var(--text)]">Total</span>
                  <span className="font-bold text-[var(--text)]">${pricing.total}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 leading-normal">
                  Safe Protect™ damage coverage included. {MATTRESS_ONLINE_DISCOUNT_SUMMARY}
                </p>
              </div>
            </div>
            <FlowStickyNav
              showBack
              onBack={() => goTo(3)}
              continueLabel="Continue to book"
              onContinue={() => goTo(5)}
            />
            <p className="text-xs text-[var(--text-muted)] text-center mt-2">* Final price confirmed on-site</p>
          </>
        )}

        {step === 5 && (
          <>
            <FlowStepTitle
              title="When should we come?"
              subtitle="Request an arrival window in Mountain Time (America/Denver). Our team will confirm availability."
            />
            <form
              id="mattress-schedule-form"
              onSubmit={(e) => {
                e.preventDefault();
                void handleScheduleContinue();
              }}
              className="space-y-4"
            >
              <ScheduleDatePicker
                minDate={bookingLocalNow().slice(0, 10)}
                date={formData.date}
                timeSlot={formData.timeSlot}
                onDateChange={(date) => setFormData((prev) => ({ ...prev, date }))}
                onTimeSlotChange={(timeSlot) =>
                  setFormData((prev) => ({ ...prev, timeSlot }))
                }
              />
              <div>
                <label className={FLOW_LABEL}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@email.com"
                  className={FLOW_INPUT}
                />
              </div>
              {formError && (
                <div className="ui-notice p-3 bg-brand/10 border border-brand/30">
                  <p className="text-brand text-xs font-bold">{formError}</p>
                </div>
              )}
            </form>
            <FlowStickyNav
              showBack
              onBack={() => goTo(4)}
              continueType="submit"
              continueForm="mattress-schedule-form"
              continueDisabled={!formData.date || !formData.timeSlot || !formData.email}
            />
          </>
        )}

        {step === 6 && (
          <>
            <FlowStepTitle
              title="Pickup address"
              subtitle="Where should the crew collect your mattress?"
            />
            <form
              id="mattress-address-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddressContinue();
              }}
            >
              <ServiceAddressField
                label="Service Address"
                value={{
                  address: formData.address,
                  unitNumber: formData.unitNumber,
                  city: formData.city,
                  state: formData.state,
                  zipCode: formData.zipCode,
                }}
                onChange={handleAddressChange}
                validated={addressValidated}
                onValidatedChange={setAddressValidated}
                error={addressError}
                onErrorChange={setAddressError}
                locationBias={
                  zipResult
                    ? { zipCode, city: zipResult.city, state: zipResult.state }
                    : undefined
                }
              />
            </form>
            <FlowStickyNav
              showBack
              onBack={() => goTo(5)}
              continueType="submit"
              continueForm="mattress-address-form"
              continueDisabled={!addressValidated}
            />
          </>
        )}

        {step === 7 && (
          <>
            <FlowStepTitle title="Review your booking request" subtitle="Our team will confirm availability and final pricing. No deposit is required." />
            <div className="flow-card p-4 space-y-2">
              <p>{activeItems.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
              <p>Estimate: ${pricing.total}</p>
              <p>{formData.name} · {formData.email} · {formData.phone}</p>
              <p>{[formData.address, formData.unitNumber, formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}</p>
              <p>{formData.date} · {formatTimeSlotLabel(formData.timeSlot)} · Mountain Time</p>
            </div>
            <CheckboxCard checked={smsOptIn} onChange={setSmsOptIn} disabled={submitLoading}>{BOOKING_SMS_CONSENT}</CheckboxCard>
            <CheckboxCard checked={termsAccepted} onChange={setTermsAccepted} disabled={submitLoading}>
              {BOOKING_TERMS} <a href="/terms" className="underline">Read terms</a>
            </CheckboxCard>
            {formError && <p role="alert" className="text-red-700">{formError}</p>}
            <FlowStickyNav onBack={() => { if (!submitLoading) goTo(6); }} onContinue={handleFinalSubmit}
              continueLabel="Request booking" continueLoading={submitLoading} continueDisabled={!termsAccepted} />
          </>
        )}

        {step === 9 && (
          <BookingSuccessView
            orderNumber={orderNumber}
            serviceType="Mattress Disposal"
            name={formData.name}
            phone={formData.phone}
            email={formData.email}
            address={formData.address}
            unitNumber={formData.unitNumber}
            city={formData.city}
            state={formData.state}
            zipCode={formData.zipCode || zipCode}
            date={formData.date}
            price={pricing.total}
            itemsDetected={activeItems.map((i) => `${i.quantity}x ${i.name}`)}
            requestOnly
            arrivalWindow={formatTimeSlotLabel(formData.timeSlot)}
            fullScreen={false}
          />
        )}
      </div>
    </div>
  );
};
