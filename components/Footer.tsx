import React from 'react';
import { Trash2, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-24 pb-12 text-center md:text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
               <div className="w-10 h-10 bg-white text-black flex items-center justify-center">
                  <Trash2 size={24} />
               </div>
               <span className="font-black text-2xl text-white tracking-tighter uppercase">OPEK</span>
            </div>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
              Professional junk removal services nationwide. Trusted local providers for residential and commercial needs.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-500">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#service-area" className="hover:text-white transition-colors">Coverage</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Become a Provider</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-8">Coverage</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-gray-500">
              <li>Nationwide</li>
              <li>All 50 States</li>
              <li>Major Cities</li>
              <li>Same-Day Service</li>
              <li>24/7 Availability</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-8">Direct Contact</h4>
            <div className="space-y-6">
               <div className="flex items-center gap-4 justify-center md:justify-start group cursor-pointer">
                  <div className="w-10 h-10 bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                     <Phone size={18} />
                  </div>
                  <span className="text-white font-black text-lg tracking-tighter">(303) 555-0199</span>
               </div>
               <div className="flex items-center gap-4 justify-center md:justify-start group cursor-pointer">
                  <div className="w-10 h-10 bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                     <Mail size={18} />
                  </div>
                  <span className="text-white font-black text-sm tracking-widest uppercase">hello@opekjunk.com</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Opek Junk Removal. Licensed & Insured Professionals Nationwide.
          </p>
          <div className="flex gap-8">
             <a href="#" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-[0.3em]">Privacy</a>
             <a href="#" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-[0.3em]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};