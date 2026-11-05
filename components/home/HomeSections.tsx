import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarCheck, ChevronLeft, ChevronRight, ClipboardList, MessageSquare, Phone, Star } from 'lucide-react';
import { normalizePostalInput, parsePostalCode } from '../../lib/postalCode';

const SITE_PHONE = '+18777574365';
const SITE_PHONE_DISPLAY = '(877) 757-4365';

const providerFinePrint =
  'Services are performed by independent local providers. Pricing and availability vary by area.';

/* ------------------------------------------------------------------ */
/* Featured services                                                   */
/* ------------------------------------------------------------------ */

const services = [
  {
    title: 'Junk removal',
    trademark: true,
    image: '/optimized/service-scenes/junk-truck-unbranded.webp',
    imagePosition: 'center 40%',
    cta: 'Get a price',
    to: '/quote',
  },
  {
    title: 'Small local moves',
    trademark: true,
    image: '/optimized/service-scenes/local-movers-card-v5.webp',
    imagePosition: 'center 30%',
    cta: 'Book a move',
    to: '/booking',
    state: { serviceType: 'Moving Labor' },
  },
  {
    title: 'Dumpster rental',
    image: '/optimized/service-scenes/dumpster-rental-unbranded.webp',
    imagePosition: 'center 45%',
    to: '/services/dumpster-rental',
  },
  {
    title: 'Property cleanouts',
    image: '/optimized/service-scenes/property-cleanouts-card-v3.webp',
    imagePosition: 'center 25%',
    to: '/services/property-cleanout',
  },
  {
    title: 'Move-out cleaning',
    image: '/optimized/service-scenes/move-out-cleaning-card-v3.webp',
    imagePosition: 'center 20%',
    to: '/services/move-out-cleaning',
  },
];

/** Whole-card link: photo background, dark purple overlay, content anchored to the bottom. */
const ServiceImageCard: React.FC<{
  title: string;
  image: string;
  imagePosition: string;
  to: string;
  state?: Record<string, unknown>;
  trademark?: boolean;
  cta?: string;
  className?: string;
}> = ({ title, image, imagePosition, to, state, trademark, cta = 'Learn more', className = '' }) => (
  <Link
    to={to}
    state={state}
    className={`svc-card group relative isolate flex min-h-[200px] flex-col justify-end overflow-hidden rounded-[6px] bg-[#1a0730] p-3.5 text-white shadow-[0_10px_30px_rgba(20,10,31,0.18)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(20,10,31,0.32)] sm:p-5 md:min-h-[270px] md:p-7 ${className}`}
  >
    <img
      src={image}
      alt=""
      loading="lazy"
      style={{ objectPosition: imagePosition }}
      className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
    <span className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1a0730]/95 via-[#1a0730]/70 to-[#1a0730]/25" aria-hidden />
    <h3 className="home-display text-white">
      {title}
      {trademark && <sup className="tm-mark" aria-hidden>™</sup>}
    </h3>
    <span className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-bold md:mt-3 md:text-[14px]">
      {cta}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
    </span>
  </Link>
);

const sliderArrowClass =
  'ui-icon-button border border-[#520f96] bg-white text-[#520f96] transition-colors hover:bg-[#f4eefc] disabled:hover:bg-white';

/** Swipeable row of service cards with a peek of the next card; arrows appear from tablet up. */
const ServiceSlider: React.FC = () => {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const slide = (direction: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: direction * (card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <div
        ref={track}
        role="group"
        aria-label="Our services"
        className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-3 mt-3 md:mt-5 flex snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 gap-3 md:gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service) => (
          <ServiceImageCard key={service.title} {...service} className="w-[46%] shrink-0 snap-start md:w-[31%]" />
        ))}
      </div>
      <div className="mt-6 hidden items-center justify-center gap-3 md:flex">
        <button type="button" onClick={() => slide(-1)} disabled={atStart} aria-label="Previous services" className={sliderArrowClass}>
          <ChevronLeft size={22} aria-hidden />
        </button>
        <button type="button" onClick={() => slide(1)} disabled={atEnd} aria-label="More services" className={sliderArrowClass}>
          <ChevronRight size={22} aria-hidden />
        </button>
      </div>
    </>
  );
};

