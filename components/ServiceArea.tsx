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

  // Get first 8 cities for the minified clean list
  const popularCities = cities.slice(0, 8);

  return (
    <section id="service-area" className="py-20 md:py-28 bg-white border-t border-secondary-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">
          
          {/* Image Column */}
          <div className="md:col-span-6 lg:col-span-5 relative group overflow-hidden rounded-2xl shadow-md border border-secondary-100/50">
            <img 
              src="/opek-clean-space.png" 
              alt="Decluttered and clean modern living space representing an empty space" 
              className="w-full h-full object-cover aspect-[4/3] md:aspect-square transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent pointer-events-none" />
          </div>

          {/* CTA Column */}
          <div className="md:col-span-6 lg:col-span-4 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-6 h-px bg-brand" />
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Ready to start?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
                {titleStart}<br />
                <span className="text-brand">{titleAccent}</span>
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-start md:items-stretch lg:items-start gap-3">
              <button
                onClick={handleQuoteClick}
                className="px-6 py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-all duration-300 inline-flex items-center justify-center gap-2 rounded-xl shadow-md hover:shadow-lg active:scale-95"
              >
                Get a Free Quote <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="px-6 py-3.5 bg-white text-secondary font-bold text-xs uppercase tracking-wider hover:bg-secondary-100 transition-all duration-300 inline-flex items-center justify-center gap-2 rounded-xl shadow-sm border border-secondary-200 hover:border-secondary-300 active:scale-95"
              >
                Book Online <ArrowRight size={14} />
              </button>
            </div>

            <div>
              <a
                href="tel:8313187139"
                className="inline-flex items-center gap-2 text-secondary-500 hover:text-brand transition-colors text-sm font-semibold group"
              >
                <Phone size={14} className="text-secondary-400 group-hover:text-brand transition-colors" />
                <span>(831) 318-7139</span>
              </a>
            </div>
          </div>

          {/* Service Area Column */}
          <div className="md:col-span-12 lg:col-span-3 space-y-6 lg:border-l lg:border-secondary-100 lg:pl-8 pt-8 md:pt-4 lg:pt-0 border-t md:border-t-0 lg:border-t-0 border-secondary-100">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <MapPin size={13} className="text-brand" />
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Service Area</span>
              </div>
              <h3 className="text-2xl font-black text-secondary tracking-tight">
                Nationwide coverage.
              </h3>
              <p className="text-secondary-500 text-xs leading-relaxed">
                Available in all 50 states. Same flat-rate pricing, same crew standards — wherever you are.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] font-black text-secondary-400 uppercase tracking-[0.2em]">Popular Cities</p>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2.5">
                {popularCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="text-secondary hover:text-brand transition-colors text-xs font-semibold inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-200 group-hover:bg-brand transition-colors shrink-0" />
                    <span className="truncate">{city.name}, {city.stateAbbr}</span>
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