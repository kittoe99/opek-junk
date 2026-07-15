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
    <section className="py-16 md:py-20 bg-white border-b border-secondary-100/40">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <p className="text-xs font-medium text-secondary-400 mb-2">{eyebrow}</p>
        <h2 className="font-serif text-xl md:text-2xl font-semibold text-secondary mb-5">{title}</h2>
        <div className="text-sm text-secondary-500 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
};
