import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Check, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommercialPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const highlights = [
    "Office furniture, cubicles, desks & conference tables",
    "IT equipment, servers, printers & electronics",
    "After-hours and weekend service available",
    "Retail fixture removal and warehouse clearouts",
    "Licensed, insured professionals with volume pricing",
  ];

  const faqs = [
    {
      q: "Can you work after hours to avoid disrupting my business?",
      a: "Yes. We offer after-hours, early morning, and weekend scheduling for commercial clients. Just let us know your preferred window and we'll coordinate around your operations."
    },
    {
      q: "Do you offer recurring commercial service?",
      a: "Absolutely. We set up weekly, bi-weekly, or monthly removal schedules for businesses that generate ongoing junk. Volume discounts apply."
    },
    {
      q: "Can you handle a full office or warehouse cleanout?",
      a: "Yes. From single-item removals to full floor clearouts, we bring the crew and trucks needed to handle the job in one visit whenever possible."
    },
    {
      q: "Are you insured for commercial properties?",
      a: "Yes. All our providers carry full liability insurance and can provide certificates of insurance on request before the job."
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero */}
      <div className="pt-32 pb-16 md:pt-40 md:pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={14} className="text-brand" strokeWidth={2.5} />
          <span className="text-sm font-bold text-secondary-400 uppercase tracking-wider">Commercial</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
          Commercial junk removal<br className="hidden sm:block" />
          <span className="text-brand">built for business.</span>
        </h1>
        <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed mb-8">
          Office furniture, IT equipment, and full commercial cleanouts. After-hours scheduling, volume pricing, and crews that work around your business.
        </p>
        <button
          onClick={() => navigate('/quote')}
          className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center gap-2"
        >
          Get a Free Quote <ArrowRight size={16} />
        </button>
      </div>

      {/* Wide Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
          <img src="/workers-opek.webp" alt="Commercial junk removal crew" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent" />
        </div>
      </div>

      {/* What's Included */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl md:text-3xl font-black text-secondary tracking-tight mb-6">What's included</h2>
        <div className="space-y-3">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" strokeWidth={3} />
              </span>
              <span className="text-secondary-600 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl md:text-3xl font-black text-secondary tracking-tight mb-6">Common questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-secondary-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
              >
                <span className="font-bold text-sm text-secondary pr-4">{faq.q}</span>
                <ChevronDown size={18} className={`text-secondary-300 shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-secondary-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="border-l-2 border-brand pl-6">
          <h2 className="text-xl font-black text-secondary mb-2">Ready to schedule a pickup?</h2>
          <p className="text-secondary-400 text-sm mb-4">Free quote in under two minutes. After-hours and weekend options available.</p>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => navigate('/quote')}
              className="px-6 py-3 bg-secondary text-white font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-brand transition-colors inline-flex items-center gap-2"
            >
              Get a Free Quote <ArrowRight size={16} />
            </button>
            <a
              href="tel:8313187139"
              className="text-secondary font-bold text-sm uppercase tracking-wider underline underline-offset-4 decoration-secondary-300 hover:decoration-brand hover:text-brand transition-colors"
            >
              (831) 318-7139
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
