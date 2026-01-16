import React, { useState } from 'react';
import { Plus, Minus, Warehouse, Truck, Recycle, Trash, HardHat } from 'lucide-react';

const serviceItems = [
  {
    title: "Residential Junk Removal",
    icon: Warehouse,
    description: "Clear out your attic, garage, or basement. We handle couches, mattresses, appliances, and general household clutter. We don't just dump; we donate and recycle over 60% of what we haul."
  },
  {
    title: "Commercial & Office Hauling",
    icon: Truck,
    description: "Moving offices or upgrading equipment? We remove desks, cubicles, monitors, and filing cabinets with minimal disruption to your business operations."
  },
  {
    title: "Construction Debris & Remodel",
    icon: HardHat,
    description: "Keep your site OSHA-ready. We haul away drywall, wood, tile, flooring, and metal scraps. Available for one-time pick-ups or recurring site maintenance."
  },
  {
    title: "E-Waste & Appliance Recycling",
    icon: Recycle,
    description: "Responsible disposal of CRT monitors, servers, refrigerators, and stoves. We adhere to all Colorado state environmental regulations for hazardous materials."
  },
  {
    title: "Full Property Cleanouts",
    icon: Trash,
    description: "Estate clearing, rental move-outs, and hoarding situations handled with professional discretion and extreme efficiency. We leave the space broom-swept."
  }
];

export const Services: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="services" className="py-32 bg-[#fcfcfc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Content Side */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="bg-black text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.3em] mb-4 inline-block">Professional Solutions</span>
              <h2 className="text-5xl md:text-6xl font-black text-black leading-none mb-6 tracking-tighter uppercase">
                We handle the heavy lifting.
              </h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xl">
                Opek is built on the belief that junk removal should be transparent, professional, and eco-conscious. No hidden fees, just hard work.
              </p>
            </div>

            <div className="space-y-1">
              {serviceItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`border-l-4 transition-all duration-300 ${openIndex === index ? 'border-black bg-white shadow-xl translate-x-2' : 'border-gray-200 hover:border-gray-400 bg-transparent'}`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded ${openIndex === index ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <item.icon size={20} />
                      </div>
                      <span className={`font-black text-xl uppercase tracking-tight ${openIndex === index ? 'text-black' : 'text-gray-600'}`}>
                        {item.title}
                      </span>
                    </div>
                    {openIndex === index ? (
                      <Minus size={20} className="text-black" />
                    ) : (
                      <Plus size={20} className="text-gray-300" />
                    )}
                  </button>
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-8 text-gray-500 font-medium leading-relaxed pl-16">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Side - Industrial Look */}
          <div className="relative h-full hidden lg:block">
             <div className="absolute inset-0 bg-gray-200 transform translate-x-4 translate-y-4 -z-10"></div>
             <div className="relative aspect-[4/5] overflow-hidden border-4 border-black group">
                <img 
                  src="https://images.unsplash.com/photo-1590650046871-92c887180603?q=80&w=2070&auto=format&fit=crop" 
                  alt="Industrial warehouse or cleared garage" 
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Floating "Blueprint" Info Box */}
                <div className="absolute top-10 left-10 bg-black text-white p-8 max-w-xs shadow-2xl">
                   <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-4">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Project: Denver South</span>
                   </div>
                   <h4 className="text-2xl font-black mb-2 uppercase leading-none italic">Clear space <br/> guaranteed.</h4>
                   <p className="text-gray-400 text-xs font-bold leading-relaxed uppercase">
                     Full site cleanout performed in under 4 hours. No debris left behind.
                   </p>
                </div>

                {/* Local Area Stamp */}
                <div className="absolute bottom-10 right-10 flex flex-col items-end">
                   <div className="bg-white px-4 py-2 border-2 border-black font-black uppercase text-xs tracking-widest -rotate-6">
                      Est. 2018
                   </div>
                   <div className="bg-black text-white px-4 py-2 border-2 border-black font-black uppercase text-xs tracking-widest mt-2">
                      Local Denver Team
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};