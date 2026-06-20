import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, BedDouble, Check, Sparkles, Loader2, Phone } from 'lucide-react';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';
import { QuickActionBar } from '../QuickActionBar';
import { ZipCheckModal } from '../ZipCheckModal';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);
  const [zipValue, setZipValue] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const handleZipCheck = async () => {
    const zip = zipValue.trim();
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Enter a valid 5-digit ZIP.');
      return;
    }
    setZipLoading(true);
    setZipError(null);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) {
        setZipError('ZIP not found.');
        return;
      }
      const data = await res.json();
      const city = data.places?.[0]?.['place name'] ?? '';
      const state = data.places?.[0]?.['state abbreviation'] ?? '';
      
      navigate('/quote', {
        state: {
          zipResult: { city, state, served: true },
          zipValue: zip,
          serviceType: 'Junk Removal',
          preselectItems: [{ name: 'Mattress', quantity: 1 }]
        }
      });
    } catch {
      setZipError('Check failed. Try again.');
    } finally {
      setZipLoading(false);
    }
  };

  const steps = [
    {
      image: "/process-step-2.svg",
      alt: "Instant mattress disposal quote",
      titleStart: "quotes.",
      titleAccent: "simplified.",
      desc: "Get an instant, flat-rate mattress disposal quote online."
    },
    {
      image: "/process-step-3.svg",
      alt: "In-home mattress removal service",
      titleStart: "Zero",
      titleAccent: "lifting.",
      desc: "Vetted crews retrieve your mattress from any room or floor. No curb dragging."
    },
    {
      image: "/eco-disposal-step.png",
      alt: "Eco-friendly mattress recycling",
      titleStart: "Eco",
      titleAccent: "disposal.",
      desc: "Up to 80% of mattress components are recycled, keeping them out of landfills."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Mattress-Optimized Hero Section (Homepage layout) */}
      <section className="relative bg-white overflow-hidden">
        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col">
          {/* Content area: background image + dark overlay */}
          <div
            className="relative pt-32 pb-10 px-4"
            style={{
              backgroundImage: 'url(/mattress-pickup.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } as React.CSSProperties}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10">
              <div className="mb-3 animate-fade-in">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">Eco-Haul Service</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-[1.05] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Mattress Disposal.
                <br />
                <span className="text-brand">From $75</span>
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Same-day pickup from any room. Zero heavy lifting.
              </p>

            </div>
          </div>

          {/* Buttons sit flush below the image background */}
          <div className="flex flex-row animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => document.querySelector('input[type="text"]')?.focus()}
              className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl text-center inline-flex items-center justify-center gap-2"
            >
              <span>View Pricing</span>
            </button>
            <button
              onClick={() => navigate('/booking')}
              className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
            >
              Book Online
            </button>
          </div>

          {/* ZIP Checker Form (Mobile) */}
          <div className="px-4 py-8">
            <div className="max-w-md mx-auto space-y-3 animate-slide-up" style={{ animationDelay: '0.35s' }}>
              <p className="text-sm font-bold text-secondary uppercase tracking-wider text-center mb-2">Check your pricing instantly</p>
              <div className="relative flex items-center bg-white border border-secondary-200 hover:border-brand/40 focus-within:border-brand shadow-md rounded-none overflow-hidden p-1 w-full">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zipValue}
                  onChange={(e) => { setZipValue(e.target.value.replace(/\D/g, '')); setZipError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                  placeholder="Enter ZIP code for pricing"
                  className="flex-1 px-4 py-3 text-sm bg-transparent border-none text-secondary focus:outline-none font-mono tracking-wider"
                  style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                />
                <button
                  onClick={handleZipCheck}
                  disabled={zipValue.length !== 5 || zipLoading}
                  className="px-5 py-3 bg-brand hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 rounded-none shrink-0 flex items-center gap-1.5"
                >
                  {zipLoading ? <Loader2 size={14} className="animate-spin" /> : 'Check Rates'}
                </button>
              </div>
              {zipError && <p className="text-xs text-red-500 font-semibold text-center">{zipError}</p>}
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex min-h-[85vh] flex-col items-center justify-center pt-32 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-12 gap-16 items-center">
              {/* Left Column */}
              <div className="col-span-7">
                <div className="mb-4 animate-fade-in">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Eco-Haul Service</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-black text-secondary tracking-tight mb-6 leading-[1.05] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Mattress Disposal.
                  <br />
                  <span className="text-brand">From $75</span>
                </h1>
                <p className="text-lg text-secondary mb-8 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Same-day pickup from any room. Zero heavy lifting.
                </p>

                <div className="flex flex-row gap-0 animate-slide-up mb-8" style={{ animationDelay: '0.25s' }}>
                  <button
                    onClick={() => document.querySelector('input[type="text"]')?.focus()}
                    className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl inline-flex items-center gap-2"
                  >
                    <span>View Pricing</span>
                  </button>
                  <button
                    onClick={() => navigate('/booking')}
                    className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
                  >
                    Book Online
                  </button>
                </div>

                {/* ZIP Checker Form */}
                <div className="animate-slide-up space-y-4" style={{ animationDelay: '0.3s' }}>
                  <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">Check your pricing instantly</p>
                  <div className="relative flex items-center bg-white border border-secondary-200 hover:border-brand/40 focus-within:border-brand shadow-md rounded-none overflow-hidden p-1 w-full max-w-md">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={zipValue}
                      onChange={(e) => { setZipValue(e.target.value.replace(/\D/g, '')); setZipError(null); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                      placeholder="Enter ZIP code for pricing"
                      className="flex-1 px-4 py-3 text-sm bg-transparent border-none text-secondary focus:outline-none font-mono tracking-wider"
                      style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                    />
                    <button
                      onClick={handleZipCheck}
                      disabled={zipValue.length !== 5 || zipLoading}
                      className="px-5 py-3 bg-brand hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 rounded-none shrink-0 flex items-center gap-1.5"
                    >
                      {zipLoading ? <Loader2 size={14} className="animate-spin" /> : 'Check Rates'}
                    </button>
                  </div>
                  {zipError && <p className="text-xs text-red-500 font-semibold">{zipError}</p>}
                </div>
              </div>
              {/* Right Column - Image */}
              <div className="col-span-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="relative aspect-square flex items-center justify-center group">
                  <img
                    src="/mattress-pickup.webp"
                    alt="Opek mattress removal service in action"
                    className="w-full h-full object-cover rounded-2xl shadow-lg border border-secondary-100 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Custom Bento Grid for Mattress/Bedding items */}
      <section id="services" className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Asymmetric Typography Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Items Handled</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
                Mattresses,<br />
                <span className="text-brand">box springs, & rails.</span>
              </h2>
              
              <div className="w-12 h-0.5 bg-secondary-100" />
              
              <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-sm font-medium">
                Simple flat-rates for all bedroom furniture. From memory foam to heavy wooden platform beds, our matched local loaders haul it away from anywhere inside.
              </p>
            </div>

            {/* Right Column: Bento Grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-secondary-100/60 border border-secondary-100/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {[
                  {
                    title: "Mattresses (From $75)",
                    icon: BedDouble,
                    description: "Standard innerspring, memory foam, latex, hybrid, pillow-top, futons, and crib mattresses of any size (Twin to California King)."
                  },
                  {
                    title: "Box Springs (From $65)",
                    icon: Sparkles,
                    description: "Traditional wood box springs, metal foundations, split box springs, or low-profile bases retrieved from any floor."
                  },
                  {
                    title: "Bed Frames (From $70)",
                    icon: Leaf,
                    description: "Steel bed frames, wooden headboards, footboards, wood slats, adjustables, platform beds, bunk beds, and daybeds."
                  },
                  {
                    title: "Complete Sets (Save 15%)",
                    icon: Check,
                    description: "Bundle your mattress, box spring, and frame removal into a single flat-rate package for maximum pricing discount."
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.title} 
                      onClick={() => {
                        let preselect = [{ name: 'Mattress', quantity: 1 }];
                        if (item.title.includes('Box Springs')) preselect = [{ name: 'Box Spring', quantity: 1 }];
                        else if (item.title.includes('Bed Frames')) preselect = [{ name: 'Bed Frame', quantity: 1 }];
                        else if (item.title.includes('Complete Sets')) preselect = [
                          { name: 'Mattress', quantity: 1 },
                          { name: 'Box Spring', quantity: 1 },
                          { name: 'Bed Frame', quantity: 1 }
                        ];
                        navigate('/quote', { state: { preselectItems: preselect } });
                      }}
                      className="group cursor-pointer bg-white p-6 md:p-8 hover:bg-secondary-50/20 transition-all duration-300 flex items-start gap-5"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary-50 group-hover:bg-brand/10 text-secondary-400 group-hover:text-brand flex items-center justify-center shrink-0 transition-colors duration-300">
                        <Icon 
                          className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-105" 
                          strokeWidth={1.5} 
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-secondary text-base md:text-lg transition-colors group-hover:text-brand duration-300">
                          {item.title}
                        </h3>
                        <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Localized Process section modeled after ProcessEditorial */}
      <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-20">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand"></span>
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Disposal Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight">
                Mattress disposal<br className="hidden md:block" /> in <span className="text-brand">three moves.</span>
              </h2>
            </div>
            <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right font-medium">
              Upfront pricing, in-home pickup, and responsible recycling.
            </p>
          </div>

          {/* Steps — staggered editorial layout */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`group relative flex items-center md:block gap-4 md:gap-0 bg-secondary-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-2xl ${
                  index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
                }`}
              >
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 md:w-full md:h-auto md:aspect-square overflow-hidden md:mb-5 shadow-sm md:shadow-md rounded-xl md:rounded-2xl border border-secondary-100/60">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent pointer-events-none hidden md:block"></div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-[17px] md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-1 md:mb-3">
                    {step.titleStart} <span className="text-brand">{step.titleAccent}</span>
                  </h3>
                  <p className="text-secondary-500 text-xs md:text-[15px] leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Centered CTA */}
          <div className="mt-16 md:mt-24 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl inline-flex items-center gap-2"
            >
              <span>Check Rates & Book</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </section>

      <ServiceArea 
        onGetQuote={() => setIsZipModalOpen(true)}
        titleStart="Clear your space." 
        titleAccent="Same-day booking available." 
      />

      <QuickActionBar onBookOnline={() => navigate('/booking')} />

      <ZipCheckModal 
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
        onGetQuote={() => navigate('/quote')}
      />
    </div>
  );
};
