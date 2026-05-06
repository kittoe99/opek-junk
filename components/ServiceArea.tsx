import React from 'react';
import { ArrowRight } from 'lucide-react';

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
    <section id="service-area" className="py-24 md:py-32 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src="/estimates (1).webp"
                loading="lazy"
                alt="Nationwide junk removal service"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
              <span className="inline-block h-px w-8 bg-gray-300" />
              <span>Coverage</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight tracking-tight mb-6">
              All 50 states. <span className="text-gray-400">Coast to coast.</span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
              A trusted network of local professionals, ready to help clear your space.
            </p>

            <button
              onClick={onGetQuote}
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-900 underline-offset-4 hover:underline mb-12"
            >
              Check your area
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>

            {/* Cities */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
                Major cities served
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {cities.slice(0, 16).map((city) => (
                  <span key={city} className="text-sm text-gray-700">
                    {city}
                  </span>
                ))}
                <span className="text-sm text-gray-400">+ 100 more</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};