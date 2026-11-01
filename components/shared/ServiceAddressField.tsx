import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
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

const INPUT_CLASS = 'opek-field w-full pl-11 pr-4 py-3';

export function isServiceAddressValidated(value: ServiceAddressValue): boolean {
  return Boolean(value.address.trim() && value.city.trim() && value.state.trim());
}

export function formatServiceAddressLocation(value: ServiceAddressValue): string {
  return [value.city, value.state, value.zipCode].filter(Boolean).join(', ');
}

interface ServiceAddressFieldProps {
  label?: string;
  showLabel?: boolean;
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
  showLabel = true,
  value,
  onChange,
  validated,
  onValidatedChange,
  error,
  onErrorChange,
  locationBias,
  searchBiasZip,
  placeholder = 'Search your street address',
  inputClassName = INPUT_CLASS,
  showUnitField = true,
}) => {
  const errorId = useId();
  const resolvedBias: AddressLocationBias = {
    zipCode: locationBias?.zipCode || searchBiasZip,
    city: locationBias?.city,
    state: locationBias?.state,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [addressQuery, setAddressQuery] = useState(value.address);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = `${errorId}-list`;

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
      if (query.trim().length < 3) {
        setSuggestions([]);
        setSearchedQuery('');
        return;
      }
      setLoading(true);
      try {
        const results = await fetchAddressSuggestions(query, resolvedBias);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(true);
      } finally {
        setSearchedQuery(query);
        setActiveIndex(-1);
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
    setActiveIndex(-1);
  };

  const changeAddress = () => {
    setAddressQuery('');
    setSearchedQuery('');
    onValidatedChange(false);
    onChange({ ...value, address: '', city: '', state: '', zipCode: '' });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const typedEnough = addressQuery.trim().length >= 3;
  const noMatches = showSuggestions && !loading && typedEnough && searchedQuery === addressQuery && suggestions.length === 0;
  const location = formatServiceAddressLocation(value);

  return (
    <div ref={containerRef} className="qaddr relative">
      {showLabel && <label htmlFor={`${errorId}-input`} className="field-label">{label}</label>}
      {validated ? (
        <div className="qaddr-picked">
          <span className="qaddr-picked-icon"><MapPin size={20} aria-hidden /></span>
          <span className="qaddr-picked-text">
            <span className="qaddr-picked-street">{value.address}</span>
            {location && <span className="qaddr-picked-city">{location}</span>}
          </span>
          <button type="button" onClick={changeAddress} className="qaddr-change">Change</button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            id={`${errorId}-input`}
            role="combobox"
            aria-label={label}
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            value={addressQuery}
            onChange={(e) => handleAddressInput(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            className={`${inputClassName} qaddr-input`}
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#520f96] pointer-events-none" aria-hidden />
          {loading ? (
            <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[var(--text-muted)]" aria-label="Searching" />
          ) : addressQuery && (
            <button type="button" onClick={changeAddress} className="qaddr-clear" aria-label="Clear address">
              <X size={16} aria-hidden />
            </button>
          )}
        </div>
      )}
      {!validated && showSuggestions && suggestions.length > 0 && (
        <ul id={listId} role="listbox" aria-label="Address suggestions" className="ui-address-results qaddr-results">
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.display}-${index}`} role="presentation">
              <button
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(suggestion)}
                className={`qaddr-option${index === activeIndex ? ' is-active' : ''}`}
              >
                <MapPin size={16} className="qaddr-option-icon" aria-hidden />
                <span className="qaddr-option-text">
                  <span className="qaddr-option-street">{suggestion.street}</span>
                  <span className="qaddr-option-city">{[suggestion.city, suggestion.state, suggestion.zipCode].filter(Boolean).join(', ')}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!validated && noMatches && (
        <p className="qaddr-empty" role="status">No matching addresses yet. Keep typing your street number and name.</p>
      )}
      {!validated && !typedEnough && !error && (
        <p className="qaddr-hint">Start with your house number, then pick your address from the list.</p>
      )}
      {validated && showUnitField && (
        <input
          aria-label="Apartment, unit, or suite (optional)"
          value={value.unitNumber}
          onChange={(e) => onChange({ ...value, unitNumber: e.target.value })}
          placeholder="Apt / Unit / Suite (optional)"
          autoComplete="address-line2"
          className="opek-field w-full px-4 py-3 mt-2"
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="field-hint text-[#b01f42]">{error}</p>
      )}
    </div>
  );
};
