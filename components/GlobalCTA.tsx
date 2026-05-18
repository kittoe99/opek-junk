import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { cities } from '../lib/cityData';

interface GlobalCTAProps {
  titleStart?: string;
  titleAccent?: string;
}

export const GlobalCTA: React.FC<GlobalCTAProps> = ({ 
  titleStart = "Empty the space.",
  titleAccent = "On schedule."
}) => {
  const navigate = useNavigate();

  // Get first 8 cities for the list to keep it compact
  const popularCities = cities.slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-white border-t border-secondary-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minified container wrapping the CTA for a highly premium, clean look */}
        <div className="bg-secondary-50/50 rounded-3xl p-8 md:p-12 border border-secondary-100">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Minified City Page Style CTA */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="block w-6 h-px bg-brand" />
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Ready to start?</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary tracking-tight leading-[1.05] mb-6">
                {titleStart}<br /><span className="text-brand">{titleAccent}</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
                <button
                  onClick={() => navigate('/quote')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 rounded-xl shadow-md"
                >
                  Get a Free Quote <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-secondary font-bold text-xs uppercase tracking-wider hover:bg-secondary-100 transition-colors inline-flex items-center justify-center gap-2 rounded-xl shadow-sm border border-secondary-200"
                >
                  Book Online <ArrowRight size={14} />
                </button>
              </div>

              <a
                href="tel:8313187139"
                className="inline-flex items-center gap-2 text-secondary-500 hover:text-brand transition-colors text-sm font-medium"
              >
                <Phone size={14} />
                <span>(831) 318-7139</span>
              </a>
            </div>

            {/* Nationwide Coverage / Cities List */}
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <MapPin size={13} className="text-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Service Area</span>
              </div>
              <p className="text-2xl md:text-3xl font-black text-secondary tracking-tight leading-[1.1] mb-3">
                Nationwide coverage.
              </p>
              <p className="text-secondary-500 text-sm leading-relaxed mb-8">
                Available in all 50 states. Same flat-rate pricing, same crew standards — wherever you are.
              </p>
              
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-4">Popular Cities</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {popularCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="text-secondary text-sm font-medium hover:text-brand transition-colors"
                  >
                    {city.name}, {city.stateAbbr}
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
