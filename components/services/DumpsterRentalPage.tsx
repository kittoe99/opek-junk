import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CalendarClock, MapPin, Ruler, ShieldCheck } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

export const DumpsterRentalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ServicePageLayout
      path="/services/dumpster-rental"
      eyebrow="Roll-Off Dumpster Rental"
      title={
        <>
          Dumpster
          <br />
          Rental
        </>
      }
      subtitle="Roll-off containers delivered to your home or job site. Multiple sizes, flat-rate pricing, and prompt drop-off and pickup."
      heroImage="/opek-related-dumpster.png?v=1"
      heroImageAlt="Roll-off dumpster ready for rental"
      heroChip="Flat-Rate Drop-Off"
      primaryCta={{ label: 'Rent a Dumpster', onClick: () => navigate('/quote') }}
      secondaryCta={{ label: 'Book Online', onClick: () => navigate('/booking') }}
      split={{
        eyebrow: 'Dumpster rental',
        title: 'Need a dumpster on site?',
        body: (
          <p>
            Perfect for renovations, construction debris, yard waste, and whole-house decluttering.
            Prefer full-service hauling instead? Book{' '}
            <Link to="/services/junk-removal" className="text-brand hover:text-brand-400 font-semibold">
              junk removal
            </Link>{' '}
            and leave the loading to your crew.
          </p>
        ),
        includesLabel: 'Rentals include:',
        includes: [
          { title: 'Size Options', Icon: Ruler },
          { title: 'Site Delivery', Icon: MapPin },
          { title: 'Flexible Dates', Icon: CalendarClock },
          { title: 'Insured Pros', Icon: ShieldCheck },
        ],
        image: '/opek-related-dumpster.png?v=1',
        imageAlt: 'Roll-off dumpster for debris and renovation waste',
      }}
      features={{
        title: 'Dumpster rental, simplified',
        items: [
          {
            title: 'Choose Your Size',
            body: '10, 15, 20, and 30-yard roll-offs for garage clearouts to full construction loads.',
          },
          {
            title: 'Upfront Flat Rates',
            body: 'Know your rental price before you book — no surprise tonnage games.',
          },
          {
            title: 'On-Schedule Drop-Off',
            body: 'Containers delivered and picked up on your timeline, including job-site placements.',
          },
          {
            title: 'Home & Commercial',
            body: 'From driveway yard waste to contractor debris — sized for residential and commercial use.',
          },
          {
            title: 'Protective Placement',
            body: 'Providers take care with driveways and placements whenever site conditions allow.',
          },
          {
            title: 'Need Loading Help?',
            body: 'Pair with junk removal or property cleanouts if you want the heavy lifting handled too.',
          },
        ],
      }}
      serviceArea={{
        titleStart: 'Clear your site.',
        titleAccent: 'Rent a roll-off dumpster.',
      }}
    />
  );
};
