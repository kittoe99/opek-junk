import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, ogImage }) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }

    // Update meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // Update OG tags
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', title);
      }
      let twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', title);
      }
    }

    if (description) {
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
      let twitterDescription = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
      }
    }

    if (ogImage) {
      let ogImageTag = document.querySelector('meta[property="og:image"]');
      if (ogImageTag) {
        ogImageTag.setAttribute('content', ogImage);
      }
      let twitterImage = document.querySelector('meta[property="twitter:image"]');
      if (twitterImage) {
        twitterImage.setAttribute('content', ogImage);
      }
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://opekjunk.com${location.pathname}`);
    }

    // Update OG URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://opekjunk.com${location.pathname}`);
    }
    let twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', `https://opekjunk.com${location.pathname}`);
    }
  }, [title, description, keywords, ogImage, location.pathname]);

  return null;
};

// SEO configurations for different pages
export const seoConfig = {
  home: {
    title: 'OPEK Junk Removal - Professional Junk Removal Services Nationwide | Same-Day Pickup',
    description: 'Professional junk removal services across the US. Get instant quotes, same-day pickup, and eco-friendly disposal. Residential, commercial, construction debris, e-waste, and more. Trusted local providers nationwide.',
    keywords: 'junk removal, junk hauling, trash removal, furniture removal, appliance removal, same-day junk removal, eco-friendly disposal',
  },
  quote: {
    title: 'Get a Free Quote - OPEK Junk Removal | Instant Pricing',
    description: 'Get an instant free quote for junk removal services. Fast, transparent pricing with no hidden fees. Same-day service available across the US.',
    keywords: 'junk removal quote, free estimate, junk removal pricing, instant quote, junk hauling cost',
  },
  contact: {
    title: 'Contact Us - OPEK Junk Removal | Customer Support',
    description: 'Contact OPEK Junk Removal for questions, support, or to schedule a pickup. Available 7 days a week. Call (303) 555-0199 or email hello@opekjunk.com',
    keywords: 'contact junk removal, customer support, junk removal help, schedule pickup',
  },
  booking: {
    title: 'Book Online - OPEK Junk Removal | Schedule Your Pickup',
    description: 'Book your junk removal service online in minutes. Choose your date, time, and service type. Same-day and next-day appointments available.',
    keywords: 'book junk removal, schedule pickup, online booking, junk removal appointment',
  },
  residential: {
    title: 'Residential Junk Removal Services | OPEK - Home Cleanouts & Decluttering',
    description: 'Professional residential junk removal services. Furniture, appliances, electronics, and household clutter removal. Same-day service available. Eco-friendly disposal.',
    keywords: 'residential junk removal, home junk removal, furniture removal, appliance removal, household cleanout',
  },
  commercial: {
    title: 'Commercial Junk Removal Services | OPEK - Office & Business Hauling',
    description: 'Commercial junk removal for offices, retail spaces, and businesses. Office furniture, equipment, and commercial debris removal with minimal disruption.',
    keywords: 'commercial junk removal, office junk removal, business hauling, office furniture removal, commercial debris',
  },
  construction: {
    title: 'Construction Debris Removal | OPEK - Post-Construction Cleanup',
    description: 'Professional construction debris removal services. Drywall, wood, tile, flooring, and metal scraps. One-time or recurring service for contractors and builders.',
    keywords: 'construction debris removal, construction cleanup, drywall removal, contractor junk removal, building debris',
  },
  ewaste: {
    title: 'E-Waste Recycling & Appliance Removal | OPEK - Eco-Friendly Disposal',
    description: 'Responsible e-waste recycling and appliance removal. Electronics, monitors, refrigerators, stoves, and more. EPA-compliant disposal and recycling.',
    keywords: 'e-waste recycling, electronics disposal, appliance removal, refrigerator removal, eco-friendly recycling',
  },
  propertyCleanout: {
    title: 'Property Cleanout Services | OPEK - Estate Clearing & Move-Outs',
    description: 'Full property cleanout services for estates, move-outs, and hoarding situations. Professional, discreet, and compassionate service.',
    keywords: 'property cleanout, estate cleanout, move-out service, hoarding cleanup, full house cleanout',
  },
  dumpsterRental: {
    title: 'Dumpster Rental Services | OPEK - Multiple Sizes for Any Project',
    description: 'Dumpster rental services with multiple sizes available. Flexible rental periods, fast delivery and pickup. Perfect for home renovations, cleanouts, and construction projects.',
    keywords: 'dumpster rental, roll-off dumpster, construction dumpster, residential dumpster, waste container rental',
  },
  providerSignup: {
    title: 'Become a Provider - OPEK Junk Removal | Partner With Us',
    description: 'Join the OPEK network of trusted junk removal providers. Grow your business with qualified leads and nationwide exposure.',
    keywords: 'junk removal provider, partner program, junk removal business, provider signup',
  },
};
