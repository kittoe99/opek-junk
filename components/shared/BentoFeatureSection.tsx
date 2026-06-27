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
  eyebrow: string;
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
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{eyebrow}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              {title}
            </h2>

            <div className="w-12 h-0.5 bg-secondary-100" />

            <p className="text-secondary-500 text-sm md:text-base leading-relaxed max-w-sm font-medium">
              {description}
            </p>

            {tabs && onTabChange && (
              <div className="p-1.5 bg-secondary-50 rounded-2xl flex border border-secondary-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white text-secondary shadow-md ring-1 ring-secondary-100'
                        : 'text-secondary-400 hover:text-secondary'
                    }`}
                  >
                    {tab.icon && (
                      <tab.icon size={14} className={activeTab === tab.id ? 'text-brand' : ''} />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-secondary-100/60 border border-secondary-100/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {items.map((item) => (
                <div
                  key={item.label}
                  onClick={item.onClick}
                  className={`group bg-white p-6 md:p-8 hover:bg-secondary-50/20 transition-all duration-300 flex items-start gap-5 animate-fade-in ${
                    item.onClick ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary-50 group-hover:bg-brand/10 text-secondary-400 group-hover:text-secondary-900 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-secondary text-base md:text-lg transition-colors group-hover:text-brand duration-300">
                      {item.label}
                    </h3>
                    <p className="text-secondary-500 text-[13px] md:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
