import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Layers, MessageSquare, CalendarCheck, Locate, Phone, ArrowRight, Home, Building2, KeyRound, CheckSquare, HeartHandshake, BicepsFlexed, Trash2, Container } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMega, setShowServicesMega] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userCity, setUserCity] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const US_STATES_MAP: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
    'district of columbia': 'DC'
  };

  const getUSStateAbbreviation = (stateName: string): string => {
    const clean = stateName.toLowerCase().trim();
    return US_STATES_MAP[clean] || stateName;
  };

  const fetchUserLocation = async () => {
    setIsDetectingLocation(true);
    try {
      // 1. Try Browser Geolocation API first
      if (!navigator.geolocation) {
        throw new Error('Geolocation not supported by browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 6000,
          maximumAge: 600000 // Cache for 10 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      if (!geoRes.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const geoData = await geoRes.json();
      const address = geoData.address;
      if (address) {
        const city = address.city || address.town || address.village || address.hamlet || '';
        const state = address.state || '';
        const countryCode = address.country_code ? address.country_code.toUpperCase() : '';

        if (city) {
          const displayState = countryCode === 'US' ? getUSStateAbbreviation(state) : state;
          const loc = countryCode === 'US'
            ? `${city}, ${displayState}`
            : `${city}, ${countryCode}`;

          setUserCity(loc);
          localStorage.setItem('user_city', loc);
          setIsDetectingLocation(false);
          return;
        }
      }
      throw new Error('Could not parse city from geocoding data');
    } catch (err: any) {
      console.warn('Geolocation failed or denied, checking cache...', err.message);

      // 2. Check localStorage
      const storedCity = localStorage.getItem('user_city');
      if (storedCity) {
        setUserCity(storedCity);
        setIsDetectingLocation(false);
        return;
      }

      // 3. Fall back to IP Address Detection
      try {
        const res = await fetch('https://ipwho.is/');
        const data = await res.json();
        if (data.success && data.city) {
          const loc = data.country_code === 'US'
            ? `${data.city}, ${data.region_code}`
            : `${data.city}, ${data.country_code}`;
          setUserCity(loc);
          localStorage.setItem('user_city', loc);
          return;
        }
        throw new Error('ipwho.is failed');
      } catch {
        try {
          const res2 = await fetch('https://ipapi.co/json/');
          const data2 = await res2.json();
          if (data2.city) {
            const loc = data2.country_code === 'US'
              ? `${data2.city}, ${data2.region_code}`
              : `${data2.city}, ${data2.country_code}`;
            setUserCity(loc);
            localStorage.setItem('user_city', loc);
            return;
          }
        } catch {}
        setUserCity('United States');
      } finally {
        setIsDetectingLocation(false);
      }
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Services', path: '/#services', hasMega: true, icon: <Layers size={16} /> },
    { name: 'Contact', path: '/contact', icon: <MessageSquare size={16} /> },
    { name: 'Book Online', path: '/booking', icon: <CalendarCheck size={16} /> },
    { name: 'Track Order', path: '/track-order', icon: <Locate size={16} /> },
  ];

  const serviceItems = [
    { name: 'Junk Removal', desc: 'Residential & commercial clearing', path: '/services/junk-removal', icon: Trash2 },
    { name: 'Dumpster Rental', desc: 'Roll-off container drop-off & pickup', path: '/services/dumpster-rental', icon: Container },
    { name: 'Property Cleanouts', desc: 'Estate clearing and move-outs', path: '/services/property-cleanout', icon: KeyRound },
    { name: 'Moving Labor', desc: 'Hourly labor for loading and heavy lifting', path: '/services/moving-labor', icon: BicepsFlexed },
  ];

  const handleLinkClick = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogoClick = () => {
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className="shadow-md"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}
      >
        {/* Top Bar - Desktop Only */}
        <div className="hidden md:block bg-gray-50 py-1.5 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <button
              onClick={fetchUserLocation}
              disabled={isDetectingLocation}
              className="flex items-center gap-1.5 text-brand hover:text-brand-600 transition-colors cursor-pointer group disabled:opacity-50"
            >
              <MapPin size={12} className="text-brand group-hover:text-brand-600 transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-wider underline decoration-dotted underline-offset-2">
                {isDetectingLocation ? 'Detecting location...' : userCity || 'Detecting location...'}
              </span>
            </button>
          </div>
        </div>

      {/* Main Navbar */}
      <nav className="py-4 bg-white px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Section - Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group z-[70]" 
            onClick={handleLogoClick}
          >
            <img
              src="/logo1.png"
              alt="Opek Junk Removal"
              className="h-12 w-auto object-contain md:h-14"
            />
          </div>

          {/* Mobile Location - Centered (Mobile Only) */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-[75]">
            <button
              onClick={fetchUserLocation}
              disabled={isDetectingLocation}
              className="flex items-center gap-1.5 text-brand hover:text-brand-600 transition-colors cursor-pointer group disabled:opacity-50 whitespace-nowrap"
            >
              <MapPin size={14} className="text-brand group-hover:text-brand-600 transition-colors" />
              <span className="text-xs font-bold uppercase tracking-wider underline decoration-dotted underline-offset-4">
                {isDetectingLocation ? 'Detecting...' : userCity || 'Detecting...'}
              </span>
            </button>
          </div>

          {/* Right Section - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasMega ? (
                  <div 
                    onMouseEnter={() => setShowServicesMega(true)}
                    onMouseLeave={() => setShowServicesMega(false)}
                  >
                    <button 
                      onClick={() => handleLinkClick(link.path)}
                      className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 bg-transparent border-none cursor-pointer relative group text-secondary hover:text-secondary-600 flex items-center gap-1"
                    >
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${showServicesMega ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-2 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full bg-secondary-400"></span>
                    </button>
                    
                    {/* Mega Menu */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[340px] transition-all duration-300 ${showServicesMega ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-3 pointer-events-none'}`}>
                      <div className="bg-white shadow-2xl border border-secondary-100 rounded-2xl overflow-hidden">
                        <div className="p-4 space-y-1">
                          <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-3 px-2">Services</p>
                          {serviceItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.name}
                                onClick={() => { setShowServicesMega(false); handleLinkClick(item.path); }}
                                className="w-full text-left px-3 py-3 rounded-xl hover:bg-secondary-50 transition-colors group flex items-center gap-3"
                              >
                                <div className="w-8 h-8 rounded-lg bg-secondary-100 group-hover:bg-brand/10 flex items-center justify-center shrink-0 transition-colors">
                                  <Icon size={15} className="text-secondary-500 group-hover:text-brand transition-colors" />
                                </div>
                                <div>
                                  <div className="font-black text-sm text-secondary group-hover:text-brand transition-colors">{item.name}</div>
                                  <div className="text-xs text-secondary-400">{item.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleLinkClick(link.path)}
                    className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 bg-transparent border-none cursor-pointer relative group text-secondary hover:text-secondary-600"
                  >
                    {link.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full bg-brand"></span>
                  </button>
                )}
              </div>
            ))}
            
            <button 
              onClick={() => navigate('/quote')}
              className="group px-8 py-3.5 font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 bg-brand text-white hover:bg-brand-600 hover:shadow-xl rounded-lg shadow-md inline-flex items-center gap-2"
            >
              Get A Quote
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-[50] p-2 focus:outline-none group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <svg
              width="28"
              height="20"
              viewBox="0 0 28 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Top bar — rotates to form top of X */}
              <rect
                x="0" y="1" width="28" height="2.5" rx="1.25"
                fill="#355070"
                style={{
                  transformOrigin: '14px 2.25px',
                  transform: isMenuOpen ? 'translateY(7.75px) rotate(45deg)' : 'none',
                  transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
              {/* Middle bar — brand pink, fades out on open */}
              <rect
                x="4" y="9" width="20" height="2.5" rx="1.25"
                fill="#FF006E"
                style={{
                  transformOrigin: '14px 10.25px',
                  opacity: isMenuOpen ? 0 : 1,
                  transform: isMenuOpen ? 'scaleX(0)' : 'scaleX(1)',
                  transition: 'opacity 0.2s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
              {/* Bottom bar — rotates to form bottom of X */}
              <rect
                x="0" y="17" width="28" height="2.5" rx="1.25"
                fill="#355070"
                style={{
                  transformOrigin: '14px 18.25px',
                  transform: isMenuOpen ? 'translateY(-7.75px) rotate(-45deg)' : 'none',
                  transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Announcement Bar - In-Home Estimates */}
      <div className="bg-secondary px-3 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
          <span className="min-w-0 text-white text-[11px] md:text-xs font-black uppercase tracking-wide sm:tracking-wider leading-tight">
            <span className="hidden sm:inline">Free In-Home Estimates — Providers visit your property</span>
            <span className="sm:hidden">Free In-Home Estimates</span>
          </span>
          <button
            onClick={() => navigate('/in-home-estimate')}
            className="group flex-shrink-0 rounded bg-brand px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-white hover:bg-brand-600 hover:shadow-lg transition-all duration-300 whitespace-nowrap inline-flex items-center gap-1"
          >
            Schedule
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Sidebar Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[320px] bg-white z-[65] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100">
            <img
              src="/logo1.png"
              alt="Opek Junk Removal"
              className="h-10 w-auto object-contain"
            />
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-secondary hover:text-brand transition-colors"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
                <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
              </svg>
            </button>
          </div>

          {/* Quick Actions - Prominent CTAs */}
          <div className="bg-secondary-50 border-b border-secondary-100">
            <div className="flex flex-row gap-0">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/quote');
                }}
                className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl"
              >
                Get Quote
              </button>
              <a
                href="tel:8313187139"
                className="flex-1 px-4 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl text-center"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* Location Badge */}
          {userCity && (
            <div className="px-5 py-3 border-b border-secondary-100">
              <button
                onClick={fetchUserLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2 text-secondary hover:text-brand transition-colors disabled:opacity-50 w-full"
              >
                <MapPin size={16} className="text-brand" />
                <span className="text-sm font-bold">
                  {isDetectingLocation ? 'Detecting location...' : userCity}
                </span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400 mb-3">Menu</p>
            <div className="flex flex-col gap-px bg-secondary-100/60 border border-secondary-100/60 rounded-2xl overflow-hidden shadow-sm">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path.split('#')[0]));
                return (
                  <div key={link.name} className="bg-white group">
                    {link.hasMega ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-secondary-50/20 transition-all duration-300 text-sm font-bold text-secondary"
                        >
                          <span className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-secondary-50 flex items-center justify-center shrink-0 text-brand animate-pulse">
                              {link.icon}
                            </div>
                            <span>{link.name}</span>
                          </span>
                          <ChevronDown size={18} className={`text-secondary-400 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Services Submenu */}
                        <div className={`overflow-hidden transition-all duration-300 ease-out ${mobileServicesOpen ? 'max-h-[400px] border-t border-secondary-100/60 bg-secondary-50/10' : 'max-h-0'}`}>
                          <div className="divide-y divide-secondary-100/60 flex flex-col">
                            {serviceItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.name}
                                  onClick={() => { setMobileServicesOpen(false); setIsMenuOpen(false); navigate(item.path); }}
                                  className="w-full text-left px-6 py-3.5 hover:bg-secondary-50/40 transition-colors group flex items-center gap-3"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-white border border-secondary-200/50 group-hover:bg-brand/10 flex items-center justify-center shrink-0 transition-colors">
                                    <Icon size={14} className="text-secondary-500 group-hover:text-brand transition-colors" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-black text-sm text-secondary group-hover:text-brand transition-colors leading-tight">{item.name}</div>
                                    <div className="text-[10px] text-secondary-400 leading-tight mt-0.5">{item.desc}</div>
                                  </div>
                                  <ArrowRight size={12} className="text-secondary-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleLinkClick(link.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary-50/20 transition-all duration-300 text-sm font-bold ${
                          isActive ? 'text-brand' : 'text-secondary hover:text-brand'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-secondary-50 group-hover:bg-brand/10 flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? 'bg-brand/10 text-brand' : 'text-brand'
                        }`}>
                          {link.icon}
                        </div>
                        <span className="flex-1 text-left">{link.name}</span>
                        <ArrowRight size={14} className="text-secondary-300 group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* In-Home Estimate Link */}
              <div className="bg-white group border-t border-secondary-100/60">
                <button
                  onClick={() => handleLinkClick('/in-home-estimate')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary-50/20 transition-all duration-300 text-sm font-bold text-secondary hover:text-brand"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary-50 group-hover:bg-brand/10 flex items-center justify-center shrink-0 text-brand transition-colors">
                    <CheckSquare size={16} />
                  </div>
                  <span className="flex-1 text-left">In-Home Estimate</span>
                  <ArrowRight size={14} className="text-secondary-300 group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Promo block */}
            <div className="mt-4 pt-4 border-t border-secondary-100">
              <div className="bg-secondary rounded-2xl overflow-hidden border border-white/5 shadow-xl bg-gradient-to-b from-secondary-900 to-secondary flex flex-col">
                <div className="h-20 w-full overflow-hidden shrink-0">
                  <img
                    src="/opek-nav.svg"
                    alt="Opek team"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">Same-day available</span>
                  </div>
                  <h3 className="text-sm font-black text-white leading-snug mb-3">
                    Junk gone today. <span className="text-brand">Free upfront quote.</span>
                  </h3>
                  <button
                    onClick={() => handleLinkClick('/quote')}
                    className="group w-full py-3 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand/10 hover:shadow-brand/20 hover:scale-[1.01]"
                  >
                    Get a Free Quote <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </nav>

        </div>
      </div>
    </>
  );
};