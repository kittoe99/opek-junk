import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';

export const JunkRemovalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Junk<br />Removal</>}
        subtitle="Residential & commercial clearing. Furniture, appliances, office decommissioning, and retail fixtures. Upfront pricing, same-day availability, and vetted local providers."
        image="/opek2.webp"
        imageAlt="Junk removal team loading a truck"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Three simple steps to a clutter-free space"
        subtitle="Get an upfront price, matched providers, and same-day pickup in most areas."
      />

      <EditorialContentSection title="Comprehensive junk removal for homes & businesses">
        <p>
          When it comes to clearing out unwanted items, finding a reliable, full-service junk removal provider is crucial. Whether you are decluttering your home, preparing for a move, decommissioning an office, or clearing out warehouse inventory, partner service providers ensure a stress-free experience. Vetted providers handle all heavy lifting, sorting, and eco-friendly disposal.
        </p>
        <p>
          Partner service providers specialize in both <strong className="text-secondary font-bold">residential and commercial junk removal</strong>, serving communities nationwide. For homeowners, they handle everything from single furniture items to full attic and estate cleanouts. For business clients, they offer after-hours scheduling, secure e-waste disposal, volume pricing, and full Certificates of Insurance (COI).
        </p>
        <p>
          Beyond standard junk removal, partner service providers also provide specialized{' '}
          <Link to="/services/property-cleanout" className="text-brand hover:underline font-semibold">property cleanouts</Link>{' '}
          for estates, foreclosures, and tenant turnovers. Need help loading or unloading a moving truck? Check out{' '}
          <Link to="/services/moving-labor" className="text-brand hover:underline font-semibold">moving labor</Link>{' '}
          services for reliable, hourly assistance.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />
      <ServiceArea titleStart="Schedule a pickup." titleAccent="Providers handle the rest." />
    </div>
  );
};
