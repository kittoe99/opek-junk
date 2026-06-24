import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Loader2, CalendarCheck, Receipt, PackageCheck, ClipboardList, MapPin, User, Mail, Phone, Building2, MessageSquare, Map, Trash2, Calendar as CalendarIcon, MapPin as MapPinIcon, Image as ImageIcon, Camera, Upload, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuoteEstimate } from '../types';
import { supabase, sendConfirmationEmail, uploadBookingPhoto } from '../lib/supabase';
import { BookingSuccessView } from './shared/BookingSuccessView';
import { BookingDepositPayment, BOOKING_DEPOSIT_AMOUNT } from './shared/BookingDepositPayment';
import { BookingDepositIntro } from './shared/BookingDepositIntro';
import { ScheduleDatePicker, TimeSlot, formatTimeSlotLabel } from './shared/ScheduleDatePicker';
import {
  ServiceAddressField,
  ServiceAddressValue,
  isServiceAddressValidated,
} from './shared/ServiceAddressField';
import { CollapsibleReviewPanel } from './shared/CollapsibleReviewPanel';

interface BookingDetailsFormProps {
  estimate: QuoteEstimate | null;
  image: string | null;
  serviceType: string;
  defaultZip?: { city: string; state: string; zipCode: string };
  onBack?: () => void;
  backLabel?: string;
  prefilledName?: string;
  prefilledPhone?: string;
  partialBookingId?: string | null;
}

type DetailStep = 'contact' | 'schedule' | 'address' | 'review' | 'deposit' | 'payment';

