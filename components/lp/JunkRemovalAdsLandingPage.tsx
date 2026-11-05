import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServicePageLayout } from '../shared/ServicePageLayout';

export const JunkRemovalAdsLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const goToBooking = (zip?: string) => {
    navigate('/booking', {
      state: zip
        ? {
            zipResult: { city: '', state: '', served: true },
            zipValue: zip,
            serviceType: 'Junk Removal',
          }
        : { serviceType: 'Junk Removal' },
    });
  };

  return <ServicePageLayout
    path="/lp/junk-removal" eyebrow="Junk Removal Near You" title={<>Fast junk disposal.<br />Right in your area.</>}
    subtitle="Furniture, appliances, cleanouts, and clutter — book vetted local providers with same-day options in your area." heroImage="/optimized/service-scenes/junk-removal-natural.webp" heroImageAlt="Workers carrying an unwanted armchair toward a hauling truck" heroChip="A clear space"
    primaryCta={{ label: 'View Pricing', onClick: () => goToBooking() }}
    secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
    onZipCheck={goToBooking}
    bookingState={{ serviceType: "Junk Removal" }}
    content={{
      title: 'Junk removal near you',
      body: (
        <>
          <p>
            From a single couch to a full garage, local providers handle the lifting, loading and disposal. You point to
            what goes. Same-day options depend on local availability.
          </p>
          <p>
            <Link to="/quote">Get a quote</Link> or{' '}
            <Link to="/booking" state={{ serviceType: 'Junk Removal' }}>book your pickup</Link> online.
          </p>
        </>
      ),
    }}
    serviceArea={{ titleStart: 'Ready for a fresh start?', titleAccent: 'Find your local crew.' }}
  />;
};
