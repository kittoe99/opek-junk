import React from 'react';
import { Camera, Calculator, Truck } from 'lucide-react';

interface ProcessProps {
  onGetQuote?: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onGetQuote }) => {
  const steps = [
    {
      icon: Camera,
      title: "PHOTO ESTIMATE",
      desc: "Snap a quick photo of your junk. Get instant volume analysis and pricing from local professionals."
    },
    {
      icon: Calculator,
      title: "UPFRONT QUOTE",
      desc: "On-site confirmation with a fixed price. No surcharges, no hidden fees, no games."
    },
    {
      icon: Truck,
      title: "HEAVY LIFTING",
      desc: "Professional hauling, sorting, and cleanup. You just point—the team handles the rest."
    }
  ];

  return (
    <section id="process" className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Centered */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-tight mb-3 md:mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-secondary text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Point. Price. <span className="text-brand">Gone.</span> Three simple steps to a clutter-free space
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-secondary-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 bg-white border border-secondary-200 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-sm hover:shadow-md hover:border-brand transition-all duration-200">
                    <step.icon size={28} className="text-brand md:hidden" strokeWidth={1.5} />
                    <step.icon size={36} className="text-brand hidden md:block" strokeWidth={1.5} />
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-7 h-7 md:w-8 md:h-8 bg-brand text-white rounded-full flex items-center justify-center font-black text-xs md:text-sm z-20 shadow-sm">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-base md:text-lg font-black text-secondary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary text-sm leading-relaxed max-w-[260px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};