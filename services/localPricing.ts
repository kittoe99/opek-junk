import { DetectedItem, PriceEstimate } from '../types';

export interface DumpsterRentalOptions {
  size: '10-yard' | '15-yard' | '20-yard' | '30-yard';
  duration: number;
}

const JUNK_REMOVAL_MIN_PRICE = 169;

const MOVING_LABOR_RULES = {
  price_per_hour_2_helpers: 149,
  price_per_hour_3_helpers: 189,
};

const DUMPSTER_RULES = {
  base_prices: {
    '10-yard': 350,
    '15-yard': 400,
    '20-yard': 450,
    '30-yard': 550,
  } as Record<string, number>,
  base_duration_days: 7,
  extra_day_price: 25,
  discount_days_threshold: 14,
  discount_percent: 10,
};

const ITEM_VOLUME_MAP: Record<string, number> = {
  'sofa / couch': 2.5,
  sectional: 4.5,
  loveseat: 2,
  chair: 1,
  recliner: 1.5,
  ottoman: 0.5,
  table: 1.5,
  'dining table': 2,
  'coffee table': 0.5,
  'tv stand / entertainment center': 2,
  bookshelf: 1.5,
  desk: 1.5,
  'filing cabinet': 1,
  dresser: 1.5,
  nightstand: 0.5,
  'wardrobe / armoire': 2.5,
  'china cabinet': 2.5,
  'patio furniture set': 3,
  mattress: 1.5,
  'box spring': 1,
  'bed frame': 1,
  futon: 1.5,
  'bunk bed': 2.5,
  crib: 1,
  'refrigerator / freezer': 2,
  'mini fridge': 0.5,
  'washer / dryer': 1,
  'washing machine': 1,
  dryer: 1,
  dishwasher: 1,
  'oven / stove': 1.5,
  microwave: 0.3,
  'ac unit': 0.5,
  'water heater': 1,
  'vacuum cleaner': 0.2,
  'exercise equipment': 2,
  treadmill: 2,
  tv: 0.5,
  'computer / monitor': 0.2,
  'printer / scanner': 0.2,
  'stereo / speakers': 0.3,
  'gaming console': 0.1,
  'electronics box': 0.2,
  'lawn mower': 0.8,
  'riding mower': 2,
  'grill / bbq': 1,
  trampoline: 3,
  'swing set / playground': 4,
  'hot tub / spa': 6,
  shed: 8,
  fencing: 2,
  'yard debris / brush': 1,
  'garden tools': 0.2,
  'firewood pile': 1,
  'drywall / sheetrock': 1,
  'lumber / wood': 1,
  'carpet / padding': 1.5,
  'tile / flooring': 1,
  'concrete / brick': 1,
  'roofing shingles': 1,
  'windows / doors': 1,
  'cabinets / countertop': 2,
  'plumbing fixtures': 1,
  'paint cans': 0.2,
  insulation: 1,
  tires: 0.2,
  'car battery': 0.1,
  bicycle: 0.5,
  'toolbox / workbench': 1.5,
  'shelving unit': 1,
  'storage bins / boxes': 0.3,
  'clothing / bags': 0.2,
  luggage: 0.2,
  'sports equipment': 0.3,
  'kids toys': 0.2,
  'piano / organ': 3,
  'pool / game table': 3,
  'aquarium / fish tank': 1,
  rug: 0.5,
  mirror: 0.2,
  'light fixture': 0.2,
  'bags of trash': 0.2,
  'boxes of junk': 0.2,
  'miscellaneous item': 0.5,
};

const ITEM_PRICE_MAP: Record<string, { min: number; max: number }> = {
  'hot tub / spa': { min: 300, max: 600 },
  shed: { min: 300, max: 600 },
  tires: { min: 10, max: 20 },
  'piano / organ': { min: 200, max: 400 },
};

function normalizeItemName(name: string): string {
  return name.toLowerCase().trim();
}

function getVolumeForItem(name: string): number {
  const norm = normalizeItemName(name);
  if (ITEM_VOLUME_MAP[norm] !== undefined) return ITEM_VOLUME_MAP[norm];

  for (const [key, volume] of Object.entries(ITEM_VOLUME_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return volume;
    }
  }

  return 0.5;
}

function getPriceForItem(name: string): { min: number; max: number } {
  const norm = normalizeItemName(name);
  if (ITEM_PRICE_MAP[norm] !== undefined) return ITEM_PRICE_MAP[norm];

  for (const [key, price] of Object.entries(ITEM_PRICE_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return price;
    }
  }

  return { min: 60, max: 100 };
}

