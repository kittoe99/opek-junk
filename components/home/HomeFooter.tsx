import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeLogo } from './HomeLogo';

const SITE_PHONE = '8313187139';
const SITE_PHONE_DISPLAY = '(831) 318-7139';

const columns = [
  {
    title: 'Services',
    links: [
      { label: 'Junk Removal', to: '/services/junk-removal' },
      { label: 'Dumpster Rental', to: '/services/dumpster-rental' },
      { label: 'Property Cleanouts', to: '/services/property-cleanout' },
      { label: 'Small Local Moves', to: '/services/small-local-moves' },
      { label: 'Mattress Disposal', to: '/services/mattress-disposal' },
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

/** Deep-purple footer used on the homepage only. Other pages keep the dark Footer. */
export const HomeFooter: React.FC = () => (
  <footer className="home-light">
    <div className="bg-[#520f96] text-white">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-11 pb-10 md:pt-20 md:pb-28 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-9 md:gap-12 lg:gap-16">
        <div>
          <p className="home-display text-[2.3rem] leading-[0.92] sm:text-[3.4rem] lg:text-[4rem]">
            Clear the clutter. Book in minutes.
          </p>
          <div className="mt-6 md:mt-8 flex items-center gap-4 md:gap-5 rounded-xl md:rounded-none bg-white/10 md:bg-transparent p-4 md:p-0">
            <a
              href={`tel:${SITE_PHONE}`}
              className="flex h-[64px] w-[84px] md:h-[88px] md:w-[120px] shrink-0 items-center justify-center rounded-xl bg-white text-[#520f96]"
              aria-label={`Call ${SITE_PHONE_DISPLAY}`}
            >
              <HomeLogo className="h-auto w-[66px] md:w-[96px]" />
            </a>
            <div className="min-w-0">
              <p className="text-[12px] md:text-[15px] font-bold uppercase tracking-wide">Call or text any time</p>
              <a href={`tel:${SITE_PHONE}`} className="home-display text-[1.45rem] md:text-[1.6rem] leading-tight hover:underline">
                {SITE_PHONE_DISPLAY}
              </a>
              <p className="mt-1 truncate text-[13px] md:text-[14px]">
                <a href="mailto:Support@opekjunkremoval.com" className="underline underline-offset-2">
                  Support@opekjunkremoval.com
                </a>
              </p>
            </div>
          </div>
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

          <ul className="mt-8 md:mt-12 flex items-center gap-2 md:gap-6">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="ui-icon-button flex h-11 w-11 items-center justify-center rounded-full bg-white/10 md:block md:h-auto md:w-auto md:rounded-none md:bg-transparent hover:opacity-80">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 md:mt-8 text-[12px] md:text-[13px] leading-relaxed text-white/80 md:text-white/90">{disclaimer}</p>

          <div className="mt-8 border-t border-white/30 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[12px] font-semibold">
              &copy; {new Date().getFullYear()} Opek Junk Removal. All rights reserved.
            </p>
            <p className="text-[12px] font-semibold">
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <span aria-hidden> | </span>
              <Link to="/terms" className="hover:underline">Terms of Service</Link>
              <span aria-hidden> | </span>
              <Link to="/sms-consent" className="hover:underline">SMS Consent</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
