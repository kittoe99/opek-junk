import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight, ArrowLeft, Send, Check, Calendar, Clock, Loader2, MapPinned, Receipt } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TrustBadges } from './TrustBadges';
import { ServiceArea } from './ServiceArea';

interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export const InHomeEstimatePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-redirect effect on submit success
  useEffect(() => {
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

  // Close address suggestions on click outside
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
    setAddressQuery(suggestion.display);
    setFormData(prev => ({ ...prev, address: suggestion.display }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const timeOptions = [
    'Morning (8am - 12pm)',
    'Afternoon (12pm - 4pm)',
    'Evening (4pm - 7pm)',
    'Anytime - Flexible'
  ];

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
            address: formData.address
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl shadow-secondary/5 border border-secondary-100 p-8 md:p-10 text-center">
            {/* Animated success icon */}
            <div className="relative mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center mx-auto">
                <Home size={32} className="text-brand" strokeWidth={2} />
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

            {/* Redirect Notice countdown bar */}
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

  const inputCls = "w-full px-4 py-3 bg-secondary-50/50 border border-secondary-100 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand focus:bg-white transition-all duration-200";

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header section */}
      <div className="pt-32 pb-8 md:pt-40 md:pb-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block px-3 py-1.5 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mb-4">
          Free In-Home Estimate
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
          Providers come <span className="text-brand">to you.</span>
        </h1>
        <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed">
          Schedule a free, no-obligation in-home estimate. Vetted providers visit your property and provide an accurate quote on the spot.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step 1: Contact Details */}
        {step === 1 && (
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Name *</label>
                  <input type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required placeholder="John Smith"
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
                  <input type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                    className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
                <input type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
                  className={inputCls} />
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
            <div className="space-y-4">
              <div ref={addressDropdownRef} className="relative">
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
                  <MapPinned size={11} className="inline mr-1" />
                  Address *
                </label>
                <input
                  value={addressQuery || formData.address}
                  onChange={(e) => handleAddressInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  required
                  placeholder="Start typing an address..."
                  autoComplete="off"
                  className={inputCls}
                />
                {addressLoading && (
                  <Loader2 size={14} className="absolute right-4 top-[40px] animate-spin text-secondary-300" />
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectSuggestion(s)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-secondary-50 transition-colors border-b border-secondary-50 last:border-b-0 flex items-start gap-2.5 text-secondary"
                      >
                        <MapPinned size={14} className="text-brand mt-0.5 shrink-0" />
                        <span>{s.display}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
                    <Calendar size={10} className="inline mr-1" />
                    Preferred Date *
                  </label>
                  <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleInputChange} required
                    min={new Date().toISOString().split('T')[0]}
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
                    <Clock size={10} className="inline mr-1" />
                    Preferred Time *
                  </label>
                  <select name="preferredTime" value={formData.preferredTime} onChange={handleInputChange} required
                    className={inputCls}>
                    <option value="">Select a time preference</option>
                    {timeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={handleBackStep}
                className="flex items-center justify-center gap-2 px-6 py-4 border border-secondary-200 text-secondary text-xs font-black uppercase tracking-widest rounded-xl hover:border-secondary transition-colors">
                <ArrowLeft size={14} /> Back
              </button>
              <button type="submit"
                className="group flex-1 py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest hover:bg-brand transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-secondary/10 hover:shadow-brand/20">
                Continue <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Message & Review */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={3}
                  placeholder="Tell the provider about the items needing removal, access conditions, or any special requirements..."
                  className={`${inputCls} resize-none`} />
              </div>

              {/* Review Section */}
              <div className="border border-secondary-100 bg-secondary-50/30 p-5 rounded-2xl">
                <div className="flex items-center gap-2.5 mb-4">
                  <Receipt size={15} className="text-brand" strokeWidth={2.5} />
                  <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.15em]">Review Request</h3>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Name</span><span className="font-black text-secondary text-right">{formData.name}</span></div>
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Phone</span><span className="font-black text-secondary text-right">{formData.phone}</span></div>
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Email</span><span className="font-black text-secondary text-right">{formData.email}</span></div>
                  <div className="flex justify-between gap-4 border-b border-secondary-100/50 pb-2"><span className="text-secondary-400 font-medium">Address</span><span className="font-black text-secondary text-right max-w-[60%] truncate">{formData.address}</span></div>
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
                className="flex items-center justify-center gap-2 px-6 py-4 border border-secondary-200 text-secondary text-xs font-black uppercase tracking-widest rounded-xl hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TrustBadges />
      </div>

      <div className="mt-16">
        <ServiceArea titleStart="Providers come to you." titleAccent="Free estimate." />
      </div>
    </div>
  );
};
