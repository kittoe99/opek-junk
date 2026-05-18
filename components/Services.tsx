import React, { useState } from 'react';
import { Home, Building2, PackageOpen, ChevronDown, HeartHandshake, BicepsFlexed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const serviceItems = [
  {
    title: "Residential",
    icon: Home,
    description: "Furniture, appliances, electronics, and household clutter. Fast, affordable pickup by local professionals in your area.",
    path: "/services/residential-junk-removal"
  },
  {
    title: "Commercial",
    icon: Building2,
    description: "Office furniture, equipment, and commercial debris cleared with minimal disruption to your business operations.",
    path: "/services/commercial"
  },
  {
    title: "Property Cleanouts",
    icon: PackageOpen,
    description: "Estate clearing, move-outs, hoarding situations, and full property cleanouts. Professional, thorough, and discreet.",
    path: "/services/property-cleanout"
  },
  {
    title: "Donations Pickup",
    icon: HeartHandshake,
    description: "Convenient pickup of gently used furniture, clothing, and household goods, delivered directly to local charities.",
    path: "/services/donations-pickup"
  },
  {
    title: "Moving Labor",
    icon: BicepsFlexed,
    description: "Hire our strong, experienced crews by the hour to load, unload, or move items within your home. (Labor only)",
    path: "/services/moving-labor"
  }
];

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="services" className="py-16 md:py-24 lg:py-32 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Content Side */}
          <div className="flex flex-col">
            <div className="mb-10">
              <span className="inline-block px-4 py-2 bg-secondary text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-lg mb-6">
                Services
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight mb-4 tracking-tight">
                Fast pickup. <span className="text-brand">Fair pricing.</span>
              </h2>
              <p className="text-secondary text-lg leading-relaxed">
                Trusted professionals in your area.
              </p>
            </div>

            <div className="space-y-3">
              {serviceItems.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'shadow-lg ring-2 ring-secondary' : 'shadow-sm hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => {
                      if (openIndex === index) {
                        navigate(item.path);
                      } else {
                        toggleAccordion(index);
                      }
                    }}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon
                        size={22}
                        className={`transition-colors duration-300 shrink-0 ${
                          openIndex === index ? 'text-brand' : 'text-secondary'
                        }`}
                      />
                      <span className="font-bold text-base text-secondary">
                        {item.title}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition-all duration-300 shrink-0 ${
                        openIndex === index ? 'text-brand rotate-180' : 'text-secondary-300'
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-9 text-secondary-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Side - Hidden on mobile/tablet */}
          <div className="hidden lg:block relative">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <img 
                  src="/workers-opek.webp"
                  loading="lazy" 
                  alt="Professional junk removal team at work" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};