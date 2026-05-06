import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Process } from '../Process';
import { ServiceArea } from '../ServiceArea';
import { Breadcrumb } from '../Breadcrumb';

export const ConstructionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-[80px] md:pt-[104px]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Services', path: '/#services' },
        { label: 'Construction Debris Removal' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 inline-flex items-center gap-3 before:content-[''] before:inline-block before:h-px before:w-8 before:bg-gray-300">
                Construction Services
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight mb-6 md:mb-8 leading-[1.05]">
                Construction Debris Removal
              </h1>
              
              <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Fast, upfront pricing for drywall, wood, metal, and renovation waste. One-time or recurring service available nationwide.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button 
                  onClick={() => navigate('/quote')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
                >
                  Get Free Quote
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-sm font-medium text-gray-700 underline-offset-4 hover:text-gray-900 hover:underline transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] overflow-hidden rounded-sm">
              <img 
                src="/opek2.webp"
                loading="lazy"
                alt="Professional construction debris removal service"
                className="w-full h-full object-cover"
              />
            
            </div>

          </div>
        </div>
      </section>

      {/* What We Remove Section */}
      <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          <div className="mb-16 md:mb-20 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 leading-tight mb-4 tracking-tight">
              What We Remove
            </h2>
            <p className="text-gray-500 text-base">
              From drywall to metal scraps, we handle all construction debris
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Drywall & Framing</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Drywall Scraps</li>
                <li>Wood Framing</li>
                <li>Lumber Waste</li>
                <li>Plywood Sheets</li>
                <li>Insulation</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Flooring & Tile</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Carpet & Padding</li>
                <li>Hardwood Flooring</li>
                <li>Tile & Grout</li>
                <li>Vinyl & Laminate</li>
                <li>Concrete Debris</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Metal & Fixtures</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Metal Scraps</li>
                <li>Piping & Ductwork</li>
                <li>Old Fixtures</li>
                <li>Wiring & Cable</li>
                <li>Roofing Materials</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">General Debris</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Packaging Materials</li>
                <li>Pallets & Crates</li>
                <li>Scrap Materials</li>
                <li>Demo Waste</li>
                <li>Site Cleanup</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight leading-tight">
            Professional Construction Debris Removal
          </h2>
          
          <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
            Whether you're working on a remodel, new build, or demolition project, our construction debris removal service keeps your site clean and compliant with OSHA standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-gray-200">
            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">Contractor-Friendly</h3>
              <p className="text-gray-500 leading-relaxed">
                Recurring service options and volume pricing for contractors. Same-day availability in most areas with reliable scheduling to keep your project on track.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">OSHA-Compliant</h3>
              <p className="text-gray-500 leading-relaxed">
                Licensed and insured professionals following OSHA-compliant disposal practices. Proper handling of all construction materials and debris.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <Process onGetQuote={() => navigate('/quote')} />

      {/* Service Area Section */}
      <ServiceArea onGetQuote={() => navigate('/quote')} />

    </div>
  );
};
