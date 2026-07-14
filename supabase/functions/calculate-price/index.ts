import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { type } = payload

    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (type === 'dumpster_rental') {
      const { size, duration } = payload

      const { data: configData, error: configError } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('key', 'dumpster_rental_rules')
        .single()

      if (configError) throw configError

      const rules = configData.value
      const basePrice = rules?.base_prices?.[size] ?? 400
      const baseDuration = rules?.base_duration_days ?? 7
      const extraDayPrice = rules?.extra_day_price ?? 25
      let finalPrice = basePrice

      if (duration > baseDuration) {
        finalPrice += (duration - baseDuration) * extraDayPrice
      }

      let summary = `${size} dumpster rental for ${duration} day${duration > 1 ? 's' : ''}.`
      if (duration > baseDuration) {
        summary += ` Includes ${duration - baseDuration} extra day${duration - baseDuration > 1 ? 's' : ''} at $${extraDayPrice}/day.`
      }

      const discountThreshold = rules?.discount_days_threshold ?? 14
      const discountPercent = rules?.discount_percent ?? 10
      let discount = 0
      if (duration >= discountThreshold) {
        discount = Math.round(finalPrice * (discountPercent / 100))
        summary += ` ${discountPercent}% long-term rental discount applied.`
      }

      if (discount > 0) {
        summary += ` ${discountPercent}% long-term rental discount applied.`
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
      const { helpers, hours, needsTruck = false } = payload
      const resolvedHelpers = helpers === 1 ? 1 : 2
      const pricePerHour = resolvedHelpers === 1 ? 79 : 119
      const truckFee = needsTruck ? 99 : 0
      const finalPrice = Math.round(pricePerHour * hours + truckFee)
      const helperLabel = `${resolvedHelpers} helper${resolvedHelpers === 1 ? '' : 's'}`
      const summary = `Moving Labor: ${helperLabel} for ${hours} hours at $${pricePerHour}/hour.${needsTruck ? ' Includes a one-time $99 truck fee.' : ''}`

      return new Response(
        JSON.stringify({
          estimatedVolume: `${helperLabel} for ${hours} hours`,
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
