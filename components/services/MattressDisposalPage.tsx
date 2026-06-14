import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      image: "/process-step-1.svg",
      alt: "Snap a photo of the mattress",
      titleStart: "Snap. Send.",
      titleAccent: "Quote.",
      desc: "Upload a photo of your mattress to get an instant, flat-rate quote."
    },
    {
      image: "/mattress-pickup.webp",
      alt: "In-home mattress removal service",
      titleStart: "Zero",
      titleAccent: "lifting.",
      desc: "Vetted crews retrieve your mattress from any room or floor. No curb dragging."
    },
    {
      image: "/mattress-disposal.webp",
      alt: "Eco-friendly mattress recycling",
      titleStart: "Eco",
      titleAccent: "disposal.",
      desc: "Up to 80% of mattress components are recycled, keeping them out of landfills."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Same-Day Mattress Pickup"
        title={<>Mattress<br />Disposal & Recycling</>}
        subtitle="Hassle-free, eco-friendly mattress removal. Upfront pricing, background-checked loaders, and zero heavy lifting. We load it from any room and recycle up to 80% of its parts."
        image="/mattress-disposal.webp"
        imageAlt="Loaders removing a mattress"
        imageCaption="Nationwide Service • Eco-Friendly Recycling • Fully Insured"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/quote') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
        compact
      />

      <TrustBadges />

      {/* Localized Process section modeled after ProcessEditorial */}
      <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden border-b border-secondary-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-20">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="block w-8 h-px bg-brand"></span>
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Disposal Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-[1.05] tracking-tight">
                Mattress disposal<br className="hidden md:block" /> in <span className="text-brand">three moves.</span>
              </h2>
            </div>
            <p className="text-secondary-500 text-sm md:text-base max-w-xs leading-relaxed md:text-right font-medium">
              Upfront pricing, in-home pickup, and responsible recycling.
            </p>
          </div>

          {/* Steps — staggered editorial layout */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 lg:gap-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`group relative flex items-center md:block gap-4 md:gap-0 bg-secondary-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none ${
                  index === 1 ? 'md:mt-16 lg:mt-24' : index === 2 ? 'md:mt-8 lg:mt-12' : ''
                }`}
              >
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 md:w-full md:h-auto md:aspect-square overflow-hidden md:mb-5 shadow-sm md:shadow-md rounded-xl md:rounded-none border border-secondary-100/60">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent pointer-events-none hidden md:block"></div>
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-[17px] md:text-3xl font-black text-secondary leading-[1.1] tracking-tight mb-1 md:mb-3">
                    {step.titleStart} <span className="text-brand">{step.titleAccent}</span>
                  </h3>
                  <p className="text-secondary-500 text-xs md:text-[15px] leading-relaxed max-w-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Centered CTA */}
          <div className="mt-16 md:mt-24 text-center">
            <button
              onClick={() => navigate('/quote')}
              className="px-8 py-4 text-sm font-bold uppercase tracking-wider bg-brand text-white hover:bg-brand-600 transition-all duration-300 rounded-none shadow-md hover:shadow-xl inline-flex items-center gap-2"
            >
              <span>View Pricing & Book</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </section>

      <ServiceArea titleStart="Clear your space." titleAccent="Same-day booking available." />
    </div>
  );
};
