import React from 'react';
import { 
  Container, 
  Calendar, 
  Truck, 
  Scale, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const DumpsterRentalPage: React.FC = () => {
  const navigate = useNavigate();

  const sizes = [
    { 
      name: '10-Yard Dumpster', 
      dims: '10ft L x 8ft W x 3.5ft H', 
      weight: '1-2 Tons (2,000-4,000 lbs)', 
      match: 'Small basement/garage cleanouts, yard waste, single room remodels',
      icon: Container 
    },
    { 
      name: '15-Yard Dumpster', 
      dims: '14ft L x 8ft W x 4ft H', 
      weight: '2 Tons (4,000 lbs)', 
      match: 'Multi-room decluttering, carpet removal, medium deck demo',
      icon: Container 
    },
    { 
      name: '20-Yard Dumpster', 
      dims: '20ft L x 8ft W x 4ft H', 
      weight: '2-3 Tons (4,000-6,000 lbs)', 
      match: 'Whole-house cleanouts, roof shingle replacement, large renovation debris',
      icon: Container 
    },
    { 
      name: '30-Yard Dumpster', 
      dims: '20ft L x 8ft W x 6ft H', 
      weight: '3-4 Tons (6,000-8,000 lbs)', 
      match: 'Commercial building cleanouts, major construction projects, home additions',
      icon: Container 
    },
  ];

  const benefits = [
    { 
      title: 'Flat-Rate Pricing', 
      desc: 'No hidden fees. Delivery, rental period, pickup, and disposal fees are bundled upfront.', 
      icon: DollarSign 
    },
    { 
      title: 'Driveway Protection', 
      desc: 'Protective boards are placed under the dumpster wheels to protect driveways from damage.', 
      icon: ShieldCheck 
    },
    { 
      title: 'Flexible Rental Periods', 
      desc: 'Keep the dumpster for a weekend, a week, or longer. Rental timelines adapt to your project.', 
      icon: Calendar 
    },
    { 
      title: 'On-Time Delivery', 
      desc: 'Prompt drop-off and pickup by professional drivers who respect your property.', 
      icon: Truck 
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Flexible & Convenient"
        title={<>Dumpster<br />Rental</>}
        subtitle="Roll-off containers delivered directly to your home or job site. Choose from multiple sizes with transparent, flat-rate pricing and prompt drop-offs."
        image="/dumpster-rental.svg"
        imageAlt="A clean roll-off dumpster sitting on a residential driveway"
        imageCaption="Driveway Protection • Flat Rates • Next-Day Available"
        primaryCta={{ label: 'Rent a Dumpster', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />

      <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Sizing Guide</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Find The Perfect Dumpster Size
            </h2>
            <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md mx-auto">
              Different projects require different containers. Select the size that fits your cleanup needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sizes.map((size) => (
              <div 
                key={size.name} 
                className="group p-6 md:p-8 bg-secondary-50/50 rounded-2xl border border-transparent hover:border-secondary-100 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-5 items-start"
              >
                <div className="shrink-0 w-12 h-12 bg-secondary-50 group-hover:bg-brand/10 rounded-xl flex items-center justify-center text-secondary-400 group-hover:text-brand transition-colors">
                  <size.icon size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-secondary text-lg group-hover:text-brand transition-colors">{size.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-secondary-400">
                    <div>
                      <span className="block text-[10px] text-secondary-300 uppercase font-black">Dimensions</span>
                      {size.dims}
                    </div>
                    <div>
                      <span className="block text-[10px] text-secondary-300 uppercase font-black">Weight Allowance</span>
                      <span className="inline-flex items-center gap-1"><Scale size={11} /> {size.weight}</span>
                    </div>
                  </div>
                  <p className="text-secondary-500 text-sm pt-2 border-t border-secondary-100/50 leading-relaxed">
                    <strong>Best For:</strong> {size.match}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary-50 border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Why Rent Dumpsters</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Stress-Free Containers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white p-6 rounded-2xl border border-secondary-100/80 shadow-sm flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                  <b.icon size={20} />
                </div>
                <div>
                  <h3 className="font-black text-secondary text-base mb-1.5">{b.title}</h3>
                  <p className="text-secondary-500 text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-secondary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-sm md:prose-base max-w-none text-secondary-500">
            <h2 className="text-2xl font-bold text-secondary mb-4">Roll-Off Dumpster Rentals for Residential & Commercial Cleanups</h2>
            <p className="mb-4">
              When dealing with home renovations, construction debris, landscape cleanups, or whole-house decluttering, a roll-off dumpster rental is often the most cost-effective and convenient waste disposal solution. The platform simplifies the rental process by facilitating upfront flat-rate pricing, protective placement techniques, and on-schedule drop-offs and pickups so that you can focus entirely on completing your project.
            </p>
            <p className="mb-4">
              The 10, 15, 20, and 30-yard roll-off containers serve a wide range of needs. Homeowners utilize smaller dumpsters for yard debris and garage clearouts, while building contractors and property managers rely on large 30-yard dumpsters to manage roofing shingles, concrete debris, and commercial construction waste. Every rental comes with a designated weight allowance, and customer support is always standing by to help you choose the right container capacity.
            </p>
            <p className="mb-4">
              If you decide that you'd rather not lift and load the debris yourself, full-service <Link to="/services/junk-removal" className="text-brand hover:underline font-medium">junk removal</Link> and <Link to="/services/property-cleanout" className="text-brand hover:underline font-medium">property cleanouts</Link> are also available. For eco-conscious disposal, partner providers work with local transfer stations to ensure recyclable building materials are sorted and kept out of landfills whenever possible.
            </p>
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Clear your site." titleAccent="Rent a roll-off dumpster." />
    </div>
  );
};
