import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, DollarSign, Calendar, Smartphone, UserCheck, ShieldCheck, Mail, Phone, Clock, KeyRound } from 'lucide-react';
import { supabase, sendConfirmationEmail } from '../lib/supabase';

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

  const inputCls = "w-full px-4 py-3 bg-secondary-50/50 border border-secondary-100 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand focus:bg-white transition-all duration-200";

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 p-8 md:p-10 text-center animate-scale-in">
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
                Applications are reviewed and responses sent within 1–2 business days to get you started.
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
    <div className="min-h-screen bg-white">
      {/* Upper background accent decoration */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-secondary-50 to-white/0 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Business Pitch / Value Props */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-36">
            <div>
              <span className="inline-block px-3 py-1.5 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-4">
                Partner Network
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tight leading-[1.1] mb-4">
                Grow your <span className="text-brand">hauling business.</span>
              </h1>
              <p className="text-secondary-500 text-base md:text-lg leading-relaxed">
                Connect with pre-qualified junk removal and moving labor leads. Weekly direct deposits, local jobs, and full schedule control.
              </p>
            </div>

            <div className="h-px bg-secondary-100" />

            {/* Benefit Highlights */}
            <div className="space-y-6">
              {[
                { icon: DollarSign, title: 'Weekly Direct Payouts', desc: 'Get paid on time, every single week via direct deposit. No chasing invoices.' },
                { icon: Calendar, title: 'Flexible Scheduling', desc: 'Accept the jobs that fit your capacity and decline the ones that don’t.' },
                { icon: Smartphone, title: 'Dispatch Mobile App', desc: 'Access job details, customer notes, photos, and navigation directly from your phone.' }
              ].map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-secondary-100 shadow-sm flex items-center justify-center shrink-0">
                    <b.icon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary text-sm md:text-base leading-tight mb-1">{b.title}</h3>
                    <p className="text-secondary-400 text-xs md:text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-secondary-100" />

            {/* Quick Stats or Highlights */}
            <div className="flex items-center gap-6 text-xs text-secondary-400 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-brand" size={16} />
                <span>Vetted Local Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-brand" size={16} strokeWidth={3} />
                <span>Free to Apply</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Unified Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-secondary-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-secondary/5">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-secondary tracking-tight">Contractor Application</h2>
                <p className="text-secondary-400 text-xs mt-1">Takes 2 minutes. We'll reply within 1–2 business days.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Contact Details */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest border-b border-secondary-50 pb-2">
                    1. Contact Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Smith" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Business / Company Name (Optional)</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="e.g. John's Hauling LLC" className={inputCls} />
                  </div>
                </div>

                {/* Section 2: Operations */}
                <div className="space-y-4 pt-2">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest border-b border-secondary-50 pb-2">
                    2. Service Operations
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Primary Service Area *</label>
                      <input type="text" name="serviceArea" value={formData.serviceArea} onChange={handleInputChange} required placeholder="e.g. Denver Metro, LA County" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Vehicle Type *</label>
                      <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} required className={inputCls}>
                        <option value="">Select vehicle type</option>
                        {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Availability */}
                <div className="space-y-4 pt-2">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest border-b border-secondary-50 pb-2">
                    3. Weekly Availability *
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {scheduleOptions.map(option => {
                      const isSelected = formData.scheduleAvailability.includes(option);
                      return (
                        <label key={option} className={`flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all duration-200 text-xs font-semibold ${
                          isSelected 
                            ? 'border-brand bg-brand/5 text-secondary shadow-sm' 
                            : 'border-secondary-100 bg-white text-secondary-500 hover:border-secondary-200'
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

                {/* Section 4: Additional details */}
                <div className="space-y-4 pt-2">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest border-b border-secondary-50 pb-2">
                    4. Professional Background (Optional)
                  </p>
                  <div>
                    <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Experience & Certifications</label>
                    <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={3}
                      placeholder="Share details about your experience, equipment, license status, or team size..."
                      className={`${inputCls} resize-none`} />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-xs font-bold">{error}</p>
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="group w-full py-4 bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20"
                  >
                    {submitting ? 'Submitting Application...' : <><Check size={14} strokeWidth={3} /> Submit Application</>}
                  </button>
                  <p className="text-[10px] text-secondary-300 text-center mt-3">
                    By submitting, you agree to the contractor terms and network guidelines.
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
