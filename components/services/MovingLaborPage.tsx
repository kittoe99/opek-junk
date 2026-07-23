import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';

export const MovingLaborPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Moving<br />Labor</>}
        subtitle="Hire strong, experienced independent providers by the hour to load, unload, or rearrange items in your home. You provide the truck or storage unit, vetted providers provide the muscle."
        image="/opek2.webp"
        imageAlt="Moving labor team lifting a heavy sofa"
        primaryCta={{ label: 'Book Labor', onClick: () => navigate('/booking') }}
        secondaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
      />

      <TrustBadges />

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Moving labor in three steps"
        subtitle="Book by the hour, get matched with strong crews, and leave the heavy lifting to them."
      />

      <EditorialContentSection title="Heavy lifting & professional moving labor">
        <p>
          Sometimes you don't need a full-service moving company or junk removal truck—you just need a few strong pairs of hands. Vetted moving labor services provide experienced, background-checked independent providers by the hour. Whether you need help loading a rented U-Haul, unloading a PODS container, or simply rearranging heavy furniture within your home, partner providers provide the physical support you need.
        </p>
        <p>
          Partner providers specialize in labor-only assistance. This means you maintain control over transportation and storage, while avoiding the exorbitant fees of traditional moving companies. If you happen to discover items you no longer want while packing or unpacking, a seamless transition to{' '}
          <Link to="/services/junk-removal" className="text-brand hover:underline font-semibold">junk removal</Link>{' '}
          services can clear them away on the spot.
        </p>
        <p>
          Moving labor providers are vetted and available for jobs of all sizes, from quick 2-hour minimums to full-day loading projects. With providers standing by nationwide in cities like{' '}
          <Link to="/locations/los-angeles" className="text-brand hover:underline font-semibold">Los Angeles</Link>{' '}
          and{' '}
          <Link to="/locations/jacksonville" className="text-brand hover:underline font-semibold">Jacksonville</Link>, the platform makes moving safer and significantly less stressful.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />
      <ServiceArea titleStart="Hire the muscle." titleAccent="Skip the moving company." />
    </div>
  );
};
