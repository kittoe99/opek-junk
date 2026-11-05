import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServicePageLayout } from '../shared/ServicePageLayout';

export const PropertyCleanoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/property-cleanout"
      eyebrow="Property Cleanouts"
      title="Property Cleanouts"
      subtitle="From move-outs to estate cleanouts, get thoughtful, thorough help clearing the space."
      heroImage="/optimized/service-scenes/property-cleanouts-card-v3.webp"
      heroImageAlt="Workers clearing household items and wheeling a dresser out of a home"
      heroChip="Discreet & Thorough"
      primaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
      secondaryCta={{ label: 'Schedule Visit', onClick: () => navigate('/in-home-estimate') }}
      content={{
        title: 'Property cleanouts for homes, estates and rentals',
        body: (
          <>
            <p>
              Local providers clear whole homes, garages and storage spaces for estate cleanouts, move-outs, tenant
              turnovers and foreclosures. Set heirlooms and donations aside, and the rest gets hauled away. Families,
              agents and landlords can book for residential and light commercial properties.
            </p>
            <p>
              <Link to="/quote">Get a quote</Link> or{' '}
              <Link to="/in-home-estimate">schedule an in-home estimate</Link>. Only a few items to go? Book{' '}
              <Link to="/services/junk-removal">junk removal</Link>. Need it cleaned afterward? Add{' '}
              <Link to="/services/move-out-cleaning">move-out cleaning</Link>.
            </p>
          </>
        ),
      }}
      serviceArea={{
        titleStart: 'Clear the property.',
        titleAccent: 'With care.',
      }}
      showHustleMuscle={false}
    />
  );
};
