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
    <section id="service-area" className="py-16 md:py-24 bg-white border-t border-secondary-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">

          {/* CTA Column */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold text-brand uppercase tracking-[0.3em] mb-4">Ready to start?</p>
              <h2 className="text-3xl md:text-4xl font-black text-secondary leading-tight">
                {titleStart}<br />
                <span className="text-brand">{titleAccent}</span>
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleQuoteClick}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-brand transition-all duration-200 active:scale-95"
              >
                Get a Free Quote
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary-50 text-secondary text-sm font-bold rounded-xl border border-secondary-200 hover:border-brand hover:text-brand transition-all duration-200 active:scale-95"
              >
                Book Online
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>

            <a
              href="tel:8313187139"
              className="inline-flex items-center gap-2 text-secondary-400 hover:text-brand transition-colors text-sm group"
            >
              <Phone size={13} className="group-hover:text-brand transition-colors" />
              <span className="font-medium">(831) 318-7139</span>
            </a>
          </div>

          {/* Service Area Column */}
          <div className="pt-8 md:pt-0 border-t md:border-t-0 border-secondary-100 space-y-7">
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