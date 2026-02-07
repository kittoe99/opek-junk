import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, DollarSign, Box } from 'lucide-react';
import { Button } from './Button';
import { getJunkQuote } from '../services/geminiService';
import { QuoteEstimate, LoadingState } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEstimate(null); // Reset previous estimate
        setLoadingState(LoadingState.IDLE);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoadingState(LoadingState.ANALYZING);
    
    try {
      // Extract base64 content and type
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const result = await getJunkQuote(base64Data, mimeType);
      setEstimate(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleReset = () => {
    setImage(null);
    setEstimate(null);
    setLoadingState(LoadingState.IDLE);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            AI Instant Quote
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1">
          {!image ? (
            <div 
              className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-black hover:bg-gray-50 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Camera size={32} className="text-gray-400 group-hover:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload a Photo</h3>
              <p className="text-gray-500 mb-6">Take a picture of your junk for an instant AI estimate.</p>
              <Button variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                <Upload size={18} /> Select Image
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video flex items-center justify-center border border-gray-200">
                <img src={image} alt="Upload" className="max-h-full max-w-full object-contain" />
                <button 
                  onClick={handleReset}
                  className="absolute top-4 right-4 p-2 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 border border-gray-200"
                >
                  <X size={16} />
                </button>
              </div>

              {loadingState === LoadingState.IDLE && (
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Photo looks good. Ready to analyze?</p>
                  <Button onClick={handleAnalyze} fullWidth>
                     Analyze with AI
                  </Button>
                </div>
              )}

              {loadingState === LoadingState.ANALYZING && (
                <div className="py-8 text-center space-y-4">
                  <Loader2 size={40} className="animate-spin mx-auto text-black" />
                  <p className="text-gray-500 animate-pulse">Scanning items and calculating volume...</p>
                </div>
              )}

              {loadingState === LoadingState.ERROR && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-center">
                  <p>Sorry, we couldn't analyze that image. Please try a clearer photo.</p>
                  <Button variant="outline" className="mt-4 mx-auto" onClick={handleAnalyze}>Try Again</Button>
                </div>
              )}

              {loadingState === LoadingState.SUCCESS && estimate && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fade-in">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Estimate Ready</h3>
                      <p className="text-gray-500 text-sm">Based on visual analysis</p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                      AI GENERATED
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Box size={16} />
                        <span className="text-sm font-medium">Estimated Volume</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{estimate.estimatedVolume}</p>
                    </div>
                    
                    <div className="bg-black text-white p-4 rounded-lg shadow-md">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <DollarSign size={16} />
                        <span className="text-sm font-medium text-gray-300">Price Range</span>
                      </div>
                      <p className="text-2xl font-bold">
                        ${estimate.priceRange.min} - ${estimate.priceRange.max}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Detected Items</h4>
                    <div className="flex flex-wrap gap-2">
                      {estimate.itemsDetected.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-gray-700 shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm italic mb-6 border-l-2 border-black pl-3 bg-white p-3 rounded-r-lg">
                    "{estimate.summary}"
                  </p>

                  <Button fullWidth onClick={() => window.location.href = 'mailto:Support@opekjunkremoval.com?subject=Junk Removal Booking'}>
                    Book Now
                  </Button>
                  <p className="text-xs text-center text-gray-400 mt-3">
                    *Final price subject to on-site verification.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};