import { DetectedItem, PriceEstimate } from '../types';
import { calculateJunkRemovalEstimateLocally } from '../lib/junkRemovalPricing';

export interface DumpsterRentalOptions {
  size: '10-yard' | '15-yard' | '20-yard' | '30-yard';
  duration: number;
}

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
  return calculateJunkRemovalEstimateLocally(items);
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
