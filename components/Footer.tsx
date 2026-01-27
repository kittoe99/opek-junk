import React from 'react';
import { Trash2, Phone, Mail, Apple, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-white text-black flex items-center justify-center">
                  <Trash2 size={24} />
               </div>
               <span className="font-black text-2xl text-white tracking-tighter uppercase">OPEK</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Professional junk removal services nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#service-area" className="hover:text-white transition-colors">Coverage</a></li>
              <li><a href="/provider-signup" className="hover:text-white transition-colors">Become a Provider</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-wider mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
               <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-white font-bold">(303) 555-0199</span>
               </div>
               <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-white">hello@opekjunk.com</span>
               </div>
            </div>
          </div>

          {/* Mobile App */}
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-wider mb-4">Download Our App</h4>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Book and track services on the go
            </p>
            <div className="space-y-2">
              <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                <Apple size={16} />
                <div className="text-left">
                  <div className="text-[9px] font-normal">Download on</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                <Smartphone size={16} />
                <div className="text-left">
                  <div className="text-[9px] font-normal">Get it on</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Opek Junk Removal. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
             <a href="#" className="text-gray-600 hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="text-gray-600 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};