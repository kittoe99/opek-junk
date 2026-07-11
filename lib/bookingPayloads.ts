import {
  MovingAccessType,
  MovingHomeSize,
  MovingLaborOptions,
  MovingServiceScope,
} from '../types';

/** Snake_case moving options persisted in booking_details.moving_options */
export interface StoredMovingOptions {
  service_scope: MovingServiceScope;
  needs_truck: boolean;
  home_size: MovingHomeSize;
  /** Access used for estimate (main location). */
  access_type: MovingAccessType;
  flights_of_stairs: number;
  heavy_items: string[];
  needs_packing_help: boolean;
  needs_disassembly: boolean;
  helpers: number;
  hours: number;
  pickup_access: MovingAccessType | null;
  pickup_flights: number;
  dropoff_access: MovingAccessType | null;
  dropoff_flights: number;
}

export interface MovingLocationFields {
  address: string;
  unitNumber?: string | null;
  city: string;
  state: string;
  zipCode: string;
  pickupAccess?: MovingAccessType | null;
  pickupFlights?: number | null;
  addressB?: string;
  unitNumberB?: string | null;
  cityB?: string;
  stateB?: string;
  zipCodeB?: string;
  dropoffAccess?: MovingAccessType | null;
  dropoffFlights?: number | null;
  includeDropoff?: boolean;
}

export function toStoredMovingOptions(
  options: MovingLaborOptions,
  overrides?: {
    pickupAccess?: MovingAccessType | null;
    pickupFlights?: number | null;
    dropoffAccess?: MovingAccessType | null;
    dropoffFlights?: number | null;
  }
): StoredMovingOptions {
  const pickupAccess = overrides?.pickupAccess ?? options.accessType;
  const dropoffAccess = overrides?.dropoffAccess ?? null;
  return {
    service_scope: options.serviceScope,
    needs_truck: options.needsTruck,
    home_size: options.homeSize,
    access_type: options.accessType,
    flights_of_stairs: options.flightsOfStairs,
    heavy_items: [...options.heavyItems],
    needs_packing_help: options.needsPackingHelp,
    needs_disassembly: options.needsDisassembly,
    helpers: options.helpers,
    hours: options.hours,
    pickup_access: pickupAccess,
    pickup_flights:
      pickupAccess === 'stairs' ? (overrides?.pickupFlights ?? options.flightsOfStairs ?? 0) : 0,
    dropoff_access: dropoffAccess,
    dropoff_flights:
      dropoffAccess === 'stairs' ? (overrides?.dropoffFlights ?? 0) : 0,
  };
}

export function buildLocationInfoPayload(
  fields: MovingLocationFields,
  { isMoving = false }: { isMoving?: boolean } = {}
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    address: fields.address,
    unit_number: fields.unitNumber || null,
    city: fields.city,
    state: fields.state,
    zip_code: fields.zipCode,
  };

  if (!isMoving) return base;

  base.access = fields.pickupAccess ?? null;
  base.flights_of_stairs =
    fields.pickupAccess === 'stairs' ? (fields.pickupFlights ?? 0) : 0;

  if (fields.includeDropoff && fields.addressB) {
    base.address_b = fields.addressB;
    base.unit_number_b = fields.unitNumberB || null;
    base.city_b = fields.cityB;
    base.state_b = fields.stateB;
    base.zip_code_b = fields.zipCodeB;
    base.access_b = fields.dropoffAccess ?? null;
    base.flights_of_stairs_b =
      fields.dropoffAccess === 'stairs' ? (fields.dropoffFlights ?? 0) : 0;
  }

  return base;
}

export function formatMovingOptionsSummary(options: StoredMovingOptions | null | undefined): string {
  if (!options) return '';
  const scopeLabels: Record<MovingServiceScope, string> = {
    both: 'Load & unload',
    loading: 'Loading only',
    unloading: 'Unloading only',
    rearrange: 'In-home rearrange',
  };
  const sizeLabels: Record<MovingHomeSize, string> = {
    studio: 'Studio',
    '1bed': '1-Bedroom',
    '2bed': '2-Bedroom',
    '3plus': '3+ Bedrooms',
  };
  const accessLabels: Record<MovingAccessType, string> = {
    ground: 'Ground floor',
    elevator: 'Elevator',
    stairs: 'Stairs',
  };

  const parts = [
    scopeLabels[options.service_scope],
    options.needs_truck ? 'Truck included' : 'Customer truck',
    sizeLabels[options.home_size],
    `${options.helpers} helpers`,
    `~${options.hours} hrs`,
    accessLabels[options.access_type],
  ];
  if (options.heavy_items?.length) parts.push(`${options.heavy_items.length} heavy item(s)`);
  if (options.needs_packing_help) parts.push('Packing help');
  if (options.needs_disassembly) parts.push('Disassembly');
  return parts.filter(Boolean).join(' · ');
}
