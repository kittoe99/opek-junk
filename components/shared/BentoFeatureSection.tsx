import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface BentoItem {
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

interface TabOption {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface BentoFeatureSectionProps {
  eyebrow?: string;
  title: React.ReactNode;
  description: string;
  items: BentoItem[];
  tabs?: TabOption[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
}

export const BentoFeatureSection: React.FC<BentoFeatureSectionProps> = ({
  eyebrow,
  title,
  description,
  items,
  tabs,
  activeTab,
  onTabChange,
}) => {
  const gridClass =
    items.length <= 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      className="py-16 md:py-24 lg:py-28 overflow-hidden border-b border-secondary-100/40"
      style={{
        background: 'linear-gradient(135deg, #eef8f3 0%, #f7f9fc 45%, #f3f0f8 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">{eyebrow}</p>
          )}
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-secondary tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-secondary-500 text-sm md:text-base leading-relaxed">{description}</p>

          {tabs && onTabChange && (
            <div className="mt-6 inline-flex p-1 bg-white/80 rounded-full border border-secondary-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-secondary text-white'
                      : 'text-secondary-500 hover:text-secondary'
                  }`}
                >
                  {tab.icon && <tab.icon size={15} />}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`grid ${gridClass} gap-4 md:gap-5`}>
          {items.map((item) => {
            const Wrapper = item.onClick ? 'button' : 'div';
            return (
              <Wrapper
                key={item.label}
                type={item.onClick ? 'button' : undefined}
                onClick={item.onClick}
                className={`group text-left bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-white/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${
                  item.onClick ? 'cursor-pointer w-full' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-50 text-secondary-500 group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center mb-5 transition-colors duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-secondary text-base md:text-lg mb-2 group-hover:text-brand transition-colors">
                  {item.label}
                </h3>
                <p className="text-secondary-400 text-sm leading-relaxed">{item.desc}</p>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
