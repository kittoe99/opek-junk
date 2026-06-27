import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, FileText, HeartHandshake, PhoneCall, Mail, MessageSquare, Globe, UserCheck, Bell, Users } from 'lucide-react';

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
            Welcome to <strong>Opek Junk Removal</strong> ("Opek," "we," "us," or "our"). We are committed to protecting your privacy and ensuring you have a positive experience when using our technology platform, website, mobile applications, or calling or texting our services.
          </p>
          <p className="mb-4">
            Opek operates a technology platform that connects customers (users looking for junk removal, dumpster rentals, property cleanouts, or moving labor) with independent, vetted, third-party local service providers (each, a "Provider"). We are based in the United States and serve customers nationwide.
          </p>
          <p className="mb-4">
            This Privacy Policy explains what personal information we collect, how we use and share it, how we communicate with you (including by SMS text message, email, and phone), and what choices you have. It applies to information collected through our website at opekjunkremoval.com, our booking and quote flows, contact forms, provider signup, phone and AI voice assistant interactions, and any related services.
          </p>
          <p>
            By accessing or using our services, submitting a form, placing a booking, or providing your contact information, you consent to the collection, transfer, storage, disclosure, and use of your personal information as described in this Privacy Policy and our{' '}
            <a href="/terms" className="text-brand font-semibold hover:underline">Terms of Service</a>.
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
            We collect information you provide directly, information generated when you use our platform, and information from third-party tools that help us operate our services:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Identity & Contact Information:</strong> Your name, phone number, email address, physical service address (for junk pick-up or delivery), city, state, and ZIP code.
            </li>
            <li>
              <strong>Booking & Quote Details:</strong> Service type, items to be hauled, junk descriptions, photographs you upload, dumpster size, schedule preferences, pricing estimates, order numbers, and payment/deposit status.
            </li>
            <li>
              <strong>Provider Application Information:</strong> If you apply to join our provider network, we collect business name, service area, vehicle type, availability, and any additional details you submit.
            </li>
            <li>
              <strong>Communications Content:</strong> Messages you send through our contact form, in-home estimate requests, email replies, SMS/text exchanges, and phone call notes or transcripts.
            </li>
            <li>
              <strong>Voice & Interaction Data:</strong> If you interact with our AI-powered phone assistant (powered by third-party platforms such as ElevenLabs), your voice interactions, call recordings, and conversation transcripts may be captured and stored for order execution, customer support, quality control, and service improvement.
            </li>
            <li>
              <strong>Payment Information:</strong> Billing name, email, phone, and payment method details processed through our payment partner Stripe. We do not store full credit or debit card numbers on our servers.
            </li>
            <li>
              <strong>Location Data:</strong> Approximate location derived from your IP address, ZIP code, or device settings to match you with nearby providers and personalize service availability.
            </li>
            <li>
              <strong>Device & Usage Data:</strong> Browser type, device type, operating system, pages visited, referring URLs, session activity, and preferences stored locally (such as your selected city) to improve site functionality.
            </li>
          </ul>
          <p>
            You may choose not to provide certain information, but doing so may prevent us from fulfilling a booking, sending confirmations, or responding to your request.
          </p>
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
              <strong>Service Fulfillment:</strong> Processing quotes, bookings, payments, order tracking, provider matching, and dispatching independent local providers to your location.
            </li>
            <li>
              <strong>Transactional Communications:</strong> Sending text messages (SMS/MMS), emails, and phone calls related to your request — including booking confirmations, quote follow-ups, arrival updates, payment receipts, rescheduling notices, and customer support responses.
            </li>
            <li>
              <strong>Marketing & Promotional Communications:</strong> With your consent where required by law, we may send you promotional emails, text messages, and occasional phone calls about Opek services, special offers, seasonal promotions, service reminders, and related products or services we believe may interest you. You can opt out at any time (see Section 4).
            </li>
            <li>
              <strong>Customer Support & Follow-Up:</strong> Responding to inquiries, resolving disputes, collecting feedback, and following up on incomplete bookings or estimate requests.
            </li>
            <li>
              <strong>Platform Improvement:</strong> Analyzing usage patterns, testing features, training and improving our AI voice assistant, and enhancing the overall customer and provider experience.
            </li>
            <li>
              <strong>Safety, Security & Legal Compliance:</strong> Detecting fraud, enforcing our Terms of Service, protecting users and providers, and complying with applicable laws and regulations.
            </li>
          </ul>
          <p>
            We may combine information collected across our website, phone system, and booking flows to provide a consistent experience and relevant communications.
          </p>
        </>
      ),
    },
    {
      id: 'communications',
      title: '4. SMS, Email & Phone Communications',
      icon: <MessageSquare size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            When you provide your phone number or email address — including through our quote forms, booking flows, contact page, phone calls, or AI voice assistant — you agree that Opek and our service providers may contact you using automated or manual technology, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>SMS/MMS text messages</strong> to the mobile number you provide</li>
            <li><strong>Email messages</strong> to the email address you provide</li>
            <li><strong>Phone calls</strong>, including prerecorded or artificial voice messages where permitted by law</li>
          </ul>
          <p className="mb-4">
            These communications may include both <strong>transactional messages</strong> (booking confirmations, provider updates, receipts, support) and <strong>marketing messages</strong> (promotions, discounts, service reminders, and news about Opek). Message frequency varies based on your activity and preferences.
          </p>
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-4 space-y-2 text-sm">
            <p className="font-bold text-secondary">Text Message (SMS) Terms:</p>
            <ul className="list-disc pl-5 space-y-1 text-secondary-700">
              <li>Message and data rates may apply depending on your mobile carrier plan.</li>
              <li>Consent to receive marketing texts is not a condition of purchase.</li>
              <li>Reply <strong>STOP</strong> to any marketing text to unsubscribe from promotional SMS. Reply <strong>HELP</strong> for assistance.</li>
              <li>Even after opting out of marketing texts, we may still send transactional messages related to an active booking or account inquiry.</li>
            </ul>
          </div>
          <p className="mb-4">
            <strong>Email opt-out:</strong> Click the "Unsubscribe" link in any marketing email, or email us at{' '}
            <a href="mailto:Support@opekjunkremoval.com" className="text-brand font-semibold hover:underline">Support@opekjunkremoval.com</a>{' '}
            with the subject line "Unsubscribe." Transactional emails related to your bookings may still be sent as needed.
          </p>
          <p>
            <strong>Phone opt-out:</strong> You may request to be removed from promotional call lists by contacting us at (831) 318-7139 or Support@opekjunkremoval.com. We may still call you regarding an active service request or booking.
          </p>
        </>
      ),
    },
    {
      id: 'sharing-info',
      title: '5. Information Sharing & Disclosure',
      icon: <HeartHandshake size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            <strong>We do not sell your personal information.</strong> We share information only as described below to operate our platform, fulfill your requests, and comply with law:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>With Independent Providers:</strong> We share booking details, service address, name, phone number, email, photos, and special instructions with the local provider assigned to your job so they can perform the service.
            </li>
            <li>
              <strong>With Service Providers & Vendors:</strong> We use trusted third parties to host our platform, process payments, deliver emails and text messages, operate our voice assistant, and store data. These vendors process information on our behalf under contractual obligations to protect it.
            </li>
            <li>
              <strong>Business Transfers:</strong> If Opek is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to this Privacy Policy.
            </li>
            <li>
              <strong>Legal Compliance & Safety:</strong> We may disclose information if required by law, court order, or government request, or when we believe disclosure is necessary to protect the rights, property, or safety of Opek, our users, providers, or the public.
            </li>
          </ul>
          <p>
            Providers who receive your information are independent businesses responsible for their own privacy practices once they receive your booking details.
          </p>
        </>
      ),
    },
    {
      id: 'third-party',
      title: '6. Third-Party Service Providers',
      icon: <Globe size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            We rely on the following categories of third-party partners to deliver our services. Each processes data according to their own privacy policies in addition to our agreements with them:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Stripe</strong> — payment processing and customer billing</li>
            <li><strong>Supabase</strong> — database hosting, file storage, and backend infrastructure</li>
            <li><strong>Resend</strong> — transactional and marketing email delivery</li>
            <li><strong>ElevenLabs</strong> — AI voice assistant and call handling</li>
            <li><strong>Vercel</strong> — website hosting and serverless API functions</li>
          </ul>
          <p>
            Our website may contain links to third-party sites (such as social media profiles). We are not responsible for the privacy practices of those external sites and encourage you to review their policies before providing personal information.
          </p>
        </>
      ),
    },
    {
      id: 'cookies',
      title: '7. Cookies & Local Storage',
      icon: <Bell size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            We use cookies, local storage, and similar technologies to keep our website functioning, remember your preferences (such as your selected city), and understand how visitors use our platform.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Essential cookies/storage:</strong> Required for core site functionality and form submissions.</li>
            <li><strong>Preference storage:</strong> Saves settings like your location preference to improve your experience on return visits.</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Disabling cookies may limit certain features of our website. We do not currently use third-party advertising cookies, but we may update this policy if that changes.
          </p>
        </>
      ),
    },
    {
      id: 'data-security',
      title: '8. Data Retention & Security',
      icon: <FileText size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            We employ administrative, technical, and physical safeguards designed to protect your information from unauthorized access, alteration, disclosure, or destruction. Payment data is handled by PCI-compliant processors.
          </p>
          <p className="mb-4">
            We retain personal data for as long as reasonably necessary to fulfill the purposes described in this policy — including processing bookings, maintaining business records, resolving disputes, enforcing our agreements, and meeting legal obligations. Marketing contact lists are retained until you opt out or request deletion.
          </p>
          <p>
            No method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      id: 'your-rights',
      title: '9. Your Privacy Rights',
      icon: <UserCheck size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Depending on where you live, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
            <li><strong>Correction:</strong> Request that we update or correct inaccurate information.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal retention requirements.</li>
            <li><strong>Opt-Out of Marketing:</strong> Unsubscribe from promotional emails and texts as described in Section 4.</li>
            <li><strong>Do Not Sell/Share:</strong> We do not sell personal information. California residents may contact us to confirm or exercise applicable rights under the CCPA/CPRA.</li>
          </ul>
          <p className="mb-4">
            To exercise any of these rights, email{' '}
            <a href="mailto:Support@opekjunkremoval.com" className="text-brand font-semibold hover:underline">Support@opekjunkremoval.com</a>{' '}
            or call (831) 318-7139. We will verify your identity before processing requests and respond within the timeframe required by applicable law.
          </p>
          <p>
            We will not discriminate against you for exercising your privacy rights.
          </p>
        </>
      ),
    },
    {
      id: 'children',
      title: '10. Children\'s Privacy',
      icon: <Users size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Our services are not directed to individuals under the age of 18, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
          </p>
        </>
      ),
    },
    {
      id: 'policy-changes',
      title: '11. Changes to This Policy',
      icon: <Mail size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will update the "Last Updated" date at the top of this page.
          </p>
          <p>
            Your continued use of our services after changes are posted constitutes acceptance of the updated policy. We encourage you to review this page periodically.
          </p>
        </>
      ),
    },
    {
      id: 'contact-us',
      title: '12. Contact & Support',
      icon: <PhoneCall size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            If you have questions about this Privacy Policy, wish to access or delete your data, update your information, or manage your communication preferences, please contact us:
          </p>
          <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-6 space-y-2">
            <p className="text-sm text-secondary"><strong>Email:</strong> <a href="mailto:Support@opekjunkremoval.com" className="text-brand hover:underline font-semibold">Support@opekjunkremoval.com</a></p>
            <p className="text-sm text-secondary"><strong>Phone:</strong> <a href="tel:8313187139" className="text-brand hover:underline font-semibold">(831) 318-7139</a></p>
            <p className="text-sm text-secondary"><strong>Website:</strong> <a href="https://opekjunkremoval.com" className="text-brand hover:underline font-semibold">opekjunkremoval.com</a></p>
            <p className="text-sm text-secondary"><strong>Service Area:</strong> Nationwide, United States</p>
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
            Last Updated: June 27, 2026. Please read this Privacy Policy carefully to understand how we collect, use, protect, and share your personal information — including how we contact you by text, email, and phone.
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
