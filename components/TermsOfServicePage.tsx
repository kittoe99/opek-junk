import React, { useState, useEffect } from 'react';
import { Scale, Info, CreditCard, Ban, ShieldAlert, AlertTriangle, Hammer, PhoneCall } from 'lucide-react';

interface TermsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const TermsOfServicePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('agreement');

  const sections: TermsSection[] = [
    {
      id: 'agreement',
      title: '1. Agreement to Terms',
      icon: <Scale size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            These Terms of Service ("Terms") constitute a legally binding agreement between you ("Customer," "User," or "you") and <strong>Opek Junk Removal</strong> ("Opek," "we," "us," or "our").
          </p>
          <p className="mb-4">
            By accessing, browsing, or using our website, platform, mobile applications, booking systems, or ordering services by phone, you acknowledge that you have read, understood, and agree to be bound by these Terms.
          </p>
          <p className="font-bold text-secondary">
            If you do not agree to these terms, please immediately cease using our platform and services.
          </p>
        </>
      ),
    },
    {
      id: 'platform-description',
      title: '2. The Opek Platform',
      icon: <Info size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 text-sm text-amber-900 rounded-r-xl">
            <span className="font-bold">CRITICAL DISCLAIMER:</span> Opek Junk Removal is a technology matching platform. We do not provide physical hauling, junk removal, dumpster rental, or moving labor services ourselves.
          </div>
          <p className="mb-4">
            All services listed on our platform are performed by independent, third-party local service providers (each, a "Provider"). 
          </p>
          <p className="mb-4">
            By booking a service through Opek, you understand that you are contracting directly with the independent Provider who executes the service. 
          </p>
          <p>
            Opek facilitates this arrangement by providing pricing estimations, offering software platforms, scheduling windows, handling secure credit card billing, and providing general support. We are not responsible for the actions, omissions, quality, safety, or legality of services rendered by independent Providers.
          </p>
        </>
      ),
    },
    {
      id: 'booking-cancellations',
      title: '3. Bookings & Cancellations',
      icon: <Ban size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            When booking through Opek, you agree to provide accurate, complete, and current information, including the volume and description of items to be hauled.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Cancellation Policy:</strong> Bookings may be canceled or rescheduled without fee up to 24 hours before your scheduled arrival window.
            </li>
            <li>
              <strong>Late Cancellations:</strong> Cancellations made less than 24 hours prior to the appointment window, or cases where the provider arrives and cannot complete the service due to access issues or customer absence, are subject to a cancellation/truck fee of $99.
            </li>
            <li>
              <strong>Dumpster Rental Cancellations:</strong> Dumpster rental cancellations within 48 hours of scheduled drop-off are subject to a $150 dry run/holding fee.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'payment-pricing',
      title: '4. Payments & Estimates',
      icon: <CreditCard size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Opek provides upfront, flat-rate pricing based on information you submit (e.g., item volume, truck loads, or dumpster size).
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Quote Adjustments:</strong> The price provided at booking is an estimate. If the actual volume, weight, accessibility, or type of junk (e.g., hazardous materials, excessive concrete) differs from the booking request, the Provider may adjust the price on-site. You will have the option to approve the adjusted rate before loading begins.
            </li>
            <li>
              <strong>Payment Method:</strong> You must supply a valid credit or debit card at the time of booking. A temporary pre-authorization hold may be placed on your card before the scheduled job. Full payment is captured upon completion of the service.
            </li>
            <li>
              <strong>Extra Fees:</strong> Standard fees cover standard transit. Additional fees apply for municipal dump surcharges, mattresses, tires, hazardous materials, or excessive stairs/carry distance, which will be disclosed prior to booking or on-site.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'conduct-damages',
      title: '5. Work Environment & Damage Claims',
      icon: <Hammer size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Customers must provide a safe environment for the independent Providers. This includes securing pets, pointing out structural hazards, and clearing access paths.
          </p>
          <p className="mb-4">
            <strong>Damage Policy:</strong> Providers are independent contractors and are solely liable for any physical property damage or personal injury that occurs during the performance of services.
          </p>
          <p>
            In the event of property damage caused by a Provider, you must file a claim directly with that Provider and their insurance carrier. Opek will assist by providing the Provider’s contact details, business registry, and insurance coverage information, but Opek assumes no liability for property damage or physical disputes.
          </p>
        </>
      ),
    },
    {
      id: 'disclaimers',
      title: '6. Disclaimers & Limits of Liability',
      icon: <ShieldAlert size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4 font-bold text-secondary uppercase text-xs tracking-wider">
            THE OPEK PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
          </p>
          <p className="mb-4 text-sm">
            TO THE FULLEST EXTENT PERMITTED BY LAW, OPEK JUNK REMOVAL, ITS AFFILIATES, AND ITS OFFICERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE PLATFORM USE OR THE SERVICES PERFORMED BY INDEPENDENT LOCAL SERVICE PROVIDERS.
          </p>
          <p className="text-sm">
            OPEK'S MAXIMUM LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THE PLATFORM OR COMPLETED SERVICES SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU TO OPEK FOR THE SPECIFIC BOOKING GIVING RISE TO LIABILITY.
          </p>
        </>
      ),
    },
    {
      id: 'disputes-law',
      title: '7. Governing Law & Dispute Resolution',
      icon: <AlertTriangle size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            These Terms and any dispute arising out of them will be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
          </p>
          <p className="mb-4">
            <strong>Mandatory Arbitration:</strong> Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, enforcement, or validity thereof, will be settled by binding arbitration administered by the American Arbitration Association (AAA) rather than in court.
          </p>
          <p className="font-bold">
            You agree to waive any right to participate as a class representative or class member in any class action lawsuit or class-wide arbitration.
          </p>
        </>
      ),
    },
    {
      id: 'contact',
      title: '8. Contact Info',
      icon: <PhoneCall size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            For questions, legal notices, or feedback regarding these Terms, please reach out to our team:
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
            <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Legal Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-secondary tracking-tight leading-[1.05] mb-4">
            Terms of <span className="text-brand">Service.</span>
          </h1>
          <p className="text-base sm:text-lg text-secondary-600 leading-relaxed">
            Last Updated: June 11, 2026. Please read these Terms of Service carefully before booking dumpsters, junk removal, cleanouts, or moving services.
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
