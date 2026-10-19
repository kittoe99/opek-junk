import React from 'react';

type IconProps = { className?: string; size?: number };

/** Opek service illustrations: a shared 48-unit grid, rounded ink, and a quiet second tone. */
export const Illustration = ({ className, size = 24, children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"
    className={className} aria-hidden="true" focusable="false">{children}</svg>
);
export const Tint = ({ d }: { d: string }) => <path d={d} fill="currentColor" fillOpacity=".14" stroke="none" />;
const Box = ({ x = 7, y = 22, s = 16 }: { x?: number; y?: number; s?: number }) => (
  <g><rect x={x} y={y} width={s} height={s} rx="2" fill="currentColor" fillOpacity=".12" />
    <path d={`M${x + s / 2} ${y}v${s / 3}m-3 0h6`} /></g>
);
const Truck = () => <g>
  <Tint d="M6 9h24v23H6zM30 18h8l6 8v6H30z" />
  <path d="M6 29V9h24v23H18M30 18h8l6 8v6h-4M30 32h2M35 21v5h8" />
  <circle cx="13" cy="32" r="4" fill="currentColor" fillOpacity=".2" />
  <circle cx="36" cy="32" r="4" fill="currentColor" fillOpacity=".2" />
  <path d="M14 15l-2 8m8-8-2 8" strokeWidth="3" />
</g>;
const Sofa = () => <g>
  <Tint d="M10 26V16a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v10zM6 25h7v6h22v-6h7v13H6z" />
  <path d="M10 25v-9a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v9M24 14v15" />
  <path d="M6 25h7v6h22v-6h7v13H6zM10 38v4m28-4v4" />
</g>;
const House = () => <g><Tint d="M7 21 24 7l17 14v21H7z" />
  <path d="M4 22 24 6l20 16M8 19v23h32V19M20 42V29h9v13" />
  <rect x="14" y="21" width="6" height="6" rx="1" /></g>;
const Garage = () => <g><Tint d="M6 18 24 6l18 12v24H6z" />
  <path d="M3 19 24 5l21 14M7 18v24h34V18M13 42V23h22v19M13 29h22M13 35h22" /></g>;
const Person = ({ x = 24 }: { x?: number }) => <g>
  <circle cx={x} cy="14" r="5" fill="currentColor" fillOpacity=".15" />
  <path d={`M${x - 7} 13h14M${x - 9} 40V29q0-7 9-7t9 7v11z`} fill="currentColor" fillOpacity=".12" />
  <path d={`M${x - 4} 40V30m8 10V30m-6-4-1 4m5-4-1 4`} /></g>;
const Receipt = () => <g><Tint d="M12 5h24v38l-6-3-6 3-6-3-6 3z" />
  <path d="M12 5h24v38l-6-3-6 3-6-3-6 3zM18 13h12M18 19h8" /></g>;
const Camera = () => <g><Tint d="M5 14h9l3-5h14l3 5h9v25H5z" />
  <path d="M5 14h9l3-5h14l3 5h9v25H5z" />
  <circle cx="24" cy="26" r="9" /><circle cx="24" cy="26" r="4" fill="currentColor" fillOpacity=".16" />
  <path d="M36 19h2" /></g>;
const Bin = () => <g><Tint d="M5 16h38l-5 22H10z" />
  <path d="M3 16h42M5 16l5 22h28l5-22M14 22l2 10m8-10v10m10-10-2 10M9 41h5m20 0h5" /></g>;
const defineIcon = (art: React.ReactNode) => (props: IconProps) => <Illustration {...props}>{art}</Illustration>;

export const LoadingUnloadingIcon = defineIcon(<><Truck /><path d="M7 42h34m-4-4 4 4-4 4M11 38l-4 4 4 4" /></>);
export const LoadingIcon = defineIcon(<><Truck /><path d="M7 42h30m-5-4 5 4-5 4" /></>);
export const UnloadingIcon = defineIcon(<><Truck /><path d="M11 42h30m-25-4-5 4 5 4" /></>);
export const RearrangeIcon = defineIcon(<><g transform="translate(0 3) scale(1 .85)"><Sofa /></g><path d="M9 8h26l-4-4m4 4-4 4M39 43H13l4-4m-4 4 4 4" /></>);
export const BoxTruckIcon = defineIcon(<Truck />);
export const BringTruckIcon = defineIcon(<><Truck /><path d="M6 42h20m-4-4 4 4-4 4" /></>);
export const OwnTruckIcon = defineIcon(<><g transform="translate(0 -3)"><Truck /></g><circle cx="30" cy="41" r="4" /><path d="M26 41H13v4m5-4v3" /></>);
export const MovingLaborIcon = defineIcon(<><path d="M28 6h7v31H12M35 32h7" /><Box x={8} y={18} s={20} /><circle cx="35" cy="40" r="5" fill="currentColor" fillOpacity=".2" /><path d="M9 43h15" /></>);
export const JunkIcon = defineIcon(<><g transform="translate(0 7) scale(.7)"><Sofa /></g><Box x={29} y={19} s={14} /><path d="M29 12h13m-4-4 4 4-4 4M5 43h38" /></>);
export const DumpsterIcon = defineIcon(<><Bin /><path d="M9 13V8h12v5m4 0 4-7 10 7" /></>);
export const DumpsterSizeIcon = defineIcon(<><Bin /><path d="M7 7h34m-30-3-4 3 4 3m26-6 4 3-4 3" /></>);
export const PropertyCleanoutIcon = defineIcon(<><g transform="translate(0 -2) scale(.85)"><House /></g><Box x={29} y={27} s={15} /><path d="M5 43h20m-4-4 4 4-4 4" /></>);
export const InsideHomeIcon = defineIcon(<House />);
export const StudioHomeIcon = defineIcon(<><House /><path d="M32 22h3v5h-3" /></>);
export const MultiHomeIcon = defineIcon(<><Tint d="M5 12h23v30H5zM28 20h14v22H28z" /><path d="M5 42V12l12-7 11 7v30M28 20h14v22H5M13 42V32h7v10M11 17h3v5h-3zm9 0h3v5h-3zM33 26h4m-4 7h4" /></>);
export const StorageUnitIcon = defineIcon(<><Garage /><path d="M22 36h4" /></>);
export const GarageStorageIcon = defineIcon(<><g transform="translate(0 -3) scale(.85)"><Garage /></g><Box x={26} y={27} s={17} /></>);
export const GaragePorchIcon = defineIcon(<><Garage /><path d="M22 39h4" /></>);
export const GroundFloorIcon = defineIcon(<><g transform="translate(0 -2) scale(.85)"><House /></g><path d="M4 43h40M29 33h15m-4-4 4 4-4 4" /></>);
export const CurbsideIcon = defineIcon(<><Box x={7} y={13} s={18} /><Box x={27} y={21} s={12} /><path d="M3 34h42M3 39h42M8 45h7m10 0h7" /></>);
export const StairsAccessIcon = defineIcon(<><Tint d="M6 40h10V30h10V20h10V10h7v33H6z" /><path d="M5 40h11V30h10V20h10V10h7M7 26 25 8m-10 0h10v10" /></>);
export const ElevatorIcon = defineIcon(<><Tint d="M9 14h30v29H9z" /><path d="M7 43V14h34v29H7M24 14v29M12 8l5-5 5 5m5-5 5 5 5-5M19 25v6m10-6v6" /></>);
export const OneHelperIcon = defineIcon(<Person />);
export const TwoHelpersIcon = defineIcon(<><g transform="translate(0 3) scale(.8)"><Person x={17} /><Person x={43} /></g></>);
export const ThreeHelpersIcon = defineIcon(<><g transform="translate(2 7) scale(.65)"><Person x={10} /><Person x={34} /><Person x={58} /></g></>);
export const PackingHelpIcon = defineIcon(<><Tint d="M9 19 24 26l15-7v21L24 46 9 40z" /><path d="m9 19 15 7 15-7-15-7zM9 19v21l15 6 15-6V19M24 26v20M9 19 3 12l15-7 6 7 6-7 15 7-6 7" /></>);
export const DisassemblyIcon = defineIcon(<><Tint d="M7 9h25v8H7z" /><path d="M7 9h25v8H7zM11 17v13m17-13v8M6 36v7m6-4v4" /><path d="M38 23a7 7 0 0 0-9 9L18 43l-4-4 11-11a7 7 0 0 1 9-9l-4 4 4 4z" fill="currentColor" fillOpacity=".15" /></>);
export const PianoIcon = defineIcon(<><Tint d="M7 8h34v24H7z" /><path d="M7 8h34v30H7zM7 25h34M7 32h34M11 38v6m26-6v6M14 25v7m7-7v7m7-7v7m7-7v7" /><path d="M17 26v3m14-3v3" strokeWidth="3" /></>);
export const GymEquipmentIcon = defineIcon(<><Tint d="M6 34h26l9 7H6z" /><path d="M6 34h26l9 7H6zM30 34 23 8h13M21 8h-6M25 17h12M9 44h2m24 0h2" /><rect x="26" y="5" width="11" height="8" rx="2" fill="currentColor" fillOpacity=".12" /></>);
export const SafeVaultIcon = defineIcon(<><rect x="8" y="5" width="32" height="37" rx="4" fill="currentColor" fillOpacity=".12" /><rect x="13" y="10" width="22" height="26" rx="2" /><circle cx="24" cy="23" r="6" /><path d="M24 17v12m-6-6h12M12 42v3m24-3v3M8 14h5m-5 17h5" /></>);
export const PoolTableIcon = defineIcon(<><Tint d="m4 19 8-9h24l8 9v14H4z" /><path d="m4 19 8-9h24l8 9v14H4zM4 25h40M9 33v10m30-10v10M12 10l-2 5m26-5 2 5" /><circle cx="20" cy="18" r="2" fill="currentColor" /><path d="m26 21 9-6" /></>);
export const HotTubIcon = defineIcon(<><Tint d="M5 23h38v14q0 5-5 5H10q-5 0-5-5z" /><path d="M5 23h38v14q0 5-5 5H10q-5 0-5-5zM5 29h38M13 35v7m11-7v7m11-7v7M13 17c-6-5 6-6 0-12m11 12c-6-5 6-6 0-12m11 12c-6-5 6-6 0-12" /></>);
export const FurnitureIcon = defineIcon(<Sofa />);
export const BeddingIcon = defineIcon(<><Tint d="M5 23h38v14H5zM8 10h32v13H8z" /><path d="M5 21v21m38-21v21M5 28h38v9H5M8 28V10h32v18" /><rect x="12" y="16" width="10" height="7" rx="2" /><rect x="26" y="16" width="10" height="7" rx="2" /></>);
export const AppliancesIcon = defineIcon(<><rect x="10" y="5" width="28" height="38" rx="3" fill="currentColor" fillOpacity=".12" /><path d="M10 15h28M15 10h1m5 0h1" /><circle cx="24" cy="28" r="9" /><path d="M19 30q5 5 10-2" /></>);
export const ElectronicsIcon = defineIcon(<><rect x="4" y="8" width="40" height="27" rx="3" fill="currentColor" fillOpacity=".12" /><path d="M19 35v7m10-7v7M13 42h22M10 14h10m-10 5h5" /></>);
export const YardOutdoorIcon = defineIcon(<><Tint d="M24 29C5 31 5 19 7 9c14 0 21 5 17 20M25 32c-2-16 6-22 17-21 1 13-2 21-17 21" /><path d="M24 29C5 31 5 19 7 9c14 0 21 5 17 20M25 32c-2-16 6-22 17-21 1 13-2 21-17 21M14 17l10 13v13m1-10 10-14M17 43h14" /></>);
export const ConstructionIcon = defineIcon(<><Tint d="M5 27h38v15H5zM12 12h24v15H12z" /><path d="M5 27h38v15H5zM12 12h24v15H12zM24 12v15M17 27v15m14-15v15M5 35h38" /></>);
export const BaggedBoxedIcon = defineIcon(<><Tint d="M10 17 7 11h12l-3 6q12 18 4 24H6q-7-6 4-24" /><path d="m10 17-3-6h12l-3 6M9 18h8M10 19Q-2 39 7 41h14" /><Box x={25} y={22} s={18} /></>);
export const OtherMoveIcon = defineIcon(<><Box x={5} y={24} s={18} /><Box x={26} y={27} s={15} /><Box x={14} y={7} s={14} /></>);
export const PopularItemsIcon = defineIcon(<><Tint d="m24 4 6 13 14 2-10 10 2 15-12-7-12 7 2-15L4 19l14-2z" /><path d="m24 4 6 13 14 2-10 10 2 15-12-7-12 7 2-15L4 19l14-2z" /></>);
export const PhotoEstimateIcon = defineIcon(<Camera />);
export const CameraCaptureIcon = defineIcon(<Camera />);
export const UploadPhotoIcon = defineIcon(<><rect x="6" y="10" width="36" height="31" rx="3" fill="currentColor" fillOpacity=".12" /><path d="m7 35 10-11 9 8 6-5 9 8M25 12V3m-5 5 5-5 5 5" /><circle cx="15" cy="18" r="3" /></>);
export const ManualEntryIcon = defineIcon(<><Receipt /><path d="M18 28h12m-12 6h7M24 3v5" /></>);
export const ReceiptIcon = defineIcon(<><Receipt /><path d="m18 29 4 4 9-9" /></>);
export const NoReceiptIcon = defineIcon(<><Receipt /><path d="m19 26 10 10m0-10L19 36" /></>);
export const CharityHeartIcon = defineIcon(<><path d="M24 25 12 13C4 3 20 0 24 10 28 0 44 3 36 13z" fill="currentColor" fillOpacity=".15" /><path d="m4 34 8-6h11q6 0 6 6H18m11 0 9-6q6-2 6 4L31 43H13l-9-5" /></>);
export const EstimateReadyIcon = defineIcon(<><Receipt /><circle cx="33" cy="32" r="11" fill="white" /><path d="m27 32 4 4 6-7" /></>);

