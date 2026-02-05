import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Ruler, CheckCircle2 } from 'lucide-react';
import { Process } from '../Process';
import { ServiceArea } from '../ServiceArea';
import { Breadcrumb } from '../Breadcrumb';

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
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Services', path: '/#services' },
        { label: 'Dumpster Rental' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-32 bg-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 block">
                Dumpster Rental
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight mb-4 md:mb-6 leading-tight">
                Dumpster Rental
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 md:mb-8">
                Flexible dumpster rental solutions for any project size. From small home cleanouts to large construction sites, delivered fast with transparent pricing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/quote')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md"
                >
                  Get Free Quote
                </button>
                <button 
                  onClick={() => navigate('/booking')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border border-black text-black bg-white hover:bg-black hover:text-white transition-all rounded-lg shadow-sm"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative aspect-[3/2] sm:aspect-[4/3] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
              <img 
                src="/junk-removal.png" 
                alt="Professional dumpster rental service" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={18}/>
                  <span className="text-sm font-bold">Multiple Sizes • Flexible Periods • Fast Delivery</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dumpster Sizes Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4 tracking-tight">
              Choose Your Size
            </h2>
            <p className="text-gray-600 text-lg">
              We offer dumpsters in multiple sizes to fit any project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dumpsterSizes.map((dumpster, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-black transition-all hover:shadow-lg">
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
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
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

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
            Professional Dumpster Rental Service
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Whether you're tackling a home renovation, construction project, or major cleanout, our dumpster rental service provides the right size container with flexible rental periods and transparent pricing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-black text-black mb-3">Flexible & Convenient</h3>
              <p className="text-gray-600 leading-relaxed">
                Same-day and next-day delivery available. Flexible rental periods with weekly and monthly options. We place the dumpster exactly where you need it.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black text-black mb-3">Transparent Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                No hidden fees. Upfront pricing includes delivery, pickup, and disposal. Eco-friendly disposal with recycling and donation whenever possible.
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
