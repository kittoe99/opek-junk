export const MATTRESS_STANDARD_RATES = {
  oneItem: 169,
  twoItems: 209,
  threeOrMore: 269,
} as const;

export const MATTRESS_ONLINE_DISCOUNT = {
  oneItem: 31,
  twoItems: 40,
  threeOrMore: 42,
} as const;

export const MATTRESS_UNIT_PRICES = {
  mattress: 105,
  boxspring: 66,
  bedframe: 72,
  extraDefault: 50,
} as const;

export const MATTRESS_TWO_ITEM_BUNDLE_PRICE = 209;
export const MATTRESS_FULL_SET_PRICE = 269;
export const MINIMUM_JUNK_REMOVAL_PRICE = 169;

export const CORE_MATTRESS_IDS = ['mattress', 'boxspring', 'bedframe'] as const;

export type MattressCoreId = (typeof CORE_MATTRESS_IDS)[number];

export interface MattressPricedItem {
  id: string;
  quantity: number;
  basePriceEstimate?: number;
}

export function getSelectedItemCount(items: { quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getMattressCoreItemCount(items: MattressPricedItem[]): number {
  return items
    .filter((item) => (CORE_MATTRESS_IDS as readonly string[]).includes(item.id))
    .reduce((sum, item) => sum + item.quantity, 0);
}

export function getOnlineBookingDiscount(itemCount: number): number {
  if (itemCount <= 0) return 0;
  if (itemCount === 1) return MATTRESS_ONLINE_DISCOUNT.oneItem;
  if (itemCount === 2) return MATTRESS_ONLINE_DISCOUNT.twoItems;
  return MATTRESS_ONLINE_DISCOUNT.threeOrMore;
}

export function getDiscountedTotal(subtotal: number, itemCount: number): number {
  if (subtotal <= 0) return 0;
  const discount = getOnlineBookingDiscount(itemCount);
  return Math.max(0, subtotal - discount);
}

export function formatOnlineBookingDiscountLabel(itemCount: number): string {
  const discount = getOnlineBookingDiscount(itemCount);
  if (discount === 0) return '';

  if (itemCount === 1) return `$${discount} online booking discount (1 item)`;
  if (itemCount === 2) return `$${discount} online booking discount (2 items)`;
  return `$${discount} online booking discount (3+ items)`;
}

export const MATTRESS_ONLINE_DISCOUNT_SUMMARY =
  'Book online and save $31 on 1 item, $40 on 2 items, or $42 on 3+ items off our standard rates ($169 / $209 / $269).';

/** Flat-rate / bundle subtotal before online booking discount. */
export function calculateMattressSubtotal(items: MattressPricedItem[]): number {
  let m = 0;
  let b = 0;
  let f = 0;
  let extraCost = 0;

  items.forEach((item) => {
    if (item.quantity <= 0) return;
    if (item.id === 'mattress') m += item.quantity;
    else if (item.id === 'boxspring') b += item.quantity;
    else if (item.id === 'bedframe') f += item.quantity;
    else extraCost += item.quantity * (item.basePriceEstimate ?? MATTRESS_UNIT_PRICES.extraDefault);
  });

  const mattressItemCount = m + b + f;
  if (extraCost > 0) {
    const itemized =
      m * MATTRESS_UNIT_PRICES.mattress +
      b * MATTRESS_UNIT_PRICES.boxspring +
      f * MATTRESS_UNIT_PRICES.bedframe +
      extraCost;
    return Math.max(MINIMUM_JUNK_REMOVAL_PRICE, itemized);
  }

  if (m === 1 && b === 1 && f === 1) return MATTRESS_FULL_SET_PRICE;
  if (mattressItemCount === 2) return MATTRESS_TWO_ITEM_BUNDLE_PRICE;

  let bundleTotal = 0;

  const tripleSets = Math.min(m, b, f);
  bundleTotal += tripleSets * MATTRESS_FULL_SET_PRICE;
  m -= tripleSets;
  b -= tripleSets;
  f -= tripleSets;

  const doubleSets = Math.min(m, b);
  bundleTotal += doubleSets * (MATTRESS_UNIT_PRICES.mattress + MATTRESS_UNIT_PRICES.boxspring);
  m -= doubleSets;
  b -= doubleSets;

  const mfSets = Math.min(m, f);
  bundleTotal += mfSets * (MATTRESS_UNIT_PRICES.mattress + MATTRESS_UNIT_PRICES.bedframe);
  m -= mfSets;
  f -= mfSets;

  const bfSets = Math.min(b, f);
  bundleTotal += bfSets * (MATTRESS_UNIT_PRICES.boxspring + MATTRESS_UNIT_PRICES.bedframe);
  b -= bfSets;
  f -= bfSets;

  bundleTotal += m * MATTRESS_UNIT_PRICES.mattress;
  bundleTotal += b * MATTRESS_UNIT_PRICES.boxspring;
  bundleTotal += f * MATTRESS_UNIT_PRICES.bedframe;

  return bundleTotal > 0 ? Math.max(MINIMUM_JUNK_REMOVAL_PRICE, bundleTotal) : 0;
}

export function getMattressPricingBreakdown(items: MattressPricedItem[]) {
  const active = items.filter((item) => item.quantity > 0);
  const subtotal = calculateMattressSubtotal(active);
  const itemCount = getMattressCoreItemCount(active);
  const discount = getOnlineBookingDiscount(itemCount);
  const total = getDiscountedTotal(subtotal, itemCount);
  return { subtotal, discount, total, itemCount };
}
