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
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, ogImage, breadcrumbs, geoLat, geoLon, cityName, stateAbbr }) => {
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
      const schema = {
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
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogImage, breadcrumbs, geoLat, geoLon, cityName, stateAbbr, location.pathname]);

  return null;
};

// SEO configurations for different pages
export const seoConfig = {
  home: {
    title: 'Opek Junk Removal - Professional Junk Removal Services Nationwide | Same-Day Pickup',
    description: 'Professional junk removal services across the US. Get instant quotes, same-day pickup, and eco-friendly disposal. Residential, commercial, construction debris, e-waste, and more. Trusted local providers nationwide.',
    keywords: 'junk removal, junk hauling, trash removal, furniture removal, appliance removal, same-day junk removal, eco-friendly disposal',
  },
  quote: {
    title: 'Get a Free Quote - Opek Junk Removal | Instant Pricing',
    description: 'Get an instant free quote for junk removal services. Fast, transparent pricing with no hidden fees. Same-day service available across the US.',
    keywords: 'junk removal quote, free estimate, junk removal pricing, instant quote, junk hauling cost',
  },
  contact: {
    title: 'Contact Us - Opek Junk Removal | Customer Support',
    description: 'Contact Opek Junk Removal for questions, support, or to schedule a pickup. Available 7 days a week. Call (831) 318-7139 or email Support@opekjunkremoval.com',
    keywords: 'contact junk removal, customer support, junk removal help, schedule pickup',
  },
  booking: {
    title: 'Book Online - Opek Junk Removal | Schedule Your Pickup',
    description: 'Book your junk removal service online in minutes. Choose your date, time, and service type. Same-day and next-day appointments available.',
    keywords: 'book junk removal, schedule pickup, online booking, junk removal appointment',
  },
  residential: {
    title: 'Residential Junk Removal Services | Opek - Home Cleanouts & Decluttering',
    description: 'Professional residential junk removal services. Furniture, appliances, electronics, and household clutter removal. Same-day service available. Eco-friendly disposal.',
    keywords: 'residential junk removal, home junk removal, furniture removal, appliance removal, household cleanout',
  },
  commercial: {
    title: 'Commercial Junk Removal Services | Opek - Office & Business Hauling',
    description: 'Commercial junk removal for offices, retail spaces, and businesses. Office furniture, equipment, and commercial debris removal with minimal disruption.',
    keywords: 'commercial junk removal, office junk removal, business hauling, office furniture removal, commercial debris',
  },
  propertyCleanout: {
    title: 'Property Cleanout Services | Opek - Estate Clearing & Move-Outs',
    description: 'Full property cleanout services for estates, move-outs, and hoarding situations. Professional, discreet, and compassionate service.',
    keywords: 'property cleanout, estate cleanout, move-out service, hoarding cleanup, full house cleanout',
  },
  providerSignup: {
    title: 'Become a Provider - Opek Junk Removal | Partner With Us',
    description: 'Join the Opek network of trusted junk removal providers. Grow your business with qualified leads and nationwide exposure.',
    keywords: 'junk removal provider, partner program, junk removal business, provider signup',
  },
};
