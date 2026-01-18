import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, Armchair, Refrigerator, Trash2, CheckCircle2 } from 'lucide-react';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    { 
      category: 'Furniture',
      items: ['Couches & Sofas', 'Mattresses & Box Springs', 'Tables & Chairs', 'Dressers & Cabinets']
    },
    { 
      category: 'Appliances',
      items: ['Refrigerators & Freezers', 'Washers & Dryers', 'Stoves & Ovens', 'Dishwashers']
    },
    { 
      category: 'General Items',
      items: ['Boxes & Clutter', 'Electronics & E-Waste', 'Yard Waste', 'Exercise Equipment']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden pt-32 pb-20 md:pb-32">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Residential Junk Removal Nationwide</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight mb-6 leading-[1.05]">
                Residential Junk Removal
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-lg">
                Residential junk removal near you—fast, upfront pricing for furniture removal, appliance pickup, and household junk. Same-day and next-day options nationwide with trusted local pros.
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
                  alt="Professional residential junk removal service nationwide" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={18}/>
                    <span className="text-sm font-bold">Same-Day Service • 60% Recycled • Licensed & Insured</span>
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
              Common <span className="text-gray-400">items.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Furniture</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Couches & Sofas</li>
                <li>• Mattresses & Beds</li>
                <li>• Tables & Chairs</li>
                <li>• Dressers & Cabinets</li>
                <li>• Entertainment Centers</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Appliances</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Refrigerators & Freezers</li>
                <li>• Washers & Dryers</li>
                <li>• Stoves & Ovens</li>
                <li>• Dishwashers</li>
                <li>• Water Heaters</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">Electronics</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• TVs & Monitors</li>
                <li>• Computers & Laptops</li>
                <li>• Printers & Scanners</li>
                <li>• Stereo Equipment</li>
                <li>• Gaming Consoles</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-black text-lg mb-4">General Items</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Boxes & Clutter</li>
                <li>• Yard Waste & Debris</li>
                <li>• Exercise Equipment</li>
                <li>• Patio Furniture</li>
                <li>• Storage Items</li>
              </ul>
            </div>

          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Over 60% of items are donated or recycled. Most items are accepted, excluding hazardous materials.
            </p>
          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Residential Junk Removal Services</h2>
            
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">
              Need residential junk removal fast? Book furniture, appliance, and household junk pickup nationwide. Ideal for move-outs, garage cleanouts, downsizing, and decluttering.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-black text-black mb-3">Service Options</h3>
                <p className="text-gray-700 leading-relaxed">
                  Single-item pickups, room cleanouts, garages, basements, and full home cleanouts. Upfront pricing with same-day availability in most areas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-black text-black mb-3">Why Choose Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  Licensed and insured professionals. No hidden fees. Donation and recycling prioritized whenever possible. Reliable scheduling and clear communication.
                </p>
              </div>
            </div>
          </div>

          {/* Single Image */}
          <div className="my-12 max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
              <img 
                src="/opek2.png" 
                alt="Professional junk removal service nationwide" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-black mb-6">Nationwide Service</h3>
            <p className="text-gray-700 leading-relaxed mb-10">
              Professional junk removal services across the United States. From coast to coast, trusted local professionals ready to help. Contact us for service in your area.
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
