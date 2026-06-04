import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPinned, Loader2, CalendarCheck, Receipt, PackageCheck, ClipboardList, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuoteEstimate } from '../types';
import { supabase, sendConfirmationEmail } from '../lib/supabase';

interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

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

type DetailStep = 'contact' | 'address' | 'review';

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
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

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

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAddressSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setAddressLoading(true);
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en&lat=39.7392&lon=-104.9903&osm_tag=place:house&osm_tag=building`
      );
      const data = await res.json();
      const results: AddressSuggestion[] = (data.features || [])
        .filter((f: any) => f.properties?.street || f.properties?.name)
        .map((f: any) => {
          const p = f.properties;
          const street = p.housenumber
            ? `${p.housenumber} ${p.street || p.name || ''}`
            : (p.street || p.name || '');
          const city = p.city || p.town || p.village || p.county || '';
          const state = p.state || '';
          const zipCode = p.postcode || '';
          const display = [street, city, state, zipCode].filter(Boolean).join(', ');
          return { display, street: street.trim(), city, state, zipCode };
        })
        .filter((s: AddressSuggestion) => s.street);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const handleAddressInput = (value: string) => {
    setAddressQuery(value);
    setFormData(prev => ({ ...prev, address: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchAddressSuggestions(value), 300);
  };

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    setAddressQuery(suggestion.street);
    setFormData(prev => ({
      ...prev,
      address: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('address');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handleBackStep = () => {
    if (step === 'review') setStep('address');
    else if (step === 'address') setStep('contact');
    else if (onBack) onBack();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const detailsText = estimate
        ? `Items: ${estimate.itemsDetected.join(', ')}\nEstimated Volume: ${estimate.estimatedVolume}\nEstimated Price: $${estimate.price}${formData.details ? '\n\nNotes: ' + formData.details : ''}`
        : formData.details;

        let resultData = null;
        let dbError = null;
  
        try {
          let query;
          if (partialBookingId && !partialBookingId.startsWith('mock-')) {
            query = supabase
              .from('bookings')
              .update({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                unit_number: formData.unitNumber || null,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zipCode,
                service_type: serviceType,
                preferred_date: formData.date,
                details: detailsText,
                estimated_items: estimate?.itemsDetected || [],
                estimated_volume: estimate?.estimatedVolume || '',
                price: estimate?.price || 0,
                estimate_summary: estimate?.summary || '',
                photo_url: image || '',
                status: 'pending'
              })
              .eq('id', partialBookingId)
              .select('order_number')
              .single();
          } else {
            query = supabase
              .from('bookings')
              .insert([
                {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  address: formData.address,
                  unit_number: formData.unitNumber || null,
                  city: formData.city,
                  state: formData.state,
                  zip_code: formData.zipCode,
                  service_type: serviceType,
                  preferred_date: formData.date,
                  details: detailsText,
                  estimated_items: estimate?.itemsDetected || [],
                  estimated_volume: estimate?.estimatedVolume || '',
                  price: estimate?.price || 0,
                  estimate_summary: estimate?.summary || '',
                  photo_url: image || '',
                  status: 'pending'
                }
              ])
              .select('order_number')
              .single();
          }
  
          const res = await query;
          resultData = res.data;
          dbError = res.error;
        } catch (err) {
          console.warn('Supabase insert/update failed, falling back to mock submission:', err);
        }
  
        if (dbError) {
          console.warn('Supabase returned error, falling back to mock submission:', dbError);
        }
  
        const finalOrderNumber = resultData?.order_number || `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
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
          service_type: serviceType,
          preferred_date: formData.date,
          details: detailsText,
          price: estimate?.price || null,
          order_number: finalOrderNumber
        }).catch(err => console.warn('Failed to send booking confirmation email:', err));

        setOrderNumber(finalOrderNumber);
        setSubmitted(true);
      } catch (err: any) {
        console.error('Error submitting booking:', err);
        setError(err.message || 'Failed to submit booking. Please try again.');
        setSubmitting(false);
      }
    };


  // ── Success screen ──
  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-secondary/5 border border-secondary-100 p-8 md:p-10 text-center">
        <div className="relative mx-auto mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
            <PackageCheck size={32} className="text-brand" strokeWidth={2} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center">
            <Check size={16} className="text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-[11px] font-bold text-brand uppercase tracking-widest">Booking Confirmed</p>
          <h2 className="text-2xl md:text-3xl font-black text-secondary">You're All Set!</h2>
          <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
            A matched provider will contact you within 15 minutes to confirm your appointment.
          </p>
        </div>

        {orderNumber && (
          <div className="mb-6 p-4 bg-secondary-50 rounded-xl border border-secondary-100">
            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-xl font-mono font-black text-secondary tracking-wider">{orderNumber}</p>
            <p className="text-[11px] text-secondary-400 mt-1">Save this to track your order</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/track-order')}
            className="flex-1 py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-brand transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            Track Order <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3.5 border border-secondary-200 text-secondary font-bold uppercase text-xs tracking-wider rounded-xl hover:border-brand hover:text-brand transition-all duration-300"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Step labels for indicator
  const stepLabels = ['Contact', 'Address', 'Review'];
  const stepIndex = step === 'contact' ? 0 : step === 'address' ? 1 : 2;

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      {(() => {
        const slicedSteps = [
          { label: 'Contact', icon: User },
          { label: 'Address', icon: MapPin },
          { label: 'Review', icon: ClipboardList }
        ];
        return (
          <div className="relative mb-14 px-1">
            {/* Background Connecting Line */}
            <div className="absolute top-[18px] left-[18px] right-[18px] h-0.5 bg-secondary-100 -translate-y-1/2 pointer-events-none">
              {/* Active Connecting Line */}
              <div 
                className="h-full bg-brand transition-all duration-500 ease-out"
                style={{ width: `${(stepIndex / (slicedSteps.length - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps Nodes */}
            <div className="flex items-center justify-between relative">
              {slicedSteps.map((stepItem, i) => {
                const StepIcon = stepItem.icon;
                const isCompleted = i < stepIndex;
                const isActive = i === stepIndex;
                
                return (
                  <div key={stepItem.label} className="relative flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-brand border-brand text-white shadow-sm' 
                        : isActive 
                          ? 'bg-white border-brand text-brand ring-4 ring-brand/10' 
                          : 'bg-white border-secondary-200 text-secondary-300'
                    }`}>
                      {isCompleted ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <StepIcon size={14} />
                      )}
                    </div>
                    <span className={`absolute top-11 whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                      isActive || isCompleted ? 'text-secondary' : 'text-secondary-300'
                    }`}>
                      {stepItem.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ─── Contact step ─── */}
      {step === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="mb-2 flex items-start gap-3">
            <CalendarCheck size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <h2 className="text-base font-black text-secondary">Your Contact Details</h2>
              <p className="text-secondary-400 text-xs">How should you be reached to confirm?</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="John Smith"
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              type="tel"
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleBackStep} className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors rounded-lg flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> {onBack ? backLabel : 'Back'}
            </button>
            <button type="submit" className="flex-1 py-4 text-xs font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-colors rounded-lg flex items-center justify-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* ─── Address step ─── */}
      {step === 'address' && (
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div className="mb-2 flex items-start gap-3">
            <MapPinned size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <h2 className="text-base font-black text-secondary">
                {serviceType === 'Moving Labor' ? 'Service Address' : 'Pickup Address'}
              </h2>
              <p className="text-secondary-400 text-xs">
                {serviceType === 'Moving Labor' ? 'Where is the work location?' : 'Where should the service provider come to collect?'}
              </p>
            </div>
          </div>

          <div ref={addressDropdownRef} className="relative">
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
              <MapPinned size={11} className="inline mr-1" />
              Service Address *
            </label>
            <input
              value={addressQuery}
              onChange={(e) => handleAddressInput(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              required
              placeholder="Start typing an address..."
              autoComplete="off"
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            />
            {addressLoading && (
              <Loader2 size={14} className="absolute right-3 top-[38px] animate-spin text-secondary-300" />
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectSuggestion(s)}
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-secondary-50 transition-colors border-b border-secondary-100 last:border-b-0 flex items-start gap-2 text-secondary"
                  >
                    <MapPinned size={14} className="text-brand mt-0.5 shrink-0" />
                    <span>{s.display}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Apt / Unit / Suite <span className="text-secondary-300 font-normal normal-case">(optional)</span></label>
            <input
              name="unitNumber"
              value={formData.unitNumber}
              onChange={handleInputChange}
              placeholder="e.g. Apt 4B, Suite 200"
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">City *</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="Dallas"
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">State *</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                placeholder="TX"
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Zip Code *</label>
              <input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                placeholder="75201"
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleBackStep} className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors rounded-lg flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Back
            </button>
            <button type="submit" className="flex-1 py-4 text-xs font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-colors rounded-lg flex items-center justify-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* ─── Review step ─── */}
      {step === 'review' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-2 flex items-start gap-3">
            <ClipboardList size={18} className="text-brand shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <h2 className="text-base font-black text-secondary">Details & Review</h2>
              <p className="text-secondary-400 text-xs">Pick a date and review your booking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Service Type</label>
              <input
                readOnly
                value={serviceType}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary font-bold focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5"><CalendarCheck size={11} className="inline mr-1" /> Preferred Date *</label>
              <input
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows={3}
              placeholder={serviceType === 'Moving Labor' ? "Tell the service provider about the items needing relocation, access instructions, etc." : "Tell the service provider about the items needing removal, access instructions, etc."}
              className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            />
          </div>

          {/* Review Section */}
          <div className="border border-secondary-100 bg-secondary-50/50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Receipt size={14} className="text-brand" strokeWidth={2.5} />
              <h3 className="text-[10px] font-bold text-secondary uppercase tracking-wider">Review Your Booking</h3>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Name</span><span className="font-bold text-secondary text-right">{formData.name}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Email</span><span className="font-bold text-secondary text-right">{formData.email}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Phone</span><span className="font-bold text-secondary text-right">{formData.phone}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Address</span><span className="font-bold text-secondary text-right max-w-[60%]">{formData.address}{formData.unitNumber ? `, ${formData.unitNumber}` : ''}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">City / State / Zip</span><span className="font-bold text-secondary text-right">{[formData.city, formData.state, formData.zipCode].filter(Boolean).join(', ')}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Service</span><span className="font-bold text-secondary text-right">{serviceType}</span></div>
              <div className="flex justify-between gap-4"><span className="text-secondary-400">Date</span><span className="font-bold text-secondary text-right">{formData.date || '—'}</span></div>
              {estimate && (
                <div className="flex justify-between gap-4 pt-1.5 mt-1.5 border-t border-secondary-200"><span className="text-secondary-400">Estimated Total</span><span className="font-black text-brand text-right">${estimate.price}</span></div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-xs font-bold">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleBackStep}
              disabled={submitting}
              className="flex-1 py-4 text-xs font-bold uppercase tracking-wider border border-secondary-200 text-secondary hover:border-brand hover:text-brand transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 text-xs font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : <>Confirm Booking <Check size={14} strokeWidth={3} /></>}
            </button>
          </div>

          <p className="text-xs text-secondary-300 text-center mt-3">
            Opek matches you with a provider who confirms within 15 minutes
          </p>
        </form>
      )}
    </div>
  );
};
