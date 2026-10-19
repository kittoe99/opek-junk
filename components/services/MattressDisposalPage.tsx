import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Package, ShieldCheck, Truck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';
import { trackMattressConversion } from '../../lib/googleAds';

const approaches = [
  {
    title: 'Easy Booking',
    body: 'Schedule mattress pickup online in minutes — no phone tag required.',
  },
  {
    title: 'In-Home Retrieval',
    body: 'Providers carry mattresses out of bedrooms, basements, and upper floors.',
  },
  {
    title: 'Same Day Pickup',
    body: 'Same-day and next-day windows when local capacity allows in your area.',
  },
  {
    title: '100% Transparent',
    body: 'Know what’s included before you confirm. No surprise add-ons at the door.',
  },
  {
    title: 'Order Tracking',
    body: 'Check status, get an ETA, contact your provider, or reschedule with ease.',
  },
  {
    title: 'Thoughtful Disposal',
    body: 'Mattress components recycled whenever possible — not left on the curb.',
  },
];

export const MattressDisposalPage: React.FC = () => {
  const navigate = useNavigate();
  const goToBooking = (zip?: string) => {
    trackMattressConversion(zip ? 'mattress_zip_check' : 'mattress_view_pricing');
    navigate('/booking/mattress', {
      state: zip
        ? {
            zipResult: { city: '', state: '', served: true },
            zipValue: zip,
            preselectItems: [{ name: 'Mattress', quantity: 1 }],
          }
        : { preselectItems: [{ name: 'Mattress', quantity: 1 }] },
    });
  };
  return <ServicePageLayout
    path="/services/mattress-disposal" eyebrow="Mattress Pickup & Recycling" title="Mattress Disposal"
    subtitle="Make room for better rest. Local providers pick up mattresses, box springs, and frames from any room." heroImage="/optimized/service-scenes/mattress-pickup.webp" heroImageAlt="Provider carrying a mattress for disposal" heroChip="Room to rest"
    primaryCta={{ label: 'View Pricing', onClick: () => goToBooking() }}
    secondaryCta={{ label: 'Get a Quote', onClick: () => navigate('/quote') }}
    onZipCheck={goToBooking}
    bookingPath="/booking/mattress"
    split={{ eyebrow: 'Mattress Pickup & Recycling', title: 'A fresh start for your bedroom',
      body: <p>No curb dragging required. Your matched provider carries out mattresses, box springs and bed frames from bedrooms, basements and upper floors.</p>, image: '/optimized/service-scenes/mattress-pickup.webp', imageAlt: 'Provider carrying a mattress for disposal',
      includes: [{ title: 'Flexible scheduling', Icon: CalendarCheck }, { title: 'Careful handling', Icon: Package }, { title: 'Vetted providers', Icon: ShieldCheck }, { title: 'Local crews', Icon: Truck }],
    }}
    features={{ title: 'We lift. You relax.', items: approaches }}
    serviceArea={{ titleStart: 'Out with the old mattress.', titleAccent: 'In with a little more room.' }}
  />;
};
