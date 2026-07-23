import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  MapPin,
  Phone,
  ArrowRight,
  CheckSquare,
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
  { name: 'Junk Removal', desc: 'Single items, mattresses, furniture & more', path: '/services/junk-removal', icon: JunkIcon },
  { name: 'Dumpster Rental', desc: 'Roll-off container drop-off & pickup', path: '/services/dumpster-rental', icon: DumpsterIcon },
  { name: 'Property Cleanouts', desc: 'Estate clearing, garage cleanouts & move-outs', path: '/services/property-cleanout', icon: PropertyCleanoutIcon },
  { name: 'Local Moving', desc: 'Truck and crew for apartment & small home moves', path: '/services/moving-labor', icon: MovingLaborIcon },
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
  const isAdsLandingPage =
    location.pathname === '/services/mattress-disposal' ||
    location.pathname === '/lp/junk-removal';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMega, setShowServicesMega] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
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

  useEffect(() => {
    if (!isMenuOpen) setMobileAccordion(null);
  }, [isMenuOpen]);

  const handleLinkClick = (path: string) => {
    setIsMenuOpen(false);
    setShowServicesMega(false);
    setMobileAccordion(null);
    navigate(path);
  };

  const toggleMobileAccordion = (id: string) => {
    setMobileAccordion((prev) => (prev === id ? null : id));
  };

  const locationLabel = isDetectingLocation ? 'Detecting…' : userCity || 'Set location';

  const LocationButton = ({ className = '' }: { className?: string }) => (
    <button
      type="button"
      onClick={fetchUserLocation}
      disabled={isDetectingLocation}
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-50 ${className}`}
    >
      <MapPin size={14} className="text-brand shrink-0" strokeWidth={2.25} />
      <span className="truncate max-w-[8.5rem] sm:max-w-[10rem] md:max-w-none">{locationLabel}</span>
    </button>
  );

  const mobileAccordionBtn =
    'w-full flex items-center justify-between px-5 py-4 bg-white/[0.04] hover:bg-white/[0.07] text-white font-bold text-[15px] transition-colors';

  const mobileSubLink =
    'w-full flex items-center gap-3 px-5 py-3.5 text-left text-sm font-medium text-neutral-300 hover:bg-white/5 hover:text-white transition-colors border-t border-white/[0.06]';

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[60] bg-[#08080b]/85 backdrop-blur-xl border-b border-white/[0.07]"
      >
        {!isAdsLandingPage && (
          <div className="hidden md:block border-b border-white/[0.05] bg-white/[0.015]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center">
              <LocationButton />
            </div>
          </div>
        )}

        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3.5 flex items-center justify-between gap-4">
          <button type="button" onClick={() => handleLinkClick('/')} className="shrink-0 z-[70]">
            <img
              src="/opek-logo-white.png"
              alt="Opek Junk Removal"
              className="h-7 md:h-8 w-auto object-contain"
            />
          </button>

          {isAdsLandingPage ? (
            <div className="flex items-center gap-2 ml-auto">
              <div className="md:hidden">
                <LocationButton />
              </div>
              <a
                href="tel:8313187139"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors shadow-[0_0_20px_-4px_rgba(255,0,110,0.55)]"
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
              <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-[75] pointer-events-none">
                <div className="pointer-events-auto">
                  <LocationButton />
                </div>
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
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white rounded-lg transition-colors"
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
                          <div className="bg-[#101014] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] border border-white/10 rounded-2xl overflow-hidden p-2">
                            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
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
                                  className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group flex items-center gap-3"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] group-hover:bg-brand/15 group-hover:border-brand/30 flex items-center justify-center shrink-0 transition-colors">
                                    <Icon className="w-5 h-5 text-neutral-300 group-hover:text-brand transition-colors" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm text-neutral-100 group-hover:text-brand transition-colors">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-neutral-500">{item.desc}</div>
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
                        className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white rounded-lg transition-colors"
                      >
                        {link.name}
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="ml-2 px-5 py-2.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-[0_0_22px_-6px_rgba(255,0,110,0.65)] hover:shadow-[0_0_28px_-4px_rgba(255,0,110,0.8)]"
                >
                  Get a quote
                  <ArrowRight size={14} />
                </button>
              </div>

              <button
                type="button"
                className={`md:hidden relative z-[70] w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                  isMenuOpen
                    ? 'bg-brand border-brand text-white'
                    : 'border-white/10 text-neutral-200 hover:border-white/25 hover:bg-white/5'
                }`}
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
          <div className="border-t border-white/[0.05] bg-gradient-to-r from-brand/[0.14] via-brand/[0.05] to-transparent">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 text-center">
              <span className="text-neutral-300 text-xs md:text-sm font-medium">
                <span className="hidden sm:inline">Free in-home estimates — providers visit your property</span>
                <span className="sm:hidden">Free in-home estimates</span>
              </span>
              <button
                type="button"
                onClick={() => navigate('/in-home-estimate')}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors"
              >
                Schedule
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </header>

      <div
        className={`fixed inset-0 z-[65] md:hidden flex flex-col bg-[#0a0a0e] transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3.5 border-b border-white/10">
          <button
            type="button"
            onClick={() => handleLinkClick('/')}
            className="shrink-0 rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
          >
            <img
              src="/opek-logo-white.png"
              alt="Opek Junk Removal"
              className="h-6 w-auto object-contain"
            />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLinkClick('/booking')}
              className="px-5 py-2.5 text-sm font-bold bg-brand text-white hover:bg-brand-600 rounded-lg transition-colors"
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
          <div className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => toggleMobileAccordion('services')}
              className={mobileAccordionBtn}
              aria-expanded={mobileAccordion === 'services'}
            >
              Services
              <ChevronDown
                size={18}
                className={`text-white/80 transition-transform duration-200 ${mobileAccordion === 'services' ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 bg-black/30 ${
                mobileAccordion === 'services' ? 'max-h-[24rem]' : 'max-h-0'
              }`}
            >
              {serviceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleLinkClick(item.path)}
                    className={mobileSubLink}
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-brand" />
                    </div>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => toggleMobileAccordion('booking')}
              className={mobileAccordionBtn}
              aria-expanded={mobileAccordion === 'booking'}
            >
              Book &amp; pricing
              <ChevronDown
                size={18}
                className={`text-white/80 transition-transform duration-200 ${mobileAccordion === 'booking' ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 bg-black/30 ${
                mobileAccordion === 'booking' ? 'max-h-48' : 'max-h-0'
              }`}
            >
              <button type="button" onClick={() => handleLinkClick('/quote')} className={mobileSubLink}>
                Get a quote
              </button>
              <button type="button" onClick={() => handleLinkClick('/booking')} className={mobileSubLink}>
                Book online
              </button>
              <button type="button" onClick={() => handleLinkClick('/in-home-estimate')} className={mobileSubLink}>
                In-home estimate
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => toggleMobileAccordion('support')}
              className={mobileAccordionBtn}
              aria-expanded={mobileAccordion === 'support'}
            >
              Support
              <ChevronDown
                size={18}
                className={`text-white/80 transition-transform duration-200 ${mobileAccordion === 'support' ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 bg-black/30 ${
                mobileAccordion === 'support' ? 'max-h-40' : 'max-h-0'
              }`}
            >
              <button type="button" onClick={() => handleLinkClick('/contact')} className={mobileSubLink}>
                Contact
              </button>
              <button type="button" onClick={() => handleLinkClick('/track-order')} className={mobileSubLink}>
                Track order
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => toggleMobileAccordion('providers')}
              className={mobileAccordionBtn}
              aria-expanded={mobileAccordion === 'providers'}
            >
              Providers
              <ChevronDown
                size={18}
                className={`text-white/80 transition-transform duration-200 ${mobileAccordion === 'providers' ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 bg-black/30 ${
                mobileAccordion === 'providers' ? 'max-h-24' : 'max-h-0'
              }`}
            >
              <button type="button" onClick={() => handleLinkClick('/provider-signup')} className={mobileSubLink}>
                Join the network
              </button>
            </div>
          </div>
        </nav>

        <div className="shrink-0 grid grid-cols-2 border-t border-white/10 bg-white/[0.02]">
          <a
            href="tel:8313187139"
            className="flex items-center justify-center gap-2 px-3 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors border-r border-white/10"
          >
            <Phone size={16} className="text-brand shrink-0" />
            <span className="truncate">(831) 318-7139</span>
          </a>
          <button
            type="button"
            onClick={() => handleLinkClick('/track-order')}
            className="flex items-center justify-center gap-2 px-3 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          >
            <CheckSquare size={16} className="text-brand shrink-0" />
            Track order
          </button>
        </div>
      </div>
    </>
  );
};
