import React, { useState } from 'react';
import { X, MapPin, Check, Loader2, ArrowRight } from 'lucide-react';
import { InputZipIcon } from './icons/ServiceIcons';

interface ZipCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetQuote: () => void;
}

export const ZipCheckModal: React.FC<ZipCheckModalProps> = ({ isOpen, onClose, onGetQuote }) => {
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [stateAbbr, setStateAbbr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleZipCheck = async () => {
    if (zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    setIsLoading(true);
    setError('');
    setVerified(false);
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!response.ok) { setError('ZIP code not found. Please try again.'); return; }
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        setCity(place['place name']);
        setStateAbbr(place['state abbreviation']);
        setVerified(true);
      } else {
        setError('ZIP code not found.');
      }
    } catch {
      setError('Unable to validate ZIP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setZipCode('');
    setCity('');
    setStateAbbr('');
    setError('');
    setVerified(false);
  };

  const handleClose = () => { reset(); onClose(); };
  const handleGetQuote = () => { handleClose(); onGetQuote(); };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white w-full max-w-[340px] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-secondary-100/40 animate-scale-in overflow-hidden relative transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Ambient Accent Glows */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center text-secondary-400 hover:text-secondary hover:bg-white transition-all rounded-full z-20"
          >
            <X size={16} />
          </button>

          {/* Body */}
          <div className="p-5 relative z-10">

            {/* ── Input state ── */}
            {!verified && (
              <>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-brand uppercase tracking-[0.25em] mb-2.5">
                  <MapPin size={11} strokeWidth={2.5} />
                  <span>Service Area Check</span>
                </div>

                <h2 className="text-xl font-black text-secondary tracking-tight leading-none mb-1.5">
                  Confirm your <span className="text-brand">ZIP.</span>
                </h2>
                <p className="text-secondary-400 text-xs leading-normal mb-4 font-medium">
                  Service is available in all 50 states — just enter your ZIP code to check local availability.
                </p>

                {/* Sleek unified Input Pill */}
                <div className="relative group flex items-center bg-white border border-secondary-100 hover:border-brand/40 hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 focus-within:shadow-[0_4px_20px_rgba(255,0,110,0.15)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 p-1 mb-2.5 rounded-xl">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                    placeholder="e.g. 75201"
                    className="flex-1 min-w-0 w-full bg-transparent border-none px-4 py-2 text-sm font-extrabold text-secondary placeholder:text-secondary-300 focus:outline-none tracking-widest text-center"
                    style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                    autoFocus
                  />
                  <button
                    onClick={handleZipCheck}
                    disabled={isLoading || zipCode.length !== 5}
                    className="h-8 px-4 bg-brand text-white font-black text-[10px] uppercase tracking-wider rounded-lg hover:bg-brand-600 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 shadow-[0_3px_8px_rgba(255,0,110,0.15)] hover:shadow-[0_4px_12px_rgba(255,0,110,0.25)] disabled:shadow-none shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <>
                        <span>Check</span>
                        <ArrowRight size={11} />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] font-extrabold flex items-center gap-1 mt-0.5 px-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                    {error}
                  </p>
                )}

                <div className="flex items-start gap-2 mt-4 pt-3.5 border-t border-secondary-100/50">
                  <div className="w-1 h-1 rounded-full bg-brand mt-1.5 shrink-0" />
                  <p className="text-secondary-400 text-[10px] leading-relaxed">
                    <span className="font-bold text-secondary-500">Nationwide coverage:</span> Same flat-rate pricing, same independent provider standards — wherever you are.
                  </p>
                </div>
              </>
            )}

            {/* ── Verified State ── */}
            {verified && (
              <>
                <div className="flex flex-col items-center text-center pb-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_6px_12px_rgba(16,185,129,0.2)] mb-3 animate-scale-in">
                    <Check size={20} strokeWidth={3} className="animate-fade-in" />
                  </div>
                  <h2 className="text-lg font-black text-secondary tracking-tight leading-tight mb-0.5">
                    Service available in your area!
                  </h2>
                  <p className="text-secondary-400 text-xs font-semibold">
                    Same-day pickup is available.
                  </p>
                </div>

                {/* Shaded Location Details Card */}
                <div className="bg-white rounded-xl p-3 border border-secondary-100/40 flex items-center gap-3 my-4 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <MapPin size={16} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[8px] font-black text-secondary-300 uppercase tracking-wider block">Service Location</span>
                    <p className="text-sm font-extrabold text-secondary truncate">{city}, {stateAbbr}</p>
                    <p className="text-[10px] text-brand font-bold">ZIP {zipCode}</p>
                  </div>
                </div>

                <button
                  onClick={handleGetQuote}
                  className="w-full py-3 bg-gradient-to-r from-secondary to-secondary-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg hover:from-brand hover:to-brand-600 active:scale-98 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(53,80,112,0.15)] hover:shadow-[0_6px_16px_rgba(255,0,110,0.25)]"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight size={12} />
                </button>
                <button
                  onClick={reset}
                  className="w-full py-2.5 text-[10px] font-bold text-secondary-400 hover:text-brand transition-colors mt-1"
                >
                  Check another ZIP code
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};
