import React from 'react';
import { Sofa, WashingMachine, Tv, BedDouble, Wrench, Leaf } from 'lucide-react';

export const WhatWeHaul: React.FC = () => {
  const itemTypes = [
    { label: 'Furniture', desc: 'Sofas, tables, dressers, mattresses', icon: Sofa },
    { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves', icon: WashingMachine },
    { label: 'Electronics', desc: 'TVs, computers, monitors, e-waste', icon: Tv },
    { label: 'Bedroom Sets', desc: 'Frames, headboards, full bedrooms', icon: BedDouble },
    { label: 'Garage Junk', desc: 'Tools, exercise gear, old paint cans', icon: Wrench },
    { label: 'Yard Waste', desc: 'Branches, debris, light landscaping', icon: Leaf },
  ];

  return (
    <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="block w-8 h-px bg-brand" />
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Common Items</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
            Items Hauled
          </h2>
          <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md">
            From a single couch to a full attic clean — same crew, same flat-rate pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {itemTypes.map((item) => (
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
  );
};
