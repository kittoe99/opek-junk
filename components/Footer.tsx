import React from 'react';
import { Phone, Mail, MapPin, Apple, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {

  return (
    <footer className="bg-black">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <div className="mb-5">
              <img src="/opek-logo-plain.png" alt="Opek Junk Removal" className="h-40 w-auto object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Professional junk removal services connecting you with trusted providers nationwide. Licensed, insured, and eco-friendly.
            </p>
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:8313187139" className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <Phone size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold">(831) 318-7139</span>
              </a>
              <a href="mailto:Support@opekjunkremoval.com" className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <Mail size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm">Support@opekjunkremoval.com</span>
              </a>
              <div className="flex items-center gap-2.5 text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span className="text-sm">Nationwide Service</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">Services</h4>
            <ul className="space-y-2.5">
              <li><Link to="/services/residential" className="text-gray-400 hover:text-white text-sm transition-colors">Residential</Link></li>
              <li><Link to="/services/commercial" className="text-gray-400 hover:text-white text-sm transition-colors">Commercial</Link></li>
              <li><Link to="/services/construction" className="text-gray-400 hover:text-white text-sm transition-colors">Construction</Link></li>
              <li><Link to="/services/e-waste" className="text-gray-400 hover:text-white text-sm transition-colors">E-Waste</Link></li>
              <li><Link to="/services/property-cleanout" className="text-gray-400 hover:text-white text-sm transition-colors">Property Cleanout</Link></li>
              <li><Link to="/services/dumpster-rental" className="text-gray-400 hover:text-white text-sm transition-colors">Dumpster Rental</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-2.5">
              <li><Link to="/quote" className="text-gray-400 hover:text-white text-sm transition-colors">Get a Quote</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-white text-sm transition-colors">Book Online</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-white text-sm transition-colors">Track Order</Link></li>
              <li><Link to="/#process" className="text-gray-400 hover:text-white text-sm transition-colors">How it Works</Link></li>
              <li><Link to="/#service-area" className="text-gray-400 hover:text-white text-sm transition-colors">Service Areas</Link></li>
              <li><Link to="/provider-signup" className="text-gray-400 hover:text-white text-sm transition-colors">Become a Provider</Link></li>
            </ul>
          </div>

          {/* App Download */}
          <div className="col-span-2 md:col-span-2 lg:col-span-4">
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">Get the App</h4>
            <p className="text-gray-400 text-sm mb-5">Book pickups, track your service, and manage everything from your phone.</p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button className="inline-flex items-center gap-2.5 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
                <Apple size={20} />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 leading-none">Download on the</div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </button>
              <button className="inline-flex items-center gap-2.5 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
                <Smartphone size={20} />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400 leading-none">Get it on</div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Opek Junk Removal. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};