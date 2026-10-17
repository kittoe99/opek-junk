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
  { name: 'Seattle, WA', slug: 'seattle', state: 'WA', x: 91, y: 40, hasCityPage: false },
  { name: 'Portland, OR', slug: 'portland', state: 'OR', x: 73, y: 82, hasCityPage: false },
  { name: 'Boise, ID', slug: 'boise', state: 'ID', x: 161, y: 146, hasCityPage: false },
  { name: 'Billings, MT', slug: 'billings', state: 'MT', x: 288, y: 120, hasCityPage: false },
  { name: 'San Francisco, CA', slug: 'san-francisco', state: 'CA', x: 30, y: 246, hasCityPage: false },
  { name: 'Los Angeles, CA', slug: 'los-angeles', state: 'CA', x: 81, y: 343, hasCityPage: false },
  { name: 'San Diego, CA', slug: 'san-diego', state: 'CA', x: 93, y: 375, hasCityPage: false },
  { name: 'Las Vegas, NV', slug: 'las-vegas', state: 'NV', x: 145, y: 309, hasCityPage: false },
  { name: 'Salt Lake City, UT', slug: 'salt-lake-city', state: 'UT', x: 218, y: 221, hasCityPage: false },
  { name: 'Cheyenne, WY', slug: 'cheyenne', state: 'WY', x: 335, y: 227, hasCityPage: false },
  { name: 'Denver, CO', slug: 'denver', state: 'CO', x: 329, y: 257, hasCityPage: false },
  { name: 'Phoenix, AZ', slug: 'phoenix', state: 'AZ', x: 188, y: 378, hasCityPage: false },
  { name: 'Albuquerque, NM', slug: 'albuquerque', state: 'NM', x: 290, y: 356, hasCityPage: false },
  { name: 'Fargo, ND', slug: 'fargo', state: 'ND', x: 468, y: 109, hasCityPage: false },
  { name: 'Sioux Falls, SD', slug: 'sioux-falls', state: 'SD', x: 469, y: 181, hasCityPage: false },
  { name: 'Omaha, NE', slug: 'omaha', state: 'NE', x: 481, y: 231, hasCityPage: false },
  { name: 'Wichita, KS', slug: 'wichita', state: 'KS', x: 457, y: 309, hasCityPage: false },
  { name: 'Oklahoma City, OK', slug: 'oklahoma-city', state: 'OK', x: 453, y: 358, hasCityPage: false },
  { name: 'Dallas–Fort Worth, TX', slug: 'dallas-fort-worth', state: 'TX', x: 461, y: 414, hasCityPage: true },
  { name: 'Houston, TX', slug: 'houston', state: 'TX', x: 492, y: 482, hasCityPage: false },
  { name: 'Austin, TX', slug: 'austin', state: 'TX', x: 447, y: 471, hasCityPage: false },
  { name: 'Minneapolis, MN', slug: 'minneapolis', state: 'MN', x: 523, y: 150, hasCityPage: false },
  { name: 'Des Moines, IA', slug: 'des-moines', state: 'IA', x: 519, y: 223, hasCityPage: false },
  { name: 'Milwaukee, WI', slug: 'milwaukee', state: 'WI', x: 610, y: 187, hasCityPage: false },
  { name: 'Chicago, IL', slug: 'chicago', state: 'IL', x: 616, y: 212, hasCityPage: false },
  { name: 'Detroit, MI', slug: 'detroit', state: 'MI', x: 689, y: 194, hasCityPage: false },
  { name: 'Indianapolis, IN', slug: 'indianapolis', state: 'IN', x: 645, y: 255, hasCityPage: false },
  { name: 'Columbus, OH', slug: 'columbus', state: 'OH', x: 697, y: 245, hasCityPage: false },
  { name: 'Kansas City, MO', slug: 'kansas-city', state: 'MO', x: 504, y: 278, hasCityPage: false },
  { name: 'Louisville, KY', slug: 'louisville', state: 'KY', x: 656, y: 288, hasCityPage: false },
  { name: 'Nashville, TN', slug: 'nashville', state: 'TN', x: 643, y: 335, hasCityPage: false },
  { name: 'Atlanta, GA', slug: 'atlanta', state: 'GA', x: 691, y: 383, hasCityPage: true },
  { name: 'Little Rock, AR', slug: 'little-rock', state: 'AR', x: 547, y: 372, hasCityPage: false },
  { name: 'Jackson, MS', slug: 'jackson', state: 'MS', x: 588, y: 424, hasCityPage: false },
  { name: 'New Orleans, LA', slug: 'new-orleans', state: 'LA', x: 593, y: 475, hasCityPage: false },
  { name: 'Birmingham, AL', slug: 'birmingham', state: 'AL', x: 648, y: 392, hasCityPage: false },
  { name: 'Jacksonville, FL', slug: 'jacksonville', state: 'FL', x: 752, y: 450, hasCityPage: true },
  { name: 'Miami, FL', slug: 'miami', state: 'FL', x: 796, y: 543, hasCityPage: false },
  { name: 'Charlotte, NC', slug: 'charlotte', state: 'NC', x: 750, y: 342, hasCityPage: false },
  { name: 'Columbia, SC', slug: 'columbia', state: 'SC', x: 751, y: 369, hasCityPage: false },
  { name: 'Richmond, VA', slug: 'richmond', state: 'VA', x: 800, y: 282, hasCityPage: false },
  { name: 'Charleston, WV', slug: 'charleston', state: 'WV', x: 725, y: 277, hasCityPage: false },
  { name: 'Washington, D.C.', slug: 'washington-dc', state: 'DC', x: 800, y: 251, hasCityPage: false },
  { name: 'Baltimore, MD', slug: 'baltimore', state: 'MD', x: 806, y: 241, hasCityPage: false },
  { name: 'Dover, DE', slug: 'dover', state: 'DE', x: 824, y: 240, hasCityPage: false },
  { name: 'Philadelphia, PA', slug: 'philadelphia', state: 'PA', x: 826, y: 222, hasCityPage: false },
  { name: 'Newark, NJ', slug: 'newark', state: 'NJ', x: 839, y: 202, hasCityPage: false },
  { name: 'Hartford, CT', slug: 'hartford', state: 'CT', x: 857, y: 175, hasCityPage: false },
  { name: 'New York, NY', slug: 'new-york', state: 'NY', x: 841, y: 202, hasCityPage: false },
  { name: 'Providence, RI', slug: 'providence', state: 'RI', x: 877, y: 168, hasCityPage: false },
  { name: 'Boston, MA', slug: 'boston', state: 'MA', x: 879, y: 155, hasCityPage: false },
  { name: 'Burlington, VT', slug: 'burlington', state: 'VT', x: 835, y: 119, hasCityPage: false },
  { name: 'Concord, NH', slug: 'concord', state: 'NH', x: 867, y: 139, hasCityPage: false },
  { name: 'Portland, ME', slug: 'portland-me', state: 'ME', x: 884, y: 125, hasCityPage: false },
  { name: 'Anchorage, AK', slug: 'anchorage', state: 'AK', x: 108, y: 519, hasCityPage: false },
  { name: 'Honolulu, HI', slug: 'honolulu', state: 'HI', x: 277, y: 537, hasCityPage: false },
];

export function getCoverageCity(slug: string): CoverageCity | undefined {
  return coverageCities.find((city) => city.slug === slug);
}
