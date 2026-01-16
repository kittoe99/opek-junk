import React, { useState, useEffect } from 'react';
import { Menu, X, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'quote' | 'contact';
  onNavigate: (view: 'home' | 'quote' | 'contact', sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    { name: 'Services', sectionId: 'services', type: 'home' as const },
    { name: 'Radius', sectionId: 'service-area', type: 'home' as const },
    { name: 'Contact', type: 'contact' as const },
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
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleLinkClick(link)}
                className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 bg-transparent border-none cursor-pointer relative group text-gray-900 hover:text-black"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full bg-black"></span>
              </button>
            ))}
            
            {currentView !== 'quote' && (
              <button 
                onClick={() => onNavigate('quote')}
                className="px-8 py-3.5 font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 bg-black text-white hover:bg-gray-800 rounded-lg shadow-md"
              >
                Get Estimate
              </button>
            )}
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

      {/* Mobile Menu Overlay - Redesigned */}
      <div 
        className={`fixed inset-0 bg-black z-[50] flex flex-col transition-all duration-500 ease-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)',
          }} />
        </div>

        <div className="relative flex flex-col justify-between h-full px-6 py-24">
          {/* Navigation Links */}
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link, idx) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link)}
                className={`group text-left transition-all duration-500 transform ${
                  isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-1 h-12 bg-white transition-all duration-300 group-hover:h-16 group-hover:bg-gray-300" />
                  <span className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {link.name}
                  </span>
                </div>
              </button>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className={`space-y-6 transition-all duration-500 delay-300 transform ${
            isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {currentView !== 'quote' && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate('quote');
                }}
                className="w-full py-5 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors rounded-lg shadow-lg flex items-center justify-center gap-3"
              >
                Get Your Quote
                <ArrowRight size={20} />
              </button>
            )}
            
            {/* Contact Info */}
            <div className="pt-6 border-t border-white/20">
              <div className="text-white/60 text-sm font-medium space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  (303) 555-0199
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                  hello@opekjunk.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};