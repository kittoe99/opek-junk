import { HomeReviews } from './home/HomeSections';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ServicePageHero } from './shared/ServicePageHero';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import {
  ServiceAddressField,
  ServiceAddressValue,
  formatServiceAddressLocation,
  isServiceAddressValidated,
} from './shared/ServiceAddressField';
import { UTILITY_INPUT, UTILITY_LABEL, UTILITY_PRIMARY_BUTTON } from '../lib/flowPageLayout';

export const InHomeEstimatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const moveOutCleaning = (location.state as { serviceType?: string } | null)?.serviceType === 'Move-Out Cleaning';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!addressValidated || !isServiceAddressValidated(formData)) {
      setAddressError('Please select your address from the suggestions list.');
      return;
    }
    setAddressError(null);
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
            // Notification emails only print `message`, so the service is labelled there too.
            message: moveOutCleaning
              ? ['Service: Move-Out Cleaning', formData.message].filter(Boolean).join(' | ')
              : formData.message,
            ...(moveOutCleaning ? { service_type: 'Move-Out Cleaning' } : {}),
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
          ...(moveOutCleaning ? [{ label: 'Service', value: 'Move-Out Cleaning' }] : []),
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
    <div className="site-page home-light interior-home soft-page">
      <ServicePageHero
        rating={false}
        title={<>Providers come<br />to you</>}
        subtitle="Book a free, no-obligation visit. A vetted local provider walks through the job with you and gives you a price on the spot."
        image="/optimized/service-scenes/estimate-natural.webp"
        imageAlt="Provider ready for an in-home estimate"
        primaryCta={{ label: 'Schedule my visit', href: '#estimate-details' }}
        secondaryCta={moveOutCleaning ? undefined : { label: 'Get an online quote instead', onClick: () => navigate('/quote') }}
      />

      <div id="estimate-details" className="soft-wrap contact-wrap scroll-mt-[var(--site-header-height)]">
        <div className="soft-card contact-card">
          <h2 className="contact-card-title">{moveOutCleaning ? 'Schedule your move-out cleaning estimate' : 'Schedule your visit'}</h2>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={submitting} className="space-y-4 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="estimate-name" className={UTILITY_LABEL}>Name</label>
                  <input id="estimate-name" type="text" name="name" autoComplete="name" value={formData.name}
                    onChange={handleInputChange} required placeholder="John Smith" className={UTILITY_INPUT} />
                </div>
                <div>
                  <label htmlFor="estimate-phone" className={UTILITY_LABEL}>Phone</label>
                  <input id="estimate-phone" type="tel" name="phone" autoComplete="tel" value={formData.phone}
                    onChange={handleInputChange} required placeholder="(555) 123-4567" className={UTILITY_INPUT} />
                </div>
              </div>

              <div>
                <label htmlFor="estimate-email" className={UTILITY_LABEL}>Email</label>
                <input id="estimate-email" type="email" name="email" autoComplete="email" value={formData.email}
                  onChange={handleInputChange} required placeholder="you@email.com" className={UTILITY_INPUT} />
              </div>

              <ServiceAddressField
                label="Address"
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
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="estimate-date" className={UTILITY_LABEL}>Preferred date</label>
                  <input id="estimate-date" type="date" name="preferredDate" value={formData.preferredDate}
                    onChange={handleInputChange} required min={new Date().toISOString().split('T')[0]} className={UTILITY_INPUT} />
                </div>
                <div>
                  <label htmlFor="estimate-time" className={UTILITY_LABEL}>Preferred time</label>
                  <select id="estimate-time" name="preferredTime" value={formData.preferredTime}
                    onChange={handleInputChange} required className={UTILITY_INPUT}>
                    <option value="">Choose a time</option>
                    {timeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="estimate-message" className={UTILITY_LABEL}>Notes (optional)</label>
                <textarea id="estimate-message" name="message" value={formData.message} onChange={handleInputChange}
                  rows={3} placeholder={moveOutCleaning ? 'Home size, move-out date, and anything about access or parking' : 'What needs to go, and anything about access or parking'}
                  className={`${UTILITY_INPUT} resize-none`} />
              </div>

              {error && (
                <p className="soft-error" role="alert">
                  <AlertCircle size={16} aria-hidden />
                  {error}
                </p>
              )}

              <button type="submit" disabled={submitting} className={UTILITY_PRIMARY_BUTTON}>
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" aria-label="Sending" />
                ) : (
                  <>
                    Request free estimate
                    <Send size={16} aria-hidden />
                  </>
                )}
              </button>
              <p className="text-xs text-center text-[var(--text-muted)]">
                No obligation. We confirm your visit within 24 hours.
              </p>
            </fieldset>
          </form>
        </div>
      </div>

      <HomeReviews />
    </div>
  );
};
