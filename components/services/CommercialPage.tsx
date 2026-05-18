import React from 'react';
import { Briefcase, Server, Armchair, Boxes, Trash2, FileText } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const CommercialPage: React.FC = () => {
  const capabilities = [
    { label: 'Offices', desc: 'Cubicles, desks, conference tables, filing cabinets', icon: Briefcase },
    { label: 'IT & E-Waste', desc: 'Servers, monitors, printers, secure drive disposal', icon: Server },
    { label: 'Retail Fixtures', desc: 'Shelving, displays, signage, mannequins', icon: Armchair },
    { label: 'Warehouse', desc: 'Pallets, racking, inventory, packaging waste', icon: Boxes },
    { label: 'Construction Debris', desc: 'Drywall, flooring, demo waste, post-build cleanup', icon: Trash2 },
    { label: 'Records & Archives', desc: 'Bulk paper, archives, file rooms (shred-ready)', icon: FileText },
  ];
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Commercial<br />Junk Removal</>}
        subtitle="Office furniture, IT equipment, retail fixtures, warehouse clearouts. After-hours scheduling, certificate-ready insurance, and crews that work around your operations."
        image="/workers-opek.webp"
        imageAlt="Commercial junk removal crew at work"
        imageCaption="COI Available • After-Hours • Volume Pricing"
        primaryCta={{ label: 'Request Bid', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Schedule Walkthrough', onClick: () => navigate('/in-home-estimate') }}
      />

      <TrustBadges />

      {/* Dynamic Grid instead of WhatWeHaul */}
      <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Sectors</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Commercial Capabilities
            </h2>
            <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md">
              Every commercial scenario. One reliable vendor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {capabilities.map((item) => (
              <div 
                key={item.label} 
                className="group relative p-5 md:p-8 bg-secondary-50/50 rounded-2xl border border-transparent hover:border-secondary-100 hover:bg-white hover:shadow-xl transition-all duration-300 flex items-start md:block gap-4 md:gap-0"
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
            <h2 className="text-2xl font-bold text-secondary mb-4">Streamlined Corporate & Commercial Junk Removal</h2>
            <p className="mb-4">
              Keeping your business operations running smoothly requires a clean, clutter-free environment. Our <strong>commercial junk removal</strong> services are tailored specifically for businesses, property managers, and retail operations. Whether you are decommissioning an office, clearing out warehouse inventory, or managing a large-scale retail renovation, our team provides fast, reliable, and discreet removal services designed to minimize operational downtime.
            </p>
            <p className="mb-4">
              We understand the unique requirements of commercial spaces. We offer after-hours scheduling, secure e-waste disposal, and volume pricing for recurring cleanouts. Before any work begins, we can provide full Certificates of Insurance (COI) to comply with your building management's requirements. Our flat-rate bidding ensures transparency, so there are no surprises when the job is done. 
            </p>
            <p>
              From corporate offices in <Link to="/locations/dallas-fort-worth" className="text-brand hover:underline font-medium">Dallas-Fort Worth</Link> to retail chains in <Link to="/locations/atlanta" className="text-brand hover:underline font-medium">Atlanta</Link>, we offer nationwide coverage. We also handle specialized requests, including <Link to="/services/property-cleanout" className="text-brand hover:underline font-medium">property cleanouts</Link> for REO assets and <Link to="/services/moving-labor" className="text-brand hover:underline font-medium">moving labor</Link> to assist your facilities team with heavy lifting. Let us handle the heavy lifting while you focus on your business.
            </p>
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Empty the space." titleAccent="On schedule." />
    </div>
  );
};
