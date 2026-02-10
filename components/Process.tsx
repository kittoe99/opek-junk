import React from 'react';
import { Camera, BadgeDollarSign, Sparkles, ArrowRight } from 'lucide-react';

interface ProcessProps {
  onGetQuote?: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onGetQuote }) => {
  const steps = [
    {
      icon: Camera,
      title: "SNAP A PHOTO",
      desc: "Take a quick photo of your junk. Our AI instantly analyzes the volume and gives you a price range.",
      accent: "bg-emerald-50 border-emerald-100 text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      icon: BadgeDollarSign,
      title: "GET YOUR PRICE",
      desc: "Receive an upfront, transparent quote. No hidden fees, no surprises — just honest pricing.",
      accent: "bg-blue-50 border-blue-100 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      icon: Sparkles,
      title: "WE HANDLE IT",
      desc: "Our insured pros arrive on time, haul everything away, and leave your space spotless.",
      accent: "bg-amber-50 border-amber-100 text-amber-600",
      iconBg: "bg-amber-100",
    }
  ];

  return (
    <section id="process" className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-3 md:mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Point. Price. <span className="text-gray-400">Gone.</span> Three simple steps to a clutter-free space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((step, index) => (
            <div key={index} className={`relative rounded-2xl border p-6 md:p-8 transition-all hover:shadow-lg ${step.accent}`}>
              {/* Step number */}
              <div className="absolute -top-3 left-6 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 ${step.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <step.icon size={26} strokeWidth={2} />
              </div>
              
              {/* Content */}
              <h3 className="text-base md:text-lg font-black text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.desc}
              </p>

              {/* Connector arrow (desktop only) */}
              {index < 2 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center">
                  <ArrowRight size={12} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};