import React from 'react';

interface FlowStepTitleProps {
  title: React.ReactNode;
  subtitle?: string;
  /** Small label above the title, e.g. the current step. */
  eyebrow?: string;
  className?: string;
  as?: 'h1' | 'h2';
}

export const FlowStepTitle: React.FC<FlowStepTitleProps> = ({ title, subtitle, eyebrow, className = '', as: Heading = 'h1' }) => (
  <div className={`site-flow-title text-center mb-7 md:mb-9 ${className}`}>
    {eyebrow && <p className="flow-eyebrow mb-2.5">{eyebrow}</p>}
    <Heading className="home-display text-[1.85rem] md:text-[2.2rem] leading-[0.98] text-[var(--text)]">
      {title}
    </Heading>
    {subtitle && (
      <p className="mx-auto mt-3 max-w-md text-[15px] text-[var(--text-muted)] leading-relaxed">{subtitle}</p>
    )}
  </div>
);
