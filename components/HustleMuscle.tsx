import React from 'react';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HustleMuscle: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="site-purple-band relative bg-[var(--bg-alt)] border-t border-[var(--border)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[480px]">
        {/* Cutout visual — below copy on mobile; left on desktop */}
        <div className="ui-image-frame relative order-2 lg:order-1 lg:col-span-5 flex items-end justify-center px-6 pt-4 sm:pt-6 lg:pt-8 pb-0 overflow-hidden min-h-[280px] sm:min-h-[340px] lg:min-h-[360px]">
          <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 h-[55%] w-[55%] rounded-full bg-brand/20 blur-[90px]" aria-hidden />
          <img
            src="/optimized/hero-backgrounds/opek-crew-high-five.webp"
            alt="Opek junk removal pros carrying boxes, furniture, and a rug"
            className="relative z-10 h-full max-h-[340px] sm:max-h-[420px] lg:max-h-[520px] w-auto object-contain object-bottom drop-shadow-[0_28px_48px_rgba(0,0,0,0.55)]"
            loading="lazy"
          />
          {/* Diagonal edge */}
          <div
            className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-[var(--bg-alt)] z-20 pointer-events-none"
            style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
            aria-hidden
          />
        </div>

        {/* Copy — first on mobile */}
        <div className="relative order-1 lg:order-2 lg:col-span-7 flex items-center px-5 sm:px-8 lg:px-12 xl:px-16 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 lg:py-16">
          <div className="max-w-xl w-full">
            <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">
              Hustle + Muscle
            </p>
            <h2 className="font-sans font-extrabold text-[1.75rem] sm:text-[2.25rem] md:text-[2.5rem] text-[var(--text)] tracking-tight leading-[1.1] mb-4 sm:mb-5">
              Pros lift, load, and leave no junk behind
            </h2>
            <p className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed mb-6">
              Book professional, fully insured and background-checked haulers nationwide.
              Your matched crew shows up ready to clear every item you point to — from any room or floor.
            </p>

            <blockquote className="border-l-2 border-brand pl-4 sm:pl-5 mb-8">
              <p className="text-[14px] sm:text-[15px] text-[var(--text)] leading-relaxed">
                Other junk removal companies say, &ldquo;All you have to do is point.&rdquo; With{' '}
                <span className="font-bold text-brand">Opek</span>, you won&apos;t lift a finger.
              </p>
            </blockquote>

            <button
              type="button"
              onClick={() => navigate('/booking')}
              className="ui-button ui-button--secondary"
            >
              <Calendar size={16} className="text-brand" />
              Book A Pickup
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>


        </div>
      </div>
    </section>
  );
};
