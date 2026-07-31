import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { isInternalRequest } from "../_shared/auth.ts";

interface WebhookPayload {
  type?: string;
  table?: string;
  schema?: string;
  record?: Record<string, unknown>;
  phone?: string;
  bookingId?: string;
  source?: string;
}

function digitsLast10(phone: unknown): string | null {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  return digits.slice(-10);
}

function phoneFromBookingRecord(table: string, record: Record<string, unknown>): string | null {
  if (table === "agent_bookings") {
    return String(record.customer_phone ?? "").trim() || null;
  }
  const info = (record.customer_info ?? {}) as Record<string, unknown>;
  return String(info.phone ?? "").trim() || null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isInternalRequest(req, { secretEnvVar: "INTERNAL_WEBHOOK_SECRET" })) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const table = String(payload.table || "").trim();
  const record = (payload.record && typeof payload.record === "object"
    ? payload.record
    : {}) as Record<string, unknown>;

  const phone =
    String(payload.phone || "").trim() ||
    (table ? phoneFromBookingRecord(table, record) : null);

  const last10 = digitsLast10(phone);
  if (!last10) {
    return new Response(JSON.stringify({ ok: true, removed: 0, reason: "no_phone" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const bookingId = String(payload.bookingId || record.id || "").trim() || null;
  const source = String(payload.source || table || "booking").trim() || "booking";
  const now = new Date().toISOString();

  const { data: rows, error: listErr } = await supabase
    .from("sms_automation_enrollments")
    .select("id, phone, phone_digits, metadata")
    .eq("category_id", "quote-requests")
    .eq("status", "enrolled")
    .ilike("phone_digits", `%${last10}`);

  if (listErr) {
    console.error("[unenroll-quote-on-booking] list failed", listErr);
    return new Response(JSON.stringify({ error: listErr.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const matches = (rows || []).filter((row) => {
    const d = String(row.phone_digits || "").replace(/\D/g, "");
    return d.slice(-10) === last10;
  });

  if (!matches.length) {
    return new Response(JSON.stringify({ ok: true, removed: 0, reason: "not_enrolled" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  let removed = 0;
  for (const row of matches) {
    const metadata = {
      ...(row.metadata && typeof row.metadata === "object" ? row.metadata : {}),
      removedReason: "new_booking",
      removedByBookingId: bookingId,
      removedBySource: source,
      drip: {
        ...((row.metadata as { drip?: Record<string, unknown> } | null)?.drip || {}),
        status: "completed",
        pauseReason: "new_booking",
        nextSendAt: null,
      },
    };

    const { error: updErr } = await supabase
      .from("sms_automation_enrollments")
      .update({
        status: "removed",
        metadata,
        updated_at: now,
      })
      .eq("id", row.id)
      .eq("status", "enrolled");

    if (updErr) {
      console.error("[unenroll-quote-on-booking] update failed", row.id, updErr);
      continue;
    }
    removed += 1;
  }

  return new Response(
    JSON.stringify({
      ok: true,
      removed,
      phoneLast10: last10,
      bookingId,
      source,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
