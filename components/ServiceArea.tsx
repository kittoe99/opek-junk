import React from 'react';
import { MapPin, ArrowRight, Navigation } from 'lucide-react';

const cities = [
  "Denver", "Aurora", "Lakewood", "Thornton", "Arvada",
  "Westminster", "Centennial", "Boulder", "Highlands Ranch", "Greeley",
  "Longmont", "Loveland", "Broomfield", "Castle Rock", "Commerce City",
  "Parker", "Littleton", "Northglenn", "Brighton", "Englewood",
  "Wheat Ridge", "Golden", "Lafayette", "Louisville", "Erie"
];

interface ServiceAreaProps {
  onGetQuote?: () => void;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ onGetQuote }) => {
  return (
    <section id="service-area" className="py-16 md:py-24 lg:py-32 bg-gray-50 text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Info & Description */}
          <div className="flex flex-col space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider mb-6">
                <Navigation size={12} />
                <span>Service Radius</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                Serving Denver & <br/>
                <span className="text-gray-400">Surrounding Areas</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light mb-6">
                We operate within a 50-mile radius of downtown Denver. From residential driveways to commercial lots, we are your local junk removal experts.
              </p>
              
              <button 
                onClick={onGetQuote}
                className="px-10 py-4 text-base font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 transition-colors rounded-lg shadow-md inline-flex items-center gap-2"
              >
                Check Your Area
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
               <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                 <MapPin className="text-gray-400" size={20}/>
                 Outside our range?
               </h3>
               <p className="text-gray-600 mb-6">
                 We occasionally travel further for larger jobs. Contact us to discuss your specific needs.
               </p>
               <a href="mailto:hello@opekjunk.com" className="text-black font-bold hover:underline decoration-2 underline-offset-4 inline-flex items-center group">
                 Contact Support <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
               </a>
            </div>
          </div>

          {/* Right Column: Cities List */}
          <div className="relative">
            {/* Decorative background element */}
            <div className="absolute -inset-4 bg-gray-200/50 rounded-3xl -z-10 blur-xl opacity-50"></div>
            
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
               <div className="flex flex-wrap gap-2">
                 {cities.map((city) => (
                   <div 
                     key={city} 
                     className="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-100 hover:border-black hover:bg-black hover:text-white transition-all duration-200 cursor-default select-none"
                   >
                     {city}
                   </div>
                 ))}
               </div>
               <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400 tracking-wider uppercase">
                  <span>Colorado Based</span>
                  <span>50 Mile Zone</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};