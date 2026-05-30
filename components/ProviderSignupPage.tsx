import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, DollarSign, Calendar, Truck, Smartphone, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHero } from './shared/PageHero';
import { TrustBadges } from './TrustBadges';
import { ServiceArea } from './ServiceArea';

const STEPS = ['You', 'Operations', 'Availability'];

export const ProviderSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    serviceArea: '',
    vehicleType: '',
    scheduleAvailability: [] as string[],
    additionalInfo: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vehicleTypes = [
    'Pickup Truck',
    'Box Truck (14-16 ft)',
    'Box Truck (18-20 ft)',
    'Box Truck (22-26 ft)',
    'Dump Truck',
    'Trailer',
    'Multiple Vehicles'
  ];

  const scheduleOptions = [
    'Weekday Mornings',
    'Weekday Afternoons',
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings',
    'Flexible/On-Call'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      scheduleAvailability: prev.scheduleAvailability.includes(option)
        ? prev.scheduleAvailability.filter(item => item !== option)
        : [...prev.scheduleAvailability, option]
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('provider_signups')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          service_area: formData.serviceArea,
          vehicle_type: formData.vehicleType,
          availability: {
            schedule: formData.scheduleAvailability,
            businessName: formData.businessName,
            additionalInfo: formData.additionalInfo
          },
          status: 'pending'
        }]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => { navigate('/'); }, 3000);
    } catch (err: any) {
      console.error('Error submitting provider signup:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-white border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors";

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl shadow-secondary/5 border border-secondary-100 p-8 md:p-10 text-center">
            {/* Animated success icon */}
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
                <UserCheck size={32} className="text-brand" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-[11px] font-bold text-brand uppercase tracking-widest">Application Received</p>
              <h2 className="text-2xl md:text-3xl font-black text-secondary">Welcome Aboard!</h2>
              <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
                Applications are reviewed with responses sent within 1–2 business days to get you started.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 bg-secondary text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-brand transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Return Home <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const benefits = [
    { icon: DollarSign, title: 'Fast payouts', desc: 'Weekly direct deposit. No 30-day net terms or chasing invoices — get paid on time, every time.' },
    { icon: Calendar, title: 'Pick your jobs', desc: 'Browse available jobs in your area, accept the ones that fit your schedule, decline the rest. Total control.' },
    { icon: Smartphone, title: 'Built for haulers', desc: 'Simple mobile app: photos, addresses, customer notes — everything you need to run jobs efficiently.' },
  ];

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Provider Network"
        title={<>Grow your<br />hauling business.</>}
        subtitle="Join the Opek provider network. Pre-qualified leads, weekly payouts, and a platform built specifically for independent haulers like you."
        image="/opek2.webp"
        imageAlt="Opek independent provider loading a truck"
        imageCaption="Pre-qualified leads • Weekly payouts • Full control"
        primaryCta={{ label: 'Apply Now', onClick: () => { document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }); } }}
        secondaryCta={{ label: 'Contact Support', onClick: () => navigate('/contact') }}
      />

      <TrustBadges />

      {/* Why Join */}
      <section className="py-10 md:py-20 bg-white border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-14">
            <div className="inline-flex items-center gap-2 mb-2 md:mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why Join</span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight max-w-3xl">
              More jobs. Less chasing. <span className="text-brand">Better margins.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-10">
            {benefits.map((item, idx) => (
              <div
                key={item.title}
                className={`group flex items-center md:block gap-4 md:gap-0 bg-secondary-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none ${idx === 1 ? 'md:mt-12' : idx === 2 ? 'md:mt-6' : ''}`}
              >
                <div className="w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-secondary-50 flex items-center justify-center shrink-0 md:mb-5 group-hover:bg-brand transition-colors">
                  <item.icon className="w-4 h-4 md:w-6 md:h-6 text-brand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-[15px] md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-0.5 md:mb-3">{item.title}</h3>
                  <p className="text-secondary-500 text-xs md:text-[15px] leading-relaxed max-w-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24 bg-secondary-50 scroll-mt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Apply</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary leading-[1.05] tracking-tight mb-2">
              Provider <span className="text-brand">application.</span>
            </h2>
            <p className="text-secondary-500 text-sm leading-relaxed">
              Five minutes to apply. Applications are reviewed within 1–2 business days.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((label, i) => (
                <span key={label} className={`text-[10px] font-black uppercase tracking-wider transition-colors ${
                  i + 1 < step ? 'text-brand' : i + 1 === step ? 'text-secondary' : 'text-secondary-300'
                }`}>
                  {i + 1 < step ? <Check size={11} className="inline mb-0.5 mr-0.5" strokeWidth={3} /> : null}{label}
                </span>
              ))}
            </div>
            <div className="relative h-1.5 bg-secondary-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-brand rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-secondary-400 mt-1.5">Step {step} of {STEPS.length}</p>
          </div>

          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Smith" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Business Name (Optional)</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Your Business Name" className={inputCls} />
              </div>
              <button type="submit" className="w-full py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors flex items-center justify-center gap-2 rounded-lg">
                Continue <ArrowRight size={14} />
              </button>
            </form>
          )}

          {/* Step 2 — Operations */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Service Area *</label>
                <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleInputChange} required
                  placeholder="e.g., Denver Metro, LA County" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Vehicle Type *</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} required className={inputCls}>
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-3 border border-secondary-200 text-secondary text-xs font-bold uppercase tracking-wider rounded-lg hover:border-secondary transition-colors">
                  <ArrowLeft size={13} /> Back
                </button>
                <button type="submit" className="flex-1 py-3 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors flex items-center justify-center gap-2 rounded-lg">
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3 — Availability */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-2">When are you available? *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {scheduleOptions.map(option => (
                    <label key={option} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors text-xs font-medium ${
                      formData.scheduleAvailability.includes(option) ? 'border-brand bg-brand/5 text-secondary' : 'border-secondary-100 text-secondary-500 hover:border-secondary-300'
                    }`}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        formData.scheduleAvailability.includes(option) ? 'bg-brand' : 'border-2 border-secondary-200'
                      }`}>
                        {formData.scheduleAvailability.includes(option) && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                      <input type="checkbox" checked={formData.scheduleAvailability.includes(option)} onChange={() => handleScheduleChange(option)} className="sr-only" />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details (Optional)</label>
                <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={3}
                  placeholder="Experience, certifications, equipment, or anything else..."
                  className={`${inputCls} resize-none`} />
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs font-bold">{error}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-3 border border-secondary-200 text-secondary text-xs font-bold uppercase tracking-wider rounded-lg hover:border-secondary transition-colors">
                  <ArrowLeft size={13} /> Back
                </button>
                <button type="submit" disabled={submitting || formData.scheduleAvailability.length === 0}
                  className="flex-1 py-3 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg">
                  {submitting ? 'Submitting...' : <>Submit Application <ArrowRight size={14} /></>}
                </button>
              </div>
               <p className="text-[10px] text-secondary-400 text-center">By submitting, you agree to the provider terms and conditions.</p>
            </form>
          )}
        </div>
      </section>

      <ServiceArea titleStart="Grow your hauling" titleAccent="business today." />
    </div>
  );
};
