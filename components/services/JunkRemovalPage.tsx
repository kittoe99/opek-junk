import React, { useState } from 'react';
import { Home, Building2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { BentoFeatureSection } from '../shared/BentoFeatureSection';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';
const FurnitureIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M4 14c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 14H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ApplianceIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ElectronicsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12l5-3v6l-5-3z" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BedroomIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 11v8M21 11v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 15h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="7" y="11" width="4" height="4" rx="1" className="stroke-brand" strokeWidth="1.5"/>
    <rect x="13" y="11" width="4" height="4" rx="1" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const GarageIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14h4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const YardWasteIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 20l5-9" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OfficeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 22v-4h6v4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" className="stroke-brand" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ServerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="3" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="2" y="15" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="6" cy="6" r="1" className="stroke-brand" strokeWidth="1.5"/>
    <circle cx="6" cy="18" r="1" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const RetailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 9l2.5-5h13L21 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 22V12h6v10" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const WarehouseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 22V12h6v10" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const DebrisIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 11v6M14 11v6" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RecordsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const JunkRemovalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial'>('residential');
  const navigate = useNavigate();

  const residentialItems = [
    { label: 'Furniture', desc: 'Sofas, tables, dressers, mattresses', icon: FurnitureIcon },
    { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves', icon: ApplianceIcon },
    { label: 'Electronics', desc: 'TVs, computers, monitors, e-waste', icon: ElectronicsIcon },
    { label: 'Bedroom Sets', desc: 'Frames, headboards, full bedrooms', icon: BedroomIcon },
    { label: 'Garage Junk', desc: 'Tools, exercise gear, old paint cans', icon: GarageIcon },
    { label: 'Yard Waste', desc: 'Branches, debris, light landscaping', icon: YardWasteIcon },
  ];

  const commercialItems = [
    { label: 'Offices', desc: 'Cubicles, desks, conference tables, filing cabinets', icon: OfficeIcon },
    { label: 'IT & E-Waste', desc: 'Servers, monitors, printers, secure drive disposal', icon: ServerIcon },
    { label: 'Retail Fixtures', desc: 'Shelving, displays, signage, mannequins', icon: RetailIcon },
    { label: 'Warehouse', desc: 'Pallets, racking, inventory, packaging waste', icon: WarehouseIcon },
    { label: 'Construction Debris', desc: 'Drywall, flooring, demo waste, post-build cleanup', icon: DebrisIcon },
    { label: 'Records & Archives', desc: 'Bulk paper, archives, file rooms (shred-ready)', icon: RecordsIcon },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Junk<br />Removal</>}
        subtitle="Residential & commercial clearing. Furniture, appliances, office decommissioning, and retail fixtures. Upfront pricing, same-day availability, and vetted local providers."
        image="/opek2.webp"
        imageAlt="Junk removal team loading a truck"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />

      <BentoFeatureSection
        eyebrow="Solutions"
        title={
          <>
            For any
            <br />
            <span className="text-brand">situation.</span>
          </>
        }
        description="Choose a service sector to explore what partner service providers can clear from your space."
        items={activeTab === 'residential' ? residentialItems : commercialItems}
        tabs={[
          { id: 'residential', label: 'Residential', icon: Home },
          { id: 'commercial', label: 'Commercial', icon: Building2 },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as 'residential' | 'commercial')}
      />

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Three simple steps to a clutter-free space"
        subtitle="Get an upfront price, matched providers, and same-day pickup in most areas."
      />

      <EditorialContentSection title="Comprehensive junk removal for homes & businesses">
        <p>
          When it comes to clearing out unwanted items, finding a reliable, full-service junk removal provider is crucial. Whether you are decluttering your home, preparing for a move, decommissioning an office, or clearing out warehouse inventory, partner service providers ensure a stress-free experience. Vetted providers handle all heavy lifting, sorting, and eco-friendly disposal.
        </p>
        <p>
          Partner service providers specialize in both <strong className="text-secondary font-bold">residential and commercial junk removal</strong>, serving communities nationwide. For homeowners, they handle everything from single furniture items to full attic and estate cleanouts. For business clients, they offer after-hours scheduling, secure e-waste disposal, volume pricing, and full Certificates of Insurance (COI).
        </p>
        <p>
          Beyond standard junk removal, partner service providers also provide specialized{' '}
          <Link to="/services/property-cleanout" className="text-brand hover:underline font-semibold">property cleanouts</Link>{' '}
          for estates, foreclosures, and tenant turnovers. Need help loading or unloading a moving truck? Check out{' '}
          <Link to="/services/moving-labor" className="text-brand hover:underline font-semibold">moving labor</Link>{' '}
          services for reliable, hourly assistance.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />
      <ServiceArea titleStart="Schedule a pickup." titleAccent="Providers handle the rest." />
    </div>
  );
};
