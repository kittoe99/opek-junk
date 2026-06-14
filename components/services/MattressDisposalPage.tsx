import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, BedDouble, Check, Sparkles } from 'lucide-react';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';
import { FullServiceSection } from '../FullServiceSection';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();

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
                Mattress gone.
                <br />
                <span className="text-brand">Recycled.</span>
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Hassle-free, eco-friendly mattress removal. Vetted crews retrieve your mattress, box spring, and bed frame from any room. Up to 80% recycled.
              </p>
            </div>
          </div>
          <div className="flex flex-row animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/quote', { state: { preselectItems: [{ name: 'Mattress', quantity: 1 }] } })}
              className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
            >
              View Pricing
            </button>
            <button
              onClick={() => navigate('/quote', { state: { preselectItems: [{ name: 'Mattress', quantity: 1 }] } })}
              className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
            >
              Book Online
            </button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex min-h-screen flex-col items-center justify-center pt-40 pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-12 gap-16 items-center">
              {/* Left Column */}
              <div className="col-span-7">
                <div className="mb-4 animate-fade-in">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Eco-Haul Service</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-black text-secondary tracking-tight mb-6 leading-[1.05] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  Mattress gone.
                  <br />
                  <span className="text-brand">Recycled.</span>
                </h1>
                <p className="text-lg text-secondary mb-8 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Hassle-free, eco-friendly mattress removal. Vetted crews retrieve your mattress, box spring, and bed frame from any room. Up to 80% recycled.
                </p>
                <div className="flex flex-row gap-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <button
                    onClick={() => navigate('/quote', { state: { preselectItems: [{ name: 'Mattress', quantity: 1 }] } })}
                    className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
                  >
                    View Pricing
                  </button>
                  <button
                    onClick={() => navigate('/quote', { state: { preselectItems: [{ name: 'Mattress', quantity: 1 }] } })}
                    className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
                  >
                    Book Online
                  </button>
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
                    title: "Mattresses",
                    icon: BedDouble,
                    description: "Standard innerspring, memory foam, latex, hybrid, pillow-top, futons, and crib mattresses of any size (Twin to California King)."
                  },
                  {
                    title: "Box Springs",
                    icon: Sparkles,
                    description: "Traditional wood box springs, metal foundations, split box springs, or low-profile bases retrieved from any floor."
                  },
                  {
                    title: "Bed Frames",
                    icon: Leaf,
                    description: "Steel bed frames, wooden headboards, footboards, wood slats, adjustables, platform beds, bunk beds, and daybeds."
                  },
                  {
                    title: "Complete Sets",
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
                        if (item.title === 'Box Springs') preselect = [{ name: 'Box Spring', quantity: 1 }];
                        else if (item.title === 'Bed Frames') preselect = [{ name: 'Bed Frame', quantity: 1 }];
                        else if (item.title === 'Complete Sets') preselect = [
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

      {/* Mattress-Specific Charity/Eco Banner */}
      <section className="relative bg-secondary py-8 md:py-10 overflow-hidden border-b border-secondary-800">
        {/* Background subtle glowing effect */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            
            {/* Left Side: Thumbnail Image + Text Copy */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-secondary-800">
                <img 
                  src="/mattress-disposal.webp" 
                  alt="Clean mattress recycling" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Leaf size={12} className="text-brand fill-brand animate-pulse" />
                  <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Eco Stewardship</span>
                </div>
                <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-wide leading-tight">
                  Up to eighty percent. <span className="text-brand">Rebuilt & Recycled.</span>
                </h3>
                <p className="text-white/60 text-xs font-medium">
                  We dismantle mattresses to recycle steel, wood, and foam, redirecting waste from landfills.
                </p>
              </div>
            </div>

            {/* Right Side: CTA Button */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => navigate('/quote', { state: { preselectItems: [{ name: 'Mattress', quantity: 1 }] } })}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded bg-brand hover:bg-brand-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              >
                <span>Book Eco-Haul</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
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
                className={`group relative flex items-center md:block gap-4 md:gap-0 bg-secondary-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none ${
                  index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
                }`}
              >
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 md:w-full md:h-auto md:aspect-square overflow-hidden md:mb-5 shadow-sm md:shadow-md rounded-xl md:rounded-none border border-secondary-100/60">
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
              onClick={() => navigate('/quote', { state: { preselectItems: [{ name: 'Mattress', quantity: 1 }] } })}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl inline-flex items-center gap-2"
            >
              <span>View Pricing & Book</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </section>

      {/* Custom WhatWeHaul for Bedroom items */}
      <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Asymmetric Typography Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Accepted Items</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
                We haul<br />
                <span className="text-brand">it all.</span>
              </h2>
              
              <div className="w-12 h-0.5 bg-secondary-100" />
              
              <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-sm font-medium">
                Vetted crews retrieve your old bedding from any room or floor. No need to haul heavy mattresses to the curb.
              </p>
            </div>

            {/* Right Column: Bento Grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-secondary-100/60 border border-secondary-100/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {[
                  { label: 'Twin & Full Mattresses', desc: 'Inner spring, memory foam, futon, or crib sizes', icon: BedDouble },
                  { label: 'Queen & King Mattresses', desc: 'Standard Queen, King, or California King mattress types', icon: BedDouble },
                  { label: 'Box Springs', desc: 'Standard, low-profile, or split box spring units', icon: Sparkles },
                  { label: 'Steel Rails & Foundations', desc: 'Adjustable base frames, steel rails, and brackets', icon: Check },
                  { label: 'Platform Beds', desc: 'Wooden platform frames, daybeds, and bunk bed systems', icon: Leaf },
                  { label: 'Headboards & Footboards', desc: 'Upholstered, wood, metal headboards and footboards', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.label} 
                      className="group bg-white p-6 md:p-8 hover:bg-secondary-50/20 transition-all duration-300 flex items-start gap-5"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary-50 group-hover:bg-brand/10 text-secondary-400 group-hover:text-brand flex items-center justify-center shrink-0 transition-colors duration-300">
                        <Icon 
                          className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-105" 
                          strokeWidth={1.5} 
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-secondary text-base md:text-lg transition-colors group-hover:text-brand duration-300">
                          {item.label}
                        </h3>
                        <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">
                          {item.desc}
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

      <FullServiceSection />

      <ServiceArea titleStart="Clear your space." titleAccent="Same-day booking available." />
    </div>
  );
};
