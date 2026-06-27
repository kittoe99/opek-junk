import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { BentoFeatureSection } from '../shared/BentoFeatureSection';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';
import { QuickActionBar } from '../QuickActionBar';

const TruckLoadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1 3h15v13H1zM16 8h4l3 4v4h-7V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5 10h6M5 13h4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BoxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const StorageIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 12v4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ShuffleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 9v11h11" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="1" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const EventIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 6v6l3 3" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const MovingLaborPage: React.FC = () => {
  const navigate = useNavigate();

  const laborServices = [
    { label: 'Truck Loading', desc: 'Safe, dense packing of rented moving trucks', icon: TruckLoadIcon },
    { label: 'Unloading', desc: 'Careful offloading into your new home or office', icon: BoxIcon },
    { label: 'Storage Units', desc: 'Moving items into or out of PODS and storage', icon: StorageIcon },
    { label: 'In-Home Shuffling', desc: 'Rearranging heavy furniture between rooms', icon: ShuffleIcon },
    { label: 'Assembly', desc: 'Basic breakdown and reassembly of large furniture pieces', icon: WrenchIcon },
    { label: 'Event Setup', desc: 'Labor for staging, events, and trade shows', icon: EventIcon },
  ];

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
      <CharityBanner />

      <BentoFeatureSection
        eyebrow="Labor Services"
        title={
          <>
            Muscle on
            <br />
            <span className="text-brand">demand.</span>
          </>
        }
        description="Hire the muscle. You provide the truck, the platform matches you with the provider."
        items={laborServices}
      />

      <ProcessEditorial />

      <EditorialContentSection title="Heavy Lifting & Professional Moving Labor Services">
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

      <ServiceArea titleStart="Hire the muscle." titleAccent="Skip the moving company." />
      <QuickActionBar onBookOnline={() => navigate('/booking')} />
    </div>
  );
};
