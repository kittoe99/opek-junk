declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GOOGLE_ADS_ID =
  (import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined) ?? 'AW-18232432396';

const CONVERSION_LABELS = {
  mattress_zip_check: import.meta.env.VITE_GADS_MATTRESS_ZIP_CHECK as string | undefined,
  mattress_view_pricing: import.meta.env.VITE_GADS_MATTRESS_VIEW_PRICING as string | undefined,
  mattress_booking_start: import.meta.env.VITE_GADS_MATTRESS_BOOKING_START as string | undefined,
  mattress_lead: import.meta.env.VITE_GADS_MATTRESS_LEAD as string | undefined,
  mattress_purchase: import.meta.env.VITE_GADS_MATTRESS_PURCHASE as string | undefined,
} as const;

export type MattressConversionAction = keyof typeof CONVERSION_LABELS;

function gtag(...args: unknown[]): void {
  window.gtag?.(...args);
}

export function isGoogleAdsConfigured(): boolean {
  return Boolean(GOOGLE_ADS_ID);
}

export function trackMattressConversion(
  action: MattressConversionAction,
  options?: { value?: number; currency?: string },
): void {
  if (!GOOGLE_ADS_ID) return;

  const label = CONVERSION_LABELS[action];
  if (!label) return;

  gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    ...(options?.value != null ? { value: options.value, currency: options.currency ?? 'USD' } : {}),
  });
}

export function trackMattressEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!GOOGLE_ADS_ID) return;
  gtag('event', eventName, params);
}
