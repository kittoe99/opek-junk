import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServicePageLayout } from '../shared/ServicePageLayout';

const MOVING_STATE = { serviceType: 'Moving Labor' };

/** Labor-only moving help: helpers load, unload and rearrange. Customers arrange any truck themselves. */
export const MovingLaborPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/moving-labor"
      eyebrow="Moving Labor"
      title="Moving Labor"
      subtitle="Hourly helpers to load, unload and rearrange. Strictly labor: you arrange the truck, POD or storage."
      heroImage="/optimized/service-scenes/moving-help-natural.webp"
      heroImageAlt="Two moving helpers wrapping a wooden table in a protective blanket"
      heroChip="Labor Only"
      primaryCta={{ label: 'Book Helpers', onClick: () => navigate('/booking', { state: MOVING_STATE }) }}
      secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote', { state: MOVING_STATE }) }}
      bookingState={MOVING_STATE}
      content={{
        title: 'Hire moving labor by the hour',
        body: (
          <>
            <p>
              Book local moving helpers to load or unload a rental truck, POD or storage unit, or to rearrange heavy
              furniture at home. Two helpers start at $119/hour. This is labor only: helpers don&apos;t bring or drive a
              truck, and it isn&apos;t a full-service move.
            </p>
            <p>
              <Link to="/quote" state={MOVING_STATE}>Get a quote</Link> or{' '}
              <Link to="/booking" state={MOVING_STATE}>book helpers</Link>. Have items you don&apos;t want to take? Book{' '}
              <Link to="/services/junk-removal">junk removal</Link>. Leaving a rental? Add{' '}
              <Link to="/services/move-out-cleaning">move-out cleaning</Link>.
            </p>
          </>
        ),
      }}
      serviceArea={{
        titleStart: 'Need extra hands?',
        titleAccent: 'Find helpers near you.',
      }}
    />
  );
};
