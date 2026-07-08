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
const ContainerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6V4M16 6V4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DollarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 7v10M9 9.5c0-1 1.5-1.5 3-1.5s3 .5 3 1.5-1.5 1.5-3 2-3 1-3 1.5 1.5 1.5 3 1.5 3-.5 3-1.5" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l8 4v6c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V6l8-4z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12l2 2 4-4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14h2v2H8z" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1 3h15v13H1zM16 8h4l3 4v4h-7V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="18.5" cy="18.5" r="2.5" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

export const DumpsterRentalPage: React.FC = () => {
  const navigate = useNavigate();

  const sizes = [
    {
      label: '10-Yard Dumpster',
      desc: '10ft × 8ft × 3.5ft · 1–2 tons. Small basement/garage cleanouts, yard waste, single room remodels.',
      icon: ContainerIcon,
    },
    {
      label: '15-Yard Dumpster',
      desc: '14ft × 8ft × 4ft · 2 tons. Multi-room decluttering, carpet removal, medium deck demo.',
      icon: ContainerIcon,
    },
    {
      label: '20-Yard Dumpster',
      desc: '20ft × 8ft × 4ft · 2–3 tons. Whole-house cleanouts, roof shingle replacement, large renovation debris.',
      icon: ContainerIcon,
    },
    {
      label: '30-Yard Dumpster',
      desc: '20ft × 8ft × 6ft · 3–4 tons. Commercial building cleanouts, major construction, home additions.',
      icon: ContainerIcon,
    },
  ];

  const benefits = [
    { label: 'Flat-Rate Pricing', desc: 'Delivery, rental period, pickup, and disposal bundled upfront. No hidden fees.', icon: DollarIcon },
    { label: 'Driveway Protection', desc: 'Protective boards placed under wheels to protect driveways from damage.', icon: ShieldIcon },
    { label: 'Flexible Rental Periods', desc: 'Keep the dumpster for a weekend, a week, or longer. Timelines adapt to your project.', icon: CalendarIcon },
    { label: 'On-Time Delivery', desc: 'Prompt drop-off and pickup by professional drivers who respect your property.', icon: TruckIcon },
  ];

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

      <BentoFeatureSection
        eyebrow="Sizing Guide"
        title={
          <>
            Find the
            <br />
            <span className="text-brand">perfect size.</span>
          </>
        }
        description="Different projects require different containers. Select the size that fits your cleanup needs."
        items={sizes}
      />

      <BentoFeatureSection
        eyebrow="Why Rent"
        title={
          <>
            Stress-free
            <br />
            <span className="text-brand">containers.</span>
          </>
        }
        description="Every rental includes flat-rate pricing, driveway protection, and flexible timelines."
        items={benefits}
      />

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
