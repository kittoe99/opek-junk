import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, CheckCircle, Clock, DollarSign, Recycle } from 'lucide-react';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-xl">
            <Warehouse size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Residential Junk Removal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Clear out your attic, garage, or basement with Denver's most trusted junk removal service. 
            We handle everything from couches to appliances with professional care.
          </p>
        </div>

        {/* Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-16 max-w-5xl mx-auto">
          <img 
            src="/opek2.png" 
            alt="Residential junk removal service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
            <p className="text-white text-lg font-bold text-center">
              Over 60% of items donated or recycled
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Clock size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Same-Day Service</h3>
            <p className="text-gray-600 text-sm">Available for urgent cleanouts and last-minute needs</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <DollarSign size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Transparent Pricing</h3>
            <p className="text-gray-600 text-sm">No hidden fees, pay only for the space you use</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Recycle size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Eco-Friendly</h3>
            <p className="text-gray-600 text-sm">We donate and recycle whenever possible</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Full Service</h3>
            <p className="text-gray-600 text-sm">We do all the heavy lifting and cleanup</p>
          </div>
        </div>

        {/* What We Remove */}
        <div className="bg-gray-50 p-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-black mb-8 text-center">What We Remove</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Furniture</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Couches & Sofas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Mattresses & Box Springs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Tables & Chairs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Dressers & Cabinets</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Appliances</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Refrigerators & Freezers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Washers & Dryers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Stoves & Ovens</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Dishwashers</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">General Items</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Boxes & Clutter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Electronics & E-Waste</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Yard Waste</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Exercise Equipment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-black mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                1
              </div>
              <h3 className="font-black text-xl mb-3">Book Online</h3>
              <p className="text-gray-600">
                Schedule your appointment online or call us for same-day service
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                2
              </div>
              <h3 className="font-black text-xl mb-3">We Arrive</h3>
              <p className="text-gray-600">
                Our team arrives on time and provides a free, no-obligation quote
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                3
              </div>
              <h3 className="font-black text-xl mb-3">We Haul</h3>
              <p className="text-gray-600">
                Approve the price and we'll load everything up and clean the area
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Clear Your Space?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get a free quote in minutes. No obligation, no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/quote')}
              className="px-8 py-4 bg-white text-black font-bold uppercase hover:bg-gray-100 transition-colors rounded-lg"
            >
              Get Free Quote
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="px-8 py-4 border-2 border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-colors rounded-lg"
            >
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
