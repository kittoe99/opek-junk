import React from 'react';
import { MapPin, ArrowRight, Navigation } from 'lucide-react';

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
  "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington DC",
  "Boston", "Nashville", "Detroit", "Portland", "Las Vegas"
];

interface ServiceAreaProps {
  onGetQuote?: () => void;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ onGetQuote }) => {
  return (
    <section id="service-area" className="py-16 md:py-24 lg:py-32 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Image */}
          <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl shadow-2xl order-2 lg:order-1">
            <img 
              src="/junk-removal.png" 
              alt="Nationwide junk removal service" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold mb-4">
                <MapPin size={16} />
                <span>All 50 States</span>
              </div>
              <p className="text-white text-lg font-bold">
                Trusted professionals in your area
              </p>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col space-y-6 order-1 lg:order-2">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
                Nationwide Coverage
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Professional junk removal services coast to coast. Connect with trusted local professionals ready to help clear your space.
              </p>
              
              <button 
                onClick={onGetQuote}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md inline-flex items-center gap-2"
              >
                Check Your Area
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Cities Grid */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Major Cities Served</h3>
              <div className="flex flex-wrap gap-2">
                {cities.slice(0, 12).map((city) => (
                  <span 
                    key={city} 
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-medium border border-gray-200"
                  >
                    {city}
                  </span>
                ))}
                <span className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold">
                  +100 More
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};