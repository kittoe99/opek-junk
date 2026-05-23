import React from 'react';
import { Home, KeyRound, Building, Heart, Sparkles, Recycle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const PropertyCleanoutPage: React.FC = () => {
  const scenarios = [
    { label: 'Estate Cleanouts', desc: 'Full-home clearing with donation coordination', icon: Home },
    { label: 'Move-Outs & Rentals', desc: 'Tenant turnovers and end-of-lease clears', icon: KeyRound },
    { label: 'Foreclosures', desc: 'Bank-owned and REO trash-outs to broom-swept', icon: Building },
    { label: 'Hoarding Situations', desc: 'Compassionate, discreet, paced to your needs', icon: Heart },
    { label: 'Pre-Sale Prep', desc: 'Get a property listing-ready in days, not weeks', icon: Sparkles },
    { label: 'Donation Sorting', desc: 'On-site sorting with receipts where applicable', icon: Recycle },
  ];
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Property<br />Cleanouts</>}
        subtitle="Estate clearing, foreclosures, move-outs, and hoarding situations. Professional, thorough, and discreet — partner crews handle the hard parts so you don't have to."
        image="/estimates (1).webp"
        imageAlt="Property cleanout team clearing a home"
        imageCaption="Discreet • Vetted Providers • Broom-Swept Finish"
        primaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Schedule Visit', onClick: () => navigate('/in-home-estimate') }}
      />

      <TrustBadges />

      {/* Dynamic Grid instead of WhatWeHaul */}
      <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Cleanout Specialties</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Handled With Care
            </h2>
            <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md">
              Every situation, handled with respect and total discretion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {scenarios.map((item) => (
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
            <h2 className="text-2xl font-bold text-secondary mb-4">Thorough & Compassionate Property Clearing Services</h2>
            <p className="mb-4">
              Clearing out an entire property can be an overwhelming task. Property cleanout services are designed to handle even the most challenging situations with professionalism, discretion, and care. Whether you are dealing with an estate cleanout, a foreclosure, a tenant move-out, or a sensitive hoarding situation, partner crews approach every job with compassion and efficiency to leave the space completely broom-swept and ready for its next chapter.
            </p>
            <p className="mb-4">
              Providers work closely with families, real estate agents, landlords, and property managers to ensure a seamless experience. Vetted crews are background-checked and can arrive in unmarked vehicles upon request for maximum discretion. From heavy <Link to="/services/junk-removal" className="text-brand hover:underline font-medium">junk removal</Link> to sorting valuable heirlooms from debris, partner crews work at your pace. Donation pickups can even be coordinated for gently used items to ensure nothing goes to waste unnecessarily.
            </p>
            <p>
              Property cleanout services are available nationwide, serving major areas from <Link to="/locations/dallas-fort-worth" className="text-brand hover:underline font-medium">Dallas-Fort Worth</Link> to <Link to="/locations/phoenix" className="text-brand hover:underline font-medium">Phoenix</Link> and beyond. Upfront, flat-rate pricing is offered with no hidden fees. If you're a business managing multiple REO properties, a junk removal provider network can also coordinate centralized billing and multi-location support. Let partner crews handle the difficult work so you can move forward.
            </p>
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Clear the property." titleAccent="With grace." />
    </div>
  );
};
