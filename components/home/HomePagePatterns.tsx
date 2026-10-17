import React from 'react';
import { Link } from 'react-router-dom';

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
  return <section className="home-editorial bg-[#f2f2f2] py-14 sm:py-16 md:py-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="home-display text-center text-[2rem] leading-none sm:text-[2.6rem] md:text-[3rem] text-[#140a1f]">{title}</h2>
      {description && <div className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-relaxed text-[#2b2236]">{description}</div>}
      <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-10 max-w-[860px] mx-auto">
        {cards.map(card => <article key={card.title} className="flex flex-col items-center text-center">
          <div className="home-photo-frame w-full aspect-[17/10] overflow-hidden rounded-lg"><img src={card.image} alt={card.alt} className="h-full w-full object-contain object-bottom pt-4" loading="lazy" /></div>
          <h3 className="home-display mt-5 text-[1.4rem] sm:text-[1.6rem] leading-tight text-[#140a1f]">{card.title}</h3>
          <div className="mt-3 text-[15px] leading-relaxed text-[#2b2236] w-full">{card.body}</div>
          {card.action && (card.action.to
            ? <Link to={card.action.to} className="home-cta mt-5 min-w-[196px]">{card.action.label}</Link>
            : <button type="button" onClick={card.action.onClick} className="home-cta mt-5 min-w-[196px]">{card.action.label}</button>)}
          {card.details && <div className="w-full mt-6 text-left border-t border-[#d8d0e0]">
            {card.details.map(detail => <details key={detail.title} className="home-detail border-b border-[#d8d0e0] py-4">
              <summary className="cursor-pointer font-bold text-[14px] text-[#520f96]">{detail.title}</summary>
              <div className="pt-3 text-sm leading-relaxed text-[#2b2236]">{detail.body}</div>
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
          <div className="home-photo-frame aspect-square overflow-hidden rounded-lg"><img src={image} alt={imageAlt} className="w-full h-full object-contain object-bottom pt-5" loading="lazy" /></div>
          {aside && <div className="mt-6 text-[15px] leading-relaxed text-[#2b2236]">{aside}</div>}
        </aside>
        <div className="home-form-panel">{children}</div>
      </div>
    </div>
  </section>;
}
