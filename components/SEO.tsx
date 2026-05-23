import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  geoLat?: number;
  geoLon?: number;
  cityName?: string;
  stateAbbr?: string;
  schema?: any;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, ogImage, breadcrumbs, geoLat, geoLon, cityName, stateAbbr, schema }) => {
  const location = useLocation();

  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute('content', description);
    }

    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', keywords);
    }

    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      let twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute('content', title);
    }

    if (description) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute('content', description);
      let twitterDescription = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescription) twitterDescription.setAttribute('content', description);
    }

    if (ogImage) {
      let ogImageTag = document.querySelector('meta[property="og:image"]');
      if (ogImageTag) ogImageTag.setAttribute('content', ogImage);
      let twitterImage = document.querySelector('meta[property="twitter:image"]');
      if (twitterImage) twitterImage.setAttribute('content', ogImage);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://opekjunkremoval.com${location.pathname}`);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://opekjunkremoval.com${location.pathname}`);
    let twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', `https://opekjunkremoval.com${location.pathname}`);

    // Geo meta tags for local SEO
    const setOrCreate = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (geoLat && geoLon) {
      setOrCreate('geo.position', `${geoLat};${geoLon}`);
      setOrCreate('ICBM', `${geoLat}, ${geoLon}`);
    } else {
      // Reset to country-level on non-city pages
      setOrCreate('geo.position', '');
      setOrCreate('ICBM', '');
    }

    if (cityName && stateAbbr) {
      setOrCreate('geo.placename', `${cityName}, ${stateAbbr}`);
      setOrCreate('geo.region', `US-${stateAbbr}`);
    } else {
      setOrCreate('geo.placename', 'United States');
      setOrCreate('geo.region', 'US');
    }

    // BreadcrumbList schema — inject/replace dynamic script tag
    const BREADCRUMB_ID = 'schema-breadcrumb';
    let existing = document.getElementById(BREADCRUMB_ID);
    if (existing) existing.remove();

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: `https://opekjunkremoval.com${b.href}`,
        })),
      };
      const script = document.createElement('script');
      script.id = BREADCRUMB_ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(script);
    }

    // Custom Schema injection
    const CUSTOM_SCHEMA_ID = 'schema-custom';
    let existingCustom = document.getElementById(CUSTOM_SCHEMA_ID);
    if (existingCustom) existingCustom.remove();

    if (schema) {
      const script = document.createElement('script');
      script.id = CUSTOM_SCHEMA_ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogImage, breadcrumbs, geoLat, geoLon, cityName, stateAbbr, schema, location.pathname]);

  return null;
};

// SEO configurations for different pages
export const seoConfig = {
  home: {
    title: 'Opek Junk Removal | Nationwide Service in All 50 States',
    description: 'Nationwide junk removal, donations pickup, and moving labor. Available in all 50 states with same-day service, upfront flat-rate pricing, and vetted local providers.',
    keywords: 'nationwide junk removal, junk removal near me, junk hauling, trash removal, furniture removal, appliance removal, same-day junk removal, eco-friendly disposal, all 50 states',
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "name": "Opek Junk Removal",
          "url": "https://opekjunkremoval.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://opekjunkremoval.com/track-order?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "SiteNavigationElement",
          "name": "How It Works",
          "url": "https://opekjunkremoval.com/#process"
        },
        {
          "@type": "SiteNavigationElement",
          "name": "Services",
          "url": "https://opekjunkremoval.com/#services"
        },
        {
          "@type": "SiteNavigationElement",
          "name": "Locations",
          "url": "https://opekjunkremoval.com/#service-area"
        },
        {
          "@type": "SiteNavigationElement",
          "name": "Become a Provider",
          "url": "https://opekjunkremoval.com/provider-signup"
        }
      ]
    }
  },
  quote: {
    title: 'Free Junk Removal Quote | Opek — Nationwide Instant Pricing',
    description: 'Get an instant free quote for junk removal anywhere in the US. Transparent flat-rate pricing, no hidden fees. Same-day service in all 50 states.',
    keywords: 'junk removal quote, free estimate, nationwide junk removal pricing, instant quote, junk hauling cost, junk removal near me',
  },
  contact: {
    title: 'Contact Opek - Opek Junk Removal | Customer Support',
    description: 'Contact Opek Junk Removal for questions, support, or to schedule a pickup. Available 7 days a week. Call (831) 318-7139 or email Support@opekjunkremoval.com',
    keywords: 'contact junk removal, customer support, junk removal help, schedule pickup',
  },
  booking: {
    title: 'Book Junk Removal Online | Opek — Nationwide Same-Day Pickup',
    description: 'Book junk removal online in minutes anywhere in the US. Pick your date, time, and service. Same-day and next-day appointments in all 50 states.',
    keywords: 'book junk removal, schedule pickup, online booking, junk removal appointment, nationwide junk removal',
  },
  junkRemoval: {
    title: 'Junk Removal Services | Opek — Nationwide Home & Business Hauling',
    description: 'Nationwide residential and commercial junk removal in all 50 states. Furniture, appliances, office cleanouts, and retail clearing. Same-day available, upfront pricing, and vetted providers.',
    keywords: 'junk removal, residential junk removal, commercial junk removal, furniture removal, appliance removal, office cleanout, junk hauling, same-day junk removal',
  },
  dumpsterRental: {
    title: 'Dumpster Rental Services | Opek — Nationwide Roll-Off Containers',
    description: 'Roll-off dumpster rentals in all 50 states. Multiple sizes (10, 15, 20, 30 yards) available with flat-rate pricing, protective placement, and flexible rentals.',
    keywords: 'dumpster rental, roll-off dumpster, rent a dumpster, commercial dumpster rental, construction dumpster, residential dumpster',
  },
  propertyCleanout: {
    title: 'Property Cleanout | Opek — Nationwide Estate & Move-Out Service',
    description: 'Full property cleanout services nationwide. Estate clearing, move-outs, and hoarding cleanups across all 50 states. Professional, discreet, compassionate.',
    keywords: 'property cleanout, nationwide estate cleanout, move-out service, hoarding cleanup, full house cleanout',
  },
  providerSignup: {
    title: 'Become a Provider - Opek Junk Removal | Partner With Opek',
    description: 'Join the Opek network of trusted junk removal providers. Grow your business with qualified leads and nationwide exposure.',
    keywords: 'junk removal provider, partner program, junk removal business, provider signup',
  },
};
