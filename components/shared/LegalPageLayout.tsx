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
      const scrollPos = window.scrollY + 160;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
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
      const offset = el.offsetTop - 120;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-secondary-100/60 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">{eyebrow}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-secondary tracking-tight leading-tight mb-4">
              {title}
            </h1>
            <p className="text-secondary-500 text-sm md:text-base leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div className="bg-[#f3f3f3] rounded-3xl border border-secondary-100/60 p-6">
              <h2 className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-4">Sections</h2>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-secondary text-white'
                          : 'text-secondary-500 hover:text-secondary hover:bg-white/80'
                      }`}
                    >
                      {isActive
                        ? React.cloneElement(section.icon as React.ReactElement, { className: 'text-white shrink-0' })
                        : section.icon}
                      <span>{section.title.replace(/^\d+\.\s*/, '')}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-8 bg-[#f3f3f3] rounded-3xl border border-secondary-100/60 p-6 sm:p-10 space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32 border-b border-secondary-100/80 last:border-b-0 pb-10 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-secondary-100/60 shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-secondary">{section.title}</h2>
                </div>
                <div className="text-secondary-600 text-sm sm:text-base leading-relaxed space-y-4">{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
