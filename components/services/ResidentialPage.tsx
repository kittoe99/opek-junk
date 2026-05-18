import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { WhatWeHaul } from '../WhatWeHaul';
import { ServiceArea } from '../ServiceArea';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();





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

      <ServiceArea titleStart="Schedule a pickup." titleAccent="We handle the rest." />
    </div>
  );
};
