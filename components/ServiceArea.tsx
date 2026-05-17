import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const cities = [
  { label: "Dallas-Fort Worth, TX", slug: "dallas-fort-worth" },
  { label: "Jacksonville, FL",      slug: "jacksonville" },
  { label: "Atlanta, GA",           slug: "atlanta" },
];

interface ServiceAreaProps {
  onGetQuote?: () => void;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ onGetQuote }) => {
  return (
    <section id="service-area" className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Image */}
          <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden order-2 lg:order-1">
            <img
              src="/service_area_themed.png"
              loading="lazy"
              alt="Nationwide junk removal service"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 mb-3 rounded-full">
                <MapPin size={13} className="text-brand" />
                <span className="text-white text-xs font-black uppercase tracking-[0.15em]">Now Serving 3 Cities</span>
              </div>
              <p className="text-white text-lg md:text-xl font-black leading-tight tracking-tight">
                Trusted professionals<br />in your area.
              </p>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Service Area</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight mb-5">
              Now serving<br /><span className="text-brand">your city.</span>
            </h2>
            <p className="text-secondary-500 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              We're live in select markets and expanding fast. Check if we serve your area and get a free quote today.
            </p>

            <button
              onClick={onGetQuote}
              className="self-start px-8 py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center gap-2 shadow-md mb-10 rounded-lg"
            >
              Check Your Area <ArrowRight size={16} />
            </button>

            {/* Cities */}
            <div>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-3">Cities currently served</p>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="px-3 py-1.5 bg-secondary-50 text-secondary text-xs font-medium border border-secondary-100 hover:border-brand hover:text-brand transition-colors rounded-full"
                  >
                    {city.label}
                  </Link>
                ))}
                <span className="px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 text-xs font-black rounded-full">
                  More cities coming soon
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};