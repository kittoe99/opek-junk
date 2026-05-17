import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight, Send, Check, Calendar, Clock, MapPin, Phone, Eye, Shield, BadgeCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHero } from './shared/PageHero';

export const InHomeEstimatePage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('in_home_estimates')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          message: formData.message
        }]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => { navigate('/'); }, 4000);
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
              <p className="text-[11px] font-bold text-brand uppercase tracking-widest">Appointment Requested</p>
              <h2 className="text-2xl md:text-3xl font-black text-secondary">All Set!</h2>
              <p className="text-secondary-500 text-sm leading-relaxed max-w-xs mx-auto">
                We'll contact you within 24 hours to confirm your in-home estimate appointment.
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
    { icon: Eye, title: 'Eyes on the job', desc: 'We see exactly what you have so the quote is accurate, not a guess.' },
    { icon: BadgeCheck, title: 'Free, no-obligation', desc: 'Walk-through is on us. Zero pressure to book if the price isn\'t right.' },
    { icon: Shield, title: 'Same-day quote', desc: 'Get a written, locked-in price on the spot before we leave.' },
  ];


  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Free In-Home Estimate"
        title={<>We'll come<br />to <span className="text-brand">you.</span></>}
        subtitle="Schedule a free, no-obligation in-home estimate. Our team visits your property and provides an accurate quote on the spot."
        image="/estimates (1).webp"
        imageAlt="In-home estimate visit"
        imageCaption="Free • No-Obligation • Quote on the Spot"
        primaryCta={{ label: 'Schedule Visit', onClick: () => { document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' }); } }}
        secondaryCta={{ label: 'Call Now', href: 'tel:8313187139' }}
      />

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why an In-Home Visit</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight max-w-3xl">
              Accurate quote. <span className="text-brand">Zero surprises.</span>
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



      {/* Form */}
      <section id="schedule" className="py-16 md:py-24 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Schedule</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-3">
              Request your <span className="text-brand">free estimate.</span>
            </h2>
            <p className="text-secondary-500 text-base leading-relaxed">
              Pick a window and we'll confirm your appointment within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:border md:border-secondary-100 md:rounded-2xl md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Smith"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(831) 318-7139"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@email.com"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5"><MapPin size={10} className="inline mr-1" />Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="123 Main St, City, State ZIP"
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5"><Calendar size={10} className="inline mr-1" />Preferred Date</label>
                  <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5"><Clock size={10} className="inline mr-1" />Preferred Time</label>
                  <select name="preferredTime" value={formData.preferredTime} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors">
                    <option value="">Select a time preference</option>
                    {timeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">Additional Details</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={3}
                  placeholder="Tell us about the items you need removed, access conditions, or any special requirements..."
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors resize-none" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs font-bold">{error}</p>
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="group w-full py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg">
                {submitting ? 'Sending...' : <><Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" /> Request Free Estimate</>}
              </button>

              <p className="text-[10px] text-secondary-400 text-center">
                No obligation. We'll confirm your appointment within 24 hours.
              </p>
            </form>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-white border-t border-secondary-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Prefer to Talk?</p>
          <h2 className="text-2xl md:text-3xl font-black text-secondary mb-4">
            Skip the visit. <span className="text-brand">Quote by phone.</span>
          </h2>
          <p className="text-secondary-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            For straightforward jobs, we can get you a number over the phone in five minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <a href="tel:8313187139"
              className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-brand transition-colors">
              <Phone size={16} className="text-brand" />
              (831) 318-7139
            </a>
            <span className="hidden sm:block w-px h-4 bg-secondary-200" />
            <button onClick={() => navigate('/quote')}
              className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-brand transition-colors">
              Get Online Quote
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
