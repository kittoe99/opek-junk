import React from 'react';

export const WhatWeHaul: React.FC = () => {
  const itemTypes = [
    { label: 'Furniture', desc: 'Sofas, tables, dressers, mattresses' },
    { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves' },
    { label: 'Electronics', desc: 'TVs, computers, monitors, e-waste' },
    { label: 'Bedroom Sets', desc: 'Frames, headboards, full bedrooms' },
    { label: 'Garage Junk', desc: 'Tools, exercise gear, old paint cans' },
    { label: 'Yard Waste', desc: 'Branches, debris, light landscaping' },
  ];

  return (
    <section className="py-16 md:py-20 border-b border-secondary-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="block w-8 h-px bg-brand" />
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">What We Clear</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
            What We Haul
          </h2>
          <p className="text-secondary-500 text-sm mt-3 leading-relaxed max-w-md">
            From a single couch to a full attic clean — same crew, same flat-rate pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {itemTypes.map((item) => (
            <div key={item.label} className="border-t border-secondary-100 pt-4">
              <h3 className="font-bold text-secondary text-base mb-1">{item.label}</h3>
              <p className="text-secondary-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
