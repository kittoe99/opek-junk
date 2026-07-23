import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Home, Package, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

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
      subtitle="Affordable hourly moving help for studios, 1-bedrooms, and small homes. Truck and crew available — or just the muscle."
      heroImage="/opek-related-local-moves.png?v=1"
      heroImageAlt="Provider loading boxes into a cargo van for a local move"
      heroChip="Truck + Crew"
      primaryCta={{ label: 'Book a Move', onClick: () => navigate('/booking') }}
      secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
      split={{
        eyebrow: 'Local relocating',
        title: 'Moving help sized for small jobs',
        body: (
          <p>
            Built for studios and small homes — the jobs big movers overcharge for. Need labor only? Try{' '}
            <Link to="/services/moving-labor" className="text-brand hover:text-brand-400 font-semibold">
              moving labor
            </Link>
            . Clearing leftovers? Add{' '}
            <Link to="/services/junk-removal" className="text-brand hover:text-brand-400 font-semibold">
              junk removal
            </Link>
            .
          </p>
        ),
        includesLabel: 'Moves include:',
        includes: [
          { title: 'Truck Options', Icon: Truck },
          { title: 'Box Loading', Icon: Package },
          { title: 'Hourly Pricing', Icon: Clock },
          { title: 'Small Homes', Icon: Home },
        ],
        image: '/opek-related-local-moves.png?v=1',
        imageAlt: 'Cargo van and provider for small local moves',
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
            body: 'Book a van and helpers, or just extra hands if you already have a truck.',
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
            title: 'On-Time Arrival',
            body: 'Matched providers show up ready to load, haul, and unload the same day when available.',
          },
          {
            title: 'Declutter While You Move',
            body: 'Haul unwanted items in the same trip instead of a second booking.',
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
