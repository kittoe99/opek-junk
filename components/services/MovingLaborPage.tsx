import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Dumbbell, Package, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

export const MovingLaborPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/moving-labor"
      eyebrow="Hourly Moving Labor"
      title={
        <>
          Moving
          <br />
          Labor
        </>
      }
      subtitle="Hire strong, vetted providers by the hour to load, unload, or rearrange. You provide the truck or storage — they provide the muscle."
      heroImage="/opek-related-moving.png?v=1"
      heroImageAlt="Moving labor providers carrying furniture"
      heroChip="By the Hour"
      primaryCta={{ label: 'Book Labor', onClick: () => navigate('/booking') }}
      secondaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
      split={{
        eyebrow: 'Labor only',
        title: 'Need muscle, not a full moving company?',
        body: (
          <p>
            Perfect for U-Haul loading, PODS unloading, and rearranging heavy furniture. Found junk while
            packing? Add{' '}
            <Link to="/services/junk-removal" className="text-brand hover:text-brand-400 font-semibold">
              junk removal
            </Link>{' '}
            in the same visit. Prefer truck + crew? See{' '}
            <Link to="/services/small-local-moves" className="text-brand hover:text-brand-400 font-semibold">
              small local moves
            </Link>
            .
          </p>
        ),
        includesLabel: 'Labor includes:',
        includes: [
          { title: 'Heavy Lifting', Icon: Dumbbell },
          { title: 'Load & Unload', Icon: Package },
          { title: 'Hourly Rates', Icon: Clock },
          { title: 'Truck Optional', Icon: Truck },
        ],
        image: '/opek-related-moving.png?v=1',
        imageAlt: 'Hourly moving labor carrying a dresser',
      }}
      features={{
        title: 'Moving labor that fits',
        items: [
          {
            title: 'Book by the Hour',
            body: 'Pay for the help you need — from quick 2-hour jobs to full-day loading projects.',
          },
          {
            title: 'You Keep Control',
            body: 'Bring your own truck or storage unit. Providers handle the physical work.',
          },
          {
            title: 'Vetted Crews',
            body: 'Background-checked, insured independent providers matched to your job size.',
          },
          {
            title: 'Furniture Moves',
            body: 'Rearrange rooms, haul heavy pieces upstairs, or stage a home for showings.',
          },
          {
            title: 'Same-Day Options',
            body: 'Fast booking in most metros when you need help today or tomorrow.',
          },
          {
            title: 'Add Junk Removal',
            body: 'Clear unwanted items on the spot instead of paying a second crew later.',
          },
        ],
      }}
      serviceArea={{
        titleStart: 'Hire the muscle.',
        titleAccent: 'Skip the moving company.',
      }}
    />
  );
};
