import React from 'react';

interface FlowStepTitleProps {
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const FlowStepTitle: React.FC<FlowStepTitleProps> = ({ title, subtitle, className = '' }) => (
  <div className={`text-center mb-6 md:mb-8 ${className}`}>
    <h1 className="font-sans font-extrabold text-2xl md:text-[1.75rem] text-[var(--text)] tracking-tight leading-snug">
      {title}
    </h1>
    {subtitle && (
      <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{subtitle}</p>
    )}
  </div>
);
