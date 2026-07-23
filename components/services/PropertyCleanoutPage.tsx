import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';

export const PropertyCleanoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Property<br />Cleanouts</>}
        subtitle="Estate clearing, foreclosures, move-outs, and hoarding situations. Professional, thorough, and discreet — partner service providers handle the hard parts so you don't have to."
        image="/opek2.webp"
        imageAlt="Property cleanout team clearing a home"
        primaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Schedule Visit', onClick: () => navigate('/in-home-estimate') }}
      />

      <TrustBadges />

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Property cleanouts in three steps"
        subtitle="Compassionate crews, upfront pricing, and thorough clearing from start to finish."
      />

      <EditorialContentSection title="Thorough & compassionate property clearing">
        <p>
          Clearing out an entire property can be an overwhelming task. Property cleanout services are designed to handle even the most challenging situations with professionalism, discretion, and care. Whether you are dealing with an estate cleanout, a foreclosure, a tenant move-out, or a sensitive hoarding situation, partner providers approach every job with compassion and efficiency.
        </p>
        <p>
          Providers work closely with families, real estate agents, landlords, and property managers to ensure a seamless experience. Vetted providers are background-checked and can arrive in unmarked vehicles upon request for maximum discretion. From heavy{' '}
          <Link to="/services/junk-removal" className="text-brand hover:underline font-semibold">junk removal</Link>{' '}
          to sorting valuable heirlooms from debris, partner providers work at your pace.
        </p>
        <p>
          Property cleanout services are available nationwide, serving major areas from{' '}
          <Link to="/locations/dallas-fort-worth" className="text-brand hover:underline font-semibold">Dallas-Fort Worth</Link>{' '}
          to{' '}
          <Link to="/locations/phoenix" className="text-brand hover:underline font-semibold">Phoenix</Link>{' '}
          and beyond. Upfront, flat-rate pricing is offered with no hidden fees. If you're a business managing multiple REO properties, a junk removal provider network can also coordinate centralized billing and multi-location support.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />
      <ServiceArea titleStart="Clear the property." titleAccent="With grace." />
    </div>
  );
};
