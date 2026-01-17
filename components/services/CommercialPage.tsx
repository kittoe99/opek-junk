import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle, Clock, Shield, Users } from 'lucide-react';

export const CommercialPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-xl">
            <Truck size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Commercial & Office Hauling</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Moving offices or upgrading equipment? We remove desks, cubicles, monitors, and filing cabinets 
            with minimal disruption to your business operations.
          </p>
        </div>

        {/* Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-16 max-w-5xl mx-auto">
          <img 
            src="/opek2.png" 
            alt="Commercial junk removal service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
            <p className="text-white text-lg font-bold text-center">
              Trusted by Denver businesses since 2018
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Clock size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600 text-sm">After-hours and weekend service available</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Shield size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Fully Insured</h3>
            <p className="text-gray-600 text-sm">Licensed and insured for commercial properties</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Users size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Professional Team</h3>
            <p className="text-gray-600 text-sm">Uniformed, background-checked crew members</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Zero Disruption</h3>
            <p className="text-gray-600 text-sm">Minimal impact on your daily operations</p>
          </div>
        </div>

        {/* What We Remove */}
        <div className="bg-gray-50 p-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-black mb-8 text-center">Commercial Items We Handle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Office Furniture</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Desks & Workstations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Cubicles & Partitions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Conference Tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Office Chairs</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Equipment</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Computers & Monitors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Printers & Copiers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Servers & IT Equipment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Phone Systems</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Storage & Filing</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Filing Cabinets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Shelving Units</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Storage Boxes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Archive Materials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Industries Served */}
        <div className="mb-16">
          <h2 className="text-3xl font-black mb-12 text-center">Industries We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Corporate Offices</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Retail Stores</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Warehouses</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Medical Facilities</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Schools</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Restaurants</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Hotels</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="font-bold">Gyms</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Need a Commercial Quote?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Contact us for volume pricing and recurring service discounts.
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
