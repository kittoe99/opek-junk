import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
    description: 'Furniture, appliances, and household clutter hauled away. Full-service residential and commercial.',
    path: '/services/junk-removal',
  },
  {
    title: 'Dumpster Rental',
    icon: DumpsterIcon,
    description: 'Roll-off containers delivered to your site. Multiple sizes with upfront, flat-rate pricing.',
    path: '/services/dumpster-rental',
  },
  {
    title: 'Property Cleanouts',
    icon: PropertyCleanoutIcon,
    description: 'Estate clearing, move-outs, and full property cleanouts. Professional and discreet.',
    path: '/services/property-cleanout',
  },
  {
    title: 'Moving Labor',
    icon: MovingLaborIcon,
    description: 'Hire experienced crews by the hour to load, unload, or move items within your home.',
    path: '/services/moving-labor',
  },
];

const quickServices = [
  { label: 'Single item pickup', path: '/quote' },
  { label: 'Garage cleanout', path: '/services/junk-removal' },
  { label: 'Estate clearing', path: '/services/property-cleanout' },
  { label: 'Mattress disposal', path: '/services/mattress-disposal' },
  { label: 'Office decommission', path: '/services/junk-removal' },
  { label: 'Donation run', path: '/quote' },
  { label: 'Storage unit cleanout', path: '/services/property-cleanout' },
  { label: 'Yard debris', path: '/services/junk-removal' },
];

export const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="services"
      className="py-16 md:py-24 lg:py-28 overflow-hidden border-b border-secondary-100/40"
      style={{
        background: 'linear-gradient(135deg, #eef8f3 0%, #f7f9fc 45%, #f3f0f8 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-secondary tracking-tight mb-3">
            Book same-day help
          </h2>
          <p className="text-secondary-400 text-sm md:text-base max-w-xl mx-auto">
            Customizable hauling and cleanouts at up-front prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
          {serviceItems.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.path)}
              className="group text-left bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-white/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-50 text-secondary-500 group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center mb-5 transition-colors duration-300">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-secondary text-base md:text-lg mb-2 group-hover:text-brand transition-colors">
                {item.title}
              </h3>
              <p className="text-secondary-400 text-sm leading-relaxed">{item.description}</p>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            {quickServices.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className="shrink-0 px-4 py-2.5 rounded-full bg-white/90 border border-secondary-100 text-secondary text-sm font-medium hover:border-secondary-300 hover:bg-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-secondary-400">
          Need mattress disposal or in-home estimates?{' '}
          <button
            type="button"
            onClick={() => navigate('/services/mattress-disposal')}
            className="text-secondary font-semibold hover:text-brand inline-flex items-center gap-1 transition-colors"
          >
            See specialty services
            <ArrowRight size={14} />
          </button>
        </p>
      </div>
    </section>
  );
};
