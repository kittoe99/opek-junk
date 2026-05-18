import React from 'react';
import { Phone, MapPin, Truck, Package as Box, Container, ArrowRightLeft, Wrench, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';

export const MovingLaborPage: React.FC = () => {
  const laborServices = [
    { label: 'Truck Loading', desc: 'Safe, dense packing of rented moving trucks', icon: Truck },
    { label: 'Unloading', desc: 'Careful offloading into your new home or office', icon: Box },
    { label: 'Storage Units', desc: 'Moving items into or out of PODS and storage', icon: Container },
    { label: 'In-Home Shuffling', desc: 'Rearranging heavy furniture between rooms', icon: ArrowRightLeft },
    { label: 'Assembly', desc: 'Basic breakdown and reassembly of large furniture pieces', icon: Wrench },
    { label: 'Event Setup', desc: 'Labor for staging, events, and trade shows', icon: Sparkles },
  ];
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Moving<br />Labor</>}
        subtitle="Hire strong, experienced crews by the hour to load, unload, or rearrange items in your home. You provide the truck or storage unit, we provide the muscle."
        image="/workers-opek.webp"
        imageAlt="Moving labor team lifting a heavy sofa"
        imageCaption="Hourly Rates • Insured Crews • Same-Day Available"
        primaryCta={{ label: 'Book Labor', onClick: () => navigate('/booking') }}
        secondaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
      />

      <TrustBadges />

      {/* Dynamic Grid instead of WhatWeHaul */}
      <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Labor Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Muscle On Demand
            </h2>
            <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md">
              Hire the muscle. You provide the truck, we provide the crew.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {laborServices.map((item) => (
              <div 
                key={item.label} 
                className="group relative p-5 md:p-8 bg-secondary-50/50 rounded-2xl border border-transparent hover:border-secondary-100 hover:bg-white hover:shadow-xl transition-all duration-300 flex items-start md:block gap-4 md:gap-0"
              >
                <div className="hidden md:block absolute top-0 left-6 w-8 h-1 bg-brand rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="md:mb-6 shrink-0 mt-0.5 md:mt-0">
                  <item.icon 
                    className="w-7 h-7 md:w-14 md:h-14 text-secondary-300 group-hover:text-brand transition-colors duration-500" 
                    strokeWidth={1.25} 
                  />
                </div>
                <div>
                  <h3 className="font-black text-secondary text-base md:text-lg mb-1 md:mb-2">{item.label}</h3>
                  <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-gray-50 border-t border-secondary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm md:prose-base max-w-none text-secondary-500">
            <h2 className="text-2xl font-bold text-secondary mb-4">Heavy Lifting & Professional Moving Labor Crews</h2>
            <p className="mb-4">
              Sometimes you don't need a full-service moving company or junk removal truck—you just need a few strong pairs of hands. Our <strong>moving labor</strong> service provides you with experienced, background-checked crews by the hour. Whether you need help loading a rented U-Haul, unloading a PODS container, or simply rearranging heavy furniture within your home, our team provides the physical support you need.
            </p>
            <p className="mb-4">
              We specialize in labor-only assistance. This means you maintain control over your transportation and storage, while avoiding the exorbitant fees of traditional moving companies. If you happen to discover items you no longer want while packing or unpacking, we can seamlessly transition to our <Link to="/services/residential-junk-removal" className="text-brand hover:underline font-medium">residential junk removal</Link> or <Link to="/services/donations-pickup" className="text-brand hover:underline font-medium">donations pickup</Link> services to clear them away on the spot. 
            </p>
            <p>
              Our moving labor crews are fully insured and available for jobs of all sizes, from quick 2-hour minimums to full-day loading projects. With crews standing by nationwide in cities like <Link to="/locations/los-angeles" className="text-brand hover:underline font-medium">Los Angeles</Link> and <Link to="/locations/jacksonville" className="text-brand hover:underline font-medium">Jacksonville</Link>, we make moving safer and significantly less stressful. Let our professionals take the weight off your shoulders.
            </p>
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
                Hire the muscle.<br />Skip the moving company.
              </h2>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <button
                  onClick={() => navigate('/quote')}
                  className="w-full sm:w-auto px-8 py-4 bg-secondary text-white text-sm font-bold uppercase tracking-wider hover:bg-secondary-600 transition-all duration-300 shadow-md hover:shadow-xl text-center"
                >
                  Get a Free Quote
                </button>
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full sm:w-auto px-8 py-4 bg-brand text-white text-sm font-bold uppercase tracking-wider hover:bg-brand-600 transition-all duration-300 shadow-md hover:shadow-xl text-center"
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
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Dallas-Fort Worth, TX', slug: 'dallas-fort-worth' },
                  { label: 'Jacksonville, FL', slug: 'jacksonville' },
                  { label: 'Atlanta, GA', slug: 'atlanta' },
                  { label: 'Los Angeles, CA', slug: 'los-angeles' },
                  { label: 'Houston, TX', slug: 'houston' },
                  { label: 'Chicago, IL', slug: 'chicago' },
                  { label: 'Phoenix, AZ', slug: 'phoenix' },
                  { label: 'Miami, FL', slug: 'miami' },
                ].map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="group flex items-center justify-between px-3 py-2.5 bg-secondary-50/50 hover:bg-secondary-50 transition-colors"
                  >
                    <span className="text-secondary text-xs font-medium group-hover:text-brand transition-colors">{city.label}</span>
                    <span className="text-secondary-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
