import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();

  const itemTypes = [
    { label: 'Furniture', desc: 'Sofas, tables, dressers, mattresses' },
    { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves' },
    { label: 'Electronics', desc: 'TVs, computers, monitors, e-waste' },
    { label: 'Bedroom Sets', desc: 'Frames, headboards, full bedrooms' },
    { label: 'Garage Junk', desc: 'Tools, exercise gear, old paint cans' },
    { label: 'Yard Waste', desc: 'Branches, debris, light landscaping' },
  ];

  const steps = [
    { title: 'Snap a photo', desc: 'Text or upload pictures of what needs to go.' },
    { title: 'Lock the price', desc: 'Crew confirms volume and gives a flat quote.' },
    { title: 'We haul it', desc: 'You point, we lift, sweep, and roll out.' },
  ];

  return (
    <div className="bg-white min-h-screen">
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

      <TrustBadges />

      {/* What We Haul */}
      <section className="py-20 border-b border-secondary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">What We Clear</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">What We Haul</h2>
              <p className="text-secondary-500 text-sm mt-3 leading-relaxed">
                From a single couch to a full attic clean — same crew, same flat-rate pricing.
              </p>
            </div>
            <div className="divide-y divide-secondary-100">
              {itemTypes.map((item) => (
                <div key={item.label} className="py-4 flex items-baseline justify-between gap-6">
                  <span className="font-bold text-secondary text-sm">{item.label}</span>
                  <span className="text-secondary-400 text-sm text-right">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* From photo to empty room */}
      <section className="py-20 border-b border-secondary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">From Photo to Empty Room</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">Simple from start to finish.</h2>
            </div>
            <div className="divide-y divide-secondary-100">
              {steps.map((step) => (
                <div key={step.title} className="py-5">
                  <h3 className="font-bold text-secondary text-sm mb-1">{step.title}</h3>
                  <p className="text-secondary-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Service Areas */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">

            {/* CTA */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05] mb-6">
                Schedule a pickup.<br />We handle the rest.
              </h2>
              <div className="flex flex-row items-start mb-8">
                <button
                  onClick={() => navigate('/quote')}
                  className="px-8 py-4 bg-secondary text-white text-sm font-bold uppercase tracking-wider hover:bg-secondary-600 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Get a Free Quote
                </button>
                <button
                  onClick={() => navigate('/booking')}
                  className="px-8 py-4 bg-brand text-white text-sm font-bold uppercase tracking-wider hover:bg-brand-600 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Book Online
                </button>
              </div>
              <a
                href="tel:8313187139"
                className="inline-flex items-center gap-2 text-secondary-400 hover:text-secondary transition-colors text-sm"
              >
                <Phone size={14} />
                <span>(831) 318-7139</span>
              </a>
            </div>

            {/* Service Areas */}
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <MapPin size={13} className="text-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Service Area</span>
              </div>
              <p className="text-2xl font-black text-secondary tracking-tight leading-[1.1] mb-2">Nationwide coverage.</p>
              <p className="text-secondary-400 text-sm leading-relaxed mb-6">Available in all 50 states. Same flat-rate model, same crew standards — wherever you are.</p>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-3">Popular cities</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {[
                  { label: 'Dallas-Fort Worth, TX', slug: 'dallas-fort-worth' },
                  { label: 'Jacksonville, FL', slug: 'jacksonville' },
                  { label: 'Atlanta, GA', slug: 'atlanta' },
                  { label: 'Los Angeles, CA', slug: 'los-angeles' },
                  { label: 'Houston, TX', slug: 'houston' },
                  { label: 'Chicago, IL', slug: 'chicago' },
                  { label: 'Phoenix, AZ', slug: 'phoenix' },
                  { label: 'Miami, FL', slug: 'miami' },
                ].map((city, index, arr) => (
                  <span key={city.slug} className="inline-flex items-center">
                    <Link
                      to={`/locations/${city.slug}`}
                      className="text-secondary text-xs font-medium hover:text-brand transition-colors"
                    >
                      {city.label}
                    </Link>
                    {index < arr.length - 1 && <span className="text-secondary-300 ml-4">·</span>}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
