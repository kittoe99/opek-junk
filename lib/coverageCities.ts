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
  { name: 'Boise, ID', slug: 'boise', state: 'ID', x: 195, y: 148, hasCityPage: false },
  { name: 'Billings, MT', slug: 'billings', state: 'MT', x: 285, y: 100, hasCityPage: false },
  { name: 'San Francisco, CA', slug: 'san-francisco', state: 'CA', x: 125, y: 235, hasCityPage: false },
  { name: 'Los Angeles, CA', slug: 'los-angeles', state: 'CA', x: 145, y: 300, hasCityPage: false },
  { name: 'San Diego, CA', slug: 'san-diego', state: 'CA', x: 155, y: 328, hasCityPage: false },
  { name: 'Las Vegas, NV', slug: 'las-vegas', state: 'NV', x: 175, y: 278, hasCityPage: false },
  { name: 'Salt Lake City, UT', slug: 'salt-lake-city', state: 'UT', x: 235, y: 238, hasCityPage: false },
  { name: 'Cheyenne, WY', slug: 'cheyenne', state: 'WY', x: 305, y: 190, hasCityPage: false },
  { name: 'Denver, CO', slug: 'denver', state: 'CO', x: 310, y: 268, hasCityPage: false },
  { name: 'Phoenix, AZ', slug: 'phoenix', state: 'AZ', x: 215, y: 340, hasCityPage: false },
  { name: 'Albuquerque, NM', slug: 'albuquerque', state: 'NM', x: 270, y: 345, hasCityPage: false },
  { name: 'Fargo, ND', slug: 'fargo', state: 'ND', x: 385, y: 105, hasCityPage: false },
  { name: 'Sioux Falls, SD', slug: 'sioux-falls', state: 'SD', x: 375, y: 170, hasCityPage: false },
  { name: 'Omaha, NE', slug: 'omaha', state: 'NE', x: 398, y: 218, hasCityPage: false },
  { name: 'Wichita, KS', slug: 'wichita', state: 'KS', x: 405, y: 290, hasCityPage: false },
  { name: 'Oklahoma City, OK', slug: 'oklahoma-city', state: 'OK', x: 395, y: 340, hasCityPage: false },
  { name: 'Dallas–Fort Worth, TX', slug: 'dallas-fort-worth', state: 'TX', x: 405, y: 378, hasCityPage: true },
  { name: 'Houston, TX', slug: 'houston', state: 'TX', x: 425, y: 418, hasCityPage: false },
  { name: 'Austin, TX', slug: 'austin', state: 'TX', x: 395, y: 400, hasCityPage: false },
  { name: 'Minneapolis, MN', slug: 'minneapolis', state: 'MN', x: 445, y: 115, hasCityPage: false },
  { name: 'Des Moines, IA', slug: 'des-moines', state: 'IA', x: 462, y: 205, hasCityPage: false },
  { name: 'Milwaukee, WI', slug: 'milwaukee', state: 'WI', x: 510, y: 168, hasCityPage: false },
  { name: 'Chicago, IL', slug: 'chicago', state: 'IL', x: 535, y: 218, hasCityPage: false },
  { name: 'Detroit, MI', slug: 'detroit', state: 'MI', x: 585, y: 182, hasCityPage: false },
  { name: 'Indianapolis, IN', slug: 'indianapolis', state: 'IN', x: 552, y: 232, hasCityPage: false },
  { name: 'Columbus, OH', slug: 'columbus', state: 'OH', x: 595, y: 222, hasCityPage: false },
  { name: 'Kansas City, MO', slug: 'kansas-city', state: 'MO', x: 455, y: 260, hasCityPage: false },
  { name: 'Louisville, KY', slug: 'louisville', state: 'KY', x: 558, y: 272, hasCityPage: false },
  { name: 'Nashville, TN', slug: 'nashville', state: 'TN', x: 545, y: 308, hasCityPage: false },
  { name: 'Atlanta, GA', slug: 'atlanta', state: 'GA', x: 575, y: 335, hasCityPage: true },
  { name: 'Little Rock, AR', slug: 'little-rock', state: 'AR', x: 455, y: 342, hasCityPage: false },
  { name: 'Jackson, MS', slug: 'jackson', state: 'MS', x: 492, y: 375, hasCityPage: false },
  { name: 'New Orleans, LA', slug: 'new-orleans', state: 'LA', x: 475, y: 418, hasCityPage: false },
  { name: 'Birmingham, AL', slug: 'birmingham', state: 'AL', x: 535, y: 362, hasCityPage: false },
  { name: 'Jacksonville, FL', slug: 'jacksonville', state: 'FL', x: 605, y: 395, hasCityPage: true },
  { name: 'Miami, FL', slug: 'miami', state: 'FL', x: 625, y: 452, hasCityPage: false },
  { name: 'Charlotte, NC', slug: 'charlotte', state: 'NC', x: 600, y: 312, hasCityPage: false },
  { name: 'Columbia, SC', slug: 'columbia', state: 'SC', x: 605, y: 348, hasCityPage: false },
  { name: 'Richmond, VA', slug: 'richmond', state: 'VA', x: 630, y: 262, hasCityPage: false },
  { name: 'Charleston, WV', slug: 'charleston', state: 'WV', x: 592, y: 252, hasCityPage: false },
  { name: 'Washington, D.C.', slug: 'washington-dc', state: 'DC', x: 690, y: 218, hasCityPage: false },
  { name: 'Baltimore, MD', slug: 'baltimore', state: 'MD', x: 658, y: 228, hasCityPage: false },
  { name: 'Dover, DE', slug: 'dover', state: 'DE', x: 672, y: 235, hasCityPage: false },
  { name: 'Philadelphia, PA', slug: 'philadelphia', state: 'PA', x: 705, y: 198, hasCityPage: false },
  { name: 'Newark, NJ', slug: 'newark', state: 'NJ', x: 698, y: 210, hasCityPage: false },
  { name: 'Hartford, CT', slug: 'hartford', state: 'CT', x: 718, y: 172, hasCityPage: false },
  { name: 'New York, NY', slug: 'new-york', state: 'NY', x: 720, y: 178, hasCityPage: false },
  { name: 'Providence, RI', slug: 'providence', state: 'RI', x: 742, y: 158, hasCityPage: false },
  { name: 'Boston, MA', slug: 'boston', state: 'MA', x: 735, y: 148, hasCityPage: false },
  { name: 'Burlington, VT', slug: 'burlington', state: 'VT', x: 708, y: 115, hasCityPage: false },
  { name: 'Concord, NH', slug: 'concord', state: 'NH', x: 728, y: 110, hasCityPage: false },
  { name: 'Portland, ME', slug: 'portland', state: 'ME', x: 752, y: 82, hasCityPage: false },
  { name: 'Anchorage, AK', slug: 'anchorage', state: 'AK', x: 78, y: 520, hasCityPage: false },
  { name: 'Honolulu, HI', slug: 'honolulu', state: 'HI', x: 310, y: 518, hasCityPage: false },
];

export function getCoverageCity(slug: string): CoverageCity | undefined {
  return coverageCities.find((city) => city.slug === slug);
}
