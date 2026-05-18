import React from 'react';
import { Sofa, Shirt, Utensils, WashingMachine, BedDouble, PackageOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const DonationsPickupPage: React.FC = () => {
  const donations = [
    { label: 'Living Room Furniture', desc: 'Couches, chairs, coffee tables, bookshelves', icon: Sofa },
    { label: 'Clothing & Linens', desc: 'Boxed or bagged clothing, coats, and bedding', icon: Shirt },
    { label: 'Kitchenware', desc: 'Pots, pans, dishes, and small appliances', icon: Utensils },
    { label: 'Large Appliances', desc: 'Working fridges, washers, dryers', icon: WashingMachine },
    { label: 'Bedroom Sets', desc: 'Dressers, nightstands, and bed frames', icon: BedDouble },
    { label: 'Household Goods', desc: 'Toys, books, decor, and miscellaneous items', icon: PackageOpen },
  ];
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Eco-Friendly Service"
        title={<>Donations<br />Pickup</>}
        subtitle="Schedule a pickup for gently used furniture, clothing, and household goods. We sort, transport, and deliver directly to local charities and recycling centers."
        image="/workers-opek.webp"
        imageAlt="Donation pickup team loading items"
        imageCaption="Eco-Friendly • Donation Receipts • Same-Day Available"
        primaryCta={{ label: 'Schedule Pickup', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />

      {/* Dynamic Grid instead of WhatWeHaul */}
      <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Common Donations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Items We Accept
            </h2>
            <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md">
              Gently used items we can transport to local charities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {donations.map((item) => (
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
            <h2 className="text-2xl font-bold text-secondary mb-4">Responsible Donation & Charity Delivery Services</h2>
            <p className="mb-4">
              When you're decluttering, upgrading furniture, or dealing with an <Link to="/services/property-cleanout" className="text-brand hover:underline font-medium">estate cleanout</Link>, throwing usable items in a landfill shouldn't be the only option. Our <strong>donations pickup</strong> service makes it easy to give your gently used goods a second life. We partner with local charities and non-profits to ensure that clothing, furniture, and household items end up in the hands of those who need them most.
            </p>
            <p className="mb-4">
              We handle all the heavy lifting, sorting, and transport. Whether it's a single couch or an entire house full of items, our background-checked crews will carefully remove your donations without damaging your property. Whenever possible, we will provide you with a tax-deductible donation receipt from the receiving charity. Items that cannot be donated are responsibly recycled to minimize environmental impact.
            </p>
            <p>
              Available nationwide, from <Link to="/locations/houston" className="text-brand hover:underline font-medium">Houston</Link> to <Link to="/locations/chicago" className="text-brand hover:underline font-medium">Chicago</Link>, our eco-friendly approach is built into everything we do. If your donation pickup is part of a larger move, our <Link to="/services/moving-labor" className="text-brand hover:underline font-medium">moving labor</Link> team can also assist with loading your moving truck. Need to clear out an office? Our <Link to="/services/commercial" className="text-brand hover:underline font-medium">commercial junk removal</Link> team ensures old desks and chairs are donated to community organizations. Help us keep items out of landfills while supporting your local community.
            </p>
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Pass it on." titleAccent="We do the heavy lifting." />
    </div>
  );
};
