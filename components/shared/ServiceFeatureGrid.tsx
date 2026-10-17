import React from 'react';
export interface ServiceFeatureItem { title: string; body: React.ReactNode; }
interface ServiceFeatureGridProps { title?: string; items: ServiceFeatureItem[]; }
export const ServiceFeatureGrid: React.FC<ServiceFeatureGridProps> = ({ title = 'The Opek Approach', items }) => (
  <section className="site-feature-section">
    <div className="site-section-inner">
      <p className="site-eyebrow text-center">A little less work. A lot more space.</p>
      <h2 className="site-section-heading">{title}</h2>
      <div className="site-feature-grid">
        {items.map((item, index) => <article key={item.title} className="site-feature-card">
          <span className="site-feature-number" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
          <h3>{item.title}</h3><p>{item.body}</p>
        </article>)}
      </div>
    </div>
  </section>
);
