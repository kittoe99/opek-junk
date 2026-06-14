import React from 'react';
import { Sofa, WashingMachine, Tv, BedDouble, Wrench, Leaf } from 'lucide-react';

export const WhatWeHaul: React.FC = () => {
  const itemTypes = [
    { label: 'Furniture', desc: 'Sofas, tables, dressers, bed frames, mattresses', icon: Sofa },
    { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves, microwaves', icon: WashingMachine },
    { label: 'Electronics', desc: 'TVs, computers, monitors, printers, e-waste', icon: Tv },
    { label: 'Bedroom Sets', desc: 'Frames, headboards, dressers, full bedroom cleanups', icon: BedDouble },
    { label: 'Garage & Sheds', desc: 'Tools, exercise gear, boxes, general yard storage', icon: Wrench },
    { label: 'Yard Waste', desc: 'Branches, leaves, light soil, general yard debris', icon: Leaf },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Asymmetric Typography Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Common Items</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              Almost<br />
              <span className="text-brand">anything goes.</span>
            </h2>
            
            <div className="w-12 h-0.5 bg-secondary-100" />
            
            <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-sm font-medium">
              From a single heavy mattress to an entire estate cleanout, our vetted local crews handle all the lifting, sorting, and sweeping. If it fits in the truck and is non-hazardous, we haul it.
            </p>
          </div>

          {/* Right Column: Clean, Open Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {itemTypes.map((item) => (
                <div 
                  key={item.label} 
                  className="group flex items-start gap-5 p-2"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary-50 group-hover:bg-brand/10 text-secondary-400 group-hover:text-brand flex items-center justify-center shrink-0 transition-all duration-300">
                    <item.icon 
                      className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-105" 
                      strokeWidth={1.5} 
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-secondary text-base md:text-lg transition-colors group-hover:text-brand duration-300">
                      {item.label}
                    </h3>
                    <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

