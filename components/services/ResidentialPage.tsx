import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Check, Home, Sofa, Refrigerator, Bed, Tv, Wrench, Recycle, Clock, Shield, Quote, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { StatsStrip } from '../shared/StatsStrip';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const itemTypes = [
    { icon: Sofa, label: 'Furniture', desc: 'Couches, tables, dressers, mattresses' },
    { icon: Refrigerator, label: 'Appliances', desc: 'Fridges, washers, dryers, stoves' },
    { icon: Tv, label: 'Electronics', desc: 'TVs, computers, monitors, e-waste' },
    { icon: Bed, label: 'Bedroom Sets', desc: 'Frames, headboards, full bedrooms' },
    { icon: Wrench, label: 'Garage Junk', desc: 'Tools, exercise gear, old paint cans' },
    { icon: Recycle, label: 'Yard Waste', desc: 'Branches, debris, light landscaping' },
  ];

  const whyUs = [
    {
      icon: Clock,
      title: 'Same-day pickup',
      desc: 'Most jobs scheduled within 2 hours. Book by noon, often gone by dinner.',
    },
    {
      icon: Shield,
      title: 'Fixed upfront pricing',
      desc: 'No hourly meters, no hidden fees. You see the number before we lift a thing.',
    },
    {
      icon: Recycle,
      title: '70% diverted from landfill',
      desc: 'We donate, recycle, or repurpose what we can — your stuff gets a second life.',
    },
  ];

  const steps = [
    { n: '01', title: 'Snap a photo', desc: 'Text or upload pictures of what needs to go.' },
    { n: '02', title: 'Lock the price', desc: 'Crew confirms volume and gives a flat quote.' },
    { n: '03', title: 'We haul it', desc: 'You point, we lift, sweep, and roll out.' },
  ];

  const faqs = [
    { q: 'How is pricing determined?', a: 'Pricing is based on volume — the space your items take up in our truck. We give you an upfront quote on-site before any work begins. No hidden fees, no hourly billing surprises.' },
    { q: 'Do I need to be home during pickup?', a: 'We recommend it so you can point out exactly what should go and approve the quote. For repeat customers, we can also arrange gated-access or key pickup.' },
    { q: "What items can't you take?", a: 'We cannot haul hazardous materials like wet paint, chemicals, asbestos, or medical waste. Everything else — furniture, appliances, electronics, debris — we handle.' },
    { q: 'How quickly can you come out?', a: 'In most areas, same-day or next-day appointments are available. Book online or call and we will confirm a 2-hour arrival window.' },
    { q: 'Do you carry insurance?', a: 'Yes. Every provider in our network is fully licensed, insured, and background-checked. We can provide a Certificate of Insurance on request.' },
  ];

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Residential"
        title={<>Junk gone.<br />Today.</>}
        subtitle="Furniture, appliances, mattresses, and full home cleanouts. Upfront pricing, same-day availability, and crews that handle every pound — you just point."
        image="/junk-removal.webp"
        imageAlt="Residential junk removal team loading a truck"
        imageCaption="Fully Insured • 70% Recycled • Same-Day Available"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      {/* Stats Strip */}
      <StatsStrip
        stats={[
          { value: '5K+', label: 'Homes Cleared' },
          { value: '< 2 hr', label: 'Avg Arrival' },
          { value: '70%', label: 'Diverted from Landfill' },
          { value: '4.9★', label: 'Customer Rating' },
        ]}
      />

      {/* What we haul */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">What We Haul</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
                If it's in your home,<br />
                <span className="text-brand">we'll move it out.</span>
              </h2>
            </div>
            <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right">
              From a single couch to a full attic clean — same crew, same flat-rate pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itemTypes.map((item) => (
              <div
                key={item.label}
                className="group p-6 bg-secondary-50 rounded-2xl hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-secondary-100"
              >
                <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand transition-colors">
                  <item.icon size={20} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-black text-secondary text-base mb-1">{item.label}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us — staggered editorial */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why Opek</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight max-w-3xl">
              Built different. <span className="text-brand">Priced honest.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {whyUs.map((item, idx) => (
              <div
                key={item.title}
                className={`group ${idx === 1 ? 'md:mt-12' : idx === 2 ? 'md:mt-6' : ''}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5 group-hover:bg-brand transition-colors">
                  <item.icon size={24} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-secondary-500 text-sm md:text-[15px] leading-relaxed max-w-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">How It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-5">
                Three steps from<br />
                <span className="text-brand">cluttered to clear.</span>
              </h2>
              <p className="text-secondary-500 text-base leading-relaxed mb-6">
                No quote forms. No phone tag. Just photos, a flat price, and a crew at the door.
              </p>
              <button
                onClick={() => navigate('/quote')}
                className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-2"
              >
                Start a Quote <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.n} className="flex gap-5 pb-6 border-b border-secondary-100 last:border-0">
                  <span className="text-3xl md:text-4xl font-black text-brand leading-none shrink-0 w-12">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-black text-secondary text-lg md:text-xl mb-1">{step.title}</h3>
                    <p className="text-secondary-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
            "Booked at 9am, gone by 2pm. They cleared an entire garage in one trip and the price didn't budge — flat as advertised."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-black">M</div>
            <div>
              <p className="font-bold text-sm">Megan R.</p>
              <p className="text-xs text-white/60">Austin, TX • Garage Cleanout</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              Common questions, <span className="text-brand">straight answers.</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-secondary-100 rounded-2xl overflow-hidden bg-white hover:border-secondary-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-base text-secondary pr-4">{faq.q}</span>
                  <ChevronDown size={20} className={`text-secondary-300 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-brand' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 md:pb-6 text-secondary-500 text-sm md:text-base leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Ready When You Are</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-4">
                  Clear the clutter. <span className="text-brand">Today.</span>
                </h2>
                <p className="text-secondary-500 text-base leading-relaxed">
                  Free quote in under two minutes. No obligations, no hidden fees. Pay only when the truck is loaded.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/quote')}
                  className="px-8 py-4 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                >
                  Get a Free Quote <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/booking')}
                  className="px-8 py-4 bg-brand text-white font-bold text-sm uppercase tracking-wider hover:bg-brand-600 transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                >
                  Book Online <ArrowRight size={16} />
                </button>
                <a
                  href="tel:8313187139"
                  className="text-center text-secondary font-bold text-sm uppercase tracking-wider underline underline-offset-4 decoration-secondary-300 hover:decoration-brand hover:text-brand transition-colors py-2"
                >
                  or call (831) 318-7139
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
