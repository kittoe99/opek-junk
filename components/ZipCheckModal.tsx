import React, { useState } from 'react';
import { X, MapPin, Check, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ZipCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetQuote: () => void;
}

const SERVICE_AREAS = [
  {
    name: 'Dallas-Fort Worth',
    stateAbbr: 'TX',
    slug: 'dallas-fort-worth',
    states: ['TX'],
    cities: ['Dallas','Fort Worth','Plano','Arlington','Irving','Garland','Frisco','McKinney','Mesquite','Grand Prairie','Carrollton','Denton','Allen','Richardson','Lewisville','Grapevine','Flower Mound','Euless','Bedford','Hurst'],
  },
  {
    name: 'Jacksonville',
    stateAbbr: 'FL',
    slug: 'jacksonville',
    states: ['FL'],
    cities: ['Jacksonville','Jacksonville Beach','Neptune Beach','Atlantic Beach','Ponte Vedra','Orange Park','Fleming Island','Fernandina Beach','Yulee','St. Augustine','Green Cove Springs','Middleburg'],
  },
  {
    name: 'Atlanta',
    stateAbbr: 'GA',
    slug: 'atlanta',
    states: ['GA'],
    cities: ['Atlanta','Decatur','Sandy Springs','Marietta','Alpharetta','Smyrna','Roswell','Dunwoody','Kennesaw','Peachtree City','Norcross','Duluth','Lawrenceville','Brookhaven','East Point','College Park','Union City','Fayetteville','Woodstock','Cumming'],
  },
];

function findServiceArea(state: string, city: string) {
  const normState = state.trim().toUpperCase();
  const normCity = city.trim().toLowerCase();
  return SERVICE_AREAS.find(
    (s) => s.states.includes(normState) &&
      s.cities.some((c) => normCity.includes(c.toLowerCase()) || c.toLowerCase().includes(normCity))
  ) ?? null;
}

export const ZipCheckModal: React.FC<ZipCheckModalProps> = ({ isOpen, onClose, onGetQuote }) => {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [stateAbbr, setStateAbbr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ served: boolean; areaName?: string; areaSlug?: string } | null>(null);

  const handleZipCheck = async () => {
    if (zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (!response.ok) { setError('ZIP code not found. Please try again.'); return; }
      const data = await response.json();
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        const c = place['place name'];
        const s = place['state abbreviation'];
        setCity(c);
        setStateAbbr(s);
        const area = findServiceArea(s, c);
        setResult({ served: !!area, areaName: area?.name, areaSlug: area?.slug });
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
    setResult(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleGetQuote = () => { handleClose(); onGetQuote(); };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-secondary-100">
            <div className="inline-flex items-center gap-2">
              <span className="block w-6 h-px bg-brand" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Service Area Check</span>
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

            {/* ── Input state ── */}
            {!result && (
              <>
                <h2 className="text-2xl font-black text-secondary tracking-tight leading-[1.05] mb-1">
                  Check your <span className="text-brand">area.</span>
                </h2>
                <p className="text-secondary-400 text-sm mb-5">
                  Enter your ZIP to confirm we serve your location.
                </p>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                    placeholder="e.g. 75201"
                    className="flex-1 px-4 py-3 bg-secondary-50 border border-secondary-100 rounded-lg text-sm font-bold text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors text-center tracking-widest"
                    autoFocus
                  />
                  <button
                    onClick={handleZipCheck}
                    disabled={isLoading || zipCode.length !== 5}
                    className="px-4 py-3 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                  >
                    {isLoading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                  </button>
                </div>

                {error && <p className="text-red-500 text-xs font-bold mb-3">{error}</p>}

                {/* Active markets */}
                <div className="mt-4 pt-4 border-t border-secondary-100">
                  <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-2.5">Active Markets</p>
                  <div className="space-y-1.5">
                    {SERVICE_AREAS.map((area) => (
                      <div key={area.slug} className="flex items-center gap-2.5 px-3 py-2 bg-secondary-50 rounded-lg border border-secondary-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                        <span className="text-xs font-bold text-secondary">{area.name}</span>
                        <span className="text-xs text-secondary-400 ml-auto">{area.stateAbbr}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-dashed border-secondary-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary-300 shrink-0" />
                      <span className="text-xs text-secondary-400">More cities coming soon</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Served ── */}
            {result?.served && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Check size={18} className="text-green-600" strokeWidth={3} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-secondary tracking-tight leading-tight">We're in your area!</h2>
                    <p className="text-secondary-400 text-xs">Same-day pickup available</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-secondary-50 border border-secondary-100 rounded-xl px-4 py-3 mb-5">
                  <MapPin size={14} className="text-brand shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-secondary truncate">{city}, {stateAbbr}</p>
                    <p className="text-xs text-secondary-400">{result.areaName} service area · ZIP {zipCode}</p>
                  </div>
                </div>

                <button
                  onClick={handleGetQuote}
                  className="w-full py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 mb-2 shadow-md"
                >
                  Get a Free Quote <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => { handleClose(); navigate(`/locations/${result.areaSlug}`); }}
                  className="w-full py-2.5 border border-secondary-100 text-secondary font-bold text-xs uppercase tracking-wider rounded-lg hover:border-brand hover:text-brand transition-colors inline-flex items-center justify-center gap-2"
                >
                  <MapPin size={12} /> View {result.areaName} Page
                </button>
                <button onClick={reset} className="w-full py-2 text-xs font-bold text-secondary-400 hover:text-brand transition-colors mt-1">
                  Check a different ZIP
                </button>
              </>
            )}

            {/* ── Not served ── */}
            {result && !result.served && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle size={18} className="text-secondary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-secondary tracking-tight leading-tight">Not yet available</h2>
                    <p className="text-secondary-400 text-xs">We're expanding fast</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-secondary-50 border border-secondary-100 rounded-xl px-4 py-3 mb-5">
                  <MapPin size={14} className="text-secondary-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-secondary truncate">{city}, {stateAbbr}</p>
                    <p className="text-xs text-secondary-400">ZIP {zipCode} · Outside current coverage</p>
                  </div>
                </div>

                <p className="text-secondary-400 text-xs mb-5 leading-relaxed">
                  We don't serve this area yet, but you can still submit a request and we'll reach out as soon as we launch nearby.
                </p>

                <button
                  onClick={handleGetQuote}
                  className="w-full py-3.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 mb-2"
                >
                  Submit a Request Anyway <ArrowRight size={14} />
                </button>
                <button onClick={reset} className="w-full py-2 text-xs font-bold text-secondary-400 hover:text-brand transition-colors">
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
