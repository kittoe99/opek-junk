import React from 'react';
import { Smartphone, Receipt, Trash2, ArrowRight } from 'lucide-react';

interface ProcessProps {
  onGetQuote?: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onGetQuote }) => {
  const steps = [
    {
      icon: Smartphone,
      title: "PHOTO ESTIMATE",
      desc: "Snap a quick photo of your junk. Get instant volume analysis and pricing from local professionals."
    },
    {
      icon: Receipt,
      title: "UPFRONT QUOTE",
      desc: "On-site confirmation with a fixed price. No surcharges, no hidden fees, no games."
    },
    {
      icon: Trash2,
      title: "HEAVY LIFTING",
      desc: "Professional hauling, sorting, and cleanup. You just point—the team handles the rest."
    }
  ];

  return (
    <section id="process" className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Point. Price. <span className="text-gray-400">Gone.</span> Three simple steps to a clutter-free space
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-200"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className="relative z-10 w-24 h-24 bg-white border-4 border-black rounded-full flex items-center justify-center mb-6">
                    <step.icon size={36} className="text-black" strokeWidth={2.5} />
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-sm z-20">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-black text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
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