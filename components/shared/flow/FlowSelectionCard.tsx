import React from 'react';
import { Check } from 'lucide-react';

interface FlowSelectionCardProps {
  title: string;
  description: string;
  fromPrice?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  badge?: string;
  onClick?: () => void;
}

export const FlowSelectionCard: React.FC<FlowSelectionCardProps> = ({
  title,
  description,
  fromPrice,
  icon,
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
    className={`w-full bg-white border rounded-xl p-4 text-left transition-all ${
      disabled
        ? 'border-secondary-100 opacity-60 cursor-not-allowed'
        : selected
          ? 'border-brand ring-2 ring-brand/15 shadow-sm'
          : 'border-secondary-200 hover:border-secondary-300 hover:shadow-sm'
    }`}
  >
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
            selected ? 'border-brand bg-brand' : 'border-secondary-200 bg-white'
          }`}
          aria-hidden
        >
          {selected && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <h3 className={`text-base font-semibold ${disabled ? 'text-secondary-400' : 'text-secondary'}`}>{title}</h3>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-secondary-100 text-secondary-500 rounded-full shrink-0">
            {badge}
          </span>
        )}
      </div>
      {fromPrice && !disabled && (
        <span className="text-sm font-medium text-pink-500 shrink-0">{fromPrice}</span>
      )}
    </div>
    <div className="flex items-end justify-between gap-4 pl-[1.875rem]">
      <p className={`text-sm leading-relaxed flex-1 ${disabled ? 'text-secondary-400' : 'text-secondary-500'}`}>
        {description}
      </p>
      {icon && <div className="w-12 h-12 shrink-0 text-secondary-300">{icon}</div>}
    </div>
  </button>
);
