import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Search, AlertCircle, MapPin } from 'lucide-react';

export const FullServiceSection: React.FC = () => {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError('ZIP code not found. Please try again.');
        return;
      }
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        const cityVal = place['place name'];
        const stateVal = place['state abbreviation'];
        
        // Auto open the quote page with the validation success details
        navigate('/quote', {
          state: {
            zipResult: { city: cityVal, state: stateVal, served: true },
            zipValue: zipCode,
            serviceType: 'junk_removal'
          }
        });
      } else {
        setError('ZIP code not found.');
      }
    } catch {
      setError('Unable to validate ZIP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-[#f8f9fa] py-10 md:py-12 overflow-hidden border-b border-secondary-100/60">
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
          <div className="w-full lg:max-w-md shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 flex items-center bg-white border-2 border-secondary-100 hover:border-secondary-300 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 transition-all duration-300 p-1">
                <span className="pl-3 text-secondary-400">
                  <MapPin size={18} />
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
                className="px-6 py-3.5 bg-secondary text-white font-bold text-sm uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto"
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
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-3">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-xs font-semibold">{error}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
