import React from 'react';

interface FlowStepTitleProps {
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const FlowStepTitle: React.FC<FlowStepTitleProps> = ({ title, subtitle, className = '' }) => (
  <div className={`text-center mb-6 md:mb-8 ${className}`}>
    <h1 className="font-serif text-2xl md:text-[1.75rem] font-semibold text-secondary tracking-tight leading-snug">{title}</h1>
    {subtitle && <p className="text-sm text-secondary-500 mt-2 leading-relaxed">{subtitle}</p>}
  </div>
);
