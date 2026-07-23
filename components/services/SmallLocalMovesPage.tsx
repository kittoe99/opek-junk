import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';

export const SmallLocalMovesPage: React.FC = () => {
  const navigate = useNavigate();

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
