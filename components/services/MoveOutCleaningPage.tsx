import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServicePageLayout } from '../shared/ServicePageLayout';

const ESTIMATE_PATH = '/in-home-estimate';
const ESTIMATE_STATE = { serviceType: 'Move-Out Cleaning' };

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
      content={{
        title: 'Move-out cleaning for renters, owners and landlords',
        body: (
          <>
            <p>
              Local providers clean kitchens, bathrooms, floors and surfaces once the home is empty, so it&apos;s ready
              for your landlord, a buyer or the next tenant. Book around your move-out date or lease end. Availability
              varies by location.
            </p>
            <p>
              <Link to={ESTIMATE_PATH} state={ESTIMATE_STATE}>Request a free estimate</Link>. Still have furniture or
              junk left behind? Book a <Link to="/services/property-cleanout">property cleanout</Link> first. Need help
              with the heavy lifting? Add <Link to="/services/moving-labor">moving labor</Link>.
            </p>
          </>
        ),
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
