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
    <section className="relative bg-[var(--bg)] border-b border-[var(--border)] overflow-hidden">
      <div className="absolute -top-24 right-[-8%] h-[280px] w-[280px] rounded-full bg-brand/[0.08] blur-[110px] pointer-events-none" aria-hidden />
      <div className={`relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 ${centered ? 'text-center' : ''}`}>
        <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
          {eyebrow && (
            <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">{eyebrow}</p>
          )}
          <h1 className="font-sans font-extrabold text-[1.85rem] sm:text-[2.4rem] md:text-[2.75rem] text-[var(--text)] tracking-tight leading-[1.1] mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
};
