import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Process } from '../Process';
import { ServiceArea } from '../ServiceArea';
import { Breadcrumb } from '../Breadcrumb';

export const PropertyCleanoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[108px]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Services', path: '/#services' },
        { label: 'Property Cleanouts' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 block">
                Property Services
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight mb-4 md:mb-6 leading-tight">
                Property Cleanout Services
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8">
                Fast, upfront pricing for estate cleanouts, foreclosures, and move-outs. Professional and discreet service nationwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/quote')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                >
                  Get Free Quote
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg shadow-sm"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative aspect-[3/2] sm:aspect-[4/3] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
              <img 
                src="/opek2.webp"
                loading="lazy"
                alt="Professional property cleanout service"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18}/>
                  <span className="text-sm font-bold">Discreet Service • Licensed & Insured</span>
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
              Services We Provide
            </h2>
            <p className="text-gray-600 text-lg">
              From estate cleanouts to foreclosures, we handle it all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Estate Cleanouts</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Full Home Clearing</li>
                <li>• Personal Belongings</li>
                <li>• Furniture & Appliances</li>
                <li>• Garage & Basement</li>
                <li>• Donation Coordination</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Foreclosures</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Bank-Owned Properties</li>
                <li>• Abandoned Items</li>
                <li>• Trash-Out Service</li>
                <li>• Broom-Swept Finish</li>
                <li>• Fast Turnaround</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Move-Outs</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Rental Cleanouts</li>
                <li>• Unwanted Items</li>
                <li>• Apartment Clearing</li>
                <li>• Storage Unit Cleanouts</li>
                <li>• Same-Day Service</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Hoarding Situations</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Compassionate Service</li>
                <li>• Systematic Clearing</li>
                <li>• Discreet Handling</li>
                <li>• Biohazard Certified</li>
                <li>• Professional Support</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
            Professional Property Cleanout Services
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Whether you're handling an estate, managing a foreclosure, or clearing out a rental property, our compassionate and professional team provides discreet service with respect and care.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-black text-black mb-3">Compassionate & Discreet</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional and compassionate service for sensitive situations. Biohazard certified teams available for hoarding and estate cleanouts with complete discretion.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black text-black mb-3">Complete Cleanouts</h3>
              <p className="text-gray-600 leading-relaxed">
                Full property cleanouts with broom-swept finish. Donation and recycling prioritized. Same-day availability in most areas with reliable scheduling.
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
