import React from 'react';
import { Apple, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-20 md:pt-24 pb-10">

        {/* Wordmark + tagline */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 md:mb-20">
          <div className="md:col-span-7">
            <div className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight leading-tight">
              Junk gone. <span className="text-gray-400">Today.</span>
            </div>
            <p className="text-gray-500 mt-6 max-w-md leading-relaxed">
              Trusted local pros. Same-day pickup. Coast to coast.
            </p>
          </div>
          <div className="md:col-span-5 md:text-right flex md:justify-end items-end">
            <div className="space-y-2 text-sm md:text-right">
              <a href="tel:8313187139" className="block text-gray-900 hover:text-gray-600 transition-colors">
                (831) 318-7139
              </a>
              <a
                href="mailto:Support@opekjunkremoval.com"
                className="block text-gray-500 hover:text-gray-900 transition-colors"
              >
                Support@opekjunkremoval.com
              </a>
            </div>
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-12 border-t border-gray-200">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-5">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services/residential" className="text-gray-700 hover:text-gray-900">Residential</Link></li>
              <li><Link to="/services/commercial" className="text-gray-700 hover:text-gray-900">Commercial</Link></li>
              <li><Link to="/services/construction" className="text-gray-700 hover:text-gray-900">Construction</Link></li>
              <li><Link to="/services/e-waste" className="text-gray-700 hover:text-gray-900">E-Waste</Link></li>
              <li><Link to="/services/property-cleanout" className="text-gray-700 hover:text-gray-900">Property Cleanout</Link></li>
              <li><Link to="/services/dumpster-rental" className="text-gray-700 hover:text-gray-900">Dumpster Rental</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/quote" className="text-gray-700 hover:text-gray-900">Get a quote</Link></li>
              <li><Link to="/booking" className="text-gray-700 hover:text-gray-900">Book online</Link></li>
              <li><Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link></li>
              <li><Link to="/track-order" className="text-gray-700 hover:text-gray-900">Track order</Link></li>
              <li><Link to="/provider-signup" className="text-gray-700 hover:text-gray-900">Become a provider</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#process" className="text-gray-700 hover:text-gray-900">How it works</Link></li>
              <li><Link to="/#service-area" className="text-gray-700 hover:text-gray-900">Service areas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-5">Get the app</h4>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <Apple size={16} strokeWidth={1.5} />
                App Store
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
                <Smartphone size={16} strokeWidth={1.5} />
                Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Opek Junk Removal
          </p>
          <div className="flex gap-8 text-xs">
            <a href="#" className="text-gray-400 hover:text-gray-700">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-gray-700">Terms</a>
            <a href="#" className="text-gray-400 hover:text-gray-700">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  );
};