import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, UserPlus, DollarSign, Calendar, Truck, Smartphone, Award, Quote, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHero } from './shared/PageHero';
import { StatsStrip } from './shared/StatsStrip';

export const ProviderSignupPage: React.FC = () => {
  const navigate = useNavigate();
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

  if (submitted) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-brand" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-secondary mb-2">Application Submitted</h2>
          <p className="text-secondary-500 text-sm mb-6">
            Our team will review your application and contact you within 1–2 business days.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center gap-2 shadow-md rounded-lg"
          >
            Return Home <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const benefits = [
    { icon: DollarSign, title: 'Fast payouts', desc: 'Weekly direct deposit. No 30-day net terms or chasing invoices — get paid on time, every time.' },
    { icon: Calendar, title: 'Pick your jobs', desc: 'Browse available jobs in your area, accept the ones that fit your schedule, decline the rest. Total control.' },
    { icon: Smartphone, title: 'Built for haulers', desc: 'Simple mobile app: photos, addresses, customer notes — everything you need to run jobs efficiently.' },
  ];

  const perks = [
    { icon: Truck, title: 'Any vehicle', desc: 'From pickup to dump truck, we route jobs that match your equipment.' },
    { icon: Award, title: 'No setup fees', desc: 'Free to join. Free to use. We only earn when you do.' },
    { icon: Calendar, title: 'Flexible hours', desc: 'Full-time, weekends, or evenings — work the schedule that works for you.' },
  ];

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Provider Network"
        title={<>Grow your<br />hauling business.</>}
        subtitle="Join the Opek provider network. Pre-qualified leads, weekly payouts, and a platform built specifically for haulers like you."
        image="/workers-opek.webp"
        imageAlt="Opek provider crew loading a truck"
        imageCaption="Pre-qualified leads • Weekly payouts • Full control"
        primaryCta={{ label: 'Apply Now', onClick: () => { document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }); } }}
        secondaryCta={{ label: 'Talk to Us', onClick: () => navigate('/contact') }}
      />

      <StatsStrip
        stats={[
          { value: '500+', label: 'Active Providers' },
          { value: 'Weekly', label: 'Payouts' },
          { value: '$0', label: 'Setup Cost' },
          { value: '24/7', label: 'Provider Support' },
        ]}
      />

      {/* Why Join — staggered */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why Join</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight max-w-3xl">
              More jobs. Less chasing. <span className="text-brand">Better margins.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {benefits.map((item, idx) => (
              <div key={item.title} className={`group ${idx === 1 ? 'md:mt-12' : idx === 2 ? 'md:mt-6' : ''}`}>
                <div className="w-14 h-14 rounded-2xl bg-secondary-50 flex items-center justify-center mb-5 group-hover:bg-brand transition-colors">
                  <item.icon size={24} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-3">{item.title}</h3>
                <p className="text-secondary-500 text-sm md:text-[15px] leading-relaxed max-w-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks grid */}
      <section className="py-16 md:py-20 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {perks.map((p) => (
              <div key={p.title} className="p-6 bg-white rounded-2xl">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                  <p.icon size={18} className="text-brand" />
                </div>
                <h3 className="font-black text-secondary text-base mb-1">{p.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute -top-10 right-10 opacity-10">
          <Quote size={200} className="text-brand" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-brand fill-brand" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-black leading-[1.2] tracking-tight mb-6">
            "Doubled my monthly revenue in three months. The lead quality is real — these are paying customers, not tire kickers. App is dead simple too."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-black">R</div>
            <div>
              <p className="font-bold text-sm">Ryan T.</p>
              <p className="text-xs text-white/60">Owner, Two Trucks Hauling • Denver, CO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Apply</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-3">
              Provider <span className="text-brand">application.</span>
            </h2>
            <p className="text-secondary-500 text-base leading-relaxed">
              Five minutes to apply. We'll review and reach out within 1–2 business days.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 md:border md:border-secondary-100 md:rounded-2xl md:p-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John"
                      className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Smith"
                      className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                      className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Business Name (Optional)</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Your Business Name"
                      className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                  </div>
                </div>
              </div>

              {/* Service Area */}
              <div>
                <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-4">Service Area</h3>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Primary Service Area *</label>
                <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleInputChange} required
                  placeholder="e.g., Denver Metro Area, Los Angeles County"
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                <p className="text-xs text-secondary-400 mt-2">Specify the city, county, or region you primarily serve</p>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-4">Vehicle Information</h3>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Vehicle Type *</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} required
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors">
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              {/* Schedule Availability */}
              <div>
                <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-4">Schedule Availability</h3>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-3">When are you typically available? (Select all that apply) *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scheduleOptions.map(option => (
                    <label key={option} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.scheduleAvailability.includes(option) ? 'border-brand bg-brand/5' : 'border-secondary-100 hover:border-secondary-300'
                    }`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                        formData.scheduleAvailability.includes(option) ? 'bg-brand' : 'border-2 border-secondary-200'
                      }`}>
                        {formData.scheduleAvailability.includes(option) && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <input type="checkbox" checked={formData.scheduleAvailability.includes(option)} onChange={() => handleScheduleChange(option)} className="sr-only" />
                      <span className="text-sm font-medium text-secondary">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Information (Optional)</label>
                <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={4}
                  placeholder="Tell us about your experience, equipment, certifications, or anything else..."
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors resize-none" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs font-bold">{error}</p>
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                {submitting ? 'Submitting...' : <>Submit Application <ArrowRight size={14} /></>}
              </button>
              <p className="text-xs text-secondary-400 text-center">By submitting, you agree to our provider terms and conditions</p>
            </form>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="block w-8 h-px bg-brand" />
                  <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Questions First?</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-4">
                  Talk to a real <span className="text-brand">provider rep.</span>
                </h2>
                <p className="text-secondary-500 text-base leading-relaxed">
                  Want the full breakdown on lead pricing, payout schedules, and onboarding? Reach out — we respond within 30 minutes.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/contact')}
                  className="px-8 py-4 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 shadow-md rounded-lg">
                  Contact Provider Team <ArrowRight size={16} />
                </button>
                <a href="tel:8313187139"
                  className="px-8 py-4 bg-brand text-white font-bold text-sm uppercase tracking-wider hover:bg-brand-600 transition-colors inline-flex items-center justify-center gap-2 shadow-md rounded-lg">
                  Call (831) 318-7139
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
