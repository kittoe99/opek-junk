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
                className="px-8 py-3.5 font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 bg-black text-white hover:bg-gray-800"
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

      {/* Full Screen Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[50] flex flex-col justify-center px-8 transition-transform duration-700 cubic-bezier(0.7, 0, 0.3, 1) ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col space-y-8 max-w-lg mx-auto w-full">
          {navLinks.map((link, idx) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link)}
              className={`text-5xl font-black italic uppercase text-left text-black tracking-tighter transition-all duration-700 transform ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {link.name}
            </button>
          ))}
          
          {currentView !== 'quote' && (
            <div 
              className={`pt-8 transition-all duration-700 delay-400 transform ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
            >
               <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate('quote');
                }}
                className="w-full py-6 bg-black text-white text-xl font-black uppercase italic flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                Instant Quote <ArrowRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};