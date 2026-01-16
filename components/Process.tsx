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
      desc: "Snap a quick photo of the debris. Our system analyzes the volume and gives you a range instantly."
    },
    {
      icon: ClipboardCheck,
      title: "UPFRONT QUOTE",
      desc: "We confirm the volume on-site and hand you a fixed price. No surcharges, no hidden fees, no games."
    },
    {
      icon: Truck,
      title: "HEAVY LIFTING",
      desc: "We haul it, we sort it, we sweep it. You just point—we handle the rest of the dirty work."
    }
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" 
              alt="Junk removal process" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column - Content */}
          <div>
            {/* Header */}
            <div className="mb-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3 block">How it Works</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                Point. Price. <span className="text-gray-400">Gone.</span>
              </h2>
            </div>

            {/* Steps */}
            <div className="space-y-8 mb-12">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0">
                    <step.icon size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                      Step {index + 1}
                    </div>
                    <h3 className="text-lg font-black uppercase mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sustainability Note */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm mb-8">
                <div className="w-10 h-10 border-2 border-black/10 flex items-center justify-center font-black text-xs shrink-0">
                  70%
                </div>
                <p className="text-gray-600">
                  We recycle up to 70% of debris collected from Denver Metro sites.
                </p>
              </div>
              
              {/* CTA Button */}
              <button 
                onClick={onGetQuote}
                className="px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md inline-flex items-center gap-2"
              >
                Get Your Quote
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};