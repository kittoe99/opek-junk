import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceFeatureGrid } from './shared/ServiceFeatureGrid';

const approaches = [
  {
    title: 'Easy Booking',
    body: 'The convenient and modern way to book junk disposal online in your city.',
  },
  {
    title: 'Upfront Pricing',
    body: 'Get a real-time upfront price when you book removal of junk online, guaranteed!',
  },
  {
    title: 'Same Day Pickup',
    body: 'We offer next-day or same-day junk pickup when you book before noon in most areas.',
  },
  {
    title: '100% Transparent',
    body: 'Affordable and honest junk haul away services from start to finish. No surprises!',
  },
  {
    title: 'Order Tracking',
    body: 'Check your order status, obtain an ETA, contact your provider, or reschedule with ease.',
  },
  {
    title: 'Thoughtful Disposal',
    body: (
      <>
        Industry leaders in sustainable disposal solutions including{' '}
        <Link to="/services/junk-removal" className="text-brand hover:text-brand-400 font-semibold transition-colors">
          donation pickups
        </Link>
        .
      </>
    ),
  },
];

export const OpekApproach: React.FC = () => {
  return <ServiceFeatureGrid items={approaches} />;
};
