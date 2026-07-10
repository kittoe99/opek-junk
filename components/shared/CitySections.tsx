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
    <section className="py-16 md:py-24 lg:py-32 overflow-hidden border-b border-secondary-100/60"
      style={{
        background: 'linear-gradient(160deg, #dff3ea 0%, #eef3f9 42%, #e8e4f2 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">{eyebrow}</span>
          </div>
          <h2 className="text-[1.625rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-secondary tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-secondary-500 text-sm md:text-base leading-relaxed font-medium mt-3">{subtitle}</p>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          {schemaMarkup && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />
          )}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.question}
                className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(53,80,112,0.05)] overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-bold text-sm md:text-base text-secondary pr-4">{faq.question}</span>
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
  <section id="service-area" className="py-16 md:py-24 lg:py-32 overflow-hidden border-b border-secondary-100/60"
    style={{
      background: 'linear-gradient(160deg, #dff3ea 0%, #eef3f9 42%, #e8e4f2 100%)',
    }}
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Ready to start?</span>
        </div>
        <h2 className="text-[1.625rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-secondary tracking-tight leading-tight">
          Same-day service in <span className="text-brand">{cityName}.</span>
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(53,80,112,0.05)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-secondary-100/60">
            <div>
              <p className="text-sm font-medium text-secondary-500 mb-1">Call or book online</p>
              <a href="tel:8313187139" className="inline-flex items-center gap-2 text-secondary hover:text-brand transition-colors font-bold text-lg">
                <Phone size={16} />
                <span>(831) 318-7139</span>
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onGetQuote}
                className="px-5 py-2.5 text-sm font-semibold bg-secondary text-white hover:bg-secondary-600 rounded-full transition-colors inline-flex items-center gap-1.5"
              >
                Get a Quote <ArrowRight size={14} />
              </button>
              <button
                onClick={onBookOnline}
                className="px-5 py-2.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors inline-flex items-center gap-1.5"
              >
                Book Online <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-brand" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Neighborhoods</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-secondary tracking-tight leading-[1.2] mb-3">
              Serving all of {metroArea}.
            </p>
            <p className="text-secondary-500 text-sm leading-relaxed mb-6">{serviceAreaSubtext}</p>
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1.5 bg-secondary-50 text-secondary text-xs font-medium rounded-full"
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
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Also Serving</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                to={`/locations/${c.slug}`}
                className="px-4 py-2 bg-secondary-50 text-secondary text-sm font-medium rounded-full hover:bg-brand hover:text-white transition-colors"
              >
                {c.name}, {c.stateAbbr}
              </Link>
            ))}
          </div>
          <Link
            to="/#service-area"
            className="inline-flex items-center gap-1.5 mt-5 text-secondary-400 hover:text-brand transition-colors text-sm font-medium"
          >
            <MapPin size={14} />
            View all service areas
          </Link>
        </div>

        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Our Services</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Junk removal', path: '/services/junk-removal' },
              { label: 'Dumpster rental', path: '/services/dumpster-rental' },
              { label: 'Property cleanouts', path: '/services/property-cleanout' },
              { label: 'Local moving', path: '/services/moving-labor' },
              { label: 'Small local moves', path: '/services/small-local-moves' },
            ].map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="px-4 py-2 bg-secondary-50 text-secondary text-sm font-medium rounded-full hover:bg-brand hover:text-white transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-secondary-100/60">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Resources</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {externalCitations.map((cite) => (
                <a
                  key={cite.href}
                  href={cite.href}
                  target="_blank"
                  rel={cite.rel}
                  className="px-4 py-2 bg-secondary-50 text-secondary text-sm font-medium rounded-full hover:bg-brand hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink size={12} />
                  {cite.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
