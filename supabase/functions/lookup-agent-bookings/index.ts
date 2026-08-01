import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Live read-only booking lookup for ElevenLabs voice agents.
 * Tables: agent_bookings, bookings, Prebooking only.
 */

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

function phoneDigits(value: unknown): string {
  return String(value || "").replace(/\D/g, "");
}

function last10(value: unknown): string {
  const d = phoneDigits(value);
  return d.length >= 10 ? d.slice(-10) : d;
}

function phonesMatch(a: unknown, bLast10: string): boolean {
  const d = phoneDigits(a);
  if (!d || !bLast10) return false;
  return d === bLast10 || d.endsWith(bLast10) || bLast10.endsWith(d.slice(-10));
}

function phoneIlikePattern(digits10: string): string {
  return `%${digits10.slice(0, 3)}%${digits10.slice(3, 6)}%${digits10.slice(6)}%`;
}

function clean(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
}

function summarizeItems(bd: Record<string, unknown> | null | undefined): string | null {
  if (!bd) return null;
  const items = bd.estimated_items || bd.items;
  if (Array.isArray(items) && items.length) {
    return items
      .slice(0, 8)
      .map((x) => String(x))
      .join("; ");
  }
  if (bd.details) return String(bd.details).slice(0, 160);
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    // Match deployed submit-agent-booking: gateway verify_jwt=true + Bearer required.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json(401, { error: "Unauthorized" });
    }

    const payload = await req.json().catch(() => ({}));
    const phone =
      asString(payload.customer_phone) ||
      asString(payload.phone) ||
      asString(payload.to_number);
    const digits = last10(phone);
    if (!digits || digits.length < 10) {
      return json(400, {
        error: "customer_phone is required (10-digit US number)",
      });
    }

    const bookingId =
      asString(payload.booking_id) ||
      asString(payload.agent_booking_id) ||
      asString(payload.id);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return json(500, { error: "Server misconfigured" });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const pattern = phoneIlikePattern(digits);

    const [agentRes, bookingsRes, preRes] = await Promise.all([
      supabase
        .from("agent_bookings")
        .select(
          "id, status, source, customer_name, customer_phone, customer_email, service_type, zip_code, service_address, preferred_date, preferred_time_window, quoted_price_summary, call_summary, details, created_at, updated_at"
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("bookings")
        .select(
          "id, status, customer_info, location_info, booking_details, created_at"
        )
        .ilike("customer_info->>phone", pattern)
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("Prebooking")
        .select("id, status, customer_info, booking_details, created_at")
        .ilike("customer_info->>phone", pattern)
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    if (agentRes.error) {
      console.error("agent_bookings lookup failed", agentRes.error);
      return json(500, {
        error: "Failed to load agent bookings",
        detail: agentRes.error.message,
      });
    }
    if (bookingsRes.error) {
      console.error("bookings lookup failed", bookingsRes.error);
    }
    if (preRes.error) {
      console.error("Prebooking lookup failed", preRes.error);
    }

    let agentBookings = (agentRes.data || [])
      .filter((row) => phonesMatch(row.customer_phone, digits))
      .slice(0, 5)
      .map((row) => ({
        type: "agent_booking",
        id: row.id,
        status: row.status,
        source: row.source,
        customer_name: row.customer_name,
        customer_phone: row.customer_phone,
        customer_email: row.customer_email,
        service_type: row.service_type,
        zip_code: row.zip_code,
        service_address: row.service_address,
        preferred_date: row.preferred_date,
        preferred_time_window: row.preferred_time_window,
        quoted_price_summary: row.quoted_price_summary,
        call_summary: row.call_summary,
        notes: clean(row.details?.notes) || clean(row.details?.details) || null,
        items: summarizeItems(row.details as Record<string, unknown>),
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

    if (bookingId) {
      agentBookings = agentBookings.filter((r) => r.id === bookingId);
      // If filtered out by phone mismatch / limit, fetch by id directly
      if (!agentBookings.length) {
        const byId = await supabase
          .from("agent_bookings")
          .select(
            "id, status, source, customer_name, customer_phone, customer_email, service_type, zip_code, service_address, preferred_date, preferred_time_window, quoted_price_summary, call_summary, details, created_at, updated_at"
          )
          .eq("id", bookingId)
          .maybeSingle();
        if (byId.data && phonesMatch(byId.data.customer_phone, digits)) {
          const row = byId.data;
          agentBookings = [
            {
              type: "agent_booking",
              id: row.id,
              status: row.status,
              source: row.source,
              customer_name: row.customer_name,
              customer_phone: row.customer_phone,
              customer_email: row.customer_email,
              service_type: row.service_type,
              zip_code: row.zip_code,
              service_address: row.service_address,
              preferred_date: row.preferred_date,
              preferred_time_window: row.preferred_time_window,
              quoted_price_summary: row.quoted_price_summary,
              call_summary: row.call_summary,
              notes:
                clean(row.details?.notes) || clean(row.details?.details) || null,
              items: summarizeItems(row.details as Record<string, unknown>),
              created_at: row.created_at,
              updated_at: row.updated_at,
            },
          ];
        }
      }
    }

    const websiteBookings = (bookingsRes.data || [])
      .filter((row) => phonesMatch(row.customer_info?.phone, digits))
      .slice(0, 5)
      .map((row) => {
        const ci = row.customer_info || {};
        const bd = row.booking_details || {};
        const loc = row.location_info || {};
        return {
          type: "website_booking",
          id: row.id,
          status: row.status,
          customer_name: clean(ci.name),
          customer_phone: clean(ci.phone),
          customer_email: clean(ci.email),
          service_type: clean(bd.service_type),
          zip_code: clean(bd.zip_code) || clean(loc.zip) || clean(loc.zip_code),
          service_address: clean(loc.address) || clean(bd.address),
          preferred_date: clean(bd.preferred_date) || clean(bd.date),
          preferred_time_window:
            clean(bd.preferred_time_window) ||
            clean(bd.time_slot) ||
            clean(bd.time_window),
          quoted_price_summary:
            bd.price != null ? `Quoted/est. $${bd.price}` : clean(bd.estimate_summary),
          items: summarizeItems(bd),
          created_at: row.created_at,
        };
      });

    const prebookings = (preRes.data || [])
      .filter((row) => phonesMatch(row.customer_info?.phone, digits))
      .slice(0, 5)
      .map((row) => {
        const ci = row.customer_info || {};
        const bd = row.booking_details || {};
        return {
          type: "prebooking",
          id: row.id,
          status: row.status,
          customer_name: clean(ci.name),
          customer_phone: clean(ci.phone),
          customer_email: clean(ci.email),
          service_type: clean(bd.service_type),
          zip_code: clean(bd.zip_code),
          preferred_date: clean(bd.preferred_date) || clean(bd.date),
          preferred_time_window:
            clean(bd.preferred_time_window) ||
            clean(bd.time_slot) ||
            clean(bd.time_window),
          quoted_price_summary:
            bd.price != null ? `Quoted/est. $${bd.price}` : clean(bd.estimate_summary),
          items: summarizeItems(bd),
          created_at: row.created_at,
        };
      });

    const latest =
      agentBookings[0] || websiteBookings[0] || prebookings[0] || null;

    const summaryParts: string[] = [];
    if (latest) {
      summaryParts.push(
        `Latest ${latest.type} ${latest.id} status=${latest.status}: ${
          latest.customer_name || "unknown"
        }; ${latest.service_type || "service n/a"}; ${
          latest.service_address || latest.zip_code || "address n/a"
        }; ${latest.preferred_date || "date n/a"} ${
          latest.preferred_time_window || ""
        }`.trim()
      );
    } else {
      summaryParts.push("No booking or quote records found for this phone.");
    }
    summaryParts.push(
      `Counts — agent_bookings=${agentBookings.length}, website_bookings=${websiteBookings.length}, prebookings=${prebookings.length}`
    );

    return json(200, {
      ok: true,
      phone: digits,
      found: Boolean(latest),
      summary: summaryParts.join(" | "),
      latest,
      agent_bookings: agentBookings,
      website_bookings: websiteBookings,
      prebookings,
    });
  } catch (err) {
    console.error("lookup-agent-bookings error:", err);
    return json(500, {
      error: "Unexpected error",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
