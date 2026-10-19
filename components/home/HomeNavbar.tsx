import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, MapPin, Menu, MessageSquare, Phone, User, UserPlus, X } from 'lucide-react';
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
  const closeRef = useRef<HTMLButtonElement>(null);
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
        className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-[#e4e0e8]"
      >
        <nav
          className="home-nav max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] md:h-[76px] flex items-center gap-6"
          aria-label="Main"
        >
          <button type="button" onClick={() => go('/')} className="shrink-0 rounded-none" aria-label="Opek Junk Removal home">
            <HomeLogo className="h-7 md:h-8 w-auto" />
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

          {/* Location + responsive menu */}
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 md:hidden">
              <a
                href={`tel:${SITE_PHONE}`}
                className="flex h-11 shrink-0 items-center gap-1.5 text-[13px] font-black whitespace-nowrap text-[#520f96] hover:text-[#751bb5]"
                aria-label="Call Opek Junk Removal at (831) 318-7139"
              >
                <Phone size={15} strokeWidth={3} aria-hidden />
                <span className="underline underline-offset-4">(831) 318-7139</span>
              </a>
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="ui-icon-button flex h-11 w-11 items-center justify-center rounded-full bg-[#520f96] text-white"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <Menu size={21} strokeWidth={2.4} aria-hidden />
              </button>
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
            <div className="hidden md:flex lg:hidden">
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

        {/* Mobile location strip */}
        <div className="md:hidden flex items-center justify-between gap-3 min-h-[44px] px-4 bg-[#f4eefc] border-t border-[#ebe3f5] text-[13px]">
          <span className="flex min-w-0 items-center gap-1.5 text-[#3d3547]">
            <MapPin size={14} className="shrink-0 text-[#520f96]" strokeWidth={2.4} aria-hidden />
            <span className="truncate font-semibold">{locationLabel}</span>
          </span>
          <button
            type="button"
            onClick={() => go('/#service-area')}
            className="min-h-[44px] shrink-0 inline-flex items-center gap-0.5 rounded-none font-bold text-[#520f96]"
          >
            Check service area
            <ChevronRight size={14} aria-hidden />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={`absolute inset-0 flex flex-col bg-[#520f96] text-white transition-[opacity,transform] duration-300 ease-out ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="shrink-0 flex items-center justify-between h-[64px] px-6">
            <button type="button" onClick={() => go('/')} className="rounded-none" aria-label="Opek Junk Removal home">
              <img src="/opek-logo-white.png" alt="Opek Junk Removal" className="h-[26px] w-auto" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="ui-icon-button -mr-2 flex h-11 w-11 items-center justify-center rounded-none text-white"
              aria-label="Close menu"
            >
              <X size={28} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto overscroll-contain px-6 pt-6 pb-10" aria-label="Mobile">
            {/* Primary links */}
            <ul className="space-y-1">
              {serviceItems.map(({ name, path }) => (
                <li key={path}>
                  <button
                    type="button"
                    onClick={() => go(path)}
                    className="home-display w-full rounded-none py-2.5 text-left text-[1.6rem] leading-none text-white hover:opacity-80"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Utility links */}
            <ul className="mt-6 space-y-1">
              <li>
                <button type="button" onClick={() => go('/#service-area')} className="home-menu-util">
                  <MapPin size={17} strokeWidth={2.4} aria-hidden />
                  <span className="truncate">Check your area · {locationLabel}</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('/provider-signup')} className="home-menu-util">
                  <UserPlus size={17} strokeWidth={2.4} aria-hidden />
                  Become a provider
                </button>
              </li>
              <li>
                <button type="button" onClick={() => go('/sign-up')} className="home-menu-util">
                  <User size={17} strokeWidth={2.4} aria-hidden />
                  Provider account
                </button>
              </li>
            </ul>

            <div className="my-7 h-px bg-white/20 shadow-[0_8px_16px_rgba(20,0,50,0.35)]" aria-hidden />

            {/* Help */}
            <p className="home-display text-center text-[1.15rem] leading-tight">Questions? Talk to a real person.</p>
            <div className="mx-auto mt-4 grid max-w-[300px] grid-cols-2 gap-2.5">
              <a href={`tel:${SITE_PHONE}`} className="flex min-h-11 items-center justify-center gap-2 border-2 border-white/80 text-[14px] font-bold">
                <Phone size={16} aria-hidden />
                Call
              </a>
              <a href={`sms:${SITE_PHONE}`} className="flex min-h-11 items-center justify-center gap-2 border-2 border-white/80 text-[14px] font-bold">
                <MessageSquare size={16} aria-hidden />
                Text
              </a>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => go('/quote')}
                className="home-cta !bg-white !text-[#520f96] min-w-[200px] hover:!bg-[#f2ecfa]"
              >
                Get pricing
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
