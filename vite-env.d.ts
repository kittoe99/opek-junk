/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_GOOGLE_ADS_ID?: string
  readonly VITE_GADS_MATTRESS_ZIP_CHECK?: string
  readonly VITE_GADS_MATTRESS_VIEW_PRICING?: string
  readonly VITE_GADS_MATTRESS_BOOKING_START?: string
  readonly VITE_GADS_MATTRESS_LEAD?: string
  readonly VITE_GADS_MATTRESS_PURCHASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
