import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Building2, Briefcase, Server, Armchair, Boxes, Trash2, FileText, Clock, Shield, BadgeCheck, Quote, Star, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { StatsStrip } from '../shared/StatsStrip';

export const CommercialPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sectors = [
    { icon: Briefcase, label: 'Offices', desc: 'Cubicles, desks, conference tables, filing cabinets' },
    { icon: Server, label: 'IT & E-Waste', desc: 'Servers, monitors, printers, secure drive disposal' },
    { icon: Armchair, label: 'Retail Fixtures', desc: 'Shelving, displays, signage, mannequins' },
    { icon: Boxes, label: 'Warehouse', desc: 'Pallets, racking, inventory, packaging waste' },
    { icon: Trash2, label: 'Construction Debris', desc: 'Drywall, flooring, demo waste, post-build cleanup' },
    { icon: FileText, label: 'Records & Archives', desc: 'Bulk paper, archives, file rooms (shred-ready)' },
  ];

  const whyUs = [
    {
      icon: Clock,
      title: 'After-hours scheduling',
      desc: 'Evenings, weekends, and overnight windows so your operations never miss a beat.',
    },
    {
      icon: Shield,
      title: 'COI on request',
      desc: 'Full liability coverage with Certificates of Insurance ready before crews arrive.',
    },
    {
      icon: BadgeCheck,
      title: 'Volume pricing',
      desc: 'Recurring schedules and bulk-job discounts for property managers and chains.',
    },
  ];

  const steps = [
    { n: '01', title: 'Walk-through', desc: 'On-site or virtual scope of work in 24 hours.' },
    { n: '02', title: 'Locked bid', desc: 'Flat-rate proposal — no T&M creep.' },
    { n: '03', title: 'Discreet haul-out', desc: 'Crews uniformed, vehicles unmarked on request.' },
  ];

  const faqs = [
    { q: 'Can you work after hours to avoid disrupting my business?', a: 'Yes. We offer after-hours, early morning, and weekend scheduling for commercial clients. Tell us your preferred window and we coordinate around your operations.' },
    { q: 'Do you offer recurring commercial service?', a: 'Absolutely. We set up weekly, bi-weekly, or monthly removal schedules for businesses generating ongoing waste. Volume discounts apply for recurring contracts.' },
    { q: 'Can you handle a full office or warehouse cleanout?', a: 'Yes. From single-item removals to multi-floor decommissioning, we bring the crew, trucks, and equipment needed to finish the job in as few visits as possible.' },
    { q: 'Are you insured for commercial properties?', a: 'Every provider in our network carries full liability insurance. We provide Certificates of Insurance before the job starts on any commercial site.' },
    { q: 'Do you handle e-waste and secure data destruction?', a: 'Yes. We responsibly recycle electronics through certified e-waste partners and can coordinate hard-drive destruction with chain-of-custody documentation.' },
    { q: 'Can you work with property managers and chains?', a: 'We partner with property management firms, retail chains, and franchise operators across multiple locations. Centralized billing and dedicated account reps available.' },
  ];

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Commercial"
        title={<>Built for<br />business.</>}
        subtitle="Office furniture, IT equipment, retail fixtures, warehouse clearouts. After-hours scheduling, certificate-ready insurance, and crews that work around your operations."
        image="/workers-opek.webp"
        imageAlt="Commercial junk removal crew at work"
        imageCaption="COI Available • After-Hours • Volume Pricing"
        primaryCta={{ label: 'Request Bid', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Schedule Walkthrough', onClick: () => navigate('/in-home-estimate') }}
      />

      <StatsStrip
        stats={[
          { value: '1,200+', label: 'Commercial Jobs' },
          { value: '24 hr', label: 'Bid Turnaround' },
          { value: 'COI', label: 'Insurance Ready' },
          { value: '50', label: 'States Served' },
        ]}
      />

      {/* Sectors */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">What We Clear</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
                Every commercial scenario.<br />
                <span className="text-brand">One vendor.</span>
              </h2>
            </div>
            <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right">
              From a single workstation to a 40,000 sq ft decommission — same flat-rate model.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((item) => (
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

      {/* Why us */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why Opek</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight max-w-3xl">
              Operational continuity. <span className="text-brand">Zero surprises.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {whyUs.map((item, idx) => (
              <div key={item.title} className={`group ${idx === 1 ? 'md:mt-12' : idx === 2 ? 'md:mt-6' : ''}`}>
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
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Engagement</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-5">
                From walkthrough to <span className="text-brand">empty floor.</span>
              </h2>
              <p className="text-secondary-500 text-base leading-relaxed mb-6">
                A simple, predictable engagement built for facilities teams, real estate brokers, and operations managers.
              </p>
              <button
                onClick={() => navigate('/quote')}
                className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-2"
              >
                Request a Bid <ArrowRight size={16} />
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
            "We decommissioned a 22,000 sq ft office over a weekend. Crew arrived Friday at 7pm, keys back to the landlord by Sunday night. Flawless."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-black">D</div>
            <div>
              <p className="font-bold text-sm">David K.</p>
              <p className="text-xs text-white/60">Facilities Director • SaaS Co.</p>
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
      <section className="py-16 md:py-20 bg-white border-t border-secondary-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Ready to Schedule</p>
          <h2 className="text-2xl md:text-3xl font-black text-secondary mb-4">
            Empty the space. <span className="text-brand">On schedule.</span>
          </h2>
          <p className="text-secondary-500 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Bid in 24 hours. After-hours and weekend windows available. Volume pricing for ongoing accounts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <button onClick={() => navigate('/quote')}
              className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-brand transition-colors">
              Request a Bid
              <ArrowRight size={14} />
            </button>
            <span className="hidden sm:block w-px h-4 bg-secondary-200" />
            <button onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-brand transition-colors">
              Talk to Sales
              <ArrowRight size={14} />
            </button>
            <span className="hidden sm:block w-px h-4 bg-secondary-200" />
            <a href="tel:8313187139"
              className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-brand transition-colors">
              <Phone size={16} className="text-brand" />
              (831) 318-7139
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
