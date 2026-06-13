import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const serviceItems = [
  {
    title: "Junk Removal",
    description: "Furniture, appliances, office decommissioning, and household clutter. Full-service residential and commercial junk hauling.",
    path: "/services/junk-removal",
    image: "/card-junk-removal.png",
    num: "01",
    tagline: "Full-service hauling for home & office"
  },
  {
    title: "Dumpster Rental",
    description: "Roll-off container rentals delivered to your site. Choose from multiple sizes with upfront, flat-rate pricing.",
    path: "/services/dumpster-rental",
    image: "/card-dumpster-rental.png",
    num: "02",
    tagline: "Clean containers, flexible rental periods"
  },
  {
    title: "Property Cleanouts",
    description: "Estate clearing, move-outs, hoarding situations, and full property cleanouts. Professional, thorough, and discreet.",
    path: "/services/property-cleanout",
    image: "/card-donation-pickup.png",
    num: "03",
    tagline: "Estate, hoarding, and move-out prep"
  },
  {
    title: "Moving Labor",
    description: "Hire strong, experienced crews by the hour to load, unload, or move items within your home. (Labor only)",
    path: "/services/moving-labor",
    image: "/card-moving-labor.png",
    num: "04",
    tagline: "Strong vetted crews by the hour"
  }
];

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="services" className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight">
            Fast pickup.<br />
            <span className="text-brand">Fair pricing.</span>
          </h2>
        </div>

        {/* Mobile & Tablet layout (< lg) */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {serviceItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className="group cursor-pointer bg-white rounded-2xl border border-secondary-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary-50">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-secondary font-black text-xs px-3 py-1 rounded-full border border-secondary-100">
                  {item.num}
                </span>
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-secondary group-hover:text-brand transition-colors duration-300">{item.title}</h3>
                  <p className="text-secondary-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">{item.tagline}</p>
                  <p className="text-secondary-500 text-sm leading-relaxed mt-2">{item.description}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-xs font-black text-brand uppercase tracking-[0.15em] mt-auto">
                  <span>Explore Service</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout (>= lg) */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-start">
          
          {/* Sticky Image Column */}
          <div className="col-span-5 sticky top-32 h-[460px] rounded-3xl overflow-hidden border border-secondary-200/50 shadow-2xl bg-secondary-50">
            {serviceItems.map((item, idx) => (
              <img
                key={idx}
                src={item.image}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  activeIndex === idx 
                    ? 'opacity-100 scale-100 pointer-events-auto' 
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/15 to-transparent pointer-events-none" />
          </div>

          {/* Interactive Lists Column */}
          <div className="col-span-7 flex flex-col justify-center">
            {serviceItems.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => navigate(item.path)}
                className="group cursor-pointer py-8 border-b border-secondary-100/60 flex items-start gap-8 transition-colors duration-300 first:pt-0"
              >
                <span className={`text-sm font-black tracking-widest transition-colors duration-300 ${activeIndex === idx ? 'text-brand' : 'text-secondary-300'}`}>
                  {item.num}
                </span>
                
                <div className="flex-1 space-y-1">
                  <h3 className={`text-2xl font-black transition-colors duration-300 ${activeIndex === idx ? 'text-brand' : 'text-secondary'}`}>
                    {item.title}
                  </h3>
                  <p className="text-secondary-400 text-[10px] font-bold uppercase tracking-wider">{item.tagline}</p>
                  <p className="text-secondary-500 text-[15px] leading-relaxed max-w-xl pt-1">{item.description}</p>
                </div>

                <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                  activeIndex === idx ? 'border-brand bg-brand/5 text-brand rotate-[-45deg]' : 'border-secondary-200 text-secondary-400'
                }`}>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};