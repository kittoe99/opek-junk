import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Heart,
  Package,
  TreePine,
  Warehouse,
  Home,
  Boxes,
} from 'lucide-react';
import {
  JunkIcon,
  DumpsterIcon,
  PropertyCleanoutIcon,
  MovingLaborIcon,
} from './icons/ServiceIcons';

type ServiceEntry = {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description?: string;
};

const allServices: ServiceEntry[] = [
  {
    title: 'Junk Removal',
    icon: JunkIcon,
    description:
      'Furniture, appliances, and household clutter hauled away. Full-service residential and commercial.',
    path: '/services/junk-removal',
  },
  {
    title: 'Dumpster Rental',
    icon: DumpsterIcon,
    description:
      'Roll-off containers delivered to your site. Multiple sizes with upfront, flat-rate pricing.',
    path: '/services/dumpster-rental',
  },
  {
    title: 'Property Cleanouts',
    icon: PropertyCleanoutIcon,
    description:
      'Estate clearing, move-outs, and full property cleanouts. Professional and discreet.',
    path: '/services/property-cleanout',
  },
  {
    title: 'Moving Labor',
    icon: MovingLaborIcon,
    description:
      'Hire experienced crews by the hour to load, unload, or move items within your home.',
    path: '/services/moving-labor',
  },
  { title: 'Single item pickup', path: '/quote', icon: Package },
  { title: 'Garage cleanout', path: '/services/junk-removal', icon: Warehouse },
  { title: 'Estate clearing', path: '/services/property-cleanout', icon: Home },
  { title: 'Mattress disposal', path: '/services/mattress-disposal', icon: BedDouble },
  { title: 'Office decommission', path: '/services/junk-removal', icon: Building2 },
  { title: 'Donation run', path: '/quote', icon: Heart },
  { title: 'Storage unit cleanout', path: '/services/property-cleanout', icon: Boxes },
  { title: 'Yard debris', path: '/services/junk-removal', icon: TreePine },
];

const primaryServices = allServices.filter((s) => s.description);

function GridCard({ item, onClick }: { item: ServiceEntry; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      title={item.description}
      className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-5 py-[1.125rem] md:px-6 md:py-5 text-left shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(53,80,112,0.05)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.07),0_8px_24px_rgba(53,80,112,0.08)] transition-shadow duration-200 min-h-[4.25rem]"
    >
      <span className="font-bold text-[15px] md:text-base text-secondary leading-snug pr-2 group-hover:text-brand transition-colors">
        {item.title}
      </span>
      <span className="text-[#5b7fd4] shrink-0 [&_svg]:stroke-[#5b7fd4] [&_.stroke-brand]:stroke-[#5b7fd4]">
        <Icon className="w-9 h-9 md:w-10 md:h-10" size={40} />
      </span>
    </button>
  );
}

export const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="services"
      className="py-14 md:py-16 lg:py-20"
      style={{
        background: 'linear-gradient(160deg, #dff3ea 0%, #eef3f9 42%, #e8e4f2 100%)',
      }}
    >
      <div className="max-w-[52rem] mx-auto px-5 sm:px-6 lg:px-8">
        <header className="text-center mb-9 md:mb-11">
          <p className="text-sm font-medium text-secondary-500 mb-2 tracking-wide">
            Book same-day help
          </p>
          <h2 className="text-[1.625rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-secondary tracking-tight leading-tight">
            Customizable hauling and cleanouts at up-front prices.
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          {allServices.map((item) => (
            <GridCard key={item.title} item={item} onClick={() => navigate(item.path)} />
          ))}
        </div>

        {/* Primary service descriptions — below grid, not inside cards */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {primaryServices.map((item) => (
            <div key={item.title} className="text-left">
              <p className="text-sm font-semibold text-secondary mb-0.5">{item.title}</p>
              <p className="text-sm text-secondary-500 leading-relaxed">{item.description}</p>
            </div>
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
