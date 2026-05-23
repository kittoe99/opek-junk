export interface CityData {
  slug: string;
  name: string;
  state: string;
  stateAbbr: string;
  metroArea: string;
  geoCoords: { lat: number; lon: number };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    badge: string;
    headlineStart: string;
    headlineAccent: string;
    subheadline: string;
  };
  services: {
    junkRemoval: string;
    dumpsterRental: string;
    propertyCleanout: string;
    donationsPickup: string;
    movingLabor: string;
  };
  serviceAreaSubtext: string;
  neighborhoods: string[];
  faqs: { question: string; answer: string }[];
  externalCitations: { label: string; href: string; rel: string }[];
}

export const cities: CityData[] = [
  {
    slug: "dallas-fort-worth",
    name: "Dallas-Fort Worth",
    state: "Texas",
    stateAbbr: "TX",
    metroArea: "DFW Metroplex",
    geoCoords: { lat: 32.7767, lon: -96.797 },
    seo: {
      title: "Junk Removal Dallas-Fort Worth | Same-Day Pickup | Opek",
      description:
        "Professional junk removal services in Dallas, Fort Worth, Arlington, Plano, and across the DFW Metroplex. Flat-rate pricing, eco-friendly disposal, and vetted local crews.",
      keywords:
        "junk removal Dallas, junk removal Fort Worth, DFW junk hauling, same-day trash pickup Dallas, furniture removal Arlington, dumpster rental Plano",
    },
    hero: {
      badge: "Now Serving DFW Metroplex",
      headlineStart: "Junk gone.",
      headlineAccent: "Dallas.",
      subheadline:
        "Professional junk removal across the entire DFW Metroplex. Get instant quotes and same-day service from trusted local crews.",
    },
    services: {
      junkRemoval:
        "Furniture, appliances, household clutter, office furniture, equipment, and commercial debris hauled fast by insured DFW partner crews.",
      dumpsterRental:
        "Roll-off dumpster rentals in various sizes delivered directly to your home, job site, or business in the DFW Metroplex.",
      propertyCleanout:
        "Estate clearing, move-outs, and full property cleanouts throughout the Metroplex. Professional, thorough, and discreet.",
      donationsPickup:
        "Gently used furniture, appliances, and clothing picked up and delivered to local charities across the DFW Metroplex.",
      movingLabor:
        "Hourly labor for heavy lifting, loading, and unloading. Vetted crews provide the muscle, you provide the truck.",
    },
    serviceAreaSubtext:
        "Service is live across the DFW Metroplex and expanding fast. Check if a local ZIP is served and get a free quote today.",
    neighborhoods: [
      "Dallas", "Fort Worth", "Plano", "Arlington", "Irving",
      "Garland", "Frisco", "McKinney", "Mesquite", "Grand Prairie",
      "Carrollton", "Denton",
    ],
    externalCitations: [
      { label: "Dallas city government", href: "https://dallascityhall.com", rel: "noopener noreferrer" },
      { label: "Fort Worth city government", href: "https://fortworthtexas.gov", rel: "noopener noreferrer" },
      { label: "BBB Dallas", href: "https://www.bbb.org/us/tx/dallas", rel: "noopener noreferrer" },
      { label: "EPA Sustainable Materials", href: "https://www.epa.gov/smm", rel: "noopener noreferrer" },
    ],
    faqs: [
      {
        question: "Is all of the DFW Metroplex served?",
        answer:
          "Yes. Partner crews cover Dallas, Fort Worth, and surrounding cities including Plano, Arlington, Irving, Frisco, McKinney, and more. If you're unsure, use the ZIP check to confirm.",
      },
      {
        question: "How quickly can a pickup be scheduled in Dallas-Fort Worth?",
        answer:
          "Same-day appointments are available most days. Book online or call and a crew will be dispatched as fast as possible.",
      },
      {
        question: "What items can be removed in the DFW area?",
        answer:
          "Furniture, appliances, electronics, yard waste, construction debris, hot tubs, mattresses, office equipment — if you can point to it, the crews will haul it.",
      },
      {
        question: "How is pricing determined?",
        answer:
          "Pricing is based on the volume your items take up in the truck. Send a photo for an instant estimate, or receive a firm quote on arrival before work starts.",
      },
    ],
  },
  {
    slug: "jacksonville",
    name: "Jacksonville",
    state: "Florida",
    stateAbbr: "FL",
    metroArea: "Jacksonville Metro",
    geoCoords: { lat: 30.3322, lon: -81.6557 },
    seo: {
      title: "Junk Removal Jacksonville, FL | Same-Day Pickup | Opek",
      description:
        "Top-rated junk removal in Jacksonville, FL. Same-day service, fair upfront pricing, and eco-friendly hauling. Serving Jacksonville Beach, Southside, Mandarin, and all Jacksonville neighborhoods.",
      keywords:
        "junk removal Jacksonville FL, furniture removal Jacksonville, same-day junk removal Jacksonville, appliance removal Jacksonville, trash hauling Jacksonville Florida, junk pickup Duval County",
    },
    hero: {
      badge: "Now Serving Jacksonville, FL",
      headlineStart: "Junk gone.",
      headlineAccent: "Jacksonville.",
      subheadline:
        "Professional junk removal across Duval County. Get instant quotes and same-day service from trusted local crews.",
    },
    services: {
      junkRemoval:
        "Furniture, appliances, household clutter, office furniture, equipment, and commercial debris removed fast by insured Jacksonville partner crews.",
      dumpsterRental:
        "Flexible, flat-rate dumpster rentals delivered to your driveway or commercial site anywhere in Jacksonville.",
      propertyCleanout:
        "Estate clearing, move-outs, and full property cleanouts throughout Jacksonville and Duval County. Professional, thorough, and discreet.",
      donationsPickup:
        "Gently used furniture, appliances, and clothing picked up and delivered to local charities across Jacksonville.",
      movingLabor:
        "Hourly labor for heavy lifting, loading, and unloading. Vetted crews provide the muscle, you provide the truck.",
    },
    serviceAreaSubtext:
        "Service is live across Jacksonville and expanding fast. Check if a local ZIP is served and get a free quote today.",
    neighborhoods: [
      "Downtown Jacksonville", "Riverside", "Avondale", "Southside",
      "Mandarin", "Jacksonville Beach", "Neptune Beach", "Ponte Vedra",
      "Orange Park", "Fleming Island", "Northside", "Arlington",
    ],
    externalCitations: [
      { label: "City of Jacksonville", href: "https://www.coj.net", rel: "noopener noreferrer" },
      { label: "BBB Jacksonville", href: "https://www.bbb.org/us/fl/jacksonville", rel: "noopener noreferrer" },
      { label: "EPA Sustainable Materials", href: "https://www.epa.gov/smm", rel: "noopener noreferrer" },
      { label: "Florida DEP Recycling", href: "https://floridadep.gov/waste/waste-reduction", rel: "noopener noreferrer" },
    ],
    faqs: [
      {
        question: "Are all Jacksonville neighborhoods covered?",
        answer:
          "Yes — service covers the entire city of Jacksonville including the beaches, Southside, Mandarin, Riverside, and surrounding Duval County areas.",
      },
      {
        question: "Is same-day junk removal available in Jacksonville?",
        answer:
          "Absolutely. Same-day slots fill up fast, so book early or call in the morning for the best availability.",
      },
      {
        question: "Is yard debris and outdoor furniture hauled in Jacksonville?",
        answer:
          "Yes. Patio furniture, swing sets, yard waste, sheds, and hot tubs are all fair game. Vetted crews handle heavy lifting so you don't have to.",
      },
      {
        question: "What does junk removal cost in Jacksonville?",
        answer:
          "Pricing is volume-based and transparent. Send a photo for an instant estimate, or get a firm on-site quote before any lifting begins.",
      },
    ],
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "Georgia",
    stateAbbr: "GA",
    metroArea: "Metro Atlanta",
    geoCoords: { lat: 33.7490, lon: -84.3880 },
    seo: {
      title: "Junk Removal Atlanta, GA | Same-Day Pickup | Opek",
      description:
        "Professional junk removal in Atlanta, GA. Same-day service, transparent pricing, and eco-friendly disposal. Serving Buckhead, Midtown, Decatur, Sandy Springs, and the entire Metro Atlanta area.",
      keywords:
        "junk removal Atlanta GA, furniture removal Atlanta, same-day junk removal Atlanta, appliance removal Atlanta, trash hauling Atlanta Georgia, junk pickup Buckhead, junk removal Decatur",
    },
    hero: {
      badge: "Now Serving Metro Atlanta",
      headlineStart: "Junk gone.",
      headlineAccent: "Atlanta.",
      subheadline:
        "Professional junk removal across Metro Atlanta. Get instant quotes and same-day service from trusted local crews.",
    },
    services: {
      junkRemoval:
        "Furniture, appliances, household clutter, office furniture, equipment, and commercial debris hauled fast by insured Atlanta partner crews.",
      dumpsterRental:
        "Convenient roll-off dumpsters for residential cleanups and construction sites across the Atlanta metropolitan area.",
      propertyCleanout:
        "Estate clearing, move-outs, and full property cleanouts throughout Atlanta and surrounding metro areas. Professional, thorough, and discreet.",
      donationsPickup:
        "Gently used furniture, appliances, and clothing picked up and delivered to local charities across Metro Atlanta.",
      movingLabor:
        "Hourly labor for heavy lifting, loading, and unloading. Vetted crews provide the muscle, you provide the truck.",
    },
    serviceAreaSubtext:
        "Service is live across Metro Atlanta and expanding fast. Check if a local ZIP is served and get a free quote today.",
    neighborhoods: [
      "Buckhead", "Midtown", "Old Fourth Ward", "Decatur",
      "Sandy Springs", "Marietta", "Alpharetta", "Smyrna",
      "East Atlanta", "Grant Park", "Peachtree City", "Dunwoody",
    ],
    externalCitations: [
      { label: "City of Atlanta", href: "https://www.atlantaga.gov", rel: "noopener noreferrer" },
      { label: "BBB Atlanta", href: "https://www.bbb.org/us/ga/atlanta", rel: "noopener noreferrer" },
      { label: "EPA Sustainable Materials", href: "https://www.epa.gov/smm", rel: "noopener noreferrer" },
      { label: "Georgia DNR Recycling", href: "https://epd.georgia.gov/waste-management", rel: "noopener noreferrer" },
    ],
    faqs: [
      {
        question: "What areas of Atlanta are served?",
        answer:
          "Service covers all of Metro Atlanta — Buckhead, Midtown, Decatur, Sandy Springs, Marietta, Alpharetta, and everywhere in between. Enter your ZIP to confirm.",
      },
      {
        question: "How fast can a pickup occur in Atlanta?",
        answer:
          "Same-day service is available most days across Metro Atlanta. Book online before noon for the best chance at a same-day slot.",
      },
      {
        question: "Are items recycled or donated in Atlanta?",
        answer:
          "Yes. Local providers partner with Atlanta donation centers and recycling facilities to divert as much as possible from landfills on every job.",
      },
      {
        question: "How do I get a quote for junk removal in Atlanta?",
        answer:
          "Snap a photo of what needs to go and send it via the quote form for an instant estimate, or receive pricing on-site with no obligation.",
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}
