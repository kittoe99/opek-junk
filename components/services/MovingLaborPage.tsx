import React from 'react';
import { Truck, Package as Box, Container, ArrowRightLeft, Wrench, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const MovingLaborPage: React.FC = () => {
  const laborServices = [
    { label: 'Truck Loading', desc: 'Safe, dense packing of rented moving trucks', icon: Truck },
    { label: 'Unloading', desc: 'Careful offloading into your new home or office', icon: Box },
    { label: 'Storage Units', desc: 'Moving items into or out of PODS and storage', icon: Container },
    { label: 'In-Home Shuffling', desc: 'Rearranging heavy furniture between rooms', icon: ArrowRightLeft },
    { label: 'Assembly', desc: 'Basic breakdown and reassembly of large furniture pieces', icon: Wrench },
    { label: 'Event Setup', desc: 'Labor for staging, events, and trade shows', icon: Sparkles },
  ];
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Professional Service"
        title={<>Moving<br />Labor</>}
        subtitle="Hire strong, experienced independent providers by the hour to load, unload, or rearrange items in your home. You provide the truck or storage unit, vetted providers provide the muscle."
        image="/process-step-2.svg"
        imageAlt="Moving labor team lifting a heavy sofa"
        imageCaption="Hourly Rates • Vetted Providers • Same-Day Available"
        primaryCta={{ label: 'Book Labor', onClick: () => navigate('/booking') }}
        secondaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
      />

      <TrustBadges />

      {/* Dynamic Grid instead of WhatWeHaul */}
      <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Labor Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
              Muscle On Demand
            </h2>
            <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md">
              Hire the muscle. You provide the truck, the platform matches you with the provider.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {laborServices.map((item) => (
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
            <h2 className="text-2xl font-bold text-secondary mb-4">Heavy Lifting & Professional Moving Labor Services</h2>
            <p className="mb-4">
              Sometimes you don't need a full-service moving company or junk removal truck—you just need a few strong pairs of hands. Vetted moving labor services provide experienced, background-checked independent providers by the hour. Whether you need help loading a rented U-Haul, unloading a PODS container, or simply rearranging heavy furniture within your home, partner providers provide the physical support you need.
            </p>
            <p className="mb-4">
              Partner providers specialize in labor-only assistance. This means you maintain control over transportation and storage, while avoiding the exorbitant fees of traditional moving companies. If you happen to discover items you no longer want while packing or unpacking, a seamless transition to <Link to="/services/junk-removal" className="text-brand hover:underline font-medium">junk removal</Link> services can clear them away on the spot. 
            </p>
            <p>
              Moving labor providers are vetted and available for jobs of all sizes, from quick 2-hour minimums to full-day loading projects. With providers standing by nationwide in cities like <Link to="/locations/los-angeles" className="text-brand hover:underline font-medium">Los Angeles</Link> and <Link to="/locations/jacksonville" className="text-brand hover:underline font-medium">Jacksonville</Link>, the platform makes moving safer and significantly less stressful. Let the professionals take the weight off your shoulders.
            </p>
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Hire the muscle." titleAccent="Skip the moving company." />
    </div>
  );
};
