import React from 'react';
import { Camera, Banknote, Truck } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    { 
      title: 'Snap a photo', 
      desc: 'Text or upload pictures of what needs to go.',
      icon: Camera
    },
    { 
      title: 'Lock the price', 
      desc: 'Crew confirms volume and gives a flat quote.',
      icon: Banknote
    },
    { 
      title: 'We haul it', 
      desc: 'You point, we lift, sweep, and roll out.',
      icon: Truck
    },
  ];

  return (
    <section id="process" className="py-16 md:py-20 border-b border-secondary-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="block w-8 h-px bg-brand" />
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">From Photo to Empty Room</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.05]">
            Simple from start to finish.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          {steps.map((step) => (
            <div key={step.title} className="relative group">
              <div className="relative z-10 pt-8 border-t-2 border-secondary-100 group-hover:border-brand transition-colors duration-500">
                <div className="mb-6">
                  <step.icon 
                    size={56} 
                    strokeWidth={1} 
                    className="text-secondary-300 group-hover:text-brand transition-colors duration-500" 
                  />
                </div>
                <h3 className="font-black text-secondary text-xl mb-3 group-hover:text-brand transition-colors duration-300">{step.title}</h3>
                <p className="text-secondary-500 text-base leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};