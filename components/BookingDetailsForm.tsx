import React, { useState, useRef, useEffect } from 'react';
import { Check, CalendarCheck, PackageCheck, MapPin, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MovingAccessType, MovingLaborOptions, QuoteEstimate } from '../types';
import { createBookingSubmitter, bookingLocalNow, BOOKING_SMS_CONSENT, BOOKING_TERMS } from '../lib/crmBooking';
import {
  toStoredMovingOptions,
} from '../lib/bookingPayloads';
import { BookingSuccessView } from './shared/BookingSuccessView';
import { ScheduleDatePicker, TimeSlot, formatTimeSlotLabel } from './shared/ScheduleDatePicker';
import {
  ServiceAddressField,
  ServiceAddressValue,
  isServiceAddressValidated,
} from './shared/ServiceAddressField';
import { FLOW_INPUT, FLOW_LABEL } from '../lib/flowPageLayout';
import { FlowStepTitle } from './shared/flow/FlowStepTitle';
import { FlowSelectionCard } from './shared/flow/FlowSelectionCard';
import { FlowStickyNav } from './shared/flow/FlowStickyNav';
import { CheckboxCard } from './shared/CheckboxCard';

const MOVING_ACCESS_CHOICES: { id: MovingAccessType; label: string }[] = [
  { id: 'ground', label: 'Ground floor / street level' },
  { id: 'elevator', label: 'Elevator available' },
  { id: 'stairs', label: 'Stairs required' },
];

const MOVING_SCOPE_LABELS: Record<MovingLaborOptions['serviceScope'], string> = {
  both: 'Load & unload',
  loading: 'Loading only',
  unloading: 'Unloading only',
  rearrange: 'In-home rearrange',
};

const SummarySection: React.FC<{
  icon: LucideIcon;
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}> = ({ icon: Icon, title, onEdit, children }) => (
  <section className="qsum-row">
    <span className="qsum-icon"><Icon size={18} aria-hidden /></span>
    <div className="qsum-body">
      <p className="qsum-title">{title}</p>
      {children}
    </div>
    {onEdit && (
      <button type="button" onClick={onEdit} className="qsum-edit" aria-label={`Edit ${title.toLowerCase()}`}>
        Edit
      </button>
    )}
  </section>
);

interface BookingDetailsFormProps {
  estimate: QuoteEstimate | null;
  image: string | null;
  images?: string[];
  serviceType: string;
  defaultZip?: { city: string; state: string; zipCode: string };
  onBack?: () => void;
  backLabel?: string;
  prefilledName?: string;
  prefilledPhone?: string;
  partialBookingId?: string | null;
  smsMarketingConsentAt?: string | null;
  depositSource?: string;
  movingOptions?: MovingLaborOptions | null;
}

type DetailStep = 'contact' | 'schedule' | 'address' | 'review';

