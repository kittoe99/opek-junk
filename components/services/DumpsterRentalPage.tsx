import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';

export const DumpsterRentalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Flexible & Convenient"
        title={<>Dumpster<br />Rental</>}
        subtitle="Roll-off containers delivered directly to your home or job site. Choose from multiple sizes with transparent, flat-rate pricing and prompt drop-offs."
        image="/opek2.webp"
        imageAlt="A clean roll-off dumpster sitting on a residential driveway"
        primaryCta={{ label: 'Rent a Dumpster', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Rent a dumpster in three steps"
        subtitle="Choose your size, get an upfront rate, and schedule delivery on your timeline."
      />

      <EditorialContentSection title="Roll-off dumpster rentals for residential & commercial cleanups">
        <p>
          When dealing with home renovations, construction debris, landscape cleanups, or whole-house decluttering, a roll-off dumpster rental is often the most cost-effective and convenient waste disposal solution. The platform simplifies the rental process with upfront flat-rate pricing, protective placement techniques, and on-schedule drop-offs and pickups.
        </p>
        <p>
          The 10, 15, 20, and 30-yard roll-off containers serve a wide range of needs. Homeowners utilize smaller dumpsters for yard debris and garage clearouts, while building contractors and property managers rely on large 30-yard dumpsters to manage roofing shingles, concrete debris, and commercial construction waste.
        </p>
        <p>
          If you'd rather not lift and load debris yourself, full-service{' '}
          <Link to="/services/junk-removal" className="text-brand hover:underline font-semibold">junk removal</Link>{' '}
          and{' '}
          <Link to="/services/property-cleanout" className="text-brand hover:underline font-semibold">property cleanouts</Link>{' '}
          are also available. Partner providers work with local transfer stations to ensure recyclable building materials are sorted and kept out of landfills whenever possible.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />
      <ServiceArea titleStart="Clear your site." titleAccent="Rent a roll-off dumpster." />
    </div>
  );
};
