import React from 'react';
import { Check } from 'lucide-react';

interface FlowSelectionCardProps {
  title: string;
  description: string;
  fromPrice?: string;
  icon?: React.ReactNode;
  image?: string;
  selected?: boolean;
  disabled?: boolean;
  badge?: string;
  onClick?: () => void;
}

/** Selectable option row used across the quote and booking flows. */
export const FlowSelectionCard: React.FC<FlowSelectionCardProps> = ({
  title,
  description,
  fromPrice,
  icon,
  image,
  selected = false,
  disabled = false,
  badge,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className={`site-selection flow-option ${image ? 'flow-option-has-image' : ''} w-full text-left`}
  >
    {image ? (
      <span className="flow-option-media home-image-backdrop" aria-hidden>
        <img src={image} alt="" loading="lazy" />
      </span>
    ) : icon ? (
      <span className="flow-option-icon" aria-hidden>{icon}</span>
    ) : null}

    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="flow-option-title">{title}</span>
        {badge && <span className="flow-option-badge">{badge}</span>}
      </span>
      {fromPrice && !disabled && <span className="flow-option-price">{fromPrice}</span>}
      <span className="flow-option-desc">{description}</span>
    </span>

    <span className={`flow-option-radio ${selected ? 'is-on' : ''}`} aria-hidden>
      {selected && <Check size={13} strokeWidth={3} />}
    </span>
  </button>
);
