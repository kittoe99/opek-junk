import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, MapPin, Menu, Phone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserLocation } from '../../lib/userLocation';
import { HomeLogo } from './HomeLogo';

const SITE_PHONE = '+18777574365';

const serviceItems = [
  { name: 'Junk Removal', path: '/services/junk-removal' },
  { name: 'Dumpster Rental', path: '/services/dumpster-rental' },
  { name: 'Property Cleanouts', path: '/services/property-cleanout' },
  { name: 'Small Local Moves', path: '/services/small-local-moves' },
  { name: 'Move-Out Cleaning', path: '/services/move-out-cleaning' },
];

const helpItems = [
  { name: 'Get a quote', path: '/quote' },
  { name: 'Track an order', path: '/track-order' },
  { name: 'In-home estimate', path: '/in-home-estimate' },
  { name: 'Contact us', path: '/contact' },
];

const providerItems = [
  { name: 'Become a provider', path: '/provider-signup' },
  { name: 'Provider account', path: '/sign-up' },
];

/** Light header used on the homepage only. Other pages keep the dark Navbar. */
export const HomeNavbar: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const isCondensedRef = useRef(false);
  isCondensedRef.current = isCondensed;
  const { userCity, locationLabel, isDetectingLocation } = useUserLocation();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    // Keep the full header height while condensed (or animating) so page content never jumps under the scroll.
    let animating = false;
    const sync = () => {
      if (isCondensedRef.current || animating) return;
      document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
    };
    const onRun = (e: TransitionEvent) => {
      if (e.propertyName === 'height') animating = true;
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'height') return;
      animating = false;
      sync();
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    header.addEventListener('transitionrun', onRun);
    header.addEventListener('transitionend', onEnd);
    header.addEventListener('transitioncancel', onEnd);
    return () => {
      observer.disconnect();
      header.removeEventListener('transitionrun', onRun);
      header.removeEventListener('transitionend', onEnd);
      header.removeEventListener('transitioncancel', onEnd);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    if (!isMenuOpen) return () => {
      document.body.style.overflow = 'unset';
    };
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const go = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const iconBtn =
    'ui-icon-button flex h-11 w-11 items-center justify-center rounded-none text-[#520f96] hover:bg-[#f2ecfa] transition-colors';

  return (
    <div className="home-light">
      <header
        ref={headerRef}
        data-condensed={isCondensed || undefined}
        className={`fixed top-0 left-0 right-0 z-[60] bg-white border-b transition-[box-shadow,border-color] duration-300 ease-out ${
          isCondensed ? 'border-transparent shadow-[0_6px_20px_-12px_rgba(20,10,31,0.35)]' : 'border-[#e4e0e8]'
        }`}
      >
        <nav
          className="home-nav max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6"
          aria-label="Main"
        >
          <button type="button" onClick={() => go('/')} className="shrink-0 rounded-none" aria-label="Opek Junk Removal home">
            <HomeLogo className="h-12 md:h-14 w-auto" animateOnScroll onCondensedChange={setIsCondensed} />
          </button>

          {/* Desktop links */}
          <ul className="hidden xl:flex items-center gap-6 ml-2">
            {serviceItems.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => go(item.path)}
                  className="rounded-none py-2 text-[16px] font-semibold text-[#140a1f] hover:text-[#520f96] whitespace-nowrap"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Location + responsive menu */}
          <div className="ml-auto flex min-w-0 items-center gap-1 md:gap-4">
            <button
              type="button"
              onClick={() => go('/#service-area')}
              className="nav-loc"
              aria-label={userCity ? `Serving ${userCity}. Check your service area` : 'Check your service area'}
            >
              <MapPin size={16} strokeWidth={2.4} className="nav-loc-pin" aria-hidden />
              <span className="nav-loc-city">{userCity || (isDetectingLocation ? 'Locating…' : 'Your area')}</span>
              <ChevronRight size={14} strokeWidth={2.6} className="nav-loc-chev" aria-hidden />
            </button>
            <div className="flex items-center md:hidden -mr-2">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="mnav-icon"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <Menu size={26} strokeWidth={2.2} aria-hidden />
              </button>
            </div>
            <div className="hidden md:flex xl:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className={iconBtn}
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <Menu size={24} strokeWidth={2.4} aria-hidden />
              </button>
            </div>
          </div>
        </nav>

      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[70] xl:hidden ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={`home-menu-light absolute inset-0 flex flex-col bg-white text-[#141414] transition-[opacity,transform] duration-300 ease-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="mnav-top">
            <button type="button" onClick={() => go('/')} className="rounded-none" aria-label="Opek Junk Removal home">
              <HomeLogo className="h-12 md:h-14 w-auto" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="mnav-icon ml-auto -mr-2"
              aria-label="Close menu"
            >
              <X size={26} strokeWidth={2.2} aria-hidden />
            </button>
          </div>

          <nav className="mnav-body" aria-label="Mobile">
            <div className="mnav-location">
              <MapPin size={18} strokeWidth={2.2} aria-hidden />
              <span className="mnav-location-label">{locationLabel}</span>
              <button type="button" onClick={() => go('/#service-area')} className="mnav-location-link">
                Check area
              </button>
            </div>

            <p className="mnav-group">Services</p>
            <ul className="mnav-list">
              {serviceItems.map(({ name, path }) => (
                <li key={path}>
                  <button type="button" onClick={() => go(path)} className="mnav-row mnav-row--service">
                    <span className="mnav-row-title">{name}</span>
                    <ChevronRight size={22} strokeWidth={2} className="mnav-chev" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            <p className="mnav-group">Help</p>
            <ul className="mnav-list">
              {helpItems.map(({ name, path }) => (
                <li key={path}>
                  <button type="button" onClick={() => go(path)} className="mnav-row">
                    <span className="mnav-row-label">{name}</span>
                    <ChevronRight size={20} strokeWidth={2} className="mnav-chev" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            <p className="mnav-group">Providers</p>
            <ul className="mnav-list">
              {providerItems.map(({ name, path }) => (
                <li key={path}>
                  <button type="button" onClick={() => go(path)} className="mnav-row">
                    <span className="mnav-row-label">{name}</span>
                    <ChevronRight size={20} strokeWidth={2} className="mnav-chev" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mnav-actions">
            <button type="button" onClick={() => go('/quote')} className="home-cta mnav-actions-btn">
              Get my price
            </button>
            <a href={`tel:${SITE_PHONE}`} className="home-start-bar-call mnav-actions-call" aria-label="Call Opek Junk Removal">
              <Phone size={20} strokeWidth={2.2} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
