import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { PageHero } from '../shared/PageHero';
import { TrustBadges } from '../TrustBadges';
import { ServiceArea } from '../ServiceArea';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();

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

      {/* Two-Column Sales Section */}
      <section className="py-16 bg-white border-b border-secondary-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <div className="relative">
              <img 
                src="/mattress-pickup.webp" 
                alt="Mattress pickup service" 
                className="w-full h-auto rounded-3xl object-cover shadow-xl border border-secondary-100"
              />
              <div className="absolute -bottom-4 -right-4 bg-brand text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg">
                Eco-Friendly
              </div>
            </div>

            {/* Sales Copy Column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="block w-8 h-px bg-brand" />
                <span className="text-[11px] font-black text-brand uppercase tracking-[0.25em]">Hassle-Free Removal</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight leading-tight">
                Clear your space without lifting a finger.
              </h2>
              <p className="text-sm text-secondary-400 leading-relaxed">
                Getting rid of an old, heavy mattress shouldn't be a workout. Our professional two-person crews handle all the heavy lifting, navigate stairs, and load it safely from any room in your home.
              </p>
              
              <ul className="space-y-3.5">
                {[
                  { title: 'Eco-Friendly First', desc: 'Up to 80% of mattress parts (steel, foam, fabric, wood) are recycled rather than sent to landfills.' },
                  { title: 'Full-Service Inside Pickup', desc: 'No need to drag it to the curb. We lift and load it from any floor or room.' },
                  { title: 'Same-Day Availability', desc: 'Book online in seconds, select your preferred window, and track our loaders in real time.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-secondary">{item.title}</h4>
                      <p className="text-[11px] text-secondary-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/quote')}
                  className="px-8 py-4 bg-brand text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-600 transition-all duration-300 shadow-md shadow-brand/10 inline-flex items-center gap-2"
                >
                  <span>View Pricing & Book</span>
                  <ArrowRight size={13} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceArea titleStart="Clear your space." titleAccent="Same-day booking available." />
    </div>
  );
};
