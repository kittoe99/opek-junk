import React from 'react';
import { CalendarClock, PiggyBank, ShieldCheck, Star } from 'lucide-react';
import { HERO_PRIMARY_CTA } from '../lib/flowPageLayout';

interface HeroProps {
  onGetQuote: () => void;
  onBookOnline?: () => void;
}

const HERO_FEATURES = [
  {
    icon: CalendarClock,
    iconColor: 'text-brand',
    title: 'Easy',
    description: 'You set the time, and your provider will be there.',
  },
  {
    icon: PiggyBank,
    iconColor: 'text-brand',
    title: 'Affordable',
    description: 'Get a guaranteed, up-front price before you book.',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-brand',
    title: 'Safe',
    description: 'Rest easy with vetted providers & free damage protection.',
  },
] as const;

function RatingBadge({ centered }: { centered?: boolean }) {
  return (
    <p className={`text-sm font-medium text-secondary-500 mb-4 ${centered ? 'text-center' : ''}`}>
      4.8{' '}
      <Star size={14} className="inline -mt-0.5 text-brand fill-brand" strokeWidth={0} />{' '}
      average rating
    </p>
  );
}

function FeatureList({ layout }: { layout: 'mobile' | 'desktop' }) {
  if (layout === 'mobile') {
    return (
      <div className="border-t border-secondary-100/80 pt-8 mt-2 space-y-8">
        {HERO_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="text-center px-2">
              <Icon size={36} className={`mx-auto mb-3 ${feature.iconColor}`} strokeWidth={1.5} />
              <h3 className="text-base font-bold text-secondary mb-1.5">{feature.title}</h3>
              <p className="text-sm text-secondary-500 leading-relaxed max-w-[18rem] mx-auto">{feature.description}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-10 xl:gap-14 mt-12 xl:mt-14 pt-10 xl:pt-12 border-t border-secondary-100/80 pb-10 xl:pb-12">
      {HERO_FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.title} className="text-center">
            <Icon size={32} className={`mx-auto mb-3 ${feature.iconColor}`} strokeWidth={1.5} />
            <h3 className="text-[15px] font-bold text-secondary mb-1">{feature.title}</h3>
            <p className="text-sm text-secondary-500 leading-relaxed max-w-[15rem] mx-auto">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onBookOnline }) => {
  return (
    <section className="hero-section relative bg-white overflow-hidden border-b border-secondary-100/40">
      {/* Mobile — centered copy, CTA, image, then features */}
      <div className="lg:hidden">
        <div className="px-5 pt-2.5 pb-6 text-center max-w-lg mx-auto">
          <RatingBadge centered />

          <h1 className="font-serif text-[2rem] sm:text-[2.25rem] font-semibold text-secondary tracking-tight leading-[1.12] mb-4">
            Junk removal,
            <br />
            made easy.
          </h1>

          <p className="text-[15px] sm:text-base text-secondary-500 leading-relaxed mb-6 max-w-[20rem] mx-auto">
            From furniture haul-away to apartment cleanouts, let us handle the heavy lifting.
          </p>

          <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2 w-full mb-2">
            <button
              type="button"
              onClick={onGetQuote}
              className={`shrink-0 px-6 py-3 text-[15px] font-semibold !rounded-full whitespace-nowrap ${HERO_PRIMARY_CTA}`}
            >
              View Pricing
            </button>

            {onBookOnline && (
              <button
                type="button"
                onClick={onBookOnline}
                className="shrink-0 py-3 text-sm font-medium text-secondary hover:text-brand transition-colors whitespace-nowrap"
              >
                Or book online
              </button>
            )}
          </div>

          <div className="mt-7 rounded-2xl overflow-hidden bg-secondary-100 aspect-[4/3] sm:aspect-[16/11] border border-secondary-100 shadow-sm">
            <img
              src="/opek2.webp"
              alt="Professional junk removal crew hauling furniture"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <FeatureList layout="mobile" />
        </div>
      </div>

      {/* Desktop — TaskRabbit-style split hero */}
      <div className="hidden lg:block">
        <div className="max-w-[72rem] mx-auto px-8 xl:px-10 pt-8 xl:pt-10 pb-0">
          <div className="grid grid-cols-2 gap-12 xl:gap-14 items-center">
            <div className="max-w-[28rem] animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <RatingBadge />
              <h1 className="font-serif text-[2.625rem] xl:text-[3.125rem] font-semibold text-secondary tracking-tight mb-4 leading-[1.1]">
                Junk removal,
                <br />
                made easy.
              </h1>
              <p className="text-lg text-secondary-500 mb-7 leading-relaxed">
                From furniture haul-away to apartment cleanouts, let us handle the heavy lifting.
              </p>
              <button
                type="button"
                onClick={onGetQuote}
                className={`!rounded-full px-7 py-3 text-[15px] font-semibold ${HERO_PRIMARY_CTA}`}
              >
                Get a quote
              </button>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="aspect-[5/4] w-full overflow-hidden rounded-[1.5rem] bg-secondary-100 border border-secondary-100 shadow-[0_12px_35px_rgba(53,80,112,0.1)]">
                <img
                  src="/opek2.webp"
                  alt="Professional junk removal crew hauling furniture"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          <FeatureList layout="desktop" />
        </div>
      </div>
    </section>
  );
};
