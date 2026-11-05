import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServicePageLayout } from '../shared/ServicePageLayout';

export const JunkRemovalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/junk-removal"
      eyebrow="Nationwide Junk Removal"
      title="Junk Removal"
      subtitle="Furniture, appliances, and everyday clutter. Get an upfront price and let a local crew handle the lifting."
      heroImage="/optimized/service-scenes/junk-removal-natural.webp"
      heroImageAlt="Local workers carrying an unwanted armchair toward a hauling truck"
      heroChip="Heavy Lifting"
      primaryCta={{ label: 'Get Online Price', onClick: () => navigate('/quote') }}
      secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      content={{
        title: 'Junk removal and haul away near you',
        body: (
          <>
            <p>
              Opek connects you with local junk removal providers for furniture removal, appliance removal, mattress
              pickup, and garage or yard cleanups. Providers do the lifting, loading, hauling and disposal. Same-day
              options depend on local availability.
            </p>
            <p>
              <Link to="/quote">Get an online price</Link> or <Link to="/booking">book your pickup</Link>. Clearing a
              whole home? See <Link to="/services/property-cleanout">property cleanouts</Link>. Prefer to load it
              yourself? Try <Link to="/services/dumpster-rental">dumpster rental</Link>.
            </p>
          </>
        ),
      }}
      serviceArea={{
        titleStart: 'Schedule a pickup.',
        titleAccent: 'Providers handle the rest.',
      }}
    />
  );
};
