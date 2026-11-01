export interface AddressSuggestion {
  display: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AddressLocationBias {
  zipCode?: string;
  city?: string;
  state?: string;
}

interface ZipLocation {
  zip: string;
  lat: number;
  lon: number;
  city: string;
  state: string;
}

interface ScoredSuggestion extends AddressSuggestion {
  score: number;
}

const zipLocationCache = new Map<string, ZipLocation>();

const US_COUNTRY_CODES = new Set(['us', 'usa']);
const US_STATE_CODES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
]);

// Continental US + Alaska + Hawaii bounds
const US_BBOX = {
  minLon: -179.5,
  minLat: 18.0,
  maxLon: -66.0,
  maxLat: 71.5,
};

const US_CENTER = {
  lat: 39.8283,
  lon: -98.5795,
};

function isUsCountryCode(value: string | undefined): boolean {
  if (!value) return true;
  return US_COUNTRY_CODES.has(value.toLowerCase()) || value.toLowerCase() === 'united states';
}

const US_STATE_NAMES: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV',
  wisconsin: 'WI', wyoming: 'WY', 'district of columbia': 'DC',
};

function normalizeUsState(state: string): string | null {
  const trimmed = state.trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase();
  if (US_STATE_CODES.has(upper)) return upper;

  const fromName = US_STATE_NAMES[trimmed.toLowerCase()];
  return fromName ?? null;
}

function isUsPostcode(postcode: string | undefined): boolean {
  if (!postcode) return true;
  return /^\d{5}(-\d{4})?$/.test(postcode.trim());
}

function isWithinUsBounds(lat?: number, lon?: number): boolean {
  if (lat == null || lon == null) return true;
  return (
    lat >= US_BBOX.minLat &&
    lat <= US_BBOX.maxLat &&
    lon >= US_BBOX.minLon &&
    lon <= US_BBOX.maxLon
  );
}

function isUsAddress(
  properties: Record<string, string | undefined>,
  lat?: number,
  lon?: number
): boolean {
  if (!isUsCountryCode(properties.countrycode || properties.country)) {
    return false;
  }

  if (!isWithinUsBounds(lat, lon)) {
    return false;
  }

  if (!isUsPostcode(properties.postcode)) {
    return false;
  }

  if (properties.state && !normalizeUsState(properties.state)) {
    return false;
  }

  return true;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function cityMatches(a: string, b: string): boolean {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

function stateMatches(a: string, b: string): boolean {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return false;
  return left === right || left.startsWith(right) || right.startsWith(left);
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function resolveZipLocation(zipCode: string): Promise<ZipLocation | null> {
  const zip = zipCode.trim();
  if (!/^\d{5}$/.test(zip)) return null;

  const cached = zipLocationCache.get(zip);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) return null;

    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;

    const location: ZipLocation = {
      zip,
      city: place['place name'] ?? '',
      state: place['state abbreviation'] ?? '',
      lat: Number.parseFloat(place.latitude),
      lon: Number.parseFloat(place.longitude),
    };

    if (!Number.isFinite(location.lat) || !Number.isFinite(location.lon)) {
      return null;
    }

    zipLocationCache.set(zip, location);
    return location;
  } catch {
    return null;
  }
}

function mapPhotonFeature(feature: {
  geometry?: { coordinates?: [number, number] };
  properties: Record<string, string | undefined>;
}): (AddressSuggestion & { lat?: number; lon?: number }) | null {
  const p = feature.properties;
  const street = p.housenumber
    ? `${p.housenumber} ${p.street || p.name || ''}`
    : (p.street || p.name || '');
  const city = p.city || p.town || p.village || p.county || '';
  const rawState = p.state || '';
  const normalizedState = normalizeUsState(rawState);
  const zipCode = p.postcode || '';

  const [lon, lat] = feature.geometry?.coordinates ?? [];
  if (!isUsAddress(p, Number.isFinite(lat) ? lat : undefined, Number.isFinite(lon) ? lon : undefined)) {
    return null;
  }

  if (!street.trim() || !city.trim() || !normalizedState) {
    return null;
  }

  const display = [street.trim(), city, normalizedState, zipCode].filter(Boolean).join(', ');

  return {
    display,
    street: street.trim(),
    city,
    state: normalizedState,
    zipCode,
    lat: Number.isFinite(lat) ? lat : undefined,
    lon: Number.isFinite(lon) ? lon : undefined,
  };
}

function scoreSuggestion(
  suggestion: AddressSuggestion & { lat?: number; lon?: number },
  zipLocation: ZipLocation | null,
  bias: AddressLocationBias
): number {
  let score = 0;
  const targetZip = (bias.zipCode || zipLocation?.zip || '').trim();
  const targetCity = bias.city || zipLocation?.city || '';
  const targetState = bias.state || zipLocation?.state || '';

  if (targetZip && suggestion.zipCode === targetZip) {
    score += 1000;
  } else if (targetZip && suggestion.zipCode?.slice(0, 3) === targetZip.slice(0, 3)) {
    score += 250;
  }

  if (targetState && stateMatches(suggestion.state, targetState)) {
    score += 150;
  } else if (targetState) {
    score -= 300;
  }

  if (targetCity && cityMatches(suggestion.city, targetCity)) {
    score += 80;
  }

  if (suggestion.zipCode) {
    score += 20;
  }

  if (zipLocation && suggestion.lat != null && suggestion.lon != null) {
    const distanceKm = haversineKm(zipLocation.lat, zipLocation.lon, suggestion.lat, suggestion.lon);
    if (distanceKm <= 8) score += 120;
    else if (distanceKm <= 20) score += 60;
    else if (distanceKm <= 40) score += 20;
    else score -= Math.min(120, Math.round(distanceKm));
  }

  return score;
}

function rankSuggestions(
  suggestions: Array<AddressSuggestion & { lat?: number; lon?: number }>,
  zipLocation: ZipLocation | null,
  bias: AddressLocationBias
): AddressSuggestion[] {
  const ranked: ScoredSuggestion[] = suggestions.map((suggestion) => ({
    ...suggestion,
    score: scoreSuggestion(suggestion, zipLocation, bias),
  }));

  ranked.sort((a, b) => b.score - a.score);

  const positive = ranked.filter((item) => item.score > 0);
  const pool = positive.length > 0 ? positive : ranked;

  const seen = new Set<string>();
  const results: AddressSuggestion[] = [];

  for (const item of pool) {
    const key = item.display.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      display: item.display,
      street: item.street,
      city: item.city,
      state: item.state,
      zipCode: item.zipCode,
    });
    if (results.length >= 5) break;
  }

  return results;
}

