import React from 'react';
import { Phone, Mail, MapPin, Apple, Smartphone, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const quickLinks = [
  { label: 'Get a quote', to: '/quote' },
  { label: 'Book online', to: '/booking' },
  { label: 'Junk removal', to: '/services/junk-removal' },
  { label: 'Property cleanouts', to: '/services/property-cleanout' },
  { label: 'Contact us', to: '/contact' },
];

const disclaimer =
  'Opek Junk Removal is a technology platform that connects customers with independent local service providers. Opek Junk Removal does not perform junk removal, hauling, or moving labor services itself; all services are performed by independent, third-party service providers who are responsible for their own operations, licensing, and insurance.';

function FooterBottom() {
  return (
    <div className="border-t border-white/[0.06] bg-[#050507]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <p className="text-neutral-600 text-[11px] leading-relaxed">{disclaimer}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <p className="text-neutral-500 text-xs">
            &copy; {new Date().getFullYear()} Opek Junk Removal. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/sms-consent" className="text-neutral-400 hover:text-white transition-colors">
              SMS Consent
            </Link>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Footer: React.FC = () => {
  const location = useLocation();
  const isAdsLandingPage =
    location.pathname === '/services/mattress-disposal' ||
    location.pathname === '/lp/junk-removal';

  if (isAdsLandingPage) {
    return (
      <footer className="bg-[#070709] border-t border-white/[0.07]">
        <FooterBottom />
      </footer>
    );
  }

  return (
    <footer className="relative bg-[#070709] border-t border-white/[0.07] overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[240px] w-[520px] rounded-full bg-brand/[0.08] blur-[120px] pointer-events-none" aria-hidden />

      <div className="relative border-b border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-9 md:py-11">
          <h3 className="font-sans font-extrabold text-2xl md:text-[1.7rem] text-white tracking-tight mb-5">
            Get help <span className="font-serif italic font-normal text-brand">today</span>
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-neutral-300 text-sm font-medium hover:border-brand/50 hover:text-brand transition-colors"
              >
                {item.label}
                <ArrowRight size={13} className="opacity-50" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <img
                src="/opek-logo-white.png"
                alt="Opek Junk Removal"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Nationwide platform for on-demand junk removal, hauling, and cleanouts. Vetted local providers,
              upfront pricing, and same-day service.
            </p>
            <div className="space-y-3">
              <a
                href="tel:8313187139"
                className="flex items-center gap-3 text-neutral-200 hover:text-brand transition-colors group"
              >
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-brand/15 group-hover:border-brand/30 transition-colors">
                  <Phone size={16} className="text-neutral-300 group-hover:text-brand transition-colors" />
                </span>
                <span className="text-sm font-semibold">(831) 318-7139</span>
              </a>
              <a
                href="mailto:Support@opekjunkremoval.com"
                className="flex items-center gap-3 text-neutral-200 hover:text-brand transition-colors group"
              >
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-brand/15 group-hover:border-brand/30 transition-colors">
                  <Mail size={16} className="text-neutral-300 group-hover:text-brand transition-colors" />
                </span>
                <span className="text-sm">Support@opekjunkremoval.com</span>
              </a>
              <div className="flex items-center gap-3 text-neutral-400">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-neutral-300" />
                </span>
                <span className="text-sm">Nationwide service</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Services</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/services/junk-removal" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Junk Removal
                  </Link>
                </li>
                <li>
                  <Link to="/services/dumpster-rental" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Dumpster Rental
                  </Link>
                </li>
                <li>
                  <Link to="/services/property-cleanout" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Property Cleanouts
                  </Link>
                </li>
                <li>
                  <Link to="/services/moving-labor" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Local Moving
                  </Link>
                </li>
                <li>
                  <Link to="/services/mattress-disposal" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Mattress Disposal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Locations</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/locations/dallas-fort-worth" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Dallas–Fort Worth
                  </Link>
                </li>
                <li>
                  <Link to="/locations/jacksonville" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Jacksonville
                  </Link>
                </li>
                <li>
                  <Link to="/locations/atlanta" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Atlanta
                  </Link>
                </li>
                <li>
                  <Link to="/#service-area" className="text-neutral-400 hover:text-brand text-sm transition-colors inline-flex items-center gap-1">
                    All coverage areas
                    <ArrowRight size={12} />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/quote" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Get a Quote
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Book Online
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link to="/#process" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link to="/provider-signup" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    Become a Provider
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-semibold text-white text-sm mb-4">Get the app</h4>
            <p className="text-neutral-400 text-sm leading-relaxed mb-5">
              Book pickups, track your service, and manage everything from your phone.
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                type="button"
                className="inline-flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl hover:border-brand/40 hover:bg-white/[0.07] transition-colors text-left"
              >
                <Apple size={18} className="text-neutral-200 shrink-0" />
                <div>
                  <div className="text-[10px] text-neutral-500 leading-none">Download on the</div>
                  <div className="text-sm font-semibold text-white leading-tight">App Store</div>
                </div>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-3 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl hover:border-brand/40 hover:bg-white/[0.07] transition-colors text-left"
              >
                <Smartphone size={18} className="text-neutral-200 shrink-0" />
                <div>
                  <div className="text-[10px] text-neutral-500 leading-none">Get it on</div>
                  <div className="text-sm font-semibold text-white leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <FooterBottom />
    </footer>
  );
};
