import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartHandshake, Home, Recycle, ShieldCheck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

export const PropertyCleanoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/property-cleanout"
      eyebrow="Property Cleanouts"
      title={
        <>
          Full Property
          <br />
          Cleanouts
        </>
      }
      subtitle="Estate clearing, foreclosures, move-outs, and hoarding situations. Professional, thorough, and discreet — providers handle the hard parts."
      heroImage="/opek-service-areas.png?v=1"
      heroImageAlt="Provider greeting a customer after a property cleanout"
      heroChip="Discreet & Thorough"
      primaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
      secondaryCta={{ label: 'Schedule Visit', onClick: () => navigate('/in-home-estimate') }}
      split={{
        eyebrow: 'Property clearing',
        title: 'Clear the whole property with care',
        body: (
          <p>
            From estate cleanouts to tenant turnovers, matched crews work with families, agents, and
            landlords at your pace. For single-item jobs, book{' '}
            <Link to="/services/junk-removal" className="text-brand hover:text-brand-400 font-semibold">
              junk removal
            </Link>{' '}
            instead.
          </p>
        ),
        includesLabel: 'Cleanouts include:',
        includes: [
          { title: 'Full Home Clear', Icon: Home },
          { title: 'Compassionate Crews', Icon: HeartHandshake },
          { title: 'Insured Providers', Icon: ShieldCheck },
          { title: 'Responsible Disposal', Icon: Recycle },
        ],
        image: '/opek-hustle-muscle.png?v=2',
        imageAlt: 'Provider with clipboard ready for a property estimate',
      }}
      features={{
        title: 'Cleanouts done right',
        items: [
          {
            title: 'Estate & Move-Out',
            body: 'Clear homes, garages, and storage with crews that respect your timeline and belongings.',
          },
          {
            title: 'Foreclosure & REO',
            body: 'Reliable clearing for agents and property managers — including multi-location coordination.',
          },
          {
            title: 'Discretion First',
            body: 'Background-checked providers. Unmarked vehicles available on request.',
          },
          {
            title: 'Sort & Separate',
            body: 'Keep heirlooms and donations aside while debris and junk are hauled away.',
          },
          {
            title: 'Upfront Pricing',
            body: 'Flat-rate quotes before work begins — no hidden fees mid-job.',
          },
          {
            title: 'Nationwide Coverage',
            body: 'Local pros across all 50 states for residential and light commercial cleanouts.',
          },
        ],
      }}
      serviceArea={{
        titleStart: 'Clear the property.',
        titleAccent: 'With care.',
      }}
      showHustleMuscle={false}
    />
  );
};
