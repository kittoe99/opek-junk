import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Star } from 'lucide-react';
import { JUNK_REMOVAL_MIN_PRICE } from '../lib/junkRemovalPricing';
import { normalizePostalInput, parsePostalCode } from '../lib/postalCode';

const SITE_PHONE = '+18777574365';
const SITE_PHONE_DISPLAY = '(877) 757-4365';

/** Homepage hero: full-width crew photo with a ZIP availability card overlapping its bottom edge. */
export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

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
      const place = (await res.json()).places?.[0];
      navigate('/quote', {
        state: {
          zipValue: parsed.formatted,
          zipResult: { city: place?.['place name'] ?? '', state: place?.['state abbreviation'] ?? '' },
        },
      });
    } catch {
      setError('We couldn’t check that ZIP right now. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className="home-hero zip-hero" aria-labelledby="home-hero-heading">
      <div className="zip-hero-head">
        <h1 id="home-hero-heading" className="home-display zip-hero-title">
          Junk hauled away from only <span>${JUNK_REMOVAL_MIN_PRICE}</span>
        </h1>
        <p className="zip-hero-sub">Pick your items. We do the heavy lifting.</p>
        <p className="zip-hero-rating">
          <span className="zip-hero-stars" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={20} className="fill-current" />)}
          </span>
          <strong>4.8 average rating</strong>
        </p>
        <p className="zip-hero-rating-note">From verified Opek customers</p>
      </div>

      <div className="zip-hero-media">
        <img
          src="/optimized/hero-backgrounds/opek-crew-high-five-unbranded.webp"
          alt="Two Opek providers in purple shirts high-fiving beside a junk removal truck"
          fetchPriority="high"
        />
      </div>

      <div className="zip-hero-card-wrap">
        <div className="zip-hero-card">
          <h2 className="home-display zip-hero-card-title">Start with your ZIP code</h2>
          <form onSubmit={handleSubmit} className="zip-hero-form" noValidate>
            <label htmlFor="hero-zip" className="sr-only">ZIP code</label>
            <div className={`zip-hero-field ${error ? 'has-error' : ''}`}>
              <MapPin size={22} strokeWidth={1.8} aria-hidden />
              <input
                id="hero-zip"
                inputMode="numeric"
                autoComplete="postal-code"
                enterKeyHint="go"
                placeholder="Enter ZIP code"
                value={zip}
                onChange={(e) => {
                  setZip(normalizePostalInput(e.target.value));
                  if (error) setError('');
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'hero-zip-error' : undefined}
              />
            </div>
            {error && (
              <p id="hero-zip-error" role="alert" className="zip-hero-error">{error}</p>
            )}
            <button type="submit" disabled={checking} aria-busy={checking} className="home-cta zip-hero-submit">
              {checking ? <><Loader2 size={18} className="animate-spin" aria-hidden /> Checking…</> : 'Check availability'}
            </button>
          </form>

          <p className="zip-hero-call">
            Or call <a href={`tel:${SITE_PHONE}`}>{SITE_PHONE_DISPLAY}</a>
          </p>
        </div>

        <p className="zip-hero-fine">
          ${JUNK_REMOVAL_MIN_PRICE} minimum for junk removal. Final price is confirmed once your items are reviewed.
          Services are performed by independent local providers; availability varies by area.
        </p>
      </div>
    </section>
  );
};
