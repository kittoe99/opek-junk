import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, ClipboardList, MessageSquare, Phone, Star } from 'lucide-react';
import { normalizePostalInput, parsePostalCode } from '../../lib/postalCode';

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

const providerFinePrint =
  'Services are performed by independent local providers. Pricing and availability vary by area.';

/* ------------------------------------------------------------------ */
/* Featured services                                                   */
/* ------------------------------------------------------------------ */

export const HomeFeaturedServices: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Junk removal',
      body: 'Couches, appliances, mattresses, yard debris and full loads. Pick your items, see your price, and a crew hauls it all away.',
      image: '/home-transparent/junk-dump-truck.png',
      alt: 'Purple dump truck loaded with furniture and household junk',
      cta: 'Get a price',
      onClick: () => navigate('/quote'),
    },
    {
      title: 'Small local moves',
      body: 'Truck and crew for apartments, studios and short-distance moves. Book helpers by the hour, with or without a truck.',
      image: '/home-transparent/junk-chest-logo.png',
      alt: 'Two providers carrying a couch to a moving truck',
      cta: 'Book a move',
      onClick: () => navigate('/booking', { state: { serviceType: 'Moving Labor' } }),
    },
  ];

  const moreServices = [
    { label: 'Dumpster rental', to: '/services/dumpster-rental' },
    { label: 'Mattress disposal', to: '/services/mattress-disposal' },
    { label: 'Property cleanouts', to: '/services/property-cleanout' },
  ];

  return (
    <section id="services" className="bg-[#f2f2f2] py-14 sm:py-16 md:py-20" aria-labelledby="home-services-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="home-services-heading"
          className="home-display text-center text-[2rem] leading-none sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]"
        >
          Clear out your space
        </h2>

        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 max-w-[860px] mx-auto">
          {cards.map((card) => (
            <article key={card.title} className="flex flex-col items-center text-center">
              <div className="home-image-backdrop w-full aspect-[17/10] overflow-hidden rounded-lg">
                <img
                  src={card.image}
                  alt={card.alt}
                  loading="lazy"
                  className="h-full w-full object-contain object-bottom pt-4"
                />
              </div>
              <h3 className="home-display mt-5 text-[1.4rem] sm:text-[1.6rem] leading-tight text-[#140a1f]">
                {card.title}
              </h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[#2b2236]">{card.body}</p>
              <button type="button" onClick={card.onClick} className="home-cta mt-5 min-w-[196px]">
                {card.cta}
              </button>
              <p className="mt-4 max-w-sm text-[12px] leading-snug text-[#5a5266]">{providerFinePrint}</p>
            </article>
          ))}
        </div>

        <nav aria-label="More services" className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <span className="text-[13px] font-bold uppercase tracking-wide text-[#4a4256]">More services:</span>
          {moreServices.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[14px] font-semibold text-[#520f96] underline underline-offset-4 hover:text-[#3a0a6b]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const steps = [
  {
    title: 'Pick your items',
    body: 'Tell us what’s going — one couch or a whole garage — and see your upfront price online.',
    image: '/home-transparent/mattress-branded.png',
    alt: 'Provider carrying a mattress',
    fit: 'contain' as const,
  },
  {
    title: 'Choose a time',
    body: 'Book a pickup window that works for you, including same-day where providers are available.',
    image: '/home-transparent/schedule-phone.png',
    alt: 'Hand holding a phone with a pickup calendar and time-window choices',
    imageClassName: 'h-full w-full object-contain object-bottom pt-5',
    fit: 'contain' as const,
  },
  {
    title: 'We haul it away',
    body: 'Your provider loads everything up and takes care of disposal, donation or recycling.',
    image: '/home-transparent/junk-dump-truck.png',
    alt: 'Purple dump truck loaded with furniture and household junk',
    fit: 'contain' as const,
  },
];

export const HomeHowItWorks: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const firstOffset = cards[0]?.offsetLeft ?? 0;
    const nearest = cards.reduce((best, card, index) =>
      Math.abs(card.offsetLeft - firstOffset - track.scrollLeft) <
      Math.abs(cards[best].offsetLeft - firstOffset - track.scrollLeft) ? index : best, 0);
    setActive(nearest);
  };

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement;
    const card = track.children[index] as HTMLElement;
    track.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section id="process" className="bg-white py-14 sm:py-16 md:py-20" aria-labelledby="home-process-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="home-process-heading"
            className="home-display text-[2rem] leading-[0.98] sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]"
          >
            Three steps. One
            <br className="hidden sm:block" /> clear space.
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-[#2b2236]">
            Booking junk removal online has never been easier.
          </p>
        </div>

        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="home-process-track relative mt-10 -mx-4 px-4 flex md:grid md:grid-cols-3 gap-5 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-auto md:px-0 md:max-w-[840px]"
        >
          {steps.map((step, i) => (
            <article key={step.title} className="snap-start shrink-0 w-[78%] sm:w-[46%] md:w-auto text-center">
              <div className="home-image-backdrop relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  className={step.imageClassName ?? 'h-full w-full object-contain object-bottom pt-5'}
                />
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center bg-white font-['Archivo'] text-[15px] font-black text-[#520f96]">
                  {i + 1}
                </span>
              </div>
              <h3 className="home-display mt-5 text-[1.35rem] sm:text-[1.5rem] leading-tight text-[#140a1f]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#2b2236]">{step.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3 md:hidden" role="group" aria-label="Choose step">
          {steps.map((step, i) => (
            <button
              key={step.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show step ${i + 1}: ${step.title}`}
              aria-current={active === i ? 'true' : undefined}
              className="flex h-11 w-9 items-center justify-center rounded-full"
            >
              <span aria-hidden className={`h-4 w-4 rounded-full transition-colors ${active === i ? 'bg-[#520f96]' : 'bg-[#b9b4bf]'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Violet promo band with ZIP check                                    */
/* ------------------------------------------------------------------ */

export const HomePromoBand: React.FC = () => {
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
    navigate(`/quote?${new URLSearchParams({ zip: parsed.formatted }).toString()}`);
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
          Providers in all 50 states
        </h2>
        <p className="mt-3 text-[15px] sm:text-base font-semibold">
          Enter your ZIP to check coverage and see your price.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-stretch justify-center gap-3" noValidate>
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
            className="h-[52px] w-full sm:w-56 rounded-none border-0 bg-white px-4 text-[16px] font-semibold text-[#140a1f]"
          />
          <button type="submit" className="home-cta">
            Check my area
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

export const HomeWaysToBook: React.FC = () => {
  const options = [
    { label: 'Call', detail: SITE_PHONE_DISPLAY, href: `tel:${SITE_PHONE}`, icon: Phone },
    { label: 'Text', detail: SITE_PHONE_DISPLAY, href: `sms:${SITE_PHONE}`, icon: MessageSquare },
    { label: 'Book online', detail: 'Pick a time', to: '/booking', icon: CalendarCheck },
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
          <div className="home-booking-options bg-[#a020f0] rounded-lg px-6 py-4 sm:px-8">
            <ul className="divide-y divide-white/25">
              {options.map(({ label, detail, href, to, icon: Icon }) => {
                const inner = (
                  <>
                    <Icon size={26} className="shrink-0" aria-hidden />
                    <span className="home-display text-[1.45rem] sm:text-[1.75rem] leading-none">{label}</span>
                    <span className="home-booking-detail ml-auto text-[13px] sm:text-[14px] font-semibold">{detail}</span>
                  </>
                );
                const cls = 'flex items-center gap-4 py-4 text-white hover:opacity-85 transition-opacity';
                return (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className={cls}>
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
              Not sure what it’ll cost or how big the job is? Call or text and we’ll walk you through it, or have a provider
              stop by for a free in-home estimate.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[14px] font-semibold">
              <Link to="/quote" className="text-[#520f96] hover:underline underline-offset-4">
                Get a quote
              </Link>
              <Link to="/track-order" className="text-[#520f96] hover:underline underline-offset-4">
                Track an order
              </Link>
              <Link to="/contact" className="text-[#520f96] hover:underline underline-offset-4">
                Contact us
              </Link>
              <Link to="/provider-signup" className="text-[#520f96] hover:underline underline-offset-4">
                Become a provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
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
  <section id="testimonials" className="bg-[#f2f2f2] py-14 sm:py-16 md:py-20" aria-labelledby="home-reviews-heading">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        id="home-reviews-heading"
        className="home-display text-center text-[2rem] leading-none sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]"
      >
        Rated 4.8 by customers
      </h2>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((review) => (
          <figure key={review.author} className="bg-white rounded-lg p-6 flex flex-col">
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
