import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, MapPinned } from 'lucide-react';
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
  'w-full pl-9 pr-4 py-3 bg-white border border-secondary-100 rounded-xl text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all';

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

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          value={addressQuery}
          onChange={(e) => handleAddressInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClassName}
        />
        <MapPinned size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
        {loading && (
          <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-secondary-300" />
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.display}-${index}`}
              type="button"
              onClick={() => selectSuggestion(suggestion)}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-secondary-100 transition-colors flex items-start gap-2 text-secondary border-b border-secondary-100 last:border-b-0"
            >
              <MapPinned size={14} className="text-secondary-400 mt-0.5 shrink-0" />
              <span>{suggestion.display}</span>
            </button>
          ))}
        </div>
      )}
      {validated && showUnitField && (
        <input
          value={value.unitNumber}
          onChange={(e) => onChange({ ...value, unitNumber: e.target.value })}
          placeholder="Apt / Unit / Suite (optional)"
          autoComplete="address-line2"
          className="w-full px-4 py-3 bg-white border border-secondary-100 rounded-xl mt-2 text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
        />
      )}
      {error && (
        <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
};
