export interface CoverageCity {
  name: string;
  slug: string;
  state: string;
  /** SVG viewBox coordinates (959×593). */
  x: number;
  y: number;
  hasCityPage: boolean;
}

export const coverageCities: CoverageCity[] = [
  { name: 'Seattle, WA', slug: 'seattle', state: 'WA', x: 165, y: 95, hasCityPage: false },
  { name: 'Portland, OR', slug: 'portland', state: 'OR', x: 155, y: 125, hasCityPage: false },
  { name: 'San Francisco, CA', slug: 'san-francisco', state: 'CA', x: 125, y: 235, hasCityPage: false },
  { name: 'Los Angeles, CA', slug: 'los-angeles', state: 'CA', x: 145, y: 300, hasCityPage: false },
  { name: 'San Diego, CA', slug: 'san-diego', state: 'CA', x: 155, y: 328, hasCityPage: false },
  { name: 'Phoenix, AZ', slug: 'phoenix', state: 'AZ', x: 215, y: 340, hasCityPage: false },
  { name: 'Denver, CO', slug: 'denver', state: 'CO', x: 310, y: 268, hasCityPage: false },
  { name: 'Dallas–Fort Worth, TX', slug: 'dallas-fort-worth', state: 'TX', x: 405, y: 378, hasCityPage: true },
  { name: 'Houston, TX', slug: 'houston', state: 'TX', x: 425, y: 418, hasCityPage: false },
  { name: 'Austin, TX', slug: 'austin', state: 'TX', x: 395, y: 400, hasCityPage: false },
  { name: 'Chicago, IL', slug: 'chicago', state: 'IL', x: 535, y: 218, hasCityPage: false },
  { name: 'Atlanta, GA', slug: 'atlanta', state: 'GA', x: 575, y: 335, hasCityPage: true },
  { name: 'Miami, FL', slug: 'miami', state: 'FL', x: 625, y: 452, hasCityPage: false },
  { name: 'Jacksonville, FL', slug: 'jacksonville', state: 'FL', x: 605, y: 395, hasCityPage: true },
  { name: 'Boston, MA', slug: 'boston', state: 'MA', x: 735, y: 148, hasCityPage: false },
  { name: 'New York, NY', slug: 'new-york', state: 'NY', x: 720, y: 178, hasCityPage: false },
  { name: 'Philadelphia, PA', slug: 'philadelphia', state: 'PA', x: 705, y: 198, hasCityPage: false },
  { name: 'Washington, D.C.', slug: 'washington-dc', state: 'DC', x: 690, y: 218, hasCityPage: false },
];

export function getCoverageCity(slug: string): CoverageCity | undefined {
  return coverageCities.find((city) => city.slug === slug);
}
