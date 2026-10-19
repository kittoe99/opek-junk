import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Package, ShieldCheck, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

const approaches = [
  {
    title: 'Easy Booking',
    body: 'Book local movers online in minutes — truck + crew or labor only.',
  },
  {
    title: 'From $99/Hour',
    body: 'Starting at $99/hour for 2 moving helpers. Truck optional (+$99 one-time). Clear hourly rates before you confirm.',
  },
  {
    title: 'Right-Sized Crews',
    body: 'Built for studios, apartments, and small local jobs — not oversized long-haul vans.',
  },
  {
    title: 'Truck Optional',
    body: 'Need a truck? Book crew + vehicle. Already have one? Hire helpers only.',
  },
  {
    title: 'Same-Day Options',
    body: 'Same-day and next-day windows when capacity allows in your area.',
  },
  {
    title: 'Vetted Providers',
    body: 'Background-checked local movers matched to your short-distance move.',
  },
];

export const LocalMovesAdsLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const goToBooking = (zip?: string) => {
    navigate('/booking', {
      state: zip
        ? {
            zipResult: { city: '', state: '', served: true },
            zipValue: zip,
            serviceType: 'Moving Labor',
          }
        : { serviceType: 'Moving Labor' },
    });
  };

  const goToQuote = () => {
    navigate('/quote', { state: { serviceType: 'Moving Labor' } });
  };

  return <ServicePageLayout
    path="/lp/local-moves" eyebrow="Local Movers Near You" title={<>Local moves.<br />From $99/hour.</>}
    subtitle="2 moving helpers from $99/hour. Studios, apartments, and short-distance jobs — truck + crew or labor only." heroImage="/optimized/service-scenes/local-moving.webp" heroImageAlt="Two providers loading furniture into a moving truck" heroChip="Your next chapter"
    primaryCta={{ label: 'View Pricing', onClick: () => goToQuote() }}
    secondaryCta={{ label: 'Book a move', onClick: () => goToBooking() }}
    onZipCheck={goToBooking}
    bookingState={{ serviceType: "Moving Labor" }}
    split={{ eyebrow: 'Local Movers Near You', title: 'Small move. Big help.',
      body: <p>Right-sized crews for studios, apartments and short-distance jobs. Book a vehicle and helpers, or get extra hands if you already have your own truck.</p>, image: '/optimized/service-scenes/local-moving.webp', imageAlt: 'Two providers loading furniture into a moving truck',
      includes: [{ title: 'Flexible scheduling', Icon: CalendarCheck }, { title: 'Careful handling', Icon: Package }, { title: 'Vetted providers', Icon: ShieldCheck }, { title: 'Local crews', Icon: Truck }],
    }}
    features={{ title: 'Your move, your way', items: approaches }}
    serviceArea={{ titleStart: 'A new place is waiting.', titleAccent: 'Let’s get you there.' }}
  />;
};
