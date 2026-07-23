import React from 'react';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HustleMuscle: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[var(--bg-alt)] border-t border-[var(--border)] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[480px]">
        {/* Cutout visual */}
        <div className="relative lg:col-span-5 flex items-end justify-center px-6 pt-10 sm:pt-12 lg:pt-8 lg:pb-0 overflow-hidden min-h-[300px] sm:min-h-[360px]">
          <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 h-[55%] w-[55%] rounded-full bg-brand/20 blur-[90px]" aria-hidden />
          <img
            src="/opek-hustle-muscle.png?v=1"
            alt="Opek junk removal estimator with clipboard ready for a pickup"
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

        {/* Copy */}
        <div className="relative lg:col-span-7 flex items-center px-5 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-14 md:py-16">
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
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-transparent px-6 sm:px-7 py-3 sm:py-3.5 text-[13px] sm:text-sm font-semibold text-[var(--text)] hover:border-brand/50 hover:bg-white/[0.04] transition-all"
            >
              <Calendar size={16} className="text-brand" />
              Book A Pickup
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Floating rating badge */}
          <div className="absolute bottom-6 right-5 sm:bottom-8 sm:right-8 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#121218]/95 backdrop-blur px-3.5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-white leading-none">4.8</span>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} className="text-brand fill-brand" />
                ))}
              </div>
            </div>
            <div className="pl-2 border-l border-white/10">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 leading-tight">
                Google
              </p>
              <p className="text-[11px] font-semibold text-neutral-300 leading-tight mt-0.5">
                Top-rated
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
