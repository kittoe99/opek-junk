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
          <div className="w-full h-full rounded-3xl overflow-hidden border border-secondary-100/60 aspect-video md:aspect-square hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full h-full text-secondary">
              <defs>
                <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fcfcfd" />
                  <stop offset="100%" stopColor="#f3f4f6" />
                </linearGradient>
              </defs>
              
              {/* Background Card */}
              <rect width="400" height="400" fill="url(#bgGrad)" />
              
              {/* Graphic Elements */}
              <circle cx="150" cy="165" r="80" fill="url(#circleGrad)" />
              <path d="M 80,260 C 140,210 260,210 320,260" fill="none" stroke="#e5e7eb" strokeWidth="4" strokeLinecap="round" />
              
              {/* Minimalist Truck */}
              <g transform="translate(10, 0)">
                {/* Road Line */}
                <line x1="80" y1="270" x2="320" y2="270" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
                
                {/* Truck Cargo Box */}
                <rect x="110" y="130" width="130" height="110" rx="8" fill="#111827" />
                <line x1="175" y1="130" x2="175" y2="240" stroke="#374151" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Truck Cab */}
                <path d="M 240,240 L 240,165 L 275,165 C 285,165 295,175 295,190 L 295,240 Z" fill="#ff5a1f" />
                <path d="M 248,195 L 248,175 L 270,175 C 275,175 278,178 278,183 L 278,195 Z" fill="#111827" />
                
                {/* Wheels */}
                <circle cx="150" cy="270" r="18" fill="#111827" stroke="#ffffff" strokeWidth="4" />
                <circle cx="150" cy="270" r="6" fill="#ffffff" />
                
                <circle cx="260" cy="270" r="18" fill="#111827" stroke="#ffffff" strokeWidth="4" />
                <circle cx="260" cy="270" r="6" fill="#ffffff" />
                
                {/* Speed/Wind lines */}
                <path d="M 75,150 L 95,150" stroke="#ff5a1f" strokeWidth="3" strokeLinecap="round" />
                <path d="M 65,175 L 90,175" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
                <path d="M 70,200 L 95,200" stroke="#ff5a1f" strokeWidth="3" strokeLinecap="round" />
              </g>
              
              {/* Sparkles representing clean spaces */}
              <g transform="translate(305, 95)">
                <path d="M 0,-15 L 0,15 M -15,0 L 15,0" stroke="#ff5a1f" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M -7.5,-7.5 L 7.5,7.5 M -7.5,7.5 L 7.5,-7.5" stroke="#ff5a1f" strokeWidth="1.5" />
              </g>
              <g transform="translate(70, 90) scale(0.6)">
                <path d="M 0,-15 L 0,15 M -15,0 L 15,0" stroke="#ff5a1f" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            </svg>
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