import type { DetectedItem, PriceEstimate } from '../types';

/** Fallback when pricing_config is unavailable (matches live DB junk_removal_rules.min_price). */
export const JUNK_REMOVAL_MIN_PRICE = 169;

/** Fallback per-item min price when an item is not found in pricing_items. */
export const JUNK_REMOVAL_DEFAULT_ITEM_MIN_PRICE = 49;

export const JUNK_ONLINE_BOOKING_DISCOUNT_RATE = 0.1;

export const JUNK_ONLINE_BOOKING_DISCOUNT_LABEL = '10% online booking discount';

/** Local fallback map synced to pricing_items.min_price in Supabase. */
export const JUNK_ITEM_MIN_PRICES: Record<string, number> = {
  'ac unit': 99,
  'aquarium / fish tank': 69,
  'bags of trash': 49,
  'bar stools': 49,
  'bed frame': 79,
  bicycle: 49,
  bookshelf: 79,
  'box spring': 79,
  'boxes of junk': 49,
  'bunk bed': 129,
  'cabinets / countertop': 119,
  'car battery': 45,
  'carpet / padding': 79,
  chair: 59,
  'china cabinet': 119,
  'clothing / bags': 39,
  'coffee table': 69,
  'computer / monitor': 59,
  'concrete / brick': 99,
  crib: 69,
  dehumidifier: 59,
  desk: 79,
  'desk chair / office chair': 69,
  'dining table': 89,
  dishwasher: 99,
  dresser: 89,
  dryer: 109,
  'drywall / sheetrock': 69,
  'electronics box': 49,
  'exercise equipment': 119,
  fencing: 89,
  'filing cabinet': 69,
  'firewood pile': 69,
  futon: 89,
  'futon mattress': 89,
  'gaming console': 39,
  'garden tools': 39,
  'grill / bbq': 79,
  'hot tub / spa': 399,
  insulation: 59,
  'kids toys': 39,
  ladder: 59,
  'lawn mower': 79,
  'leaf blower': 49,
  'light fixture': 39,
  loveseat: 99,
  luggage: 39,
  'lumber / wood': 69,
  mattress: 89,
  'metal shelving': 69,
  microwave: 59,
  'mini fridge': 79,
  mirror: 49,
  'miscellaneous item': 49,
  nightstand: 59,
  ottoman: 59,
  'oven / stove': 109,
  'paint cans': 49,
  'patio chair': 59,
  'patio furniture set': 129,
  'pet crate / kennel': 59,
  'piano / organ': 275,
  'plumbing fixtures': 69,
  'pool / game table': 129,
  'printer / scanner': 59,
  projector: 59,
  recliner: 99,
  'refrigerator / freezer': 119,
  'riding mower': 129,
  'roofing shingles': 89,
  rug: 49,
  'safe (medium/large)': 349,
  sectional: 159,
  shed: 249,
  'shelving unit': 69,
  'sofa / couch': 99,
  'speakers (large)': 69,
  'sports equipment': 59,
  'stereo / speakers': 59,
  'storage bins / boxes': 45,
  stroller: 49,
  'swing set / playground': 179,
  table: 69,
  'tile / flooring': 79,
  tires: 69,
  'toolbox / workbench': 79,
  trampoline: 119,
  treadmill: 129,
  tv: 69,
  'tv stand / entertainment center': 79,
  'vacuum cleaner': 39,
  'wardrobe / armoire': 109,
  washer: 109,
  'washer & dryer set': 179,
  'washer / dryer': 179,
  'washing machine': 109,
  'water dispenser / cooler': 69,
  'water heater': 109,
  wheelbarrow: 59,
  'windows / doors': 79,
  'yard debris / brush': 79,
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
