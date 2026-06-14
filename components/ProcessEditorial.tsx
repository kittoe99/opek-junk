import React from 'react';

interface ProcessProps {
  onGetQuote?: () => void;
}

export const ProcessEditorial: React.FC<ProcessProps> = ({ onGetQuote }) => {
  const steps = [
    {
      image: "/process-step-1.svg",
      alt: "Instant junk removal quote",
      label: "Step One",
      titleStart: "quotes.",
      titleAccent: "simplified.",
      desc: "Get an instant, flat-rate junk removal quote online."
    },
    {
      image: "/process-step-2.svg",
      alt: "Upfront quote on-site",
      label: "Step Two",
      titleStart: "Lock in a",
      titleAccent: "fixed price.",
      desc: "Matched provider arrives, confirms volume, and gives you a locked-in flat quote. No upcharges."
    },
    {
      image: "/process-step-3.svg",
      alt: "Professional junk removal provider team hauling items",
      label: "Step Three",
      titleStart: "Providers handle",
      titleAccent: "the lifting.",
      desc: "Loading, sweeping, hauling — all handled by the provider. You point, they clear. Same day in most cases."
    }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
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
            No quote forms. No phone tag. Just photos, a fixed price, and a matched provider.
          </p>
        </div>

        {/* Steps — staggered editorial layout */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative flex items-center md:block gap-4 md:gap-0 bg-secondary-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none ${
                index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
              }`}
            >
              {/* Image */}
              <div className="relative w-24 h-24 shrink-0 md:w-full md:h-auto md:aspect-square overflow-hidden md:mb-5 shadow-sm md:shadow-md rounded-xl md:rounded-none">
                <img
                  src={step.image}
                  alt={step.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent pointer-events-none hidden md:block"></div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[17px] md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-1 md:mb-3">
                  {step.titleStart} <span className="text-brand">{step.titleAccent}</span>
                </h3>
                <p className="text-secondary-500 text-xs md:text-[15px] leading-relaxed max-w-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
