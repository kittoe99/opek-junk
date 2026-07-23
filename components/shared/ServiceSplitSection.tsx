import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ServiceIncludeItem {
  title: string;
  Icon: LucideIcon;
}

interface ServiceSplitSectionProps {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  includesLabel?: string;
  includes: ServiceIncludeItem[];
  image: string;
  imageAlt: string;
  imageFirst?: boolean;
}

export const ServiceSplitSection: React.FC<ServiceSplitSectionProps> = ({
  eyebrow,
  title,
  body,
  includesLabel = 'This service includes:',
  includes,
  image,
  imageAlt,
  imageFirst = true,
}) => {
  return (
    <section className="relative py-14 sm:py-16 md:py-20 lg:py-24 bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
      <div className="absolute -top-24 left-[-8%] h-[280px] w-[280px] rounded-full bg-brand/[0.07] blur-[110px] pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          <div className={`relative ${imageFirst ? 'order-2 lg:order-1' : 'order-2'}`}>
            <div className="absolute inset-8 rounded-full bg-brand/15 blur-[80px]" aria-hidden />
            <img
              src={image}
              alt={imageAlt}
              className="relative z-10 w-full h-auto max-h-[360px] sm:max-h-[440px] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
              loading="lazy"
            />
          </div>

          <div className={imageFirst ? 'order-1 lg:order-2' : 'order-1'}>
            <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">{eyebrow}</p>
            <h2 className="font-sans font-extrabold text-[1.75rem] sm:text-[2.3rem] md:text-[2.55rem] text-[var(--text)] tracking-tight leading-[1.1] mb-4 sm:mb-5">
              {title}
            </h2>
            <div className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed mb-7 sm:mb-8 max-w-lg space-y-4">
              {typeof body === 'string' ? <p>{body}</p> : body}
            </div>

            {includes.length > 0 && (
              <>
                <p className="text-[14px] sm:text-[15px] font-bold text-[var(--text)] mb-4">
                  {includesLabel}
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-5 max-w-md">
                  {includes.map(({ title: itemTitle, Icon }) => (
                    <div key={itemTitle} className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/40 text-brand bg-brand/10">
                        <Icon size={18} strokeWidth={1.75} />
                      </span>
                      <span className="text-[13px] sm:text-sm font-semibold text-[var(--text)]">
                        {itemTitle}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
