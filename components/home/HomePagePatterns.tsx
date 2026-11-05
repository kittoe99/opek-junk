import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface EditorialChapter {
  title: string;
  body: React.ReactNode;
  /** With a photo the chapter sits beside it; without one, its points fill the width. */
  image?: string;
  alt?: string;
  action?: { label: string; onClick?: () => void; to?: string };
  points?: { title: string; body: React.ReactNode }[];
}

/** Article-style section: the title and intro open the first chapter, with open text instead of cards. */
export function HomeEditorialContent({ title, description, chapters }: {
  title: React.ReactNode; description?: React.ReactNode; chapters: EditorialChapter[];
}) {
  return <section className="home-editorial home-soft-band py-14 sm:py-16 md:py-20">
    <div className="editorial-inner">
      {chapters.map((chapter, i) => <div key={chapter.title} className={`editorial-chapter ${chapter.image ? 'has-photo' : 'has-points'}`}>
        {chapter.image && <div className="ui-image-frame home-photo-frame editorial-photo"><img src={chapter.image} alt={chapter.alt ?? ''} loading="lazy" /></div>}
        <div className="editorial-copy">
          {i === 0 && <>
            <h2 className="home-display text-[#140a1f]">{title}</h2>
            {description && <div className="editorial-intro">{description}</div>}
          </>}
          <h3 className="home-display text-[#520f96]">{chapter.title}</h3>
          <div className="editorial-body">{chapter.body}</div>
          {chapter.action && (chapter.action.to
            ? <Link to={chapter.action.to} className="flow-btn flow-btn-primary editorial-action">{chapter.action.label}<ArrowRight size={18} aria-hidden /></Link>
            : <button type="button" onClick={chapter.action.onClick} className="flow-btn flow-btn-primary editorial-action">{chapter.action.label}<ArrowRight size={18} aria-hidden /></button>)}
        </div>
        {chapter.points && chapter.points.length > 0 && <dl className="editorial-points">
          {chapter.points.map(point => <div key={point.title} className="editorial-point">
            <dt>{point.title}</dt>
            <dd>{point.body}</dd>
          </div>)}
        </dl>}
      </div>)}
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

/** A form with its introduction, beside a photo when one is given and centered on its own otherwise. */
export function HomeFormSection({ title, titleAs: Title = 'h2', description, image, imageAlt, children, id, aside }: {
  title: string; titleAs?: 'h1' | 'h2'; description: string; image?: string; imageAlt?: string;
  children: React.ReactNode; id?: string; aside?: React.ReactNode;
}) {
  return <section id={id} className="home-form-section bg-white py-14 md:py-20 scroll-mt-[var(--site-header-height)]">
    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      <Title className="home-display text-center text-[2rem] sm:text-[2.6rem] md:text-[3rem] leading-none text-[#140a1f]">{title}</Title>
      <p className="max-w-xl mx-auto mt-4 text-center text-[15px] text-[#2b2236] leading-relaxed">{description}</p>
      {image ? <div className="home-form-grid mt-10 grid md:grid-cols-[.8fr_1.2fr] gap-8 md:gap-12 items-start">
        <aside className="home-form-aside">
          <div className="ui-image-frame home-photo-frame aspect-square overflow-hidden rounded-lg"><img src={image} alt={imageAlt ?? ''} className="w-full h-full object-contain object-bottom pt-5" loading="lazy" /></div>
          {aside && <div className="mt-6 text-[15px] leading-relaxed text-[#2b2236]">{aside}</div>}
        </aside>
        <div className="home-form-panel">{children}</div>
      </div> : <div className="home-form-grid mt-8 mx-auto max-w-2xl">
        <div className="home-form-panel">{children}</div>
        {aside && <div className="mt-6 text-center text-[15px] leading-relaxed text-[#2b2236]">{aside}</div>}
      </div>}
    </div>
  </section>;
}
