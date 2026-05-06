import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Process } from '../Process';
import { ServiceArea } from '../ServiceArea';
import { Breadcrumb } from '../Breadcrumb';

export const CommercialPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-[80px] md:pt-[104px]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[
        { label: 'Services', path: '/#services' },
        { label: 'Commercial Junk Removal' }
      ]} />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            
            {/* Left Column */}
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 inline-flex items-center gap-3 before:content-[''] before:inline-block before:h-px before:w-8 before:bg-gray-300">
                Commercial Services
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight mb-6 md:mb-8 leading-[1.05]">
                Commercial Junk Removal
              </h1>
              
              <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Fast, upfront pricing for office furniture, equipment removal, and commercial debris. After-hours and weekend options available nationwide.
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
                alt="Professional commercial junk removal service"
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
              From office furniture to equipment, we handle it all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Office Furniture</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Desks & Workstations</li>
                <li>Cubicles & Partitions</li>
                <li>Conference Tables</li>
                <li>Office Chairs</li>
                <li>Filing Cabinets</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Equipment</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Computers & Monitors</li>
                <li>Printers & Copiers</li>
                <li>Servers & IT Equipment</li>
                <li>Phone Systems</li>
                <li>Networking Gear</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">Storage</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Shelving Units</li>
                <li>Storage Boxes</li>
                <li>Archive Materials</li>
                <li>Warehouse Pallets</li>
                <li>Display Fixtures</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-light text-gray-900 tracking-tight mb-5">General Items</h3>
              <ul className="space-y-2.5 text-gray-500 text-sm">
                <li>Office Supplies</li>
                <li>Retail Fixtures</li>
                <li>Signage</li>
                <li>Packaging Materials</li>
                <li>Miscellaneous Debris</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight leading-tight">
            Professional Commercial Junk Removal
          </h2>
          
          <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
            Whether you're relocating offices, renovating retail space, or clearing warehouse inventory, our commercial junk removal service minimizes disruption to your business operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-gray-200">
            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">Flexible Scheduling</h3>
              <p className="text-gray-500 leading-relaxed">
                After-hours and weekend service available to avoid disrupting your business. We work around your schedule with minimal impact on operations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-light text-gray-900 tracking-tight mb-3">Volume Discounts</h3>
              <p className="text-gray-500 leading-relaxed">
                Recurring service options and volume pricing for businesses. Licensed and insured professionals with reliable coordination and clear communication.
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
