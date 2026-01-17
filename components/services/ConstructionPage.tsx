import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, CheckCircle, Truck, Calendar, Shield } from 'lucide-react';

export const ConstructionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-xl">
            <HardHat size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Construction Debris Removal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Keep your construction site OSHA-ready. We haul away drywall, wood, tile, flooring, and metal scraps. 
            Available for one-time pick-ups or recurring site maintenance.
          </p>
        </div>

        {/* Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-16 max-w-5xl mx-auto">
          <img 
            src="/opek2.png" 
            alt="Construction debris removal service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
            <p className="text-white text-lg font-bold text-center">
              OSHA-compliant debris removal for contractors
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Calendar size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Recurring Service</h3>
            <p className="text-gray-600 text-sm">Weekly or bi-weekly scheduled pickups</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Truck size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Large Capacity</h3>
            <p className="text-gray-600 text-sm">Handle projects of any size</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Shield size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">OSHA Compliant</h3>
            <p className="text-gray-600 text-sm">Meet all safety and disposal regulations</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Fast Turnaround</h3>
            <p className="text-gray-600 text-sm">Same-day service available</p>
          </div>
        </div>

        {/* What We Remove */}
        <div className="bg-gray-50 p-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-black mb-8 text-center">Construction Materials We Haul</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Building Materials</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Drywall & Sheetrock</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Lumber & Wood Scraps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Concrete & Brick</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Roofing Materials</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Flooring & Finishes</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Tile & Grout</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Carpet & Padding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Hardwood Flooring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Laminate & Vinyl</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Metal & Fixtures</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Metal Scraps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Plumbing Fixtures</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Windows & Doors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Cabinets & Countertops</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Service Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-black mb-12 text-center">Service Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 p-8 rounded-xl hover:border-black transition-colors">
              <h3 className="font-black text-2xl mb-4">One-Time Pickup</h3>
              <p className="text-gray-600 mb-6">
                Perfect for renovation projects, remodels, or final site cleanup. We arrive on your schedule and haul everything away in one trip.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Flexible scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>No contracts required</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Same-day available</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-8 rounded-xl hover:border-black transition-colors">
              <h3 className="font-black text-2xl mb-4">Recurring Service</h3>
              <p className="text-gray-600 mb-6">
                Ideal for ongoing construction projects. We'll visit your site weekly or bi-weekly to keep debris under control and maintain OSHA compliance.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Volume discounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Priority scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Keep Your Site Clean & Compliant</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get a contractor quote with volume pricing options.
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
