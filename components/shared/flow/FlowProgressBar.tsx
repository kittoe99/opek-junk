import React from 'react';

interface FlowProgressBarProps {
  /** 0–1 */
  progress: number;
}

export const FlowProgressBar: React.FC<FlowProgressBarProps> = ({ progress }) => {
  const pct = Math.min(100, Math.max(0, progress * 100));
  return (
    <div className="h-1 bg-secondary-100/80 w-full shrink-0" aria-hidden>
      <div
        className="h-full bg-brand transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
