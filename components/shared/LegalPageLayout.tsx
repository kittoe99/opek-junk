import { ServicePageHero } from './ServicePageHero';
import { HomeCallout } from '../home/HomePagePatterns';
import React, { useState, useEffect } from 'react';

export interface LegalSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  sections: LegalSection[];
  defaultSection: string;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  eyebrow,
  title,
  description,
  sections,
  defaultSection,
}) => {
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 80;
      const scrollPos = window.scrollY + headerHeight + 32;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 80;
      const offset = el.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="site-page home-light interior-home min-h-screen bg-[var(--bg)]">
      <ServicePageHero eyebrow={eyebrow} title={title} subtitle={description}
        image="/home-transparent/schedule-phone.png" imageAlt="Phone showing a pickup schedule"
        chip="Clear information" bannerTitle={<>Good service.<br />Clear terms.</>} bannerDetail="Know where you stand."
        primaryCta={{ label: 'Read the policy', href: '#policy-contents' }} secondaryCta={{ label: 'Contact us', href: '/contact' }} showRating={false} />

      <div id="policy-contents" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 scroll-mt-[var(--site-header-height)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <details className="lg:hidden rounded-lg border border-[var(--border)] bg-white p-5">
            <summary className="cursor-pointer text-sm font-bold text-brand">On this page</summary>
            <nav aria-label="Policy sections" className="mt-3 grid gap-1">
              {sections.map((section) => (
                <button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className="min-h-11 text-left text-sm text-[var(--text-muted)] hover:text-brand">
                  {section.title}
                </button>
              ))}
            </nav>
          </details>
          <aside className="site-legal-nav lg:col-span-4 sticky hidden lg:block">
            <div className="home-policy-menu bg-[#f2f2f2] p-6">
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                Sections
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-brand text-white shadow-[0_0_20px_-6px_rgba(82,15,150,0.55)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      {isActive
                        ? React.cloneElement(section.icon as React.ReactElement, {
                            className: 'text-white shrink-0',
                          })
                        : section.icon}
                      <span>{section.title.replace(/^\d+\.\s*/, '')}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-12 px-1 sm:px-4">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32 border-b border-[var(--border)] last:border-b-0 pb-10 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand/10 rounded-2xl flex items-center justify-center border border-brand/25 shrink-0 text-brand">
                    {section.icon}
                  </div>
                  <h2 className="font-sans font-bold text-xl sm:text-2xl text-[var(--text)] tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed space-y-4">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <HomeCallout title="Questions? Let’s clear them up." body="Our team can help you understand our policies or answer a question about your service." label="Contact us" to="/contact" />
    </div>
  );
};
