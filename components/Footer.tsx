import React from 'react';
import { Phone, Mail, MapPin, Apple, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="overflow-hidden -ml-2 mb-3" style={{ height: '64px' }}>
              <img src="/opek-logo-plain.png" alt="Opek Junk Removal" className="h-28 w-auto object-contain -mt-8" />
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed mb-8 max-w-sm">
              A technology platform connecting you with trusted local service providers nationwide. Vetted providers, same day service, and eco-friendly.
            </p>
            {/* Contact Info */}
            <a href="tel:8313187139" className="flex items-center gap-3 text-secondary-300 hover:text-white transition-colors group">
              <Phone size={16} className="text-brand group-hover:text-white transition-colors" />
              <span className="text-sm font-bold">(831) 318-7139</span>
            </a>
            <a href="mailto:Support@opekjunkremoval.com" className="flex items-center gap-3 text-secondary-300 hover:text-white transition-colors group">
              <Mail size={16} className="text-brand group-hover:text-white transition-colors" />
              <span className="text-sm">Support@opekjunkremoval.com</span>
            </a>
            <div className="flex items-center gap-3 text-secondary-300">
              <MapPin size={16} className="text-brand" />
              <span className="text-sm">Nationwide Service</span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-8">
            {/* Services */}
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link to="/services/junk-removal" className="text-secondary-300 hover:text-white text-sm transition-colors">Junk Removal</Link></li>
                <li><Link to="/services/dumpster-rental" className="text-secondary-300 hover:text-white text-sm transition-colors">Dumpster Rental</Link></li>
                <li><Link to="/services/property-cleanout" className="text-secondary-300 hover:text-white text-sm transition-colors">Property Cleanouts</Link></li>
                <li><Link to="/services/donations-pickup" className="text-secondary-300 hover:text-white text-sm transition-colors">Donations Pickup</Link></li>
                <li><Link to="/services/moving-labor" className="text-secondary-300 hover:text-white text-sm transition-colors">Moving Labor</Link></li>
              </ul>
            </div>

            {/* Locations */}
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4">Locations</h4>
              <ul className="space-y-2">
                <li><Link to="/locations/dallas-fort-worth" className="text-secondary-300 hover:text-white text-sm transition-colors">Dallas-Fort Worth, TX</Link></li>
                <li><Link to="/locations/jacksonville" className="text-secondary-300 hover:text-white text-sm transition-colors">Jacksonville, FL</Link></li>
                <li><Link to="/locations/atlanta" className="text-secondary-300 hover:text-white text-sm transition-colors">Atlanta, GA</Link></li>
                <li><Link to="/#service-area" className="text-secondary-400 hover:text-brand text-xs transition-colors mt-1 inline-block">More coming soon →</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/quote" className="text-secondary-300 hover:text-white text-sm transition-colors">Get a Quote</Link></li>
                <li><Link to="/booking" className="text-secondary-300 hover:text-white text-sm transition-colors">Book Online</Link></li>
                <li><Link to="/contact" className="text-secondary-300 hover:text-white text-sm transition-colors">Contact Us</Link></li>
                <li><Link to="/track-order" className="text-secondary-300 hover:text-white text-sm transition-colors">Track Order</Link></li>
                <li><Link to="/#process" className="text-secondary-300 hover:text-white text-sm transition-colors">How it Works</Link></li>
                <li><Link to="/provider-signup" className="text-secondary-300 hover:text-white text-sm transition-colors">Become a Provider</Link></li>
              </ul>
            </div>
          </div>

          {/* App Download */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-4">Get the App</h4>
            <p className="text-secondary-300 text-sm mb-6">Book pickups, track your service, and <span className="text-brand font-medium">manage everything from your phone</span>.</p>
            <div className="flex flex-row gap-2">
              <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-secondary rounded-lg hover:bg-secondary-50 transition-colors group">
                <Apple size={16} className="text-secondary group-hover:text-brand transition-colors shrink-0" />
                <div className="text-left">
                  <div className="text-[9px] text-secondary-500 leading-none">Download on the</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-secondary rounded-lg hover:bg-secondary-50 transition-colors group">
                <Smartphone size={16} className="text-secondary group-hover:text-brand transition-colors shrink-0" />
                <div className="text-left">
                  <div className="text-[9px] text-secondary-500 leading-none">Get it on</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <p className="text-secondary-400 text-[11px] leading-relaxed">
            Disclaimer: Opek Junk Removal is a technology platform that connects customers with independent local service providers. Opek Junk Removal does not perform junk removal, hauling, or moving labor services itself; all services are performed by independent, third-party service providers who are responsible for their own operations, licensing, and insurance.
          </p>
          <div className="h-px bg-secondary-700" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-400 text-xs">
              &copy; {new Date().getFullYear()} Opek Junk Removal. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs">
              <Link to="/privacy" className="text-secondary-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-secondary-400 hover:text-white transition-colors">Terms of Service</Link>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};