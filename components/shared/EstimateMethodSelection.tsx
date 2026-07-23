import React from 'react';
import { FlowSelectionCard } from './flow/FlowSelectionCard';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { ManualEntryIcon, PhotoEstimateIcon } from '../icons/ServiceIcons';

interface EstimateMethodSelectionProps {
  onPhotoEstimate: () => void;
  onSelectItems: () => void;
  className?: string;
}

export const EstimateMethodHero: React.FC = () => (
  <FlowStepTitle
    title="How would you like your estimate?"
    subtitle="Pick items from the catalog for an upfront quote."
  />
);

export const EstimateMethodSelection: React.FC<EstimateMethodSelectionProps> = ({
  onPhotoEstimate,
  onSelectItems,
  className = '',
}) => (
  <div className={`space-y-3 ${className}`}>
    <FlowSelectionCard
      title="Select your items"
      description="Choose from our catalog for an itemized quote"
      fromPrice="Instant"
      icon={<ManualEntryIcon className="w-full h-full text-[var(--text)] [&_.stroke-brand]:stroke-current" />}
      selected
      onClick={onSelectItems}
    />
    <FlowSelectionCard
      title="Photo estimate"
      description="Snap a photo for AI-powered pricing"
      badge="Coming Soon"
      icon={<PhotoEstimateIcon className="w-full h-full text-[var(--text)] [&_.stroke-brand]:stroke-current opacity-60" />}
      disabled
      onClick={onPhotoEstimate}
    />
  </div>
);
