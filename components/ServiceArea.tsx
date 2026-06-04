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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#F1F5F9" />
                </linearGradient>
                <linearGradient id="brandPink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF006E" />
                  <stop offset="100%" stopColor="#D9005B" />
                </linearGradient>
                <linearGradient id="brandBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A5D78" />
                  <stop offset="100%" stopColor="#355070" />
                </linearGradient>
                <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.08" />
                </filter>
              </defs>

              {/* Background Card */}
              <rect width="400" height="400" fill="#FFFFFF" />

              {/* Background Decorative Circle */}
              <circle cx="200" cy="200" r="160" fill="url(#bgGrad)" />
              <circle cx="200" cy="200" r="130" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="8,8" />

              {/* Ground Shadows */}
              <ellipse cx="200" cy="320" rx="100" ry="8" fill="#E2E8F0" opacity="0.6" />

              {/* Opek Service Truck */}
              <g transform="translate(50, 150)" filter="url(#dropShadow)">
                {/* Truck Cargo Box */}
                <rect x="0" y="20" width="160" height="110" rx="8" fill="#355070" />
                {/* Stripe in Brand Pink */}
                <rect x="0" y="80" width="160" height="15" fill="url(#brandPink)" />
                {/* Cargo door lines */}
                <line x1="80" y1="20" x2="80" y2="130" stroke="#4A5D78" strokeWidth="1.5" />

                {/* Truck Cab */}
                <path d="M 160,130 L 160,50 L 205,50 C 215,50 225,60 225,75 L 225,130 Z" fill="#4A5D78" />
                {/* Stripe on Cab */}
                <path d="M 160,80 L 225,80 L 225,95 L 160,95 Z" fill="url(#brandPink)" />
                {/* Window */}
                <path d="M 168,75 L 168,58 L 198,58 C 204,58 208,62 208,68 L 208,75 Z" fill="#0F172A" />

                {/* Wheels */}
                <circle cx="45" cy="130" r="20" fill="#0F172A" stroke="#FFFFFF" strokeWidth="4" />
                <circle cx="45" cy="130" r="6" fill="#FFFFFF" />

                <circle cx="125" cy="130" r="20" fill="#0F172A" stroke="#FFFFFF" strokeWidth="4" />
                <circle cx="125" cy="130" r="6" fill="#FFFFFF" />

                <circle cx="195" cy="130" r="20" fill="#0F172A" stroke="#FFFFFF" strokeWidth="4" />
                <circle cx="195" cy="130" r="6" fill="#FFFFFF" />
              </g>

              {/* Provider Character (Helper) */}
              <g transform="translate(240, 160)" filter="url(#dropShadow)">
                {/* Legs */}
                <line x1="45" y1="110" x2="40" y2="165" stroke="#355070" strokeWidth="8" strokeLinecap="round" />
                <line x1="65" y1="110" x2="70" y2="165" stroke="#355070" strokeWidth="8" strokeLinecap="round" />
                {/* Shoes */}
                <rect x="32" y="160" width="16" height="8" rx="3" fill="#0F172A" />
                <rect x="62" y="160" width="16" height="8" rx="3" fill="#0F172A" />

                {/* Shoulders and Shirt */}
                <path d="M 10,120 C 10,80 35,70 60,70 C 85,70 110,80 110,120 Z" fill="url(#brandBlue)" />
                {/* V-neck collar */}
                <path d="M 45,70 L 60,88 L 75,70" fill="none" stroke="#FF006E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Head */}
                <circle cx="60" cy="40" r="20" fill="#E2E8F0" />
                {/* Pink cap */}
                <path d="M 40,38 C 40,22 55,20 80,25 L 88,25 L 88,31 Z" fill="#FF006E" />
                <path d="M 40,37 C 40,32 46,29 60,29 C 74,29 80,32 80,37 Z" fill="#FF006E" />
                {/* Smiley Face */}
                <circle cx="54" cy="42" r="1.5" fill="#0F172A" />
                <circle cx="66" cy="42" r="1.5" fill="#0F172A" />
                <path d="M 56,51 Q 60,55 64,51" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

                {/* Waving Arm */}
                <path d="M 15,80 C 5,70 -10,40 -15,20 L -3,15 C 3,35 15,60 25,75 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
              </g>

              {/* Sparkles representing clean spaces */}
              <g transform="translate(320, 80)">
                <path d="M 0,-15 L 0,15 M -15,0 L 15,0" stroke="#FF006E" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M -7.5,-7.5 L 7.5,7.5 M -7.5,7.5 L 7.5,-7.5" stroke="#FF006E" strokeWidth="1.5" />
              </g>
              <g transform="translate(60, 90) scale(0.6)">
                <path d="M 0,-15 L 0,15 M -15,0 L 15,0" stroke="#FF006E" strokeWidth="3.5" strokeLinecap="round" />
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