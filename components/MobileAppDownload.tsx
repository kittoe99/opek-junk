import React from 'react';
import { Smartphone, Apple } from 'lucide-react';

export const MobileAppDownload: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Column - Content */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                Mobile App
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Download Our Mobile App
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed">
              Book services, track pickups, and manage your account on the go. Available for iOS and Android.
            </p>
            
            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-3 px-5 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                <Apple size={24} />
                <div className="text-left">
                  <div className="text-[10px] font-normal">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center gap-3 px-5 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                <Smartphone size={24} />
                <div className="text-left">
                  <div className="text-[10px] font-normal">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
            <h3 className="text-xl font-black text-white mb-6">App Features</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Instant Booking</h4>
                  <p className="text-gray-400 text-sm">Schedule pickups in seconds with our streamlined booking flow</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Real-Time Tracking</h4>
                  <p className="text-gray-400 text-sm">Track your service provider in real-time on pickup day</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Photo Estimates</h4>
                  <p className="text-gray-400 text-sm">Get instant AI-powered price estimates from photos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">Payment History</h4>
                  <p className="text-gray-400 text-sm">View receipts and manage payment methods securely</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
