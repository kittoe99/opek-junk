import { ServicePageLayout } from './shared/ServicePageLayout';
import { Sofa, Refrigerator, Monitor, TreePine } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

      <ServicePageLayout
        path="/services/junk-removal"
        eyebrow={city.hero.badge || `Junk Removal in ${city.name}`}
        title={<>{city.hero.headlineStart}<br />{city.hero.headlineAccent}</>}
        subtitle={city.hero.subheadline}
        heroImage="/hero-backgrounds/opek-crew-high-five.png"
        heroImageAlt={`Local junk removal providers in ${city.name}`}
        heroChip={city.name}
        primaryCta={{ label: 'Get my price', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book a pickup', onClick: () => navigate('/booking') }}
        processTitle={`A few taps. A clear space in ${city.name}.`}
        split={{
          eyebrow: 'Almost anything goes', title: `Make room for more in ${city.name}`,
          body: <p>Serving {city.metroArea} with vetted local providers. From one unwanted couch to a whole property, get a crew that handles the heavy lifting.</p>,
          image: '/service-scenes/junk-truck.png', imageAlt: 'Purple dump truck loaded with household junk',
          includes: [{ title: 'Furniture & mattresses', Icon: Sofa }, { title: 'Appliances', Icon: Refrigerator }, { title: 'Electronics', Icon: Monitor }, { title: 'Yard waste', Icon: TreePine }],
        }}
        features={{ title: 'Your neighborhood. Your crew.', items: [
          { title: 'Furniture & bedroom sets', body: 'Sofas, tables, dressers, bed frames, mattresses, headboards and full bedroom cleanups.' },
          { title: 'Appliances & electronics', body: 'Fridges, washers, dryers, stoves, microwaves, TVs, computers, monitors, printers and e-waste.' },
          { title: 'Garages, sheds & yards', body: 'Tools, exercise gear, boxes, yard storage, branches, leaves, light soil and general yard debris.' },
          { title: 'An upfront price', body: `Your ${city.name} provider confirms the volume and price before work starts.` },
          { title: 'Local coverage', body: `Serving ${city.name} and surrounding neighborhoods with vetted, insured crews. Same-day options depend on local availability.` },
          { title: 'Thoughtful disposal', body: 'Sorting, donation when possible, and responsible disposal after every haul.' },
        ]}}
        serviceArea={{ titleStart: `Ready to clear out, ${city.name}?`, titleAccent: 'Find your local crew.' }}
      />
    </>
  );
};
