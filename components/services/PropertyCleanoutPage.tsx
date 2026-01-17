import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash, CheckCircle, Heart, Clock, Shield } from 'lucide-react';

export const PropertyCleanoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center mx-auto mb-6 rounded-xl">
            <Trash size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Full Property Cleanouts</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estate clearing, rental move-outs, and hoarding situations handled with professional discretion 
            and extreme efficiency. We leave the space broom-swept and ready.
          </p>
        </div>

        {/* Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-16 max-w-5xl mx-auto">
          <img 
            src="/opek2.png" 
            alt="Property cleanout service" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-6">
            <p className="text-white text-lg font-bold text-center">
              Compassionate service for difficult situations
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Heart size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Compassionate</h3>
            <p className="text-gray-600 text-sm">Respectful handling of personal belongings</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Shield size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Discreet Service</h3>
            <p className="text-gray-600 text-sm">Professional and confidential handling</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <Clock size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Fast Turnaround</h3>
            <p className="text-gray-600 text-sm">Complete cleanouts in 1-3 days</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-black text-lg mb-2">Broom-Swept</h3>
            <p className="text-gray-600 text-sm">Property left clean and ready</p>
          </div>
        </div>

        {/* Services We Provide */}
        <div className="bg-gray-50 p-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-black mb-8 text-center">Cleanout Services We Provide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Estate Cleanouts</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Full home clearing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Donation coordination</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Valuables identification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Respectful handling</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Rental Turnovers</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Abandoned property removal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Fast turnaround times</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Move-out cleanouts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Property ready for next tenant</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Hoarding Situations</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Non-judgmental approach</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Systematic clearing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Biohazard certified</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-black" />
                  <span>Complete restoration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Our Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-black mb-12 text-center">Our Cleanout Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                1
              </div>
              <h3 className="font-black text-lg mb-2">Assessment</h3>
              <p className="text-gray-600 text-sm">We visit the property and provide a detailed quote</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                2
              </div>
              <h3 className="font-black text-lg mb-2">Planning</h3>
              <p className="text-gray-600 text-sm">We create a timeline and coordinate logistics</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                3
              </div>
              <h3 className="font-black text-lg mb-2">Execution</h3>
              <p className="text-gray-600 text-sm">Our team systematically clears the property</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4 rounded-full font-black text-2xl">
                4
              </div>
              <h3 className="font-black text-lg mb-2">Final Sweep</h3>
              <p className="text-gray-600 text-sm">Property is cleaned and ready for next use</p>
            </div>
          </div>
        </div>

        {/* Special Situations */}
        <div className="bg-white border-2 border-gray-200 p-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-black mb-8 text-center">Handling Sensitive Situations</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-gray-600">
            <p className="leading-relaxed">
              We understand that property cleanouts often occur during difficult times. Whether you're dealing 
              with the loss of a loved one, helping a family member, or managing a challenging rental situation, 
              our team approaches every job with empathy and professionalism.
            </p>
            <p className="leading-relaxed">
              Our crew is trained to handle sensitive situations with discretion. We can help identify items 
              of value, coordinate donations to local charities, and ensure that personal belongings are 
              treated with respect throughout the process.
            </p>
            <p className="leading-relaxed">
              For hoarding situations, we work with compassion and understanding. Our team is experienced in 
              systematic clearing while maintaining the dignity of all involved. We're also certified to handle 
              biohazard situations when necessary.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-black text-white p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Need a Property Cleanout?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            We're here to help during difficult times. Compassionate, professional service guaranteed.
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
