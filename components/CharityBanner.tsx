import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export const CharityBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 md:py-14 bg-white border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f3f3f3] rounded-3xl overflow-hidden border border-secondary-100/60">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-0">
            <div className="relative h-40 sm:h-48 md:h-full md:min-h-[220px] overflow-hidden">
              <img
                src="/charity-childrens-heart-clean.png"
                alt="Children holding a glowing heart"
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f3f3f3]/90 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f3f3f3] via-transparent to-transparent md:hidden" />
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8 lg:px-10">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <Heart size={14} className="text-brand fill-brand" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                  Community impact
                </span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-secondary tracking-tight leading-tight mb-3">
                We donate 5% of all sales to children&apos;s hospitals
              </h2>

              <p className="text-sm md:text-base text-secondary-500 leading-relaxed mb-6 max-w-lg">
                Every booking helps support families in need. Book with purpose and make a difference in your
                community.
              </p>

              <button
                type="button"
                onClick={() => navigate('/quote')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors"
              >
                Book with purpose
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
