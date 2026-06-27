import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceAreaProps {
  onGetQuote?: () => void;
  titleStart?: string;
  titleAccent?: string;
}

const featuredMetros = [
  { name: 'Atlanta, GA', slug: 'atlanta' },
  { name: 'Austin, TX', slug: 'austin' },
  { name: 'Boston, MA', slug: 'boston' },
  { name: 'Chicago, IL', slug: 'chicago' },
  { name: 'Dallas–Fort Worth, TX', slug: 'dallas-fort-worth' },
  { name: 'Denver, CO', slug: 'denver' },
  { name: 'Houston, TX', slug: 'houston' },
  { name: 'Jacksonville, FL', slug: 'jacksonville' },
  { name: 'Los Angeles, CA', slug: 'los-angeles' },
  { name: 'Miami, FL', slug: 'miami' },
  { name: 'New York, NY', slug: 'new-york' },
  { name: 'Philadelphia, PA', slug: 'philadelphia' },
  { name: 'Phoenix, AZ', slug: 'phoenix' },
  { name: 'Portland, OR', slug: 'portland' },
  { name: 'San Diego, CA', slug: 'san-diego' },
  { name: 'San Francisco, CA', slug: 'san-francisco' },
  { name: 'Seattle, WA', slug: 'seattle' },
  { name: 'Washington, D.C.', slug: 'washington-dc' },
];

const cityPageSlugs = new Set(['dallas-fort-worth', 'jacksonville', 'atlanta']);

export const ServiceArea: React.FC<ServiceAreaProps> = ({
  onGetQuote,
  titleStart = 'Nationwide',
  titleAccent = 'coverage.',
}) => {
  const navigate = useNavigate();

  const handleQuote = () => {
    if (onGetQuote) {
      onGetQuote();
    } else {
      navigate('/quote');
    }
  };

  const cityHref = (slug: string) =>
    cityPageSlugs.has(slug) ? `/locations/${slug}` : '/quote';

  return (
    <section id="service-area" className="py-16 md:py-24 lg:py-32 bg-white border-b border-secondary-100/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">All 50 States</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              {titleStart}
              <br />
              <span className="text-brand">{titleAccent}</span>
            </h2>

            <div className="w-12 h-0.5 bg-secondary-100" />

            <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-sm font-medium">
              We service the entire United States — major metros, suburbs, and small towns. Upfront flat-rates from trusted local loaders, wherever you are.
            </p>

            <button
              onClick={handleQuote}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-lg shadow-md hover:shadow-xl inline-flex items-center gap-2"
            >
              Check Your Area <ArrowRight size={14} />
            </button>
          </div>

          <div className="lg:col-span-8">
            <div className="border border-secondary-100/60 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 md:px-6 md:py-5 bg-secondary-50/60 border-b border-secondary-100/60">
                <p className="text-[11px] font-black text-secondary-400 uppercase tracking-[0.2em]">
                  Featured metro areas
                </p>
              </div>
              <div className="p-5 md:p-6 bg-white">
                <div className="flex flex-wrap gap-2">
                  {featuredMetros.map((city) => (
                    <Link
                      key={city.slug + city.name}
                      to={cityHref(city.slug)}
                      onClick={(e) => {
                        if (!cityPageSlugs.has(city.slug)) {
                          e.preventDefault();
                          handleQuote();
                        }
                      }}
                      className="px-3.5 py-2 bg-secondary-50 text-secondary text-xs font-bold border border-secondary-100 hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors duration-200 rounded-full"
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>
                <p className="mt-5 pt-5 border-t border-secondary-100/60 text-secondary-400 text-xs md:text-sm leading-relaxed">
                  Don&apos;t see your city? We serve <strong className="text-secondary font-bold">thousands of locations nationwide</strong> — enter your ZIP at checkout to confirm availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
