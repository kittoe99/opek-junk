import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Menu, Package, Phone, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserLocation } from '../../lib/userLocation';
import { HomeLogo } from './HomeLogo';

const SITE_PHONE = '8313187139';

const serviceItems = [
  { name: 'Junk Removal', path: '/services/junk-removal' },
  { name: 'Dumpster Rental', path: '/services/dumpster-rental' },
  { name: 'Property Cleanouts', path: '/services/property-cleanout' },
  { name: 'Small Local Moves', path: '/services/small-local-moves' },
  { name: 'Mattress Disposal', path: '/services/mattress-disposal' },
];

/** Light header used on the homepage only. Other pages keep the dark Navbar. */
export const HomeNavbar: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locationLabel, isDetectingLocation, fetchUserLocation } = useUserLocation();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const sync = () => {
      document.documentElement.style.setProperty('--site-header-height', `${header.offsetHeight}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const go = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const iconBtn =
    'flex h-10 w-10 items-center justify-center rounded-none text-[#520f96] hover:bg-[#f2ecfa] transition-colors';

  return (
    <div className="home-light">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-[#e4e0e8]"
      >
        <nav
          className="home-nav max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] md:h-[76px] flex items-center gap-6"
          aria-label="Main"
        >
          <button type="button" onClick={() => go('/')} className="shrink-0 rounded-none" aria-label="Opek Junk Removal home">
            <HomeLogo className="h-7 md:h-8 w-auto" />
          </button>

          <button type="button" onClick={() => setIsMenuOpen(true)} className={`${iconBtn} md:hidden`} aria-label="Open menu" aria-expanded={isMenuOpen}>
            <Menu size={23} aria-hidden />
          </button>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-7 ml-6">
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

          {/* Location + icons */}
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <div className="home-mobile-location md:hidden">
              <button type="button" onClick={() => go('/#service-area')} className="inline-flex items-center font-bold uppercase tracking-wide text-[#520f96]">
                Check your service area <ChevronRight size={11} aria-hidden />
              </button>
              <p className="text-[#3d3547]">
                {locationLabel}{' '}
                <button type="button" onClick={() => go('/#service-area')} className="ml-1 text-[#520f96] underline underline-offset-2">Change</button>
              </p>
            </div>
            <div className="hidden md:block text-right leading-tight">
              <button
                type="button"
                onClick={() => go('/#service-area')}
                className="rounded-none inline-flex items-center gap-0.5 text-[12px] font-semibold uppercase tracking-wide text-[#b0004f] hover:underline"
              >
                Check your service area
                <ChevronRight size={13} aria-hidden />
              </button>
              <p className="text-[14px] text-[#3d3547]">
                <span className="align-middle">{locationLabel}</span>{' '}
                <button
                  type="button"
                  onClick={fetchUserLocation}
                  disabled={isDetectingLocation}
                  className="rounded-none align-middle font-semibold text-[#520f96] underline underline-offset-2 disabled:opacity-50"
                >
                  Change
                </button>
              </p>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <a href={`tel:${SITE_PHONE}`} className={iconBtn} aria-label="Call Opek Junk Removal">
                <Phone size={21} strokeWidth={2.4} aria-hidden />
              </a>
              <button type="button" onClick={() => go('/sign-up')} className={iconBtn} aria-label="Sign up">
                <User size={22} strokeWidth={2.4} aria-hidden />
              </button>
              <span className="hidden sm:block mx-1 h-6 w-px bg-[#d6d0dc]" aria-hidden />
              <button type="button" onClick={() => go('/track-order')} className={iconBtn} aria-label="Track your order">
                <Package size={22} strokeWidth={2.4} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className={`${iconBtn} hidden md:flex lg:hidden`}
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
        className={`fixed inset-0 z-[70] lg:hidden flex flex-col bg-white transition-opacity duration-200 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="shrink-0 flex items-center justify-between h-[64px] px-4 border-b border-[#e4e0e8]">
          <HomeLogo className="h-7 w-auto" />
          <button type="button" onClick={() => setIsMenuOpen(false)} className={iconBtn} aria-label="Close menu">
            <X size={24} strokeWidth={2.4} aria-hidden />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
          <p className="home-eyebrow mb-3">Services</p>
          <ul className="space-y-2">
            {serviceItems.map((item) => (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => go(item.path)}
                  className="home-display w-full rounded-none py-1.5 text-left text-[1.6rem] leading-tight text-[#140a1f]"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-2 border-t border-[#e4e0e8] pt-5">
            {[['Track your order', '/track-order'], ['Contact us', '/contact'], ['Free estimate', '/in-home-estimate'], ['Become a provider', '/provider-signup'], ['Provider account', '/sign-up']].map(([label, path]) => (
              <button key={path} type="button" onClick={() => go(path)} className="min-h-11 rounded-none text-left text-sm font-semibold text-[#520f96]">{label}</button>
            ))}
          </div>
        </nav>
        <div className="shrink-0 p-4 border-t border-[#e4e0e8]">
          <button type="button" onClick={() => go('/quote')} className="home-cta w-full">
            Get my price
          </button>
        </div>
      </div>
    </div>
  );
};
