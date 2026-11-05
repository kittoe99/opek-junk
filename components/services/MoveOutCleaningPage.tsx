import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bath, Brush, CookingPot, SprayCan } from 'lucide-react';
import { ServicePageLayout } from '../shared/ServicePageLayout';

const ESTIMATE_PATH = '/in-home-estimate';
const ESTIMATE_STATE = { serviceType: 'Move-Out Cleaning' };

const linkClass = 'text-brand hover:text-brand-400 font-semibold';

export const MoveOutCleaningPage: React.FC = () => {
  const navigate = useNavigate();
  const goToEstimate = () => navigate(ESTIMATE_PATH, { state: ESTIMATE_STATE });

  return (
    <ServicePageLayout
      path="/services/move-out-cleaning"
      eyebrow="Move-Out Cleaning"
      title="Move-Out Cleaning"
      subtitle="Moving out or relocating? Local providers clean the place after the move, so you can hand over the keys and focus on what’s next."
      heroImage="/optimized/service-scenes/move-out-cleaning-card-v3.webp"
      heroImageAlt="Cleaners wiping cabinets and mopping an empty apartment"
      primaryCta={{ label: 'Get a Free Estimate', onClick: goToEstimate }}
      onZipCheck={goToEstimate}
      bookingPath={ESTIMATE_PATH}
      bookingState={ESTIMATE_STATE}
      processTitle="Moving out? Three easy steps."
      processDescription="Request your free move-out cleaning estimate online."
      processSteps={[
        {
          title: 'Request an estimate',
          body: 'Tell us where you’re moving out of. A local provider walks through the space and gives you a price.',
          image: '/optimized/service-scenes/estimate-natural.webp',
          alt: 'Worker taking notes while a customer shows an empty kitchen',
        },
        {
          title: 'Choose a time',
          body: 'Pick a date that works around your move. We confirm your visit within 24 hours.',
          image: '/optimized/service-scenes/scheduling-natural.webp',
          alt: 'Hand holding a phone with appointment time choices',
        },
        {
          title: 'Move out. We clean.',
          body: 'Your provider cleans once the place is empty, so it’s ready for the landlord, buyer or next tenant.',
          image: '/optimized/service-scenes/move-out-cleaning-card-v3.webp',
          alt: 'Cleaners wiping cabinets and mopping an empty apartment',
        },
      ]}
      split={{
        eyebrow: 'After-move cleaning',
        title: 'A clean handoff after your move',
        body: (
          <p>
            For renters, homeowners, landlords and property managers. Still have furniture or junk left
            behind? Book a{' '}
            <Link to="/services/property-cleanout" className={linkClass}>
              property cleanout
            </Link>{' '}
            first. Still packing up? We can help with{' '}
            <Link to="/services/small-local-moves" className={linkClass}>
              small local moves
            </Link>{' '}
            too.
          </p>
        ),
        includesLabel: 'Move-out cleaning includes:',
        includes: [
          { title: 'Kitchens', Icon: CookingPot },
          { title: 'Bathrooms', Icon: Bath },
          { title: 'Floors', Icon: Brush },
          { title: 'Surfaces', Icon: SprayCan },
        ],
        image: '/optimized/service-scenes/move-out-cleaning-card-v3.webp',
        imageAlt: 'Cleaners wiping cabinets and mopping an empty apartment',
      }}
      features={{
        title: 'Move-out cleaning, handled',
        items: [
          {
            title: 'Timed Around Your Move',
            body: 'Request a date that fits your move-out or lease end, and we’ll confirm your visit.',
          },
          {
            title: 'Free Estimate',
            body: 'A no-obligation visit: your provider walks through the space and gives you a price.',
          },
          {
            title: 'Room-by-Room Clean',
            body: 'Kitchens, bathrooms, floors and surfaces, cleaned once the home is empty.',
          },
          {
            title: 'Renters & Owners',
            body: 'For tenants handing back keys, sellers getting ready for new owners, and landlords between tenants.',
          },
          {
            title: 'Vetted Local Providers',
            body: 'Your clean is handled by an independent local provider. Availability varies by location.',
          },
          {
            title: 'Clearing Out First?',
            body: 'Pair your clean with a property cleanout or a small local move to get the whole move-out done.',
          },
        ],
      }}
      serviceArea={{
        titleStart: 'Moving out?',
        titleAccent: 'Leave it clean.',
        subtitle: 'Enter your ZIP to confirm coverage, then request your free estimate.',
        showSameDay: false,
      }}
    />
  );
};
