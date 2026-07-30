import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function asString(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function asDetails(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return { notes: value.trim() };
    }
    return { notes: value.trim() };
  }
  return {};
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    // ElevenLabs webhook secret — the anon JWT alone is public and must not grant access.
    const expectedSecret = Deno.env.get("AGENT_BOOKING_WEBHOOK_SECRET");
    if (!expectedSecret) {
      return json(500, { error: "Server misconfigured" });
    }
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    if (!token || token !== expectedSecret) {
      return json(401, { error: "Unauthorized" });
    }

    const payload = await req.json();
    const customerName = asString(payload.customer_name ?? payload.name);
    const customerPhone = asString(payload.customer_phone ?? payload.phone);

    if (!customerName || !customerPhone) {
      return json(400, {
        error: "customer_name and customer_phone are required",
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return json(500, { error: "Server misconfigured" });
    }

    // Service role insert — table has no anon insert policy by design.
    const supabase = createClient(supabaseUrl, serviceKey);

    const details = asDetails(payload.details);
    for (const key of [
      "items",
      "moving_options",
      "notes",
      "access",
      "helpers",
      "truck_needed",
      "home_size",
      "dumpster_size",
      "rental_days",
      "time_estimate",
      "hourly_rate_quoted",
    ] as const) {
      if (payload[key] != null && details[key] == null) {
        details[key] = payload[key];
      }
    }

    const row = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: asString(payload.customer_email ?? payload.email),
      service_type: asString(payload.service_type),
      zip_code: asString(payload.zip_code ?? payload.zip),
      service_address: asString(payload.service_address ?? payload.address),
      preferred_date: asString(payload.preferred_date ?? payload.date),
      preferred_time_window: asString(
        payload.preferred_time_window ?? payload.time_window ?? payload.time_slot
      ),
      quoted_price_summary: asString(
        payload.quoted_price_summary ?? payload.price_summary ?? payload.quote_summary
      ),
      call_summary: asString(payload.call_summary ?? payload.summary),
      conversation_id: asString(payload.conversation_id),
      agent_id: asString(payload.agent_id),
      details,
      raw_payload: payload,
      source: asString(payload.source) ?? "phone_agent",
      status: "new",
    };

    const { data, error } = await supabase
      .from("agent_bookings")
      .insert(row)
      .select("id, created_at, status")
      .single();

    if (error) {
      console.error("agent_bookings insert failed:", error);
      return json(500, { error: "Failed to save booking", detail: error.message });
    }

    return json(200, {
      ok: true,
      booking_id: data.id,
      status: data.status,
      created_at: data.created_at,
      message: "Booking saved. Our team will confirm shortly.",
    });
  } catch (err) {
    console.error("submit-agent-booking error:", err);
    return json(500, {
      error: "Unexpected error",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
