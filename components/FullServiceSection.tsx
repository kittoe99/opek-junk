import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Check, Search, AlertCircle } from 'lucide-react';

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
              <div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                    placeholder="Enter ZIP code"
                    className="flex-1 px-4 py-3 text-sm bg-secondary-50 border border-secondary-100 rounded-lg text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors font-mono tracking-wider"
                  />
                  <button
                    onClick={handleZipCheck}
                    disabled={zipCode.length !== 5 || isLoading}
                    className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 whitespace-nowrap"
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

        </div>
      </div>
    </section>
  );
};
