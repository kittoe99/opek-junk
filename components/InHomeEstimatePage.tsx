import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, Clock, Receipt, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ServicePageHero } from './shared/ServicePageHero';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import {
  ServiceAddressField,
  ServiceAddressValue,
  formatServiceAddressLocation,
  isServiceAddressValidated,
} from './shared/ServiceAddressField';
import {
  UTILITY_FORM_CARD,
  UTILITY_INPUT,
  UTILITY_LABEL,
  UTILITY_PRIMARY_BUTTON,
  UTILITY_SECONDARY_BUTTON,
} from '../lib/flowPageLayout';

export const InHomeEstimatePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    unitNumber: '',
    city: '',
    state: '',
    zipCode: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressValidated, setAddressValidated] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const timeOptions = [
    'Morning (8am - 12pm)',
    'Afternoon (12pm - 4pm)',
    'Evening (4pm - 7pm)',
    'Anytime - Flexible',
  ];

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressValidated || !isServiceAddressValidated(formData)) {
      setAddressError('Please select your address from the suggestions list.');
      return;
    }
    setAddressError(null);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackStep = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('in_home_estimates').insert([
        {
          customer_info: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          location_info: {
            address: formData.address,
            unit_number: formData.unitNumber || null,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
          },
          estimate_details: {
            preferred_date: formData.preferredDate,
            preferred_time: formData.preferredTime,
            message: formData.message,
          },
        },
      ]);

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting in-home estimate form:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    const formattedDate = formData.preferredDate
      ? new Date(formData.preferredDate).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : formData.preferredDate;

    return (
      <SubmissionSuccessView
        title="Request submitted"
        description="We received your in-home estimate request and will contact you to schedule."
        summary={[
          { label: 'Name', value: formData.name },
          { label: 'Email', value: formData.email },
          { label: 'Phone', value: formData.phone },
          {
            label: 'Address',
            value: `${formData.address}${formData.unitNumber ? `, ${formData.unitNumber}` : ''}, ${formatServiceAddressLocation(formData)}`,
          },
          { label: 'Preferred date', value: formattedDate },
          { label: 'Preferred time', value: formData.preferredTime },
          ...(formData.message ? [{ label: 'Notes', value: formData.message }] : []),
        ]}
      />
    );
  }

  return (
    <div className="home-dark min-h-screen pb-24">
      <ServicePageHero
        eyebrow="Free In-Home Estimate"
        title={
          <>
            Providers come
            <br />
            to you
          </>
        }
        subtitle="Schedule a free, no-obligation in-home estimate. Vetted providers visit your property and provide an accurate quote on the spot."
        image="/opek-hustle-muscle.png?v=2"
        imageAlt="Provider ready for an in-home estimate"
        chip="No Obligation"
        primaryCta={{ label: 'Call Now', href: 'tel:8313187139' }}
        secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className={UTILITY_FORM_CARD}>
          {step === 1 && (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="text-center space-y-2 mb-2">
                <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">Contact Details</h2>
                <p className="text-[var(--text-muted)] text-xs">Tell us how to confirm your free estimate.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={UTILITY_LABEL}>Name *</label>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Smith"
                      className={UTILITY_INPUT}
                    />
                  </div>
                  <div>
                    <label className={UTILITY_LABEL}>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="(831) 318-7139"
                      className={UTILITY_INPUT}
                    />
                  </div>
                </div>
                <div>
                  <label className={UTILITY_LABEL}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="you@email.com"
                    className={UTILITY_INPUT}
                  />
                </div>
              </div>
              <button type="submit" className={UTILITY_PRIMARY_BUTTON}>
                Continue <ArrowRight size={14} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div className="text-center space-y-2 mb-2">
                <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">Appointment Details</h2>
                <p className="text-[var(--text-muted)] text-xs">Choose where and when providers should visit.</p>
              </div>
              <div className="space-y-4">
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
                  inputClassName={UTILITY_INPUT}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={UTILITY_LABEL}>
                      <Calendar size={10} className="inline mr-1" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className={UTILITY_INPUT}
                    />
                  </div>
                  <div>
                    <label className={UTILITY_LABEL}>
                      <Clock size={10} className="inline mr-1" />
                      Preferred Time *
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required
                      className={UTILITY_INPUT}
                    >
                      <option value="">Select a time preference</option>
                      {timeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleBackStep} className={`${UTILITY_SECONDARY_BUTTON} flex-1 !w-auto px-6`}>
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={!addressValidated}
                  className={`${UTILITY_PRIMARY_BUTTON} flex-1`}
                >
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2 mb-2">
                <div className="w-12 h-12 bg-brand/15 rounded-full flex items-center justify-center mx-auto mb-3 border border-brand/30">
                  <Receipt className="w-6 h-6 text-brand" strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">Review Request</h2>
                <p className="text-[var(--text-muted)] text-xs">Add final notes and confirm your request.</p>
              </div>

              <div>
                <label className={UTILITY_LABEL}>Additional Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tell the provider about the items needing removal, access conditions, or any special requirements..."
                  className={`${UTILITY_INPUT} resize-none`}
                />
              </div>

              <div className="border border-[var(--border)] bg-white/[0.02] p-5 rounded-2xl">
                <div className="flex items-center gap-2.5 mb-4">
                  <Receipt size={15} className="text-brand" strokeWidth={2.5} />
                  <h3 className="text-[10px] font-bold text-[var(--text)] uppercase tracking-[0.15em]">
                    Review Request
                  </h3>
                </div>
                <div className="space-y-2.5 text-xs">
                  {[
                    ['Name', formData.name],
                    ['Phone', formData.phone],
                    ['Email', formData.email],
                    [
                      'Address',
                      `${formData.address}${formData.unitNumber ? `, ${formData.unitNumber}` : ''}, ${formatServiceAddressLocation(formData)}`,
                    ],
                    ['Preferred Date', formData.preferredDate],
                    ['Preferred Time', formData.preferredTime],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 border-b border-white/[0.06] last:border-0 pb-2 last:pb-0"
                    >
                      <span className="text-[var(--text-muted)] font-medium">{label}</span>
                      <span className="font-semibold text-[var(--text)] text-right max-w-[60%] truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-brand/10 border border-brand/30 rounded-xl">
                  <p className="text-brand text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackStep}
                  disabled={submitting}
                  className={`${UTILITY_SECONDARY_BUTTON} flex-1 !w-auto px-6`}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button type="submit" disabled={submitting} className={`${UTILITY_PRIMARY_BUTTON} flex-1`}>
                  {submitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={14} /> Request Free Estimate
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-[var(--text-muted)] text-center font-medium">
                No obligation. The appointment will be confirmed within 24 hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
