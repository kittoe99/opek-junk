import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  MapPin,
  MessageSquare,
  CalendarCheck,
  Locate,
  Phone,
  ArrowRight,
  CheckSquare,
  Heart,
  X,
  Menu,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { JunkIcon, DumpsterIcon, PropertyCleanoutIcon, MovingLaborIcon } from './icons/ServiceIcons';

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

const serviceItems = [
  { name: 'Junk Removal', desc: 'Residential & commercial clearing', path: '/services/junk-removal', icon: JunkIcon },
  { name: 'Dumpster Rental', desc: 'Roll-off container drop-off & pickup', path: '/services/dumpster-rental', icon: DumpsterIcon },
  { name: 'Property Cleanouts', desc: 'Estate clearing and move-outs', path: '/services/property-cleanout', icon: PropertyCleanoutIcon },
  { name: 'Moving Labor', desc: 'Hourly labor for loading and lifting', path: '/services/moving-labor', icon: MovingLaborIcon },
];

const navLinks = [
  { name: 'Services', path: '/#services', hasMega: true },
  { name: 'Contact', path: '/contact' },
  { name: 'Book online', path: '/booking' },
  { name: 'Track order', path: '/track-order' },
];

function getUSStateAbbreviation(stateName: string): string {
  return US_STATES_MAP[stateName.toLowerCase().trim()] || stateName;
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdsLandingPage = location.pathname === '/services/mattress-disposal';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMega, setShowServicesMega] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const fetchUserLocation = async () => {
    setIsDetectingLocation(true);
    try {
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
      if (address) {
        const city = address.city || address.town || address.village || address.hamlet || '';
        const state = address.state || '';
        const countryCode = address.country_code ? address.country_code.toUpperCase() : '';

        if (city) {
          const displayState = countryCode === 'US' ? getUSStateAbbreviation(state) : state;
          const loc = countryCode === 'US' ? `${city}, ${displayState}` : `${city}, ${countryCode}`;
          setUserCity(loc);
          localStorage.setItem('user_city', loc);
          setIsDetectingLocation(false);
          return;
        }
      }
      throw new Error('Could not parse city');
    } catch {
      const storedCity = localStorage.getItem('user_city');
      if (storedCity) {
        setUserCity(storedCity);
        setIsDetectingLocation(false);
        return;
      }

      try {
        const res = await fetch('https://ipwho.is/');
        const data = await res.json();
        if (data.success && data.city) {
          const loc =
            data.country_code === 'US'
              ? `${data.city}, ${data.region_code}`
              : `${data.city}, ${data.country_code}`;
          setUserCity(loc);
          localStorage.setItem('user_city', loc);
          return;
        }
      } catch {
        try {
          const res2 = await fetch('https://ipapi.co/json/');
          const data2 = await res2.json();
          if (data2.city) {
            const loc =
              data2.country_code === 'US'
                ? `${data2.city}, ${data2.region_code}`
                : `${data2.city}, ${data2.country_code}`;
            setUserCity(loc);
            localStorage.setItem('user_city', loc);
            return;
          }
        } catch {
          setUserCity('United States');
        }
      } finally {
        setIsDetectingLocation(false);
      }
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    window.addEventListener('resize', syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeaderHeight);
    };
  }, [isAdsLandingPage]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const handleLinkClick = (path: string) => {
    setIsMenuOpen(false);
    setShowServicesMega(false);
    navigate(path);
  };

  const locationLabel = isDetectingLocation ? 'Detecting location...' : userCity || 'Set your location';

  const LocationButton = ({ className = '' }: { className?: string }) => (
    <button
      type="button"
      onClick={fetchUserLocation}
      disabled={isDetectingLocation}
      className={`inline-flex items-center gap-1.5 rounded-full border border-secondary-100 bg-white px-3 py-1.5 text-xs font-medium text-secondary hover:border-secondary-300 hover:text-brand transition-colors disabled:opacity-50 ${className}`}
    >
      <MapPin size={13} className="text-brand shrink-0" />
      <span className="truncate max-w-[140px] sm:max-w-none">{locationLabel}</span>
    </button>
  );

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-b border-secondary-100/80"
      >
        {!isAdsLandingPage && (
          <div className="hidden md:block border-b border-secondary-100/60 bg-secondary-50/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center">
              <LocationButton />
            </div>
          </div>
        )}

        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3.5 flex items-center justify-between gap-4">
          <button type="button" onClick={() => handleLinkClick('/')} className="shrink-0 z-[70]">
            <img src="/logo1.png" alt="Opek Junk Removal" className="h-9 md:h-10 w-auto object-contain" />
          </button>

          {isAdsLandingPage ? (
            <div className="flex items-center gap-2 ml-auto">
              <div className="md:hidden">
                <LocationButton />
              </div>
              <a
                href="tel:8313187139"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors"
              >
                <Phone size={15} />
                (831) 318-7139
              </a>
              <a
                href="tel:8313187139"
                className="md:hidden flex items-center justify-center w-10 h-10 bg-brand text-white rounded-full"
                aria-label="Call Opek Junk Removal"
              >
                <Phone size={17} />
              </a>
            </div>
          ) : (
            <>
              <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-[75]">
                <LocationButton />
              </div>

              <div className="hidden md:flex items-center gap-1 lg:gap-2 ml-auto">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative">
                    {link.hasMega ? (
                      <div
                        onMouseEnter={() => setShowServicesMega(true)}
                        onMouseLeave={() => setShowServicesMega(false)}
                      >
                        <button
                          type="button"
                          onClick={() => handleLinkClick(link.path)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-secondary hover:text-brand rounded-lg transition-colors"
                        >
                          {link.name}
                          <ChevronDown
                            size={15}
                            className={`transition-transform duration-200 ${showServicesMega ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <div
                          className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[360px] transition-all duration-200 ${
                            showServicesMega
                              ? 'opacity-100 visible translate-y-0'
                              : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                          }`}
                        >
                          <div className="bg-white shadow-[0_8px_40px_rgba(53,80,112,0.12)] border border-secondary-100/80 rounded-2xl overflow-hidden p-2">
                            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-400">
                              Our services
                            </p>
                            {serviceItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    setShowServicesMega(false);
                                    handleLinkClick(item.path);
                                  }}
                                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-secondary-50 transition-colors group flex items-center gap-3"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-secondary-50 group-hover:bg-brand/10 flex items-center justify-center shrink-0 transition-colors">
                                    <Icon className="w-5 h-5 text-secondary group-hover:text-brand transition-colors" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm text-secondary group-hover:text-brand transition-colors">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-secondary-400">{item.desc}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleLinkClick(link.path)}
                        className="px-3 py-2 text-sm font-medium text-secondary hover:text-brand rounded-lg transition-colors"
                      >
                        {link.name}
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="ml-2 px-5 py-2.5 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 rounded-full transition-colors inline-flex items-center gap-1.5"
                >
                  Get a quote
                  <ArrowRight size={14} />
                </button>
              </div>

              <button
                type="button"
                className="md:hidden relative z-[70] w-10 h-10 flex items-center justify-center rounded-xl border border-secondary-100 text-secondary hover:border-secondary-300 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          )}
        </nav>

        {!isAdsLandingPage && (
          <div className="border-t border-secondary-100/60 bg-[#f3f3f3]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 text-center">
              <span className="text-secondary text-xs md:text-sm font-medium">
                <span className="hidden sm:inline">Free in-home estimates — providers visit your property</span>
                <span className="sm:hidden">Free in-home estimates</span>
              </span>
              <button
                type="button"
                onClick={() => navigate('/in-home-estimate')}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-secondary text-white hover:bg-secondary-600 rounded-full transition-colors"
              >
                Schedule
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </header>

      <div
        className={`fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[360px] bg-white z-[65] shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
          <img src="/logo1.png" alt="Opek Junk Removal" className="h-9 w-auto object-contain" />
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-secondary-100 text-secondary hover:border-secondary-300 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-secondary-100 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleLinkClick('/quote')}
              className="flex-1 py-3 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 rounded-xl transition-colors"
            >
              Get a quote
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('/booking')}
              className="flex-1 py-3 text-sm font-semibold border border-secondary-200 text-secondary hover:bg-secondary-50 rounded-xl transition-colors"
            >
              Book online
            </button>
          </div>
          <LocationButton className="w-full justify-center" />
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary-400 mb-3">Menu</p>
          <div className="space-y-1">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div key={link.name} className="rounded-xl border border-secondary-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-secondary hover:bg-secondary-50 transition-colors"
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`text-secondary-400 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileServicesOpen ? 'max-h-96 border-t border-secondary-100' : 'max-h-0'
                    }`}
                  >
                    {serviceItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setMobileServicesOpen(false);
                            handleLinkClick(item.path);
                          }}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-secondary-50 transition-colors border-t border-secondary-100 first:border-t-0"
                        >
                          <div className="w-9 h-9 rounded-lg bg-secondary-50 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-secondary">{item.name}</div>
                            <div className="text-xs text-secondary-400 truncate">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleLinkClick(link.path)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-secondary-100 text-sm font-semibold text-secondary hover:bg-secondary-50 transition-colors"
                >
                  {link.name}
                  <ArrowRight size={14} className="text-secondary-300" />
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => handleLinkClick('/in-home-estimate')}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-secondary-100 text-sm font-semibold text-secondary hover:bg-secondary-50 transition-colors"
            >
              In-home estimate
              <ArrowRight size={14} className="text-secondary-300" />
            </button>

            <a
              href="tel:8313187139"
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-secondary-100 text-sm font-semibold text-secondary hover:bg-secondary-50 transition-colors"
            >
              Call (831) 318-7139
              <Phone size={14} className="text-brand" />
            </a>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-[#f3f3f3] border border-secondary-100/80">
            <div className="flex items-center gap-1.5 mb-2">
              <Heart size={12} className="text-brand fill-brand" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">Community impact</span>
            </div>
            <p className="text-sm font-semibold text-secondary mb-1">5% of sales to children&apos;s hospitals</p>
            <p className="text-xs text-secondary-500 mb-3">Book with purpose and support families in need.</p>
            <button
              type="button"
              onClick={() => handleLinkClick('/quote')}
              className="w-full py-2.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors"
            >
              Book with purpose
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};
