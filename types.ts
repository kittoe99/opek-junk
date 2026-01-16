export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Armchair' | 'Refrigerator' | 'Trash2' | 'Construction' | 'Trees' | 'PackageOpen';
}

export interface QuoteEstimate {
  itemsDetected: string[];
  estimatedVolume: string;
  priceRange: {
    min: number;
    max: number;
  };
  summary: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}