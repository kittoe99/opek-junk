import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Dumbbell, Package, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

/** Combined local moving page — truck + crew and labor-only. */
export const SmallLocalMovesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/small-local-moves"
      eyebrow="Small Local Moves"
      title={
        <>
          Local
          <br />
          Moves
        </>
      }
      subtitle="Affordable hourly moving help for studios, 1-bedrooms, and small homes. Book truck + crew — or just the muscle if you already have a truck."
      heroImage="/opek-related-moving.png?v=1"
      heroImageAlt="Moving providers carrying furniture for a local move"
      heroChip="Truck + Crew"
      primaryCta={{ label: 'Book a Move', onClick: () => navigate('/booking') }}
      secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
      split={{
        eyebrow: 'Labor or full move',
        title: 'Moving help sized for small jobs',
        body: (
          <p>
            Built for studios and small homes — the jobs big movers overcharge for. Need junk cleared while you
            pack? Add{' '}
            <Link to="/services/junk-removal" className="text-brand hover:text-brand-400 font-semibold">
              junk removal
            </Link>{' '}
            in the same visit.
          </p>
        ),
        includesLabel: 'Moves include:',
        includes: [
          { title: 'Truck Options', Icon: Truck },
          { title: 'Load & Unload', Icon: Package },
          { title: 'Hourly Pricing', Icon: Clock },
          { title: 'Labor Only', Icon: Dumbbell },
        ],
        image: '/opek-related-local-moves.png?v=1',
        imageAlt: 'Provider loading boxes into a cargo van for a local move',
      }}
      features={{
        title: 'Local moves, no bloat',
        items: [
          {
            title: 'Studio & 1-Bed Ready',
            body: 'Right-sized crews for apartments and small homes — not oversized moving trucks.',
          },
          {
            title: 'Truck + Crew or Labor',
            body: 'Book a van and helpers, or just extra hands if you already have a truck or storage unit.',
          },
          {
            title: 'Hourly & Transparent',
            body: 'Pay for the time you need with upfront rates and no surprise add-ons.',
          },
          {
            title: 'Vetted Providers',
            body: 'Background-checked local movers rated by real customers.',
          },
          {
            title: 'Same-Day Options',
            body: 'Matched providers show up ready to load, haul, and unload when capacity allows.',
          },
          {
            title: 'Declutter While You Move',
            body: 'Haul unwanted items in the same trip instead of booking a second crew.',
          },
        ],
      }}
      serviceArea={{
        titleStart: 'Moving locally?',
        titleAccent: "We've got you covered.",
      }}
    />
  );
};
