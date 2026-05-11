import React, { useState } from 'react';
import { ArrowRight, ChevronDown, PackageOpen, Home, KeyRound, Building, Heart, Sparkles, Clock, Lock, Recycle, Quote, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { StatsStrip } from '../shared/StatsStrip';

export const PropertyCleanoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scenarios = [
    { icon: Home, label: 'Estate Cleanouts', desc: 'Full-home clearing with donation coordination' },
    { icon: KeyRound, label: 'Move-Outs & Rentals', desc: 'Tenant turnovers and end-of-lease clears' },
    { icon: Building, label: 'Foreclosures', desc: 'Bank-owned and REO trash-outs to broom-swept' },
    { icon: Heart, label: 'Hoarding Situations', desc: 'Compassionate, discreet, paced to your needs' },
    { icon: Sparkles, label: 'Pre-Sale Prep', desc: 'Get a property listing-ready in days, not weeks' },
    { icon: Recycle, label: 'Donation Sorting', desc: 'On-site sorting with receipts where applicable' },
  ];

  const whyUs = [
    {
      icon: Clock,
      title: 'Fast turnarounds',
      desc: 'Most full-home cleanouts done in a single day. Multi-property contracts within the week.',
    },
    {
      icon: Lock,
      title: 'Discreet and trustworthy',
      desc: 'Background-checked crews, unmarked vehicles on request, and locked truck transport.',
    },
    {
      icon: Heart,
      title: 'Handled with care',
      desc: 'Whether estate or hoarding, we work at your pace and treat every item with respect.',
    },
  ];

  const steps = [
    { n: '01', title: 'Walk-through', desc: 'Free in-home or virtual assessment of the property.' },
    { n: '02', title: 'Flat quote', desc: 'One price for the whole job — sorting, hauling, sweeping.' },
    { n: '03', title: 'Broom-swept', desc: 'Property left ready for listing, tenants, or closing.' },
  ];

  const faqs = [
    { q: 'How long does a full property cleanout take?', a: 'Most 3-bedroom homes take 4–8 hours with a full crew. Larger estates or multi-floor properties may run 1–2 days. We give you an honest time estimate when we provide your quote.' },
    { q: 'Do you handle sensitive situations like hoarding or estate cleanouts?', a: 'Yes. Our crews are trained to handle these situations with discretion and compassion. We work at your pace, treat every item with respect, and pause anytime you need to review something.' },
    { q: 'Can you coordinate donations and recycling?', a: 'Absolutely. We sort items on-site and donate usable furniture, clothing, and household goods to local charities. You receive a donation receipt where applicable for tax purposes.' },
    { q: 'Do you work with real estate agents and property managers?', a: 'Yes — we regularly partner with real estate professionals, landlords, REO asset managers, and property managers for fast-turnaround cleanouts between tenants or before listing.' },
    { q: 'What happens to items of value or sentimental importance?', a: 'We never throw out anything that looks valuable or personal without explicit approval. Photos, documents, jewelry, and heirlooms are set aside for your review.' },
    { q: 'Are you insured for property cleanouts?', a: 'Yes. Every provider in our network carries full liability coverage. We can provide a Certificate of Insurance to property managers, executors, or REO clients on request.' },
  ];

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Property Cleanouts"
        title={<>Done<br />with care.</>}
        subtitle="Estate clearing, foreclosures, move-outs, and hoarding situations. Professional, thorough, and discreet — we handle the hard parts so you don't have to."
        image="/estimates (1).webp"
        imageAlt="Property cleanout team clearing a home"
        imageCaption="Discreet • Insured • Broom-Swept Finish"
        primaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Schedule Visit', onClick: () => navigate('/in-home-estimate') }}
      />

      <StatsStrip
        stats={[
          { value: '800+', label: 'Properties Cleared' },
          { value: '1 Day', label: 'Avg Cleanout' },
          { value: '70%', label: 'Donated/Recycled' },
          { value: '100%', label: 'Broom-Swept' },
        ]}
      />

      {/* Scenarios */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">What We Handle</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
                Every situation,<br />
                <span className="text-brand">handled with respect.</span>
              </h2>
            </div>
            <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right">
              From inherited estates to bank-owned trash-outs, we know how sensitive these jobs can be.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((item) => (
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
              Trusted with the <span className="text-brand">hardest jobs.</span>
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
                From inherited mess<br />
                to <span className="text-brand">listing-ready.</span>
              </h2>
              <p className="text-secondary-500 text-base leading-relaxed mb-6">
                A simple, predictable process for executors, property managers, and families navigating life transitions.
              </p>
              <button
                onClick={() => navigate('/in-home-estimate')}
                className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-brand transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-2"
              >
                Book a Walk-Through <ArrowRight size={16} />
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
            "After my mom passed, I dreaded clearing her house. The Opek crew was patient, kind, and saved every photo and document for me to review. I'll never forget that."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-black">L</div>
            <div>
              <p className="font-bold text-sm">Lauren P.</p>
              <p className="text-xs text-white/60">Estate Cleanout • Phoenix, AZ</p>
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
                  <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">When You're Ready</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-4">
                  Clear the property. <span className="text-brand">With grace.</span>
                </h2>
                <p className="text-secondary-500 text-base leading-relaxed">
                  No-pressure quote. We'll walk through together, give you a fair number, and only proceed when you say so.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/quote')}
                  className="px-8 py-4 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 shadow-md rounded-lg"
                >
                  Get a Free Quote <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/in-home-estimate')}
                  className="px-8 py-4 bg-brand text-white font-bold text-sm uppercase tracking-wider hover:bg-brand-600 transition-colors inline-flex items-center justify-center gap-2 shadow-md rounded-lg"
                >
                  Schedule a Walk-Through <ArrowRight size={16} />
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
