import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { InputZipIcon } from './icons/ServiceIcons';

export const FullServiceSection: React.FC = () => {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleZipCheck = async () => {
    if (zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!response.ok) {
        setError('ZIP code not found. Please try again.');
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        const cityVal = place['place name'];
        const stateVal = place['state abbreviation'];
        
        setIsLoading(false);
        setIsSuccess(true);
        
        // Auto open the quote page with the validation success details after a short delay
        setTimeout(() => {
          navigate('/quote', {
            state: {
              zipResult: { city: cityVal, state: stateVal, served: true },
              zipValue: zipCode
            }
          });
        }, 2000);
      } else {
        setError('ZIP code not found.');
        setIsLoading(false);
      }
    } catch {
      setError('Unable to validate ZIP code. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-[#f8f9fa] bg-[url('/light-bg-pattern.png')] bg-repeat bg-[size:500px] py-10 md:py-12 overflow-hidden border-b border-secondary-100/60">
      {/* Background subtle glowing effect */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-16">
          
          {/* Left Side: Typography */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-brand" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Upfront Flat Rates</span>
            </div>
            <h3 className="text-secondary text-xl md:text-2xl font-black uppercase tracking-wide leading-tight">
              Our flat rates cover everything. <span className="text-brand">You just point.</span>
            </h3>
            <p className="text-secondary-400 text-xs md:text-sm font-semibold leading-relaxed">
              No curb dragging — we retrieve items from any room or floor. Fully insured local crews.
            </p>
          </div>

          {/* Right Side: ZIP code validator */}
          <div className="w-full lg:max-w-md shrink-0 relative min-h-[56px] sm:min-h-[56px]">
            <div className={`transition-all duration-500 ease-out absolute inset-0 ${isSuccess ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 z-10'}`}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative group flex-1 flex items-center bg-white border border-secondary-100 hover:border-brand/40 hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 focus-within:shadow-[0_4px_20px_rgba(255,0,110,0.15)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 p-1 rounded-xl">
                  <span className="pl-3 text-secondary-400 group-focus-within:text-brand transition-colors">
                    <InputZipIcon size={18} />
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                    placeholder="Enter ZIP code"
                    className="flex-1 pl-2.5 pr-4 py-2.5 text-base bg-transparent border-none text-secondary placeholder:text-secondary-300 focus:outline-none font-mono tracking-wider"
                    style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                  />
                </div>
                <button
                  onClick={handleZipCheck}
                  disabled={zipCode.length !== 5 || isLoading}
                  className="px-6 py-3.5 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto bg-secondary hover:bg-brand rounded-xl"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Check Availability</span>
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 mt-3 relative z-20 rounded-xl">
                  <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-xs font-semibold">{error}</p>
                </div>
              )}
            </div>

            <div className={`transition-all duration-500 ease-out absolute inset-0 flex items-center justify-center ${isSuccess ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-105 pointer-events-none'}`}>
              <div className="w-full bg-white border border-green-500 p-3 flex items-center gap-4 shadow-[0_0_20px_rgba(34,197,94,0.2)] rounded-xl">
                <div className="w-10 h-10 bg-green-500 flex items-center justify-center shrink-0 rounded-xl">
                  <CheckCircle2 size={24} className="text-white animate-scale-in" />
                </div>
                <div>
                  <p className="text-green-800 font-black uppercase tracking-wider text-sm leading-tight">Service Available!</p>
                  <p className="text-green-600 text-[11px] font-bold mt-0.5 flex items-center gap-1.5"><Loader2 size={10} className="animate-spin" /> Preparing your quote...</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
