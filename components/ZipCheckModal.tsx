import React, { useState } from 'react';
import { X, MapPin, Check, Loader2, ArrowRight } from 'lucide-react';

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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-secondary-100">
            <div className="inline-flex items-center gap-2">
              <span className="block w-6 h-px bg-brand" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Service Area</span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-secondary-400 hover:text-secondary transition-colors rounded-full hover:bg-secondary-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {!isValidated ? (
              <>
                <h2 className="text-2xl md:text-3xl font-black text-secondary tracking-tight leading-[1.05] mb-1">
                  Check your <span className="text-brand">area.</span>
                </h2>
                <p className="text-secondary-400 text-sm mb-6">
                  Enter your ZIP code to confirm we serve your location.
                </p>

                {/* Input row */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                    placeholder="e.g. 90210"
                    className="flex-1 px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm font-bold text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors text-center tracking-widest"
                    autoFocus
                  />
                  <button
                    onClick={handleZipCheck}
                    disabled={isLoading || zipCode.length !== 5}
                    className="px-4 py-3 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    {isLoading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <ArrowRight size={15} />
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold">{error}</p>
                )}

                <p className="text-[10px] text-secondary-300 mt-4">
                  Currently serving Dallas-Fort Worth, Jacksonville FL, and Atlanta GA.
                </p>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
                    <Check size={18} className="text-brand" strokeWidth={3} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-secondary tracking-tight leading-tight">
                      We're in your area.
                    </h2>
                    <p className="text-secondary-400 text-xs">Ready to schedule same-day pickup</p>
                  </div>
                </div>

                {/* Location pill */}
                <div className="inline-flex items-center gap-2 bg-secondary-50 border border-secondary-100 rounded-full px-4 py-2 mb-6">
                  <MapPin size={13} className="text-brand shrink-0" />
                  <span className="text-sm font-black text-secondary">{city}, {state}</span>
                  <span className="text-xs text-secondary-400 font-medium">{zipCode}</span>
                </div>

                <button
                  onClick={handleGetQuote}
                  className="w-full py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 mb-2 shadow-md"
                >
                  Get a Free Quote <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => {
                    setZipCode('');
                    setCity('');
                    setState('');
                    setIsValidated(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-secondary-400 hover:text-brand transition-colors uppercase tracking-wider"
                >
                  Check a different ZIP
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
