import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, MapPin, Smartphone } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMega, setShowServicesMega] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userCity, setUserCity] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user's city based on IP address with improved accuracy
  const fetchUserLocation = async () => {
    setIsDetectingLocation(true);
    try {
      // Get IP first, then use it for geolocation
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData.ip;
      
      console.log('User IP:', userIp);
      
      // Use ipwho.is with the IP (free, unlimited, HTTPS)
      const geoResponse = await fetch(`https://ipwho.is/${userIp}`);
      const geoData = await geoResponse.json();
      
      console.log('Geolocation response:', geoData);
      
      if (geoData.success && geoData.city && geoData.region_code) {
        setUserCity(`${geoData.city}, ${geoData.region_code}`);
        console.log('Location set:', `${geoData.city}, ${geoData.region_code}`);
      } else {
        // Set default location if API fails
        setUserCity('Your Location');
        console.log('Using default location - API returned:', geoData);
      }
    } catch (error) {
      console.error('Failed to fetch location:', error);
      // Set default location on error
      setUserCity('Your Location');
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
    { name: 'Services', path: '/#services', hasMega: true },
    { name: 'Contact', path: '/contact' },
    { name: 'Book Online', path: '/booking' },
  ];

  const serviceItems = [
    { name: 'Residential Junk Removal', desc: 'Home cleanouts and decluttering', path: '/services/residential' },
    { name: 'Commercial Services', desc: 'Office and retail space clearing', path: '/services/commercial' },
    { name: 'Construction Debris', desc: 'Post-construction cleanup', path: '/services/construction' },
    { name: 'E-Waste & Appliance Recycling', desc: 'Responsible electronics disposal', path: '/services/e-waste' },
    { name: 'Full Property Cleanouts', desc: 'Estate clearing and move-outs', path: '/services/property-cleanout' },
    { name: 'Dumpster Rental', desc: 'Flexible sizes for any project', path: '/services/dumpster-rental' },
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
      {/* Top Bar - Desktop Only */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-[61] bg-gray-50 py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {userCity && (
            <button
              onClick={fetchUserLocation}
              disabled={isDetectingLocation}
              className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors cursor-pointer group disabled:opacity-50"
            >
              <MapPin size={12} className="text-gray-400 group-hover:text-black transition-colors" />
              <span className="text-[11px] font-bold uppercase tracking-wider underline decoration-dotted underline-offset-2">
                {isDetectingLocation ? 'Detecting...' : userCity}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className="fixed top-0 md:top-[28px] left-0 right-0 z-[60] py-4 bg-white shadow-md px-6"
      >
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
          {userCity ? (
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-[75]">
              <button
                onClick={fetchUserLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors cursor-pointer group disabled:opacity-50 whitespace-nowrap"
              >
                <MapPin size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider underline decoration-dotted underline-offset-4">
                  {isDetectingLocation ? 'Detecting...' : userCity}
                </span>
              </button>
            </div>
          ) : null}

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
                      className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 bg-transparent border-none cursor-pointer relative group text-gray-900 hover:text-black flex items-center gap-1"
                    >
                      {link.name}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${showServicesMega ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-2 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full bg-black"></span>
                    </button>
                    
                    {/* Mega Menu */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white shadow-2xl border border-gray-200 rounded-xl transition-all duration-300 ${showServicesMega ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          {serviceItems.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                setShowServicesMega(false);
                                handleLinkClick(item.path);
                              }}
                              className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="font-bold text-sm text-black group-hover:text-gray-900 mb-1">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleLinkClick(link.path)}
                    className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 bg-transparent border-none cursor-pointer relative group text-gray-900 hover:text-black"
                  >
                    {link.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full bg-black"></span>
                  </button>
                )}
              </div>
            ))}
            
            <button 
              onClick={() => navigate('/quote')}
              className="px-8 py-3.5 font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 bg-black text-white hover:bg-gray-800 rounded-lg shadow-md"
            >
              Get A Quote
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

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Sidebar Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[305px] bg-white z-[65] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <img
              src="/logo1.png"
              alt="Opek Junk Removal"
              className="h-9 w-auto object-contain"
            />
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Location Badge */}
          {userCity && (
            <div className="mx-5 mt-4 mb-1">
              <button
                onClick={fetchUserLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-500 hover:text-black transition-colors disabled:opacity-50 w-full"
              >
                <MapPin size={13} className="shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isDetectingLocation ? 'Detecting...' : userCity}
                </span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-2 px-1">Navigation</p>
            <div className="space-y-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path.split('#')[0]));
                return (
                <div key={link.name}>
                  {link.hasMega ? (
                    <div>
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
                          mobileServicesOpen ? 'bg-black text-white' : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180 text-white/60' : 'text-gray-400'}`} />
                      </button>
                      
                      {/* Services Submenu */}
                      <div className={`overflow-hidden transition-all duration-300 ease-out ${mobileServicesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="py-1.5 space-y-0.5">
                          {serviceItems.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                setMobileServicesOpen(false);
                                handleLinkClick(item.path);
                              }}
                              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group flex items-start gap-2.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-gray-300 mt-2 shrink-0 group-hover:bg-black transition-colors"></span>
                              <div>
                                <div className="text-[13px] font-semibold text-gray-800 group-hover:text-black">{item.name}</div>
                                <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{item.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      className={`w-full flex items-center px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
                        isActive ? 'bg-gray-100 text-black' : 'text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </button>
                  )}
                </div>
              );
              })}

              <div className="h-px bg-gray-100 my-2"></div>

              {/* Provider Signup Link */}
              <button
                onClick={() => handleLinkClick('/provider-signup')}
                className="w-full flex items-center px-3 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
              >
                Become a Provider
              </button>
            </div>
          </nav>

          {/* Nav Image with CTA overlay */}
          <div className="px-5 pb-2">
            <div className={`relative rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 ${mobileServicesOpen ? 'h-0 opacity-0 border-0 shadow-none' : 'h-36 opacity-100'}`}>
              <img
                src="/opek-nav.webp"
                alt="Opek Junk Removal"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/quote');
                  }}
                  className="px-6 py-2.5 bg-transparent text-white text-xs font-bold uppercase tracking-wider border border-white hover:bg-white/20 transition-colors rounded-lg"
                >
                  Get A Quote
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-5 pt-3 space-y-2.5 border-t border-gray-100">
            {/* Download App Card */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 text-black rounded-lg text-[11px] font-bold hover:bg-gray-200 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 text-black rounded-lg text-[11px] font-bold hover:bg-gray-200 transition-colors">
                <Smartphone size={13} />
                Google Play
              </button>
            </div>

            <a href="tel:8313187139" className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-bold hover:text-black transition-colors py-1">
              <span>Call us: (831) 318-7139</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};