import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { UsCoverageMap } from './UsCoverageMap';
import { CoverageCity, getCoverageCity } from '../lib/coverageCities';

interface ServiceAreaProps {
  onGetQuote?: () => void;
  titleStart?: string;
  titleAccent?: string;
  theme?: 'light' | 'dark';
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
  titleStart = 'Junk removal available nationwide',
  titleAccent = '',
  theme = 'light',
}) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<CoverageCity | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CoverageCity | null>(null);
  const isDark = theme === 'dark';

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
    <section
      id="service-area"
      className={`relative overflow-hidden ${
        isDark
          ? 'py-14 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg)] border-t border-[var(--border)]'
          : 'py-16 md:py-24 lg:py-28 border-b bg-white border-secondary-100/40'
      }`}
    >
      {isDark && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-brand/40 to-transparent" aria-hidden />
          <div className="absolute -top-24 right-[-8%] h-[320px] w-[320px] rounded-full bg-brand/[0.06] blur-[120px] pointer-events-none" aria-hidden />
        </>
      )}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-3xl p-6 md:p-10 lg:p-12 ${
            isDark
              ? 'bg-[var(--surface)] border border-white/[0.08] shadow-[0_32px_80px_-32px_rgba(0,0,0,0.8)]'
              : 'bg-[#f3f3f3]'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] gap-8 lg:gap-12 items-start">
            <div className="lg:sticky lg:top-28">
              {isDark && (
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                  Nationwide coverage
                </p>
              )}
              <h2
                className={
                  isDark
                    ? 'font-sans font-extrabold text-[1.7rem] sm:text-[2.2rem] md:text-[2.4rem] leading-[1.1] tracking-tight lg:pr-4 text-[var(--text)]'
                    : 'font-serif text-3xl md:text-4xl lg:text-[2.5rem] font-semibold leading-[1.15] tracking-tight lg:pr-4 text-secondary'
                }
              >
                {isDark ? (
                  <>
                    {titleStart}{' '}
                    {titleAccent && (
                      <span className="font-serif italic font-normal text-brand">{titleAccent}</span>
                    )}
                  </>
                ) : (
                  headline
                )}
              </h2>

              {isDark && (
                <p className="mt-4 text-[13px] sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-sm">
                  Book in minutes—matched local providers arrive ready to load, haul, and sweep up.
                  Hover the map to preview popular metros.
                </p>
              )}

              {displayCity ? (
                <div
                  className={`mt-5 p-4 rounded-2xl shadow-sm ${
                    isDark
                      ? 'bg-[#121218] border border-white/10 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]'
                      : 'bg-white border border-secondary-100/80'
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand mb-1">
                    {selectedCity?.slug === displayCity.slug ? 'Selected metro' : 'Previewing'}
                  </p>
                  <p
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-secondary'
                    }`}
                  >
                    {displayCity.name}
                  </p>
                  <p
                    className={`text-sm mb-4 ${
                      isDark ? 'text-[var(--text-muted)]' : 'text-secondary-500'
                    }`}
                  >
                    Same-day junk removal and cleanouts available from vetted local providers.
                  </p>
                  <button
                    type="button"
                    onClick={handleCityAction}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                      isDark
                        ? 'bg-brand text-white hover:bg-brand-600 shadow-[0_0_20px_-6px_rgba(255,0,110,0.6)]'
                        : 'bg-secondary text-white hover:bg-secondary-600'
                    }`}
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
                  className={`mt-5 text-sm font-semibold transition-colors ${
                    isDark
                      ? 'text-[var(--text)] hover:text-brand'
                      : 'text-secondary hover:text-brand'
                  }`}
                >
                  Check your area →
                </button>
              )}
            </div>

            <div className="w-full min-w-0">
              <UsCoverageMap
                theme={theme}
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
                          ? isDark
                            ? 'bg-brand text-white border-brand shadow-[0_0_16px_-4px_rgba(255,0,110,0.6)]'
                            : 'bg-secondary text-white border-secondary'
                          : isDark
                            ? isHovered
                              ? 'bg-white/[0.08] text-white border-white/25'
                              : 'bg-white/[0.04] text-neutral-400 border-white/10 hover:border-brand/50 hover:text-white'
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

          <p
            className={`mt-8 text-[11px] md:text-xs leading-relaxed max-w-4xl ${
              isDark ? 'text-[var(--text-muted)]' : 'text-secondary-400'
            }`}
          >
            *Opek connects customers with independent local junk removal providers. Service availability varies by
            location — enter your ZIP at checkout to confirm coverage in your area.
          </p>
        </div>
      </div>
    </section>
  );
};
