import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MapPin, ArrowRight, ExternalLink, Phone } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  faqs: FaqItem[];
  schemaMarkup?: object;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  eyebrow = 'FAQ',
  title,
  subtitle,
  faqs,
  schemaMarkup,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-secondary-500 text-sm md:text-base leading-relaxed font-medium">{subtitle}</p>
            )}
          </div>

          <div className="lg:col-span-8">
            {schemaMarkup && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
              />
            )}
            <div className="grid grid-cols-1 gap-px bg-secondary-100/60 border border-secondary-100/60 rounded-3xl overflow-hidden shadow-sm">
              {faqs.map((faq, i) => (
                <div
                  key={faq.question}
                  className={`bg-white transition-all duration-300 ${openFaq === i ? 'bg-secondary-50/30' : ''}`}
                >
                  <button
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-black text-sm md:text-base text-secondary pr-4">{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-all duration-300 shrink-0 ${
                        openFaq === i ? 'text-brand rotate-180' : 'text-secondary-300'
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-secondary-500 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface CityLocalSectionProps {
  cityName: string;
  metroArea: string;
  serviceAreaSubtext: string;
  neighborhoods: string[];
  onGetQuote: () => void;
  onBookOnline: () => void;
}

export const CityLocalSection: React.FC<CityLocalSectionProps> = ({
  cityName,
  metroArea,
  serviceAreaSubtext,
  neighborhoods,
  onGetQuote,
  onBookOnline,
}) => (
  <section id="service-area" className="py-16 md:py-24 lg:py-32 bg-secondary-50/40 overflow-hidden border-b border-secondary-100/60">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="block w-8 h-px bg-brand" />
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Ready to start?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-secondary leading-[1.05] tracking-tight">
            Same-day service
            <br />
            <span className="text-brand">in {cityName}.</span>
          </h2>
          <div className="flex flex-row gap-0">
            <button
              onClick={onGetQuote}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-secondary text-white hover:bg-secondary-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl inline-flex items-center gap-2"
            >
              Get a Free Quote <ArrowRight size={14} />
            </button>
            <button
              onClick={onBookOnline}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl inline-flex items-center gap-2"
            >
              Book Online <ArrowRight size={14} />
            </button>
          </div>
          <a
            href="tel:8313187139"
            className="inline-flex items-center gap-2 text-secondary-500 hover:text-brand transition-colors text-sm font-medium"
          >
            <Phone size={14} />
            <span>(831) 318-7139</span>
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white border border-secondary-100/60 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 mb-3">
              <MapPin size={13} className="text-brand" />
              <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Neighborhoods</span>
            </div>
            <p className="text-2xl md:text-3xl font-black text-secondary tracking-tight leading-[1.1] mb-3">
              Serving all of {metroArea}.
            </p>
            <p className="text-secondary-500 text-sm leading-relaxed mb-6">{serviceAreaSubtext}</p>
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1.5 bg-secondary-50 text-secondary text-xs font-medium border border-secondary-100 hover:border-brand hover:text-brand transition-colors rounded-full"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

interface CityLinksSectionProps {
  otherCities: { slug: string; name: string; stateAbbr: string }[];
  externalCitations: { label: string; href: string; rel: string }[];
}

export const CityLinksSection: React.FC<CityLinksSectionProps> = ({ otherCities, externalCitations }) => (
  <section className="py-16 md:py-24 bg-white overflow-hidden border-b border-secondary-100/60">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Also Serving</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                to={`/locations/${c.slug}`}
                className="text-secondary text-sm font-medium hover:text-brand transition-colors"
              >
                {c.name}, {c.stateAbbr}
              </Link>
            ))}
          </div>
          <Link
            to="/#service-area"
            className="inline-flex items-center gap-1.5 mt-5 text-secondary-400 hover:text-brand transition-colors text-xs font-bold"
          >
            <MapPin size={12} />
            View all service areas
          </Link>
        </div>

        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Resources</span>
          </div>
          <div className="flex flex-col gap-2">
            {externalCitations.map((cite) => (
              <a
                key={cite.href}
                href={cite.href}
                target="_blank"
                rel={cite.rel}
                className="inline-flex items-center gap-2 text-secondary text-sm font-medium hover:text-brand transition-colors"
              >
                <ExternalLink size={12} className="text-secondary-300 shrink-0" />
                {cite.label}
              </a>
            ))}
            <div className="border-t border-secondary-100 my-2" />
            {[
              { label: 'Junk removal', path: '/services/junk-removal' },
              { label: 'Dumpster rental', path: '/services/dumpster-rental' },
              { label: 'Moving labor', path: '/services/moving-labor' },
            ].map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="inline-flex items-center gap-2 text-secondary text-sm font-medium hover:text-brand transition-colors"
              >
                <ArrowRight size={12} className="text-secondary-300 shrink-0" />
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
