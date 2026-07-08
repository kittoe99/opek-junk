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
const EstateIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 22V12h6v10" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const KeyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="8" cy="15" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13 10l7-7M18 5l2 2" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 22v-4h6v4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" className="stroke-brand" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 8v4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const RecycleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 19H4a2 2 0 0 1-2-2V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 5h3a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 22V12M12 12L8 8M12 12l4-4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PropertyCleanoutPage: React.FC = () => {
  const navigate = useNavigate();

  const scenarios = [
    { label: 'Estate Cleanouts', desc: 'Full-home clearing with donation coordination', icon: EstateIcon },
    { label: 'Move-Outs & Rentals', desc: 'Tenant turnovers and end-of-lease clears', icon: KeyIcon },
    { label: 'Foreclosures', desc: 'Bank-owned and REO trash-outs to broom-swept', icon: BuildingIcon },
    { label: 'Hoarding Situations', desc: 'Compassionate, discreet, paced to your needs', icon: HeartIcon },
    { label: 'Pre-Sale Prep', desc: 'Get a property listing-ready in days, not weeks', icon: SparkleIcon },
    { label: 'Donation Sorting', desc: 'On-site sorting with receipts where applicable', icon: RecycleIcon },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Property<br />Cleanouts</>}
        subtitle="Estate clearing, foreclosures, move-outs, and hoarding situations. Professional, thorough, and discreet — partner service providers handle the hard parts so you don't have to."
        image="/opek2.webp"
        imageAlt="Property cleanout team clearing a home"
        primaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Schedule Visit', onClick: () => navigate('/in-home-estimate') }}
      />

      <TrustBadges />

      <BentoFeatureSection
        eyebrow="Cleanout Specialties"
        title={
          <>
            Handled with
            <br />
            <span className="text-brand">care.</span>
          </>
        }
        description="Every situation, handled with respect and total discretion."
        items={scenarios}
      />

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Property cleanouts in three steps"
        subtitle="Compassionate crews, upfront pricing, and thorough clearing from start to finish."
      />

      <EditorialContentSection title="Thorough & compassionate property clearing">
        <p>
          Clearing out an entire property can be an overwhelming task. Property cleanout services are designed to handle even the most challenging situations with professionalism, discretion, and care. Whether you are dealing with an estate cleanout, a foreclosure, a tenant move-out, or a sensitive hoarding situation, partner providers approach every job with compassion and efficiency.
        </p>
        <p>
          Providers work closely with families, real estate agents, landlords, and property managers to ensure a seamless experience. Vetted providers are background-checked and can arrive in unmarked vehicles upon request for maximum discretion. From heavy{' '}
          <Link to="/services/junk-removal" className="text-brand hover:underline font-semibold">junk removal</Link>{' '}
          to sorting valuable heirlooms from debris, partner providers work at your pace.
        </p>
        <p>
          Property cleanout services are available nationwide, serving major areas from{' '}
          <Link to="/locations/dallas-fort-worth" className="text-brand hover:underline font-semibold">Dallas-Fort Worth</Link>{' '}
          to{' '}
          <Link to="/locations/phoenix" className="text-brand hover:underline font-semibold">Phoenix</Link>{' '}
          and beyond. Upfront, flat-rate pricing is offered with no hidden fees. If you're a business managing multiple REO properties, a junk removal provider network can also coordinate centralized billing and multi-location support.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />
      <ServiceArea titleStart="Clear the property." titleAccent="With grace." />
    </div>
  );
};
