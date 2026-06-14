import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Check, Recycle, Trash2, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      title: 'Eco-Friendly Disposal',
      desc: 'We prioritize mattress recycling and donations. Up to 80% of mattress components (steel, foam, fabric, wood) are recycled rather than sent to landfills.',
      icon: Recycle,
    },
    {
      title: 'Hassle-Free Heavy Lifting',
      desc: 'No need to drag your heavy mattress to the curb. Vetted two-person crews enter your property, navigate stairs, and load it safely from any room.',
      icon: BedDouble,
    },
    {
      title: 'On-Demand Scheduling',
      desc: 'Get same-day or next-day mattress pickup. Select your preferred arrival window and receive real-time driver tracking on service day.',
      icon: Clock,
    },
  ];

  const pricingPackages = [
    {
      name: 'Single Mattress / Box Spring',
      desc: 'Removal and eco-friendly disposal of a single twin, full, queen, or king mattress OR box spring.',
      price: 'From $99',
      features: ['Two-person heavy lifting included', 'Disposal surcharges covered', 'Eco-friendly recycling first', 'Inside pickup from any floor'],
    },
    {
      name: 'Mattress & Box Spring Set',
      desc: 'Removal and disposal of a matching mattress and box spring set (or two items of similar volume).',
      price: 'From $149',
      popular: true,
      features: ['Set discount pricing applied', 'Two-person heavy lifting included', 'Disposal surcharges covered', 'Eco-friendly recycling first'],
    },
    {
      name: 'Bulk Mattress Cleanout',
      desc: 'Removal of multiple mattresses, box springs, and headboards. Best for hotels, dorms, and landlords.',
      price: 'Custom Quote',
      features: ['Commercial volume discounts', 'Scheduled/after-hours window', 'COI available on request', 'Dedicated platform manager'],
    },
  ];

  const faqs = [
    {
      q: 'Do you recycle the mattresses?',
      a: 'Yes, we prioritize eco-friendly recycling. Mattresses are delivered to local recycling facilities where they are broken down. The foam is converted to carpet underlay, steel springs are melted down for manufacturing, and wood frames are chipped for mulch.',
    },
    {
      q: 'Do I need to wrap my mattress in a bag?',
      a: 'Generally no, unless your municipality requires it or the mattress is infested with bedbugs. If bedbugs are present, you must wrap the mattress in a sealed plastic mattress bag prior to provider arrival.',
    },
    {
      q: 'Can you pick up a mattress from inside my house?',
      a: 'Yes! Vetted providers will carry the mattress from any room, attic, or basement. You do not need to lift a finger or drag it to the curb.',
    },
    {
      q: 'How does pricing work?',
      a: 'Our rates are flat and upfront. The quote covers fuel, transit, two-person labor, and recycling facility disposal surcharges. There are no hidden fees.',
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Same-Day Mattress Pickup"
        title={<>Mattress<br />Disposal & Recycling</>}
        subtitle="Hassle-free, eco-friendly mattress removal. Upfront pricing, background-checked loaders, and zero heavy lifting. We load it from any room and recycle up to 80% of its parts."
        image="/process-step-1.svg"
        imageAlt="Loaders removing a mattress"
        imageCaption="Nationwide Service • Eco-Friendly Recycling • Fully Insured"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
        compact
      />

      <TrustBadges />

      {/* Benefits Section */}
      <section className="py-16 bg-white border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why Choose Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight">
              Responsible Mattress Disposal Made Simple
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="p-6 bg-secondary-50/50 rounded-2xl border border-secondary-100/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-6">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-black text-secondary mb-3">{benefit.title}</h3>
                  <p className="text-sm text-secondary-500 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Packages Section */}
      <section className="py-16 bg-secondary-50/50 border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight">
              Transparent Flat-Rate Pricing
            </h2>
            <p className="text-sm text-secondary-500 mt-2">
              Select a service type below to view your upfront price estimation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPackages.map((pkg, i) => (
              <div 
                key={i} 
                className={`relative bg-white rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                  pkg.popular 
                    ? 'border-brand ring-2 ring-brand/10 md:-translate-y-2' 
                    : 'border-secondary-100'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-black text-secondary mb-2">{pkg.name}</h3>
                  <p className="text-xs text-secondary-400 leading-relaxed mb-6">{pkg.desc}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-black text-secondary">{pkg.price}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs text-secondary-500">
                        <Check size={14} className="text-brand shrink-0 mt-0.5" strokeWidth={3} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/quote')}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-brand text-white hover:bg-brand-600 shadow-md shadow-brand/10'
                      : 'bg-secondary text-white hover:bg-secondary-600'
                  }`}
                >
                  <span>View Pricing</span>
                  <ArrowRight size={13} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-b border-secondary-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-secondary tracking-tight">
              Hassle-Free Pickup in 3 Simple Steps
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { step: '1', title: 'Get Your Price Quote', desc: 'Click "View Pricing" to tell us your mattress size and select a pickup date. Receive an instant upfront quote in seconds.' },
              { step: '2', title: 'Schedule an Arrival Window', desc: 'Choose a convenient day and a 2-hour arrival window. You will receive a tracking link showing the provider’s live arrival time.' },
              { step: '3', title: 'Loaders Do the Rest', desc: 'Vetted hauling professionals arrive, load the mattress from any room in your home, sweep the area, and deliver it to a local recycling partner.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-secondary text-white font-black flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-black text-secondary text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-secondary-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/quote')}
              className="px-10 py-4.5 bg-brand text-white font-black text-xs uppercase tracking-widest hover:bg-brand-600 hover:shadow-xl transition-all duration-300 rounded-xl inline-flex items-center gap-2"
            >
              <span>View Pricing & Book</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary-50/50 border-b border-secondary-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-secondary tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
                <h3 className="font-black text-secondary text-base mb-2">{faq.q}</h3>
                <p className="text-sm text-secondary-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Clear your space." titleAccent="Same-day booking available." />
    </div>
  );
};
