import React, { useState } from 'react';
import { X, MapPin, CheckCircle, Loader2 } from 'lucide-react';

interface ZipCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetQuote: () => void;
}

export const ZipCheckModal: React.FC<ZipCheckModalProps> = ({ isOpen, onClose, onGetQuote }) => {
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidated, setIsValidated] = useState(false);

  const handleZipCheck = async () => {
    if (zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use zippopotam.us API for zip code lookup
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      
      if (!response.ok) {
        throw new Error('ZIP code not found');
      }

      const data = await response.json();
      
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        setCity(place['place name']);
        setState(place['state abbreviation']);
        setIsValidated(true);
      } else {
        setError('ZIP code not found');
      }
    } catch (err) {
      setError('Unable to validate ZIP code. Please try again.');
      console.error('Zip validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setZipCode('');
    setCity('');
    setState('');
    setError('');
    setIsValidated(false);
    onClose();
  };

  const handleGetQuote = () => {
    handleClose();
    onGetQuote();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="text-center">
            {!isValidated ? (
              <>
                {/* Title */}
                <h2 className="text-2xl font-black mb-2">Check Your Area</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Enter your ZIP code
                </p>

                {/* Zip Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleZipCheck();
                      }
                    }}
                    placeholder="ZIP code"
                    className="w-full px-4 py-3 text-center text-lg font-bold border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                  />
                  {error && (
                    <p className="text-red-600 text-xs mt-2">{error}</p>
                  )}
                </div>

                {/* Check Button */}
                <button
                  onClick={handleZipCheck}
                  disabled={isLoading || zipCode.length !== 5}
                  className="w-full px-6 py-3 bg-black text-white font-bold uppercase text-sm tracking-wider rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Checking...
                    </span>
                  ) : (
                    'Check Availability'
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={24} className="text-white" />
                </div>

                {/* Success Message */}
                <h2 className="text-2xl font-black mb-2">We Service Your Area</h2>
                
                {/* Location Display */}
                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-base font-bold">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{city}, {state}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">ZIP: {zipCode}</p>
                </div>

                {/* Get Quote Button */}
                <button
                  onClick={handleGetQuote}
                  className="w-full px-6 py-3 bg-black text-white font-bold uppercase text-sm tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Get A Quote
                </button>

                {/* Check Another */}
                <button
                  onClick={() => {
                    setZipCode('');
                    setCity('');
                    setState('');
                    setIsValidated(false);
                  }}
                  className="w-full mt-2 px-6 py-2 text-gray-600 text-sm hover:text-black transition-colors"
                >
                  Check Another ZIP Code
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
