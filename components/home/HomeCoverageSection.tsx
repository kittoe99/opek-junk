import React, { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Loader2, MapPin, ShieldCheck, Star } from 'lucide-react';
import { loadStatePaths } from '../UsCoverageMap';
import { coverageCities } from '../../lib/coverageCities';
import { normalizePostalInput, parsePostalCode } from '../../lib/postalCode';

/** Metros that get a soft pulse on the map. */
const PULSE = new Set(['seattle', 'los-angeles', 'denver', 'dallas-fort-worth', 'chicago', 'atlanta', 'miami']);

type StatePath = Awaited<ReturnType<typeof loadStatePaths>>[number];

interface HomeCoverageSectionProps {
  /** Two-part heading: the second part is shown in lavender. */
  titleStart?: string;
  titleAccent?: string;
  /** Called with a valid ZIP instead of going to /quote. */
  onCheck?: (zip: string) => void;
}

/** ZIP check paired with a nationwide coverage map (homepage and service pages). */
export const HomeCoverageSection: React.FC<HomeCoverageSectionProps> = ({
  titleStart = 'Providers in',
  titleAccent = 'all 50 states',
  onCheck,
}) => {
  const navigate = useNavigate();
  const mapId = `cov-map${useId().replace(/:/g, '')}`;
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [states, setStates] = useState<StatePath[]>([]);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ zip: string; city: string; state: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadStatePaths().then((paths) => !cancelled && setStates(paths));
    return () => {
      cancelled = true;
    };
  }, []);

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

  const highlightState = (result?.state ?? '').toLowerCase();

  return (
    <section
      id="service-area"
      className="cov scroll-mt-[var(--site-header-height)]"
      aria-labelledby="home-coverage-heading"
    >
      <div className="cov-inner">
        {/* Decorative map: the ZIP check is the real coverage answer. */}
        <div className="cov-map" aria-hidden>
          <svg viewBox="0 0 959 593">
            <defs>
              <pattern id={`${mapId}-dots`} width={9} height={9} patternUnits="userSpaceOnUse">
                <circle cx={4.5} cy={4.5} r={2.1} className="cov-grid-dot" />
              </pattern>
              <radialGradient id={`${mapId}-halo`}>
                <stop offset="0%" stopColor="#e9d8fb" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#e9d8fb" stopOpacity={0} />
              </radialGradient>
            </defs>
            {/* Soft land base, then a halftone dot grid clipped to each state. */}
            {states.map((s) => (
              <path key={`base-${s.id}`} d={s.d} className="cov-land" />
            ))}
            {states.map((s) => (
              <path
                key={s.id}
                d={s.d}
                fill={`url(#${mapId}-dots)`}
                className={highlightState && s.id.toLowerCase() === highlightState ? 'cov-state is-on' : 'cov-state'}
              />
            ))}
            {coverageCities.map((city) => (
              <g key={city.slug} transform={`translate(${city.x} ${city.y})`}>
                <circle r={22} fill={`url(#${mapId}-halo)`} />
                {PULSE.has(city.slug) && <circle r={18} className="cov-pulse" />}
                <circle r={6} className="cov-dot" />
              </g>
            ))}
          </svg>
        </div>

        <div className="cov-copy">
          <h2 id="home-coverage-heading" className="home-display cov-title">
            {titleStart} <span>{titleAccent}</span>
          </h2>
          <p className="cov-sub">Enter your ZIP to confirm coverage and see your price.</p>

          {result ? (
            <div className="coverage-result" role="status" aria-live="polite">
              <p className="coverage-result-line">
                <CheckCircle2 size={22} strokeWidth={2.4} aria-hidden />
                <span>
                  Available in <strong>{result.city}{result.state && `, ${result.state}`}</strong>
                </span>
              </p>
              <button type="button" onClick={continueWithZip} className="coverage-result-primary">
                {onCheck ? 'Continue' : 'Get my price'}
                <ArrowRight size={18} aria-hidden />
              </button>
              <button type="button" onClick={resetZip} className="coverage-result-change">
                Change ZIP
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="cov-form" noValidate>
              <label htmlFor="home-zip" className="sr-only">
                ZIP code
              </label>
              <MapPin size={20} className="cov-form-pin" aria-hidden />
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
                className="cov-form-input"
              />
              <button type="submit" disabled={checking} aria-busy={checking} className="cov-form-btn">
                {checking ? (
                  <><Loader2 size={18} className="animate-spin" aria-hidden /><span>Checking…</span></>
                ) : (
                  <>
                    Check
                    <ArrowRight size={18} aria-hidden />
                  </>
                )}
              </button>
            </form>
          )}
          {error && (
            <p id="home-zip-error" role="alert" className="cov-error">
              {error}
            </p>
          )}

          <ul className="cov-trust">
            <li><Clock size={15} aria-hidden />Same-day</li>
            <li><ShieldCheck size={15} aria-hidden />Vetted providers</li>
            <li><Star size={15} aria-hidden />Rated 4.8</li>
          </ul>
        </div>
      </div>

      <p className="cov-note">
        Opek connects you with independent local providers. Availability varies by location.
      </p>
    </section>
  );
};
