import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, MapPinned } from 'lucide-react';
import {
  AddressLocationBias,
  AddressSuggestion,
  fetchAddressSuggestions,
} from '../../services/addressSearch';

export type { AddressSuggestion, AddressLocationBias } from '../../services/addressSearch';

export interface ServiceAddressValue {
  address: string;
  unitNumber: string;
  city: string;
  state: string;
  zipCode: string;
}

export const EMPTY_SERVICE_ADDRESS: ServiceAddressValue = {
  address: '',
  unitNumber: '',
  city: '',
  state: '',
  zipCode: '',
};

const INPUT_CLASS =
  'w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)] hover:border-brand/40 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-4 focus:ring-brand/10 focus:border-brand focus:shadow-[0_4px_20px_rgba(255,0,110,0.15)] transition-all duration-300';

export function isServiceAddressValidated(value: ServiceAddressValue): boolean {
  return Boolean(value.address.trim() && value.city.trim() && value.state.trim());
}

export function formatServiceAddressLocation(value: ServiceAddressValue): string {
  return [value.city, value.state, value.zipCode].filter(Boolean).join(', ');
}

interface ServiceAddressFieldProps {
  label?: string;
  value: ServiceAddressValue;
  onChange: (value: ServiceAddressValue) => void;
  validated: boolean;
  onValidatedChange: (validated: boolean) => void;
  error?: string | null;
  onErrorChange?: (error: string | null) => void;
  locationBias?: AddressLocationBias;
  /** @deprecated Use locationBias instead */
  searchBiasZip?: string;
  placeholder?: string;
  inputClassName?: string;
  showUnitField?: boolean;
}

export const ServiceAddressField: React.FC<ServiceAddressFieldProps> = ({
  label = 'Service Address',
  value,
  onChange,
  validated,
  onValidatedChange,
  error,
  onErrorChange,
  locationBias,
  searchBiasZip,
  placeholder = 'Start typing an address...',
  inputClassName = INPUT_CLASS,
  showUnitField = true,
}) => {
  const resolvedBias: AddressLocationBias = {
    zipCode: locationBias?.zipCode || searchBiasZip,
    city: locationBias?.city,
    state: locationBias?.state,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [addressQuery, setAddressQuery] = useState(value.address);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (validated) {
      setAddressQuery(value.address);
    }
  }, [validated, value.address]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSuggestions = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const results = await fetchAddressSuggestions(query, resolvedBias);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    },
    [resolvedBias.zipCode, resolvedBias.city, resolvedBias.state]
  );

  const handleAddressInput = (nextValue: string) => {
    setAddressQuery(nextValue);
    onValidatedChange(false);
    onErrorChange?.(null);
    onChange({
      ...value,
      address: nextValue,
      city: '',
      state: '',
      zipCode: '',
    });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadSuggestions(nextValue), 300);
  };

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    setAddressQuery(suggestion.street);
    onChange({
      ...value,
      address: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
    });
    onValidatedChange(true);
    onErrorChange?.(null);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const locationSummary = formatServiceAddressLocation(value);

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="relative">
        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
          <MapPinned size={11} className="inline mr-1" />
          {label} *
        </label>
        {resolvedBias.zipCode && (
          <p className="mb-2 text-[11px] font-semibold text-secondary-400">
            US addresses near ZIP {resolvedBias.zipCode}
            {resolvedBias.city && resolvedBias.state
              ? ` (${resolvedBias.city}, ${resolvedBias.state})`
              : ''}
          </p>
        )}
        {!resolvedBias.zipCode && (
          <p className="mb-2 text-[11px] font-semibold text-secondary-400">
            US addresses only
          </p>
        )}
        <div className="relative group">
          <input
            value={addressQuery}
            onChange={(e) => handleAddressInput(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            autoComplete="off"
            className={inputClassName}
          />
          {loading && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-secondary-300" />
          )}
        </div>
        {!validated && addressQuery.length >= 3 && !loading && suggestions.length === 0 && (
          <p className="mt-2 text-[11px] font-semibold text-secondary-400">
            Keep typing, then choose your address from the suggestions.
          </p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.display}-${index}`}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-secondary-50 transition-colors border-b border-secondary-100 last:border-b-0 flex items-start gap-2 text-secondary"
              >
                <MapPinned size={14} className="text-brand mt-0.5 shrink-0" />
                <span>{suggestion.display}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {validated && locationSummary && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-brand/15 bg-brand/5 animate-fade-in">
          <CheckCircle2 size={16} className="text-brand mt-0.5 shrink-0" strokeWidth={2.5} />
          <div className="min-w-0">
            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.15em]">Confirmed location</p>
            <p className="text-sm font-bold text-secondary mt-0.5">{value.address}</p>
            <p className="text-xs font-semibold text-secondary-500 mt-0.5">{locationSummary}</p>
          </div>
        </div>
      )}

      {validated && showUnitField && (
        <div className="animate-fade-in">
          <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-1.5">
            Apt / Unit / Suite <span className="text-secondary-300 font-normal normal-case">(optional)</span>
          </label>
          <input
            value={value.unitNumber}
            onChange={(e) => onChange({ ...value, unitNumber: e.target.value })}
            placeholder="e.g. Apt 4B, Suite 200"
            autoComplete="address-line2"
            className={inputClassName}
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-xs font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};
