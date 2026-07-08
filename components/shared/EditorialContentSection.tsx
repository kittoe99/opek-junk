import React from 'react';

interface EditorialContentSectionProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}

export const EditorialContentSection: React.FC<EditorialContentSectionProps> = ({
  eyebrow = 'Learn more',
  title,
  children,
}) => {
  return (
    <section className="py-16 md:py-24 lg:py-28 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f3f3f3] rounded-3xl p-6 md:p-10 lg:p-12 border border-secondary-100/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">{eyebrow}</p>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-secondary leading-tight tracking-tight">
                {title}
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-4 text-secondary-500 text-sm md:text-base leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
