import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface StatsStripProps {
  stats: Stat[];
  variant?: 'light' | 'dark';
}

export const StatsStrip: React.FC<StatsStripProps> = ({ stats, variant = 'light' }) => {
  const isDark = variant === 'dark';
  return (
    <section className={`${isDark ? 'bg-secondary' : 'bg-secondary-50'} py-12 md:py-16`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <div className={`text-4xl md:text-5xl font-black tracking-tight mb-1 ${isDark ? 'text-white' : 'text-secondary'}`}>
                {s.value}
              </div>
              <div className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/70' : 'text-secondary-400'}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
