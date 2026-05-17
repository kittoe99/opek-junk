import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Check, Heart, Gift, Truck, Box, Recycle, Clock, Shield, Quote, Star, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { StatsStrip } from '../shared/StatsStrip';

export const DonationsPickupPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const itemTypes = [
    { icon: Heart, label: 'Furniture', desc: 'Sofas, tables, dressers, and chairs in good condition.' },
    { icon: Gift, label: 'Clothing & Toys', desc: 'Boxed or bagged clothing, shoes, and children\'s items.' },
    { icon: Box, label: 'Household Goods', desc: 'Kitchenware, books, decor, and small appliances.' },
  ];

  const whyUs = [
    {
      icon: Clock,
      title: 'Easy Scheduling',
      desc: 'Pick a time that works for you. We handle the heavy lifting.',
    },
    {
      icon: Shield,
      title: 'Tax Deductible',
      desc: 'Receive a donation receipt for your tax records upon request.',
    },
    {
      icon: Recycle,
      title: 'Support Local',
      desc: 'Your items go to local charities and families in need.',
    },
  ];

  const steps = [
    { n: '01', title: 'Schedule Pickup', desc: 'Book online or call us to set a convenient time.' },
    { n: '02', title: 'We Collect', desc: 'Our team arrives and safely removes your donation items.' },
    { n: '03', title: 'Items Delivered', desc: 'We transport your items to local charity centers.' },
  ];

  const faqs = [
    { q: 'What items can be donated?', a: 'We accept gently used furniture, clothing, household goods, books, and working appliances. Items must be free of major stains, tears, or damage.' },
    { q: 'Do you charge for donation pickups?', a: 'Yes, we charge a standard pickup and delivery fee to cover the labor, transportation, and coordination with local charities, saving you the time and effort.' },
    { q: 'Will I get a tax receipt?', a: 'Yes, if the charity provides a receipt upon drop-off, we will pass it along to you for your tax records.' },
  ];

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Donations"
        title={<>Give your items<br />a <span className="text-brand">second life.</span></>}
        subtitle="Convenient donation pickup for gently used furniture, clothing, and household goods. We do the heavy lifting and deliver to local charities."
        image="/junk-removal.webp"
        imageAlt="Team loading donation items"
        imageCaption="Fully Insured • Support Local • Easy Scheduling"
        primaryCta={{ label: 'Schedule Pickup', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <StatsStrip
        stats={[
          { value: '10K+', label: 'Items Donated' },
          { value: '100%', label: 'Local Impact' },
          { value: '< 2 hr', label: 'Avg Arrival' },
          { value: '4.9★', label: 'Customer Rating' },
        ]}
      />

      {/* What we take */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">What We Accept</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
                Items perfect for<br />
                <span className="text-brand">donating.</span>
              </h2>
            </div>
            <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right">
              Gently used items that can benefit families and organizations in your community.
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

      {/* Why us */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why Opek</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight max-w-3xl">
              Donating made <span className="text-brand">effortless.</span>
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
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">How It Works</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-5">
                Three steps to<br />
                <span className="text-brand">make a difference.</span>
              </h2>
              <button
                onClick={() => navigate('/quote')}
                className="mt-6 px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-2"
              >
                Start a Quote <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.n} className="flex gap-5 pb-6 border-b border-secondary-100 last:border-0">
                  <span className="text-3xl md:text-4xl font-black text-brand leading-none shrink-0 w-12">{step.n}</span>
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

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              Common questions.
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
          <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-3">Ready When You Are</p>
          <h2 className="text-2xl md:text-3xl font-black text-secondary mb-4">
            Give back <span className="text-brand">today.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-8">
            <button onClick={() => navigate('/booking')}
              className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-brand transition-colors">
              Book Online
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
