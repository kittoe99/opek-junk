import React from 'react';






export const InputUserIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InputMailIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const InputPhoneIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.05 2a9 9 0 0 1 8 7.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.05 6A5 5 0 0 1 18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InputMapPinIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InputBuildingIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 22h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10h4M10 14h4M10 6h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InputMessageIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const InputZipIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Nationwide coverage arcs */}
    <path d="M3.75 17a9.5 9.5 0 0 1 16.5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.5 14.25a6.5 6.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Location pin */}
    <path d="M12 2.5c-2.75 0-5 2.2-5 4.9 0 3.4 5 8.85 5 8.85s5-5.45 5-8.85c0-2.7-2.25-4.9-5-4.9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="7.4" r="1.6" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

/** Large static icon for Instant coverage check / ZIP finder panels */
export const CoverageCheckIcon = ({ className, size = 64 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
    {/* Static coverage rings */}
    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.25"/>
    <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
    <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.55"/>
    {/* Location pin */}
    <path
      d="M32 14c-5.1 0-9.25 4.05-9.25 9.05 0 6.35 9.25 16.7 9.25 16.7s9.25-10.35 9.25-16.7C41.25 18.05 37.1 14 32 14z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="23.1" r="3.1" stroke="currentColor" strokeWidth="2"/>
    {/* Ground mark */}
    <path d="M24 48.5h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

export const InputCalendarIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2v4M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Shared service artwork used by quote, booking, catalog categories, and service pages.
export {
  LoadingUnloadingIcon,
  LoadingIcon,
  UnloadingIcon,
  RearrangeIcon,
  BoxTruckIcon,
  BringTruckIcon,
  OwnTruckIcon,
  MovingLaborIcon,
  JunkIcon,
  DumpsterIcon,
  DumpsterSizeIcon,
  PropertyCleanoutIcon,
  InsideHomeIcon,
  StudioHomeIcon,
  MultiHomeIcon,
  StorageUnitIcon,
  GarageStorageIcon,
  GaragePorchIcon,
  GroundFloorIcon,
  CurbsideIcon,
  StairsAccessIcon,
  ElevatorIcon,
  OneHelperIcon,
  TwoHelpersIcon,
  ThreeHelpersIcon,
  PackingHelpIcon,
  DisassemblyIcon,
  PianoIcon,
  GymEquipmentIcon,
  SafeVaultIcon,
  PoolTableIcon,
  HotTubIcon,
  FurnitureIcon,
  BeddingIcon,
  AppliancesIcon,
  ElectronicsIcon,
  YardOutdoorIcon,
  ConstructionIcon,
  BaggedBoxedIcon,
  OtherMoveIcon,
  PopularItemsIcon,
  PhotoEstimateIcon,
  CameraCaptureIcon,
  UploadPhotoIcon,
  ManualEntryIcon,
  ReceiptIcon,
  NoReceiptIcon,
  CharityHeartIcon,
  EstimateReadyIcon,
} from './ServiceIllustrations';
