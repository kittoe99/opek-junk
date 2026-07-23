import React from 'react';

const FurnitureIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4M4 14c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M4 14H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ApplianceIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="5.5" r="1" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const ElectronicsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12l5-3v6l-5-3z" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BedroomIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 11v8M21 11v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 15h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="7" y="11" width="4" height="4" rx="1" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="11" width="4" height="4" rx="1" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GarageIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14h4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const YardWasteIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 20l5-9" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WhatWeHaul: React.FC = () => {
  const itemTypes = [
    { label: 'Furniture', desc: 'Sofas, tables, dressers, bed frames, mattresses', icon: FurnitureIcon },
    { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves, microwaves', icon: ApplianceIcon },
    { label: 'Electronics', desc: 'TVs, computers, monitors, printers, e-waste', icon: ElectronicsIcon },
    { label: 'Bedroom Sets', desc: 'Frames, headboards, dressers, full bedroom cleanups', icon: BedroomIcon },
    { label: 'Garage & Sheds', desc: 'Tools, exercise gear, boxes, general yard storage', icon: GarageIcon },
    { label: 'Yard Waste', desc: 'Branches, leaves, light soil, general yard debris', icon: YardWasteIcon },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Common Items</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              Almost
              <br />
              <span className="text-brand">anything goes.</span>
            </h2>

            <div className="w-12 h-0.5 bg-secondary-100" />

            <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-sm font-medium">
              From a single heavy mattress to an entire estate cleanout, our vetted local crews handle all the lifting, sorting, and sweeping. If it fits in the truck and is non-hazardous, we haul it.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-secondary-100/60 border border-secondary-100/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {itemTypes.map((item) => (
                <div
                  key={item.label}
                  className="group bg-white p-6 md:p-8 hover:bg-secondary-50/20 transition-all duration-300 flex items-start gap-5"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary-50 group-hover:bg-brand/10 text-secondary-400 group-hover:text-secondary-900 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-secondary text-base md:text-lg transition-colors group-hover:text-brand duration-300">
                      {item.label}
                    </h3>
                    <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">{item.desc}</p>
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