function volumeDescription(totalVolume: number): string {
  if (totalVolume <= 2) return 'Minimum Load (up to 2 yd³)';
  if (totalVolume <= 5) return '1/4 Truck (3-4 yd³)';
  if (totalVolume <= 8) return '1/2 Truck (6-8 yd³)';
  if (totalVolume <= 11) return '3/4 Truck (9-11 yd³)';
  return 'Full Truck (12-15+ yd³)';
}

export function calculateMovingLaborLocally(helpers: number, hours: number): PriceEstimate {
  const pricePerHour =
    helpers >= 3
      ? MOVING_LABOR_RULES.price_per_hour_3_helpers
      : MOVING_LABOR_RULES.price_per_hour_2_helpers;
  const finalPrice = Math.round(pricePerHour * hours);

  return {
    estimatedVolume: `${helpers} Helpers for ${hours} hours`,
    price: finalPrice,
    summary: `Moving Labor: ${helpers} helpers for ${hours} hours at $${pricePerHour}/hour.`,
  };
}

export function calculateDumpsterRentalLocally(options: DumpsterRentalOptions): PriceEstimate {
  const { size, duration } = options;
  const rules = DUMPSTER_RULES;
  const basePrice = rules.base_prices[size] || 400;
  const baseDuration = rules.base_duration_days;

  let extraDaysCost = 0;
  if (duration > baseDuration) {
    extraDaysCost = (duration - baseDuration) * rules.extra_day_price;
  }

  let discount = 0;
  if (duration >= rules.discount_days_threshold) {
    discount = Math.round((basePrice + extraDaysCost) * (rules.discount_percent / 100));
  }

  const finalPrice = basePrice + extraDaysCost - discount;

  let summary = `${size} dumpster rental for ${duration} day${duration > 1 ? 's' : ''}.`;
  if (duration > baseDuration) {
    summary += ` Includes ${duration - baseDuration} extra day${duration - baseDuration > 1 ? 's' : ''} at $${rules.extra_day_price}/day.`;
  }
  if (discount > 0) {
    summary += ` ${rules.discount_percent}% long-term rental discount applied.`;
  }

  return {
    estimatedVolume: `${size} container`,
    price: finalPrice,
    summary,
  };
}

export function calculateJunkRemovalLocally(items: DetectedItem[]): PriceEstimate {
  let totalVolume = 0;
  let totalMaxPrice = 0;

  for (const item of items) {
    const effectiveQuantity = item.quantity === 1 ? 1 : 1 + (item.quantity - 1) * 0.85;
    totalVolume += getVolumeForItem(item.name) * effectiveQuantity;
    const priceInfo = getPriceForItem(item.name);
    totalMaxPrice += priceInfo.max * effectiveQuantity;
  }

  const calculatedPrice = Math.round(totalMaxPrice);
  const finalPrice = Math.max(JUNK_REMOVAL_MIN_PRICE, calculatedPrice);

  let summary = `Itemized pricing for ${items.length} unique item(s). Estimated load size: ~${totalVolume.toFixed(1)} cubic yards.`;
  if (finalPrice === JUNK_REMOVAL_MIN_PRICE && calculatedPrice < JUNK_REMOVAL_MIN_PRICE) {
    summary += ` (Job minimum of $${JUNK_REMOVAL_MIN_PRICE} applied).`;
  }

  return {
    estimatedVolume: volumeDescription(totalVolume),
    price: finalPrice,
    summary,
  };
}

export function calculatePriceLocally(body: Record<string, unknown>): PriceEstimate {
  const type = body.type as string;

  if (type === 'moving_labor') {
    return calculateMovingLaborLocally(
      Number(body.helpers) || 2,
      Number(body.hours) || 2
    );
  }

  if (type === 'dumpster_rental') {
    return calculateDumpsterRentalLocally({
      size: (body.size as DumpsterRentalOptions['size']) || '20-yard',
      duration: Number(body.duration) || 7,
    });
  }

  if (type === 'junk_removal') {
    const items = (body.items as Array<{ name: string; quantity: number }> | undefined) ?? [];
    return calculateJunkRemovalLocally(
      items.map((item, index) => ({
        id: `local-${index}`,
        name: item.name,
        quantity: item.quantity,
      }))
    );
  }

  throw new Error('Invalid calculation type');
}
