import { ServicePageLayout } from './shared/ServicePageLayout';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SEO } from './SEO';
import type { CityData } from '../lib/cityData';

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
    telephone: '+18777574365',
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

      <ServicePageLayout
        path="/services/junk-removal"
        eyebrow={city.hero.badge || `Junk Removal in ${city.name}`}
        title={<>{city.hero.headlineStart}<br />{city.hero.headlineAccent}</>}
        subtitle={city.hero.subheadline}
        heroImage="/optimized/service-scenes/local-movers-card-v5.webp"
        heroImageAlt={`Local junk removal providers in ${city.name}`}
        heroChip={city.name}
        primaryCta={{ label: 'Get my price', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book a pickup', onClick: () => navigate('/booking') }}
        processTitle={`A few taps. A clear space in ${city.name}.`}
        content={{
          title: `Junk removal in ${city.name}, ${city.stateAbbr}`,
          body: (
            <>
              <p>
                Opek connects customers in {city.metroArea} with vetted local providers for furniture removal, appliance removal,
                electronics and yard waste. Your {city.name} provider confirms the volume and price before work starts.
                Same-day options depend on local availability.
              </p>
              <p>
                <Link to="/quote">Get your price</Link> or <Link to="/booking">book a pickup</Link>. Also available:{' '}
                <Link to="/services/dumpster-rental">dumpster rental</Link> and{' '}
                <Link to="/services/property-cleanout">property cleanouts</Link>.
              </p>
            </>
          ),
        }}
        serviceArea={{ titleStart: `Ready to clear out, ${city.name}?`, titleAccent: 'Find your local crew.' }}
      />
    </>
  );
};
