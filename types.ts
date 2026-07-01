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

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}