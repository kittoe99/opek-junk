import React, { useState } from 'react';
import { ArrowUpRight, Warehouse, Truck, Recycle, Trash, HardHat, Container, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const serviceItems = [
  {
    title: "Residential Junk Removal",
    icon: Warehouse,
    description: "Furniture, appliances, electronics, and household clutter. Local providers in your area.",
    path: "/services/residential"
  },
  {
    title: "Commercial & Office Hauling",
    icon: Truck,
    description: "Office furniture, equipment, and commercial debris. Minimal business disruption.",
    path: "/services/commercial"
  },
  {
    title: "Construction Debris",
    icon: HardHat,
    description: "Drywall, wood, tile, flooring, and metal scraps. One-time or recurring service.",
    path: "/services/construction"
  },
  {
    title: "E-Waste & Appliances",
    icon: Recycle,
    description: "Electronics, monitors, refrigerators, and stoves. Eco-friendly disposal.",
    path: "/services/e-waste"
  },
  {
    title: "Property Cleanouts",
    icon: Trash,
    description: "Estate clearing, move-outs, and hoarding situations. Professional and discreet.",
    path: "/services/property-cleanout"
  },
  {
    title: "Dumpster Rental",
    icon: Container,
    description: "Multiple sizes available for any project. Flexible rental periods with fast delivery and pickup.",
    path: "/services/dumpster-rental"
  }
];

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? serviceItems : serviceItems.slice(0, 3);

  return (
    <section id="services" className="py-24 md:py-32 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500">
              <span className="inline-block h-px w-8 bg-gray-300" />
              <span>Services</span>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight tracking-tight">
              Fast pickup. <span className="text-gray-400">Fair pricing.</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg">
              Six services. One trusted network of local pros.
            </p>
          </div>
        </div>

        {/* Service list */}
        <div className="border-t border-gray-200">
          {/* Desktop: full list */}
          <ul className="hidden md:block">
            {serviceItems.map((item, i) => (
              <li key={i} className="border-b border-gray-200">
                <button
                  onClick={() => navigate(item.path)}
                  className="group w-full flex items-center gap-8 py-7 text-left"
                >
                  <span className="w-10 text-xs text-gray-400 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <item.icon size={20} className="text-gray-400 group-hover:text-gray-900 transition-colors" strokeWidth={1.25} />
                  <span className="flex-1 text-xl md:text-2xl font-light text-gray-900 tracking-tight">
                    {item.title}
                  </span>
                  <span className="hidden lg:block flex-1 max-w-md text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="text-gray-300 group-hover:text-gray-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile: collapsible */}
          <ul className="md:hidden">
            {visible.map((item, i) => (
              <li key={i} className="border-b border-gray-200">
                <button
                  onClick={() => navigate(item.path)}
                  className="group w-full flex items-center gap-4 py-6 text-left"
                >
                  <item.icon size={18} className="text-gray-400" strokeWidth={1.25} />
                  <span className="flex-1 text-lg font-light text-gray-900 tracking-tight">
                    {item.title}
                  </span>
                  <ArrowUpRight size={18} className="text-gray-300" />
                </button>
              </li>
            ))}
            <li className="pt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <span>{showAll ? 'Show less' : `Show all ${serviceItems.length}`}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showAll ? 'rotate-180' : ''}`}
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};