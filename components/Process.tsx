import React from 'react';
import { Camera, ClipboardCheck, Truck, ArrowRight } from 'lucide-react';

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
      icon: ClipboardCheck,
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
    <section id="process" className="py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Centered */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
            How it Works
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Point. Price. <span className="text-gray-400">Gone.</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Three simple steps to a clutter-free space
          </p>
        </div>

        {/* Steps - Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-black hover:shadow-xl transition-all duration-300"
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gray-100 group-hover:bg-black text-gray-400 group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                  <step.icon size={28} />
                </div>
                <span className="text-5xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">
                  0{index + 1}
                </span>
              </div>
              
              <h3 className="text-xl font-black mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-white rounded-2xl border-2 border-gray-100 relative overflow-hidden">
          {/* Subtle background image for mobile */}
          <div className="absolute inset-0 opacity-5 md:opacity-0">
            <img 
              src="/junk-removal.png" 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black text-xl">
              70%
            </div>
            <p className="text-gray-600 max-w-sm">
              Up to <strong className="text-black">70% of debris</strong> recycled and donated nationwide.
            </p>
          </div>
          
          <button 
            onClick={onGetQuote}
            className="relative z-10 px-8 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md inline-flex items-center gap-2 whitespace-nowrap"
          >
            Get Your Quote
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
};