export const HomeFeaturedServices: React.FC = () => (
  <section id="services" className="bg-[#f7f6f9] py-14 sm:py-16 md:py-20" aria-labelledby="home-services-heading">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        id="home-services-heading"
        className="home-display text-center text-[2rem] leading-none sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]"
      >
        Clear out your space
      </h2>
      <p className="mt-3 text-center text-[15px] sm:text-base text-[#2b2236] [text-wrap:balance]">
        One item, one room or a whole home. Pick what you need.
      </p>

      <ServiceSlider />

      <p className="mt-6 text-center text-[12px] leading-snug text-[#5a5266]">{providerFinePrint}</p>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const steps = [
  {
    title: 'Pick your items',
    body: 'Tell us what’s going — one couch or a whole garage — and see your upfront price online.',
    image: '/optimized/service-scenes/mattress-pickup-natural.webp',
    alt: 'Two workers carrying a bagged mattress toward a van',
    fit: 'contain' as const,
  },
  {
    title: 'Choose a time',
    body: 'Book a pickup window that works for you, including same-day where providers are available.',
    image: '/optimized/service-scenes/scheduling-natural.webp',
    alt: 'Hand holding a phone with a pickup calendar and time-window choices',
    imageClassName: 'h-full w-full object-contain object-bottom pt-5',
    fit: 'contain' as const,
  },
  {
    title: 'We haul it away',
    body: 'Your provider loads everything up and takes care of disposal, donation or recycling.',
    image: '/optimized/service-scenes/junk-removal-natural.webp',
    alt: 'Workers carrying an unwanted armchair toward a hauling truck',
    fit: 'contain' as const,
  },
];

export interface HomeStep {
  title: string;
  body: string;
  image: string;
  alt: string;
  imageClassName?: string;
}

export const HomeHowItWorks: React.FC<{
  title?: React.ReactNode;
  description?: string;
  items?: HomeStep[];
}> = ({
  title = <>Three steps. One<br className="hidden sm:block" /> clear space.</>,
  description = 'Booking junk removal online has never been easier.',
  items = steps,
}) => {
  return (
    <section id="process" className="bg-white py-14 sm:py-16 md:py-20" aria-labelledby="home-process-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="home-process-heading"
            className="home-display text-[2rem] leading-[0.98] sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]"
          >
            {title}
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-[#2b2236]">
            {description}
          </p>
        </div>

        <div
          className="home-process-track relative mt-8 md:mt-10 flex flex-col md:grid md:grid-cols-3 md:gap-10 md:mx-auto md:max-w-[840px]"
        >
          {items.map((step, i) => (
            <article
              key={step.title}
              className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-4 border-b border-[#ece6f2] py-4 first:pt-0 last:border-0 last:pb-0 md:block md:border-0 md:p-0 md:text-center"
            >
              <div className="ui-image-frame home-photo-frame relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  className={step.imageClassName ?? 'h-full w-full object-contain object-bottom pt-2 md:pt-5'}
                />
              </div>
              <div>
                <span className="home-step-num" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="home-display text-[1.2rem] sm:text-[1.5rem] leading-tight text-[#140a1f]">
                  {step.title}
                </h3>
                <p className="mt-1 md:mt-2 text-[14px] md:text-[15px] leading-snug md:leading-relaxed text-[#2b2236]">
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Violet promo band with ZIP check                                    */
/* ------------------------------------------------------------------ */

export const HomePromoBand: React.FC<{
  title?: React.ReactNode;
  description?: string;
  onCheck?: (zip: string) => void;
}> = ({ title = 'Providers in all 50 states', description = 'Enter your ZIP to check coverage and see your price.', onCheck }) => {
  const navigate = useNavigate();
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parsePostalCode(zip);
    if (parsed.ok === false) {
      setError(parsed.error);
      return;
    }
    setError('');
    if (onCheck) onCheck(parsed.formatted);
    else navigate(`/quote?${new URLSearchParams({ zip: parsed.formatted }).toString()}`);
  };

  return (
    <section
      id="service-area"
      className="home-promo relative overflow-hidden bg-[#a020f0] py-12 sm:py-14 text-white"
      aria-labelledby="home-promo-heading"
    >
      <div
        className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,#c35cff_0%,transparent_40%),radial-gradient(circle_at_85%_80%,#7d0fc4_0%,transparent_45%)]"
        aria-hidden
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 id="home-promo-heading" className="home-display text-[1.9rem] leading-none sm:text-[2.6rem] md:text-[3rem]">
          {title}
        </h2>
        <p className="mt-3 text-[15px] sm:text-base font-semibold">
          {description}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 mx-auto flex max-w-[420px] sm:max-w-none flex-row items-stretch justify-center gap-0 sm:gap-3"
          noValidate
        >
          <label htmlFor="home-zip" className="sr-only">
            ZIP code
          </label>
          <input
            id="home-zip"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="ZIP code"
            value={zip}
            onChange={(e) => {
              setZip(normalizePostalInput(e.target.value));
              if (error) setError('');
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'home-zip-error' : undefined}
            className="h-[54px] min-w-0 flex-1 sm:flex-none sm:w-56 rounded-none border-0 bg-white px-4 text-[16px] font-semibold text-[#140a1f]"
          />
          <button type="submit" className="home-cta home-zip-submit shrink-0">
            <span className="sm:hidden">Check</span>
            <span className="hidden sm:inline">Check my area</span>
          </button>
        </form>
        {error && (
          <p id="home-zip-error" role="alert" className="mt-3 text-sm font-bold text-white">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Ways to book                                                        */
/* ------------------------------------------------------------------ */

export const HomeWaysToBook: React.FC<{ bookingPath?: string; bookingState?: Record<string, unknown> }> = ({ bookingPath = '/booking', bookingState }) => {
  const options = [
    { label: 'Call', detail: SITE_PHONE_DISPLAY, href: `tel:${SITE_PHONE}`, icon: Phone },
    { label: 'Text', detail: SITE_PHONE_DISPLAY, href: `sms:${SITE_PHONE}`, icon: MessageSquare },
    { label: 'Book online', detail: 'Pick a time', to: bookingPath, icon: CalendarCheck },
    { label: 'In-home estimate', detail: 'Free visit', to: '/in-home-estimate', icon: ClipboardList },
  ];

  return (
    <section className="home-ways bg-white py-14 sm:py-16 md:py-20" aria-labelledby="home-ways-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="home-ways-heading"
          className="home-display text-center text-[2rem] leading-[0.98] sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]"
        >
          Or book the way
          <br className="hidden sm:block" /> you like
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] gap-8 md:gap-10 items-center max-w-[860px] mx-auto">
          <div className="home-booking-options md:bg-[#520f96] md:border md:border-[#520f96] md:px-8 md:py-2">
            <ul className="grid grid-cols-2 gap-2.5 md:block md:divide-y md:divide-white/20">
              {options.map(({ label, detail, href, to, icon: Icon }) => {
                const inner = (
                  <>
                    <Icon size={26} className="shrink-0 text-white" aria-hidden />
                    <span>
                      <span className="home-display block text-[1.2rem] md:inline md:text-[1.75rem] leading-none">{label}</span>
                      <span className="md:hidden mt-1 block text-[12px] font-semibold text-[#e6daf5]">{detail}</span>
                    </span>
                    <span className="home-booking-detail hidden md:inline ml-auto text-[14px] font-semibold text-[#e6daf5]">{detail}</span>
                  </>
                );
                const cls =
                  'flex h-full min-h-[118px] flex-col items-start justify-between gap-3 border border-[#520f96] bg-[#520f96] p-4 text-white transition-colors hover:border-[#3a0a6b] hover:bg-[#3a0a6b] md:min-h-0 md:flex-row md:items-center md:justify-start md:gap-4 md:border-0 md:bg-transparent md:px-0 md:py-4 md:hover:bg-transparent md:hover:text-[#e6daf5]';
                return (
                  <li key={label}>
                    {to ? (
                      <Link to={to} state={to === bookingPath ? bookingState : undefined} className={cls}>
                        {inner}
                      </Link>
                    ) : (
                      <a href={href} className={cls}>
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="home-display text-[1.4rem] sm:text-[1.6rem] leading-tight text-[#140a1f]">
              Real people, ready to help
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[#2b2236]">
              Call or text and we’ll walk you through it, or book a free in-home estimate.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[14px] font-semibold">
              {[
                ['Get a quote', '/quote'],
                ['Track an order', '/track-order'],
                ['Contact us', '/contact'],
                ['Become a provider', '/provider-signup'],
              ].map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  className="block text-[#520f96] hover:underline underline-offset-4"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Reviews                                                            */
/* ------------------------------------------------------------------ */

const reviews = [
  {
    quote: 'Very professional and punctual. They took special care to ensure heavy furniture made it safely out of the house.',
    author: 'Carleton H.',
  },
  {
    quote: 'They made the cleanout so quick and easy. Very adaptable even when we found more items than expected.',
    author: 'Eddie C.',
  },
  {
    quote: 'Quick and efficient! Second time booking with Opek and always an easy experience.',
    author: 'Mackenzie N.',
  },
];

export const HomeReviews: React.FC = () => (
  <section id="testimonials" className="bg-[#f7f6f9] py-14 sm:py-16 md:py-20" aria-labelledby="home-reviews-heading">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        id="home-reviews-heading"
        className="home-display text-center text-[2rem] leading-none sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]"
      >
        Rated 4.8 by customers
      </h2>
      <p className="md:hidden mt-3 flex items-center justify-center gap-1 text-[13px] font-semibold text-[#4a4256]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} className="text-[#520f96] fill-[#520f96]" aria-hidden />
        ))}
        <span className="ml-1">Swipe for more</span>
      </p>
      <div className="mt-7 md:mt-10 -mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviews.map((review) => (
          <figure key={review.author} className="soft-card snap-start shrink-0 w-[84%] md:w-auto flex flex-col">
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-[#520f96] fill-[#520f96]" aria-hidden />
              ))}
            </div>
            <blockquote className="mt-4 text-[15px] leading-relaxed text-[#2b2236] flex-1">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-[13px] font-bold uppercase tracking-wide text-[#140a1f]">
              {review.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
