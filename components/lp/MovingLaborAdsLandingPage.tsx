import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServicePageLayout } from '../shared/ServicePageLayout';

const MOVING_STATE = { serviceType: 'Moving Labor' };

export const MovingLaborAdsLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const goToBooking = (zip?: string) => {
    navigate('/booking', {
      state: zip
        ? {
            zipResult: { city: '', state: '', served: true },
            zipValue: zip,
            ...MOVING_STATE,
          }
        : MOVING_STATE,
    });
  };

  const goToQuote = () => {
    navigate('/quote', { state: MOVING_STATE });
  };

  return <ServicePageLayout
    path="/lp/moving-labor" eyebrow="Moving Labor Near You" title={<>Moving labor.<br />From $119/hour.</>}
    subtitle="2 moving helpers from $119/hour to load, unload and rearrange. Labor only: you arrange the truck." heroImage="/optimized/service-scenes/moving-help-natural.webp" heroImageAlt="Two moving helpers wrapping a wooden table in a protective blanket" heroChip="Labor only"
    primaryCta={{ label: 'View Pricing', onClick: () => goToQuote() }}
    secondaryCta={{ label: 'Book helpers', onClick: () => goToBooking() }}
    onZipCheck={goToBooking}
    bookingState={MOVING_STATE}
    content={{
      title: 'Moving helpers near you, by the hour',
      body: (
        <>
          <p>
            Hire local moving labor to load or unload a rental truck, POD or storage unit, or to rearrange at home.
            Rates start at $119/hour for 2 helpers and $149/hour for 3. Helpers don&apos;t bring or drive a truck.
          </p>
          <p>
            <Link to="/quote" state={MOVING_STATE}>See your price</Link> or{' '}
            <Link to="/booking" state={MOVING_STATE}>book helpers</Link> online.
          </p>
        </>
      ),
    }}
    serviceArea={{ titleStart: 'Need extra hands?', titleAccent: 'Find helpers near you.' }}
  />;
};
