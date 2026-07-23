import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  JunkIcon,
  DumpsterIcon,
  PropertyCleanoutIcon,
  MovingLaborIcon,
} from './icons/ServiceIcons';

const ArtJunk = () => (
  <svg viewBox="0 0 320 200" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="opekJunkBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#0d0d0d" />
      </linearGradient>
      <linearGradient id="opekJunkGlow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#ff006e" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ff006e" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="320" height="200" fill="url(#opekJunkBg)" />
    <ellipse cx="260" cy="30" rx="90" ry="60" fill="url(#opekJunkGlow)" />
    <rect x="42" y="78" width="110" height="58" rx="6" fill="#141414" stroke="#2a2a2a" strokeWidth="1.5" />
    <rect x="54" y="90" width="40" height="22" rx="2" fill="#ff006e" fillOpacity="0.8" />
    <rect x="104" y="90" width="36" height="22" rx="2" fill="#2a2a2a" />
    <rect x="54" y="120" width="86" height="8" rx="2" fill="#2a2a2a" />
    <path d="M175 95h70l8 45H167z" fill="#1c1c1c" stroke="#333" strokeWidth="1.5" />
    <ellipse cx="210" cy="95" rx="35" ry="9" fill="#242424" stroke="#333" />
    <circle cx="190" cy="148" r="9" fill="#2a2a2a" stroke="#444" />
    <circle cx="230" cy="148" r="9" fill="#2a2a2a" stroke="#444" />
    <path d="M292 58l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#ff006e" fillOpacity="0.7" />
    <circle cx="168" cy="58" r="3" fill="#ff006e" />
  </svg>
);

const ArtDumpster = () => (
  <svg viewBox="0 0 320 200" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="opekDumpBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#141414" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <radialGradient id="opekDumpGlow" cx="30%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#ff006e" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ff006e" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="320" height="200" fill="url(#opekDumpBg)" />
    <ellipse cx="90" cy="80" rx="100" ry="80" fill="url(#opekDumpGlow)" />
    <path d="M20 170h280" stroke="#2a2a2a" strokeWidth="2" />
    <path d="M68 72h164l14 78H54z" fill="#1c1c1c" stroke="#333" strokeWidth="1.5" />
    <rect x="68" y="58" width="164" height="18" rx="3" fill="#242424" stroke="#333" />
    <rect x="100" y="64" width="42" height="6" rx="1" fill="#ff006e" />
    <rect x="158" y="64" width="42" height="6" rx="1" fill="#3a3a3a" />
    <line x1="110" y1="90" x2="110" y2="140" stroke="#2e2e2e" strokeWidth="2" />
    <line x1="150" y1="90" x2="150" y2="140" stroke="#2e2e2e" strokeWidth="2" />
    <line x1="190" y1="90" x2="190" y2="140" stroke="#2e2e2e" strokeWidth="2" />
    <circle cx="86" cy="158" r="8" fill="#2a2a2a" />
    <circle cx="234" cy="158" r="8" fill="#2a2a2a" />
  </svg>
);

const ArtCleanout = () => (
  <svg viewBox="0 0 320 200" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="opekCleanBg" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#121212" />
        <stop offset="100%" stopColor="#080808" />
      </linearGradient>
      <linearGradient id="opekCleanShine" x1="0" y1="0.5" x2="1" y2="0.5">
        <stop offset="0%" stopColor="#ff006e" stopOpacity="0" />
        <stop offset="45%" stopColor="#ff006e" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ff006e" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="320" height="200" fill="url(#opekCleanBg)" />
    <path d="M78 155 L160 68 L242 155 Z" fill="#1a1a1a" stroke="#2e2e2e" strokeWidth="1.5" />
    <rect x="132" y="112" width="56" height="43" rx="2" fill="#141414" stroke="#333" />
    <rect x="150" y="128" width="20" height="27" rx="1" fill="#ff006e" fillOpacity="0.45" />
    <rect x="95" y="155" width="130" height="10" fill="#151515" />
    <rect x="48" y="120" width="28" height="35" rx="3" fill="#1c1c1c" stroke="#2e2e2e" />
    <rect x="244" y="125" width="28" height="30" rx="3" fill="#1c1c1c" stroke="#2e2e2e" />
    <path d="M30 140 Q160 122 290 148" stroke="url(#opekCleanShine)" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
);

const ArtMoving = () => (
  <svg viewBox="0 0 320 200" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <defs>
      <linearGradient id="opekMoveBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#161616" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <linearGradient id="opekMoveGlow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#ff006e" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#ff006e" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="320" height="200" fill="url(#opekMoveBg)" />
    <ellipse cx="250" cy="40" rx="85" ry="55" fill="url(#opekMoveGlow)" />
    <path d="M20 168h280" stroke="#2a2a2a" strokeWidth="2" />
    <rect x="48" y="78" width="120" height="70" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
    <rect x="168" y="98" width="78" height="50" rx="4" fill="#141414" stroke="#333" strokeWidth="1.5" />
    <rect x="178" y="108" width="36" height="22" rx="2" fill="#ff006e" fillOpacity="0.55" />
    <circle cx="78" cy="156" r="12" fill="#1c1c1c" stroke="#444" strokeWidth="2" />
    <circle cx="148" cy="156" r="12" fill="#1c1c1c" stroke="#444" strokeWidth="2" />
    <circle cx="220" cy="156" r="12" fill="#1c1c1c" stroke="#444" strokeWidth="2" />
    <rect x="60" y="92" width="40" height="28" rx="2" fill="#242424" />
    <rect x="110" y="92" width="40" height="28" rx="2" fill="#242424" />
    <path d="M270 70l1.5 3.5 3.5 1.5-3.5 1.5L270 80l-1.5-3.5L265 75l3.5-1.5z" fill="#ff006e" fillOpacity="0.8" />
  </svg>
);

const serviceGroups = [
  {
    index: '01',
    title: 'Junk Removal',
    tagline: 'Single items to full loads',
    description:
      'Furniture, appliances, household clutter, and commercial debris hauled away by matched local providers. Same-day options in most areas with a guaranteed upfront price before you book.',
    path: '/services/junk-removal',
    Art: ArtJunk,
    Icon: JunkIcon,
  },
  {
    index: '02',
    title: 'Dumpster Rental',
    tagline: 'Roll-off, delivered',
    description:
      'Roll-off dumpsters delivered to your site for construction debris, yard waste, and renovation projects. Flat-rate pricing with flexible rental periods—no hidden fees.',
    path: '/services/dumpster-rental',
    Art: ArtDumpster,
    Icon: DumpsterIcon,
  },
  {
    index: '03',
    title: 'Property Cleanouts',
    tagline: 'Estate & move-out clearing',
    description:
      'Estate clearing, move-outs, garage cleanouts, and full property clearances. We match you with independent crews who handle the heavy lifting end to end.',
    path: '/services/property-cleanout',
    Art: ArtCleanout,
    Icon: PropertyCleanoutIcon,
  },
  {
    index: '04',
    title: 'Local Moving',
    tagline: 'Truck + crew by the hour',
    description:
      'Truck and crew for apartment and small home moves. Hourly rates for loading, unloading, and local hauling—matched to the size of your move.',
    path: '/services/moving-labor',
    Art: ArtMoving,
    Icon: MovingLaborIcon,
  },
];

export const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="relative py-14 sm:py-18 md:py-20 lg:py-24 bg-[var(--bg-alt)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-brand/50 to-transparent" aria-hidden />
      <div className="absolute -top-24 left-[-8%] h-[320px] w-[320px] rounded-full bg-brand/[0.07] blur-[120px]" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-12 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
          <div className="max-w-xl">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
              What we do
            </p>
            <h2 className="font-sans font-extrabold text-[1.7rem] sm:text-[2.3rem] md:text-[2.6rem] text-[var(--text)] tracking-tight leading-[1.08]">
              How Opek can{' '}
              <span className="font-serif italic font-normal text-brand">help you</span>
            </h2>
          </div>
          <p className="text-[var(--text-muted)] text-[13px] sm:text-base leading-relaxed max-w-sm md:text-right">
            Independent providers for junk removal, dumpsters, cleanouts, and moving—matched to your job and schedule.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {serviceGroups.map((group) => (
            <article
              key={group.title}
              onClick={() => navigate(group.path)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7),0_0_40px_-12px_rgba(255,0,110,0.35)]"
            >
              {/* Watermark index */}
              <span
                className="pointer-events-none absolute -top-3 right-3 z-20 font-serif italic text-[4.5rem] sm:text-[5.5rem] leading-none text-white/[0.05] transition-colors duration-500 group-hover:text-brand/15 select-none"
                aria-hidden
              >
                {group.index}
              </span>

              <div className="p-2.5 sm:p-3 pb-0">
                <div className="relative aspect-[16/9] sm:aspect-[16/10] overflow-hidden rounded-xl bg-[#0c0c10] border border-white/[0.04]">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                    <group.Art />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10]/60 via-transparent to-transparent" aria-hidden />
                </div>
              </div>

              <div className="relative flex flex-col px-5 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 border border-brand/25 text-brand transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_0_18px_rgba(255,0,110,0.5)]">
                    <group.Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-sans font-bold text-[1.05rem] sm:text-[1.15rem] text-[var(--text)] tracking-tight leading-tight">
                      {group.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-brand/80">
                      {group.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-[13px] sm:text-sm text-[var(--text-muted)] leading-relaxed mb-5 line-clamp-3">
                  {group.description}
                </p>

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] transition-colors group-hover:text-brand">
                  Learn more
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
