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
    <div className="min-h-screen bg-white pt-[80px] md:pt-[104px]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Services', path: '/#services' },
        { label: 'Dumpster Rental' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 inline-flex items-center gap-3 before:content-[''] before:inline-block before:h-px before:w-8 before:bg-gray-300">
                Dumpster Rental
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight mb-6 md:mb-8 leading-[1.05]">
                Dumpster Rental
              </h1>
              
              <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Flexible dumpster rental solutions for any project size. From small home cleanouts to large construction sites, delivered fast with transparent pricing.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button 
                  onClick={() => navigate('/quote')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
                >
                  Get Free Quote
                </button>
                <button 
                  onClick={() => navigate('/booking')}
                  className="text-sm font-medium text-gray-700 underline-offset-4 hover:text-gray-900 hover:underline transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="lg:col-span-5 relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] overflow-hidden rounded-sm">
              <img 
                src="/junk-removal.webp" 
                loading="lazy"
                alt="Professional dumpster rental service" 
                className="w-full h-full object-cover"
              />
            
            </div>

          </div>
        </div>
      </section>

      {/* Dumpster Sizes Section */}
      <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 leading-tight mb-4 tracking-tight">
              Choose Your Size
            </h2>
            <p className="text-gray-500 text-base">
              We offer dumpsters in multiple sizes to fit any project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {dumpsterSizes.map((dumpster, index) => (
              <div key={index} className="border-t border-gray-200 pt-6 hover:border-gray-400 transition-all hover:shadow-lg">
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
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight leading-tight">
            Professional Dumpster Rental Service
          </h2>
          
          <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
            Whether you're tackling a home renovation, construction project, or major cleanout, our dumpster rental service provides the right size container with flexible rental periods and transparent pricing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-gray-200">
            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">Flexible & Convenient</h3>
              <p className="text-gray-500 leading-relaxed">
                Same-day and next-day delivery available. Flexible rental periods with weekly and monthly options. We place the dumpster exactly where you need it.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">Transparent Pricing</h3>
              <p className="text-gray-500 leading-relaxed">
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
