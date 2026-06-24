import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PhotoEstimateIcon, ManualEntryIcon } from '../icons/ServiceIcons';

interface EstimateMethodSelectionProps {
  onPhotoEstimate: () => void;
  onSelectItems: () => void;
  className?: string;
}

export const EstimateMethodHero: React.FC = () => (
  <div className="mb-8">
    <h1 className="text-3xl md:text-4xl font-black text-secondary tracking-tight mb-2">
      Junk <span className="text-brand">removal.</span>
    </h1>
    <p className="text-sm text-secondary-400">
      Snap a photo or pick items from the catalog — upfront estimate, no obligations.
    </p>
  </div>
);

const cardBase =
  'relative z-10 w-full bg-white p-5 rounded-2xl text-left flex items-center gap-4 touch-manipulation select-none cursor-pointer min-h-[5.5rem]';

export const EstimateMethodSelection: React.FC<EstimateMethodSelectionProps> = ({
  onPhotoEstimate,
  onSelectItems,
  className = '',
}) => (
  <div className={`grid grid-cols-1 gap-3 max-w-xl mx-auto ${className}`}>
    <button
      type="button"
      onClick={onPhotoEstimate}
      className={`${cardBase} border-2 border-brand shadow-md shadow-brand/10`}
    >
      <div className="w-12 h-12 bg-white border-2 border-brand rounded-xl flex items-center justify-center shrink-0 pointer-events-none">
        <PhotoEstimateIcon size={24} className="text-brand" />
      </div>
      <div className="flex-1 min-w-0 pointer-events-none">
        <h3 className="text-sm md:text-base font-black text-brand mb-0.5">Photo Estimate</h3>
        <p className="text-secondary-400 text-xs md:text-sm mb-2">Snap a photo for instant AI pricing</p>
        <span className="inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-brand text-white rounded-full">
          Fastest
        </span>
      </div>
      <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0 pointer-events-none">
        <ArrowRight size={16} className="text-white" />
      </div>
    </button>

    <button
      type="button"
      onClick={onSelectItems}
      className={`${cardBase} border border-secondary-200`}
    >
      <div className="w-12 h-12 bg-white border border-secondary-200 rounded-xl flex items-center justify-center shrink-0 pointer-events-none">
        <ManualEntryIcon size={24} className="text-secondary" />
      </div>
      <div className="flex-1 min-w-0 pointer-events-none">
        <h3 className="text-sm md:text-base font-black text-secondary mb-0.5">Select Your Items</h3>
        <p className="text-secondary-400 text-xs md:text-sm">Pick items from the catalog for a quote</p>
      </div>
      <div className="w-9 h-9 rounded-full border border-secondary-200 bg-white flex items-center justify-center shrink-0 pointer-events-none">
        <ArrowRight size={16} className="text-secondary-300" />
      </div>
    </button>
  </div>
);
