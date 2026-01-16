import React, { useState, useEffect } from 'react';
import { Menu, X, Trash2, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'quote' | 'contact';
  onNavigate: (view: 'home' | 'quote' | 'contact', sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showServicesMega, setShowServicesMega] = useState(false);

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
    { name: 'Book Online', type: 'quote' as const },
  ];

  const serviceItems = [
    { name: 'Residential Junk Removal', desc: 'Home cleanouts and decluttering' },
    { name: 'Commercial Services', desc: 'Office and retail space clearing' },
    { name: 'Construction Debris', desc: 'Post-construction cleanup' },
    { name: 'Appliance Removal', desc: 'Large appliance hauling' },
    { name: 'Furniture Disposal', desc: 'Old furniture removal' },
    { name: 'Yard Waste', desc: 'Landscaping debris removal' },
  ];

  const handleLinkClick = (link: { name: string, sectionId?: string, type: 'home' | 'quote' | 'contact' }) => {
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
          
          {/* Logo Section - Industrial Rebrand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group z-[70]" 
            onClick={handleLogoClick}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-black text-white transition-all duration-300">
              {isStandalonePage && !isMenuOpen ? (
                <ArrowLeft size={24} />
              ) : (
                <Trash2 size={24} className="group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl tracking-tighter uppercase text-black transition-colors duration-300">
                OPEK
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Junk Removal</span>
            </div>
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

      {/* Mobile Sidebar Menu - Simplified */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-80 bg-white z-[50] shadow-2xl transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-black uppercase tracking-tight">Menu</h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-2 px-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link)}
                  className="w-full text-left px-4 py-4 text-base font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-6 border-t border-gray-200 space-y-4">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigate('quote');
              }}
              className="w-full py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center justify-center gap-2"
            >
              Get A Quote
              <ArrowRight size={18} />
            </button>
            
            {/* Contact Info */}
            <div className="pt-4 space-y-2">
              <p className="text-sm text-gray-600 font-medium">(303) 555-0199</p>
              <p className="text-sm text-gray-600 font-medium">hello@opekjunk.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[45] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};