import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BedDouble, Loader2, Recycle, ShieldCheck, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';
import { trackMattressConversion } from '../../lib/googleAds';
import {
  MATTRESS_ONLINE_DISCOUNT,
  MATTRESS_STANDARD_RATES,
} from '../../lib/mattressBookingPricing';

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();
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
    <ServicePageLayout
      path="/services/mattress-disposal"
        eyebrow="Flat-Rate Mattress Pickup"
        title={
          <>
            Mattress
            <br />
            Disposal
          </>
        }
        subtitle={`Upfront pricing from $${MATTRESS_STANDARD_RATES.oneItem - MATTRESS_ONLINE_DISCOUNT.oneItem} online. Vetted crews haul mattresses, box springs, and frames from any room — same-day available.`}
        heroImage="/opek-related-mattress.png?v=1"
        heroImageAlt="Provider carrying a mattress for disposal"
        heroChip="From Any Room"
        primaryCta={{ label: 'Book Pickup', onClick: () => goToBooking() }}
        secondaryCta={{
          label: 'See Pricing',
          onClick: () => {
            document.getElementById('mattress-pricing')?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
        split={{
          eyebrow: 'Mattress haul away',
          title: 'No curb dragging required',
          body: (
            <p>
              Old mattresses are bulky and often banned from curbside trash. Providers retrieve them from
              any floor. Pair with{' '}
              <Link to="/services/junk-removal" className="text-brand hover:text-brand-400 font-semibold">
                junk removal
              </Link>{' '}
              for dressers and bedroom clutter in the same visit.
            </p>
          ),
          includesLabel: 'Pickup includes:',
          includes: [
            { title: 'Mattress & Box Spring', Icon: BedDouble },
            { title: 'In-Home Retrieval', Icon: Truck },
            { title: 'Eco Disposal', Icon: Recycle },
            { title: 'Insured Crews', Icon: ShieldCheck },
          ],
          image: '/opek-related-mattress.png?v=1',
          imageAlt: 'Provider carrying a mattress for disposal pickup',
        }}
        features={{
          title: 'Mattress disposal online',
          items: [
            {
              title: 'Flat Online Rates',
              body: 'See your price before you book — discounted rates when you reserve online.',
            },
            {
              title: 'Zero Lifting',
              body: 'Crews carry mattresses out of bedrooms, basements, and upper floors.',
            },
            {
              title: 'Eco-Friendly',
              body: 'Up to 80% of mattress components can be recycled — not landfilled.',
            },
            {
              title: 'Same-Day Options',
              body: 'Fast pickup windows in most areas when you need it gone today.',
            },
            {
              title: 'Frames & Sets',
              body: 'Add box springs and frames to the same booking for a clean bedroom clear-out.',
            },
            {
              title: 'Bundle Services',
              body: 'Combine with junk removal or moving labor if you are clearing more than a mattress.',
            },
          ],
        }}
        serviceArea={{
          titleStart: 'Clear the bedroom.',
          titleAccent: 'Same-day booking available.',
        }}
      >
        <section
          id="mattress-pricing"
          className="relative py-14 sm:py-16 md:py-20 bg-[var(--bg-alt)] border-t border-[var(--border)] scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <p className="text-[13px] sm:text-sm font-semibold text-brand mb-3">Transparent pricing</p>
              <h2 className="font-sans font-extrabold text-[1.7rem] sm:text-[2.2rem] md:text-[2.4rem] text-[var(--text)] tracking-tight leading-[1.1] mb-3">
                Check rates in your ZIP
              </h2>
              <p className="text-[14px] sm:text-base text-[var(--text-muted)] leading-relaxed">
                Online booking discounts bring standard rates down — one item from $
                {MATTRESS_STANDARD_RATES.oneItem - MATTRESS_ONLINE_DISCOUNT.oneItem}, two from $
                {MATTRESS_STANDARD_RATES.twoItems - MATTRESS_ONLINE_DISCOUNT.twoItems}, full set from $
                {MATTRESS_STANDARD_RATES.threeOrMore - MATTRESS_ONLINE_DISCOUNT.threeOrMore}.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
              {[
                { label: '1 item', rate: MATTRESS_STANDARD_RATES.oneItem, save: MATTRESS_ONLINE_DISCOUNT.oneItem },
                { label: '2 items', rate: MATTRESS_STANDARD_RATES.twoItems, save: MATTRESS_ONLINE_DISCOUNT.twoItems },
                {
                  label: '3+ / full set',
                  rate: MATTRESS_STANDARD_RATES.threeOrMore,
                  save: MATTRESS_ONLINE_DISCOUNT.threeOrMore,
                },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-2xl border border-white/[0.08] bg-[var(--surface)] p-5 text-center"
                >
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">
                    {tier.label}
                  </p>
                  <p className="text-2xl font-bold text-[var(--text)]">${tier.rate - tier.save}</p>
                  <p className="text-xs text-neutral-500 mt-1 line-through">${tier.rate}</p>
                  <p className="text-[11px] font-semibold text-brand mt-2">Save ${tier.save} online</p>
                </div>
              ))}
            </div>

            <div className="max-w-md mx-auto">
              <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface)] p-4 sm:p-5">
                <p className="text-sm font-semibold text-[var(--text)] mb-3 text-center">
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
                    className="flex-1 px-4 py-3 text-sm rounded-xl font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleZipCheck}
                    disabled={zipValue.length !== 5 || zipLoading}
                    className="px-5 py-3 bg-brand hover:bg-brand-600 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-40 inline-flex items-center gap-1.5 shrink-0"
                  >
                    {zipLoading ? <Loader2 size={14} className="animate-spin" /> : 'Continue'}
                  </button>
                </div>
                {zipError && (
                  <p className="text-xs text-brand font-semibold mt-2 text-center">{zipError}</p>
                )}
              </div>
            </div>
          </div>
        </section>
    </ServicePageLayout>
  );
};
