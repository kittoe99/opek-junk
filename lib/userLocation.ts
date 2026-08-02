import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'user_city';

const US_STATES_MAP: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH',
  oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  'district of columbia': 'DC',
};

function getUSStateAbbreviation(stateName: string): string {
  return US_STATES_MAP[stateName.toLowerCase().trim()] || stateName;
}

function readStoredCity(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function writeStoredCity(loc: string) {
  try {
    localStorage.setItem(STORAGE_KEY, loc);
  } catch {
    /* ignore quota / private mode */
  }
}

async function detectViaGeolocation(): Promise<string> {
  if (!navigator.geolocation) throw new Error('Geolocation not supported');

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 6000,
      maximumAge: 600000,
    });
  });

  const { latitude, longitude } = position.coords;
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
  );
  if (!geoRes.ok) throw new Error('Reverse geocoding failed');

  const geoData = await geoRes.json();
  const address = geoData.address;
  if (!address) throw new Error('Could not parse city');

  const city = address.city || address.town || address.village || address.hamlet || '';
  const state = address.state || '';
  const countryCode = address.country_code ? address.country_code.toUpperCase() : '';
  if (!city) throw new Error('Could not parse city');

  const displayState = countryCode === 'US' ? getUSStateAbbreviation(state) : state;
  return countryCode === 'US' ? `${city}, ${displayState}` : `${city}, ${countryCode}`;
}

async function detectViaIp(): Promise<string> {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data.success && data.city) {
      return data.country_code === 'US'
        ? `${data.city}, ${data.region_code}`
        : `${data.city}, ${data.country_code}`;
    }
  } catch {
    /* try next */
  }

  const res2 = await fetch('https://ipapi.co/json/');
  const data2 = await res2.json();
  if (data2.city) {
    return data2.country_code === 'US'
      ? `${data2.city}, ${data2.region_code}`
      : `${data2.city}, ${data2.country_code}`;
  }

  throw new Error('IP lookup failed');
}

/** Same detection path as the homepage navbar: GPS → stored → IP → fallback. */
export async function detectUserCity(): Promise<string> {
  try {
    const loc = await detectViaGeolocation();
    writeStoredCity(loc);
    return loc;
  } catch {
    const stored = readStoredCity();
    if (stored) return stored;

    try {
      const loc = await detectViaIp();
      writeStoredCity(loc);
      return loc;
    } catch {
      return 'United States';
    }
  }
}

export function useUserLocation() {
  const [userCity, setUserCity] = useState(() => readStoredCity());
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const fetchUserLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      const loc = await detectUserCity();
      setUserCity(loc);
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  useEffect(() => {
    void fetchUserLocation();
  }, [fetchUserLocation]);

  const locationLabel = isDetectingLocation
    ? 'Detecting…'
    : userCity || 'Set location';

  return {
    userCity,
    isDetectingLocation,
    locationLabel,
    fetchUserLocation,
  };
}
