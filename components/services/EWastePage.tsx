import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, CheckCircle, Shield, Leaf, Award } from 'lucide-react';

export const EWastePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-xl">
            <Recycle size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">E-Waste & Appliance Recycling</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Responsible disposal of electronics and appliances. We adhere to all Colorado state environmental 
            regulations for hazardous materials and ensure proper recycling.
          </p>
        </div>

        {/* Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-16 max-w-5xl mx-auto">
          <img 
            src="/opek2.png" 
            alt="E-waste recycling service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
            <p className="text-white text-lg font-bold text-center">
              Certified e-waste recycling partner
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Shield size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Certified Disposal</h3>
            <p className="text-gray-600 text-sm">EPA-compliant recycling processes</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Leaf size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Eco-Friendly</h3>
            <p className="text-gray-600 text-sm">Zero landfill commitment for electronics</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Award size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Data Security</h3>
            <p className="text-gray-600 text-sm">Secure data destruction available</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Free Pickup</h3>
            <p className="text-gray-600 text-sm">No charge for large appliances</p>
          </div>
        </div>

        {/* What We Recycle */}
        <div className="bg-gray-50 p-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-black mb-8 text-center">What We Recycle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Electronics</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Computers & Laptops</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Monitors & TVs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Printers & Scanners</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Servers & Networking</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Large Appliances</h3>
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
              <h3 className="font-bold text-lg mb-3">Small Electronics</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Cell Phones & Tablets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Microwaves</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Audio Equipment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Gaming Consoles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Proper E-Waste Disposal Matters */}
        <div className="mb-16">
          <h2 className="text-3xl font-black mb-12 text-center">Why Proper E-Waste Disposal Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
              <h3 className="font-black text-xl mb-4">Environmental Protection</h3>
              <p className="text-gray-600">
                Electronics contain hazardous materials like lead, mercury, and cadmium. Improper disposal can 
                contaminate soil and water. We ensure these materials are handled safely and recycled properly.
              </p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
              <h3 className="font-black text-xl mb-4">Resource Recovery</h3>
              <p className="text-gray-600">
                Electronics contain valuable materials like gold, silver, and copper. Through proper recycling, 
                we recover these resources and reduce the need for new mining operations.
              </p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
              <h3 className="font-black text-xl mb-4">Data Security</h3>
              <p className="text-gray-600">
                Old computers and phones may contain sensitive personal or business data. We offer certified 
                data destruction services to protect your privacy and comply with regulations.
              </p>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
              <h3 className="font-black text-xl mb-4">Legal Compliance</h3>
              <p className="text-gray-600">
                Colorado has strict e-waste disposal laws. We ensure full compliance with state and federal 
                regulations, protecting you from potential fines and liability.
              </p>
            </div>
          </div>
        </div>

        {/* Recycling Process */}
        <div className="bg-gray-50 p-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-black mb-12 text-center">Our Recycling Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                1
              </div>
              <h3 className="font-black text-lg mb-2">Collection</h3>
              <p className="text-gray-600 text-sm">We pick up your electronics and appliances</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                2
              </div>
              <h3 className="font-black text-lg mb-2">Sorting</h3>
              <p className="text-gray-600 text-sm">Items are categorized by material type</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                3
              </div>
              <h3 className="font-black text-lg mb-2">Processing</h3>
              <p className="text-gray-600 text-sm">Materials are safely dismantled and separated</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                4
              </div>
              <h3 className="font-black text-lg mb-2">Recycling</h3>
              <p className="text-gray-600 text-sm">Materials sent to certified recycling facilities</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Recycle Responsibly Today</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Free pickup for large appliances. Competitive pricing for e-waste recycling.
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
