import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Check } from 'lucide-react';

export const FullServiceSection: React.FC = () => {
  const navigate = useNavigate();
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
      if (!response.ok) {
        setError('ZIP code not found. Please try again.');
        return;
      }
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

  return (
    <section className="py-16 md:py-24 bg-[#f8f9fa] border-b border-secondary-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Service Area Estimate Image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute -inset-2 bg-secondary-900/5 rounded-[32px] blur-xl" />
            <img 
              src="/estimates (1).webp" 
              alt="Opek service pricing estimates map" 
              className="relative w-full max-w-[400px] h-auto rounded-[32px] object-cover shadow-2xl border border-secondary-100/60"
            />
          </div>

          {/* Right Column: Pricing details & availability checker */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary tracking-tight leading-tight">
              Our flat rates cover <span className="text-brand">everything.</span> You just point.
            </h2>
            
            <ul className="space-y-3.5 text-secondary-500 text-sm md:text-base font-semibold">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />
                <span>No curb dragging — we retrieve items from any room or floor</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />
                <span>Fully insured, vetted, and background-checked local crews</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />
                <span>All labor, heavy lifting, and sweeping cleanup included</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />
                <span>All disposal, transfer station, and recycling fees covered</span>
              </li>
            </ul>

            {/* Availability Check form card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_15px_45px_rgba(0,0,0,0.04)] border border-secondary-100 max-w-lg mt-8">
              {!verified ? (
                <div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 flex items-center bg-secondary-50/50 border border-secondary-200/60 rounded-xl p-1 focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand focus-within:bg-white transition-all duration-300">
                      <div className="pl-3 text-secondary-400 pointer-events-none">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        value={zipCode}
                        onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                        placeholder="Enter Zip Code"
                        className="flex-1 bg-transparent border-0 px-3 py-2.5 text-sm font-extrabold text-secondary placeholder:text-secondary-300 focus:ring-0 focus:outline-none tracking-widest"
                      />
                    </div>
                    <button
                      onClick={handleZipCheck}
                      disabled={isLoading || zipCode.length !== 5}
                      className="px-6 py-3 bg-brand text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg whitespace-nowrap inline-flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Check Availability</span>
                      )}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-xs font-bold mt-2 px-1">{error}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-green-50 text-green-800 p-3.5 rounded-xl border border-green-100">
                    <Check className="w-5 h-5 text-green-600 shrink-0" strokeWidth={3} />
                    <div className="text-xs leading-normal">
                      <span className="font-extrabold block">Service is available in your area!</span>
                      <span className="opacity-90">{city}, {stateAbbr} (ZIP {zipCode})</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate('/quote')}
                      className="flex-grow py-3 px-6 bg-[#ff006e] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-600 transition-colors shadow-md shadow-brand/10"
                    >
                      Get a Free Quote
                    </button>
                    <button
                      onClick={() => { setVerified(false); setZipCode(''); }}
                      className="py-3 px-6 border border-secondary-200 text-secondary hover:bg-secondary-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                    >
                      Check Another Zip
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
