import { DetectedItem, PriceEstimate } from '../types';

// Approximate volume in cubic yards (yd³) for common items
const ITEM_VOLUME_MAP: Record<string, number> = {
  // Furniture
  'sofa / couch': 2.5,
  'sectional': 4.5,
  'loveseat': 2,
  'chair': 1,
  'recliner': 1.5,
  'ottoman': 0.5,
  'table': 1.5,
  'dining table': 2,
  'coffee table': 0.5,
  'tv stand / entertainment center': 2,
  'bookshelf': 1.5,
  'desk': 1.5,
  'filing cabinet': 1,
  'dresser': 1.5,
  'nightstand': 0.5,
  'wardrobe / armoire': 2.5,
  'china cabinet': 2.5,
  'patio furniture set': 3,
  
  // Mattresses & Bedding
  'mattress': 1.5,
  'box spring': 1.0,
  'bed frame': 1.0,
  'futon': 1.5,
  'bunk bed': 2.5,
  'crib': 1.0,

  // Appliances
  'refrigerator / freezer': 2.0,
  'mini fridge': 0.5,
  'washer / dryer': 1.0,
  'washing machine': 1.0,
  'dryer': 1.0,
  'dishwasher': 1.0,
  'oven / stove': 1.5,
  'microwave': 0.3,
  'ac unit': 0.5,
  'water heater': 1.0,
  'vacuum cleaner': 0.2,
  'exercise equipment': 2.0,
  'treadmill': 2.0,

  // Electronics
  'tv': 0.5,
  'computer / monitor': 0.2,
  'printer / scanner': 0.2,
  'stereo / speakers': 0.3,
  'gaming console': 0.1,
  'electronics box': 0.2,

  // Yard & Outdoor
  'lawn mower': 0.8,
  'riding mower': 2.0,
  'grill / bbq': 1.0,
  'trampoline': 3.0,
  'swing set / playground': 4.0,
  'hot tub / spa': 6.0,
  'shed': 8.0,
  'fencing': 2.0,
  'yard debris / brush': 1.0,
  'garden tools': 0.2,
  'firewood pile': 1.0,

  // Construction & Debris
  'drywall / sheetrock': 1.0,
  'lumber / wood': 1.0,
  'carpet / padding': 1.5,
  'tile / flooring': 1.0,
  'concrete / brick': 1.0,
  'roofing shingles': 1.0,
  'windows / doors': 1.0,
  'cabinets / countertop': 2.0,
  'plumbing fixtures': 1.0,
  'paint cans': 0.2,
  'insulation': 1.0,

  // Garage & Storage
  'tires': 0.2,
  'car battery': 0.1,
  'bicycle': 0.5,
  'toolbox / workbench': 1.5,
  'shelving unit': 1.0,
  'storage bins / boxes': 0.3,
  'clothing / bags': 0.2,
  'luggage': 0.2,
  'sports equipment': 0.3,
  'kids toys': 0.2,

  // Miscellaneous
  'piano / organ': 3.0,
  'pool / game table': 3.0,
  'aquarium / fish tank': 1.0,
  'rug': 0.5,
  'mirror': 0.2,
  'light fixture': 0.2,
  'bags of trash': 0.2,
  'boxes of junk': 0.2,
  'miscellaneous item': 0.5,
};

// Item-specific flat rate overrides (when priced individually rather than by volume)
// We add these base costs. For instance, hot tubs are incredibly heavy/hard to move.
const ITEM_PRICE_OVERRIDES: Record<string, { min: number; max: number }> = {
  'hot tub / spa': { min: 300, max: 600 },
  'piano / organ': { min: 200, max: 400 },
  'shed': { min: 300, max: 600 },
  'tires': { min: 10, max: 20 },
};

function normalizeItemName(name: string): string {
  return name.toLowerCase().trim();
}

function getVolumeForItem(name: string): number {
  const norm = normalizeItemName(name);
  
  // Direct match
  if (ITEM_VOLUME_MAP[norm]) return ITEM_VOLUME_MAP[norm];

  // Fuzzy match via includes
  for (const [key, volume] of Object.entries(ITEM_VOLUME_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return volume;
    }
  }

  // Fallback for unknown items
  return 0.5; // Half a cubic yard default
}

