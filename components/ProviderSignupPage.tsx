import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeHowItWorks } from './home/HomeSections';
import { HomeEditorialContent } from './home/HomePagePatterns';
import { ServicePageHero } from './shared/ServicePageHero';

const APPLICATION_PATH = '/provider-signup/apply';

const PROVIDER_POINTS = [
  { title: 'Local demand', body: 'Jobs routed to the metros you choose to serve.' },
  { title: 'Your hours', body: 'Pick part-time volume or fill your route.' },
  { title: 'Vetted network', body: 'Onboard with clear standards and dispatch support.' },
];

/** The contractor pitch page; the application itself lives at APPLICATION_PATH. */
export const ProviderSignupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="site-page home-light interior-home min-h-screen bg-[var(--bg)]">
      <ServicePageHero rating={false}
        eyebrow="Provider network"
        title={<>Hauling work.<br />On your terms.</>}
        subtitle="Join independent contractors getting local junk removal jobs through Opek’s dispatch network."
        image="/optimized/service-scenes/local-movers-card-v5.webp"
        imageAlt="Two Opek providers ready for a hauling job"
        photoLine="Local jobs. Weekly payouts."
        primaryCta={{ label: 'Start application', onClick: () => navigate(APPLICATION_PATH) }}
        secondaryCta={{ label: 'Questions? Call us', href: 'tel:+18777574365' }}
      />
      <HomeHowItWorks title="Your truck. Your hours. Your next job." description="Build your local hauling business with Opek." items={[
        { title: 'Tell us about yourself', body: 'Share your business details and choose the metros you want to serve.', image: '/optimized/service-scenes/scheduling-natural.webp', alt: 'Phone for managing pickup schedules' },
        { title: 'Show us your setup', body: 'Add your vehicle details and required documents so we can review your application.', image: '/optimized/service-scenes/moving-help-natural.webp', alt: 'A local hauling crew and truck' },
        { title: 'Get ready for local work', body: 'Once approved, finish setting up your contractor account and access the driver app.', image: '/optimized/service-scenes/junk-removal-natural.webp', alt: 'Two local providers carrying an armchair to a truck' },
      ]} />
      <HomeEditorialContent title="Work that fits your life" chapters={[
        { title: 'A network behind you', body: 'Independent providers run their own operations, with dispatch support and weekly payouts.', action: { label: 'Apply now', to: APPLICATION_PATH }, points: PROVIDER_POINTS },
      ]} />
    </div>
  );
};
