import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Package, ShieldCheck, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

const approaches = [
  {
    title: 'Easy Booking',
    body: 'Book junk disposal online in minutes — the convenient way to clear clutter in your city.',
  },
  {
    title: 'In-Home Removal',
    body: 'Providers lift and load from any room or floor. You point — they do the rest.',
  },
  {
    title: 'Same Day Pickup',
    body: 'Same-day and next-day windows when you book before noon in most areas.',
  },
  {
    title: '100% Transparent',
    body: 'Honest haul-away from start to finish. Know what’s included before you confirm.',
  },
  {
    title: 'Order Tracking',
    body: 'Check status, get an ETA, contact your provider, or reschedule with ease.',
  },
  {
    title: 'Thoughtful Disposal',
    body: 'Sustainable sorting, donation when possible, and responsible disposal.',
  },
];

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

  const goToQuote = () => {
    navigate('/quote');
  };

  return <ServicePageLayout
    path="/lp/junk-removal" eyebrow="Junk Removal Near You" title={<>Fast junk disposal.<br />Right in your area.</>}
    subtitle="Furniture, appliances, cleanouts, and clutter — book vetted local providers with same-day options in your area." heroImage="/optimized/service-scenes/junk-truck.webp" heroImageAlt="Purple dump truck loaded with household junk" heroChip="A clear space"
    primaryCta={{ label: 'View Pricing', onClick: () => goToBooking() }}
    secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
    onZipCheck={goToBooking}
    bookingState={{ serviceType: "Junk Removal" }}
    split={{ eyebrow: 'Junk Removal Near You', title: 'Make room for what matters',
      body: <p>From a single couch to a full garage, your provider handles the lifting, loading and disposal. You point to what goes. Your crew takes it from there.</p>, image: '/optimized/service-scenes/local-moving.webp', imageAlt: 'Two providers loading a sofa into a truck',
      includes: [{ title: 'Flexible scheduling', Icon: CalendarCheck }, { title: 'Careful handling', Icon: Package }, { title: 'Vetted providers', Icon: ShieldCheck }, { title: 'Local crews', Icon: Truck }],
    }}
    features={{ title: 'A better way to clear out', items: approaches }}
    serviceArea={{ titleStart: 'Ready for a fresh start?', titleAccent: 'Find your local crew.' }}
  />;
};
