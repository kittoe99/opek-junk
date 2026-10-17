import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { loadStatePaths } from '../UsCoverageMap';
import { CoverageCity, coverageCities } from '../../lib/coverageCities';
import { normalizePostalInput, parsePostalCode } from '../../lib/postalCode';

const POPULAR = ['atlanta', 'dallas-fort-worth', 'jacksonville', 'chicago', 'denver', 'miami'];
const PIN = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z';

type StatePath = Awaited<ReturnType<typeof loadStatePaths>>[number];

const shortName = (city: CoverageCity) => city.name.replace(/, [A-Z.]+$/, '');

/** Homepage ZIP check paired with the nationwide coverage map. */
export const HomeCoverageSection: React.FC = () => {
  const navigate = useNavigate();
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [states, setStates] = useState<StatePath[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadStatePaths().then((paths) => !cancelled && setStates(paths));
    return () => {
      cancelled = true;
    };
  }, []);

  const activeSlug = hovered ?? selected;
  const active = useMemo(() => coverageCities.find((c) => c.slug === activeSlug) ?? null, [activeSlug]);
  const selectedCity = useMemo(() => coverageCities.find((c) => c.slug === selected) ?? null, [selected]);
  const popular = POPULAR.map((slug) => coverageCities.find((c) => c.slug === slug)).filter(
    (c): c is CoverageCity => Boolean(c),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parsePostalCode(zip);
    if (parsed.ok === false) {
      setError(parsed.error);
      return;
    }
    setError('');
    navigate(`/quote?${new URLSearchParams({ zip: parsed.formatted }).toString()}`);
  };

  return (
    <section
      id="service-area"
      className="bg-[#f4eefc] py-12 md:py-20 scroll-mt-[var(--site-header-height)]"
      aria-labelledby="home-coverage-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-8 lg:gap-12 items-center">
          {/* Copy + ZIP */}
          <div className="text-center lg:text-left">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#520f96]">Nationwide coverage</p>
            <h2
              id="home-coverage-heading"
              className="home-display mt-3 text-[2.1rem] leading-[0.95] sm:text-[2.8rem] lg:text-[3.2rem] text-[#140a1f]"
            >
              Providers in
              <br />
              <span className="text-[#520f96]">all 50 states</span>
            </h2>
            <p className="mt-4 text-[15px] sm:text-base leading-relaxed text-[#2b2236] max-w-md mx-auto lg:mx-0">
              Matched local providers arrive ready to load and haul. Enter your ZIP to confirm coverage and see your price.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex max-w-[440px] mx-auto lg:mx-0 shadow-[0_14px_30px_-20px_rgba(40,10,80,0.6)]" noValidate>
              <label htmlFor="home-zip" className="sr-only">
                ZIP code
              </label>
              <div className="relative min-w-0 flex-1">
                <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#520f96]" aria-hidden />
                <input
                  id="home-zip"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="Enter ZIP code"
                  value={zip}
                  onChange={(e) => {
                    setZip(normalizePostalInput(e.target.value));
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'home-zip-error' : undefined}
                  className="h-[56px] w-full rounded-none border-2 border-r-0 border-[#520f96] bg-white pl-11 pr-3 text-[16px] font-semibold text-[#140a1f]"
                />
              </div>
              <button type="submit" className="home-cta shrink-0 !min-h-[56px] !px-5 sm:!px-7">
                Check area
              </button>
            </form>
            {error && (
              <p id="home-zip-error" role="alert" className="mt-3 text-sm font-bold text-[#b0004f]">
                {error}
              </p>
            )}

            {/* Selected city */}
            <div className="mt-5 min-h-[52px] max-w-[440px] mx-auto lg:mx-0" aria-live="polite">
              {selectedCity ? (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-3 text-left">
                  <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold text-[#140a1f]">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#22a35a]" aria-hidden />
                    <span className="truncate">Providers serve {shortName(selectedCity)}</span>
                  </span>
                  <Link
                    to={selectedCity.hasCityPage ? `/locations/${selectedCity.slug}` : '/quote'}
                    className="inline-flex shrink-0 items-center gap-1 text-[14px] font-bold text-[#520f96]"
                  >
                    {selectedCity.hasCityPage ? 'City page' : 'Get pricing'}
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              ) : (
                <p className="text-[13px] text-[#5a5266]">Or pick a popular city on the map.</p>
              )}
            </div>
          </div>

          {/* Map card */}
          <div className="rounded-2xl bg-white p-3 sm:p-6 shadow-[0_24px_50px_-30px_rgba(40,10,80,0.45)]">
            <div className="relative">
              <svg viewBox="0 0 959 593" className="h-auto w-full touch-manipulation" role="img" aria-label="Map of popular Opek service cities across the United States">
                {states.map((s) => (
                  <path
                    key={s.id}
                    d={s.d}
                    fill={active && s.id.toLowerCase() === active.state.toLowerCase() ? '#c39be6' : '#e6d8f6'}
                    stroke="#ffffff"
                    strokeWidth={1.2}
                    className="transition-colors duration-200"
                  />
                ))}
                {coverageCities.map((city) => {
                  const isActive = city.slug === activeSlug;
                  const size = isActive ? 34 : 24;
                  return (
                    <g
                      key={city.slug}
                      transform={`translate(${city.x - size / 2}, ${city.y - size * 0.92})`}
                      role="button"
                      tabIndex={0}
                      aria-label={shortName(city)}
                      aria-pressed={city.slug === selected}
                      className="cursor-pointer outline-none"
                      onMouseEnter={() => setHovered(city.slug)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(city.slug)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setSelected(city.slug)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelected(city.slug);
                        }
                      }}
                    >
                      <circle cx={size / 2} cy={size / 2} r={22} fill="transparent" />
                      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
                        <path d={PIN} fill={isActive ? '#a020f0' : '#520f96'} />
                      </svg>
                    </g>
                  );
                })}
              </svg>

              {active && (
                <div
                  className="pointer-events-none absolute z-10 whitespace-nowrap bg-[#140a1f] px-2.5 py-1.5 text-[12px] font-bold text-white"
                  style={{
                    left: `${(active.x / 959) * 100}%`,
                    top: `${(active.y / 593) * 100}%`,
                    transform: 'translate(-50%, calc(-100% - 30px))',
                  }}
                >
                  {active.name}
                </div>
              )}
            </div>

            <div className="mt-3 sm:mt-4 -mx-3 sm:mx-0 px-3 sm:px-0 flex sm:flex-wrap sm:justify-center gap-2 lg:gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {popular.map((city) => (
                <button
                  key={city.slug}
                  type="button"
                  onClick={() => setSelected(city.slug)}
                  aria-pressed={city.slug === selected}
                  className={`shrink-0 min-h-10 rounded-full border px-3.5 lg:px-3 text-[13px] lg:text-[12.5px] font-semibold transition-colors ${
                    city.slug === selected
                      ? 'border-[#520f96] bg-[#520f96] text-white'
                      : 'border-[#ddd0ee] bg-[#f7f3fc] text-[#3a0a6b] hover:border-[#520f96]'
                  }`}
                >
                  {shortName(city)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center lg:text-left text-[12px] leading-snug text-[#5a5266]">
          Opek connects customers with independent local providers. Service availability varies by location; enter your ZIP
          to confirm coverage in your area.
        </p>
      </div>
    </section>
  );
};
