import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Calendar, Ruler, CheckCircle2 } from 'lucide-react';

export const DumpsterRentalPage: React.FC = () => {
  const navigate = useNavigate();

  const dumpsterSizes = [
    { 
      size: '10 Yard',
      dimensions: '12\' L × 8\' W × 3.5\' H',
      capacity: '3-4 pickup truck loads',
      bestFor: ['Small cleanouts', 'Garage cleanups', 'Minor renovations', 'Yard waste']
    },
    { 
      size: '20 Yard',
      dimensions: '22\' L × 8\' W × 4.5\' H',
      capacity: '6-8 pickup truck loads',
      bestFor: ['Medium renovations', 'Roof replacements', 'Large cleanouts', 'Flooring removal']
    },
    { 
      size: '30 Yard',
      dimensions: '22\' L × 8\' W × 6\' H',
      capacity: '9-12 pickup truck loads',
      bestFor: ['Major renovations', 'New construction', 'Large demolition', 'Estate cleanouts']
    },
    { 
      size: '40 Yard',
      dimensions: '22\' L × 8\' W × 8\' H',
      capacity: '12-16 pickup truck loads',
      bestFor: ['Commercial projects', 'Full home demolition', 'Large construction sites', 'Major cleanouts']
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Dumpster Rental Nationwide</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight mb-6 leading-[1.05]">
                Dumpster Rental
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-lg">
                Flexible dumpster rental solutions for any project size. From small home cleanouts to large construction sites, get the right size dumpster delivered fast with transparent pricing and reliable service.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/quote')}
                  className="px-6 py-3 text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300 rounded-lg shadow-md hover:shadow-xl"
                >
                  Get Free Quote
                </button>
                <button 
                  onClick={() => navigate('/booking')}
                  className="px-6 py-3 text-sm font-bold uppercase tracking-wider border-2 border-black text-black bg-white hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 rounded-lg"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/junk-removal.png" 
                  alt="Dumpster rental service" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={18}/>
                    <span className="text-sm font-bold">Multiple Sizes • Flexible Rental Periods • Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dumpster Sizes Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Choose Your Size</h2>
            <p className="text-gray-600 text-lg">We offer dumpsters in multiple sizes to fit any project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dumpsterSizes.map((dumpster, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-black transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <Truck size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black">{dumpster.size}</h3>
                </div>
                
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Ruler size={16} />
                    <span className="font-medium">{dumpster.dimensions}</span>
                  </div>
                  <p className="text-sm text-gray-500">{dumpster.capacity}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Best For:</p>
                  <ul className="space-y-1">
                    {dumpster.bestFor.map((use, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-black mt-0.5">•</span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple, fast, and hassle-free dumpster rental</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                1
              </div>
              <h3 className="text-xl font-black mb-3">Choose Size & Schedule</h3>
              <p className="text-gray-600">
                Select the right dumpster size for your project and pick your delivery date. We offer flexible rental periods.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                2
              </div>
              <h3 className="text-xl font-black mb-3">We Deliver</h3>
              <p className="text-gray-600">
                Our team delivers the dumpster to your location at the scheduled time. We'll place it exactly where you need it.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                3
              </div>
              <h3 className="text-xl font-black mb-3">We Pick Up</h3>
              <p className="text-gray-600">
                When you're done, we'll pick up the dumpster and handle all disposal responsibly. No hassle, no stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Why Choose Our Dumpster Rental?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Transparent Pricing</h3>
                    <p className="text-gray-600">No hidden fees. Get upfront pricing with delivery, pickup, and disposal included.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Fast Delivery</h3>
                    <p className="text-gray-600">Same-day and next-day delivery available. Get your dumpster when you need it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Flexible Rental Periods</h3>
                    <p className="text-gray-600">Rent for as long as you need. Weekly and monthly options available.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Eco-Friendly Disposal</h3>
                    <p className="text-gray-600">We recycle and donate whenever possible, keeping waste out of landfills.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Professional Service</h3>
                    <p className="text-gray-600">Experienced team, reliable equipment, and exceptional customer service.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img 
                src="/junk-removal.png" 
                alt="Professional dumpster rental service" 
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Rent a Dumpster?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get a free quote in minutes. Fast delivery, transparent pricing, and professional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/quote')}
              className="px-6 py-3 text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-all duration-300 rounded-lg shadow-md hover:shadow-xl hover:scale-105"
            >
              Get Free Quote
            </button>
            <button 
              onClick={() => navigate('/booking')}
              className="px-6 py-3 text-sm font-bold uppercase tracking-wider border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-lg hover:scale-105"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
