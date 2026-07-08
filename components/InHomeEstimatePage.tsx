import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Calendar, Clock, Receipt, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { PageHero } from './shared/PageHero';
import { TrustBadges } from './TrustBadges';
import { SubmissionSuccessView } from './shared/SubmissionSuccessView';
import {
  ServiceAddressField,
  ServiceAddressValue,
  formatServiceAddressLocation,
  isServiceAddressValidated,
} from './shared/ServiceAddressField';

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
    message: ''
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
    'Anytime - Flexible'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const { error: insertError } = await supabase
        .from('in_home_estimates')
        .insert([{
          customer_info: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
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
            message: formData.message
          }
        }]);

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
          { label: 'Address', value: `${formData.address}${formData.unitNumber ? `, ${formData.unitNumber}` : ''}, ${formatServiceAddressLocation(formData)}` },
          { label: 'Preferred date', value: formattedDate },
          { label: 'Preferred time', value: formData.preferredTime },
          ...(formData.message ? [{ label: 'Notes', value: formData.message }] : []),
        ]}
      />
    );
  }

  const inputCls = "w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300";

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHero
        eyebrow="Free In-Home Estimate"
        title={<>Providers come <span className="text-brand">to you.</span></>}
        subtitle="Schedule a free, no-obligation in-home estimate. Vetted providers visit your property and provide an accurate quote on the spot."
        image="/process-step-1.svg"
        imageAlt="Vetted provider visiting property"
        imageCaption="On-site service • No obligation • Free estimate"
        primaryCta={{ label: 'Call Now', href: 'tel:8313187139' }}
        secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        compact
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        {/* Step 1: Contact Details */}
        {step === 1 && (
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Contact Details</h2>
              <p className="text-secondary-400 text-xs">Tell us how to confirm your free estimate.</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Name *</label>
                  <div className="relative group">
                    <input type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required placeholder="John Smith"
                      className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
                  <div className="relative group">
                    <input type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                      className={inputCls} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
                <div className="relative group">
                  <input type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
                    className={inputCls} />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit"
                className="group w-full py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20">
                Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Appointment Details */}
        {step === 2 && (
          <form onSubmit={handleAppointmentSubmit} className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Appointment Details</h2>
              <p className="text-secondary-400 text-xs">Choose where and when providers should visit.</p>
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
                inputClassName={inputCls}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
                    <Calendar size={10} className="inline mr-1" />
                    Preferred Date *
                  </label>
                  <div className="relative group">
                    <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleInputChange} required
                      min={new Date().toISOString().split('T')[0]}
                      className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
                    <Clock size={10} className="inline mr-1" />
                    Preferred Time *
                  </label>
                  <div className="relative group">
                    <select name="preferredTime" value={formData.preferredTime} onChange={handleInputChange} required
                      className={inputCls}>
                      <option value="">Select a time preference</option>
                      {timeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handleBackStep}
                className="flex items-center justify-center gap-2 px-6 py-4 border border-secondary-100 text-secondary text-xs font-black uppercase tracking-widest rounded-xl hover:border-secondary transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <button type="submit"
                disabled={!addressValidated}
                className="group flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Message & Review */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
                <Receipt className="w-6 h-6 text-brand" strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Review Request</h2>
              <p className="text-secondary-400 text-xs">Add final notes and confirm your request.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details</label>
                <div className="relative group">
                  <textarea name="message" value={formData.message} onChange={handleInputChange} rows={3}
                    placeholder="Tell the provider about the items needing removal, access conditions, or any special requirements..."
                    className={`${inputCls} resize-none`} />
                </div>
              </div>

              {/* Review Section */}
              <div className="border border-secondary-100 bg-secondary-50/50 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <Receipt size={15} className="text-brand" strokeWidth={2.5} />
                  <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.15em]">Review Request</h3>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Name</span><span className="font-black text-secondary text-right">{formData.name}</span></div>
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Phone</span><span className="font-black text-secondary text-right">{formData.phone}</span></div>
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Email</span><span className="font-black text-secondary text-right">{formData.email}</span></div>
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Address</span><span className="font-black text-secondary text-right max-w-[60%] truncate">{formData.address}{formData.unitNumber ? `, ${formData.unitNumber}` : ''}, {formatServiceAddressLocation(formData)}</span></div>
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Preferred Date</span><span className="font-black text-secondary text-right">{formData.preferredDate}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-secondary-400 font-medium">Preferred Time</span><span className="font-black text-secondary text-right">{formData.preferredTime}</span></div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-xs font-bold">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handleBackStep} disabled={submitting}
                className="flex items-center justify-center gap-2 px-6 py-4 border border-secondary-100 text-secondary text-xs font-black uppercase tracking-widest rounded-xl hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ArrowLeft size={14} /> Back
              </button>
              <button type="submit" disabled={submitting}
                className="group flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Sending...' : <><Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" /> Request Free Estimate</>}
              </button>
            </div>

            <p className="text-[10px] text-secondary-400 text-center font-medium">
              No obligation. The appointment will be confirmed within 24 hours.
            </p>
          </form>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TrustBadges />
      </div>

    </div>
  );
};
