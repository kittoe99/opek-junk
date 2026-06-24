import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const FullServiceSection: React.FC = () => {
  const navigate = useNavigate();
  const [zipValue, setZipValue] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const handleZipCheck = async () => {
    const zip = zipValue.trim();
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Enter a valid 5-digit ZIP.');
      return;
    }
    setZipLoading(true);
    setZipError(null);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) {
        setZipError('ZIP not found.');
        return;
      }
      const data = await res.json();
      const city = data.places?.[0]?.['place name'] ?? '';
      const state = data.places?.[0]?.['state abbreviation'] ?? '';

      navigate('/booking/mattress', {
        state: {
          zipResult: { city, state, served: true },
          zipValue: zip,
          preselectItems: [{ name: 'Mattress', quantity: 1 }],
        },
      });
    } catch {
      setZipError('Check failed. Try again.');
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <section className="py-14 md:py-20 bg-white border-b border-secondary-100/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">
                Upfront Flat Rates
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              Our flat rates cover everything.{' '}
              <span className="text-brand">You just point.</span>
            </h2>
            <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-lg font-medium">
              No curb dragging — we retrieve items from any room or floor. Fully insured local crews.
            </p>
          </div>

          <div className="lg:col-span-5 w-full lg:max-w-md lg:ml-auto">
            <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
              Check your pricing instantly
            </p>
            <div className="relative flex items-center bg-white border border-secondary-200 hover:border-brand/40 focus-within:border-brand shadow-md rounded-xl overflow-hidden p-1 w-full">
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zipValue}
                onChange={(e) => {
                  setZipValue(e.target.value.replace(/\D/g, ''));
                  setZipError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                placeholder="Enter ZIP code for pricing"
                className="flex-1 px-4 py-3 text-sm bg-transparent border-none text-secondary focus:outline-none font-mono tracking-wider min-w-0"
                style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
              />
              <button
                onClick={handleZipCheck}
                disabled={zipValue.length !== 5 || zipLoading}
                className="px-5 py-3 bg-brand hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 rounded-lg shrink-0 flex items-center gap-1.5"
              >
                {zipLoading ? <Loader2 size={14} className="animate-spin" /> : 'Check Rates'}
              </button>
            </div>
            {zipError && (
              <p className="text-xs text-red-500 font-semibold mt-2">{zipError}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
