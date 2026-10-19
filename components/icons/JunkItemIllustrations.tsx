import React from 'react';
import {
  Illustration, Tint, FurnitureIcon, AppliancesIcon, PianoIcon as ServicePiano,
  PoolTableIcon, HotTubIcon as ServiceHotTub, GymEquipmentIcon, SafeVaultIcon,
} from './ServiceIllustrations';

type IconProps = { className?: string; size?: number };
const defineIcon = (art: React.ReactNode) => (props: IconProps) => <Illustration {...props}>{art}</Illustration>;
const Panel = ({ x, y, w, h, rx = 2 }: { x: number; y: number; w: number; h: number; rx?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={rx} fill="currentColor" fillOpacity=".14" />
);
const Carton = ({ x = 6, y = 20, s = 18 }: { x?: number; y?: number; s?: number }) => <g>
  <Panel x={x} y={y} w={s} h={s} /><path d={`M${x + s / 2} ${y}v${s / 3}m-3 0h6`} />
</g>;

// Same 48-unit grid, two-unit rounded strokes and 14% purple tint as the heavy-item icons.
export const SofaIcon = FurnitureIcon;
export const WasherIcon = AppliancesIcon;
export const PianoIcon = ServicePiano;
export const GameTableIcon = PoolTableIcon;
export const HotTubIcon = ServiceHotTub;
export const TreadmillIcon = GymEquipmentIcon;
export const SafeIcon = SafeVaultIcon;

export const MattressIcon = defineIcon(<><Tint d="m6 24 9-14h24l4 14v12H6z" /><path d="m6 24 9-14h24l4 14v12H6zM6 24h37M13 29h3m6 0h3m6 0h3M18 15l-2 4m10-4v4m9-4 1 4" /></>);
export const BoxSpringIcon = defineIcon(<><Panel x={5} y={18} w={38} h={19} /><path d="M5 24h38M10 37v5m28-5v5M12 29l2 4 2-4m5 0 2 4 2-4m5 0 2 4 2-4" /></>);
export const DresserIcon = defineIcon(<><Panel x={9} y={6} w={30} h={35} /><path d="M9 17h30M9 29h30M24 6v23M14 41v4m20-4v4M15 12h3m12 0h3M15 23h3m12 0h3M21 35h6" /></>);
export const FridgeIcon = defineIcon(<><Panel x={12} y={4} w={24} h={39} rx={3} /><path d="M12 20h24M17 11v4m0 11v9M16 43v2m16-2v2" /></>);
export const TvIcon = defineIcon(<><Panel x={4} y={8} w={40} h={27} /><path d="M9 13h30v17H9zM15 35l-4 7m22-7 4 7M13 18l6-2m-6 7 12-4" /></>);
export const TrashBagsIcon = defineIcon(<><Tint d="m13 17-4-7h14l-4 7q12 18 5 24H8q-9-3 5-24M32 21l-3-6h11l-3 6q13 18 5 21H29" /><path d="m13 17-4-7h14l-4 7M12 18h8M13 20Q-1 40 9 42h14q10-3-4-22M32 21l-3-6h11l-3 6M31 22h7m-1 2q13 17 4 18h-9M13 30l-2 6m22-5 3 6" /></>);
export const JunkBoxesIcon = defineIcon(<><Carton x={5} y={24} s={19} /><Carton x={25} y={18} s={18} /><Carton x={10} y={5} s={16} /></>);
export const YardDebrisIcon = defineIcon(<><Tint d="M24 25C8 27 6 16 8 7c13 0 20 5 16 18M26 29c-2-13 5-18 15-18 1 11-3 18-15 18" /><path d="M24 25C8 27 6 16 8 7c13 0 20 5 16 18M26 29c-2-13 5-18 15-18 1 11-3 18-15 18M14 14l10 12v10m2-7 9-10M7 39l32 4M10 44l27-9m-26-1 9 6" /></>);
export const LoveseatIcon = defineIcon(<><Tint d="M13 26V15h22v11M9 25h6v7h18v-7h6v13H9z" /><path d="M13 25V15q0-3 3-3h16q3 0 3 3v10M24 13v17M9 25h6v7h18v-7h6v13H9zM13 38v4m22-4v4" /></>);
export const ChairIcon = defineIcon(<><Panel x={14} y={6} w={20} h={22} rx={3} /><Panel x={11} y={28} w={26} h={7} /><path d="M14 35v8m20-8v8M19 13h10M19 19h10" /></>);
export const ReclinerIcon = defineIcon(<><Tint d="M10 27 6 10l13-3 7 20h11v9H17l-7-9M17 36l-6 7H3l7-16" /><path d="M10 27 6 10l13-3 7 20h11v9H17l-7-9M17 36l-6 7H3l7-16M22 21h12v6m-6 9v7M37 31h5v7" /></>);
export const OttomanIcon = defineIcon(<><Panel x={7} y={18} w={34} h={20} rx={5} /><path d="M7 27h34M12 38v5m24-5v5M16 22h1m14 0h1" /></>);
export const TableIcon = defineIcon(<><Panel x={4} y={15} w={40} h={7} /><path d="M9 22v21m30-21v21M9 29h30M14 15V9h20v6" /></>);
export const TvStandIcon = defineIcon(<><Panel x={5} y={23} w={38} h={17} /><Panel x={11} y={5} w={26} h={14} /><path d="M24 19v4M18 23v17m12-17v17M9 40v4m30-4v4M10 31h3m22 0h3M22 30h4m-4 5h4" /></>);
export const BookshelfIcon = defineIcon(<><Panel x={9} y={5} w={30} h={38} /><path d="M9 18h30M9 31h30M14 10v8m5-8v8m9-9 3 9M14 23v8m6-8v8m12-8v8M15 36v7m7-7v7m8-7 3 7" /></>);
export const DeskIcon = defineIcon(<><Panel x={4} y={17} w={40} h={6} /><Panel x={29} y={23} w={12} h={19} /><path d="M8 23v19M29 32h12M33 27h4m-4 10h4M12 17V8h16v9" /></>);
export const CabinetIcon = defineIcon(<><Panel x={9} y={5} w={30} h={36} /><path d="M24 5v36M19 21v6m10-6v6M13 41v4m22-4v4" /></>);
export const NightstandIcon = defineIcon(<><Panel x={9} y={14} w={30} h={27} /><path d="M9 28h30M21 21h6m-6 14h6M13 41v4m22-4v4M7 14h34" /></>);
export const WardrobeIcon = defineIcon(<><Panel x={8} y={4} w={32} h={39} /><path d="M24 4v39M19 22v6m10-6v6M12 43v2m24-2v2M13 10h6m10 0h6" /></>);
export const PatioSetIcon = defineIcon(<><Tint d="M8 18 24 5l16 13zM15 29h18v5H15z" /><path d="M8 18 24 5l16 13zM24 5v24M15 29h18v5H15zM19 34v9m10-9v9M4 26v9h8m-8 0v8m8-8v8M44 26v9h-8m8 0v8m-8-8v8" /></>);
export const BedFrameIcon = defineIcon(<><Panel x={7} y={7} w={34} h={20} /><Panel x={4} y={27} w={40} h={10} /><path d="M4 24v19m40-19v19M12 14h10v9H12zM26 14h10v9H26z" /></>);
export const FutonIcon = defineIcon(<><Tint d="M8 11h30v18H8zM6 29h36v9H6z" /><path d="M8 29V11h30v18M6 29h36v9H6zM23 11v18M11 38l-4 6m30-6 4 6M3 25v13m42-13v13" /></>);
export const BunkBedIcon = defineIcon(<><Panel x={7} y={13} w={34} h={8} /><Panel x={7} y={31} w={34} h={8} /><path d="M7 5v39m34-39v39M29 13v31m8-31v31M29 25h8m-8 10h8M12 8h9v5h-9zM12 26h9v5h-9z" /></>);
export const CribIcon = defineIcon(<><Panel x={6} y={15} w={36} h={23} /><path d="M6 10v33m36-33v33M6 32h36M13 15v17m7-17v17m8-17v17m7-17v17M10 38v5m28-5v5" /></>);
export const DishwasherIcon = defineIcon(<><Panel x={10} y={5} w={28} h={38} /><path d="M10 15h28M15 10h9m7 0h1M15 23h18v14H15zM20 27v6m8-6v6" /></>);
export const OvenIcon = defineIcon(<><Panel x={8} y={11} w={32} h={32} /><Panel x={13} y={24} w={22} h={13} /><path d="M8 20h32M13 15h1m6 0h1m6 0h1m6 0h1M13 11V6h8v5m6 0V6h8v5M18 28h12" /></>);
export const MicrowaveIcon = defineIcon(<><Panel x={4} y={12} w={40} h={27} /><path d="M9 17h22v16H9zM36 19h3m-3 6h3m-3 6h3M9 39v3m30-3v3M13 27h13m-10-5h7" /></>);
export const AcUnitIcon = defineIcon(<><Panel x={4} y={10} w={40} h={23} rx={4} /><path d="M9 25h30M9 29h30M35 16h3M14 38v5m10-5v5m10-5v5" /></>);
export const WaterHeaterIcon = defineIcon(<><Panel x={12} y={9} w={24} h={32} rx={6} /><path d="M18 9V4m12 5V4M12 17h24M17 41v3m14-3v3" /><circle cx="24" cy="29" r="6" /><path d="m24 25-2 5h4" /></>);
export const VacuumIcon = defineIcon(<><Panel x={18} y={18} w={15} h={20} rx={5} /><Panel x={12} y={38} w={27} h={6} /><path d="M24 18V4h10v5M18 24q-9 0-9-9V8M23 24h5m-5 5h5" /></>);
export const ExerciseIcon = defineIcon(<><Panel x={8} y={14} w={7} h={20} /><Panel x={33} y={14} w={7} h={20} /><path d="M15 24h18M4 19v10m40-10v10M4 24h4m32 0h4" /></>);
export const ComputerIcon = defineIcon(<><Panel x={4} y={7} w={27} h={23} /><Panel x={35} y={8} w={9} h={32} /><path d="M9 12h17v13H9zM17 30v6m-8 0h16M4 42h27M38 14h3m-3 5h3m-3 15h3" /></>);
export const PrinterIcon = defineIcon(<><Panel x={5} y={17} w={38} h={22} /><Panel x={12} y={4} w={24} h={13} /><path d="M12 29h24v15H12zM18 34h12m-12 5h9M35 23h2" /></>);
export const SpeakersIcon = defineIcon(<><Panel x={5} y={7} w={16} h={35} /><Panel x={27} y={7} w={16} h={35} /><circle cx="13" cy="29" r="5" /><circle cx="35" cy="29" r="5" /><circle cx="13" cy="16" r="2" /><circle cx="35" cy="16" r="2" /></>);
export const GamingIcon = defineIcon(<><Tint d="M13 15h22q6 0 8 16t-9 5l-4-4H18l-4 4Q2 47 5 31t8-16" /><path d="M13 15h22q6 0 8 16t-9 5l-4-4H18l-4 4Q2 47 5 31t8-16M12 24h8m-4-4v8M24 15V6h7" /><circle cx="33" cy="22" r="1" fill="currentColor" /><circle cx="37" cy="26" r="1" fill="currentColor" /></>);
export const ElectronicsBoxIcon = defineIcon(<><Panel x={10} y={5} w={20} h={17} /><path d="M15 10h10v7H15zM35 12h7v15" /><Carton x={5} y={25} s={24} /><path d="M29 25h14v18H29M34 30h4m-4 5h4" /></>);
export const LawnMowerIcon = defineIcon(<><Panel x={8} y={29} w={33} h={10} /><Panel x={15} y={23} w={16} h={6} /><path d="M15 29 9 8H4M9 13h12l8 16" /><circle cx="13" cy="40" r="4" fill="currentColor" fillOpacity=".14" /><circle cx="36" cy="40" r="4" fill="currentColor" fillOpacity=".14" /></>);
export const GrillIcon = defineIcon(<><Tint d="M6 21h36q-1 14-18 14T6 21" /><path d="M6 21h36q-1 14-18 14T6 21M10 21q0-12 14-12t14 12M20 9V5h8v4M18 35l-5 9m17-9 4 7M15 40h17M24 15h1" /><circle cx="36" cy="42" r="3" /></>);
export const TrampolineIcon = defineIcon(<><ellipse cx="24" cy="29" rx="20" ry="7" fill="currentColor" fillOpacity=".14" /><path d="M4 29V9m40 20V9M4 9q20-9 40 0M14 6v19m20-19v19M8 34v9m32-9v9M15 35v6m18-6v6" /></>);
export const SwingSetIcon = defineIcon(<><Tint d="M17 28h14v6H17z" /><path d="M4 43 12 7l8 36M28 43l8-36 8 36M12 7h24M19 7v21m10-21v21M17 28h14v6H17zM8 28h9m14 0h9" /></>);
export const ShedIcon = defineIcon(<><Tint d="m6 18 18-13 18 13v25H6z" /><path d="M3 19 24 4l21 15M6 18v25h36V18M15 43V24h18v19M24 24v19m-4-9h1m6 0h1M20 16h8" /></>);
export const FencingIcon = defineIcon(<><Tint d="m7 10 5-5 5 5v33H7zM31 10l5-5 5 5v33H31z" /><path d="m7 10 5-5 5 5v33H7zM31 10l5-5 5 5v33H31zM17 17h14v6H17m0 9h14v6H17M3 17h4m34 0h4M3 35h4m34 0h4" /></>);
export const GardenToolsIcon = defineIcon(<><Tint d="M8 30h14v7q-7 12-14 0z" /><path d="M8 30h14v7q-7 12-14 0zM15 30V14M10 5h10v6q-5 6-10 0zM34 43V17M26 6v11h16V6M31 6v7m6-7v7" /></>);
export const FirewoodIcon = defineIcon(<><Tint d="m8 32 22-14 10 5-22 17zM7 19 25 7l12 5-18 12z" /><path d="m8 32 22-14 10 5-22 17M7 19 25 7l12 5-18 12M37 12v7M40 23v12L18 44" /><ellipse cx="13" cy="37" rx="7" ry="7" /><ellipse cx="13" cy="37" rx="2" ry="3" /><ellipse cx="12" cy="23" rx="7" ry="6" /></>);
export const DrywallIcon = defineIcon(<><Tint d="M8 10h25v30H8zM14 5h26v31h-7V10H14z" /><path d="M8 10h25v30H8zM14 10V5h26v31h-7M13 17h1m-1 16h1m13-16h1m-1 16h1M8 44h32" /></>);
export const LumberIcon = defineIcon(<><Tint d="m5 28 28-18 10 5v7L15 40 5 35z" /><path d="m5 28 28-18 10 5v7L15 40 5 35zM5 28l10 5 28-18M15 33v7M22 22l11-7M8 41l6 3 28-18" /></>);
export const CarpetIcon = defineIcon(<><Tint d="M11 8h25v25q0 9-7 9H12z" /><path d="M11 8h25v25q0 9-7 9H12M11 8v22M16 14h14m-14 5h14m-14 5h14" /><ellipse cx="12" cy="36" rx="7" ry="6" /><path d="M12 36q-3-4-4 0t6 3M19 36h16" /></>);
export const TileIcon = defineIcon(<><Panel x={6} y={6} w={16} h={16} /><Panel x={26} y={6} w={16} h={16} /><Panel x={6} y={26} w={16} h={16} /><Panel x={26} y={26} w={16} h={16} /><path d="m11 17 6-6m14 6 6-6M11 37l6-6m14 6 6-6" /></>);
export const ConcreteIcon = defineIcon(<><Panel x={4} y={27} w={40} h={14} /><Panel x={11} y={12} w={27} h={15} /><path d="M24 12v15M17 27v14m14-14v14M4 34h40M16 18h3m11 3h3M9 30h3" /></>);
export const RoofingIcon = defineIcon(<><Tint d="m5 39 12-29h26L31 39z" /><path d="m5 39 12-29h26L31 39zM9 29h26M13 19h26M24 10l-4 9m8 0-4 10m-5 0-4 10M10 43h25l9-23" /></>);
export const WindowsDoorsIcon = defineIcon(<><Panel x={4} y={7} w={19} h={27} /><Panel x={28} y={7} w={16} h={36} /><path d="M13 7v27M4 20h19M32 12h8v11h-8zM39 29h1M4 38h19" /></>);
export const CabinetsIcon = defineIcon(<><Panel x={5} y={6} w={38} h={15} /><Panel x={5} y={28} w={38} h={15} /><path d="M24 6v15m0 7v15M4 26h40M18 12v3m12-3v3m-12 19v3m12-3v3" /></>);
export const PlumbingIcon = defineIcon(<><Tint d="M6 22h36q0 12-18 12T6 22" /><path d="M6 22h36q0 12-18 12T6 22M24 22V9q0-7 7-5t7 9M16 18h5m-5-3v3M24 34v6q0 4 6 4h5" /></>);
export const PaintCansIcon = defineIcon(<><Panel x={5} y={17} w={23} h={25} /><ellipse cx="16.5" cy="17" rx="11.5" ry="4" /><path d="M5 24q11 20 23 0M12 28v5h9v-5M33 25h10v17H33M31 25h14M35 11l3-7 3 7q0 5-3 5t-3-5" /></>);
export const InsulationIcon = defineIcon(<><Tint d="M9 13q8-10 27 0v22H17z" /><path d="M9 13q8-10 27 0v22H17M14 15l3 2 3-2 3 2 3-2 3 2M14 21l3 2 3-2 3 2 3-2 3 2M36 35q-7 10-24 7" /><circle cx="12" cy="34" r="8" /><path d="M11 37q-6-4 0-6t4 5" /></>);
export const TiresIcon = defineIcon(<><ellipse cx="20" cy="25" rx="13" ry="18" fill="currentColor" fillOpacity=".14" /><ellipse cx="20" cy="25" rx="6" ry="11" /><path d="M20 7h8q13 0 13 18T28 43h-8M33 11l5 3m-4 5 6 2m-6 6 6 1m-8 6 6 2M12 14l3 2m-6 8h4m-2 10 4-2" /></>);
export const CarBatteryIcon = defineIcon(<><Panel x={5} y={15} w={38} h={26} /><path d="M10 15V8h8v7m12 0V8h8v7M5 23h38M12 31h8m-4-4v8m13-4h7" /></>);
export const BicycleIcon = defineIcon(<><circle cx="11" cy="33" r="8" fill="currentColor" fillOpacity=".14" /><circle cx="37" cy="33" r="8" fill="currentColor" fillOpacity=".14" /><path d="m11 33 9-18 8 18H11l9-18h11l6 18M28 33l3-18-2-7h7M16 12h8" /></>);
export const ToolboxIcon = defineIcon(<><Panel x={5} y={16} w={38} h={25} /><path d="M17 16V9h14v7M5 27h38M11 27v-5m26 5v-5M20 25h8v6h-8zM11 35h7" /></>);
export const ShelvingIcon = defineIcon(<><Tint d="M6 16h36v5H6zM6 34h36v5H6z" /><path d="M7 5v39m34-39v39M6 16h36v5H6zM6 34h36v5H6zM12 7h10v9H12zM27 8h8v8h-8zM11 26h12v8H11zM29 25h7v9h-7z" /></>);
export const StorageBinsIcon = defineIcon(<><Panel x={6} y={27} w={36} h={16} /><Panel x={10} y={8} w={28} h={15} /><path d="M4 27h40M8 8h32M19 13h10v5H19zM19 32h10v5H19z" /></>);
export const ClothingIcon = defineIcon(<><Tint d="m15 8-11 9 6 9 6-4v20h16V22l6 4 6-9-11-9q-9 8-18 0" /><path d="m15 8-11 9 6 9 6-4v20h16V22l6 4 6-9-11-9q-9 8-18 0M18 8q6 13 12 0" /></>);
export const LuggageIcon = defineIcon(<><Panel x={10} y={13} w={28} h={28} rx={4} /><path d="M19 13V5h10v8M17 20v14m7-14v14m7-14v14M15 41v3m18-3v3" /></>);
export const SportsIcon = defineIcon(<><circle cx="18" cy="29" r="14" fill="currentColor" fillOpacity=".14" /><path d="M4 29h28M18 15v28M9 18q13 11 0 22m18-22q-13 11 0 22M34 29l-4-20q0-6 7-5t4 8l-5 17M34 29v13h4" /></>);
export const KidsToysIcon = defineIcon(<><Panel x={5} y={25} w={20} h={18} /><path d="m10 38 5-9 5 9m-8-3h6" /><circle cx="32" cy="18" r="11" fill="currentColor" fillOpacity=".14" /><circle cx="24" cy="7" r="4" /><circle cx="40" cy="7" r="4" /><path d="M28 17h1m6 0h1M30 23h4M28 32h14v11H28z" /></>);
export const AquariumIcon = defineIcon(<><Panel x={4} y={12} w={40} h={29} /><path d="M4 12V7h40v5M4 20q5-4 10 0t10 0 10 0 10 0M9 41V30m0 5-3-3m3 0 3-4M38 41V29m0 6 3-3" /><path d="M18 29q6-7 12 0-6 7-12 0l-4-4v8z" fill="currentColor" fillOpacity=".14" /></>);
export const RugIcon = defineIcon(<><Panel x={9} y={8} w={30} h={32} rx={0} /><path d="M14 13h20v22H14zM24 18l6 6-6 6-6-6zM13 4v4m7-4v4m8-4v4m7-4v4M13 40v4m7-4v4m8-4v4m7-4v4" /></>);
export const MirrorIcon = defineIcon(<><ellipse cx="24" cy="22" rx="15" ry="18" fill="currentColor" fillOpacity=".14" /><ellipse cx="24" cy="22" rx="11" ry="14" /><path d="m18 22 9-9m-5 17 9-9M19 39l-2 5m12-5 2 5M14 44h20" /></>);
export const LightFixtureIcon = defineIcon(<><Tint d="M13 16h22l8 18H5z" /><path d="M13 16h22l8 18H5zM24 16V5m-6 0h12M18 34q0 10 6 10t6-10M12 39l-2 3m26-3 2 3" /></>);
export const MiscItemIcon = defineIcon(<><Carton x={8} y={12} s={32} /><path d="M8 12 14 5h20l6 7M24 5v7M17 35h1m6 0h1m6 0h1" /></>);

// Dedicated silhouettes for items that previously borrowed an unrelated catalog icon.
export const SectionalIcon = defineIcon(<><Tint d="M5 14h36v13H13v15H5z" /><path d="M5 14h36v13H13v15H5zM5 23h8m9-9v13m10-13v13M3 12v32m40-32v17M8 42v3m30-18v4" /></>);
export const OfficeChairIcon = defineIcon(<><Panel x={14} y={5} w={20} h={20} rx={5} /><Panel x={11} y={29} w={26} h={7} /><path d="M24 25v4m0 7v8m-11 0 11-4 11 4M7 21v9h4m30-9v9h-4" /></>);
export const BarStoolIcon = defineIcon(<><Panel x={11} y={11} w={26} h={7} rx={3} /><path d="M16 18l-6 26m22-26 6 26M13 32h22M15 11V5h18v6" /></>);
export const DryerIcon = defineIcon(<><Panel x={10} y={5} w={28} h={38} /><path d="M10 15h28M15 10h9m7 0h1" /><circle cx="24" cy="28" r="9" /><path d="M20 24q-3 3 0 7m4-7q-3 3 0 7m4-7q-3 3 0 7" /></>);
export const MiniFridgeIcon = defineIcon(<><Panel x={10} y={13} w={28} h={28} rx={3} /><path d="M16 20v8M14 41v3m20-3v3M10 10h28" /></>);
export const DehumidifierIcon = defineIcon(<><Panel x={12} y={5} w={24} h={38} rx={4} /><path d="M17 11h14m-14 5h14m-14 5h14M12 35h24" /><path d="m24 24-4 6q0 5 4 5t4-5z" fill="currentColor" fillOpacity=".14" /></>);
export const WaterCoolerIcon = defineIcon(<><Panel x={15} y={4} w={18} h={14} rx={4} /><Panel x={11} y={18} w={26} h={26} /><path d="M17 24h4m6 0h4M18 24v4m12-4v4M17 33h14v6H17zM21 18v-3m6 3v-3" /></>);
export const ProjectorIcon = defineIcon(<><Panel x={4} y={16} w={40} h={23} rx={4} /><circle cx="32" cy="27" r="7" /><circle cx="32" cy="27" r="3" /><path d="M9 24h8m-8 5h8M10 39v4m28-4v4M12 16v-5h12" /></>);
export const WheelbarrowIcon = defineIcon(<><Tint d="M5 16h28l-5 16H13z" /><path d="M5 16h28l-5 16H13zM28 32l9-22h7M20 32l-4 11M23 32l8 11M10 37l18-5" /><circle cx="10" cy="39" r="5" /></>);
export const LeafBlowerIcon = defineIcon(<><Panel x={6} y={12} w={21} h={20} rx={6} /><path d="M11 12V7h12v5M27 23h7l10 13-5 5-13-12M11 19h8m-8 5h8M5 38h5m-1 5h8" /></>);
export const LadderIcon = defineIcon(<><Tint d="M12 4h6v40h-6zM30 4h6v40h-6z" /><path d="M12 4h6v40h-6zM30 4h6v40h-6zM18 10h12m-12 10h12m-12 10h12m-12 10h12" /></>);
export const PetCrateIcon = defineIcon(<><Panel x={5} y={14} w={38} h={28} rx={4} /><path d="M17 14V8h14v6M10 42V22q0-4 4-4h9q4 0 4 4v20M14 22v15m8-15v15M10 30h17M33 22h5m-5 7h5m-5 7h5" /></>);
export const StrollerIcon = defineIcon(<><Tint d="M6 22h27q0 13-14 13T6 22M6 22V8q16 0 16 14" /><path d="M6 22h27q0 13-14 13T6 22M6 22V8q16 0 16 14M33 22l5-15h6M19 35l-8 6m9-6 12 6" /><circle cx="11" cy="42" r="3" /><circle cx="33" cy="42" r="3" /></>);
export const RidingMowerIcon = defineIcon(<><Panel x={24} y={22} w={19} h={13} /><path d="M7 23h10v12h7M10 23V13h6m1 10 10-9m-4-3 8 6M31 22v-5M6 35h37" /><circle cx="12" cy="38" r="6" fill="currentColor" fillOpacity=".14" /><circle cx="37" cy="39" r="5" fill="currentColor" fillOpacity=".14" /></>);
