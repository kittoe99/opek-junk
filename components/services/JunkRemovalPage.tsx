import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  Sofa, 
  WashingMachine, 
  Tv, 
  BedDouble, 
  Wrench, 
  Leaf, 
  Briefcase, 
  Server, 
  Armchair, 
  Boxes, 
  Trash2, 
  FileText 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const JunkRemovalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial'>('residential');
  const navigate = useNavigate();

  const residentialItems = [
    { label: 'Furniture', desc: 'Sofas, tables, dressers, mattresses', icon: Sofa },
    { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves', icon: WashingMachine },
    { label: 'Electronics', desc: 'TVs, computers, monitors, e-waste', icon: Tv },
    { label: 'Bedroom Sets', desc: 'Frames, headboards, full bedrooms', icon: BedDouble },
    { label: 'Garage Junk', desc: 'Tools, exercise gear, old paint cans', icon: Wrench },
    { label: 'Yard Waste', desc: 'Branches, debris, light landscaping', icon: Leaf },
  ];

  const commercialCapabilities = [
    { label: 'Offices', desc: 'Cubicles, desks, conference tables, filing cabinets', icon: Briefcase },
    { label: 'IT & E-Waste', desc: 'Servers, monitors, printers, secure drive disposal', icon: Server },
    { label: 'Retail Fixtures', desc: 'Shelving, displays, signage, mannequins', icon: Armchair },
    { label: 'Warehouse', desc: 'Pallets, racking, inventory, packaging waste', icon: Boxes },
    { label: 'Construction Debris', desc: 'Drywall, flooring, demo waste, post-build cleanup', icon: Trash2 },
    { label: 'Records & Archives', desc: 'Bulk paper, archives, file rooms (shred-ready)', icon: FileText },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Junk<br />Removal</>}
        subtitle="Residential & commercial clearing. Furniture, appliances, office decommissioning, and retail fixtures. Upfront pricing, same-day availability, and vetted local providers."
        image="/process-step-3.svg"
        imageAlt="Junk removal team loading a truck"
        imageCaption="Vetted Providers • Eco-Friendly • Same-Day Available"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />

      {/* Dynamic Solutions Section */}
      <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Solutions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Junk Removal For Any Situation
            </h2>
            <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md mx-auto">
              Choose a service sector to explore what partner service providers can clear from your space.
            </p>
          </div>

          {/* Toggle pill */}
          <div className="max-w-md mx-auto p-1.5 bg-secondary-50 rounded-2xl flex border border-secondary-100 mb-12">
            <button
              onClick={() => setActiveTab('residential')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'residential'
                  ? 'bg-white text-secondary shadow-md ring-1 ring-secondary-100'
                  : 'text-secondary-400 hover:text-secondary'
              }`}
            >
              <Home size={14} className={activeTab === 'residential' ? 'text-brand' : ''} />
              Residential
            </button>
            <button
              onClick={() => setActiveTab('commercial')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'commercial'
                  ? 'bg-white text-secondary shadow-md ring-1 ring-secondary-100'
                  : 'text-secondary-400 hover:text-secondary'
              }`}
            >
              <Building2 size={14} className={activeTab === 'commercial' ? 'text-brand' : ''} />
              Commercial
            </button>
          </div>

          {/* Active Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {(activeTab === 'residential' ? residentialItems : commercialCapabilities).map((item) => (
              <div 
                key={item.label} 
                className="group relative p-5 md:p-8 bg-secondary-50/50 rounded-2xl border border-transparent hover:border-secondary-100 hover:bg-white hover:shadow-xl transition-all duration-300 flex items-start md:block gap-4 md:gap-0 animate-fade-in"
              >
                <div className="hidden md:block absolute top-0 left-6 w-8 h-1 bg-brand rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="md:mb-6 shrink-0 mt-0.5 md:mt-0">
                  <item.icon 
                    className="w-7 h-7 md:w-14 md:h-14 text-secondary-300 group-hover:text-brand transition-colors duration-500" 
                    strokeWidth={1.25} 
                  />
                </div>
                <div>
                  <h3 className="font-black text-secondary text-base md:text-lg mb-1 md:mb-2">{item.label}</h3>
                  <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-gray-50 border-t border-secondary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm md:prose-base max-w-none text-secondary-500">
            <h2 className="text-2xl font-bold text-secondary mb-4">Comprehensive Junk Removal Services for Homes & Businesses</h2>
            <p className="mb-4">
              When it comes to clearing out unwanted items, finding a reliable, full-service junk removal provider is crucial. Whether you are decluttering your home, preparing for a move, decommissioning an office, or clearing out warehouse inventory, the partner service providers ensure a stress-free experience. Vetted providers handle all heavy lifting, sorting, and eco-friendly disposal, so you don't have to lift a finger.
            </p>
            <p className="mb-4">
              Partner service providers specialize in both <strong>residential and commercial junk removal</strong>, serving communities nationwide. For homeowners, they handle everything from single furniture items to full attic and estate cleanouts. For business clients, they understand the importance of speed and compliance, offering after-hours scheduling, secure e-waste disposal, volume pricing, and full Certificates of Insurance (COI) to meet building management requirements.
            </p>
            <p className="mb-4">
              Beyond standard junk removal, partner service providers also provide specialized <Link to="/services/property-cleanout" className="text-brand hover:underline font-medium">property cleanouts</Link> for estates, foreclosures, and tenant turnovers. If you have gently used items that shouldn't go to waste, donation pickups can be coordinated to ensure they reach local charities. Need help loading or unloading a moving truck? Check out <Link to="/services/moving-labor" className="text-brand hover:underline font-medium">moving labor</Link> services for reliable, hourly assistance.
            </p>
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Schedule a pickup." titleAccent="Providers handle the rest." />
    </div>
  );
};
