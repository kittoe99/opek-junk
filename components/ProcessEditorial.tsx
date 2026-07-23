import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EditorialStep {
  image: string;
  alt: string;
  titleStart: string;
  titleAccent: string;
  desc: string;
}

interface NumberedStep {
  number: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface ProcessEditorialProps {
  variant?: 'editorial' | 'numbered';
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  steps?: EditorialStep[] | NumberedStep[];
  cta?: { label: string; onClick: () => void };
  theme?: 'light' | 'dark';
}

const defaultEditorialSteps: EditorialStep[] = [
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

const defaultNumberedSteps: NumberedStep[] = [
  {
    number: '1',
    title: 'Choose a service',
    description: 'Tell us when, where, and what you need hauled — from a single item to a full property cleanout.',
    image: '/process-step-1.svg',
    alt: 'Choose a junk removal service',
  },
  {
    number: '2',
    title: 'Get an upfront price',
    description: 'Skip the surprises and hidden fees. Feel confident knowing exactly what you\'re paying.',
    image: '/process-step-2.svg',
    alt: 'Get an upfront junk removal price',
  },
  {
    number: '3',
    title: 'Sit back & relax',
    description: 'Your matched provider handles the lifting, loading, and hauling. Same-day service in most areas.',
    image: '/process-step-3.svg',
    alt: 'Provider handles junk removal hauling',
  },
];

function isEditorialStep(step: EditorialStep | NumberedStep): step is EditorialStep {
  return 'image' in step;
}

export const ProcessEditorial: React.FC<ProcessEditorialProps> = ({
  variant,
  eyebrow = 'The Process',
  title = (
    <>
      From clutter to <span className="text-brand">clear</span>
      <br className="hidden md:block" /> in three moves.
    </>
  ),
  subtitle = 'No quote forms. No phone tag. Just photos, a fixed price, and a matched provider.',
  steps,
  cta,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const resolvedVariant =
    variant ?? (steps?.length && isEditorialStep(steps[0]) ? 'editorial' : steps ? 'numbered' : 'editorial');

  if (resolvedVariant === 'numbered') {
    const numberedSteps = (steps as NumberedStep[] | undefined) ?? defaultNumberedSteps;

    return (
      <section
        id="process"
        className={`py-16 md:py-24 lg:py-28 overflow-hidden border-b ${
          isDark
            ? 'bg-[var(--bg)] border-[var(--border)]'
            : 'bg-white border-secondary-100/60'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`font-serif text-4xl md:text-5xl font-semibold text-center tracking-tight mb-14 md:mb-16 ${
              isDark ? 'text-[var(--text)]' : 'text-secondary'
            }`}
          >
            {title ?? 'How it works'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            {numberedSteps.map((step) => (
              <div key={step.number} className="flex flex-col max-w-sm mx-auto md:max-w-none md:mx-0">
                <div
                  className={`relative w-36 h-36 md:w-40 md:h-40 mx-auto mb-6 rounded-full flex items-center justify-center overflow-hidden ${
                    isDark ? 'border-2 border-[var(--border)]' : 'border-2 border-secondary/90'
                  }`}
                  style={{
                    background: isDark
                      ? 'radial-gradient(circle at 35% 30%, #2a2a2a 0%, #1c1c1c 45%, #161616 100%)'
                      : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f0f4f2 45%, #e8eeeb 100%)',
                    boxShadow: isDark
                      ? 'inset 0 0 24px rgba(0, 0, 0, 0.35)'
                      : 'inset 0 0 24px rgba(53, 80, 112, 0.06)',
                  }}
                >
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-[72%] h-[72%] object-contain"
                    loading="lazy"
                  />
                </div>
                <h3
                  className={`text-base md:text-lg font-bold mb-3 text-left ${
                    isDark ? 'text-[var(--text)]' : 'text-secondary'
                  }`}
                >
                  {step.number}. {step.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed text-left ${
                    isDark ? 'text-[var(--text-muted)]' : 'text-secondary-500'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {cta && (
            <div className="mt-14 md:mt-16 text-center">
              <button
                onClick={cta.onClick}
                className="px-10 py-3.5 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 transition-colors duration-200 rounded-full shadow-sm"
              >
                {cta.label}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  const editorialSteps = (steps as EditorialStep[] | undefined) ?? defaultEditorialSteps;

  return (
    <section
      id="process"
      className={`py-16 md:py-24 lg:py-32 overflow-hidden border-b ${
        isDark
          ? 'bg-[var(--bg)] border-[var(--border)]'
          : 'bg-white border-secondary-100/60'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">{eyebrow}</span>
            </div>
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight ${
                isDark ? 'text-[var(--text)]' : 'text-secondary'
              }`}
            >
              {title}
            </h2>
          </div>
          <p
            className={`text-sm md:text-base max-w-xs leading-relaxed md:text-right font-medium ${
              isDark ? 'text-[var(--text-muted)]' : 'text-secondary-500'
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-10">
          {editorialSteps.map((step, index) => (
            <div
              key={step.titleStart}
              className={`group relative flex items-center md:block gap-4 md:gap-0 p-4 md:p-0 rounded-2xl md:rounded-2xl ${
                isDark
                  ? 'bg-[var(--surface)] md:bg-transparent'
                  : 'bg-secondary-50/50 md:bg-transparent'
              } ${
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
                <h3
                  className={`text-[17px] md:text-3xl font-black leading-[1.1] tracking-tight mb-1 md:mb-3 ${
                    isDark ? 'text-[var(--text)]' : 'text-secondary'
                  }`}
                >
                  {step.titleStart} <span className="text-brand">{step.titleAccent}</span>
                </h3>
                <p
                  className={`text-xs md:text-[15px] leading-relaxed max-w-sm ${
                    isDark ? 'text-[var(--text-muted)]' : 'text-secondary-500'
                  }`}
                >
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
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-xl shadow-md hover:shadow-xl inline-flex items-center gap-2"
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
