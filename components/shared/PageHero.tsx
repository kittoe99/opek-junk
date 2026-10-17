import React from 'react';
import { ServicePageHero, ServicePageHeroProps } from './ServicePageHero';
interface PageHeroProps extends ServicePageHeroProps {
  compact?: boolean;
  imageCaption?: string;
  EyebrowIcon?: React.ComponentType<{ size?: number; className?: string }>;
}
export const PageHero: React.FC<PageHeroProps> = (props) => <ServicePageHero {...props} />;
