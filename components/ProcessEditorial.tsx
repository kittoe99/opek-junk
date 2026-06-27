import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProcessStep {
  image: string;
  alt: string;
  titleStart: string;
  titleAccent: string;
  desc: string;
}

interface ProcessEditorialProps {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  steps?: ProcessStep[];
  cta?: { label: string; onClick: () => void };
}

const defaultSteps: ProcessStep[] = [
  {
    image: '/process-step-1.svg',
    alt: 'Instant junk removal quote',
    titleStart: 'quotes.',
    titleAccent: 'simplified.',
    desc: 'Get an instant, flat-rate junk removal quote online.',
  },
  {
    image: '/process-step-2.svg',
    alt: 'Upfront quote on-site',
    titleStart: 'Lock in a',
    titleAccent: 'fixed price.',
    desc: 'Matched provider arrives, confirms volume, and gives you a locked-in flat quote. No upcharges.',
  },
  {
    image: '/process-step-3.svg',
    alt: 'Professional junk removal provider team hauling items',
    titleStart: 'Providers handle',
    titleAccent: 'the lifting.',
    desc: 'Loading, sweeping, hauling — all handled by the provider. You point, they clear. Same day in most cases.',
  },
];

export const ProcessEditorial: React.FC<ProcessEditorialProps> = ({
  eyebrow = 'The Process',
  title = (
    <>
      From clutter to <span className="text-brand">clear</span>
      <br className="hidden md:block" /> in three moves.
    </>
  ),
  subtitle = 'No quote forms. No phone tag. Just photos, a fixed price, and a matched provider.',
  steps = defaultSteps,
  cta,
}) => {
  return (
    <section id="process" className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">{eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right font-medium">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-10">
          {steps.map((step, index) => (
            <div
              key={step.titleStart}
              className={`group relative flex items-center md:block gap-4 md:gap-0 bg-secondary-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-2xl ${
                index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
              }`}
            >
              <div className="relative w-24 h-24 shrink-0 md:w-full md:h-auto md:aspect-square md:mb-5">
                <img
                  src={step.image}
                  alt={step.alt}
                  className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
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

        {cta && (
          <div className="mt-16 md:mt-24 text-center">
            <button
              onClick={cta.onClick}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl inline-flex items-center gap-2"
            >
              <span>{cta.label}</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
