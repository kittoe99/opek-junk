import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'quote' | 'contact' | 'booking';
  onNavigate: (view: 'home' | 'quote' | 'contact' | 'booking', sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMega, setShowServicesMega] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { name: 'Services', sectionId: 'services', type: 'home' as const, hasMega: true },
    { name: 'Contact', type: 'contact' as const },
    { name: 'Book Online', type: 'booking' as const },
  ];

  const serviceItems = [
    { name: 'Residential Junk Removal', desc: 'Home cleanouts and decluttering' },
    { name: 'Commercial Services', desc: 'Office and retail space clearing' },
    { name: 'Construction Debris', desc: 'Post-construction cleanup' },
    { name: 'Appliance Removal', desc: 'Large appliance hauling' },
    { name: 'Furniture Disposal', desc: 'Old furniture removal' },
    { name: 'Yard Waste', desc: 'Landscaping debris removal' },
  ];

  const handleLinkClick = (link: { name: string, sectionId?: string, type: 'home' | 'quote' | 'contact' | 'booking' }) => {
    setIsMenuOpen(false);
    onNavigate(link.type, link.sectionId);
  };

  const handleLogoClick = () => {
    setIsMenuOpen(false);
    onNavigate('home');
  };

  const isStandalonePage = currentView === 'quote' || currentView === 'contact';

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-[60] py-4 bg-white shadow-md px-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group z-[70]" 
            onClick={handleLogoClick}
          >
            {isStandalonePage && !isMenuOpen ? (
              <div className="w-12 h-12 flex items-center justify-center bg-black text-white transition-all duration-300">
                <ArrowLeft size={24} />
              </div>
            ) : (
              <img
                src="/logo1.png"
                alt="OPEK Junk Removal"
                className="h-12 w-auto object-contain md:h-14"
              />
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasMega ? (
                  <div 
                    onMouseEnter={() => setShowServicesMega(true)}
                    onMouseLeave={() => setShowServicesMega(false)}
                  >
                    <button 
                      onClick={() => handleLinkClick(link)}
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
                                handleLinkClick(link);
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
                    onClick={() => handleLinkClick(link)}
                    className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 bg-transparent border-none cursor-pointer relative group text-gray-900 hover:text-black"
                  >
                    {link.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full bg-black"></span>
                  </button>
                )}
              </div>
            ))}
            
            <button 
              onClick={() => onNavigate('quote')}
              className="px-8 py-3.5 font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 bg-black text-white hover:bg-gray-800 rounded-lg shadow-md"
            >
              Get A Quote
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden relative z-[70] p-2 focus:outline-none transition-colors duration-300 text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Minimalistic Dropdown */}
      <div 
        className={`fixed top-[72px] left-0 right-0 bg-white shadow-lg z-[50] transition-all duration-300 ease-out md:hidden ${
          isMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <nav className="px-6 py-6">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.hasMega ? (
                  <div>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Mobile Services Submenu */}
                    <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="py-2 space-y-1">
                        {serviceItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => {
                              setMobileServicesOpen(false);
                              handleLinkClick(link);
                            }}
                            className="w-full text-center py-2 text-xs text-gray-600 hover:text-black transition-colors"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors"
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigate('quote');
              }}
              className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-lg"
            >
              Get A Quote
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 z-[45] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};