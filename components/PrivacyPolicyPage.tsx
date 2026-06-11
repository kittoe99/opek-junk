import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, FileText, ArrowRight, HeartHandshake, PhoneCall } from 'lucide-react';

interface PolicySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('introduction');

  const sections: PolicySection[] = [
    {
      id: 'introduction',
      title: '1. Introduction',
      icon: <Shield size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Welcome to <strong>Opek Junk Removal</strong> ("Opek," "we," "us," or "our"). We are committed to protecting your privacy and ensuring you have a positive experience when using our technology platform, website, mobile applications, or calling/texting our services.
          </p>
          <p className="mb-4">
            Opek operates a technology platform that connects customers (users looking for junk removal, dumpster rentals, property cleanouts, or moving labor) with independent, vetted, third-party local service providers (each, a "Provider").
          </p>
          <p>
            By accessing or using our services, website, or voice booking system, you consent to the collection, transfer, storage, disclosure, and use of your personal information as described in this Privacy Policy.
          </p>
        </>
      ),
    },
    {
      id: 'info-collection',
      title: '2. Information We Collect',
      icon: <Eye size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            To connect you with local providers and fulfill your requests, we collect several types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Identity & Contact Information:</strong> Your name, phone number, email address, physical address (for junk pick-up or delivery), and ZIP code.
            </li>
            <li>
              <strong>Booking Details:</strong> Specific items you need hauled, description of junk, photographs uploaded of items, and chosen schedule window.
            </li>
            <li>
              <strong>Voice & Interaction Data:</strong> If you interact with our AI-powered voice assistant (powered by platforms like ElevenLabs), your voice interactions, calls, and chat transcripts may be recorded and stored for order execution, quality control, and training.
            </li>
            <li>
              <strong>Location Data:</strong> Precise or approximate location information obtained from your IP address or mobile device's GPS to find nearby service providers.
            </li>
            <li>
              <strong>Payment Information:</strong> Credit card or billing information. All payments are processed through secure, PCI-compliant third-party processors. We do not store full card details on our servers.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'use-of-info',
      title: '3. How We Use Your Information',
      icon: <Lock size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            We use the personal information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Service Dispatch:</strong> Sharing your address, phone number, and booking photos with the independent local provider matched to your request.
            </li>
            <li>
              <strong>Communication:</strong> Sending text messages, emails, and phone calls for booking confirmations, arrival updates, receipts, and customer satisfaction surveys.
            </li>
            <li>
              <strong>Platform Maintenance:</strong> Running, troubleshooting, analyzing, and improving the Opek technology platform and customer experience.
            </li>
            <li>
              <strong>Safety & Security:</strong> Verifying user profiles, preventing fraudulent activity, and protecting the security of our platform and providers.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'sharing-info',
      title: '4. Information Sharing & Disclosure',
      icon: <HeartHandshake size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            We do not sell your personal data. We disclose information to facilitate matches, fulfill bookings, and comply with law:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>With Independent Providers:</strong> We share booking specs, address, name, and contact details with the local providers assigned to haul your junk or rent dumpsters.
            </li>
            <li>
              <strong>With Tech Vendors:</strong> We share data with third-party infrastructure companies (like Supabase for database hosting and auth, or ElevenLabs for voice bot support) only to process transactions and run platform features.
            </li>
            <li>
              <strong>Legal Compliance:</strong> If required by law, subpoena, or to protect the safety of users, providers, or the public.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-security',
      title: '5. Data Retention & Security',
      icon: <FileText size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            We employ administrative, physical, and electronic security measures designed to protect your information from unauthorized access. We retain personal data for as long as necessary to process bookings, handle dispute claims, resolve customer issues, and satisfy legal audits.
          </p>
          <p>
            Please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      id: 'contact-us',
      title: '6. Contact & Support',
      icon: <PhoneCall size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            If you have questions about this Privacy Policy, wish to access your data, request deletion, or update your information, please contact us:
          </p>
          <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-6 space-y-2">
            <p className="text-sm text-secondary"><strong>Email:</strong> <a href="mailto:Support@opekjunkremoval.com" className="text-brand hover:underline font-semibold">Support@opekjunkremoval.com</a></p>
            <p className="text-sm text-secondary"><strong>Phone:</strong> <a href="tel:8313187139" className="text-brand hover:underline font-semibold">(831) 318-7139</a></p>
            <p className="text-sm text-secondary"><strong>Address:</strong> Nationwide Service, United States</p>
          </div>
        </>
      ),
    },
  ];

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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.offsetTop - 120;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 right-0 h-[380px] bg-gradient-to-b from-brand-50 to-slate-50 -z-10 pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="block w-8 h-px bg-brand" />
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Legal & Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-secondary tracking-tight leading-[1.05] mb-4">
            Privacy <span className="text-brand">Policy.</span>
          </h1>
          <p className="text-base sm:text-lg text-secondary-600 leading-relaxed">
            Last Updated: June 11, 2026. Please read this Privacy Policy carefully to understand how we collect, use, protect, and share your personal information.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 sticky top-28 hidden lg:block bg-white border border-secondary-100 rounded-2xl p-6 shadow-md shadow-secondary-50/50 animate-fade-in">
            <h2 className="text-xs font-black text-secondary-400 uppercase tracking-widest mb-6">Sections</h2>
            <nav className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-brand text-white shadow-md shadow-brand/10 translate-x-1'
                        : 'text-secondary-400 hover:text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {isActive ? React.cloneElement(section.icon as React.ReactElement, { className: 'text-white shrink-0' }) : section.icon}
                    <span>{section.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Policy Text Column */}
          <div className="lg:col-span-8 bg-white border border-secondary-100 rounded-2xl p-6 sm:p-10 shadow-md shadow-secondary-50/50 space-y-12 animate-fade-in-up">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32 border-b border-slate-100 last:border-b-0 pb-10 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-secondary">
                    {section.title}
                  </h2>
                </div>
                <div className="text-secondary-600 text-sm sm:text-base leading-relaxed space-y-4 pl-0 sm:pl-13">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
