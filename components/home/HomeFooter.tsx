import React from 'react';
import { ChevronDown, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeLogo } from './HomeLogo';

const SITE_PHONE = '+18777574365';
const SITE_PHONE_DISPLAY = '(877) 757-4365';

const columns = [
  {
    title: 'Services',
    links: [
      { label: 'Junk Removal', to: '/services/junk-removal' },
      { label: 'Dumpster Rental', to: '/services/dumpster-rental' },
      { label: 'Property Cleanouts', to: '/services/property-cleanout' },
      { label: 'Moving Labor', to: '/services/moving-labor' },
      { label: 'Move-Out Cleaning', to: '/services/move-out-cleaning' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Get a Quote', to: '/quote' },
      { label: 'Book Online', to: '/booking' },
      { label: 'In-Home Estimate', to: '/in-home-estimate' },
      { label: 'Track Order', to: '/track-order' },
      { label: 'Dallas–Fort Worth', to: '/locations/dallas-fort-worth' },
      { label: 'Jacksonville', to: '/locations/jacksonville' },
      { label: 'Atlanta', to: '/locations/atlanta' },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'Become a Provider', to: '/provider-signup' },
      { label: 'Create an Account', to: '/sign-up' },
    ],
  },
];

const socials = [
  {
    label: 'Opek on Facebook',
    href: 'https://facebook.com/opekjunk',
    path: 'M14 8h3V4h-3c-2.8 0-4.5 1.9-4.5 4.6V11H7v4h2.5v9h4v-9H16.5l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z',
  },
  {
    label: 'Opek on Instagram',
    href: 'https://instagram.com/opekjunk',
    path: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm4.75-3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  },
  {
    label: 'Opek on X',
    href: 'https://twitter.com/opekjunk',
    path: 'M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z',
  },
];

const disclaimer =
  'Opek Junk Removal is a technology platform that connects customers with independent local service providers. Opek Junk Removal does not perform junk removal, hauling, or moving labor services itself; all services are performed by independent, third-party service providers who are responsible for their own operations, licensing, and insurance.';

const contactIconClass =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-white/10 transition-colors group-hover:bg-white/20';

/** Deep-purple site footer. The logo follows --home-purple, so it is set to white here. */
export const HomeFooter: React.FC = () => (
  <footer className="home-light">
    <div className="bg-[#520f96] text-white" style={{ '--home-purple': '#fff' } as React.CSSProperties}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 pb-8 md:pt-16 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] gap-10 lg:gap-16">
        <div>
          <Link to="/" className="inline-block transition-opacity hover:opacity-85" aria-label="Opek Junk Removal home">
            <HomeLogo className="h-14 md:h-16 w-auto" alt="" />
          </Link>
          <p className="home-display mt-6 max-w-[420px] text-[1.6rem] leading-[1.05] sm:text-[2rem]">
            Clear the clutter. Book in minutes.
          </p>

          <div className="mt-7 space-y-3">
            <a href={`tel:${SITE_PHONE}`} className="group flex items-center gap-3.5">
              <span className={contactIconClass}><Phone size={20} aria-hidden /></span>
              <span className="min-w-0">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-white/80">Call or text any time</span>
                <span className="block text-[1.25rem] font-extrabold leading-tight group-hover:underline underline-offset-2">{SITE_PHONE_DISPLAY}</span>
              </span>
            </a>
            <a href="mailto:Support@opekjunkremoval.com" className="group flex items-center gap-3.5">
              <span className={contactIconClass}><Mail size={20} aria-hidden /></span>
              <span className="min-w-0">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-white/80">Email us</span>
                <span className="block [overflow-wrap:anywhere] text-[14px] font-semibold group-hover:underline underline-offset-2">Support@opekjunkremoval.com</span>
              </span>
            </a>
          </div>

          <ul className="mt-6 flex items-center gap-2.5">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="ui-icon-button flex h-11 w-11 items-center justify-center bg-white/10 transition-colors hover:bg-white/20">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {/* Phone: collapsible groups */}
          <div className="sm:hidden border-t border-white/25">
            {columns.map((col) => (
              <details key={col.title} className="group border-b border-white/25">
                <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between text-[14px] font-extrabold uppercase tracking-wide [&::-webkit-details-marker]:hidden">
                  {col.title}
                  <ChevronDown size={18} className="transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="flex min-h-10 items-center text-[14px] font-semibold">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          <div className="hidden sm:grid grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-[14px] font-extrabold uppercase tracking-wide">{col.title}</h2>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-[14px] font-semibold hover:underline underline-offset-2">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 sm:mt-10 md:mt-12 sm:border-t sm:border-white/25 sm:pt-6">
        <p className="max-w-[900px] text-[12px] leading-relaxed text-white/80">{disclaimer}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-semibold">
            &copy; {new Date().getFullYear()} Opek Junk Removal. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] font-semibold">
            <li><Link to="/privacy" className="hover:underline underline-offset-2">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:underline underline-offset-2">Terms of Service</Link></li>
            <li><Link to="/sms-consent" className="hover:underline underline-offset-2">SMS Consent</Link></li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  </footer>
);
