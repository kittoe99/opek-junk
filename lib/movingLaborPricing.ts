/** Hourly crew rates. Keep in sync with supabase/functions/calculate-price and the voice-agent prompts. */
export const MOVING_LABOR_HOURLY_RATES = {
  2: 119,
  3: 149,
} as const;

export const MOVING_TRUCK_FEE = 99;

export type MovingCrewSize = keyof typeof MOVING_LABOR_HOURLY_RATES;

/** Crews are 2 or 3 helpers; anything else falls back to the standard 2-person crew. */
export function resolveMovingCrewSize(helpers: number): MovingCrewSize {
  return helpers === 3 ? 3 : 2;
}

export function getMovingHourlyRate(helpers: number): number {
  return MOVING_LABOR_HOURLY_RATES[resolveMovingCrewSize(helpers)];
}
