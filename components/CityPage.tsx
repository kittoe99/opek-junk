import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';
import type { CityData } from '../lib/cityData';
import { ServicePageHero } from './shared/ServicePageHero';
import { ServiceFeatureGrid } from './shared/ServiceFeatureGrid';
import { HustleMuscle } from './HustleMuscle';
import { RelatedServices } from './RelatedServices';
import { ServiceArea } from './ServiceArea';
import { Testimonials } from './Testimonials';

interface CityPageProps {
  city: CityData;
}

export const CityPage: React.FC<CityPageProps> = ({ city }) => {
  const navigate = useNavigate();
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Opek Junk Removal - ${city.name}, ${city.stateAbbr}`,
    description: city.seo.description,
    url: `https://opekjunkremoval.com/locations/${city.slug}`,
    telephone: '+18313187139',
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
    openingHours: 'Mo-Su 07:00-20:00',
    priceRange: '$$',
  };

  return (
    <>
      <SEO
        title={city.seo.title}
        description={city.seo.description}
        keywords={city.seo.keywords}
        geoLat={city.geoCoords.lat}
        geoLon={city.geoCoords.lon}
        cityName={city.name}
        stateAbbr={city.stateAbbr}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="home-dark min-h-screen">
        <ServicePageHero
          eyebrow={city.hero.badge || `Junk Removal in ${city.name}`}
          title={
            <>
              {city.hero.headlineStart}
              <br />
              {city.hero.headlineAccent}
            </>
          }
          subtitle={city.hero.subheadline}
          image="/opek-hero-haulers.png?v=3"
          imageAlt={`Professional junk removal in ${city.name}`}
          chip={city.name}
          primaryCta={{ label: 'Get Online Price', onClick: () => navigate('/quote') }}
          secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
        />

        <section className="relative py-14 sm:py-16 md:py-20 bg-[var(--bg-alt)] border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 sm:mb-10 max-w-xl">
              <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">What we haul</p>
              <h2 className="font-sans font-extrabold text-[1.7rem] sm:text-[2.2rem] md:text-[2.4rem] text-[var(--text)] tracking-tight leading-[1.1]">
                Almost anything goes in {city.name}
              </h2>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
              {[
                { label: 'Furniture', desc: 'Sofas, tables, dressers, bed frames, mattresses' },
                { label: 'Appliances', desc: 'Fridges, washers, dryers, stoves, microwaves' },
                { label: 'Electronics', desc: 'TVs, computers, monitors, printers, e-waste' },
                { label: 'Bedroom Sets', desc: 'Frames, headboards, dressers, full bedroom cleanups' },
                { label: 'Garage & Sheds', desc: 'Tools, exercise gear, boxes, general yard storage' },
                { label: 'Yard Waste', desc: 'Branches, leaves, light soil, general yard debris' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/[0.08] bg-[var(--surface)] px-5 py-[1.125rem] md:px-6 md:py-5"
                >
                  <p className="font-bold text-[15px] md:text-base text-[var(--text)] leading-snug">
                    {item.label}
                  </p>
                  <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HustleMuscle />

        <ServiceFeatureGrid
          title={`Junk removal in ${city.name}`}
          items={[
            {
              title: 'Choose a service',
              body: 'Tell us when, where, and what you need hauled — from a single item to a full property cleanout.',
            },
            {
              title: 'Get an upfront price',
              body: `Matched providers arrive anywhere in ${city.metroArea}, confirm volume, and lock in a flat quote.`,
            },
            {
              title: 'Sit back & relax',
              body: `Loading, sweeping, hauling — handled by your matched ${city.name} provider. Same day in most cases.`,
            },
            {
              title: 'Local coverage',
              body: `Serving ${city.name} and surrounding neighborhoods with vetted, insured crews.`,
            },
            {
              title: 'Easy booking',
              body: 'Book online in minutes with transparent pricing and flexible scheduling.',
            },
            {
              title: 'Thoughtful disposal',
              body: 'Sorting, donation when possible, and responsible disposal after every haul.',
            },
          ]}
        />

        <RelatedServices excludePath="/services/junk-removal" />

        <ServiceArea
          titleStart={`Junk removal in ${city.name}.`}
          titleAccent="Book a pickup today."
          theme="dark"
        />

        <Testimonials theme="dark" />
      </div>
    </>
  );
};
