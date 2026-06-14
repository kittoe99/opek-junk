import React from 'react';
import { useNavigate } from 'react-router-dom';

const serviceItems = [
  {
    title: "Junk Removal",
    image: "/service-junk-removal.png",
    description: "Furniture, appliances, office decommissioning, and household clutter. Full-service residential and commercial junk hauling.",
    path: "/services/junk-removal"
  },
  {
    title: "Dumpster Rental",
    image: "/service-dumpster-rental.png",
    description: "Roll-off container rentals delivered to your site. Choose from multiple sizes with upfront, flat-rate pricing.",
    path: "/services/dumpster-rental"
  },
  {
    title: "Property Cleanouts",
    image: "/service-property-cleanout.png",
    description: "Estate clearing, move-outs, hoarding situations, and full property cleanouts. Professional, thorough, and discreet.",
    path: "/services/property-cleanout"
  },
  {
    title: "Moving Labor",
    image: "/service-moving-labor.png",
    description: "Hire strong, experienced crews by the hour to load, unload, or move items within your home. (Labor only)",
    path: "/services/moving-labor"
  }
];

export const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-16 md:py-24 lg:py-32 bg-secondary-50 border-b border-secondary-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-secondary text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-lg mb-6">
              Services
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight mb-4 tracking-tight">
              Fast pickup. <span className="text-brand">Fair pricing.</span>
            </h2>
            <p className="text-secondary-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
              Trusted professionals in your area. We offer transparent flat-rates, flexible schedules, and vetted local providers for home and office.
            </p>
          </div>

          {/* Grid of Individual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {serviceItems.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="group cursor-pointer bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-secondary-100 transition-all duration-300 flex items-start md:block gap-4 md:gap-0"
                >
                  <div className="w-14 h-14 md:w-20 md:h-20 md:mb-6 shrink-0 mt-0.5 md:mt-0 flex items-center justify-center transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-secondary text-base md:text-lg mb-1 md:mb-2 group-hover:text-brand transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};