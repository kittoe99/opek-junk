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

export function getSelectedItemCount(items: { quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getMattressCoreItemCount(items: { id: string; quantity: number }[]): number {
  return items
    .filter((item) => ['mattress', 'boxspring', 'bedframe'].includes(item.id))
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
