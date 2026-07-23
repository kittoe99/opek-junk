import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Loader2, CalendarCheck, PackageCheck, ClipboardList, MapPin, User, Mail, Phone, Building2, MessageSquare, Map, Trash2, Calendar as CalendarIcon, MapPin as MapPinIcon, Image as ImageIcon, Camera, Upload, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MovingAccessType, MovingLaborOptions, QuoteEstimate } from '../types';
import { supabase } from '../lib/supabase';
import { persistBookingPhotos, withBookingPhotos } from '../lib/bookingPhotos';
import { withSmsMarketingConsent, SMS_MARKETING_CONSENT_TEXT, SMS_TRANSACTIONAL_NOTICE } from '../lib/customerConsent';
import {
  buildLocationInfoPayload,
  toStoredMovingOptions,
} from '../lib/bookingPayloads';
import { BookingSuccessView } from './shared/BookingSuccessView';
import { BookingDepositPayment, BOOKING_DEPOSIT_AMOUNT } from './shared/BookingDepositPayment';
import { BookingDepositIntro } from './shared/BookingDepositIntro';
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

type DetailStep = 'contact' | 'schedule' | 'address' | 'photo' | 'review' | 'deposit' | 'payment';

export const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  estimate,
  image,
  images,
  serviceType,
  defaultZip,
  onBack,
  backLabel = 'Back',
  prefilledName,
  prefilledPhone,
  partialBookingId,
  smsMarketingConsentAt,
  depositSource = 'booking',
  movingOptions = null,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DetailStep>('contact');
  const [submitting, setSubmitting] = useState(false);
  const [localSmsMarketingConsentAt, setLocalSmsMarketingConsentAt] = useState<string | null>(
    smsMarketingConsentAt ?? null
  );
  const [localImage, setLocalImage] = useState<string | null>(image);
  const estimateImages = images?.length ? images : image ? [image] : [];
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPhotosForPersistence = () => {
    if (localImage) {
      return [localImage, ...estimateImages.filter((img) => img !== localImage)];
    }
    return estimateImages;
  };

  useEffect(() => {
    setLocalImage(image);
  }, [image]);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setLocalImage(compressedImage);
        setError(null);
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }
  };
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [partialId, setPartialId] = useState<string | null>(partialBookingId || null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    if (partialBookingId) {
      setPartialId(partialBookingId);
    }
  }, [partialBookingId]);

  useEffect(() => {
    if (smsMarketingConsentAt) {
      setLocalSmsMarketingConsentAt(smsMarketingConsentAt);
    }
  }, [smsMarketingConsentAt]);

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

  const isJunkRemoval =
    serviceType.toLowerCase().includes('junk') || serviceType === 'Junk Removal';

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const detailsText = estimate
        ? `Items: ${estimate.itemsDetected.join(', ')}\nEstimated Items: ${estimate.estimatedVolume}\nEstimated Price: $${estimate.price}${formData.details ? '\n\nNotes: ' + formData.details : ''}`
        : formData.details;

      const normalizedServiceType = serviceType
        ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
          : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
          : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
          : 'Junk Removal')
        : 'Junk Removal';

      let currentPartialId = partialId;

      const photos = await persistBookingPhotos(
        getPhotosForPersistence(),
        `lead_${Date.now()}`
      );
      if (photos.photo_url && photos.photo_url !== localImage) {
        setLocalImage(photos.photo_url);
      }

      const customerInfo = withSmsMarketingConsent(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        localSmsMarketingConsentAt
      );

      const bookingDetails = withBookingPhotos(
        {
          service_type: normalizedServiceType,
          zip_code: defaultZip?.zipCode || formData.zipCode || null,
          details: detailsText,
          estimated_items: estimate?.itemsDetected || [],
          estimated_volume: estimate?.estimatedVolume || '',
          price: estimate?.price || 0,
          estimate_summary: estimate?.summary || '',
          ...(isMovingLabor ? { moving_options: buildMovingOptionsPayload() } : {}),
        },
        photos
      );

      if (currentPartialId && !currentPartialId.startsWith('mock-')) {
        await supabase.rpc('update_prebooking', {
          p_id: currentPartialId,
          p_customer_info: customerInfo,
          p_booking_details: bookingDetails,
          p_status: 'partially_submitted'
        });
      } else {
        const { data, error: dbError } = await supabase.rpc('create_prebooking', {
          p_customer_info: customerInfo,
          p_booking_details: bookingDetails,
          p_status: 'partially_submitted'
        });

        if (!dbError && data) {
          currentPartialId = data as string;
          setPartialId(data as string);
        }
      }
    } catch (err) {
      console.warn('Failed to save partial booking lead on contact step:', err);
    } finally {
      setContactSubmitting(false);
      setStep('schedule');
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.timeSlot) {
      setError('Please select a date and time slot.');
      return;
    }
    setError(null);
    setStep('address');
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
    setStep(isJunkRemoval ? 'photo' : 'review');
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localImage) {
      setError('Please upload or capture a photo of the items to be hauled away.');
      return;
    }
    setError(null);

    try {
      const photos = await persistBookingPhotos(
        getPhotosForPersistence(),
        `prebooking_${partialId || Date.now()}`
      );
      if (photos.photo_url) {
        setLocalImage(photos.photo_url);
      }

      if (partialId && !partialId.startsWith('mock-')) {
        const detailsText = estimate
          ? `Items: ${estimate.itemsDetected.join(', ')}\nEstimated Items: ${estimate.estimatedVolume}\nEstimated Price: $${estimate.price}${formData.details ? '\n\nNotes: ' + formData.details : ''}`
          : formData.details;

        const normalizedServiceType = serviceType
          ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
            : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
            : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
            : 'Junk Removal')
          : 'Junk Removal';

        await supabase.rpc('update_prebooking', {
          p_id: partialId,
          p_booking_details: withBookingPhotos(
            {
              service_type: normalizedServiceType,
              zip_code: defaultZip?.zipCode || formData.zipCode || null,
              details: detailsText,
              estimated_items: estimate?.itemsDetected || [],
              estimated_volume: estimate?.estimatedVolume || '',
              price: estimate?.price || 0,
              estimate_summary: estimate?.summary || '',
              ...(isMovingLabor ? { moving_options: buildMovingOptionsPayload() } : {}),
            },
            photos
          ),
        });
      }
    } catch (err) {
      console.warn('Failed to persist booking photo on photo step:', err);
      setError('We could not save your photo. Please try uploading again.');
      return;
    }

    setStep('review');
  };

  const handleBackStep = () => {
    if (step === 'payment') setStep('deposit');
    else if (step === 'deposit') setStep('review');
    else if (step === 'review') setStep(isJunkRemoval ? 'photo' : 'address');
    else if (step === 'photo') setStep('address');
    else if (step === 'address') setStep('schedule');
    else if (step === 'schedule') setStep('contact');
    else if (onBack) onBack();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('deposit');
  };

  const handleSubmit = async (paymentIntentId: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const detailsText = estimate
        ? `Items: ${estimate.itemsDetected.join(', ')}\nEstimated Items: ${estimate.estimatedVolume}\nEstimated Price: $${estimate.price}${formData.details ? '\n\nNotes: ' + formData.details : ''}`
        : formData.details;

      const normalizedServiceType = serviceType
        ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
          : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
          : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
          : 'Junk Removal')
        : 'Junk Removal';

      const generatedOrderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      let resultData = null;
      let dbError = null;

      try {
          const photos = await persistBookingPhotos(
            getPhotosForPersistence(),
            `booking_${generatedOrderNumber}`
          );
          if (photos.photo_url) {
            setLocalImage(photos.photo_url);
          }

          if (isJunkRemoval && !photos.photo_url) {
            throw new Error('A photo of your items is required to complete booking.');
          }

          const customerInfo = withSmsMarketingConsent(
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
            localSmsMarketingConsentAt
          );

          const locationInfo = buildLocationInfoPayload(
            {
              address: formData.address,
              unitNumber: formData.unitNumber,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              pickupAccess: formData.pickupAccess,
              pickupFlights: formData.pickupFlights,
              addressB: formData.addressB,
              unitNumberB: formData.unitNumberB,
              cityB: formData.cityB,
              stateB: formData.stateB,
              zipCodeB: formData.zipCodeB,
              dropoffAccess: formData.dropoffAccess,
              dropoffFlights: formData.dropoffFlights,
              includeDropoff: showDualMovingAddresses && addressBValidated,
            },
            { isMoving: isMovingLabor }
          );

          const movingOptionsPayload = buildMovingOptionsPayload();

          const bookingDetails = withBookingPhotos(
            {
              service_type: normalizedServiceType,
              preferred_date: formData.date,
              preferred_time: formatTimeSlotLabel(formData.timeSlot),
              details: detailsText,
              estimated_items: estimate?.itemsDetected || [],
              estimated_volume: estimate?.estimatedVolume || '',
              price: estimate?.price || 0,
              estimate_summary: estimate?.summary || '',
              subtotal: estimate?.subtotal ?? estimate?.price ?? 0,
              online_booking_discount: estimate?.onlineBookingDiscount ?? null,
              deposit_amount: BOOKING_DEPOSIT_AMOUNT,
              deposit_paid: true,
              stripe_payment_intent_id: paymentIntentId,
              terms_accepted_at: new Date().toISOString(),
              ...(movingOptionsPayload ? { moving_options: movingOptionsPayload } : {}),
            },
            photos
          );

          const res = await supabase
            .from('bookings')
            .insert([
              {
                order_number: generatedOrderNumber,
                customer_info: customerInfo,
                location_info: locationInfo,
                booking_details: bookingDetails,
                status: 'pending'
              }
            ]);
          resultData = res.data;
          dbError = res.error;
          
          if (dbError) {
            console.warn('Supabase returned error:', dbError);
          }

          if (!dbError && partialId && !partialId.startsWith('mock-')) {
            supabase
              .rpc('update_prebooking', {
                p_id: partialId,
                p_customer_info: customerInfo,
                p_booking_details: bookingDetails,
                p_status: 'converted',
              })
              .then(({ error: updateErr }) => {
                if (updateErr) {
                  console.warn('Failed to mark prebooking as converted:', updateErr);
                }
              });
          }
        } catch (err) {
          console.warn('Supabase insert/update failed, falling back to mock submission:', err);
        }
  
        const finalOrderNumber = generatedOrderNumber;

        // Confirmation + admin emails are sent automatically by the
        // send_notification_on_insert trigger on public.bookings. The
        // deposit payment receipt is sent separately by the payments trigger.
        setOrderNumber(finalOrderNumber);
        setSubmitted(true);
      } catch (err: any) {
        console.error('Error submitting booking:', err);
        setSubmitting(false);
        throw new Error(err.message || 'Failed to submit booking. Please try again.');
      }
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
      />
    );
  }

  // Step labels for indicator
  const stepLabels = isJunkRemoval
    ? ['Contact', 'Schedule', 'Address', 'Photo', 'Review', 'Deposit', 'Payment']
    : ['Contact', 'Schedule', 'Address', 'Review', 'Deposit', 'Payment'];
  const stepIndex =
    step === 'contact' ? 0
    : step === 'schedule' ? 1
    : step === 'address' ? 2
    : step === 'photo' ? 3
    : step === 'review' ? (isJunkRemoval ? 4 : 3)
    : step === 'deposit' ? (isJunkRemoval ? 5 : 4)
    : isJunkRemoval ? 6 : 5;

  return (
    <div className={`max-w-lg mx-auto space-y-6 pb-28${step === 'payment' ? '' : ' animate-fade-in'}`}>

      {/* ─── Contact step ─── */}
      {step === 'contact' && (
        <>
        <form id="booking-contact-form" onSubmit={handleContactSubmit} className="space-y-4">
          <FlowStepTitle title="Your contact details" subtitle="How should we reach you to confirm?" />

          <div>
            <label className={FLOW_LABEL}>Full name *</label>
            <input
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
            <input
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
            <input
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
            <p className="mt-1.5 text-xs text-secondary-400 leading-relaxed">
              {SMS_TRANSACTIONAL_NOTICE}
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 bg-white border border-secondary-200 rounded-xl cursor-pointer hover:border-secondary-300 transition-colors">
            <div className="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={Boolean(localSmsMarketingConsentAt)}
                onChange={(e) => {
                  setLocalSmsMarketingConsentAt(e.target.checked ? new Date().toISOString() : null);
                }}
                disabled={contactSubmitting}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  localSmsMarketingConsentAt ? 'bg-brand border-brand' : 'bg-white border-secondary-300'
                }`}
              >
                {localSmsMarketingConsentAt && <Check size={12} className="text-white" strokeWidth={3.5} />}
              </div>
            </div>
            <span className="text-xs text-secondary-500 leading-relaxed">
              {SMS_MARKETING_CONSENT_TEXT}
            </span>
          </label>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-xs font-bold">{error}</p>
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
          <FlowStepTitle title="Pick a date & time" subtitle="When works best for your service?" />

          <ScheduleDatePicker
            date={formData.date}
            timeSlot={formData.timeSlot}
            minDate={new Date().toISOString().split('T')[0]}
            onDateChange={(nextDate) => setFormData((prev) => ({ ...prev, date: nextDate }))}
            onTimeSlotChange={(nextSlot) => setFormData((prev) => ({ ...prev, timeSlot: nextSlot }))}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-xs font-bold">{error}</p>
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
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-secondary tracking-tight leading-snug">
              {isMovingLabor
                ? movingScope === 'rearrange'
                  ? 'Service address'
                  : movingScope === 'loading'
                    ? 'Pickup address'
                    : movingScope === 'unloading'
                      ? 'Unload address'
                      : 'Pickup address'
                : 'Pickup address'}
            </h1>
            <p className="text-sm text-secondary-500 mt-2 leading-relaxed">
              {isMovingLabor
                ? movingScope === 'rearrange'
                  ? 'Where should the crew meet you?'
                  : movingScope === 'loading'
                    ? 'Where should the crew load from?'
                    : movingScope === 'unloading'
                      ? 'Where should the crew unload?'
                      : 'Start with the pickup location. You can add a drop-off if needed.'
                : 'Where should the provider come to collect?'}
            </p>
          </div>

          {(needsPickupAddress || unloadingUsesPrimaryAddress) && (
            <>
              <p className="text-xs font-semibold text-secondary-500 mb-2">
                {unloadingUsesPrimaryAddress
                  ? 'Unload location'
                  : movingScope === 'rearrange'
                    ? 'Address'
                    : isMovingLabor
                      ? 'Pickup location'
                      : 'Address'}
              </p>
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
                <div className="mt-3 mb-4 rounded-xl border border-secondary-100 bg-white p-4 shadow-[0_2px_8px_rgba(53,80,112,0.06)]">
                  <p className="text-xs font-semibold text-secondary-500 mb-2">
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
                              : 'border-secondary-100 text-secondary hover:border-brand/40'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              selected ? 'border-brand bg-brand' : 'border-secondary-200 bg-white'
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
                      <p className="text-[11px] font-semibold text-secondary-400 mb-2">Flights of stairs</p>
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
                                  : 'border-secondary-100 text-secondary'
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
              <p className="text-xs font-semibold text-secondary-500 mb-2">Drop-off location <span className="font-normal text-secondary-400">(optional)</span></p>
              <ServiceAddressField
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
              <div className="mt-3 rounded-xl border border-secondary-100 bg-white p-4 animate-fade-in">
                <p className="text-xs font-semibold text-secondary-500 mb-2">Access at drop-off</p>
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
                            : 'border-secondary-100 text-secondary hover:border-brand/40'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selected ? 'border-brand bg-brand' : 'border-secondary-200 bg-white'
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
                    <p className="text-[11px] font-semibold text-secondary-400 mb-2">Flights of stairs</p>
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
                                : 'border-secondary-100 text-secondary'
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
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-xs font-bold">{error}</p>
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

      {/* ─── Photo step (junk removal only) ─── */}
      {step === 'photo' && (
        <>
        <form id="booking-photo-form" onSubmit={handlePhotoSubmit} className="space-y-4">
          <FlowStepTitle
            title="Photo of items"
            subtitle="Upload a photo so we can assess the load and match the right crew."
          />

          <div className="space-y-3">
            {localImage ? (
              <div className="relative border border-secondary-200 bg-white p-3 rounded-xl flex items-center gap-4">
                <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden border border-secondary-100 bg-secondary-50">
                  <img src={localImage} alt="Items preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary">Photo uploaded</p>
                  <p className="text-xs text-secondary-500 mt-0.5">Used to verify volume and service details.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalImage(null)}
                  className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg transition-colors shrink-0"
                  aria-label="Remove photo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <FlowSelectionCard
                  title="Take photo"
                  description="Use your camera to capture the items"
                  icon={<Camera className="w-full h-full" />}
                  onClick={() => cameraInputRef.current?.click()}
                />
                <FlowSelectionCard
                  title="Upload photo"
                  description="Choose an existing photo from your device"
                  icon={<Upload className="w-full h-full" />}
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
            )}

            <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-xs font-bold">{error}</p>
            </div>
          )}

        </form>
        <FlowStickyNav
          onBack={handleBackStep}
          continueType="submit"
          continueForm="booking-photo-form"
          continueDisabled={!localImage}
        />
        </>
      )}

      {/* ─── Review step ─── */}
      {step === 'review' && (
        <>
        <form id="booking-review-form" onSubmit={handleReviewSubmit} className="space-y-4">
          <FlowStepTitle title="Review your booking" subtitle="Confirm details before your deposit." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={FLOW_LABEL}>Service type</label>
              <input
                readOnly
                value={serviceType}
                className={`${FLOW_INPUT} bg-secondary-50`}
              />
            </div>
            <div>
              <label className={FLOW_LABEL}>Preferred date</label>
              <input
                readOnly
                value={
                  formData.date
                    ? `${new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}${formData.timeSlot ? ` · ${formatTimeSlotLabel(formData.timeSlot)}` : ''}`
                    : ''
                }
                className={`${FLOW_INPUT} bg-secondary-50`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details</label>
            <div className="relative group">
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={3}
                placeholder={isMovingLabor ? "Tell the crew about fragile items, parking, gate codes, etc." : "Tell the service provider about the items needing removal, access instructions, etc."}
                className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors"
              />
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white rounded-xl border border-secondary-100 p-4 space-y-3 shadow-[0_2px_8px_rgba(53,80,112,0.06)]">
            <div className="flex items-center justify-between border-b border-secondary-100 pb-3">
              <p className="text-xs font-semibold text-secondary-500">Summary</p>
              {estimate && <p className="text-lg font-bold text-secondary">${estimate.price}</p>}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-secondary-400">Name</span><span className="font-semibold text-secondary text-right">{formData.name}</span></div>
              <div className="flex justify-between"><span className="text-secondary-400">Email</span><span className="font-semibold text-secondary text-right">{formData.email}</span></div>
              <div className="flex justify-between"><span className="text-secondary-400">Phone</span><span className="font-semibold text-secondary text-right">{formData.phone}</span></div>
              <div className="flex justify-between gap-4">
                <span className="text-secondary-400 shrink-0">
                  {unloadingUsesPrimaryAddress ? 'Unload' : isMovingLabor && movingScope === 'rearrange' ? 'Address' : 'Pickup'}
                </span>
                <span className="font-semibold text-secondary text-right max-w-[60%]">
                  {formData.address}{formData.unitNumber ? `, ${formData.unitNumber}` : ''}{formData.city ? `, ${[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}` : ''}
                </span>
              </div>
              {isMovingLabor && (
                <div className="flex justify-between">
                  <span className="text-secondary-400">
                    {unloadingUsesPrimaryAddress ? 'Unload access' : 'Pickup access'}
                  </span>
                  <span className="font-semibold text-secondary text-right">
                    {formatAccessLabel(formData.pickupAccess, formData.pickupFlights)}
                  </span>
                </div>
              )}
              {showDualMovingAddresses && formData.addressB && (
                <>
                  <div className="flex justify-between gap-4">
                    <span className="text-secondary-400 shrink-0">Drop-off</span>
                    <span className="font-semibold text-secondary text-right max-w-[60%]">
                      {formData.addressB}{formData.unitNumberB ? `, ${formData.unitNumberB}` : ''}{formData.cityB ? `, ${[formData.cityB, formData.stateB, formData.zipCodeB].filter(Boolean).join(', ')}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Drop-off access</span>
                    <span className="font-semibold text-secondary text-right">
                      {formatAccessLabel(formData.dropoffAccess, formData.dropoffFlights)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between"><span className="text-secondary-400">Service</span><span className="font-semibold text-secondary text-right">{isMovingLabor ? 'Local Moving' : serviceType}</span></div>
              {movingOptions && (
                <>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Job type</span>
                    <span className="font-semibold text-secondary text-right">{MOVING_SCOPE_LABELS[movingOptions.serviceScope]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Move size</span>
                    <span className="font-semibold text-secondary text-right">
                      {movingOptions.homeSize === 'studio' ? 'Studio' : movingOptions.homeSize === '1bed' ? '1-Bedroom' : movingOptions.homeSize === '2bed' ? '2-Bedroom' : '3+ Bedrooms'}
                      {movingOptions.needsTruck ? ' · $99 truck' : ''}
                    </span>
                  </div>
                  {(movingOptions.heavyItems.length > 0 || movingOptions.needsPackingHelp || movingOptions.needsDisassembly) && (
                    <div className="flex justify-between gap-4">
                      <span className="text-secondary-400 shrink-0">Extras</span>
                      <span className="font-semibold text-secondary text-right max-w-[60%]">
                        {[
                          movingOptions.heavyItems.length ? `${movingOptions.heavyItems.length} heavy item(s)` : null,
                          movingOptions.needsPackingHelp ? 'Packing help' : null,
                          movingOptions.needsDisassembly ? 'Disassembly' : null,
                        ].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between"><span className="text-secondary-400">Date</span><span className="font-semibold text-secondary text-right">{formData.date ? `${new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${formData.timeSlot ? ` · ${formatTimeSlotLabel(formData.timeSlot)}` : ''}` : '—'}</span></div>
              {isJunkRemoval && localImage && (
                <div className="flex justify-between"><span className="text-secondary-400">Photo</span><span className="font-semibold text-secondary text-right">Attached</span></div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-xs font-bold">{error}</p>
            </div>
          )}

        </form>
        <FlowStickyNav onBack={handleBackStep} continueType="submit" continueForm="booking-review-form" />
        </>
      )}

      {step === 'deposit' && (
        <BookingDepositIntro
          onBack={() => setStep('review')}
          onContinue={() => setStep('payment')}
          serviceType={serviceType}
          source={depositSource}
        />
      )}

      {step === 'payment' && (
        <BookingDepositPayment
          appointmentDate={formData.date}
          estimatedTotal={estimate?.price || 0}
          customerEmail={formData.email}
          customerName={formData.name}
          customerPhone={formData.phone}
          serviceType={serviceType}
          isLoading={submitting}
          smsMarketingConsentAt={localSmsMarketingConsentAt}
          onSmsMarketingConsentChange={setLocalSmsMarketingConsentAt}
          onBack={() => setStep('deposit')}
          onPaymentSuccess={handleSubmit}
        />
      )}
    </div>
  );
};
