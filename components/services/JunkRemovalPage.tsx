import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Package, Recycle, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

export const JunkRemovalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/junk-removal"
      eyebrow="Nationwide Junk Removal"
      title={
        <>
          Fast Junk
          <br />
          Disposal
        </>
      }
      subtitle="Furniture, appliances, cleanouts, and clutter — book vetted local providers with upfront flat-rate pricing and same-day options."
      heroImage="/opek-hero-haulers.png?v=3"
      heroImageAlt="Junk removal providers lifting a heavy tool chest together"
      heroChip="Heavy Lifting"
      primaryCta={{ label: 'Get Online Price', onClick: () => navigate('/quote') }}
      secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      split={{
        eyebrow: 'Junk haul away',
        title: 'Looking to get rid of your bulky junk?',
        body: (
          <p>
            Whether it&apos;s furniture, appliances, or general clutter, junk removal is simple with your team.
            Local providers handle heavy lifting, quick pickup, reliable hauling, and full-service disposal.
            Need a full clear-out? See{' '}
            <Link to="/services/property-cleanout" className="text-brand hover:text-brand-400 font-semibold">
              property cleanouts
            </Link>
            .
          </p>
        ),
        includes: [
          { title: 'Heavy Lifting', Icon: Dumbbell },
          { title: 'Item Loading', Icon: Package },
          { title: 'Transport Valet', Icon: Truck },
          { title: 'Proper Disposal', Icon: Recycle },
        ],
        image: '/opek-junk-haul-away.png?v=1',
        imageAlt: 'Providers loading a sofa and junk into a box truck',
      }}
      features={{
        title: 'Why book junk removal',
        items: [
          {
            title: 'Easy Booking',
            body: 'Book junk disposal online in minutes — no phone tag, no surprise quotes.',
          },
          {
            title: 'Upfront Pricing',
            body: 'Get a real-time flat rate before you confirm. Guaranteed pricing, no hidden fees.',
          },
          {
            title: 'Same Day Pickup',
            body: 'Next-day or same-day junk pickup when you book before noon in most areas.',
          },
          {
            title: '100% Transparent',
            body: 'Honest haul-away from start to finish. You point — providers do the rest.',
          },
          {
            title: 'Order Tracking',
            body: 'Check status, get an ETA, contact your provider, or reschedule with ease.',
          },
          {
            title: 'Thoughtful Disposal',
            body: 'Sustainable sorting, donation when possible, and responsible disposal.',
          },
        ],
      }}
      serviceArea={{
        titleStart: 'Schedule a pickup.',
        titleAccent: 'Providers handle the rest.',
      }}
    />
  );
};
