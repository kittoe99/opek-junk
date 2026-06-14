import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Check, Recycle, Clock, ArrowRight } from 'lucide-react';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();

  const pricingPackages = [
    {
      name: 'Single Mattress / Box Spring',
      desc: 'Disposal of a single mattress OR box spring from any room.',
      price: 'From $99',
      features: ['Two-person lifting included', 'Disposal surcharges covered', 'Eco-friendly recycling first'],
    },
    {
      name: 'Mattress & Box Spring Set',
      desc: 'Disposal of a matching mattress and box spring set.',
      price: 'From $149',
      popular: true,
      features: ['Set discount applied', 'Two-person lifting included', 'Eco-friendly recycling first'],
    },
    {
      name: 'Bulk / Commercial removal',
      desc: 'Best for hotels, dorms, residential landlords, and businesses.',
      price: 'Custom Quote',
      features: ['Commercial volume rates', 'After-hours windows available', 'COI available on request'],
    },
  ];

  const highlights = [
    {
      title: 'Eco-Friendly Recycling',
      desc: 'Up to 80% of mattress parts (steel, foam, fabric, wood) are recycled.',
      icon: Recycle,
    },
    {
      title: 'Inside Pickup',
      desc: 'Vetted professionals load it from any room. No curb dragging required.',
      icon: BedDouble,
    },
    {
      title: 'Same-Day Booking',
      desc: 'Select your preferred arrival window and track loaders in real time.',
      icon: Clock,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Same-Day Mattress Pickup"
        title={<>Mattress<br />Disposal & Recycling</>}
        subtitle="Hassle-free, eco-friendly mattress removal. Upfront pricing, background-checked loaders, and zero heavy lifting. We load it from any room and recycle up to 80% of its parts."
        image="/mattress-disposal.png"
        imageAlt="Loaders removing a mattress"
        imageCaption="Nationwide Service • Eco-Friendly Recycling • Fully Insured"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
        compact
      />

      <TrustBadges />

      {/* Pricing Section */}
      <section className="py-16 bg-white border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Upfront Flat Rates</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight">
              Transparent Pricing Packages
            </h2>
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

      {/* Highlights Section */}
      <section className="py-16 bg-secondary-50/50 border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 bg-white rounded-2xl border border-secondary-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-secondary mb-1">{item.title}</h3>
                    <p className="text-xs text-secondary-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Clear your space." titleAccent="Same-day booking available." />
    </div>
  );
};
