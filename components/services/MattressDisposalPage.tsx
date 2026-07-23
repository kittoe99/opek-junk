import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PageHero } from '../shared/PageHero';
import { EditorialContentSection } from '../shared/EditorialContentSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { Testimonials } from '../Testimonials';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';
import { ZipCheckModal } from '../ZipCheckModal';
import { trackMattressConversion } from '../../lib/googleAds';
import {
  MATTRESS_ONLINE_DISCOUNT,
  MATTRESS_STANDARD_RATES,
} from '../../lib/mattressBookingPricing';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);
  const [zipValue, setZipValue] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

  const goToBooking = (preselectItems?: { name: string; quantity: number }[]) => {
    trackMattressConversion('mattress_view_pricing');
    navigate('/booking/mattress', preselectItems ? { state: { preselectItems } } : undefined);
  };

  const handleZipCheck = async () => {
    const zip = zipValue.trim();
    if (!/^\d{5}$/.test(zip)) {
      setZipError('Enter a valid 5-digit ZIP.');
      return;
    }
    setZipLoading(true);
    setZipError(null);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!res.ok) {
        setZipError('ZIP not found.');
        return;
      }
      const data = await res.json();
      const city = data.places?.[0]?.['place name'] ?? '';
      const state = data.places?.[0]?.['state abbreviation'] ?? '';

      trackMattressConversion('mattress_zip_check');

      navigate('/booking/mattress', {
        state: {
          zipResult: { city, state, served: true },
          zipValue: zip,
          preselectItems: [{ name: 'Mattress', quantity: 1 }],
        },
      });
    } catch {
      setZipError('Check failed. Try again.');
    } finally {
      setZipLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Flat-rate pickup"
        title={
          <>
            Mattress
            <br />
            Disposal
          </>
        }
        subtitle="Upfront pricing from $75 online. Vetted crews haul mattresses, box springs, and frames from any room — same-day available."
        image="/mattress-pickup.webp"
        imageAlt="Crew carrying a mattress down residential stairs"
        primaryCta={{ label: 'Book pickup', onClick: () => goToBooking() }}
        secondaryCta={{ label: 'See pricing', onClick: () => {
          document.getElementById('mattress-pricing')?.scrollIntoView({ behavior: 'smooth' });
        }}}
      />

      <TrustBadges />

      <section id="mattress-pricing" className="bg-[#f5f6f7] py-16 md:py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-3">
              Transparent pricing
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-secondary tracking-tight mb-3">
              Check rates in your ZIP
            </h2>
            <p className="text-secondary-500 text-base leading-relaxed">
              Online booking discounts bring standard rates down — one item from ${MATTRESS_STANDARD_RATES.oneItem - MATTRESS_ONLINE_DISCOUNT.oneItem}, two from ${MATTRESS_STANDARD_RATES.twoItems - MATTRESS_ONLINE_DISCOUNT.twoItems}, full set from ${MATTRESS_STANDARD_RATES.threeOrMore - MATTRESS_ONLINE_DISCOUNT.threeOrMore}.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {[
              { label: '1 item', rate: MATTRESS_STANDARD_RATES.oneItem, save: MATTRESS_ONLINE_DISCOUNT.oneItem },
              { label: '2 items', rate: MATTRESS_STANDARD_RATES.twoItems, save: MATTRESS_ONLINE_DISCOUNT.twoItems },
              { label: '3+ / full set', rate: MATTRESS_STANDARD_RATES.threeOrMore, save: MATTRESS_ONLINE_DISCOUNT.threeOrMore },
            ].map((tier) => (
              <div
                key={tier.label}
                className="bg-white rounded-2xl border border-secondary-100 p-5 text-center"
              >
                <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wide mb-2">
                  {tier.label}
                </p>
                <p className="text-2xl font-bold text-secondary">
                  ${tier.rate - tier.save}
                </p>
                <p className="text-xs text-secondary-400 mt-1 line-through">${tier.rate}</p>
                <p className="text-[11px] font-semibold text-brand mt-2">Save ${tier.save} online</p>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-secondary-100 p-4 sm:p-5">
              <p className="text-sm font-semibold text-secondary mb-3 text-center">
                Enter your ZIP to start booking
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zipValue}
                  onChange={(e) => {
                    setZipValue(e.target.value.replace(/\D/g, ''));
                    setZipError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleZipCheck()}
                  placeholder="ZIP code"
                  className="flex-1 px-4 py-3 text-sm bg-secondary-50/80 border border-secondary-100 rounded-xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={handleZipCheck}
                  disabled={zipValue.length !== 5 || zipLoading}
                  className="px-5 py-3 bg-secondary hover:bg-secondary-600 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-40 inline-flex items-center gap-1.5 shrink-0"
                >
                  {zipLoading ? <Loader2 size={14} className="animate-spin" /> : 'Continue'}
                </button>
              </div>
              {zipError && <p className="text-xs text-red-500 font-semibold mt-2 text-center">{zipError}</p>}
            </div>
          </div>
        </div>
      </section>

      <ProcessEditorial
        variant="numbered"
        eyebrow="How it works"
        title="Mattress disposal in three steps"
        subtitle="Upfront pricing, in-home pickup, and responsible recycling."
        steps={[
          {
            number: '1',
            title: 'Get an upfront price',
            description: 'Pick your items online and see a flat rate before you book.',
            image: '/process-step-1.svg',
            alt: 'Instant mattress disposal quote',
          },
          {
            number: '2',
            title: 'Zero lifting required',
            description: 'Matched crews retrieve your mattress from any room or floor.',
            image: '/process-step-3.svg',
            alt: 'In-home mattress removal service',
          },
          {
            number: '3',
            title: 'Eco-friendly disposal',
            description: 'Up to 80% of mattress components are recycled — not landfilled.',
            image: '/process-step-2.svg',
            alt: 'Eco-friendly mattress recycling',
          },
        ]}
        cta={{ label: 'Book mattress pickup', onClick: () => goToBooking() }}
      />

      <EditorialContentSection title="Why book mattress disposal online">
        <p>
          Old mattresses are bulky, awkward, and often banned from curbside trash. Booking mattress
          disposal online gets you a flat rate, a vetted local crew, and pickup from inside the home —
          no dragging to the curb.
        </p>
        <p>
          Pair mattress removal with{' '}
          <Link to="/services/junk-removal" className="text-brand hover:underline font-semibold">
            junk removal
          </Link>{' '}
          for dressers, nightstands, and other bedroom clutter in the same visit. Need help moving
          the rest of the house?{' '}
          <Link to="/services/moving-labor" className="text-brand hover:underline font-semibold">
            Moving labor
          </Link>{' '}
          and{' '}
          <Link to="/services/small-local-moves" className="text-brand hover:underline font-semibold">
            small local moves
          </Link>{' '}
          are available nationwide.
        </p>
      </EditorialContentSection>

      <Testimonials />
      <CharityBanner />

      <ServiceArea
        onGetQuote={() => setIsZipModalOpen(true)}
        titleStart="Clear the bedroom."
        titleAccent="Same-day booking available."
      />

      <ZipCheckModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
        onGetQuote={() => navigate('/quote')}
      />
    </div>
  );
};
