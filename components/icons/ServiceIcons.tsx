import React from 'react';

export const JunkIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 8h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4v8M9 7l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DumpsterIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 6h18l-1.5 11H4.5L3 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 6h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 6v11M12 6v11M16 6v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="17" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const PropertyCleanoutIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 6l1.5-1.5M18 10l1.5-1.5M15 3.5v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MovingLaborIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 21h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 21V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="19" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 15h6v6H5z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10h5v5H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PhotoEstimateIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8l2-2h4l2 2h8v12H4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="14" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M19 4l-1.5 1.5M21 6.5h-2.5M16.5 6L18 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ManualEntryIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 5H5v14h14v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 3v6M13 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LoadingIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 19h16v-8H4v8zM4 11l8-4 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11v5M9 14l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UnloadingIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 19h16v-8H4v8zM4 11l8-4 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16v-5M9 13l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LoadingUnloadingIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 19h16v-8H4v8zM4 11l8-4 8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 16v-4l-2 2M14 12v4l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const StorageUnitIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 21h18V5H3v16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 21v-8h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 17h8M8 13h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="15" r="0.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const BoxTruckIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 6h12v11H3zM15 9h4l2 3v5h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const InsideHomeIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 10l8-7 8 7v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22v-8h6v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const OtherMoveIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 14h6v6H3v-6zM15 14h6v6h-6v-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 6h6v6H9V6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 16h.01M18 16h.01M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const TwoHelpersIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 20c0-3 2-5 5-5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 20c0-2 1-4 4-4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ThreeHelpersIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="6" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="18" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 20c0-2.5 1.5-4 4-4h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 20c0-2 1.5-3.5 3.5-3.5h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 20c0-2.5 1.5-4 4-4h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PopularItemsIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.5 3A4.5 4.5 0 0 1 21 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const FurnitureIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14v4M20 14v4M3 10h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BeddingIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 10v9M21 10v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 14h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7v3M16 7v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AppliancesIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 4h12v16H6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="15" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 7h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ElectronicsIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 5h18v11H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const YardOutdoorIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 21v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 3L6 10h3l-4 5h14l-4-5h3l-6-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15l-3 2M12 10l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ConstructionIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14a8 8 0 0 1 16 0H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 6v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const GarageStorageIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 21h18V5H3v16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 21v-8h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 17h8M8 13h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const BaggedBoxedIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 4h12l2 4v12H4V8l2-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 8h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* Form Input Placeholder Icons */
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
    <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InputCalendarIcon = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2v4M8 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CameraCaptureIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8l2.2-2h4.1L12 4l1.7 2h4.1L20 8v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="13" r="1.25" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const UploadPhotoIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 4v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8.5 7.5L12 4l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CharityHeartIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6.2 5.5 5.5 0 0 1 21.5 12c-2.5 4.6-9.5 9-9.5 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 10v4M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ReceiptIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 3h10v18l-2-1.2L13 21l-2-1.2L9 21l-2-1.2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 8h4M10 12h4M10 16h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const NoReceiptIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 3h10v18l-2-1.2L13 21l-2-1.2L9 21l-2-1.2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CurbsideIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 17V11l3-2h5l3 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 17v-3h5v3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const GaragePorchIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 20V9l8-5 8 5v11" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 20v-7h8v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const StairsAccessIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 20h5v-4h4v-4h4V8h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M14 8l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const GroundFloorIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 10l8-6 8 6v10H4V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const DumpsterSizeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 7h16l-1.4 11H5.4L4 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 10v5M12 10v5M15 10v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="19.5" r="1.2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="17" cy="19.5" r="1.2" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

export const BringTruckIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 7h11v9H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M13 10h4l3 3v3h-7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="6.5" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="16.5" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const OwnTruckIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 10l8-6 8 6v10H4V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 8.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const RearrangeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="4" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="13" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 7h4M16 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 16h4M8 14v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const StudioHomeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 11l8-7 8 7v9H4v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const MultiHomeIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 20V8l6-4 6 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M15 20V11l4-2.5L23 11v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 20v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export const EstimateReadyIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ElevatorIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8.5 10l1.5-1.5L11.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 14l1.5 1.5L15.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PackingHelpIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8h16v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 8l2.5-4h11L20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const DisassemblyIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.5 4.5l5 5-8.5 8.5H6v-5L14.5 4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12.5 6.5l5 5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 20h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const PianoIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 7h16v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M4 12h16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12v5M12 12v5M16 12v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const GymEquipmentIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 9v6M7 7v10M20 9v6M17 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const SafeVaultIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 12.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PoolTableIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="7" width="18" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="16" cy="12" r="1.2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6 17v2M18 17v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const HotTubIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14h16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 10c1 1.5 2 1.5 3 0s2-1.5 3 0 2 1.5 3 0 2-1.5 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const OneHelperIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 20c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
