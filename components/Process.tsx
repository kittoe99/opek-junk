import React from 'react';
import { Camera, Banknote, Truck } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      title: 'Snap a photo',
      desc: 'Text or upload pictures of what needs to go.',
      icon: Camera,
    },
    {
      title: 'Lock the price',
      desc: 'Service provider confirms volume and gives a flat quote.',
      icon: Banknote,
    },
    {
      title: 'Providers haul it',
      desc: 'You point, partner service providers lift, sweep, and roll out.',
      icon: Truck,
    },
  ];

  return (
    <section id="process" className="py-16 md:py-24 bg-white border-b border-secondary-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-tight">
            Simple from start to finish.
          </h2>
          <p className="text-secondary-500 text-sm md:text-base leading-relaxed mt-3">
            From photo to empty room in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <div key={step.title} className="flex items-start gap-4 md:block md:space-y-4">
              <div className="w-12 h-12 rounded-xl border border-secondary-100 bg-secondary-50 flex items-center justify-center shrink-0 md:mb-4">
                <step.icon size={20} strokeWidth={1.5} className="text-secondary-500" />
              </div>
              <div>
                <h3 className="font-black text-secondary text-lg mb-2">{step.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
