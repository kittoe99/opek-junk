import React from 'react';

interface ProcessProps {
  onGetQuote?: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onGetQuote }) => {
  const steps = [
    {
      image: "/estimates (1).webp",
      alt: "Customer snapping a photo for an estimate",
      label: "Step One",
      titleStart: "Snap. Send.",
      titleAccent: "Done.",
      desc: "A quick photo is all we need. Our AI reads the volume, the team confirms the price — instantly."
    },
    {
      image: "/opek2.webp",
      alt: "Upfront quote on-site",
      label: "Step Two",
      titleStart: "Lock in a",
      titleAccent: "fixed price.",
      desc: "Crew arrives, confirms what's getting hauled, and gives you the final number on the spot. No upcharges."
    },
    {
      image: "/workers-opek.webp",
      alt: "Professional junk removal team hauling items",
      label: "Step Three",
      titleStart: "We do",
      titleAccent: "the lifting.",
      desc: "Loading, sweeping, hauling — all handled. You point, we clear. Same day in most cases."
    }
  ];

  return (
    <section id="process" className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand"></span>
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">The Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight">
              From clutter to <span className="text-brand">clear</span>
              <br className="hidden md:block" /> in three moves.
            </h2>
          </div>
          <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right">
            No quote forms. No phone tag. Just photos, a fixed price, and a crew.
          </p>
        </div>

        {/* Steps — staggered editorial layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative ${
                index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden mb-5 shadow-md">
                <img
                  src={step.image}
                  alt={step.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-3">
                {step.titleStart} <span className="text-brand">{step.titleAccent}</span>
              </h3>

              {/* Description */}
              <p className="text-secondary-500 text-sm md:text-[15px] leading-relaxed max-w-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};