export function calculateStaticPrice(items: DetectedItem[]): PriceEstimate {
  let totalVolume = 0;
  let overridePrice = 0;
  let hasOverrides = false;
  let regularItemsVolume = 0;

  for (const item of items) {
    const norm = normalizeItemName(item.name);
    
    // For quantity price of the same item, it's reduced by 20% for every additional of the item
    // First item is 100%, subsequent items are 80% (20% off)
    const effectiveQuantity = item.quantity === 1 ? 1 : 1 + (item.quantity - 1) * 0.8;

    // Check if item has a specific price override
    let isOverride = false;
    for (const [key, price] of Object.entries(ITEM_PRICE_OVERRIDES)) {
      if (norm.includes(key) || key.includes(norm)) {
        // Use the higher side max price
        overridePrice += price.max * effectiveQuantity;
        hasOverrides = true;
        isOverride = true;
        break;
      }
    }

    const vol = getVolumeForItem(item.name) * effectiveQuantity;
    totalVolume += vol;
    
    if (!isOverride) {
      regularItemsVolume += vol;
    }
  }

  // Volume pricing calculation (continuous)
  // Base cost is $50, plus $50 per cubic yard.
  // Minimum load price is $169.
  // This ensures smooth price scaling: 2.38yd=$169, 4yd=$250, 7yd=$400, 10yd=$550, 15yd=$800.
  let volumePrice = 0;
  let volumeDescription = '';

  if (regularItemsVolume > 0 || !hasOverrides) {
    // Calculate precise continuous price, rounded to nearest dollar
    volumePrice = Math.max(169, Math.round(50 + (totalVolume * 50)));

    if (totalVolume <= 2) {
      volumeDescription = 'Minimum Load (up to 2 yd³)';
    } else if (totalVolume <= 5) {
      volumeDescription = '1/4 Truck (3-4 yd³)';
    } else if (totalVolume <= 8) {
      volumeDescription = '1/2 Truck (6-8 yd³)';
    } else if (totalVolume <= 11) {
      volumeDescription = '3/4 Truck (9-11 yd³)';
    } else {
      volumeDescription = 'Full Truck (12-15+ yd³)';
    }
  }

  const finalPrice = Math.round(volumePrice + overridePrice);

  let summary = `Estimated load size: ~${totalVolume.toFixed(1)} cubic yards.`;
  if (hasOverrides) {
    summary += ' Includes heavy/specialty item fees.';
  }

  return {
    estimatedVolume: volumeDescription || 'Specialty Items Only',
    price: finalPrice,
    summary
  };
}

// Dumpster Rental Pricing
// Based on dumpster size and rental duration
export interface DumpsterRentalOptions {
  size: '10-yard' | '15-yard' | '20-yard' | '30-yard';
  duration: number; // number of days
}

export function calculateDumpsterRentalPrice(options: DumpsterRentalOptions): PriceEstimate {
  const { size, duration } = options;
  
  // Base prices per dumpster size (7-day rental)
  const basePrices: Record<string, number> = {
    '10-yard': 350,
    '15-yard': 400,
    '20-yard': 450,
    '30-yard': 550,
  };
  
  const basePrice = basePrices[size] || 400;
  
  // Additional days pricing: $25 per extra day
  const baseDuration = 7;
  let extraDaysCost = 0;
  if (duration > baseDuration) {
    extraDaysCost = (duration - baseDuration) * 25;
  }
  
  // Discount for longer rentals (14+ days): 10% off
  let discount = 0;
  if (duration >= 14) {
    discount = Math.round((basePrice + extraDaysCost) * 0.1);
  }
  
  const finalPrice = basePrice + extraDaysCost - discount;
  
  let summary = `${size} dumpster rental for ${duration} day${duration > 1 ? 's' : ''}.`;
  if (duration > baseDuration) {
    summary += ` Includes ${duration - baseDuration} extra day${duration - baseDuration > 1 ? 's' : ''} at $25/day.`;
  }
  if (discount > 0) {
    summary += ` 10% long-term rental discount applied.`;
  }
  
  return {
    estimatedVolume: `${size} container`,
    price: finalPrice,
    summary
  };
}
