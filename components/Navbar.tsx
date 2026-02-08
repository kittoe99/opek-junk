import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, MapPin } from 'lucide-react';
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
        className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[65] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Menu</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={22} className="text-gray-600" />
            </button>
          </div>

          {/* Location Badge */}
          {userCity && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <button
                onClick={fetchUserLocation}
                disabled={isDetectingLocation}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors disabled:opacity-50"
              >
                <MapPin size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isDetectingLocation ? 'Detecting...' : userCity}
                </span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasMega ? (
                    <div>
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="w-full flex items-center justify-between px-3 py-3.5 rounded-xl text-sm font-bold text-black hover:bg-gray-50 transition-colors"
                      >
                        <span>{link.name}</span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Services Submenu */}
                      <div className={`overflow-hidden transition-all duration-300 ease-out ${mobileServicesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-3 pr-1 py-1 space-y-0.5">
                          {serviceItems.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                setMobileServicesOpen(false);
                                handleLinkClick(item.path);
                              }}
                              className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="text-sm font-semibold text-gray-800 group-hover:text-black">{item.name}</div>
                              <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      className="w-full flex items-center px-3 py-3.5 rounded-xl text-sm font-bold text-black hover:bg-gray-50 transition-colors"
                    >
                      {link.name}
                    </button>
                  )}
                </div>
              ))}

              {/* Provider Signup Link */}
              <button
                onClick={() => handleLinkClick('/provider-signup')}
                className="w-full flex items-center px-3 py-3.5 rounded-xl text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
              >
                Become a Provider
              </button>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100 space-y-3">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/quote');
              }}
              className="w-full py-3.5 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-xl"
            >
              Get A Quote
            </button>
            <div className="text-center">
              <a href="tel:(303)555-0199" className="text-xs text-gray-400 font-bold hover:text-black transition-colors">
                (303) 555-0199
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};