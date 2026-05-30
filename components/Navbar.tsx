import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, MapPin, Layers, MessageSquare, CalendarCheck, Locate, Phone, ArrowRight, Home, Building2, KeyRound, CheckSquare, HeartHandshake, BicepsFlexed, Trash2, Container } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMega, setShowServicesMega] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userCity, setUserCity] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const fetchUserLocation = async () => {
    setIsDetectingLocation(true);
    try {
      // ipwho.is: free, HTTPS, CORS-enabled, no API key
      const res = await fetch('https://ipwho.is/');
      const data = await res.json();
      if (data.success && data.city) {
        const loc = data.country_code === 'US'
          ? `${data.city}, ${data.region_code}`
          : `${data.city}, ${data.country_code}`;
        setUserCity(loc);
        return;
      }
      throw new Error('ipwho.is failed');
    } catch {
      try {
        // Fallback: ipapi.co
        const res2 = await fetch('https://ipapi.co/json/');
        const data2 = await res2.json();
        if (data2.city) {
          const loc = data2.country_code === 'US'
            ? `${data2.city}, ${data2.region_code}`
            : `${data2.city}, ${data2.country_code}`;
          setUserCity(loc);
          return;
        }
      } catch {}
      // Final fallback so the bar still shows
      setUserCity('United States');
    } finally {
      setIsDetectingLocation(false);
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
    { name: 'Donations Pickup', desc: 'Pickup and delivery to local charities', path: '/services/donations-pickup', icon: HeartHandshake },
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
            className="md:hidden relative z-[50] p-2 focus:outline-none transition-colors duration-300 text-black"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={28} />
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
            >
              <X size={24} />
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
            <div className="space-y-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path.split('#')[0]));
                return (
                <div key={link.name}>
                  {link.hasMega ? (
                    <div className="border-b border-secondary-50 last:border-0">
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="w-full flex items-center justify-between py-3 text-sm font-bold transition-colors"
                      >
                        <span className="flex items-center gap-3 text-secondary">
                          <span className="w-8 h-8 flex items-center justify-center text-brand">{link.icon}</span>
                          {link.name}
                        </span>
                        <ChevronDown size={18} className={`text-secondary-400 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Services Submenu */}
                      <div className={`overflow-hidden transition-all duration-300 ease-out ${mobileServicesOpen ? 'max-h-[400px] opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
                        <div className="space-y-1 pt-1">
                          {serviceItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.name}
                                onClick={() => { setMobileServicesOpen(false); handleLinkClick(item.path); }}
                                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-secondary-50 transition-colors group flex items-center gap-3"
                              >
                                <div className="w-8 h-8 rounded-lg bg-secondary-100 group-hover:bg-brand/10 flex items-center justify-center shrink-0 transition-colors">
                                  <Icon size={14} className="text-secondary-500 group-hover:text-brand transition-colors" />
                                </div>
                                <div>
                                  <div className="font-black text-sm text-secondary group-hover:text-brand transition-colors leading-tight">{item.name}</div>
                                  <div className="text-[10px] text-secondary-400 leading-tight">{item.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      className={`w-full flex items-center gap-3 py-3 text-sm font-bold border-b border-secondary-50 last:border-0 transition-colors ${
                        isActive ? 'text-brand' : 'text-secondary hover:text-brand'
                      }`}
                    >
                      <span className={`w-8 h-8 flex items-center justify-center ${isActive ? 'text-brand' : 'text-brand'}`}>
                        {link.icon}
                      </span>
                      {link.name}
                    </button>
                  )}
                </div>
              );
              })}
            </div>

            {/* Additional Links */}
            <div className="mt-4 pt-4 border-t border-secondary-100 space-y-0.5">
              <button
                onClick={() => handleLinkClick('/in-home-estimate')}
                className="w-full flex items-center gap-3 py-3 text-sm font-bold text-secondary hover:text-brand transition-colors"
              >
                <span className="w-8 h-8 flex items-center justify-center text-brand">
                  <CheckSquare size={16} />
                </span>
                In-Home Estimate
              </button>
            </div>

            {/* Promo block */}
            <div className="mt-4 pt-4 border-t border-secondary-100">
              <div className="bg-secondary rounded-2xl overflow-hidden">
                <div className="relative h-20 w-full">
                  <img
                    src="/opek-nav.svg"
                    alt="Opek team"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
                </div>
                <div className="px-4 pb-4 -mt-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Same-day available</p>
                  <p className="text-sm font-black text-white leading-snug mb-3">Junk gone today.<br /><span className="text-brand">Free upfront quote.</span></p>
                  <button
                    onClick={() => handleLinkClick('/quote')}
                    className="w-full py-2.5 bg-brand text-white text-xs font-black uppercase tracking-wider rounded-lg hover:bg-brand-600 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Get a Free Quote <ArrowRight size={13} />
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