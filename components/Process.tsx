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
      title: 'Crews haul it', 
      desc: 'You point, partner crews lift, sweep, and roll out.',
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

        <div className="relative mt-8 md:mt-12">
          {/* Mobile vertical line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-secondary-100 md:hidden z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {steps.map((step) => (
              <div key={step.title} className="relative group flex md:block items-start gap-5 md:gap-0">
                
                {/* Mobile icon (circular) */}
                <div className="md:hidden relative z-10 bg-white py-2 shrink-0">
                  <div className="w-12 h-12 rounded-full border border-secondary-100 bg-white flex items-center justify-center group-hover:border-brand transition-colors duration-300 shadow-sm">
                    <step.icon size={20} strokeWidth={1.5} className="text-secondary-400 group-hover:text-brand transition-colors duration-300" />
                  </div>
                </div>

                {/* Desktop icon and content */}
                <div className="relative z-10 md:pt-8 md:border-t-2 md:border-secondary-100 md:group-hover:border-brand transition-colors duration-500 flex-1 pt-3 md:pt-8">
                  <div className="hidden md:block mb-6">
                    <step.icon 
                      size={56} 
                      strokeWidth={1} 
                      className="text-secondary-300 group-hover:text-brand transition-colors duration-500" 
                    />
                  </div>
                  <h3 className="font-black text-secondary text-lg md:text-xl mb-1.5 md:mb-3 group-hover:text-brand transition-colors duration-300">{step.title}</h3>
                  <p className="text-secondary-500 text-sm md:text-base leading-relaxed">{step.desc}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};