export const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  estimate,
  image,
  serviceType,
  defaultZip,
  onBack,
  backLabel = 'Back',
  prefilledName,
  prefilledPhone,
  partialBookingId,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DetailStep>('contact');
  const [submitting, setSubmitting] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(image);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [addressValidated, setAddressValidated] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: prefilledName || '',
    email: '',
    phone: prefilledPhone || '',
    address: '',
    unitNumber: '',
    city: defaultZip?.city || '',
    state: defaultZip?.state || '',
    zipCode: defaultZip?.zipCode || '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const detailsText = estimate
        ? `Items: ${estimate.itemsDetected.join(', ')}\nEstimated Volume: ${estimate.estimatedVolume}\nEstimated Price: $${estimate.price}${formData.details ? '\n\nNotes: ' + formData.details : ''}`
        : formData.details;

      const normalizedServiceType = serviceType
        ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
          : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
          : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
          : 'Junk Removal')
        : 'Junk Removal';

      let currentPartialId = partialId;

      let uploadedUrl = localImage || '';
      if (uploadedUrl && uploadedUrl.startsWith('data:')) {
        const fileName = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
        const publicUrl = await uploadBookingPhoto(uploadedUrl, fileName);
        if (publicUrl) {
          uploadedUrl = publicUrl;
          setLocalImage(publicUrl);
        }
      }

      const customerInfo = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      const bookingDetails = {
        service_type: normalizedServiceType,
        zip_code: defaultZip?.zipCode || formData.zipCode || null,
        details: detailsText,
        estimated_items: estimate?.itemsDetected || [],
        estimated_volume: estimate?.estimatedVolume || '',
        price: estimate?.price || 0,
        estimate_summary: estimate?.summary || '',
        photo_url: uploadedUrl
      };

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
    if (!addressValidated || !isServiceAddressValidated(formData)) {
      setAddressError('Please select your address from the suggestions list.');
      return;
    }
    setAddressError(null);
    setStep('review');
  };

  const handleBackStep = () => {
    if (step === 'payment') setStep('deposit');
    else if (step === 'deposit') setStep('review');
    else if (step === 'review') setStep('address');
    else if (step === 'address') setStep('schedule');
    else if (step === 'schedule') setStep('contact');
    else if (onBack) onBack();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isJunkRemoval = serviceType.toLowerCase().includes('junk') || serviceType === 'Junk Removal';
    if (isJunkRemoval && !localImage) {
      setError('A photo of the items to be hauled away is required to complete your booking. This helps improve service accuracy.');
      return;
    }

    setError(null);
    setStep('deposit');
  };

  const handleSubmit = async (paymentIntentId: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const detailsText = estimate
        ? `Items: ${estimate.itemsDetected.join(', ')}\nEstimated Volume: ${estimate.estimatedVolume}\nEstimated Price: $${estimate.price}${formData.details ? '\n\nNotes: ' + formData.details : ''}`
        : formData.details;

      const normalizedServiceType = serviceType
        ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
          : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
          : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
          : 'Junk Removal')
        : 'Junk Removal';

        let resultData = null;
        let dbError = null;
  
        try {
          const generatedOrderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

          let uploadedUrl = localImage || '';
          if (uploadedUrl && uploadedUrl.startsWith('data:')) {
            const fileName = `booking_${generatedOrderNumber}_${Math.random().toString(36).substring(2, 8)}.jpg`;
            const publicUrl = await uploadBookingPhoto(uploadedUrl, fileName);
            if (publicUrl) {
              uploadedUrl = publicUrl;
              setLocalImage(publicUrl);
            }
          }

          const customerInfo = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          };

          const locationInfo = {
            address: formData.address,
            unit_number: formData.unitNumber || null,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode
          };

          const bookingDetails = {
            service_type: normalizedServiceType,
            preferred_date: formData.date,
            preferred_time: formatTimeSlotLabel(formData.timeSlot),
            details: detailsText,
            estimated_items: estimate?.itemsDetected || [],
            estimated_volume: estimate?.estimatedVolume || '',
            price: estimate?.price || 0,
            estimate_summary: estimate?.summary || '',
            photo_url: uploadedUrl,
            deposit_amount: BOOKING_DEPOSIT_AMOUNT,
            deposit_paid: true,
            stripe_payment_intent_id: paymentIntentId,
            terms_accepted_at: new Date().toISOString()
          };

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
              .rpc('update_prebooking', { p_id: partialId, p_status: 'converted' })
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
        
        // Trigger booking confirmation email
        sendConfirmationEmail('booking', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          unit_number: formData.unitNumber || null,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          service_type: normalizedServiceType,
          preferred_date: formData.date,
          preferred_time: formatTimeSlotLabel(formData.timeSlot),
          details: detailsText,
          price: estimate?.price || null,
          order_number: finalOrderNumber
        }).catch(err => console.warn('Failed to send booking confirmation email:', err));

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
        serviceType={normalizedServiceType}
        name={formData.name}
        phone={formData.phone}
        email={formData.email}
        address={formData.address}
        unitNumber={formData.unitNumber}
        city={formData.city}
        state={formData.state}
        zipCode={formData.zipCode}
        date={formData.date}
        details={formData.details}
        price={estimate?.price}
        itemsDetected={estimate?.itemsDetected}
        estimatedVolume={estimate?.estimatedVolume}
      />
    );
  }

  // Step labels for indicator
  const stepLabels = ['Contact', 'Schedule', 'Address', 'Review', 'Deposit', 'Payment'];
  const stepIndex =
    step === 'contact' ? 0
    : step === 'schedule' ? 1
    : step === 'address' ? 2
    : step === 'review' ? 3
    : step === 'deposit' ? 4
    : 5;

  return (
    <div className={`max-w-md mx-auto space-y-6${step === 'payment' ? '' : ' animate-fade-in'}`}>

      {/* ─── Contact step ─── */}
      {step === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="text-center space-y-2 mb-6">
            <div>
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Your Contact Details</h2>
              <p className="text-secondary-400 text-xs">How should you be reached to confirm?</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Full Name *</label>
            <div className="relative group">
              <input
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={contactSubmitting}
                placeholder="John Smith"
                className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors disabled:opacity-55"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
            <div className="relative group">
              <input
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={contactSubmitting}
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors disabled:opacity-55"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
            <div className="relative group">
              <input
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={contactSubmitting}
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors disabled:opacity-55"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleBackStep} disabled={contactSubmitting} className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowLeft size={14} /> {onBack ? backLabel : 'Back'}
            </button>
            <button type="submit" disabled={contactSubmitting} className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/10 hover:shadow-brand/20">
              {contactSubmitting ? 'Saving...' : <>Continue <ArrowRight size={14} /></>}
            </button>
          </div>
        </form>
      )}

      {/* ─── Schedule step ─── */}
      {step === 'schedule' && (
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
              <CalendarCheck className="w-6 h-6 text-brand" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Schedule Pickup</h2>
              <p className="text-secondary-400 text-xs">
                Choose your preferred service date before adding the address.
              </p>
            </div>
          </div>

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

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleBackStep} className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              disabled={!formData.date || !formData.timeSlot}
              className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Address <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* ─── Address step ─── */}
      {step === 'address' && (
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="text-center space-y-2 mb-6">
            <div>
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">
                {serviceType === 'Moving Labor' ? 'Service Address' : 'Pickup Address'}
              </h2>
              <p className="text-secondary-400 text-xs">
                {serviceType === 'Moving Labor' ? 'Where is the work location?' : 'Where should the service provider come to collect?'}
              </p>
            </div>
          </div>

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

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleBackStep} className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              disabled={!addressValidated}
              className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* ─── Review step ─── */}
      {step === 'review' && (
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
              <ClipboardList className="w-6 h-6 text-brand" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Details & Review</h2>
              <p className="text-secondary-400 text-xs">Review your booking before confirming</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Service Type</label>
              <input
                readOnly
                value={serviceType}
                className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl text-sm text-secondary font-bold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5"><CalendarCheck size={11} className="inline mr-1" /> Preferred Date</label>
              <input
                readOnly
                value={
                  formData.date
                    ? `${new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}${formData.timeSlot ? ` · ${formatTimeSlotLabel(formData.timeSlot)}` : ''}`
                    : ''
                }
                className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl text-sm text-secondary font-bold focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Photo Upload Section for Junk Removal */}
          {(serviceType.toLowerCase().includes('junk') || serviceType === 'Junk Removal') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">
                  Photo of Items *
                </label>
                <span className="text-[10px] font-bold text-brand bg-brand/5 px-2 py-0.5 rounded-full border border-brand/10 animate-pulse-slow">
                  Required to Book
                </span>
              </div>

              {localImage ? (
                <div className="relative border border-secondary-100 bg-white p-3 rounded-2xl flex items-center gap-4 shadow-sm group animate-fade-in">
                  <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden border border-secondary-100 bg-secondary-50">
                    <img src={localImage} alt="Items preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-black text-secondary">Items Photo Uploaded</p>
                    <p className="text-[10px] text-secondary-400 mt-0.5">This image will be used to verify volume and service details.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocalImage(null)}
                    className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 p-2 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                    aria-label="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-secondary-200 hover:border-brand/40 bg-secondary-50/20 p-5 rounded-2xl text-center space-y-4 transition-all duration-300">
                  <div className="max-w-md mx-auto space-y-2">
                    <p className="text-xs text-secondary-500 font-medium">
                      Please upload or capture a photo of the items you need hauled away.
                    </p>
                    <p className="text-[10px] text-secondary-400 leading-normal">
                      This is <strong className="text-secondary-600 font-black">required to book</strong> in order to improve service accuracy, assess the load size, and match you with the correct crew and vehicle.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto justify-center">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 py-2.5 px-4 bg-white border border-secondary-100 hover:border-brand hover:text-brand text-secondary text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Camera size={14} /> Take Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2.5 px-4 bg-white border border-secondary-100 hover:border-brand hover:text-brand text-secondary text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Upload size={14} /> Upload Photo
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden file inputs */}
              <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details</label>
            <div className="relative group">
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={3}
                placeholder={serviceType === 'Moving Labor' ? "Tell the service provider about the items needing relocation, access instructions, etc." : "Tell the service provider about the items needing removal, access instructions, etc."}
                className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300 transition-colors"
              />
            </div>
          </div>

          {/* Review Section */}
          <CollapsibleReviewPanel
            title="Review Your Booking"
            summary={[
              formData.name,
              formData.date
                ? new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : null,
              estimate ? `$${estimate.price}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
            icon={<Receipt size={14} className="text-brand" strokeWidth={2.5} />}
          >
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Name</span><span className="font-bold text-secondary text-right">{formData.name}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Email</span><span className="font-bold text-secondary text-right">{formData.email}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Phone</span><span className="font-bold text-secondary text-right">{formData.phone}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Address</span><span className="font-bold text-secondary text-right max-w-[60%]">{formData.address}{formData.unitNumber ? `, ${formData.unitNumber}` : ''}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">City / State / Zip</span><span className="font-bold text-secondary text-right">{[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Service</span><span className="font-bold text-secondary text-right">{serviceType}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Date</span><span className="font-bold text-secondary text-right">{formData.date ? `${new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${formData.timeSlot ? ` · ${formatTimeSlotLabel(formData.timeSlot)}` : ''}` : '—'}</span></div>
              {estimate && (
                <div className="flex justify-between gap-4 pt-1.5 mt-1.5 border-t border-secondary-100"><span className="text-secondary-400">Estimated Total</span><span className="font-black text-brand text-right">${estimate.price}</span></div>
              )}
            </div>
          </CollapsibleReviewPanel>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-xs font-bold">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleBackStep}
              disabled={submitting}
              className="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-secondary-100 text-secondary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 hover:text-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              className="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-secondary text-white hover:bg-brand transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 hover:shadow-brand/20"
            >
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {step === 'deposit' && (
        <BookingDepositIntro
          onBack={() => setStep('review')}
          onContinue={() => setStep('payment')}
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
          onBack={() => setStep('deposit')}
          onPaymentSuccess={handleSubmit}
        />
      )}
    </div>
  );
};
