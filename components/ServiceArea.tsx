import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { UsCoverageMap } from './UsCoverageMap';
import { CoverageCity, coverageCities, getCoverageCity } from '../lib/coverageCities';

interface ServiceAreaProps {
  onGetQuote?: () => void;
  titleStart?: string;
  titleAccent?: string;
}

const featuredChips = [
  { label: 'Atlanta', slug: 'atlanta' },
  { label: 'Dallas–Fort Worth', slug: 'dallas-fort-worth' },
  { label: 'Jacksonville', slug: 'jacksonville' },
  { label: 'Chicago', slug: 'chicago' },
  { label: 'Denver', slug: 'denver' },
  { label: 'Miami', slug: 'miami' },
];

export const ServiceArea: React.FC<ServiceAreaProps> = ({
  onGetQuote,
  titleStart = 'Junk removal in 50 cities',
  titleAccent = 'and counting.',
}) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<CoverageCity | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CoverageCity | null>(null);

  const handleQuote = () => {
    if (onGetQuote) {
      onGetQuote();
    } else {
      navigate('/quote');
    }
  };

  const handleCitySelect = (city: CoverageCity) => {
    setSelectedCity((current) => (current?.slug === city.slug ? null : city));
  };

  const handleCityAction = () => {
    const city = selectedCity ?? hoveredCity;
    if (!city) {
      handleQuote();
      return;
    }

    if (city.hasCityPage) {
      navigate(`/locations/${city.slug}`);
      return;
    }

    handleQuote();
  };

  const headline = `${titleStart} ${titleAccent}`.trim();
  const displayCity = hoveredCity ?? selectedCity;
  const actionCity = selectedCity ?? hoveredCity;

  return (
    <section id="service-area" className="py-16 md:py-24 lg:py-28 bg-white border-b border-secondary-100/40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f3f3f3] rounded-3xl p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] gap-8 lg:gap-12 items-start">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.5rem] font-semibold text-secondary leading-[1.15] tracking-tight lg:pr-4">
                {headline}
              </h2>

              {displayCity ? (
                <div className="mt-5 p-4 rounded-2xl bg-white border border-secondary-100/80 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand mb-1">
                    {selectedCity?.slug === displayCity.slug ? 'Selected metro' : 'Previewing'}
                  </p>
                  <p className="text-lg font-semibold text-secondary mb-2">{displayCity.name}</p>
                  <p className="text-sm text-secondary-500 mb-4">
                    Same-day junk removal and cleanouts available from vetted local providers.
                  </p>
                  <button
                    type="button"
                    onClick={handleCityAction}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 rounded-full transition-colors"
                  >
                    {actionCity?.hasCityPage
                      ? `Explore ${actionCity.name.split(',')[0]}`
                      : 'Get a quote'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleQuote}
                  className="mt-5 text-sm font-semibold text-secondary hover:text-brand transition-colors"
                >
                  Check your area →
                </button>
              )}
            </div>

            <div className="w-full min-w-0">
              <UsCoverageMap
                selectedCitySlug={selectedCity?.slug ?? null}
                hoveredCitySlug={hoveredCity?.slug ?? null}
                onCityHover={setHoveredCity}
                onCitySelect={handleCitySelect}
              />

              <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                {featuredChips.map((chip) => {
                  const city = getCoverageCity(chip.slug);
                  if (!city) return null;

                  const isSelected = selectedCity?.slug === chip.slug;
                  const isHovered = hoveredCity?.slug === chip.slug;

                  return (
                    <button
                      key={chip.slug}
                      type="button"
                      onMouseEnter={() => setHoveredCity(city)}
                      onMouseLeave={() => setHoveredCity(null)}
                      onFocus={() => setHoveredCity(city)}
                      onBlur={() => setHoveredCity(null)}
                      onClick={() => handleCitySelect(city)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-secondary text-white border-secondary'
                          : isHovered
                            ? 'bg-white text-secondary border-secondary-300'
                            : 'bg-white/80 text-secondary-500 border-secondary-100 hover:border-secondary-300'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-8 text-[11px] md:text-xs text-secondary-400 leading-relaxed max-w-4xl">
            *Opek connects customers with independent local junk removal providers. Service availability varies by
            location — enter your ZIP at checkout to confirm coverage in your area.
          </p>
        </div>
      </div>
    </section>
  );
};