export const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  estimate,
  serviceType,
  defaultZip,
  onBack,
  backLabel = 'Back',
  prefilledName,
  prefilledPhone,
  movingOptions = null,
}) => {
  const [step, setStep] = useState<DetailStep>('contact');
  // Set when a step is opened from the review summary's "Edit" link, so continuing returns straight to review.
  const [editingFromReview, setEditingFromReview] = useState(false);
  const advanceTo = (next: DetailStep) => {
    if (editingFromReview) {
      setEditingFromReview(false);
      setStep('review');
    } else {
      setStep(next);
    }
  };
  const editFromReview = (target: DetailStep) => {
    if (submitting) return;
    setEditingFromReview(true);
    setStep(target);
  };
  const [submitting, setSubmitting] = useState(false);
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const submitBooking = useRef(createBookingSubmitter());
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contactSubmitting = false;
  const isMovingLabor =
    serviceType.toLowerCase().includes('moving') || serviceType === 'Moving Labor';

  const movingScope = movingOptions?.serviceScope ?? 'both';
  const needsPickupAddress =
    !isMovingLabor || movingScope === 'both' || movingScope === 'loading' || movingScope === 'rearrange';
  // Unloading-only uses the primary address fields as the unload destination.
  const unloadingUsesPrimaryAddress = isMovingLabor && movingScope === 'unloading';
  const showDualMovingAddresses = isMovingLabor && movingScope === 'both';

  const [addressValidated, setAddressValidated] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressBValidated, setAddressBValidated] = useState(false);
  const [addressBError, setAddressBError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: prefilledName || '',
    email: '',
    phone: prefilledPhone || '',
    address: '',
    unitNumber: '',
    city: defaultZip?.city || '',
    state: defaultZip?.state || '',
    zipCode: defaultZip?.zipCode || '',
    addressB: '',
    unitNumberB: '',
    cityB: defaultZip?.city || '',
    stateB: defaultZip?.state || '',
    zipCodeB: defaultZip?.zipCode || '',
    pickupAccess: null as MovingAccessType | null,
    pickupFlights: null as number | null,
    dropoffAccess: null as MovingAccessType | null,
    dropoffFlights: null as number | null,
    date: '',
    timeSlot: '' as TimeSlot | '',
    details: '',
  });

  useEffect(() => {
    if (prefilledName) {
      setFormData(prev => ({ ...prev, name: prefilledName }));
    }
  }, [prefilledName]);

  useEffect(() => {
    if (prefilledPhone) {
      setFormData(prev => ({ ...prev, phone: prefilledPhone }));
    }
  }, [prefilledPhone]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleAddressChange = (addressValue: ServiceAddressValue) => {
    setFormData((prev) => ({
      ...prev,
      address: addressValue.address,
      unitNumber: addressValue.unitNumber,
      city: addressValue.city,
      state: addressValue.state,
      zipCode: addressValue.zipCode,
    }));
  };

  const handleAddressBChange = (addressValue: ServiceAddressValue) => {
    setFormData((prev) => ({
      ...prev,
      addressB: addressValue.address,
      unitNumberB: addressValue.unitNumber,
      cityB: addressValue.city,
      stateB: addressValue.state,
      zipCodeB: addressValue.zipCode,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildMovingOptionsPayload = () => {
    if (!isMovingLabor || !movingOptions) return undefined;
    if (!formData.pickupAccess) {
      return toStoredMovingOptions(movingOptions);
    }
    const dropAccess = unloadingUsesPrimaryAddress
      ? formData.pickupAccess
      : showDualMovingAddresses && addressBValidated
        ? formData.dropoffAccess
        : null;
    return toStoredMovingOptions(movingOptions, {
      pickupAccess: formData.pickupAccess,
      pickupFlights: formData.pickupFlights,
      dropoffAccess: dropAccess,
      dropoffFlights: unloadingUsesPrimaryAddress
        ? formData.pickupFlights
        : addressBValidated
          ? formData.dropoffFlights
          : null,
    });
  };

  const formatAccessLabel = (access: MovingAccessType | null, flights: number | null) => {
    if (!access) return '—';
    if (access === 'stairs') {
      const n = flights ?? 1;
      return `Stairs (${n === 4 ? '4+' : n} flight${n === 1 ? '' : 's'})`;
    }
    if (access === 'elevator') return 'Elevator';
    return 'Ground floor';
  };

  const pickupAccessComplete =
    !isMovingLabor ||
    Boolean(
      formData.pickupAccess &&
      (formData.pickupAccess !== 'stairs' || formData.pickupFlights !== null)
    );
  const hasOptionalDropoff = showDualMovingAddresses && Boolean(formData.addressB.trim());
  const dropoffAccessComplete = Boolean(
    formData.dropoffAccess &&
    (formData.dropoffAccess !== 'stairs' || formData.dropoffFlights !== null)
  );
  const accessSelectionComplete =
    pickupAccessComplete &&
    (!hasOptionalDropoff || (addressBValidated && dropoffAccessComplete));

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    advanceTo('schedule');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.timeSlot) {
      setError('Please select a date and time slot.');
      return;
    }
    setError(null);
    advanceTo('address');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (needsPickupAddress || unloadingUsesPrimaryAddress) {
      if (!addressValidated || !isServiceAddressValidated(formData)) {
        setAddressError('Please select your address from the suggestions list.');
        return;
      }
    }

    if (hasOptionalDropoff) {
      if (!addressBValidated || !isServiceAddressValidated({
        address: formData.addressB,
        unitNumber: formData.unitNumberB,
        city: formData.cityB,
        state: formData.stateB,
        zipCode: formData.zipCodeB,
      })) {
        setAddressBError('Please select the drop-off address from the suggestions list, or leave it blank.');
        return;
      }
    }

    if (isMovingLabor && !accessSelectionComplete) {
      setError('Please select access details for each location.');
      return;
    }

    setAddressError(null);
    setAddressBError(null);
    setError(null);
    advanceTo('review');
  };

  const handleBackStep = () => {
    if (submitting) return;
    if (editingFromReview) { setEditingFromReview(false); setStep('review'); }
    else if (step === 'review') setStep('address');
    else if (step === 'address') setStep('schedule');
    else if (step === 'schedule') setStep('contact');
    else onBack?.();
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const moving = buildMovingOptionsPayload();
      const dropoffAddress = showDualMovingAddresses && addressBValidated
        ? [formData.addressB, formData.unitNumberB, formData.cityB, formData.stateB, formData.zipCodeB].filter(Boolean).join(', ') : '';
      const id = await submitBooking.current({
        ...formData, serviceType, items: estimate?.itemsDetected?.length ? estimate.itemsDetected : [serviceType],
        price: estimate?.price ?? 0, summary: estimate?.summary, volume: estimate?.estimatedVolume,
        dropoffAddress, movingDetails: moving ? JSON.stringify(moving) : '', notes: formData.details,
        smsOptIn, termsAccepted,
      });
      setOrderNumber(id);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your booking request. Please try again.');
    } finally { setSubmitting(false); }
  };

  // ── Success screen ──
  if (submitted) {
    const normalizedServiceType = serviceType
      ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
        : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
        : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
        : 'Junk Removal')
      : 'Junk Removal';

    return (
      <BookingSuccessView
        orderNumber={orderNumber}
        serviceType={isMovingLabor ? 'Local Moving' : normalizedServiceType}
        name={formData.name}
        phone={formData.phone}
        email={formData.email}
        address={formData.address}
        unitNumber={formData.unitNumber}
        city={formData.city}
        state={formData.state}
        zipCode={formData.zipCode}
        addressB={showDualMovingAddresses ? formData.addressB : undefined}
        unitNumberB={showDualMovingAddresses ? formData.unitNumberB : undefined}
        cityB={showDualMovingAddresses ? formData.cityB : undefined}
        stateB={showDualMovingAddresses ? formData.stateB : undefined}
        zipCodeB={showDualMovingAddresses ? formData.zipCodeB : undefined}
        date={formData.date}
        details={formData.details}
        price={estimate?.price}
        itemsDetected={estimate?.itemsDetected}
        estimatedVolume={estimate?.estimatedVolume}
        requestOnly
        arrivalWindow={formatTimeSlotLabel(formData.timeSlot)}
      />
    );
  }

  return (
    <div className={`max-w-lg mx-auto space-y-6 pb-28 animate-fade-in`}>

      {/* ─── Contact step ─── */}
      {step === 'contact' && (
        <>
        <form id="booking-contact-form" onSubmit={handleContactSubmit} className="space-y-4">
          <FlowStepTitle title="Your contact details" subtitle="How should we reach you to confirm?" />

          <div>
            <label className={FLOW_LABEL}>Full name *</label>
            <input aria-label="Full name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={contactSubmitting}
                placeholder="John Smith"
                className={FLOW_INPUT}
              />
          </div>

          <div>
            <label className={FLOW_LABEL}>Email *</label>
            <input aria-label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={contactSubmitting}
                type="email"
                placeholder="john@example.com"
                className={FLOW_INPUT}
              />
          </div>

          <div>
            <label className={FLOW_LABEL}>Phone *</label>
            <input aria-label="Phone"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={contactSubmitting}
                type="tel"
                placeholder="(555) 123-4567"
                className={FLOW_INPUT}
              />
            <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
              Booking texts are optional. We will contact you to confirm availability.
            </p>
          </div>

          <CheckboxCard checked={smsOptIn} onChange={(checked) => {
                  setSmsOptIn(checked);
                }} disabled={contactSubmitting}>
            {BOOKING_SMS_CONSENT}
          </CheckboxCard>

          {error && (
            <div className="ui-notice p-3 bg-brand/10 border border-brand/30 rounded-xl">
              <p className="text-brand text-xs font-bold">{error}</p>
            </div>
          )}
        </form>
        <FlowStickyNav
          onBack={handleBackStep}
          backLabel={onBack ? backLabel : 'Back'}
          continueType="submit"
          continueForm="booking-contact-form"
          continueDisabled={contactSubmitting}
          continueLoading={contactSubmitting}
        />
        </>
      )}

      {/* ─── Schedule step ─── */}
      {step === 'schedule' && (
        <>
        <form id="booking-schedule-form" onSubmit={handleScheduleSubmit} className="space-y-4">
          <FlowStepTitle title="Pick a date & time" subtitle="Request an arrival window in Mountain Time (America/Denver). Our team will confirm availability." />

          <ScheduleDatePicker
            date={formData.date}
            timeSlot={formData.timeSlot}
            minDate={bookingLocalNow().slice(0, 10)}
            onDateChange={(nextDate) => setFormData((prev) => ({ ...prev, date: nextDate }))}
            onTimeSlotChange={(nextSlot) => setFormData((prev) => ({ ...prev, timeSlot: nextSlot }))}
          />

          {error && (
            <div className="ui-notice p-3 bg-brand/10 border border-brand/30 rounded-xl">
              <p className="text-brand text-xs font-bold">{error}</p>
            </div>
          )}
        </form>
        <FlowStickyNav
          onBack={handleBackStep}
          continueType="submit"
          continueForm="booking-schedule-form"
          continueDisabled={!formData.date || !formData.timeSlot}
        />
        </>
      )}

      {/* ─── Address step ─── */}
      {step === 'address' && (
        <>
        <form id="booking-address-form" onSubmit={handleAddressSubmit}>
          <FlowStepTitle
            title={
              isMovingLabor && movingScope === 'rearrange' ? 'Service address'
              : isMovingLabor && movingScope === 'unloading' ? 'Unload address'
              : 'Pickup address'
            }
            subtitle={
              isMovingLabor
                ? movingScope === 'rearrange'
                  ? 'Where should the crew meet you?'
                  : movingScope === 'loading'
                    ? 'Where should the crew load from?'
                    : movingScope === 'unloading'
                      ? 'Where should the crew unload?'
                      : 'Start with the pickup location. You can add a drop-off if needed.'
                : 'Where should the provider come to collect your items?'
            }
          />

          {(needsPickupAddress || unloadingUsesPrimaryAddress) && (
            <>
              {isMovingLabor && (
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                  {unloadingUsesPrimaryAddress ? 'Unload location' : movingScope === 'rearrange' ? 'Address' : 'Pickup location'}
                </p>
              )}
              <ServiceAddressField
                showLabel={false}
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
                  defaultZip
                    ? {
                        zipCode: defaultZip.zipCode,
                        city: defaultZip.city,
                        state: defaultZip.state,
                      }
                    : undefined
                }
              />

              {isMovingLabor && addressValidated && (
                <div className="ui-panel mt-3 mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-none">
                  <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                    {unloadingUsesPrimaryAddress ? 'Access at unload' : 'Access at this location'}
                  </p>
                  <div className="space-y-2">
                    {MOVING_ACCESS_CHOICES.map((choice) => {
                      const selected = formData.pickupAccess === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              pickupAccess: choice.id,
                              pickupFlights: choice.id === 'stairs' ? prev.pickupFlights : null,
                            }))
                          }
                          className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-all flex items-center gap-2.5 ${
                            selected
                              ? 'border-brand bg-brand/5 font-semibold text-brand'
                              : 'border-[var(--border)] text-[var(--text)] hover:border-brand/40'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              selected ? 'border-brand bg-brand' : 'border-[var(--border)] bg-[var(--surface)]'
                            }`}
                          >
                            {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                  {formData.pickupAccess === 'stairs' && (
                    <div className="mt-3">
                      <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-2">Flights of stairs</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map((n) => {
                          const selected = formData.pickupFlights === n;
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, pickupFlights: n }))}
                              className={`flex-1 rounded-lg border py-2 text-sm font-semibold inline-flex items-center justify-center gap-1 ${
                                selected
                                  ? 'border-brand bg-brand/5 text-brand'
                                  : 'border-[var(--border)] text-[var(--text)]'
                              }`}
                            >
                              {selected && <Check size={14} strokeWidth={3} />}
                              {n === 4 ? '4+' : n}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {showDualMovingAddresses && pickupAccessComplete && (
            <div className="mt-4 animate-fade-in">
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Drop-off location <span className="font-normal text-[var(--text-muted)]">(optional)</span></p>
              <ServiceAddressField
                showLabel={false}
                label="Drop-off Address"
                value={{
                  address: formData.addressB,
                  unitNumber: formData.unitNumberB,
                  city: formData.cityB,
                  state: formData.stateB,
                  zipCode: formData.zipCodeB,
                }}
                onChange={handleAddressBChange}
                validated={addressBValidated}
                onValidatedChange={setAddressBValidated}
                error={addressBError}
                onErrorChange={setAddressBError}
                locationBias={
                  defaultZip
                    ? {
                        zipCode: defaultZip.zipCode,
                        city: defaultZip.city,
                        state: defaultZip.state,
                      }
                    : undefined
                }
              />

              {addressBValidated && (
              <div className="ui-panel mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-fade-in">
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Access at drop-off</p>
                <div className="space-y-2">
                  {MOVING_ACCESS_CHOICES.map((choice) => {
                    const selected = formData.dropoffAccess === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            dropoffAccess: choice.id,
                            dropoffFlights: choice.id === 'stairs' ? prev.dropoffFlights : null,
                          }))
                        }
                        className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-all flex items-center gap-2.5 ${
                          selected
                            ? 'border-brand bg-brand/5 font-semibold text-brand'
                            : 'border-[var(--border)] text-[var(--text)] hover:border-brand/40'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selected ? 'border-brand bg-brand' : 'border-[var(--border)] bg-[var(--surface)]'
                          }`}
                        >
                          {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
                {formData.dropoffAccess === 'stairs' && (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-2">Flights of stairs</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((n) => {
                        const selected = formData.dropoffFlights === n;
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, dropoffFlights: n }))}
                            className={`flex-1 rounded-lg border py-2 text-sm font-semibold inline-flex items-center justify-center gap-1 ${
                              selected
                                ? 'border-brand bg-brand/5 text-brand'
                                : 'border-[var(--border)] text-[var(--text)]'
                            }`}
                          >
                            {selected && <Check size={14} strokeWidth={3} />}
                            {n === 4 ? '4+' : n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          )}
        </form>
        {error && step === 'address' && (
          <div className="ui-notice mt-3 p-3 bg-brand/10 border border-brand/30 rounded-xl">
            <p className="text-brand text-xs font-bold">{error}</p>
          </div>
        )}
        <FlowStickyNav
          onBack={handleBackStep}
          continueType="submit"
          continueForm="booking-address-form"
          continueDisabled={!addressValidated || !accessSelectionComplete}
        />
        </>
      )}

      {step === 'review' && (
        <>
        <form id="booking-review-form" onSubmit={handleReviewSubmit} className="space-y-4">
          <FlowStepTitle title="Review your booking" subtitle="Send your request with no payment today. Our team will confirm availability and the final price." />

          {estimate && (
            <div className="qsum-price">
              <div>
                <p className="qsum-price-label">Estimated total</p>
                <p className="qsum-price-service">{isMovingLabor ? 'Local Moving' : serviceType}</p>
              </div>
              <p className="qsum-price-value">${estimate.price}</p>
            </div>
          )}

          <div className="qsum">
            <SummarySection icon={CalendarCheck} title="When" onEdit={() => editFromReview('schedule')}>
              <p className="qsum-main">
                {formData.date
                  ? new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'No date picked'}
              </p>
              {formData.timeSlot && <p className="qsum-sub">Arrival window (Mountain Time): {formatTimeSlotLabel(formData.timeSlot)}</p>}
            </SummarySection>

            <SummarySection
              icon={MapPin}
              title={unloadingUsesPrimaryAddress ? 'Unload' : isMovingLabor && movingScope === 'rearrange' ? 'Address' : 'Pickup'}
              onEdit={() => editFromReview('address')}
            >
              <p className="qsum-main">{formData.address}{formData.unitNumber ? `, ${formData.unitNumber}` : ''}</p>
              <p className="qsum-sub">{[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}</p>
              {isMovingLabor && (
                <p className="qsum-sub">Access: {formatAccessLabel(formData.pickupAccess, formData.pickupFlights)}</p>
              )}
              {showDualMovingAddresses && formData.addressB && (
                <div className="qsum-extra">
                  <p className="qsum-kicker">Drop-off</p>
                  <p className="qsum-main">{formData.addressB}{formData.unitNumberB ? `, ${formData.unitNumberB}` : ''}</p>
                  <p className="qsum-sub">{[formData.cityB, formData.stateB, formData.zipCodeB].filter(Boolean).join(', ')}</p>
                  <p className="qsum-sub">Access: {formatAccessLabel(formData.dropoffAccess, formData.dropoffFlights)}</p>
                </div>
              )}
            </SummarySection>

            {movingOptions && (
              <SummarySection icon={PackageCheck} title="Your move">
                <p className="qsum-main">{MOVING_SCOPE_LABELS[movingOptions.serviceScope]}</p>
                <p className="qsum-sub">
                  {movingOptions.homeSize === 'studio' ? 'Studio' : movingOptions.homeSize === '1bed' ? '1-Bedroom' : movingOptions.homeSize === '2bed' ? '2-Bedroom' : '3+ Bedrooms'}
                  {movingOptions.needsTruck ? ' · $99 truck' : ''}
                </p>
                {(movingOptions.heavyItems.length > 0 || movingOptions.needsPackingHelp || movingOptions.needsDisassembly) && (
                  <p className="qsum-sub">
                    {[
                      movingOptions.heavyItems.length ? `${movingOptions.heavyItems.length} heavy item(s)` : null,
                      movingOptions.needsPackingHelp ? 'Packing help' : null,
                      movingOptions.needsDisassembly ? 'Disassembly' : null,
                    ].filter(Boolean).join(' · ')}
                  </p>
                )}
              </SummarySection>
            )}



            <SummarySection icon={User} title="Contact" onEdit={() => editFromReview('contact')}>
              <p className="qsum-main">{formData.name}</p>
              <p className="qsum-sub">{formData.phone}</p>
              <p className="qsum-sub qsum-break">{formData.email}</p>
            </SummarySection>
          </div>

          <div>
            <label htmlFor="booking-details" className={FLOW_LABEL}>
              Notes for your provider <span className="font-normal text-[var(--text-muted)]">(optional)</span>
            </label>
            <textarea
              id="booking-details"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows={3}
              maxLength={2000}
              disabled={submitting}
              placeholder={isMovingLabor ? 'Fragile items, parking, gate codes…' : 'Where the items are, parking, gate codes…'}
              className={FLOW_INPUT}
            />
          </div>
          <CheckboxCard checked={termsAccepted} onChange={setTermsAccepted} disabled={submitting}>
            {BOOKING_TERMS} <a href="/terms" className="underline">Read terms</a>
          </CheckboxCard>
          {error && (
            <div className="ui-notice p-3 bg-brand/10 border border-brand/30 rounded-xl">
              <p className="text-brand text-xs font-bold">{error}</p>
            </div>
          )}

        </form>
        <FlowStickyNav onBack={handleBackStep} continueType="submit" continueForm="booking-review-form" continueLabel="Request booking" continueLoading={submitting} continueDisabled={!termsAccepted} />
        </>
      )}

    </div>
  );
};
