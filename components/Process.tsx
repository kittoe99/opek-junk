import React from 'react';
import { ScanLine, HandCoins, Truck, ArrowRight } from 'lucide-react';

interface ProcessProps {
  onGetQuote?: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onGetQuote }) => {
  const steps = [
    {
      icon: ScanLine,
      number: "01",
      title: "SCAN YOUR JUNK",
      desc: "Snap a photo — our AI scans the pile, identifies every item, and calculates the load size instantly.",
    },
    {
      icon: HandCoins,
      number: "02",
      title: "LOCK IN YOUR PRICE",
      desc: "Get a guaranteed price range on the spot. What you see is what you pay — zero hidden fees.",
    },
    {
      icon: Truck,
      number: "03",
      title: "WE HAUL IT ALL",
      desc: "Our licensed, insured crew shows up on time, loads everything, and leaves your space clean.",
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
            <div key={index} className="group relative bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 hover:bg-black hover:border-black transition-all duration-300">
              {/* Step number */}
              <span className="text-[64px] md:text-[80px] font-black leading-none text-gray-100 group-hover:text-white/10 absolute top-3 right-5 transition-colors duration-300 select-none">
                {step.number}
              </span>

              {/* Icon */}
              <div className="relative z-10 w-12 h-12 bg-black text-white group-hover:bg-emerald-500 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                <step.icon size={22} strokeWidth={2} />
              </div>
              
              {/* Content */}
              <h3 className="relative z-10 text-base md:text-lg font-black text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="relative z-10 text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed transition-colors duration-300">
                {step.desc}
              </p>

              {/* Connector (desktop) */}
              {index < 2 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm">
                  <ArrowRight size={11} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};