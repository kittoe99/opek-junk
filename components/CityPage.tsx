import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from './SEO';
import { cities } from '../lib/cityData';
import type { CityData } from '../lib/cityData';
import { PageHero } from './shared/PageHero';
import { BentoFeatureSection } from './shared/BentoFeatureSection';
import { FaqSection, CityLocalSection, CityLinksSection } from './shared/CitySections';
import { TrustBadges } from './TrustBadges';
import { CharityBanner } from './CharityBanner';
import { WhatWeHaul } from './WhatWeHaul';
import { ProcessEditorial } from './ProcessEditorial';
import { QuickActionBar } from './QuickActionBar';
import {
  JunkIcon,
  DumpsterIcon,
  PropertyCleanoutIcon,
  MovingLaborIcon,
} from './icons/ServiceIcons';

interface CityPageProps {
  city: CityData;
}

export const CityPage: React.FC<CityPageProps> = ({ city }) => {
  const navigate = useNavigate();
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
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Dumpster Rental in ${city.name}`, url: 'https://opekjunkremoval.com/services/dumpster-rental' } },
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

  const serviceItems = [
    {
      label: 'Junk Removal',
      desc: city.services.junkRemoval,
      icon: JunkIcon,
      onClick: () => navigate('/services/junk-removal'),
    },
    {
      label: 'Dumpster Rental',
      desc: city.services.dumpsterRental,
      icon: DumpsterIcon,
      onClick: () => navigate('/services/dumpster-rental'),
    },
    {
      label: 'Property Cleanouts',
      desc: city.services.propertyCleanout,
      icon: PropertyCleanoutIcon,
      onClick: () => navigate('/services/property-cleanout'),
    },
    {
      label: 'Moving Labor',
      desc: city.services.movingLabor,
      icon: MovingLaborIcon,
      onClick: () => navigate('/services/moving-labor'),
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
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

      <nav aria-label="Breadcrumb" className="bg-secondary-50 border-b border-secondary-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
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

      <PageHero
        eyebrow={city.hero.badge}
        title={
          <>
            {city.hero.headlineStart}
            <br />
            <span className="text-brand">{city.hero.headlineAccent}</span>
          </>
        }
        subtitle={city.hero.subheadline}
        image="/opek2.webp"
        imageAlt={`Professional junk removal in ${city.name}`}
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      />

      <TrustBadges />
      <CharityBanner />

      <BentoFeatureSection
        eyebrow="Services"
        title={
          <>
            Fast pickup.
            <br />
            <span className="text-brand">Fair pricing.</span>
          </>
        }
        description={`Trusted professionals in ${city.name}. Transparent flat-rates, flexible schedules, and vetted local providers.`}
        items={serviceItems}
      />

      <WhatWeHaul />

      <ProcessEditorial
        steps={[
          {
            image: '/process-step-1.svg',
            alt: 'Instant junk removal quote',
            titleStart: 'quotes.',
            titleAccent: 'simplified.',
            desc: 'Get an instant, flat-rate junk removal quote online.',
          },
          {
            image: '/process-step-2.svg',
            alt: 'Upfront quote on-site',
            titleStart: 'Lock in a',
            titleAccent: 'fixed price.',
            desc: `Matched provider arrives anywhere in ${city.metroArea}, confirms volume, and gives you a locked-in flat quote. No upcharges.`,
          },
          {
            image: '/process-step-3.svg',
            alt: 'Professional junk removal provider team hauling items',
            titleStart: 'Providers handle',
            titleAccent: 'the lifting.',
            desc: `Loading, sweeping, hauling — all handled by your matched ${city.name} provider. You point, they clear. Same day in most cases.`,
          },
        ]}
      />

      <CityLocalSection
        cityName={city.name}
        metroArea={city.metroArea}
        serviceAreaSubtext={city.serviceAreaSubtext}
        neighborhoods={city.neighborhoods}
        onGetQuote={() => navigate('/quote')}
        onBookOnline={() => navigate('/booking')}
      />

      <CityLinksSection otherCities={otherCities} externalCitations={city.externalCitations} />

      <FaqSection
        title={
          <>
            Questions about <span className="text-brand">{city.name}.</span>
          </>
        }
        subtitle={`Everything you need to know about junk removal in ${city.metroArea}.`}
        faqs={city.faqs}
        schemaMarkup={faqSchema}
      />

      <QuickActionBar onBookOnline={() => navigate('/booking')} />
    </>
  );
};
