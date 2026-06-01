import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
      
      // Fetch all pricing items from DB
      const { data: dbItems, error: dbError } = await supabase
        .from('pricing_items')
        .select('*')
      
      if (dbError) throw dbError

      // Fetch config
      const { data: configData, error: configError } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('key', 'junk_removal_rules')
        .single()

      if (configError) throw configError

      const rules = configData.value

      // Map DB items for quick lookup
      const itemVolumeMap: Record<string, number> = {}
      const itemPriceOverrides: Record<string, { min: number; max: number }> = {}

      for (const dbItem of dbItems) {
        const name = dbItem.name.toLowerCase().trim()
        itemVolumeMap[name] = Number(dbItem.volume)
        if (dbItem.min_price_override !== null && dbItem.max_price_override !== null) {
          itemPriceOverrides[name] = {
            min: dbItem.min_price_override,
            max: dbItem.max_price_override
          }
        }
      }

      function normalizeItemName(name: string): string {
        return name.toLowerCase().trim()
      }

      function getVolumeForItem(name: string): number {
        const norm = normalizeItemName(name)
        if (itemVolumeMap[norm] !== undefined) return itemVolumeMap[norm]

        // Fuzzy match via includes
        for (const [key, volume] of Object.entries(itemVolumeMap)) {
          if (norm.includes(key) || key.includes(norm)) {
            return volume
          }
        }
        return 0.5 // Fallback default
      }

      let totalVolume = 0
      let overridePrice = 0
      let hasOverrides = false
      let regularItemsVolume = 0

      for (const item of items) {
        const norm = normalizeItemName(item.name)
        const effectiveQuantity = item.quantity === 1 ? 1 : 1 + (item.quantity - 1) * 0.8

        let isOverride = false
        for (const [key, price] of Object.entries(itemPriceOverrides)) {
          if (norm.includes(key) || key.includes(norm)) {
            overridePrice += price.max * effectiveQuantity
            hasOverrides = true
            isOverride = true
            break
          }
        }

        const vol = getVolumeForItem(item.name) * effectiveQuantity
        totalVolume += vol

        if (!isOverride) {
          regularItemsVolume += vol
        }
      }

      let volumePrice = 0
      let volumeDescription = ''

      if (regularItemsVolume > 0 || !hasOverrides) {
        volumePrice = Math.max(
          rules.min_price,
          Math.round(rules.base_price + (totalVolume * rules.price_per_yard))
        )

        if (totalVolume <= 2) {
          volumeDescription = 'Minimum Load (up to 2 yd³)'
        } else if (totalVolume <= 5) {
          volumeDescription = '1/4 Truck (3-4 yd³)'
        } else if (totalVolume <= 8) {
          volumeDescription = '1/2 Truck (6-8 yd³)'
        } else if (totalVolume <= 11) {
          volumeDescription = '3/4 Truck (9-11 yd³)'
        } else {
          volumeDescription = 'Full Truck (12-15+ yd³)'
        }
      }

      const finalPrice = Math.round(volumePrice + overridePrice)

      let summary = `Estimated load size: ~${totalVolume.toFixed(1)} cubic yards.`
      if (hasOverrides) {
        summary += ' Includes heavy/specialty item fees.'
      }

      return new Response(
        JSON.stringify({
          estimatedVolume: volumeDescription || 'Specialty Items Only',
          price: finalPrice,
          summary
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
