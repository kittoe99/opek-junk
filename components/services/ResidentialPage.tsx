import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Check, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResidentialPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const highlights = [
    "Furniture, appliances, mattresses & household clutter",
    "Same-day and next-day service available nationwide",
    "Full home cleanouts — we handle everything",
    "Up to 70% of items donated or recycled",
    "Licensed, insured, and background-checked crews",
  ];

  const faqs = [
    {
      q: "How is pricing determined?",
      a: "Pricing is based on the volume of junk — the space your items take up in our truck. We give you an upfront quote on-site before any work begins. No hidden fees."
    },
    {
      q: "Do I need to be home during pickup?",
      a: "Yes, we recommend being present so you can point out exactly what needs to go and approve the quote. However, we can arrange gated-access or key pickup for regular customers."
    },
    {
      q: "What items can't you take?",
      a: "We cannot haul hazardous materials like paint, chemicals, asbestos, or medical waste. Everything else — furniture, appliances, electronics, debris — we handle."
    },
    {
      q: "How quickly can you come out?",
      a: "In most areas, same-day or next-day appointments are available. Book online or call us and we'll confirm a 2-hour arrival window."
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="pt-32 pb-16 md:pt-40 md:pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Home size={14} className="text-brand" strokeWidth={2.5} />
          <span className="text-sm font-bold text-secondary-400 uppercase tracking-wider">Residential</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-[1.1] mb-5">
          Residential junk removal<br className="hidden sm:block" />
          <span className="text-brand">at your doorstep.</span>
        </h1>
        <p className="text-secondary-400 text-base md:text-lg max-w-xl leading-relaxed mb-8">
          Furniture, appliances, and full home cleanouts. Upfront pricing, same-day availability, and crews that do all the heavy lifting — you just point.
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
          <img src="/opek2.webp" alt="Residential junk removal crew" className="w-full h-full object-cover" loading="lazy" />
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
          <h2 className="text-xl font-black text-secondary mb-2">Ready to clear it out?</h2>
          <p className="text-secondary-400 text-sm mb-4">Free quote in under two minutes. No obligations, no hidden fees.</p>
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
