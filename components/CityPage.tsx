import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Home, Building2, PackageOpen, ChevronDown, MapPin, ArrowRight, ExternalLink, BicepsFlexed, Phone, Trash2, Container } from 'lucide-react';
import { SEO } from './SEO';
import { cities } from '../lib/cityData';
import type { CityData } from '../lib/cityData';
import { TrustBadges } from './TrustBadges';
import { WhatWeHaul } from './WhatWeHaul';

interface CityPageProps {
  city: CityData;
}

export const CityPage: React.FC<CityPageProps> = ({ city }) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceItems = [
    {
      title: 'Junk Removal',
      icon: Trash2,
      description: city.services.junkRemoval,
      path: '/services/junk-removal',
    },
    {
      title: 'Dumpster Rental',
      icon: Container,
      description: city.services.dumpsterRental,
      path: '/services/dumpster-rental',
    },
    {
      title: 'Property Cleanouts',
      icon: PackageOpen,
      description: city.services.propertyCleanout,
      path: '/services/property-cleanout',
    },
    {
      title: 'Moving Labor',
      icon: BicepsFlexed,
      description: city.services.movingLabor,
      path: '/services/moving-labor',
    },
  ];

  const processSteps = [
    {
      image: '/process-step-1.svg',
      alt: 'Instant junk removal quote',
      label: 'Step One',
      titleStart: 'quotes.',
      titleAccent: 'simplified.',
      desc: 'Get an instant, flat-rate junk removal quote online.',
    },
    {
      image: '/process-step-2.svg',
      alt: 'Upfront quote on-site',
      label: 'Step Two',
      titleStart: 'Lock in a',
      titleAccent: 'fixed price.',
      desc: `Matched provider arrives anywhere in ${city.metroArea}, confirms volume, and gives you a locked-in flat quote. No upcharges.`,
    },
    {
      image: '/process-step-3.svg',
      alt: 'Professional junk removal provider team hauling items',
      label: 'Step Three',
      titleStart: 'Providers handle',
      titleAccent: 'the lifting.',
      desc: `Loading, sweeping, hauling — all handled by your matched ${city.name} provider. You point, they clear. Same day in most cases.`,
    },
  ];

  const otherCities = cities.filter((c) => c.slug !== city.slug);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Locations', href: '/#service-area' },
    { name: `${city.name}, ${city.stateAbbr}`, href: `/locations/${city.slug}` },
  ];

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Opek Junk Removal - ${city.name}, ${city.stateAbbr}`,
    description: city.seo.description,
    url: `https://opekjunkremoval.com/locations/${city.slug}`,
    telephone: '+18313187139',
    email: 'Support@opekjunkremoval.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.stateAbbr,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.geoCoords.lat,
      longitude: city.geoCoords.lon,
    },
    areaServed: [
      { '@type': 'City', name: city.name, addressRegion: city.stateAbbr },
      ...city.neighborhoods.map((n) => ({ '@type': 'Place', name: n })),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Junk Removal Services in ${city.name}`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Junk Removal in ${city.name}`, url: 'https://opekjunkremoval.com/services/junk-removal' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Dumpster Rental in ${city.name}`, url: `https://opekjunkremoval.com/services/dumpster-rental` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Property Cleanouts in ${city.name}`, url: 'https://opekjunkremoval.com/services/property-cleanout' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Moving Labor in ${city.name}`, url: 'https://opekjunkremoval.com/services/moving-labor' } },
      ],
    },
    openingHours: 'Mo-Su 07:00-20:00',
    priceRange: '$$',
    sameAs: [
      'https://facebook.com/opekjunk',
      'https://instagram.com/opekjunk',
    ],
  };

  return (
    <>
      <SEO
        title={city.seo.title}
        description={city.seo.description}
        keywords={city.seo.keywords}
        breadcrumbs={breadcrumbs}
        geoLat={city.geoCoords.lat}
        geoLon={city.geoCoords.lon}
        cityName={city.name}
        stateAbbr={city.stateAbbr}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* ── BREADCRUMB NAV ── */}
      <nav aria-label="Breadcrumb" className="bg-secondary-50 border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <ol className="flex items-center gap-1.5 text-xs" itemScope itemType="https://schema.org/BreadcrumbList">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1.5" itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                {i > 0 && <span className="text-secondary-300">/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link to={crumb.href} className="text-secondary-400 hover:text-brand transition-colors font-medium" itemProp="item">
                    <span itemProp="name">{crumb.name}</span>
                  </Link>
                ) : (
                  <span className="text-secondary font-black" itemProp="name">{crumb.name}</span>
                )}
                <meta itemProp="position" content={String(i + 1)} />
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ── HERO — mirrors homepage Hero exactly ── */}
      <section className="relative bg-white overflow-hidden">

        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col">
          <div
            className="relative pt-32 pb-10 px-4"
            style={{ backgroundImage: 'url(/opek2.webp)', backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10">
              <div className="mb-3 animate-fade-in">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">{city.hero.badge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-[1.05] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {city.hero.headlineStart}
                <br />
                <span className="text-brand">{city.hero.headlineAccent}</span>
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {city.hero.subheadline}
              </p>
            </div>
          </div>
          <div className="flex flex-row animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/quote')}
              className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
            >
              View Pricing
            </button>
            <button
              onClick={() => navigate('/booking')}
              className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
            >
              Book Online
            </button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex min-h-screen flex-col items-center justify-center pt-40 pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-12 gap-16 items-center">
              <div className="col-span-7">
                <div className="mb-4 animate-fade-in">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">{city.hero.badge}</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-black text-secondary tracking-tight mb-6 leading-[1.05] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  {city.hero.headlineStart}
                  <br />
                  <span className="text-brand">{city.hero.headlineAccent}</span>
                </h1>
                <p className="text-lg text-secondary mb-8 max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  {city.hero.subheadline}
                </p>
                <div className="flex flex-row gap-0 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <button
                    onClick={() => navigate('/quote')}
                    className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
                  >
                    View Pricing
                  </button>
                  <button
                    onClick={() => navigate('/booking')}
                    className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
                  >
                    Book Online
                  </button>
                </div>
              </div>
              <div className="col-span-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="relative aspect-[4/5] group">
                  <img
                    src="/opek2.webp"
                    alt={`Professional junk removal in ${city.name}`}
                    className="w-full h-full object-cover rounded-2xl shadow-lg border border-secondary-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle2 size={18} className="text-brand" />
                      <span className="text-sm font-bold">Vetted Providers • Same-Day Service • 70% Recycled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* ── SERVICES — mirrors homepage Services exactly ── */}
      <section id="services" className="py-16 md:py-24 lg:py-32 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="mb-12">
              <span className="inline-block px-4 py-2 bg-secondary text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-lg mb-6">
                Services
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight mb-4 tracking-tight">
                Fast pickup. <span className="text-brand">Fair pricing.</span>
              </h2>
              <p className="text-secondary text-lg leading-relaxed">
                Trusted professionals in {city.name}.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {serviceItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="group cursor-pointer bg-white p-5 md:p-8 rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-secondary-100 transition-all duration-300 flex items-start md:block gap-4 md:gap-0"
                >
                  <div className="md:mb-6 shrink-0 mt-0.5 md:mt-0">
                    <item.icon
                      className="w-7 h-7 md:w-12 md:h-12 text-secondary-300 group-hover:text-brand transition-colors duration-500"
                      strokeWidth={1.25}
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-secondary text-base md:text-lg mb-1 md:mb-2 group-hover:text-brand transition-colors duration-300">{item.title}</h3>
                    <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhatWeHaul />

      {/* ── PROCESS — mirrors homepage Process exactly ── */}
      <section id="process" className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-20">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">The Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight">
                From clutter to <span className="text-brand">clear</span>
                <br className="hidden md:block" /> in three moves.
              </h2>
            </div>
            <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right">
              No quote forms. No phone tag. Just photos, a fixed price, and a matched provider.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-10">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`group relative flex items-center md:block gap-4 md:gap-0 bg-secondary-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none ${
                  index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
                }`}
              >
                <div className="relative w-24 h-24 shrink-0 md:w-full md:h-auto md:aspect-square md:mb-5">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-[17px] md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-1 md:mb-3">
                    {step.titleStart} <span className="text-brand">{step.titleAccent}</span>
                  </h3>
                  <p className="text-secondary-500 text-xs md:text-[15px] leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA CTA ── */}
      <section id="service-area" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary-50/50 rounded-3xl p-8 md:p-12 border border-secondary-100">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* Left: City-specific CTA */}
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="block w-6 h-px bg-brand" />
                  <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Ready to start?</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary tracking-tight leading-[1.05] mb-6">
                  Same-day service<br /><span className="text-brand">in {city.name}.</span>
                </h2>

                <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
                  <button
                    onClick={() => navigate('/quote')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 rounded-xl shadow-md"
                  >
                    Get a Free Quote <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => navigate('/booking')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white text-secondary font-bold text-xs uppercase tracking-wider hover:bg-secondary-100 transition-colors inline-flex items-center justify-center gap-2 rounded-xl shadow-sm border border-secondary-100"
                  >
                    Book Online <ArrowRight size={14} />
                  </button>
                </div>

                <a
                  href="tel:8313187139"
                  className="inline-flex items-center gap-2 text-secondary-500 hover:text-brand transition-colors text-sm font-medium"
                >
                  <Phone size={14} />
                  <span>(831) 318-7139</span>
                </a>
              </div>

              {/* Right: Neighborhoods */}
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <MapPin size={13} className="text-brand" />
                  <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Neighborhoods</span>
                </div>
                <p className="text-2xl md:text-3xl font-black text-secondary tracking-tight leading-[1.1] mb-3">
                  Serving all of {city.metroArea}.
                </p>
                <p className="text-secondary-500 text-sm leading-relaxed mb-6">
                  {city.serviceAreaSubtext}
                </p>
                <div className="flex flex-wrap gap-2">
                  {city.neighborhoods.map((n) => (
                    <span
                      key={n}
                      className="px-3 py-1.5 bg-white text-secondary text-xs font-medium border border-secondary-100 hover:border-brand hover:text-brand transition-colors cursor-default rounded-full"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── OTHER CITIES + EXTERNAL CITATIONS ── */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

            {/* Internal: other city pages — plain text links */}
            <div>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-4">Also Serving</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {otherCities.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/locations/${c.slug}`}
                    className="text-secondary text-sm font-medium hover:text-brand transition-colors"
                  >
                    {c.name}, {c.stateAbbr}
                  </Link>
                ))}
              </div>
              <Link
                to="/#service-area"
                className="inline-flex items-center gap-1.5 mt-5 text-secondary-400 hover:text-brand transition-colors text-xs font-bold"
              >
                <MapPin size={12} />
                View all service areas
              </Link>
            </div>

            {/* External: citations & trust links — compact list */}
            <div>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-4">Resources & References</p>
              <div className="flex flex-col gap-2">
                {city.externalCitations.map((cite) => (
                  <a
                    key={cite.href}
                    href={cite.href}
                    target="_blank"
                    rel={cite.rel}
                    className="inline-flex items-center gap-2 text-secondary text-sm font-medium hover:text-brand transition-colors"
                  >
                    <ExternalLink size={12} className="text-secondary-300 shrink-0" />
                    {cite.label}
                  </a>
                ))}
                <div className="border-t border-secondary-100 my-2" />
                {[
                  { label: 'Junk removal', path: '/services/junk-removal' },
                  { label: 'Dumpster rental', path: '/services/dumpster-rental' },
                  { label: 'Moving labor', path: '/services/moving-labor' },
                ].map((s) => (
                  <Link
                    key={s.path}
                    to={s.path}
                    className="inline-flex items-center gap-2 text-secondary text-sm font-medium hover:text-brand transition-colors"
                  >
                    <ArrowRight size={12} className="text-secondary-300 shrink-0" />
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-14 md:py-20 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header — stacked and compact */}
          <div className="mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary leading-[1.05] tracking-tight mb-2">
              Questions about <span className="text-brand">{city.name}.</span>
            </h2>
            <p className="text-secondary-500 text-sm md:text-base leading-relaxed">
              Everything you need to know about junk removal in {city.metroArea}.
            </p>
          </div>
          {/* Accordion */}
          <div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: city.faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                  })),
                }),
              }}
            />
            <div className="space-y-2">
              {city.faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'shadow-md ring-1 ring-secondary' : 'shadow-sm hover:shadow-md'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-bold text-sm md:text-base text-secondary pr-4">{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-all duration-300 shrink-0 ${
                        openFaq === i ? 'text-brand rotate-180' : 'text-secondary-300'
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 md:px-5 pb-4 md:pb-5 text-secondary-400 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
