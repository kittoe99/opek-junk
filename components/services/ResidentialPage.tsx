import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Process } from '../Process';
import { ServiceArea } from '../ServiceArea';
import { Breadcrumb } from '../Breadcrumb';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pt-[80px] md:pt-[104px]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Services', path: '/#services' },
        { label: 'Residential Junk Removal' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 inline-flex items-center gap-3 before:content-[''] before:inline-block before:h-px before:w-8 before:bg-gray-300">
                Residential Services
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight mb-6 md:mb-8 leading-[1.05]">
                Residential Junk Removal
              </h1>
              
              <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Fast, upfront pricing for furniture removal, appliance pickup, and household junk. Same-day and next-day options nationwide.
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
                alt="Professional residential junk removal service"
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
              From furniture to appliances, we handle it all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Furniture</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Couches & Sofas</li>
                <li>Mattresses & Beds</li>
                <li>Tables & Chairs</li>
                <li>Dressers & Cabinets</li>
                <li>Entertainment Centers</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Appliances</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Refrigerators & Freezers</li>
                <li>Washers & Dryers</li>
                <li>Stoves & Ovens</li>
                <li>Dishwashers</li>
                <li>Water Heaters</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Electronics</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>TVs & Monitors</li>
                <li>Computers & Laptops</li>
                <li>Printers & Scanners</li>
                <li>Stereo Equipment</li>
                <li>Gaming Consoles</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">General Items</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Boxes & Clutter</li>
                <li>Yard Waste & Debris</li>
                <li>Exercise Equipment</li>
                <li>Patio Furniture</li>
                <li>Storage Items</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight leading-tight">
            Professional Residential Junk Removal
          </h2>
          
          <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
            Whether you're moving, downsizing, or simply decluttering, our residential junk removal service makes it easy to clear out unwanted items. We handle everything from single-item pickups to full home cleanouts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-gray-200">
            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">Fast & Convenient</h3>
              <p className="text-gray-500 leading-relaxed">
                Same-day and next-day service available in most areas. We do all the heavy lifting, loading, and hauling—you just point to what needs to go.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">Eco-Friendly Disposal</h3>
              <p className="text-gray-500 leading-relaxed">
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