async function queryPhoton(
  query: string,
  options: {
    zipLocation: ZipLocation | null;
    useBbox: boolean;
    limit?: number;
  }
): Promise<Array<AddressSuggestion & { lat?: number; lon?: number }>> {
  const params = new URLSearchParams({
    q: query.trim(),
    limit: String(options.limit ?? 15),
    lang: 'en',
    location_bias_scale: '0.65',
    countrycode: 'us',
  });

  params.append('osm_tag', 'place:house');
  params.append('osm_tag', 'building');

  const anchor = options.zipLocation ?? US_CENTER;

  params.set('lat', String(anchor.lat));
  params.set('lon', String(anchor.lon));
  params.set('zoom', options.zipLocation ? '12' : '5');

  if (options.useBbox && options.zipLocation) {
    const delta = 0.14;
    params.set(
      'bbox',
      `${options.zipLocation.lon - delta},${options.zipLocation.lat - delta},${options.zipLocation.lon + delta},${options.zipLocation.lat + delta}`
    );
  } else {
    params.set(
      'bbox',
      `${US_BBOX.minLon},${US_BBOX.minLat},${US_BBOX.maxLon},${US_BBOX.maxLat}`
    );
  }

  const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
  if (!res.ok) return [];

  const data = await res.json();
  const mapped = (data.features || [])
    .map(mapPhotonFeature)
    .filter((item: ReturnType<typeof mapPhotonFeature>): item is NonNullable<typeof item> => item != null);

  return mapped;
}

export async function fetchAddressSuggestions(
  query: string,
  bias: AddressLocationBias = {}
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const zipLocation = bias.zipCode ? await resolveZipLocation(bias.zipCode) : null;
  const effectiveBias: AddressLocationBias = {
    zipCode: bias.zipCode || zipLocation?.zip,
    city: bias.city || zipLocation?.city,
    state: bias.state || zipLocation?.state,
  };

  let results = await queryPhoton(trimmed, { zipLocation, useBbox: true, limit: 15 });

  if (results.length < 3 && zipLocation) {
    const broader = await queryPhoton(trimmed, { zipLocation, useBbox: false, limit: 15 });
    results = [...results, ...broader];
  }

  if (results.length === 0) {
    const fallbackQuery = [
      trimmed,
      effectiveBias.city,
      effectiveBias.state,
      effectiveBias.zipCode,
      'USA',
    ]
      .filter(Boolean)
      .join(' ');

    results = await queryPhoton(fallbackQuery, { zipLocation, useBbox: false, limit: 12 });
  }

  return rankSuggestions(results, zipLocation, effectiveBias);
}
