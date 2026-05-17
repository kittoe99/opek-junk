import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const cities: { label: string; slug?: string }[] = [
  { label: 'Dallas-Fort Worth, TX', slug: 'dallas-fort-worth' },
  { label: 'Jacksonville, FL', slug: 'jacksonville' },
  { label: 'Atlanta, GA', slug: 'atlanta' },
  { label: 'Los Angeles, CA' },
  { label: 'Houston, TX' },
  { label: 'Chicago, IL' },
  { label: 'Phoenix, AZ' },
  { label: 'Miami, FL' },
  { label: 'New York, NY' },
  { label: 'Seattle, WA' },
];

interface ServiceAreaProps {
  onGetQuote?: () => void;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ onGetQuote }) => {
  return (
    <section id="service-area" className="py-16 md:py-24 lg:py-32 bg-white border-t border-secondary-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left: Headline + CTA */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <MapPin size={13} className="text-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Service Area</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight mb-5">
              Nationwide<br />coverage.
            </h2>
            <p className="text-secondary-500 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Available in all 50 states. Same flat-rate pricing, same crew standards — wherever you are.
            </p>
            <button
              onClick={onGetQuote}
              className="px-8 py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-xl"
            >
              Check Your Area <ArrowRight size={16} />
            </button>
          </div>

          {/* Right: Popular cities */}
          <div>
            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-4">Popular Cities</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) =>
                city.slug ? (
                  <Link
                    key={city.label}
                    to={`/locations/${city.slug}`}
                    className="px-3 py-1.5 border border-secondary-100 text-secondary text-xs font-medium hover:border-brand hover:text-brand transition-colors"
                  >
                    {city.label}
                  </Link>
                ) : (
                  <span
                    key={city.label}
                    className="px-3 py-1.5 border border-secondary-100 text-secondary-500 text-xs font-medium"
                  >
                    {city.label}
                  </span>
                )
              )}
            </div>
            <p className="text-secondary-400 text-xs mt-6 leading-relaxed">
              Don't see your city? We serve every ZIP in the US — just{' '}
              <button onClick={onGetQuote} className="text-secondary font-bold underline underline-offset-2 hover:text-brand transition-colors">
                check your area
              </button>
              {' '}to get started.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};