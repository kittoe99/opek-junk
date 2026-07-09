import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JunkIcon, MovingLaborIcon, DumpsterIcon } from '../../icons/ServiceIcons';
import { JUNK_REMOVAL_MIN_PRICE } from '../../../lib/junkRemovalPricing';
import { FlowSelectionCard } from './FlowSelectionCard';
import { FlowStepTitle } from './FlowStepTitle';
import { FlowStickyNav } from './FlowStickyNav';

export type ServicePickerId = 'junk_removal' | 'moving_labor' | 'dumpster_rental';

interface ServiceTypePickerProps {
  title?: React.ReactNode;
  subtitle?: string;
  selectedId?: ServicePickerId | null;
  onSelect: (id: ServicePickerId) => void;
  onBack?: () => void;
  showBack?: boolean;
  quoteLinkLabel?: string;
}

const MOVING_LABOR_FROM = 298; // 2 helpers × 2 hr minimum @ $149/hr

// Match the homepage service grid icon treatment (single-tone blue)
const HERO_ICON_CLASS =
  'w-full h-full text-[#5b7fd4] [&_svg]:stroke-[#5b7fd4] [&_.stroke-brand]:stroke-[#5b7fd4]';

export const ServiceTypePicker: React.FC<ServiceTypePickerProps> = ({
  title = 'What do you need help with?',
  subtitle = 'Choose a service to get started.',
  selectedId = null,
  onSelect,
  onBack,
  showBack = true,
  quoteLinkLabel,
}) => (
  <>
    <FlowStepTitle title={title} subtitle={subtitle} />

    <div className="space-y-3">
      <FlowSelectionCard
        title="Junk Removal"
        description="Haul away furniture, debris, and unwanted clutter"
        fromPrice={`From $${JUNK_REMOVAL_MIN_PRICE}`}
        icon={<JunkIcon className={HERO_ICON_CLASS} />}
        selected={selectedId === 'junk_removal'}
        onClick={() => onSelect('junk_removal')}
      />
      <FlowSelectionCard
        title="Moving Labor"
        description="Hourly help for loading, unloading, and heavy lifting"
        fromPrice={`From $${MOVING_LABOR_FROM}`}
        icon={<MovingLaborIcon className={HERO_ICON_CLASS} />}
        selected={selectedId === 'moving_labor'}
        onClick={() => onSelect('moving_labor')}
      />
      <FlowSelectionCard
        title="Dumpster Rental"
        description="Roll-off container delivered to your site"
        fromPrice="From $350"
        icon={<DumpsterIcon className={HERO_ICON_CLASS} />}
        disabled
        badge="Coming Soon"
      />
    </div>

    {quoteLinkLabel && (
      <p className="mt-8 text-center text-sm text-secondary-500 flex items-center justify-center gap-1.5">
        <Search size={14} className="text-secondary-400" />
        <Link to="/quote" className="text-secondary hover:text-brand font-medium transition-colors">
          {quoteLinkLabel}
        </Link>
      </p>
    )}

    {showBack && onBack && <FlowStickyNav showBack onBack={onBack} showContinue={false} />}
  </>
);
