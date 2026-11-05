import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServicePageLayout } from '../shared/ServicePageLayout';

const DUMPSTER_STATE = { serviceType: 'Dumpster Rental' };

export const DumpsterRentalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/dumpster-rental"
      eyebrow="Roll-Off Dumpster Rental"
      title="Dumpster Rental"
      subtitle="The right container for your project, delivered to your door. Fill it at your pace, then schedule pickup."
      heroImage="/optimized/service-scenes/dumpster-rental-natural.webp"
      heroImageAlt="Roll-off dumpster ready for rental"
      heroChip="Flat-Rate Drop-Off"
      primaryCta={{ label: 'Rent a Dumpster', onClick: () => navigate('/quote', { state: DUMPSTER_STATE }) }}
      secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking', { state: DUMPSTER_STATE }) }}
      onZipCheck={(zip, place) => navigate('/quote', { state: { ...DUMPSTER_STATE, zipValue: zip, zipResult: place } })}
      bookingState={DUMPSTER_STATE}
      content={{
        title: 'Roll-off dumpster rental for home and job sites',
        body: (
          <>
            <p>
              Rent a 10, 15, 20 or 30-yard roll-off dumpster for renovations, construction debris, yard waste and
              whole-house decluttering. Your provider delivers the container, you fill it at your pace, and it&apos;s
              picked up for disposal. Any extra dump or disposal fees are disclosed before booking or on-site.
            </p>
            <p>
              <Link to="/quote" state={DUMPSTER_STATE}>See your rental price</Link> or{' '}
              <Link to="/booking" state={DUMPSTER_STATE}>book online</Link>. Don&apos;t want to load it yourself? Book{' '}
              <Link to="/services/junk-removal">junk removal</Link> or a{' '}
              <Link to="/services/property-cleanout">property cleanout</Link>.
            </p>
          </>
        ),
      }}
      serviceArea={{
        titleStart: 'Clear your site.',
        titleAccent: 'Rent a roll-off dumpster.',
      }}
      showHustleMuscle={false}
    />
  );
};
