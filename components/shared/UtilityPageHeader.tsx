import React from 'react';

interface UtilityPageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
}

export const UtilityPageHeader: React.FC<UtilityPageHeaderProps> = ({
  eyebrow,
  title,
  description,
  centered = true,
}) => {
  return (
    <section className="bg-white border-b border-secondary-100/60">
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 ${centered ? 'text-center' : ''}`}>
        <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">{eyebrow}</p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-secondary tracking-tight leading-tight mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-secondary-500 text-sm md:text-base leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
};
