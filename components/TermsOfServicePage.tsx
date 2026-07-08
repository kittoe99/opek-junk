import React from 'react';
import { Scale, Info, CreditCard, Ban, ShieldAlert, AlertTriangle, Hammer, PhoneCall, CheckSquare, ShieldCheck, AlertCircle, Mail, MessageSquare } from 'lucide-react';
import { LegalPageLayout } from './shared/LegalPageLayout';

interface TermsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const TermsOfServicePage: React.FC = () => {
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
            By accessing, browsing, or using our website, platform, mobile applications, booking systems, or ordering services by phone or text, you acknowledge that you have read, understood, and agree to be bound by these Terms and our{' '}
            <a href="/privacy" className="text-brand font-semibold hover:underline">Privacy Policy</a>.
          </p>
          <p className="font-bold text-secondary">
            If you do not agree to these terms, please immediately cease using our platform and services.
          </p>
        </>
      ),
    },
    {
      id: 'communications-marketing',
      title: '2. Communications, SMS & Marketing',
      icon: <MessageSquare size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            By providing your phone number, email address, or other contact information through our website, booking flows, quote forms, contact page, phone calls, or AI voice assistant, you consent to receive communications from Opek and our authorized service providers at the contact information you provide.
          </p>
          <p className="mb-4">
            These communications may be sent by <strong>automated or manual means</strong>, including SMS/MMS text messages, email, and phone calls (including prerecorded or artificial voice messages where permitted by law). Communications may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Transactional messages:</strong> Booking confirmations, quote follow-ups, provider dispatch updates, payment receipts, rescheduling notices, and customer support.</li>
            <li><strong>Marketing messages:</strong> Promotional offers, discounts, seasonal campaigns, service reminders, and news about Opek services — where permitted and with opt-out rights as described below.</li>
          </ul>
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-4 space-y-2 text-sm">
            <p className="font-bold text-secondary">SMS/Text Message Terms:</p>
            <ul className="list-disc pl-5 space-y-1 text-secondary-700">
              <li>Message frequency varies. Message and data rates may apply.</li>
              <li>Consent to receive marketing texts is <strong>not required</strong> as a condition of purchasing any goods or services.</li>
              <li>Reply <strong>STOP</strong> to opt out of promotional SMS. Reply <strong>HELP</strong> for help.</li>
              <li>You may still receive transactional texts related to active bookings after opting out of marketing.</li>
            </ul>
          </div>
          <p className="mb-4">
            <strong>Email marketing:</strong> You may unsubscribe from promotional emails at any time using the link in any marketing email or by contacting Support@opekjunkremoval.com.
          </p>
          <p className="mb-4">
            You represent that you are the owner or authorized user of any phone number or email address you provide, and that you have authority to consent to communications at that number or address.
          </p>
          <p>
            For full details on how we collect, use, and protect your personal information, see our{' '}
            <a href="/privacy" className="text-brand font-semibold hover:underline">Privacy Policy</a>.
          </p>
        </>
      ),
    },
    {
      id: 'platform-description',
      title: '3. The Opek Platform',
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
          <p className="mb-4">
            Opek facilitates this arrangement by providing pricing estimations, offering software platforms, scheduling windows, handling secure credit card billing, and providing general support. We are not responsible for the actions, omissions, quality, safety, or legality of services rendered by independent Providers.
          </p>
          <p className="font-bold">
            No Employment or Agency: You acknowledge that Providers are independent contractors and are not employees, agents, joint ventures, or partners of Opek. Providers retain sole control over how they perform services.
          </p>
        </>
      ),
    },
    {
      id: 'booking-cancellations',
      title: '4. Bookings & Cancellations',
      icon: <Ban size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            When booking through Opek, you agree to provide accurate, complete, and current information, including the volume and description of items to be hauled.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Cancellation Policy:</strong> Bookings may be canceled or rescheduled without fee up to 72 hours before your scheduled arrival window.
            </li>
            <li>
              <strong>Late Cancellations:</strong> A cancellation fee of $69 will be applied for all cancellations made less than 72 hours before the original booking date.
            </li>
            <li>
              <strong>Dumpster Rental Cancellations:</strong> Dumpster rental cancellations within 48 hours of scheduled drop-off are subject to a $150 dry run/holding fee.
            </li>
            <li>
              <strong>Right to Cancel:</strong> We reserve the discretionary right to cancel any booked service on our platform without any explanation. In that case, a full refund will be issued if payments were made and service was not provided.
            </li>
            <li>
              <strong>Provider Discretion:</strong> A service provider may decline a service upon arrival at their own discretion.
            </li>
            <li>
              <strong>No Guarantee of Performance:</strong> Opek does not guarantee that a Provider will accept a booking request, arrive at a specific time, or successfully complete the service. We are not liable for any delay or failure to perform.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'payment-pricing',
      title: '5. Payments, Estimates & Refunds',
      icon: <CreditCard size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Opek provides upfront, flat-rate pricing based on information you submit (e.g., item volume, truck loads, or dumpster size).
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Quote Adjustments:</strong> Price may be adjusted after a price quote if items were not accurately listed or some items were omitted at the time of booking. You will have the option to approve the adjusted rate before loading begins.
            </li>
            <li>
              <strong>Payment Schedule:</strong> A full or partial payment may be debited from customer’s payment method at least 24 hours or whatever was agreed upon during the time of making the reservation or booking. Full or partial payment must be made before or on the service day before the provider arrives to the job site.
            </li>
            <li>
              <strong>Refunds Policy:</strong> We offer no refunds for services completed.
            </li>
            <li>
              <strong>Extra Fees:</strong> Standard fees cover standard transit. Additional fees apply for municipal dump surcharges, mattresses, tires, hazardous materials, or excessive stairs/carry distance, which will be disclosed prior to booking or on-site.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'prohibited-warranties',
      title: '6. Prohibited Items & Warranties',
      icon: <AlertCircle size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            To protect our Providers and avoid hazardous situations, customers are bound by strict warranties regarding item ownership and prohibited materials.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Ownership Warranty:</strong> You warrant that you are the legal owner of all items requested for removal, or that you have explicit, written authority from the owner to dispose of such items. You agree to fully indemnify Opek for any claims arising from disputed ownership.
            </li>
            <li>
              <strong>Prohibited Items:</strong> You are strictly prohibited from booking removal for hazardous materials, toxic chemicals, ammunition, firearms, explosives, biohazards, medical waste, lead-acid batteries, gasoline, propane tanks, asbestos, wet paint, or any materials containing hazardous or illegal compounds.
            </li>
            <li>
              <strong>Right of Refusal:</strong> Providers reserve the absolute right to refuse to handle, load, or transport any items they deem unsafe, toxic, illegal, or hazardous.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'platform-disintermediation',
      title: '7. Off-Platform Transactions (Disintermediation)',
      icon: <ShieldCheck size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Opek invests significant resources to match customers with high-quality, vetted Providers. To ensure platform safety and security, all bookings and payments must be processed directly through the platform.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Ban on Direct Bookings:</strong> You are strictly prohibited from soliciting, negotiating, or completing bookings directly with any Provider matched through Opek, outside of the Opek platform.
            </li>
            <li>
              <strong>Direct Payments Ban:</strong> All service payments, including tips and adjustments, must be routed through Opek's secure billing system. You are prohibited from paying Providers directly in cash, check, or via external peer-to-peer payment apps (e.g., Venmo, CashApp, Zelle).
            </li>
            <li>
              <strong>Consequences of Violation:</strong> Bypassing the Opek platform immediately voids any protection under our "SafeProtect" policy, releases Opek from any liability whatsoever for the service, and may result in permanent suspension from our platform.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'conduct-damages',
      title: '8. Work Environment & Damage Claims',
      icon: <Hammer size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            Customers must provide a safe environment for the independent Providers. This includes securing pets, pointing out structural hazards, and clearing access paths.
          </p>
          <p className="mb-4">
            <strong>Liability Limitation:</strong> We are not responsible for property damage or any damages at all that arise from services rendered by independent service providers. Providers are independent contractors and are solely liable for any physical property damage or personal injury that occurs during the performance of services.
          </p>
          <p className="mb-4">
            <strong>Property Damage Claim Window:</strong> In the event of property damage caused by a Provider, you must submit a written claim with photographic proof to Opek and the Provider within forty-eight (48) hours of the service completion. Claims submitted after 48 hours are permanently waived and barred.
          </p>
          <p className="mb-4">
            <strong>SafeProtect Platform Protection:</strong> Our “SafeProtect” platform protection is not an insurance policy. It has a limit of $500 per occurrence. We may increase that amount in our discretion on a case-by-case basis.
          </p>
          <p>
            <strong>Exclusions:</strong> SafeProtect does not cover pre-existing damage, delicate surfaces (such as hardwood floors, linoleum, or drywall) that were not adequately protected or cleared by the customer, cash, jewelry, heirlooms, fine art, antiques, electronics, or theft.
          </p>
        </>
      ),
    },
    {
      id: 'disclaimers',
      title: '9. Disclaimers & Limits of Liability',
      icon: <ShieldAlert size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4 font-bold text-secondary uppercase text-xs tracking-wider">
            THE OPEK PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
          </p>
          <p className="mb-4 text-sm">
            TO THE FULLEST EXTENT PERMITTED BY LAW, OPEK JUNK REMOVAL, ITS AFFILIATES, AND ITS OFFICERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, LOSS OF USE, OR BUSINESS INTERRUPTION) ARISING OUT OF THE PLATFORM USE OR THE SERVICES PERFORMED BY INDEPENDENT LOCAL SERVICE PROVIDERS.
          </p>
          <p className="mb-4 text-sm">
            OPEK'S MAXIMUM LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THE PLATFORM OR COMPLETED SERVICES SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU TO OPEK FOR THE SPECIFIC BOOKING GIVING RISE TO LIABILITY, OR UP TO THE DISCRETIONARY $500 LIMIT UNDER OUR SAFEPROTECT PLATFORM PROTECTION POLICY.
          </p>
          <p className="mb-4 text-sm">
            <strong>Indemnification:</strong> You agree to indemnify, defend, and hold harmless Opek, its affiliates, officers, employees, and agents from any claims, damages, liabilities, losses, costs, and expenses (including reasonable attorneys' fees) arising out of your use of the platform, your breach of these Terms, your violation of any third-party rights, or any property damage or injury caused by your acts or omissions.
          </p>
          <p className="text-sm font-bold text-secondary">
            <strong>Statute of Limitations:</strong> You agree that any claim or cause of action arising out of or related to these Terms, the platform, or the services must be filed within one (1) year after such claim or cause of action arose, or be forever barred.
          </p>
        </>
      ),
    },
    {
      id: 'disputes-law',
      title: '10. Governing Law & Dispute Resolution',
      icon: <AlertTriangle size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4">
            These Terms and any dispute arising out of them will be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
          </p>
          <p className="mb-4">
            <strong>Dispute Resolution Procedure:</strong> Resolutions must be initially resolved through us. If not resolved to your satisfaction, then the dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, enforcement, or validity thereof will be settled by binding arbitration before any court action.
          </p>
          <p className="font-bold mb-4">
            You agree to waive any right to participate as a class representative or class member in any class action lawsuit or class-wide arbitration.
          </p>
          <p className="text-sm">
            Arbitrations will be administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. The arbitration will be held on an individual basis, and the arbitrator's decision will be final and binding.
          </p>
        </>
      ),
    },
    {
      id: 'general-user-customer',
      title: '11. Terms – General User & Customer',
      icon: <CheckSquare size={18} className="text-brand shrink-0" />,
      content: (
        <>
          <p className="mb-4 font-bold text-secondary">
            The following general terms apply to all users and customers booking services through the Opek platform:
          </p>
          <ol className="list-decimal pl-6 space-y-3 font-semibold text-secondary-800">
            <li>
              Our “SafeProtect” platform protection is not an insurance policy. It has a limit of $500 per occurrence. We may increase that amount in our discretion on a case by case basis.
            </li>
            <li>
              A full or partial payment may be debited from customer’s payment method at least 24 hours or whatever was agreed upon during time of making the reservation or booking. We offer no refunds for services completed.
            </li>
            <li>
              A cancellation fee of $69 will be applied for all cancellations less than 72 hours before the original booking date.
            </li>
            <li>
              Resolutions must be initially resolved through us, if not resolved then arbitration before court.
            </li>
            <li>
              We are not responsible for property damage or any damages at all that arise from services rendered by independent service providers.
            </li>
            <li>
              We reserve the discretionary right to cancel any booked service on our platform without any explanation, in that case, a full refund will be issued if payments were made and service was not provided.
            </li>
            <li>
              Price may be adjusted after a price quote if items were not accurately listed or some items were omitted at the time of booking.
            </li>
            <li>
              A service provider may decline a service upon arrival at their own discretion.
            </li>
            <li>
              Full or partial payment must be made before or on service day before the provider arrives to the job site.
            </li>
          </ol>
        </>
      ),
    },
    {
      id: 'contact',
      title: '12. Contact Info',
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

  return (
    <LegalPageLayout
      eyebrow="Legal Agreement"
      title={<>Terms of <span className="text-brand">Service.</span></>}
      description="Last Updated: June 27, 2026. Please read these Terms of Service carefully before booking dumpsters, junk removal, cleanouts, or moving services."
      sections={sections}
      defaultSection="agreement"
    />
  );
};
