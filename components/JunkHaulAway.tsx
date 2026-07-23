import React from 'react';
import { Dumbbell, Package, Recycle, Truck } from 'lucide-react';

const includes = [
  {
    title: 'Heavy Lifting',
    Icon: Dumbbell,
  },
  {
    title: 'Item Loading',
    Icon: Package,
  },
  {
    title: 'Transport Valet',
    Icon: Truck,
  },
  {
    title: 'Proper Disposal',
    Icon: Recycle,
  },
];

export const JunkHaulAway: React.FC = () => {
  return (
    <section className="relative py-14 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute -top-24 left-[-8%] h-[280px] w-[280px] rounded-full bg-brand/[0.07] blur-[110px] pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-8 rounded-full bg-brand/15 blur-[80px]" aria-hidden />
            <img
              src="/opek-junk-haul-away.png?v=1"
              alt="Opek providers loading a sofa and junk into a box truck"
              className="relative z-10 w-full h-auto max-h-[360px] sm:max-h-[440px] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
              loading="lazy"
            />
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">
              Junk haul away
            </p>
            <h2 className="font-sans font-extrabold text-[1.75rem] sm:text-[2.3rem] md:text-[2.55rem] text-[var(--text)] tracking-tight leading-[1.1] mb-4 sm:mb-5">
              Looking to get rid of your bulky junk?
            </h2>
            <p className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed mb-7 sm:mb-8 max-w-lg">
              Whether it&apos;s furniture, appliances, or general clutter, junk removal is simple with your team.
              Local providers handle heavy lifting, quick pickup, reliable hauling, and full-service disposal.
            </p>

            <p className="text-[14px] sm:text-[15px] font-bold text-[var(--text)] mb-4">
              Junk removal includes:
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-w-md">
              {includes.map(({ title, Icon }) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/40 text-brand bg-brand/10">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="text-[13px] sm:text-sm font-semibold text-[var(--text)]">
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
