import React, { useState } from 'react';
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

        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 max-w-[860px] mx-auto">
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

        <nav aria-label="More services" className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:gap-y-3">
          <span className="text-[13px] font-bold uppercase tracking-wide text-[#4a4256]">More services:</span>
          {moreServices.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="py-2.5 md:py-0 text-[14px] font-semibold text-[#520f96] underline underline-offset-4 hover:text-[#3a0a6b]"
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
              <div className="home-image-backdrop relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  className={step.imageClassName ?? 'h-full w-full object-contain object-bottom pt-2 md:pt-5'}
                />
                <span className="absolute left-1.5 top-1.5 md:left-3 md:top-3 flex h-7 w-7 md:h-9 md:w-9 items-center justify-center bg-[#520f96] md:bg-white font-['Archivo'] text-[13px] md:text-[15px] font-black text-white md:text-[#520f96]">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="home-display md:mt-5 text-[1.2rem] sm:text-[1.5rem] leading-tight text-[#140a1f]">
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
          <div className="home-booking-options md:bg-[#a020f0] md:rounded-lg md:px-8 md:py-4">
            <ul className="grid grid-cols-2 gap-2.5 md:block md:divide-y md:divide-white/25">
              {options.map(({ label, detail, href, to, icon: Icon }) => {
                const inner = (
                  <>
                    <Icon size={26} className="shrink-0" aria-hidden />
                    <span>
                      <span className="home-display block text-[1.2rem] md:inline md:text-[1.75rem] leading-none">{label}</span>
                      <span className="md:hidden mt-1 block text-[12px] font-semibold text-white/85">{detail}</span>
                    </span>
                    <span className="home-booking-detail hidden md:inline ml-auto text-[14px] font-semibold">{detail}</span>
                  </>
                );
                const cls =
                  'flex h-full min-h-[118px] flex-col items-start justify-between gap-3 rounded-lg bg-[#8b16d4] p-4 text-white transition-opacity hover:opacity-85 md:min-h-0 md:flex-row md:items-center md:justify-start md:gap-4 md:rounded-none md:bg-transparent md:px-0 md:py-4';
                return (
                  <li key={label}>
                    {to ? (
                      <Link to={to} state={label === 'Book online' ? bookingState : undefined} className={cls}>
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
            <div className="mt-5 grid grid-cols-2 gap-2 md:gap-x-6 md:gap-y-3 text-[14px] font-semibold">
              {[
                ['Get a quote', '/quote'],
                ['Track an order', '/track-order'],
                ['Contact us', '/contact'],
                ['Become a provider', '/provider-signup'],
              ].map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  className="flex min-h-11 items-center justify-center rounded-md border border-[#e0d6ec] text-[#520f96] md:block md:min-h-0 md:rounded-none md:border-0 hover:underline underline-offset-4"
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
      <p className="md:hidden mt-3 flex items-center justify-center gap-1 text-[13px] font-semibold text-[#4a4256]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} className="text-[#520f96] fill-[#520f96]" aria-hidden />
        ))}
        <span className="ml-1">Swipe for more</span>
      </p>
      <div className="mt-7 md:mt-10 -mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-3 gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviews.map((review) => (
          <figure key={review.author} className="snap-start shrink-0 w-[84%] md:w-auto bg-white rounded-lg p-6 flex flex-col">
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
