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
  'relative z-10 w-full bg-white p-5 rounded-2xl text-left flex items-center gap-4 touch-manipulation select-none min-h-[5.5rem]';

export const EstimateMethodSelection: React.FC<EstimateMethodSelectionProps> = ({
  onPhotoEstimate,
  onSelectItems,
  className = '',
}) => (
  <div className={`grid grid-cols-1 gap-3 max-w-xl mx-auto ${className}`}>
    <button
      type="button"
      onClick={onSelectItems}
      className={`${cardBase} border-2 border-brand shadow-md shadow-brand/10 cursor-pointer`}
    >
      <div className="w-12 h-12 bg-white border-2 border-brand rounded-xl flex items-center justify-center shrink-0 pointer-events-none">
        <ManualEntryIcon size={24} className="text-brand" />
      </div>
      <div className="flex-1 min-w-0 pointer-events-none">
        <h3 className="text-sm md:text-base font-black text-brand mb-0.5">Select Your Items</h3>
        <p className="text-secondary-400 text-xs md:text-sm">Pick items from the catalog for a quote</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0 pointer-events-none">
        <ArrowRight size={16} className="text-white" />
      </div>
    </button>

    <button
      type="button"
      disabled
      onClick={onPhotoEstimate}
      className={`${cardBase} border border-secondary-100 opacity-60 cursor-not-allowed`}
    >
      <div className="w-12 h-12 bg-white border border-secondary-200 rounded-xl flex items-center justify-center shrink-0 pointer-events-none grayscale opacity-60">
        <PhotoEstimateIcon size={24} className="text-secondary-400" />
      </div>
      <div className="flex-1 min-w-0 pointer-events-none">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h3 className="text-sm md:text-base font-black text-secondary-500">Photo Estimate</h3>
          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-secondary-100 text-secondary-500 rounded-full">
            Coming Soon
          </span>
        </div>
        <p className="text-secondary-400 text-xs md:text-sm">Snap a photo for instant AI pricing</p>
      </div>
      <div className="w-9 h-9 rounded-full border border-secondary-100 bg-white flex items-center justify-center shrink-0 pointer-events-none text-secondary-300">
        <ArrowRight size={16} />
      </div>
    </button>
  </div>
);
