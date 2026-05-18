import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { WhatWeHaul } from '../WhatWeHaul';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();



  const steps = [
    { title: 'Snap a photo', desc: 'Text or upload pictures of what needs to go.' },
    { title: 'Lock the price', desc: 'Crew confirms volume and gives a flat quote.' },
    { title: 'We haul it', desc: 'You point, we lift, sweep, and roll out.' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Residential<br />Junk Removal</>}
        subtitle="Furniture, appliances, mattresses, and full home cleanouts. Upfront pricing, same-day availability, and crews that handle every pound — you just point."
        image="/junk-removal.webp"
        imageAlt="Residential junk removal team loading a truck"
        imageCaption="Fully Insured • 70% Recycled • Same-Day Available"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />

      <WhatWeHaul />

      {/* From photo to empty room */}
      <section className="py-16 md:py-20 border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">From Photo to Empty Room</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Simple from start to finish.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <span className="text-8xl font-black text-secondary-50/50 absolute -top-12 -left-4 z-0 pointer-events-none select-none tracking-tighter">
                  0{index + 1}
                </span>
                <div className="relative z-10 pt-6 border-t-2 border-secondary-100">
                  <h3 className="font-black text-secondary text-xl mb-3">{step.title}</h3>
                  <p className="text-secondary-500 text-base leading-relaxed">{step.desc}</p>
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
            <h2 className="text-2xl font-bold text-secondary mb-4">Comprehensive Residential Junk Removal Services</h2>
            <p className="mb-4">
              When it comes to clearing out unwanted items, finding a reliable <strong>residential junk removal</strong> service is crucial. Whether you're decluttering your home, preparing for a move, or dealing with an estate, our professional team ensures a stress-free experience. We handle heavy lifting, sorting, and eco-friendly disposal, so you don't have to lift a finger.
            </p>
            <p className="mb-4">
              Beyond standard household items, we also specialize in comprehensive <Link to="/services/property-cleanout" className="text-brand hover:underline font-medium">property cleanouts</Link> for larger projects. If you are managing a business or office space, our <Link to="/services/commercial" className="text-brand hover:underline font-medium">commercial junk removal</Link> team is fully equipped to handle retail and corporate clear-outs. We proudly serve communities nationwide, including major hubs like <Link to="/locations/dallas-fort-worth" className="text-brand hover:underline font-medium">Dallas-Fort Worth</Link> and <Link to="/locations/atlanta" className="text-brand hover:underline font-medium">Atlanta</Link>.
            </p>
            <p>
              Our commitment goes beyond just hauling junk. We prioritize sustainability by sorting items for our <Link to="/services/donations-pickup" className="text-brand hover:underline font-medium">donations pickup</Link> program, ensuring gently used goods find a second life at local charities rather than ending up in a landfill. Need an extra pair of hands for heavy lifting? Check out our <Link to="/services/moving-labor" className="text-brand hover:underline font-medium">moving labor</Link> services for reliable, hourly assistance.
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
                Schedule a pickup.<br />We handle the rest.
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
