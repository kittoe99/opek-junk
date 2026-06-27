import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PageHero } from '../shared/PageHero';
import { BentoFeatureSection } from '../shared/BentoFeatureSection';
import { TrustBadges } from '../TrustBadges';
import { CharityBanner } from '../CharityBanner';
import { ProcessEditorial } from '../ProcessEditorial';
import { ServiceArea } from '../ServiceArea';
import { QuickActionBar } from '../QuickActionBar';
import { ZipCheckModal } from '../ZipCheckModal';

const MattressIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 4"/>
    <circle cx="8" cy="12" r="1" className="stroke-brand" strokeWidth="1.5"/>
    <circle cx="16" cy="12" r="1" className="stroke-brand" strokeWidth="1.5"/>
  </svg>
);

const BoxSpringIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="10" width="18" height="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10v8M12 10v8M18 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 14h18" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BedFrameIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 4v16M20 10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8h5" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 11h5" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CompleteSetIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8h16v4H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12h16v4H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16v4M20 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 10l2 2 4-4" className="stroke-brand" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZipChecker = ({
  zipValue,
  setZipValue,
  zipLoading,
  zipError,
  setZipError,
  onCheck,
}: {
  zipValue: string;
  setZipValue: (v: string) => void;
  zipLoading: boolean;
  zipError: string | null;
  setZipError: (v: string | null) => void;
  onCheck: () => void;
}) => (
  <div className="max-w-md space-y-3">
    <p className="text-sm font-bold text-secondary uppercase tracking-wider">Check your pricing instantly</p>
    <div className="relative flex items-center bg-white border border-secondary-200 hover:border-brand/40 focus-within:border-brand shadow-md rounded-xl overflow-hidden p-1 w-full">
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        value={zipValue}
        onChange={(e) => { setZipValue(e.target.value.replace(/\D/g, '')); setZipError(null); }}
        onKeyDown={(e) => e.key === 'Enter' && onCheck()}
        placeholder="Enter ZIP code for pricing"
        className="flex-1 px-4 py-3 text-sm bg-transparent border-none text-secondary focus:outline-none font-mono tracking-wider"
        style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
      />
      <button
        onClick={onCheck}
        disabled={zipValue.length !== 5 || zipLoading}
        className="px-5 py-3 bg-brand hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40 rounded-lg shrink-0 flex items-center gap-1.5"
      >
        {zipLoading ? <Loader2 size={14} className="animate-spin" /> : 'Check Rates'}
      </button>
    </div>
    {zipError && <p className="text-xs text-red-500 font-semibold">{zipError}</p>}
  </div>
);

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);
  const [zipValue, setZipValue] = useState('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);

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

  const mattressItems = [
    {
      label: 'Mattresses (From $75)',
      desc: 'Standard innerspring, memory foam, latex, hybrid, pillow-top, futons, and crib mattresses of any size.',
      icon: MattressIcon,
      onClick: () => navigate('/quote', { state: { preselectItems: [{ name: 'Mattress', quantity: 1 }] } }),
    },
    {
      label: 'Box Springs (From $65)',
      desc: 'Traditional wood box springs, metal foundations, split box springs, or low-profile bases from any floor.',
      icon: BoxSpringIcon,
      onClick: () => navigate('/quote', { state: { preselectItems: [{ name: 'Box Spring', quantity: 1 }] } }),
    },
    {
      label: 'Bed Frames (From $70)',
      desc: 'Steel bed frames, wooden headboards, footboards, adjustables, platform beds, bunk beds, and daybeds.',
      icon: BedFrameIcon,
      onClick: () => navigate('/quote', { state: { preselectItems: [{ name: 'Bed Frame', quantity: 1 }] } }),
    },
    {
      label: 'Complete Sets (Save 15%)',
      desc: 'Bundle your mattress, box spring, and frame removal into a single flat-rate package for maximum savings.',
      icon: CompleteSetIcon,
      onClick: () => navigate('/quote', {
        state: {
          preselectItems: [
            { name: 'Mattress', quantity: 1 },
            { name: 'Box Spring', quantity: 1 },
            { name: 'Bed Frame', quantity: 1 },
          ],
        },
      }),
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <PageHero
        eyebrow="Eco-Haul Service"
        title={
          <>
            Mattress Disposal.
            <br />
            <span className="text-brand">From $75</span>
          </>
        }
        subtitle="Same-day pickup from any room. Zero heavy lifting."
        image="/mattress-pickup.webp"
        imageAlt="Opek mattress removal service in action"
        primaryCta={{ label: 'View Pricing', onClick: () => navigate('/booking/mattress') }}
        secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking/mattress') }}
      >
        <ZipChecker
          zipValue={zipValue}
          setZipValue={setZipValue}
          zipLoading={zipLoading}
          zipError={zipError}
          setZipError={setZipError}
          onCheck={handleZipCheck}
        />
      </PageHero>

      <TrustBadges />
      <CharityBanner />

      <BentoFeatureSection
        eyebrow="Items Handled"
        title={
          <>
            Mattresses,
            <br />
            <span className="text-brand">box springs, & rails.</span>
          </>
        }
        description="Simple flat-rates for all bedroom furniture. From memory foam to heavy wooden platform beds, our matched local loaders haul it away from anywhere inside."
        items={mattressItems}
      />

      <ProcessEditorial
        eyebrow="Disposal Process"
        title={
          <>
            Mattress disposal
            <br className="hidden md:block" /> in <span className="text-brand">three moves.</span>
          </>
        }
        subtitle="Upfront pricing, in-home pickup, and responsible recycling."
        steps={[
          {
            image: '/process-step-2.svg',
            alt: 'Instant mattress disposal quote',
            titleStart: 'quotes.',
            titleAccent: 'simplified.',
            desc: 'Get an instant, flat-rate mattress disposal quote online.',
          },
          {
            image: '/process-step-3.svg',
            alt: 'In-home mattress removal service',
            titleStart: 'Zero',
            titleAccent: 'lifting.',
            desc: 'Vetted crews retrieve your mattress from any room or floor. No curb dragging.',
          },
          {
            image: '/eco-disposal-step.png',
            alt: 'Eco-friendly mattress recycling',
            titleStart: 'Eco',
            titleAccent: 'disposal.',
            desc: 'Up to 80% of mattress components are recycled, keeping them out of landfills.',
          },
        ]}
        cta={{ label: 'Check Rates & Book', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      />

      <ServiceArea
        onGetQuote={() => setIsZipModalOpen(true)}
        titleStart="Clear your space."
        titleAccent="Same-day booking available."
      />

      <QuickActionBar onBookOnline={() => navigate('/booking/mattress')} />

      <ZipCheckModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
        onGetQuote={() => navigate('/quote')}
      />
    </div>
  );
};
