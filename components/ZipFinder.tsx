import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizePostalInput, parsePostalCode } from '../lib/postalCode';

const CHECK_MS = 1500;
const FOUND_MS = 500;
const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

type Phase = 'idle' | 'checking' | 'found';

interface ZipFinderProps {
  /** Override default /quote redirect after a successful ZIP check */
  onResolved?: (zip: string) => void;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  buttonLabel?: string;
  pricingHref?: string | null;
  pricingLabel?: string;
}

export const ZipFinder: React.FC<ZipFinderProps> = ({
  onResolved,
  eyebrow = 'Instant coverage check',
  title,
  subtitle = 'Enter your ZIP—we’ll connect you with independent junk haulers available in your area.',
  buttonLabel = 'Find Junk Haulers Near Me',
  pricingHref = '/quote',
  pricingLabel = 'View Pricing',
}) => {
  const navigate = useNavigate();
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [resolvedZip, setResolvedZip] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== 'idle') return;

    const parsed = parsePostalCode(zip);
    if (parsed.ok === false) {
      setError(parsed.error);
      return;
    }

    setError('');
    setZip(parsed.formatted);
    setResolvedZip(parsed.formatted);
    setPhase('checking');

    timerRef.current = window.setTimeout(() => {
      setPhase('found');
      timerRef.current = window.setTimeout(() => {
        if (onResolved) {
          onResolved(parsed.formatted);
          return;
        }
        const params = new URLSearchParams({ zip: parsed.formatted });
        navigate(`/quote?${params.toString()}`);
      }, FOUND_MS);
    }, CHECK_MS);
  };

  const busy = phase !== 'idle';

  return (
    <section id="contact" className="relative bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute inset-0 bg-dark-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)] opacity-60" aria-hidden />
      <div className="absolute -bottom-24 right-[-6%] h-[320px] w-[320px] rounded-full bg-brand/10 blur-[120px]" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-brand/50 via-white/10 to-transparent p-px shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8)]">
          <div className="relative rounded-[calc(1.5rem-1px)] bg-[#0c0c10] overflow-hidden">
            <div className="absolute -top-20 -left-20 h-[260px] w-[260px] rounded-full bg-brand/15 blur-[100px]" aria-hidden />

            <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-10 p-7 sm:p-10 md:p-12">
              {/* Radar visual */}
              <div className="relative flex items-center justify-center min-h-[190px] md:min-h-[240px]">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52">
                  <span className="absolute inset-0 rounded-full border border-white/10" aria-hidden />
                  <span className="absolute inset-6 rounded-full border border-white/[0.08]" aria-hidden />
                  <span className="absolute inset-12 rounded-full border border-brand/25" aria-hidden />
                  <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand/70 animate-spin-slow" aria-hidden />
                  <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_12px_rgba(255,0,110,0.9)]" aria-hidden />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="relative flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-full bg-brand/15 border border-brand/40 shadow-[0_0_44px_rgba(255,0,110,0.45)]">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-brand" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                      </svg>
                    </span>
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                  {eyebrow}
                </p>
                <h2 className="font-sans font-extrabold text-[1.65rem] sm:text-[2rem] md:text-[2.3rem] text-[var(--text)] tracking-tight leading-[1.1] mb-3">
                  {title ?? (
                    <>
                      Check junk removal{' '}
                      <span className="font-serif italic font-normal text-brand">near you</span>
                    </>
                  )}
                </h2>
                <p className="text-[var(--text-muted)] text-[14px] sm:text-[15px] leading-relaxed mb-6">
                  {subtitle}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 mb-2 max-w-lg" noValidate>
                  <label className="relative flex-1">
                    <span className="sr-only">Zip / Postal Code</span>
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand z-10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3" />
                        <path d="M11 8v6M8 11h6" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      inputMode="text"
                      autoComplete="postal-code"
                      maxLength={12}
                      value={zip}
                      disabled={busy}
                      onChange={(e) => {
                        setZip(normalizePostalInput(e.target.value));
                        if (error) setError('');
                      }}
                      placeholder="Enter Zip/Postal Code"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'zip-error' : undefined}
                      className={`w-full rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none border border-b-0 sm:border-b sm:border-r-0 bg-[#0e0e12] pl-10 pr-4 py-3.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 hover:bg-[#121218] disabled:opacity-70 ${
                        error ? 'border-brand' : 'border-white/15'
                      }`}
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={busy}
                    className="shrink-0 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none bg-brand px-5 py-3.5 text-sm font-semibold text-white hover:bg-brand-600 transition-all disabled:opacity-70 disabled:cursor-wait shadow-[0_0_24px_-6px_rgba(255,0,110,0.6)]"
                  >
                    {buttonLabel}
                  </button>
                </form>

                {error && (
                  <p id="zip-error" className="mb-3 text-sm font-semibold text-brand" role="alert">
                    {error}
                  </p>
                )}

                <p className="text-sm font-bold text-neutral-300 mt-4">
                  Call us at{' '}
                  <a href={`tel:${SITE_PHONE}`} className="text-brand hover:text-brand-400 transition-colors">
                    {SITE_PHONE_DISPLAY}
                  </a>
                  {pricingHref ? (
                    <>
                      {' '}or{' '}
                      <a href={pricingHref} className="text-brand hover:text-brand-400 transition-colors">
                        {pricingLabel}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
            </div>

            {busy && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(8,8,11,0.92)] backdrop-blur-[3px] px-6"
                role="status"
                aria-live="polite"
              >
                <div className="w-full max-w-sm text-center zip-check-panel">
                  {phase === 'checking' && (
                    <>
                      <div className="relative mx-auto mb-5 h-20 w-20">
                        <span className="absolute inset-0 rounded-full border-2 border-brand/25 zip-check-ring" />
                        <span className="absolute inset-2 rounded-full border-2 border-transparent border-t-brand zip-check-spin" />
                        <span className="absolute inset-0 flex items-center justify-center text-brand">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                          </svg>
                        </span>
                      </div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-brand mb-2">
                        Checking coverage
                      </p>
                      <p className="font-serif text-[1.45rem] sm:text-[1.65rem] text-white tracking-tight leading-tight mb-2">
                        Looking for providers near {resolvedZip}…
                      </p>
                      <p className="text-sm text-[#b0b0b0]">Confirming service availability in your area.</p>
                      <div className="mt-5 mx-auto h-1 max-w-[200px] overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-brand zip-check-bar" />
                      </div>
                    </>
                  )}

                  {phase === 'found' && (
                    <>
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-brand zip-check-pop">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-brand mb-2">
                        Providers available
                      </p>
                      <p className="font-serif text-[1.45rem] sm:text-[1.65rem] text-white tracking-tight leading-tight mb-2">
                        Great news — we serve {resolvedZip}.
                      </p>
                      <p className="text-sm text-[#b0b0b0]">Taking you to pricing…</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
