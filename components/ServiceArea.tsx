import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { cities } from '../lib/cityData';

interface ServiceAreaProps {
  onGetQuote?: () => void;
  titleStart?: string;
  titleAccent?: string;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ 
  onGetQuote,
  titleStart = "Empty the space.",
  titleAccent = "On schedule."
}) => {
  const navigate = useNavigate();
  
  const handleQuoteClick = () => {
    if (onGetQuote) onGetQuote();
    else navigate('/quote');
  };

  const popularCities = cities.slice(0, 6);

  return (
    <section id="service-area" className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

          {/* Media Column - Asymmetrical Offset Layout */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[280px] md:max-w-[340px] aspect-square group">
              
              {/* Decorative Offset Frame */}
              <div className="absolute inset-0 bg-brand/5 border border-brand/10 rounded-3xl translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
              
              {/* Floating States Covered Badge */}
              <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-white rounded-full shadow-2xl border border-secondary-100/80 flex flex-col items-center justify-center text-center p-2 z-20 rotate-[12deg] group-hover:rotate-0 transition-transform duration-500 ease-out select-none">
                <MapPin size={14} className="text-brand fill-brand/10 mb-0.5" />
                <span className="text-base font-black text-secondary leading-none">50</span>
                <span className="text-[7px] font-black text-secondary-400 uppercase tracking-widest mt-1">States</span>
              </div>
              
              {/* Main Photo Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-secondary-200/50 shadow-xl bg-secondary-50">
                <img
                  src="/service_area_truck.png"
                  alt="Vetted service truck nationwide"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Service Area Column */}
          <div className="space-y-7">
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <MapPin size={12} className="text-brand" />
                <p className="text-[10px] font-bold text-brand uppercase tracking-[0.3em]">Service Area</p>
              </div>
              <h3 className="text-xl font-black text-secondary mb-2">Nationwide coverage.</h3>
              <p className="text-sm text-secondary-400 leading-relaxed">
                Available in all 50 states. Same flat-rate pricing, same independent provider standards — wherever you are.
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-[0.25em] mb-3">Popular Cities</p>
              <div className="space-y-2">
                {popularCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="flex items-center gap-2 text-secondary-500 hover:text-brand transition-colors text-sm group py-0.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-secondary-200 group-hover:bg-brand transition-colors shrink-0" />
                    <span>{city.name}, {city.stateAbbr}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};