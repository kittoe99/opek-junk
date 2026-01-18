import React, { useState } from 'react';
import { Plus, Minus, Warehouse, Truck, Recycle, Trash, HardHat } from 'lucide-react';

const serviceItems = [
  {
    title: "Residential Junk Removal",
    icon: Warehouse,
    description: "Furniture, appliances, electronics, and household clutter. Local providers in your area."
  },
  {
    title: "Commercial & Office Hauling",
    icon: Truck,
    description: "Office furniture, equipment, and commercial debris. Minimal business disruption."
  },
  {
    title: "Construction Debris",
    icon: HardHat,
    description: "Drywall, wood, tile, flooring, and metal scraps. One-time or recurring service."
  },
  {
    title: "E-Waste & Appliances",
    icon: Recycle,
    description: "Electronics, monitors, refrigerators, and stoves. Eco-friendly disposal."
  },
  {
    title: "Property Cleanouts",
    icon: Trash,
    description: "Estate clearing, move-outs, and hoarding situations. Professional and discreet."
  }
];

export const Services: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="services" className="py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Content Side */}
          <div className="flex flex-col">
            <div className="mb-10">
              <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
                Services
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4 tracking-tight">
                Find local <span className="text-gray-400">providers.</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Trusted professionals in your area.
              </p>
            </div>

            <div className="space-y-3">
              {serviceItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'shadow-lg ring-2 ring-black' : 'shadow-sm hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        openIndex === index ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <item.icon size={20} />
                      </div>
                      <span className={`font-bold text-base transition-colors ${
                        openIndex === index ? 'text-black' : 'text-gray-700'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index ? 'bg-black text-white rotate-180' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {openIndex === index ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </div>
                  </button>
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-gray-600 leading-relaxed pl-20">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Side */}
          <div className="relative mt-12 lg:mt-0">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <img 
                  src="/opek2.png" 
                  alt="Professional junk removal service" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center font-black text-xl">
                      60%
                    </div>
                    <div>
                      <p className="font-bold text-black">Recycled & Donated</p>
                      <p className="text-gray-600 text-sm">Providers responsibly dispose of items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};