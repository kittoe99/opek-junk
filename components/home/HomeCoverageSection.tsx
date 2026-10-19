import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { loadStatePaths } from '../UsCoverageMap';
import { CoverageCity, coverageCities } from '../../lib/coverageCities';
import { normalizePostalInput, parsePostalCode } from '../../lib/postalCode';

const POPULAR = ['atlanta', 'dallas-fort-worth', 'jacksonville', 'chicago', 'denver', 'miami'];
const PIN = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z';

type StatePath = Awaited<ReturnType<typeof loadStatePaths>>[number];

const shortName = (city: CoverageCity) => city.name.replace(/, [A-Z.]+$/, '');

interface HomeCoverageSectionProps {
  /** Two-part heading: the second part is shown in lavender. */
  titleStart?: string;
  titleAccent?: string;
  /** Called with a valid ZIP instead of going to /quote. */
  onCheck?: (zip: string) => void;
}

/** ZIP check paired with the nationwide coverage map (homepage and service pages). */
export const HomeCoverageSection: React.FC<HomeCoverageSectionProps> = ({
  titleStart = 'Providers in',
  titleAccent = 'all 50 states',
  onCheck,
}) => {
  const navigate = useNavigate();
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [states, setStates] = useState<StatePath[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ zip: string; city: string; state: string } | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checking) return;
    const parsed = parsePostalCode(zip);
    if (parsed.ok === false) {
      setError(parsed.error);
      return;
    }
    setError('');
    setChecking(true);
    try {
      // Same public ZIP lookup the quote flow uses; only the ZIP is sent.
      const res = await fetch(`https://api.zippopotam.us/us/${parsed.formatted}`);
      if (!res.ok) {
        setError('We couldn’t find that ZIP code. Please check it and try again.');
        return;
      }
      const data = await res.json();
      const place = data.places?.[0];
      setResult({
        zip: parsed.formatted,
        city: place?.['place name'] ?? '',
        state: place?.['state abbreviation'] ?? '',
      });
    } catch {
      setError('We couldn’t check that ZIP right now. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const continueWithZip = () => {
    if (!result) return;
    if (onCheck) onCheck(result.zip);
    else navigate(`/quote?${new URLSearchParams({ zip: result.zip }).toString()}`);
  };

  const resetZip = () => {
    setResult(null);
    setZip('');
    requestAnimationFrame(() => document.getElementById('home-zip')?.focus());
  };

  const highlightState = (active?.state ?? result?.state ?? '').toLowerCase();

  return (
    <section
      id="service-area"
      className="coverage bg-[#520f96] text-white py-14 md:py-20 scroll-mt-[var(--site-header-height)]"
      aria-labelledby="home-coverage-heading"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-10 lg:gap-14 items-center">
          {/* Copy + ZIP */}
          <div className="text-center lg:text-left">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#d9c2f5]">Nationwide coverage</p>
            <h2
              id="home-coverage-heading"
              className="home-display mt-3 text-[2.3rem] leading-[0.95] sm:text-[2.8rem] lg:text-[3.2rem] text-white"
            >
              {titleStart}
              <br />
              <span className="text-[#d9c2f5]">{titleAccent}</span>
            </h2>
            <p className="mt-4 text-[15px] sm:text-base leading-relaxed text-[#eadcfb] max-w-md mx-auto lg:mx-0">
              Enter your ZIP to confirm coverage and see your price. Local providers arrive ready to load and haul.
            </p>

            {result ? (
              <div className="coverage-result mt-7 max-w-[440px] mx-auto lg:mx-0 text-left" role="status" aria-live="polite">
                <div className="flex items-start gap-3.5">
                  <span className="coverage-result-check" aria-hidden>
                    <CheckCircle2 size={26} strokeWidth={2.4} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="coverage-result-eyebrow">Available in your area</p>
                    <p className="coverage-result-city">
                      {result.city}
                      {result.state && <span>, {result.state}</span>}
                    </p>
                    <p className="coverage-result-meta">
                      <MapPin size={14} aria-hidden />
                      ZIP {result.zip} · Providers ready to help
                    </p>
                  </div>
                </div>

                <div className={`mt-5 grid gap-2.5 ${onCheck ? '' : 'sm:grid-cols-[1.25fr_1fr]'}`}>
                  <button type="button" onClick={continueWithZip} className="coverage-result-primary">
                    {onCheck ? 'Continue' : 'Get my price'}
                    <ArrowRight size={18} aria-hidden />
                  </button>
                  {!onCheck && (
                    <Link to="/booking" className="coverage-result-secondary">
                      <CalendarCheck size={17} aria-hidden />
                      Book a pickup
                    </Link>
                  )}
                </div>

                <button type="button" onClick={resetZip} className="coverage-result-change">
                  Not your ZIP? Change it
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="mt-7 flex max-w-[440px] mx-auto lg:mx-0 shadow-[0_14px_30px_-20px_rgba(20,0,50,0.8)]" noValidate>
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
                  className="h-[56px] w-full rounded-none border-2 border-r-0 border-white bg-white pl-11 pr-3 text-[16px] font-semibold text-[#140a1f]"
                />
              </div>
              <button type="submit" disabled={checking} className="home-cta shrink-0 !min-h-[56px] !px-5 sm:!px-7 border-2 border-white min-w-[132px]">
                {checking ? <Loader2 size={20} className="animate-spin" aria-label="Checking" /> : 'Check area'}
              </button>
            </form>
            )}
            {error && (
              <p id="home-zip-error" role="alert" className="mt-3 text-sm font-bold text-[#ffd1dc]">
                {error}
              </p>
            )}

            {/* Selected city */}
            {selectedCity && (
              <div
                className="mt-4 max-w-[440px] mx-auto lg:mx-0 flex items-center justify-between gap-3 rounded-lg bg-white/10 px-4 py-3 text-left"
                aria-live="polite"
              >
                <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#5ee08f]" aria-hidden />
                  <span className="truncate">Providers serve {shortName(selectedCity)}</span>
                </span>
                <Link
                  to={selectedCity.hasCityPage ? `/locations/${selectedCity.slug}` : '/quote'}
                  className="inline-flex shrink-0 items-center gap-1 text-[14px] font-bold underline underline-offset-4"
                >
                  {selectedCity.hasCityPage ? 'City page' : 'Get pricing'}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <div className="relative">
              <svg viewBox="0 0 959 593" className="h-auto w-full touch-manipulation" role="img" aria-label="Map of popular Opek service cities across the United States">
                {states.map((s) => (
                  <path
                    key={s.id}
                    d={s.d}
                    fill={highlightState && s.id.toLowerCase() === highlightState ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.14)'}
                    stroke="#520f96"
                    strokeWidth={1.4}
                    className="transition-colors duration-200"
                  />
                ))}
                {coverageCities.map((city) => {
                  const isActive = city.slug === activeSlug;
                  const size = isActive ? 36 : 24;
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
                        <path d={PIN} fill={isActive ? '#d9c2f5' : '#ffffff'} />
                      </svg>
                    </g>
                  );
                })}
              </svg>

              {active && (
                <div
                  className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-white px-2.5 py-1.5 text-[12px] font-bold text-[#520f96] shadow-[0_10px_24px_-12px_rgba(20,0,50,0.7)]"
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

            <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Popular cities">
              {popular.map((city) => (
                <button
                  key={city.slug}
                  type="button"
                  onClick={() => setSelected(city.slug)}
                  aria-pressed={city.slug === selected}
                  className={`min-h-10 rounded-full border px-4 text-[13px] font-bold transition-colors ${
                    city.slug === selected
                      ? 'border-white bg-white text-[#520f96]'
                      : 'border-white/35 text-white hover:border-white hover:bg-white/10'
                  }`}
                >
                  {shortName(city)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center lg:text-left text-[12px] leading-snug text-[#cdb6ea]">
          Opek connects customers with independent local providers. Service availability varies by location; enter your ZIP
          to confirm coverage in your area.
        </p>
      </div>
    </section>
  );
};
