import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Process } from '../Process';
import { ServiceArea } from '../ServiceArea';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 block">
                Residential Services
              </span>

              <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight mb-6 leading-tight">
                Residential Junk Removal
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Fast, upfront pricing for furniture removal, appliance pickup, and household junk. Same-day and next-day options nationwide.
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
                  Contact Us
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="/opek2.png" 
                alt="Professional residential junk removal service" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18}/>
                  <span className="text-sm font-bold">Same-Day Service • Licensed & Insured</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What We Remove Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4 tracking-tight">
              What We Remove
            </h2>
            <p className="text-gray-600 text-lg">
              From furniture to appliances, we handle it all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Furniture</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Couches & Sofas</li>
                <li>• Mattresses & Beds</li>
                <li>• Tables & Chairs</li>
                <li>• Dressers & Cabinets</li>
                <li>• Entertainment Centers</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Appliances</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Refrigerators & Freezers</li>
                <li>• Washers & Dryers</li>
                <li>• Stoves & Ovens</li>
                <li>• Dishwashers</li>
                <li>• Water Heaters</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Electronics</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• TVs & Monitors</li>
                <li>• Computers & Laptops</li>
                <li>• Printers & Scanners</li>
                <li>• Stereo Equipment</li>
                <li>• Gaming Consoles</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">General Items</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Boxes & Clutter</li>
                <li>• Yard Waste & Debris</li>
                <li>• Exercise Equipment</li>
                <li>• Patio Furniture</li>
                <li>• Storage Items</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
            Professional Residential Junk Removal
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Whether you're moving, downsizing, or simply decluttering, our residential junk removal service makes it easy to clear out unwanted items. We handle everything from single-item pickups to full home cleanouts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-black text-black mb-3">Fast & Convenient</h3>
              <p className="text-gray-600 leading-relaxed">
                Same-day and next-day service available in most areas. We do all the heavy lifting, loading, and hauling—you just point to what needs to go.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black text-black mb-3">Eco-Friendly Disposal</h3>
              <p className="text-gray-600 leading-relaxed">
                We prioritize donation and recycling whenever possible. Up to 70% of collected items are diverted from landfills through responsible disposal practices.
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
