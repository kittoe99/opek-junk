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
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-secondary-100/40 animate-scale-in overflow-hidden relative transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Ambient Accent Glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b border-secondary-100/40 relative z-10">
            <div className="inline-flex items-center gap-2">
              <span className="block w-6 h-1 bg-brand rounded-full" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Service Area Check</span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-secondary-400 hover:text-secondary hover:bg-secondary-50 transition-all rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-8 relative z-10">

            {/* ── Input state ── */}
            {!verified && (
              <>
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-5 shadow-[0_8px_16px_-6px_rgba(255,0,110,0.3)] animate-pulse-slow">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>

                <h2 className="text-3xl font-black text-secondary tracking-tight leading-none mb-2">
                  Confirm your <span className="text-brand">ZIP.</span>
                </h2>
                <p className="text-secondary-400 text-sm leading-relaxed mb-6 font-medium">
                  Service is available in all 50 states — just enter your ZIP code to check local availability.
                </p>

                {/* Sleek unified Input Pill */}
                <div className="relative flex items-center bg-secondary-50/50 border border-secondary-200/60 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand focus-within:bg-white transition-all duration-300 shadow-inner mb-3">
                  <div className="pl-3 text-secondary-400 pointer-events-none">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                    placeholder="e.g. 75201"
                    className="flex-1 bg-transparent border-0 px-3 py-3 text-base font-extrabold text-secondary placeholder:text-secondary-300 focus:ring-0 focus:outline-none tracking-widest text-center"
                    autoFocus
                  />
                  <button
                    onClick={handleZipCheck}
                    disabled={isLoading || zipCode.length !== 5}
                    className="h-11 px-6 bg-brand text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-600 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(255,0,110,0.2)] hover:shadow-[0_6px_20px_rgba(255,0,110,0.3)] disabled:shadow-none shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <span>Check</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-extrabold flex items-center gap-1.5 mt-1 px-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </p>
                )}

                <div className="flex items-start gap-2.5 mt-6 pt-5 border-t border-secondary-100/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                  <p className="text-secondary-400 text-xs leading-relaxed">
                    <span className="font-bold text-secondary-500">Nationwide coverage:</span> Same flat-rate pricing, same crew standards — wherever you are.
                  </p>
                </div>
              </>
            )}

            {/* ── Verified State ── */}
            {verified && (
              <>
                <div className="flex flex-col items-center text-center pb-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] mb-4 animate-scale-in">
                    <Check size={32} strokeWidth={3} className="animate-fade-in" />
                  </div>
                  <h2 className="text-2xl font-black text-secondary tracking-tight leading-tight mb-1">
                    You're in our area!
                  </h2>
                  <p className="text-secondary-400 text-sm font-medium">
                    Same-day pickup is available in your region.
                  </p>
                </div>

                {/* Shaded Location Details Card */}
                <div className="bg-secondary-50/50 rounded-2xl p-4 border border-secondary-100/40 flex items-center gap-3.5 my-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <MapPin size={20} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="text-[10px] font-black text-secondary-300 uppercase tracking-wider block">Service Location</span>
                    <p className="text-base font-extrabold text-secondary truncate">{city}, {stateAbbr}</p>
                    <p className="text-xs text-brand font-bold">ZIP {zipCode}</p>
                  </div>
                </div>

                <button
                  onClick={handleGetQuote}
                  className="w-full py-4 bg-gradient-to-r from-secondary to-secondary-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:from-brand hover:to-brand-600 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(53,80,112,0.15)] hover:shadow-[0_8px_24px_rgba(255,0,110,0.25)]"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={reset}
                  className="w-full py-3 text-xs font-bold text-secondary-400 hover:text-brand transition-colors mt-2"
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
