import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface ServiceAreaProps {
  onGetQuote?: () => void;
  titleStart?: string;
  titleAccent?: string;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ 
  onGetQuote,
  titleStart = "Get junk removal",
  titleAccent = "in these metro areas"
}) => {
  const navigate = useNavigate();
  
  const handleCityClick = (slug: string, e: React.MouseEvent) => {
    // If it's a real served route, let the Link handle it normally
    if (['dallas-fort-worth', 'jacksonville', 'atlanta'].includes(slug)) {
      return;
    }
    
    // Otherwise, prevent default and trigger zip checker or quote routing
    e.preventDefault();
    if (onGetQuote) {
      onGetQuote();
    } else {
      navigate('/quote');
    }
  };

  const metroCities = [
    { name: "Alexandria, VA", slug: "alexandria" },
    { name: "Annapolis, MD", slug: "annapolis" },
    { name: "Atlanta, GA", slug: "atlanta" },
    { name: "Austin, TX", slug: "austin" },
    { name: "Baltimore, MD", slug: "baltimore" },
    { name: "Boston, MA", slug: "boston" },
    { name: "Boulder, CO", slug: "boulder" },
    { name: "Brooklyn, NY", slug: "brooklyn" },
    { name: "Chicago, IL", slug: "chicago" },
    { name: "Dallas, TX", slug: "dallas-fort-worth" },
    { name: "Denver, CO", slug: "denver" },
    { name: "Fort Collins, CO", slug: "fort-collins" },
    { name: "Fort Lauderdale, FL", slug: "fort-lauderdale" },
    { name: "Fort Worth, TX", slug: "dallas-fort-worth" },
    { name: "Hartford, CT", slug: "hartford" },
    { name: "Houston, TX", slug: "houston" },
    { name: "Jersey City, NJ", slug: "jersey-city" },
    { name: "Las Vegas, NV", slug: "las-vegas" },
    { name: "Los Angeles, CA", slug: "los-angeles" },
    { name: "Miami, FL", slug: "miami" },
    { name: "Nashua, NH", slug: "nashua" },
    { name: "New Haven, CT", slug: "new-haven" },
    { name: "New York City, NY", slug: "new-york" },
    { name: "Newark, NJ", slug: "newark" },
    { name: "Oakland, CA", slug: "oakland" },
    { name: "Olympia, WA", slug: "olympia" },
    { name: "Orange County, CA", slug: "orange-county" },
    { name: "Philadelphia, PA", slug: "philadelphia" },
    { name: "Phoenix, AZ", slug: "phoenix" },
    { name: "Portland, OR", slug: "portland" },
    { name: "Providence, RI", slug: "providence" },
    { name: "Sacramento, CA", slug: "sacramento" },
    { name: "Salt Lake City, UT", slug: "salt-lake-city" },
    { name: "San Antonio, TX", slug: "san-antonio" },
    { name: "San Diego, CA", slug: "san-diego" },
    { name: "San Francisco, CA", slug: "san-francisco" },
    { name: "San Jose, CA", slug: "san-jose" },
    { name: "Santa Cruz, CA", slug: "santa-cruz" },
    { name: "Santa Rosa, CA", slug: "santa-rosa" },
    { name: "Seattle, WA", slug: "seattle" },
    { name: "Tacoma, WA", slug: "tacoma" },
    { name: "Trenton, NJ", slug: "trenton" },
    { name: "Vancouver, WA", slug: "vancouver" },
    { name: "Washington, D.C.", slug: "washington-dc" },
    { name: "West Palm Beach, FL", slug: "west-palm-beach" },
    { name: "Wilmington, DE", slug: "wilmington" },
    { name: "Worcester, MA", slug: "worcester" }
  ];

  return (
    <section id="service-area" className="py-16 md:py-24 bg-white border-b border-secondary-100/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Typography & US Map */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-tight mb-4">
                {titleStart} <span className="text-brand">{titleAccent}</span>
              </h2>
              <p className="text-secondary-400 text-sm leading-relaxed max-w-sm font-semibold">
                Junk removal in thousands of cities across the United States. Big or small, get the most affordable upfront flat-rates from trusted local loaders.
              </p>
            </div>
            
            {/* Map Container */}
            <div className="flex items-center justify-center pt-4">
              <img 
                src="/service_area_themed.png" 
                alt="Opek nationwide service area map" 
                className="w-full max-w-[320px] h-auto object-contain hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Column: 3-column alphabetical city list */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3.5">
              {metroCities.map((city) => (
                <Link
                  key={city.name}
                  to={['dallas-fort-worth', 'jacksonville', 'atlanta'].includes(city.slug) ? `/locations/${city.slug}` : `/quote`}
                  onClick={(e) => handleCityClick(city.slug, e)}
                  className="group flex items-center gap-2 text-secondary hover:text-brand text-[13px] font-bold transition-colors duration-200 py-0.5"
                >
                  <MapPin 
                    size={14} 
                    className="text-secondary-300 group-hover:text-brand transition-colors duration-200 shrink-0" 
                  />
                  <span>{city.name}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};