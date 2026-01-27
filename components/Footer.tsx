import React from 'react';
import { Trash2, Phone, Mail, Apple, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Brand - Takes 4 columns */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-lg">
                  <Trash2 size={28} strokeWidth={2.5} />
               </div>
               <span className="font-black text-3xl text-white tracking-tight">OPEK</span>
            </div>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              Professional junk removal services connecting you with trusted providers nationwide.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Phone size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Residential</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Commercial</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Construction</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">E-Waste</a></li>
            </ul>
          </div>

          {/* Company - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#process" className="text-gray-400 hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#service-area" className="text-gray-400 hover:text-white transition-colors">Coverage</a></li>
              <li><a href="/provider-signup" className="text-gray-400 hover:text-white transition-colors">Become a Provider</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact & App - Takes 4 columns */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-6">Get In Touch</h4>
            <div className="space-y-4 mb-6">
               <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-white font-bold text-base">(303) 555-0199</span>
               </div>
               <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-white text-base">hello@opekjunk.com</span>
               </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-xs mb-3">Download Our App</p>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  <Apple size={16} />
                  <span>App Store</span>
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  <Smartphone size={16} />
                  <span>Google Play</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Opek Junk Removal. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm">
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};