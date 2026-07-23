import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from './SEO';
import type { CityData } from '../lib/cityData';
import { PageHero } from './shared/PageHero';
import { CharityBanner } from './CharityBanner';
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
    address: { '@type': 'PostalAddress', addressLocality: city.name, addressRegion: city.stateAbbr, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: city.geoCoords.lat, longitude: city.geoCoords.lon },
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

      <section className="py-16 md:py-24" style={{
        background: 'linear-gradient(160deg, #dff3ea 0%, #eef3f9 42%, #e8e4f2 100%)',
      }}>
        <div className="max-w-[52rem] mx-auto px-5 sm:px-6 lg:px-8">
          <header className="text-center mb-10">
            <p className="text-sm font-medium text-secondary-500 mb-2 tracking-wide">
              What we haul
            </p>
            <h2 className="text-[1.625rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-secondary tracking-tight leading-tight">
              Almost <span className="text-brand">anything goes.</span>
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
                className="flex items-center gap-3 rounded-2xl bg-white px-5 py-[1.125rem] md:px-6 md:py-5 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(53,80,112,0.05)]"
              >
                <div>
                  <p className="font-bold text-[15px] md:text-base text-secondary leading-snug">{item.label}</p>
                  <p className="text-[13px] text-secondary-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-secondary text-center tracking-tight mb-14 md:mb-16">
            From clutter to <span className="text-brand">clear</span>
            <br className="hidden md:block" /> in three moves.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            {[
              { number: '1', title: 'Choose a service', desc: 'Tell us when, where, and what you need hauled — from a single item to a full property cleanout.', image: '/process-step-1.svg', alt: 'Choose a service' },
              { number: '2', title: 'Get an upfront price', desc: `Matched provider arrives anywhere in ${city.metroArea}, confirms volume, and gives you a locked-in flat quote. No upcharges.`, image: '/process-step-2.svg', alt: 'Get upfront price' },
              { number: '3', title: 'Sit back & relax', desc: `Loading, sweeping, hauling — all handled by your matched ${city.name} provider. You point, they clear. Same day in most cases.`, image: '/process-step-3.svg', alt: 'Providers handle the lifting' },
            ].map((step) => (
              <div key={step.number} className="flex flex-col max-w-sm mx-auto md:max-w-none md:mx-0">
                <div className="relative w-36 h-36 md:w-40 md:h-40 mx-auto mb-6 rounded-full border-2 border-secondary/90 flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f0f4f2 45%, #e8eeeb 100%)',
                    boxShadow: 'inset 0 0 24px rgba(53, 80, 112, 0.06)',
                  }}
                >
                  <img src={step.image} alt={step.alt} className="w-[72%] h-[72%] object-contain" loading="lazy" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-secondary mb-3 text-left">{step.number}. {step.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed text-left">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <CharityBanner />
    </>
  );
};
