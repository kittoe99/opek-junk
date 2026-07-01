import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const DEFAULT_ALLOWED_ORIGINS = [
  'https://opekjunkremoval.com',
  'https://www.opekjunkremoval.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
]

function isAllowedOrigin(origin: string, allowed: string[]): boolean {
  if (!origin) return false
  if (allowed.includes(origin)) return true
  // Vercel preview deployments
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true
  return false
}

function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || ''
  const fromEnv = Deno.env.get('ALLOWED_ORIGINS')
  const allowed = fromEnv
    ? fromEnv.split(',').map((o) => o.trim()).filter(Boolean)
    : DEFAULT_ALLOWED_ORIGINS
  const allowOrigin = isAllowedOrigin(origin, allowed) ? origin : allowed[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  }
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req)

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    const { type } = payload

    if (type === 'junk_removal') {
      const { items = [] } = payload
      
      const { data: dbItems, error: dbError } = await supabase
        .from('pricing_items')
        .select('name, min_price')
      
      if (dbError) throw dbError

      const { data: configData, error: configError } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('key', 'junk_removal_rules')
        .single()

      if (configError) throw configError

      const minOrderPrice = configData.value?.min_price || 169

      function normalizeItemName(name: string): string {
        return name.toLowerCase().trim()
      }

      function effectiveItemQuantity(quantity: number): number {
        return quantity === 1 ? 1 : 1 + (quantity - 1) * 0.85
      }

      const priceMap: Record<string, number> = {}
      for (const dbItem of dbItems ?? []) {
        if (dbItem.min_price == null) continue
        priceMap[normalizeItemName(dbItem.name)] = Number(dbItem.min_price)
      }

      function lookupItemMinPrice(name: string): number {
        const norm = normalizeItemName(name)
        if (priceMap[norm] !== undefined) return priceMap[norm]

        for (const [key, price] of Object.entries(priceMap)) {
          if (norm.includes(key) || key.includes(norm)) {
            return price
          }
        }

        return 33
      }

      let itemTotal = 0
      for (const item of items) {
        const qty = effectiveItemQuantity(item.quantity)
        itemTotal += lookupItemMinPrice(item.name) * qty
      }

      const roundedItemTotal = Math.round(itemTotal)
      const subtotal = Math.max(minOrderPrice, roundedItemTotal)
      const onlineBookingDiscount = subtotal > 0 ? Math.round(subtotal * 0.1) : 0
      const finalPrice = Math.max(0, subtotal - onlineBookingDiscount)
      const totalItems = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
      const loadDescription =
        totalItems <= 0
          ? 'Itemized estimate'
          : totalItems === 1
            ? '1 item · per-item pricing'
            : `${totalItems} items · per-item pricing`

      let summary = `Per-item pricing for ${items.length} line item${items.length === 1 ? '' : 's'}.`
      if (subtotal > roundedItemTotal) {
        summary += ` Order minimum of $${minOrderPrice} applied (minimum is the total, not added on top).`
      }
      if (onlineBookingDiscount > 0) {
        summary += ` 10% online booking discount: -$${onlineBookingDiscount}.`
      }

      return new Response(
        JSON.stringify({
          estimatedVolume: loadDescription,
          price: finalPrice,
          summary,
          itemSubtotal: roundedItemTotal,
          orderMinimum: minOrderPrice,
          subtotal,
          onlineBookingDiscount,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    
    else if (type === 'dumpster_rental') {
      const { size, duration } = payload

      // Fetch config
      const { data: configData, error: configError } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('key', 'dumpster_rental_rules')
        .single()

      if (configError) throw configError

      const rules = configData.value
      const basePrices = rules.base_prices
      const basePrice = basePrices[size] || 400
      const baseDuration = rules.base_duration_days || 7
      
      let extraDaysCost = 0
      if (duration > baseDuration) {
        extraDaysCost = (duration - baseDuration) * rules.extra_day_price
      }

      let discount = 0
      if (duration >= rules.discount_days_threshold) {
        discount = Math.round((basePrice + extraDaysCost) * (rules.discount_percent / 100))
      }

      const finalPrice = basePrice + extraDaysCost - discount

      let summary = `${size} dumpster rental for ${duration} day${duration > 1 ? 's' : ''}.`
      if (duration > baseDuration) {
        summary += ` Includes ${duration - baseDuration} extra day${duration - baseDuration > 1 ? 's' : ''} at $${rules.extra_day_price}/day.`
      }
      if (discount > 0) {
        summary += ` ${rules.discount_percent}% long-term rental discount applied.`
      }

      return new Response(
        JSON.stringify({
          estimatedVolume: `${size} container`,
          price: finalPrice,
          summary
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } 
    
    else if (type === 'moving_labor') {
      const { helpers, hours } = payload

      // Fetch config
      const { data: configData, error: configError } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('key', 'moving_labor_rules')
        .single()

      if (configError) throw configError

      const rules = configData.value
      const rate2 = rules?.price_per_hour_2_helpers ?? 149
      const rate3 = rules?.price_per_hour_3_helpers ?? 189

      let pricePerHour = rate2
      if (helpers === 3) {
        pricePerHour = rate3
      } else if (helpers > 3) {
        pricePerHour = rate3
      }

      const finalPrice = Math.round(pricePerHour * hours)

      const summary = `Moving Labor: ${helpers} helpers for ${hours} hours at $${pricePerHour}/hour.`

      return new Response(
        JSON.stringify({
          estimatedVolume: `${helpers} Helpers for ${hours} hours`,
          price: finalPrice,
          summary
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    else {
      return new Response(
        JSON.stringify({ error: 'Invalid calculation type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
