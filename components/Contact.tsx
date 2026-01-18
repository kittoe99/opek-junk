import React from 'react';
import { Button } from './Button';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-gray-50 text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight">Get Your Quote</h2>
            <p className="text-gray-600 text-lg mb-12">
              Fill out the form to receive quotes from local professionals. Book your service directly.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-black shadow-sm shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Phone</h4>
                  <p className="text-gray-600">(555) 123-4567</p>
                  <p className="text-gray-400 text-sm mt-1">Mon-Sat 8am - 6pm</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-black shadow-sm shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Email</h4>
                  <p className="text-gray-600">hello@opekjunk.com</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-black shadow-sm shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Service Area</h4>
                  <p className="text-gray-600">Nationwide Coverage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Request an Estimate</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message / Items</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="Tell us what needs to be removed..."></textarea>
              </div>

              <Button type="submit" fullWidth className="h-12 text-lg">Send Request</Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};