export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Armchair' | 'Refrigerator' | 'Trash2' | 'Construction' | 'Trees' | 'PackageOpen';
}

export interface DetectedItem {
  id: string;
  name: string;
  quantity: number;
}

export interface PriceEstimateLine {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PriceEstimate {
  estimatedVolume: string;
  price: number;
  summary: string;
  itemSubtotal?: number;
  orderMinimum?: number;
  /** Pre-discount total after any order minimum is applied. */
  subtotal?: number;
  onlineBookingDiscount?: number;
  lines?: PriceEstimateLine[];
}

export interface QuoteEstimate {
  itemsDetected: string[];
  estimatedVolume: string;
  price: number;
  summary: string;
  subtotal?: number;
  onlineBookingDiscount?: number;
}

/** Structured options collected during Local Moving / Moving Labor estimate. */
export type MovingServiceScope = 'both' | 'loading' | 'unloading' | 'rearrange';
export type MovingHomeSize = 'studio' | '1bed' | '2bed' | '3plus';
export type MovingAccessType = 'ground' | 'elevator' | 'stairs';

export interface MovingLaborOptions {
  serviceScope: MovingServiceScope;
  needsTruck: boolean;
  homeSize: MovingHomeSize;
  accessType: MovingAccessType;
  flightsOfStairs: number;
  heavyItems: string[];
  needsPackingHelp: boolean;
  needsDisassembly: boolean;
  helpers: number;
  hours: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}