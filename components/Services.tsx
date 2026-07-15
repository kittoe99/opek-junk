import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  JunkIcon,
  DumpsterIcon,
  PropertyCleanoutIcon,
  MovingLaborIcon,
} from './icons/ServiceIcons';

type ServiceGroup = {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
  subs: { label: string; path: string }[];
};

const serviceGroups: ServiceGroup[] = [
  {
    title: 'Junk Removal',
    icon: JunkIcon,
    description: 'Furniture, appliances, and household clutter hauled away.',
    path: '/services/junk-removal',
    subs: [
      { label: 'Single item pickup', path: '/quote' },
      { label: 'Mattress disposal', path: '/services/mattress-disposal' },
      { label: 'Office decommission', path: '/services/junk-removal' },
    ],
  },
  {
    title: 'Dumpster Rental',
    icon: DumpsterIcon,
    description: 'Roll-off containers delivered to your site. Upfront, flat-rate pricing.',
    path: '/services/dumpster-rental',
    subs: [
      { label: 'Construction debris', path: '/services/dumpster-rental' },
      { label: 'Yard waste', path: '/services/dumpster-rental' },
    ],
  },
  {
    title: 'Property Cleanouts',
    icon: PropertyCleanoutIcon,
    description: 'Estate clearing, move-outs, and full property cleanouts.',
    path: '/services/property-cleanout',
    subs: [
      { label: 'Garage cleanout', path: '/services/junk-removal' },
      { label: 'Estate clearing', path: '/services/property-cleanout' },
    ],
  },
  {
    title: 'Local Moving',
    icon: MovingLaborIcon,
    description: 'Truck and crew for apartment & small home moves. Hourly rates.',
    path: '/services/moving-labor',
    subs: [
      { label: 'Small local moves', path: '/services/small-local-moves' },
      { label: 'Loading & unloading', path: '/services/moving-labor' },
    ],
  },
];

function CategoryCard({ group, onNavigate }: { group: ServiceGroup; onNavigate: (path: string) => void }) {
  const Icon = group.icon;
  return (
    <div className="group rounded-2xl border border-secondary-100/80 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:border-secondary-200 hover:shadow-[0_4px_16px_rgba(53,80,112,0.08)] transition-all duration-200 overflow-hidden">
      <button
        type="button"
        onClick={() => onNavigate(group.path)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-5 text-left"
      >
        <div className="min-w-0">
          <h3 className="font-bold text-[15px] md:text-base text-secondary leading-snug group-hover:text-brand transition-colors">
            {group.title}
          </h3>
          <p className="text-xs text-secondary-500 mt-0.5 leading-relaxed line-clamp-2">
            {group.description}
          </p>
        </div>
        <span className="text-secondary shrink-0 [&_.stroke-brand]:stroke-current">
          <Icon className="w-9 h-9 md:w-10 md:h-10" size={40} />
        </span>
      </button>
      {group.subs.length > 0 && (
        <div className="px-5 pb-3.5 md:px-6 md:pb-4 flex flex-wrap gap-1.5">
          {group.subs.map((sub) => (
            <button
              key={sub.label}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(sub.path);
              }}
              className="text-[11px] font-medium text-secondary-500 bg-secondary-50 hover:bg-secondary-100 px-2.5 py-1 rounded-full transition-colors"
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="services"
      className="py-14 md:py-16 lg:py-20 bg-white border-b border-secondary-100/40"
    >
      <div className="max-w-[52rem] mx-auto px-5 sm:px-6 lg:px-8">
        <header className="text-center mb-9 md:mb-11">
          <p className="text-sm font-medium text-secondary-500 mb-2 tracking-wide">
            Book same-day help
          </p>
          <h2 className="font-serif text-[1.625rem] sm:text-[1.75rem] md:text-[2rem] font-semibold text-secondary tracking-tight leading-tight">
            Customizable hauling and cleanouts at up-front prices.
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
          {serviceGroups.map((group) => (
            <CategoryCard
              key={group.title}
              group={group}
              onNavigate={(path) => navigate(path)}
            />
          ))}
        </div>

        <footer className="mt-10 md:mt-12 text-center">
          <p className="text-sm text-secondary-500 mb-1">
            Need mattress disposal or in-home estimates?
          </p>
          <button
            type="button"
            onClick={() => navigate('/services/mattress-disposal')}
            className="text-sm font-semibold text-secondary hover:text-brand inline-flex items-center gap-0.5 transition-colors"
          >
            See specialty services
            <ArrowRight size={14} strokeWidth={2.5} className="mt-px" />
          </button>
        </footer>
      </div>
    </section>
  );
};
