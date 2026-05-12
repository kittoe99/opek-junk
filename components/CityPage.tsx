import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Home, Building2, PackageOpen, ChevronDown, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { SEO } from './SEO';
import { cities } from '../lib/cityData';
import type { CityData } from '../lib/cityData';

interface CityPageProps {
  city: CityData;
}

export const CityPage: React.FC<CityPageProps> = ({ city }) => {
  const navigate = useNavigate();
  const [openService, setOpenService] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceItems = [
    {
      title: 'Residential',
      icon: Home,
      description: city.services.residential,
      path: '/services/residential',
    },
    {
      title: 'Commercial',
      icon: Building2,
      description: city.services.commercial,
      path: '/services/commercial',
    },
    {
      title: 'Property Cleanouts',
      icon: PackageOpen,
      description: city.services.propertyCleanout,
      path: '/services/property-cleanout',
    },
  ];

  const processSteps = [
    {
      image: '/estimates (1).webp',
      alt: 'Customer snapping a photo for an estimate',
      label: 'Step One',
      titleStart: 'Snap. Send.',
      titleAccent: 'Done.',
      desc: 'A quick photo is all we need. Our AI reads the volume, the team confirms the price — instantly.',
    },
    {
      image: '/opek2.webp',
      alt: 'Upfront quote on-site',
      label: 'Step Two',
      titleStart: 'Lock in a',
      titleAccent: 'fixed price.',
      desc: `Crew arrives anywhere in ${city.metroArea}, confirms what's getting hauled, and gives you the final number on the spot. No upcharges.`,
    },
    {
      image: '/workers-opek.webp',
      alt: 'Professional junk removal team hauling items',
      label: 'Step Three',
      titleStart: 'We do',
      titleAccent: 'the lifting.',
      desc: `Loading, sweeping, hauling — all handled by your ${city.name} crew. You point, we clear. Same day in most cases.`,
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
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Residential Junk Removal in ${city.name}`, url: 'https://opekjunkremoval.com/services/residential' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Commercial Junk Removal in ${city.name}`, url: 'https://opekjunkremoval.com/services/commercial' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Property Cleanouts in ${city.name}`, url: 'https://opekjunkremoval.com/services/property-cleanout' } },
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
            style={{ backgroundImage: 'url(/junk-removal.webp)', backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties}
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
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 group">
                  <img
                    src="/junk-removal.webp"
                    alt={`Professional junk removal in ${city.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 text-white">
                      <CheckCircle2 size={18} className="text-brand" />
                      <span className="text-sm font-bold">Fully Insured • 70% Recycled • Same-Day Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES — mirrors homepage Services exactly ── */}
      <section id="services" className="py-16 md:py-24 lg:py-32 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="flex flex-col">
              <div className="mb-10">
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
              <div className="space-y-3">
                {serviceItems.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                      openService === index ? 'shadow-lg ring-2 ring-secondary' : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (openService === index) {
                          navigate(item.path);
                        } else {
                          setOpenService(index);
                        }
                      }}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                      aria-expanded={openService === index}
                    >
                      <div className="flex items-center gap-3.5">
                        <item.icon
                          size={22}
                          className={`transition-colors duration-300 shrink-0 ${
                            openService === index ? 'text-brand' : 'text-secondary'
                          }`}
                        />
                        <span className="font-bold text-base text-secondary">{item.title}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-all duration-300 shrink-0 ${
                          openService === index ? 'text-brand rotate-180' : 'text-secondary-300'
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        openService === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pl-9 text-secondary-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="sticky top-32">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src="/workers-opek.webp"
                    loading="lazy"
                    alt={`Professional junk removal team in ${city.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              No quote forms. No phone tag. Just photos, a fixed price, and a crew.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`group relative ${
                  index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
                }`}
              >
                <div className="relative aspect-[16/10] md:aspect-square overflow-hidden mb-5 shadow-md">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent pointer-events-none" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-3">
                  {step.titleStart} <span className="text-brand">{step.titleAccent}</span>
                </h3>
                <p className="text-secondary-500 text-sm md:text-[15px] leading-relaxed max-w-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA — mirrors homepage ServiceArea exactly ── */}
      <section id="service-area" className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden order-2 lg:order-1">
              <img
                src="/estimates (1).webp"
                loading="lazy"
                alt={`Junk removal service area in ${city.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 mb-3 rounded-full">
                  <MapPin size={13} className="text-brand" />
                  <span className="text-white text-xs font-black uppercase tracking-[0.15em]">Serving {city.metroArea}</span>
                </div>
                <p className="text-white text-lg md:text-xl font-black leading-tight tracking-tight">
                  Trusted professionals<br />in {city.name}.
                </p>
              </div>
            </div>
            <div className="flex flex-col order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Service Area</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight mb-5">
                Now serving<br /><span className="text-brand">{city.name}.</span>
              </h2>
              <p className="text-secondary-500 text-base md:text-lg leading-relaxed mb-8 max-w-md">
                {city.serviceAreaSubtext}
              </p>
              <button
                onClick={() => navigate('/quote')}
                className="self-start px-8 py-4 bg-secondary text-white font-bold text-xs uppercase tracking-wider hover:bg-brand transition-colors inline-flex items-center gap-2 shadow-md mb-10 rounded-lg"
              >
                Get a Free Quote <ArrowRight size={16} />
              </button>
              <div>
                <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-3">Neighborhoods we serve</p>
                <div className="flex flex-wrap gap-2">
                  {city.neighborhoods.map((n) => (
                    <span
                      key={n}
                      className="px-3 py-1.5 bg-secondary-50 text-secondary text-xs font-medium border border-secondary-100 hover:border-brand hover:text-brand transition-colors cursor-default rounded-full"
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
      <section className="py-14 md:py-20 bg-white border-t border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Internal: other city pages */}
            <div>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-4">Also Serving</p>
              <div className="space-y-2">
                {otherCities.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/locations/${c.slug}`}
                    className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-100 rounded-xl hover:border-brand hover:bg-brand/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={15} className="text-brand shrink-0" />
                      <div>
                        <p className="font-black text-sm text-secondary group-hover:text-brand transition-colors">{c.name}, {c.stateAbbr}</p>
                        <p className="text-xs text-secondary-400">{c.metroArea}</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-secondary-300 group-hover:text-brand transition-colors" />
                  </Link>
                ))}
                <Link
                  to="/#service-area"
                  className="flex items-center gap-2 p-4 rounded-xl border border-dashed border-secondary-200 hover:border-brand transition-colors text-secondary-400 hover:text-brand text-sm font-bold"
                >
                  <MapPin size={14} />
                  View all service areas
                </Link>
              </div>
            </div>

            {/* External: citations & trust links */}
            <div>
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-4">Resources & References</p>
              <div className="space-y-2">
                {city.externalCitations.map((cite) => (
                  <a
                    key={cite.href}
                    href={cite.href}
                    target="_blank"
                    rel={cite.rel}
                    className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-100 rounded-xl hover:border-brand hover:bg-brand/5 transition-all group"
                  >
                    <span className="font-medium text-sm text-secondary group-hover:text-brand transition-colors">{cite.label}</span>
                    <ExternalLink size={13} className="text-secondary-300 group-hover:text-brand transition-colors shrink-0" />
                  </a>
                ))}
                {/* Internal service links for topical authority */}
                <Link
                  to="/services/residential"
                  className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-100 rounded-xl hover:border-brand hover:bg-brand/5 transition-all group"
                >
                  <span className="font-medium text-sm text-secondary group-hover:text-brand transition-colors">Residential junk removal services</span>
                  <ArrowRight size={13} className="text-secondary-300 group-hover:text-brand transition-colors shrink-0" />
                </Link>
                <Link
                  to="/services/commercial"
                  className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-100 rounded-xl hover:border-brand hover:bg-brand/5 transition-all group"
                >
                  <span className="font-medium text-sm text-secondary group-hover:text-brand transition-colors">Commercial junk removal services</span>
                  <ArrowRight size={13} className="text-secondary-300 group-hover:text-brand transition-colors shrink-0" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24 lg:py-32 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight mb-4">
                Questions about <span className="text-brand">{city.name}.</span>
              </h2>
              <p className="text-secondary-500 text-lg leading-relaxed">
                Everything you need to know about junk removal in {city.metroArea}.
              </p>
            </div>
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
              <div className="space-y-3">
                {city.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                      openFaq === i ? 'shadow-lg ring-2 ring-secondary' : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span className="font-bold text-base text-secondary pr-4">{faq.question}</span>
                      <ChevronDown
                        size={18}
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
                        <p className="px-5 pb-5 pl-9 text-secondary-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
