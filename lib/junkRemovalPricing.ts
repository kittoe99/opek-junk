import type { DetectedItem, PriceEstimate } from '../types';

/** Fallback when pricing_config is unavailable (matches live DB junk_removal_rules.min_price). */
export const JUNK_REMOVAL_MIN_PRICE = 169;

/** Fallback per-item min price when an item is not found in pricing_items. */
export const JUNK_REMOVAL_DEFAULT_ITEM_MIN_PRICE = 33;

export const JUNK_ONLINE_BOOKING_DISCOUNT_RATE = 0.1;

export const JUNK_ONLINE_BOOKING_DISCOUNT_LABEL = '10% online booking discount';

/** Local fallback map synced to pricing_items.min_price in Supabase. */
export const JUNK_ITEM_MIN_PRICES: Record<string, number> = {
  'ac unit': 39,
  'aquarium / fish tank': 44,
  'bags of trash': 22,
  'bar stools': 30,
  'bed frame': 44,
  bicycle: 36,
  bookshelf: 47,
  'box spring': 44,
  'boxes of junk': 22,
  'bunk bed': 99,
  'cabinets / countertop': 83,
  'car battery': 25,
  'carpet / padding': 61,
  chair: 44,
  'china cabinet': 70,
  'clothing / bags': 25,
  'coffee table': 39,
  'computer / monitor': 33,
  'concrete / brick': 77,
  crib: 44,
  dehumidifier: 40,
  desk: 52,
  'desk chair / office chair': 45,
  'dining table': 66,
  dishwasher: 50,
  dresser: 61,
  dryer: 61,
  'drywall / sheetrock': 52,
  'electronics box': 28,
  'exercise equipment': 66,
  fencing: 66,
  'filing cabinet': 44,
  'firewood pile': 50,
  futon: 61,
  'futon mattress': 60,
  'gaming console': 22,
  'garden tools': 25,
  'grill / bbq': 47,
  'hot tub / spa': 300,
  insulation: 44,
  'kids toys': 25,
  ladder: 40,
  'lawn mower': 52,
  'leaf blower': 30,
  'light fixture': 25,
  loveseat: 66,
  luggage: 25,
  'lumber / wood': 50,
  mattress: 66,
  'metal shelving': 55,
  microwave: 28,
  'mini fridge': 41,
  mirror: 28,
  'miscellaneous item': 33,
  nightstand: 33,
  ottoman: 33,
  'oven / stove': 81,
  'paint cans': 28,
  'patio chair': 40,
  'patio furniture set': 99,
  'pet crate / kennel': 40,
  'piano / organ': 138,
  'plumbing fixtures': 50,
  'pool / game table': 99,
  'printer / scanner': 28,
  projector: 30,
  recliner: 52,
  'refrigerator / freezer': 83,
  'riding mower': 99,
  'roofing shingles': 66,
  rug: 33,
  'safe (medium/large)': 269,
  sectional: 99,
  shed: 99,
  'shelving unit': 44,
  'sofa / couch': 83,
  'speakers (large)': 60,
  'sports equipment': 28,
  'stereo / speakers': 28,
  'storage bins / boxes': 28,
  stroller: 35,
  'swing set / playground': 138,
  table: 50,
  'tile / flooring': 61,
  tires: 11,
  'toolbox / workbench': 61,
  trampoline: 105,
  treadmill: 77,
  tv: 39,
  'tv stand / entertainment center': 52,
  'vacuum cleaner': 25,
  'wardrobe / armoire': 88,
  'washer / dryer': 110,
  'washing machine': 61,
  'water dispenser / cooler': 60,
  'water heater': 66,
  wheelbarrow: 45,
  'windows / doors': 44,
  'yard debris / brush': 44,
};

export function normalizeItemName(name: string): string {
  return name.toLowerCase().trim();
}

export function effectiveItemQuantity(quantity: number): number {
  return quantity === 1 ? 1 : 1 + (quantity - 1) * 0.85;
}

export function formatItemizedLoadDescription(
  items: Array<{ name: string; quantity: number }>
): string {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalItems <= 0) return 'Itemized estimate';
  if (totalItems === 1) return '1 item · per-item pricing';
  return `${totalItems} items · per-item pricing`;
}

export function lookupItemMinPrice(
  name: string,
  priceMap: Record<string, number>,
  defaultPrice = JUNK_REMOVAL_DEFAULT_ITEM_MIN_PRICE
): number {
  const norm = normalizeItemName(name);
  if (priceMap[norm] !== undefined) return priceMap[norm];

  for (const [key, price] of Object.entries(priceMap)) {
    if (norm.includes(key) || key.includes(norm)) {
      return price;
    }
  }

  return defaultPrice;
}

export function buildItemMinPriceMapFromDbRows(
  rows: Array<{ name: string; min_price?: number | null }>
): Record<string, number> {
  const map: Record<string, number> = {};

  for (const row of rows) {
    if (row.min_price == null) continue;
    map[normalizeItemName(row.name)] = Number(row.min_price);
  }

  return map;
}

/** Order minimum is a floor on the total — never added on top of item prices. */
export function applyJobMinimumFloor(itemTotal: number, minOrderPrice: number): number {
  return Math.max(minOrderPrice, Math.round(itemTotal));
}

export function getOnlineBookingDiscount(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return Math.round(subtotal * JUNK_ONLINE_BOOKING_DISCOUNT_RATE);
}

export function applyOnlineBookingDiscount(subtotal: number): {
  subtotal: number;
  onlineBookingDiscount: number;
  price: number;
} {
  const onlineBookingDiscount = getOnlineBookingDiscount(subtotal);
  return {
    subtotal,
    onlineBookingDiscount,
    price: Math.max(0, subtotal - onlineBookingDiscount),
  };
}

export function calculateJunkRemovalEstimate(
  items: Array<{ name: string; quantity: number }>,
  priceMap: Record<string, number>,
  minOrderPrice = JUNK_REMOVAL_MIN_PRICE
): PriceEstimate {
  const lines: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }> = [];
  let itemTotal = 0;

  for (const item of items) {
    const qty = effectiveItemQuantity(item.quantity);
    const unitPrice = lookupItemMinPrice(item.name, priceMap);
    const lineTotal = Math.round(unitPrice * qty);
    lines.push({
      name: item.name,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    });
    itemTotal += lineTotal;
  }

  const roundedItemTotal = Math.round(itemTotal);
  const subtotal = applyJobMinimumFloor(roundedItemTotal, minOrderPrice);
  const { onlineBookingDiscount, price: finalPrice } = applyOnlineBookingDiscount(subtotal);
  const loadDescription = formatItemizedLoadDescription(items);

  let summary = `Per-item pricing for ${items.length} line item${items.length === 1 ? '' : 's'}.`;
  if (subtotal > roundedItemTotal) {
    summary += ` Order minimum of $${minOrderPrice} applied (minimum is the total, not added on top).`;
  }
  if (onlineBookingDiscount > 0) {
    summary += ` ${JUNK_ONLINE_BOOKING_DISCOUNT_LABEL}: -$${onlineBookingDiscount}.`;
  }

  return {
    estimatedVolume: loadDescription,
    price: finalPrice,
    summary,
    itemSubtotal: roundedItemTotal,
    orderMinimum: minOrderPrice,
    subtotal,
    onlineBookingDiscount,
    lines,
  };
}

export function calculateJunkRemovalEstimateLocally(items: DetectedItem[]): PriceEstimate {
  return calculateJunkRemovalEstimate(
    items.map((item) => ({ name: item.name, quantity: item.quantity })),
    JUNK_ITEM_MIN_PRICES
  );
}
