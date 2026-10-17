import React from 'react';

interface FlowStepTitleProps {
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  as?: 'h1' | 'h2';
}

export const FlowStepTitle: React.FC<FlowStepTitleProps> = ({ title, subtitle, className = '', as: Heading = 'h1' }) => (
  <div className={`site-flow-title text-center mb-6 md:mb-8 ${className}`}>
    <Heading className="font-sans font-extrabold text-2xl md:text-[1.75rem] text-[var(--text)] tracking-tight leading-snug">
      {title}
    </Heading>
    {subtitle && (
      <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{subtitle}</p>
    )}
  </div>
);
