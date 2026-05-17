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
    residential: string;
    commercial: string;
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
    geoCoords: { lat: 32.7767, lon: -96.7970 },
    seo: {
      title: "Junk Removal Dallas-Fort Worth, TX | Same-Day Pickup | Opek",
      description:
        "Professional junk removal in Dallas-Fort Worth, TX. Same-day pickup, upfront pricing, and eco-friendly disposal. Serving Dallas, Fort Worth, Plano, Arlington & the entire DFW Metroplex.",
      keywords:
        "junk removal Dallas, junk removal Fort Worth, junk removal DFW, furniture removal Dallas TX, same-day junk removal Dallas, appliance removal Fort Worth, trash hauling Dallas",
    },
    hero: {
      badge: "Now Serving DFW",
      headlineStart: "Junk gone.",
      headlineAccent: "Dallas.",
      subheadline:
        "Professional junk removal across the entire DFW Metroplex. Get instant quotes and same-day service from trusted local crews.",
    },
    services: {
      residential:
        "Furniture, appliances, electronics, and household clutter hauled fast. Affordable pickup by insured DFW crews — same day in most cases.",
      commercial:
        "Office furniture, equipment, and commercial debris cleared across Dallas and Fort Worth with minimal disruption to your operations.",
      propertyCleanout:
        "Estate clearing, move-outs, and full property cleanouts throughout the Metroplex. Professional, thorough, and discreet.",
      donationsPickup:
        "Gently used furniture, appliances, and clothing picked up and delivered to local charities across the DFW Metroplex.",
      movingLabor:
        "Hourly labor for heavy lifting, loading, and unloading. We provide the muscle, you provide the truck.",
    },
    serviceAreaSubtext:
        "We're live across the DFW Metroplex and expanding fast. Check if we serve your ZIP and get a free quote today.",
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
        question: "Do you serve all of the DFW Metroplex?",
        answer:
          "Yes. We cover Dallas, Fort Worth, and surrounding cities including Plano, Arlington, Irving, Frisco, McKinney, and more. If you're unsure, use our ZIP check to confirm.",
      },
      {
        question: "How quickly can you pick up in Dallas-Fort Worth?",
        answer:
          "Same-day appointments are available most days. Book online or call and we'll get a crew to you as fast as possible.",
      },
      {
        question: "What items do you remove in the DFW area?",
        answer:
          "Furniture, appliances, electronics, yard waste, construction debris, hot tubs, mattresses, office equipment — if you can point to it, we'll haul it.",
      },
      {
        question: "How is pricing determined?",
        answer:
          "Pricing is based on the volume your items take up in our truck. Send us a photo for an instant estimate, or we'll give you a firm quote on arrival before we start.",
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
      residential:
        "Furniture, appliances, electronics, and household clutter removed fast. Affordable pickup by insured Jacksonville crews — same day in most cases.",
      commercial:
        "Office furniture, equipment, and commercial debris cleared across Jacksonville with minimal disruption to your business.",
      propertyCleanout:
        "Estate clearing, move-outs, and full property cleanouts throughout Jacksonville and Duval County. Professional, thorough, and discreet.",
      donationsPickup:
        "Gently used furniture, appliances, and clothing picked up and delivered to local charities across Jacksonville.",
      movingLabor:
        "Hourly labor for heavy lifting, loading, and unloading. We provide the muscle, you provide the truck.",
    },
    serviceAreaSubtext:
        "We're live across Jacksonville and expanding fast. Check if we serve your ZIP and get a free quote today.",
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
        question: "Do you cover all Jacksonville neighborhoods?",
        answer:
          "Yes — we serve the entire city of Jacksonville including the beaches, Southside, Mandarin, Riverside, and surrounding Duval County areas.",
      },
      {
        question: "Can I get same-day junk removal in Jacksonville?",
        answer:
          "Absolutely. Same-day slots fill up fast, so book early or call us in the morning for the best availability.",
      },
      {
        question: "Do you haul yard debris and outdoor furniture in Jacksonville?",
        answer:
          "Yes. Patio furniture, swing sets, yard waste, sheds, and hot tubs are all fair game. Our crews handle heavy lifting so you don't have to.",
      },
      {
        question: "What does junk removal cost in Jacksonville?",
        answer:
          "Pricing is volume-based and transparent. Send a photo for an instant estimate, or get a firm on-site quote before we lift a thing.",
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
      residential:
        "Furniture, appliances, electronics, and household clutter hauled fast. Affordable pickup by insured Atlanta crews — same day in most cases.",
      commercial:
        "Office furniture, equipment, and commercial debris cleared across Metro Atlanta with minimal disruption to your business.",
      propertyCleanout:
        "Estate clearing, move-outs, and full property cleanouts throughout Atlanta and surrounding metro areas. Professional, thorough, and discreet.",
      donationsPickup:
        "Gently used furniture, appliances, and clothing picked up and delivered to local charities across Metro Atlanta.",
      movingLabor:
        "Hourly labor for heavy lifting, loading, and unloading. We provide the muscle, you provide the truck.",
    },
    serviceAreaSubtext:
        "We're live across Metro Atlanta and expanding fast. Check if we serve your ZIP and get a free quote today.",
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
        question: "What areas of Atlanta do you serve?",
        answer:
          "We cover all of Metro Atlanta — Buckhead, Midtown, Decatur, Sandy Springs, Marietta, Alpharetta, and everywhere in between. Enter your ZIP to confirm.",
      },
      {
        question: "How fast can you come in Atlanta?",
        answer:
          "Same-day service is available most days across Metro Atlanta. Book online before noon for the best chance at a same-day slot.",
      },
      {
        question: "Do you recycle or donate items in Atlanta?",
        answer:
          "Yes. We partner with local Atlanta donation centers and recycling facilities to divert as much as possible from landfills on every job.",
      },
      {
        question: "How do I get a quote for junk removal in Atlanta?",
        answer:
          "Snap a photo of what needs to go and send it via our quote form for an instant estimate, or we'll price it out on-site with no obligation.",
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}
