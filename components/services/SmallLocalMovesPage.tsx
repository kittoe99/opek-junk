import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { BentoFeatureSection } from '../shared/BentoFeatureSection';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';

const TruckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1 3h15v13H1zM16 8h4l3 4v4h-7V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5 10h6M5 13h4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10v9a1 1 0 001 1h3v-5a1 1 0 011-1h4a1 1 0 011 1v5h3a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 21V13h6v8" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BoxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="10" r="3" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l7 3v7c0 4-3 7-7 9-4-2-7-5-7-9V5l7-3z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12l2 2 4-4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7v5l3 3" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DollarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 9a3 3 0 0 0-3-3h-1a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-1a3 3 0 0 1-3-3" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SmallLocalMovesPage: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    { label: 'Studio & 1-Bedroom Moves', desc: 'Perfect for apartments and small homes — we handle the heavy lifting', icon: TruckIcon },
    { label: 'Loading & Unloading', desc: 'Load or unload your rental truck with an experienced crew', icon: BoxIcon },
    { label: 'Local Transport', desc: 'Short-distance moves within your city or town', icon: MapPinIcon },
    { label: 'Furniture Assembly', desc: 'Breakdown and reassembly of beds, tables, and more', icon: HomeIcon },
    { label: 'Vetted Providers', desc: 'Background-checked, insured independent providers you can trust', icon: ShieldIcon },
    { label: 'Hourly Pricing', desc: 'Pay only for the time you need — no hidden fees or surprises', icon: DollarIcon },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Small Local Moves"
        title={<>Local<br />Moves</>}
        subtitle="Affordable, hourly moving help for studio and 1-bedroom apartments, small homes, and local relocations. Truck and crew available — or just the muscle."
        image="/opek2.webp"
        imageAlt="Moving crew helping with a local move"
        primaryCta={{ label: 'Book a Move', onClick: () => navigate('/booking') }}
        secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
      />

      <TrustBadges />

      <BentoFeatureSection
        eyebrow="What We Cover"
        title={
          <>
            Small moves,
            <br />
            <span className="text-brand">big savings.</span>
          </>
        }
        description="Hourly moving help tailored for local, small-scale relocations — no truck required."
        items={services}
      />

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Moving made simple"
        subtitle="Book online, get matched with a vetted crew, and let them handle the heavy lifting."
      />

      <EditorialContentSection title="Moving help when you need it">
        <p>
          Moving doesn't have to mean renting a massive truck or paying thousands for a full-service mover. 
          Small local moves are designed for studios, 1-bedroom apartments, and small homes — the jobs 
          that big moving companies overcharge for. Whether you need a truck and crew or just extra hands, 
          partner providers show up on time and get the job done.
        </p>
        <p>
          Every provider is vetted, background-checked, and rated by real customers. You pay by the hour 
          for exactly the help you need — no minimums that don't fit, no surprise fees. Add{' '}
          <Link to="/services/junk-removal" className="text-brand hover:underline font-semibold">
            junk removal
          </Link>{' '}
          to your move and clear out unwanted items in the same trip.
        </p>
        <p>
          Serving cities across the country including{' '}
          <Link to="/locations/los-angeles" className="text-brand hover:underline font-semibold">
            Los Angeles
          </Link>,{' '}
          <Link to="/locations/jacksonville" className="text-brand hover:underline font-semibold">
            Jacksonville
          </Link>, and more — small local moves are the affordable way to get from point A to point B.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />
      <ServiceArea titleStart="Moving locally?" titleAccent="We've got you covered." />
    </div>
  );
};
