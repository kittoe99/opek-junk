import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export interface EditorialCard {
  title: string;
  body: React.ReactNode;
  image: string;
  alt: string;
  action?: { label: string; onClick?: () => void; to?: string };
  details?: { title: string; body: React.ReactNode }[];
}

/** The homepage's large image cards, reused for each page's own content. */
export function HomeEditorialCards({ title, description, cards }: {
  title: React.ReactNode; description?: React.ReactNode; cards: EditorialCard[];
}) {
  return <section className="home-editorial home-soft-band py-14 sm:py-16 md:py-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="home-display text-center text-[2rem] leading-none sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]">{title}</h2>
      {description && <div className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-relaxed text-[#4a4256]">{description}</div>}
      <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-[880px] mx-auto items-start">
        {cards.map(card => <article key={card.title} className="soft-card home-service-card">
          <div className="ui-image-frame soft-card-media home-service-media"><img src={card.image} alt={card.alt} loading="lazy" /></div>
          <h3 className="home-display text-[1.4rem] sm:text-[1.6rem] leading-tight text-[#140a1f]">{card.title}</h3>
          <div className="mt-3 text-[15px] leading-relaxed text-[#4a4256] w-full">{card.body}</div>
          {card.action && (card.action.to
            ? <Link to={card.action.to} className="flow-btn flow-btn-primary mt-5 w-full">{card.action.label}<ArrowRight size={18} aria-hidden /></Link>
            : <button type="button" onClick={card.action.onClick} className="flow-btn flow-btn-primary mt-5 w-full">{card.action.label}<ArrowRight size={18} aria-hidden /></button>)}
          {card.details && card.details.length > 0 && <div className="home-card-details">
            {card.details.map(detail => <details key={detail.title} className="home-detail">
              <summary>{detail.title}<ChevronDown size={18} aria-hidden /></summary>
              <div className="pt-2 pb-1 text-sm leading-relaxed text-[#4a4256]">{detail.body}</div>
            </details>)}
          </div>}
        </article>)}
      </div>
    </div>
  </section>;
}

/** Full-width conversion section, with the homepage's type, spacing and purple treatment. */
export function HomeCallout({ title, body, label, onClick, to }: {
  title: React.ReactNode; body: string; label: string; onClick?: () => void; to?: string;
}) {
  return <section className="home-promo home-callout text-white py-14 sm:py-16">
    <div className="max-w-3xl mx-auto px-5 text-center">
      <h2 className="home-display text-[2rem] sm:text-[2.6rem] md:text-[3rem] leading-none">{title}</h2>
      <p className="mt-4 text-[15px] sm:text-base font-semibold">{body}</p>
      {to ? <Link to={to} className="home-cta mt-7 min-w-[240px]">{label}</Link>
        : <button type="button" onClick={onClick} className="home-cta mt-7 min-w-[240px]">{label}</button>}
    </div>
  </section>;
}

/** An image-led introduction next to a functional form, instead of an isolated utility card. */
export function HomeFormSection({ title, description, image, imageAlt, children, id, aside, sectionRef }: {
  title: string; description: string; image: string; imageAlt: string;
  children: React.ReactNode; id?: string; aside?: React.ReactNode; sectionRef?: React.Ref<HTMLElement>;
}) {
  return <section ref={sectionRef} id={id} className="home-form-section bg-white py-14 md:py-20 scroll-mt-[var(--site-header-height)]">
    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      <h2 className="home-display text-center text-[2rem] sm:text-[2.6rem] md:text-[3rem] leading-none text-[#140a1f]">{title}</h2>
      <p className="max-w-xl mx-auto mt-4 text-center text-[15px] text-[#2b2236] leading-relaxed">{description}</p>
      <div className="home-form-grid mt-10 grid md:grid-cols-[.8fr_1.2fr] gap-8 md:gap-12 items-start">
        <aside className="home-form-aside">
          <div className="ui-image-frame home-photo-frame aspect-square overflow-hidden rounded-lg"><img src={image} alt={imageAlt} className="w-full h-full object-contain object-bottom pt-5" loading="lazy" /></div>
          {aside && <div className="mt-6 text-[15px] leading-relaxed text-[#2b2236]">{aside}</div>}
        </aside>
        <div className="home-form-panel">{children}</div>
      </div>
    </div>
  </section>;
}
