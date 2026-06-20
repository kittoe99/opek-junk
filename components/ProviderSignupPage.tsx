import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, ClipboardList, Truck, Calendar, UserCheck, ShieldCheck, DollarSign, Smartphone } from 'lucide-react';
import { PageHero } from './shared/PageHero';
import { supabase, sendConfirmationEmail } from '../lib/supabase';
import { TrustBadges } from './TrustBadges';


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
  const [countdown, setCountdown] = useState(5);

  React.useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, navigate]);

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
    'Flexible / On-Call'
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.scheduleAvailability.length === 0) {
      setError('Please select at least one availability slot.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const providerName = `${formData.firstName} ${formData.lastName}`;
      const { error: insertError } = await supabase
        .from('provider_signups')
        .insert([{
          customer_info: {
            name: providerName,
            email: formData.email,
            phone: formData.phone
          },
          provider_info: {
            service_area: formData.serviceArea,
            vehicle_type: formData.vehicleType,
            availability: {
              schedule: formData.scheduleAvailability,
              businessName: formData.businessName,
              additionalInfo: formData.additionalInfo
            }
          },
          status: 'pending'
        }]);

      if (insertError) throw insertError;

      sendConfirmationEmail('provider_signup', {
        name: providerName,
        email: formData.email,
        phone: formData.phone,
        service_area: formData.serviceArea,
        vehicle_type: formData.vehicleType
      }).catch(err => console.warn('Failed to send provider signup confirmation email:', err));

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting provider signup:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300";

  const signupSteps = [
    { label: 'About You', icon: ClipboardList },
    { label: 'Operations', icon: Truck },
    { label: 'Availability', icon: Calendar }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 p-8 md:p-10 text-center">
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
                <UserCheck size={32} className="text-brand" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-secondary">Submission Successful</h2>
              <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
                Your submission was successful.
              </p>
            </div>

            <div className="pt-4 border-t border-secondary-100 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-secondary-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                Redirecting to home page in <span className="text-brand font-black">{countdown}</span> seconds...
              </div>
              <div className="w-full h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHero
        eyebrow="Provider Network"
        title={<>Grow your <span className="text-brand">hauling business.</span></>}
        subtitle="Already booked jobs, weekly payouts, and a dispatch app designed for independent contractors."
        image="/process-step-2.svg"
        imageAlt="Independent contractor dispatching jobs"
        imageCaption="Vetted contractors • Weekly payouts • Dispatch app"
        primaryCta={{ label: 'Call Now', href: 'tel:8313187139' }}
        secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        compact
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div>
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-lg font-black text-secondary uppercase tracking-wider">About You</h2>
                <p className="text-secondary-400 text-xs">Start with your contact and business details.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">First Name *</label>
                    <div className="relative group">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Last Name *</label>
                    <div className="relative group">
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Smith" className={inputCls} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email Address *</label>
                    <div className="relative group">
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone Number *</label>
                    <div className="relative group">
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139" className={inputCls} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Business Name (Optional)</label>
                  <div className="relative group">
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g. John's Hauling LLC" className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="group w-full py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20"
                >
                  Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Operations */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Operations</h2>
                <p className="text-secondary-400 text-xs">Tell us where you work and what equipment you use.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Primary Service Area *</label>
                  <div className="relative group">
                    <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleInputChange} required placeholder="e.g. Denver Metro, LA County" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Vehicle Type *</label>
                  <div className="relative group">
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} required className={inputCls}>
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-secondary-100 text-secondary text-xs font-black uppercase tracking-widest rounded-xl hover:border-secondary transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button 
                  type="submit" 
                  className="group flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20"
                >
                  Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary-100 shadow-sm">
                  <Calendar className="w-6 h-6 text-brand" strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-black text-secondary uppercase tracking-wider">Availability</h2>
                <p className="text-secondary-400 text-xs">Choose when you can accept matched jobs.</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-3">Weekly Availability *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {scheduleOptions.map(option => {
                      const isSelected = formData.scheduleAvailability.includes(option);
                      return (
                        <label key={option} className={`flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all duration-200 text-xs font-semibold ${
                          isSelected 
                            ? 'border-brand bg-brand/5 text-secondary shadow-sm' 
                            : 'border-secondary-100 bg-white text-secondary-500 hover:border-secondary-100'
                        }`}>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-brand border-brand' : 'border-secondary-300'
                          }`}>
                            {isSelected && <Check size={10} className="text-white" strokeWidth={3.5} />}
                          </div>
                          <input type="checkbox" checked={isSelected} onChange={() => handleScheduleChange(option)} className="sr-only" />
                          <span className="truncate">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details (Optional)</label>
                  <div className="relative group">
                    <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={3}
                      placeholder="Share details about your experience, equipment, license status, or team size..."
                      className={`${inputCls} resize-none`} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-xs font-bold">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-secondary-100 text-secondary text-xs font-black uppercase tracking-widest rounded-xl hover:border-secondary transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || formData.scheduleAvailability.length === 0}
                  className="group flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20"
                >
                  {submitting ? 'Submitting...' : <><Check size={14} strokeWidth={3} /> Submit Application</>}
                </button>
              </div>
              <p className="text-[10px] text-secondary-300 text-center">By submitting, you agree to the contractor terms and network guidelines.</p>
            </form>
          )}

        </div>
      </div>

      {/* Trust badges at bottom */}
      <div className="mt-16">
        <TrustBadges />
      </div>
    </div>
  );
};
