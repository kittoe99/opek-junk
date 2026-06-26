import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  JunkIcon,
  DumpsterIcon,
  PropertyCleanoutIcon,
  MovingLaborIcon,
} from './icons/ServiceIcons';

const serviceItems = [
  {
    title: 'Junk Removal',
    icon: JunkIcon,
    description: 'Furniture, appliances, office decommissioning, and household clutter. Full-service residential and commercial junk hauling.',
    path: '/services/junk-removal',
  },
  {
    title: 'Dumpster Rental',
    icon: DumpsterIcon,
    description: 'Roll-off container rentals delivered to your site. Choose from multiple sizes with upfront, flat-rate pricing.',
    path: '/services/dumpster-rental',
  },
  {
    title: 'Property Cleanouts',
    icon: PropertyCleanoutIcon,
    description: 'Estate clearing, move-outs, hoarding situations, and full property cleanouts. Professional, thorough, and discreet.',
    path: '/services/property-cleanout',
  },
  {
    title: 'Moving Labor',
    icon: MovingLaborIcon,
    description: 'Hire strong, experienced crews by the hour to load, unload, or move items within your home. (Labor only)',
    path: '/services/moving-labor',
  },
];

export const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Services</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              Fast pickup.
              <br />
              <span className="text-brand">Fair pricing.</span>
            </h2>

            <div className="w-12 h-0.5 bg-secondary-100" />

            <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-sm font-medium">
              Trusted professionals in your area. We offer transparent flat-rates, flexible schedules, and vetted local providers for home and office.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-secondary-100/60 border border-secondary-100/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {serviceItems.map((item) => (
                <div
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="group cursor-pointer bg-white p-6 md:p-8 hover:bg-secondary-50/20 transition-all duration-300 flex items-start gap-5"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary-50 group-hover:bg-brand/10 text-secondary-400 group-hover:text-secondary-900 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-secondary text-base md:text-lg transition-colors group-hover:text-brand duration-300">
                      {item.title}
                    </h3>
                    <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
