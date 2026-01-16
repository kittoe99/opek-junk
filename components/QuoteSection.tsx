import React from 'react';
import { Camera, Home, ArrowRight, Clock, Calendar } from 'lucide-react';
import { Button } from './Button';

interface QuoteSectionProps {
  onOpenAI: () => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ onOpenAI }) => {
  return (
    <section id="quote" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-black/5 border border-black/10">
             <span className="text-gray-600 text-xs font-bold tracking-wider uppercase">Pricing Options</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Choose Your Quote Type
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you have a single item or a full house, we have a simple way to get you a price.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Option 1: AI / Picture */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-2xl flex flex-col relative overflow-hidden group animate-fade-in-up delay-100">
            <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform rotate-12">
              <Camera size={200} />
            </div>
            
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg z-10 group-hover:scale-110 transition-transform">
              <Camera size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 z-10">Snap a Photo</h3>
            <p className="text-gray-600 mb-8 flex-grow z-10 text-lg leading-relaxed">
              Perfect for single items or small piles. Upload a picture and receive an estimated price range quickly.
            </p>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 z-10 font-bold bg-white w-fit px-4 py-2 rounded-full border border-gray-200">
              <Clock size={16} className="text-black" />
              <span>Get quote within 15 minutes</span>
            </div>

            <Button onClick={onOpenAI} className="z-10 w-full md:w-auto text-lg h-14">
              Start Photo Quote <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>

          {/* Option 2: In-Home */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-2xl flex flex-col relative overflow-hidden group animate-fade-in-up delay-200">
            <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform rotate-12">
              <Home size={200} />
            </div>

            <div className="w-16 h-16 bg-gray-100 text-black rounded-2xl flex items-center justify-center mb-8 shadow-sm z-10 group-hover:bg-gray-200 transition-colors">
              <Home size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 z-10">In-Home Estimate</h3>
            <p className="text-gray-600 mb-8 flex-grow z-10 text-lg leading-relaxed">
              Best for garages, whole homes, or when you want a guaranteed on-site price. We come to you for free.
            </p>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 z-10 font-bold bg-gray-50 w-fit px-4 py-2 rounded-full border border-gray-200">
              <Calendar size={16} className="text-black" />
              <span>Free, no-obligation visit</span>
            </div>

            <Button variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="z-10 w-full md:w-auto text-lg h-14">
              Schedule Free Visit <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};