import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const ConstructionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pt-32 pb-20 md:pb-32">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Construction Debris Removal Nationwide</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight mb-6 leading-[1.05]">
                Construction Debris Removal
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-lg">
                Construction debris removal near you—fast, upfront pricing for drywall, wood, metal, and renovation waste. One-time or recurring service nationwide with trusted local pros.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/quote')}
                  className="px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                >
                  Get Free Quote
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-10 py-4 text-base font-bold uppercase tracking-wider border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg"
                >
                  Call (303) 555-0199
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src="/opek2.png" 
                  alt="Professional construction debris removal service nationwide" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={18}/>
                    <span className="text-sm font-bold">OSHA-Compliant • Recurring Service • Licensed & Insured</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Remove Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
              What We Remove
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4 tracking-tight">
              Common <span className="text-gray-400">materials.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Drywall & Framing</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Drywall Scraps</li>
                <li>• Wood Framing</li>
                <li>• Lumber Waste</li>
                <li>• Plywood Sheets</li>
                <li>• Insulation</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Flooring & Tile</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Carpet & Padding</li>
                <li>• Hardwood Flooring</li>
                <li>• Tile & Grout</li>
                <li>• Vinyl & Laminate</li>
                <li>• Concrete Debris</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Metal & Fixtures</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Metal Scraps</li>
                <li>• Piping & Ductwork</li>
                <li>• Old Fixtures</li>
                <li>• Wiring & Cable</li>
                <li>• Roofing Materials</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">General Debris</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Packaging Materials</li>
                <li>• Pallets & Crates</li>
                <li>• Scrap Materials</li>
                <li>• Demo Waste</li>
                <li>• Site Cleanup</li>
              </ul>
            </div>

          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              OSHA-compliant disposal. Recurring service available. Volume discounts for contractors.
            </p>
          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Construction Debris Removal Services</h2>
            
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">
              Need construction debris removal fast? Book drywall, wood, metal, and renovation waste pickup nationwide. Ideal for remodels, new builds, demolition projects, and contractor site maintenance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-black text-black mb-3">Service Options</h3>
                <p className="text-gray-700 leading-relaxed">
                  One-time pickups, recurring site service, full demolition cleanouts, and contractor support. Upfront pricing with same-day availability in most areas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-black text-black mb-3">Why Choose Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  OSHA-compliant disposal practices. Licensed and insured professionals. Volume pricing for contractors. Reliable scheduling and clear communication.
                </p>
              </div>
            </div>
          </div>

          {/* Single Image */}
          <div className="my-12 max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
              <img 
                src="/opek2.png" 
                alt="Professional construction debris removal service nationwide" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-black mb-6">Nationwide Service</h3>
            <p className="text-gray-700 leading-relaxed mb-10">
              Construction debris removal services across the United States. From coast to coast, trusted local professionals ready to help. Contact us for service in your area.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t-2 border-gray-200 max-w-4xl mx-auto">
            <button 
              onClick={() => navigate('/quote')}
              className="px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
            >
              Get Free Quote
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-10 py-4 text-base font-bold uppercase tracking-wider border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg"
            >
              Contact Us
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
