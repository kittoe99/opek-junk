import React from 'react';

interface EditorialContentSectionProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}

export const EditorialContentSection: React.FC<EditorialContentSectionProps> = ({
  eyebrow = 'Learn More',
  title,
  children,
}) => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-secondary-50/40 overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2">
              <span className="block w-8 h-px bg-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">{eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-secondary leading-[1.05] tracking-tight">
              {title}
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-4 text-secondary-500 text-sm md:text-base leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
