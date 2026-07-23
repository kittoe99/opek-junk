import React from 'react';

const haulJobs = [
  { name: 'Furniture Haul-Away', image: '/card-junk-removal.png', alt: 'Junk removal crew hauling furniture out of a home' },
  { name: 'Appliance Removal', image: '/opek2.webp', alt: 'Providers loading bulky junk onto a truck' },
  { name: 'Mattress Pickup', image: '/mattress-disposal.webp', alt: 'Mattress ready for junk removal pickup' },
  { name: 'Garage Cleanouts', image: '/service-property-cleanout.png', alt: 'Property and garage cleanout in progress' },
  { name: 'Dumpster Loads', image: '/card-dumpster-rental.png', alt: 'Roll-off dumpster for junk and debris' },
  { name: 'Estate Cleanouts', image: '/junk-removal.webp', alt: 'Full home estate junk removal cleanout' },
  { name: 'Truck & Hauling', image: '/hero-truck-loading.png', alt: 'Junk removal truck being loaded' },
  { name: 'Same-Day Crews', image: '/workers-opek.png', alt: 'Junk removal providers ready for a haul' },
  { name: 'Construction Debris', image: '/dumpster-rental.png', alt: 'Dumpster filled with construction debris' },
  { name: 'Move-Out Junk', image: '/card-moving-labor.png', alt: 'Moving labor and leftover junk haul-away' },
];

export const UseCases: React.FC = () => {
  return (
    <section id="use-cases" className="py-14 sm:py-16 md:py-20 bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-10 max-w-xl">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
            On the job
          </p>
          <h2 className="font-sans font-extrabold text-[1.7rem] sm:text-[2.3rem] md:text-[2.6rem] text-[var(--text)] tracking-tight leading-[1.08] mb-3">
            What we <span className="font-serif italic font-normal text-brand">haul</span>
          </h2>
          <p className="text-[var(--text-muted)] text-[13px] sm:text-base leading-relaxed">
            Real junk jobs—furniture, appliances, cleanouts, dumpsters, and everything in between.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {haulJobs.map((item) => (
            <figure key={item.name} className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--surface)] transition-colors duration-300 group-hover:border-brand/40">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-2.5 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-neutral-300">
                <span className="h-1 w-1 rounded-full bg-brand shrink-0" aria-hidden />
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
