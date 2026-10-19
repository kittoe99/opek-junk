import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxCardProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Full-width tappable checkbox used for consent and terms agreements. */
export const CheckboxCard: React.FC<CheckboxCardProps> = ({ checked, onChange, disabled, className = '', children }) => (
  <label className={`check-card ${className}`}>
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="check-box" aria-hidden>
      {checked && <Check size={14} strokeWidth={3.5} />}
    </span>
    <span className="check-text">{children}</span>
  </label>
);
