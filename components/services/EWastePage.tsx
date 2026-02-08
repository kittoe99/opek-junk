import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Process } from '../Process';
import { ServiceArea } from '../ServiceArea';
import { Breadcrumb } from '../Breadcrumb';

export const EWastePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[108px]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Services', path: '/#services' },
        { label: 'E-Waste & Appliance Recycling' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 block">
                E-Waste Services
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight mb-4 md:mb-6 leading-tight">
                E-Waste & Appliance Recycling
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8">
                Fast, upfront pricing for electronics, computers, appliances, and tech equipment. Eco-friendly disposal nationwide.
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
                alt="Professional e-waste recycling service"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18}/>
                  <span className="text-sm font-bold">Certified Recycling • Licensed & Insured</span>
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
              From computers to appliances, we recycle it all responsibly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Computers & Devices</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Desktop Computers</li>
                <li>• Laptops & Tablets</li>
                <li>• Monitors & Screens</li>
                <li>• Keyboards & Mice</li>
                <li>• Hard Drives</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Appliances</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Refrigerators</li>
                <li>• Washers & Dryers</li>
                <li>• Stoves & Ovens</li>
                <li>• Dishwashers</li>
                <li>• Microwaves</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Electronics</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• TVs & Displays</li>
                <li>• Printers & Scanners</li>
                <li>• Stereo Equipment</li>
                <li>• Gaming Consoles</li>
                <li>• Cable Boxes</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-black text-lg mb-4">Office Equipment</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Copiers & Fax Machines</li>
                <li>• Servers & Networking</li>
                <li>• Phone Systems</li>
                <li>• Batteries & UPS</li>
                <li>• Cables & Accessories</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
            Professional E-Waste & Appliance Recycling
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Whether you're upgrading office equipment, clearing out old electronics, or replacing appliances, our certified e-waste recycling service ensures environmentally responsible disposal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-black text-black mb-3">Certified Recycling</h3>
              <p className="text-gray-600 leading-relaxed">
                Partnered with certified recycling facilities to ensure proper handling of all electronic waste. Data destruction services available for secure disposal.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black text-black mb-3">Eco-Friendly Disposal</h3>
              <p className="text-gray-600 leading-relaxed">
                Licensed and insured professionals committed to keeping e-waste out of landfills. Same-day availability in most areas with reliable scheduling.
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
