import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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

async function hashCode(code: string, pepper: string): Promise<string> {
  const data = new TextEncoder().encode(`${pepper}:${code}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateOtp(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(n).padStart(6, "0");
}

async function sendOtpSms(phone: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const smsUrl = (Deno.env.get("OPEK_SMS_URL") || "https://opek-sms-zllz4.ondigitalocean.app").replace(
    /\/$/,
    "",
  );
  const apiKey = Deno.env.get("OPEK_SMS_API_KEY");
  if (!apiKey) {
    return { ok: false, error: "SMS not configured" };
  }

  const body =
    `Your Opek verification code is ${code}. Expires in 10 minutes.\n\n` +
    "Msg & data rates may apply. Reply STOP to opt out, HELP for help.";

  try {
    const upstream = await fetch(`${smsUrl}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        phone,
        body,
        categoryId: "quote-requests",
      }),
    });
    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("[lookup-quote-otp] SMS upstream error", upstream.status, text);
      return { ok: false, error: "Failed to send SMS" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[lookup-quote-otp] SMS fetch failed", err);
    return { ok: false, error: "Failed to reach SMS server" };
  }
}

type PrebookingRow = {
  id: string;
  status: string;
  customer_info: Record<string, unknown> | null;
  booking_details: Record<string, unknown> | null;
  created_at: string;
};

async function findLatestOpenPrebooking(
  supabase: ReturnType<typeof createClient>,
  digits: string,
): Promise<PrebookingRow | null> {
  const pattern = phoneIlikePattern(digits);
  const { data, error } = await supabase
    .from("Prebooking")
    .select("id, status, customer_info, booking_details, created_at")
    .ilike("customer_info->>phone", pattern)
    .neq("status", "converted")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[lookup-quote-otp] Prebooking lookup failed", error);
    throw new Error(error.message);
  }

  const match = (data || []).find((row) => phonesMatch(row.customer_info?.phone, digits));
  return (match as PrebookingRow | undefined) ?? null;
}

function shapePayload(row: PrebookingRow) {
  const ci = row.customer_info || {};
  const bd = row.booking_details || {};
  return {
    id: row.id,
    created_at: row.created_at,
    customer_info: {
      name: ci.name ?? null,
      phone: ci.phone ?? null,
      email: ci.email ?? null,
      sms_marketing_consent: ci.sms_marketing_consent ?? null,
      sms_marketing_consent_at: ci.sms_marketing_consent_at ?? null,
    },
    booking_details: {
      service_type: bd.service_type ?? null,
      zip_code: bd.zip_code ?? null,
      estimated_items: bd.estimated_items ?? bd.items ?? null,
      estimated_volume: bd.estimated_volume ?? null,
      price: bd.price ?? null,
      estimate_summary: bd.estimate_summary ?? null,
      subtotal: bd.subtotal ?? null,
      online_booking_discount: bd.online_booking_discount ?? null,
      photos: bd.photos ?? null,
      photo_url: bd.photo_url ?? null,
      moving_options: bd.moving_options ?? null,
      details: bd.details ?? null,
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json(401, { error: "Unauthorized" });
  }

  let body: { action?: string; phone?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const action = String(body.action || "").trim();
  const digits = last10(body.phone);
  if (digits.length < 10) {
    return json(400, { error: "A valid 10-digit phone number is required", reason: "invalid_phone" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json(500, { error: "Server misconfigured" });
  }

  const pepper = Deno.env.get("QUOTE_LOOKUP_OTP_PEPPER") || serviceKey;
  const supabase = createClient(supabaseUrl, serviceKey);
  const displayPhone = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;

  try {
    if (action === "request_otp") {
      const open = await findLatestOpenPrebooking(supabase, digits);
      if (!open) {
        return json(200, { ok: false, reason: "no_quote" });
      }

      const { data: recent } = await supabase
        .from("quote_lookup_otps")
        .select("id, created_at")
        .eq("phone_digits", digits)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recent?.created_at) {
        const age = Date.now() - new Date(recent.created_at).getTime();
        if (age < RESEND_COOLDOWN_MS) {
          return json(429, {
            ok: false,
            reason: "rate_limited",
            error: "Please wait a moment before requesting another code.",
            retry_after_seconds: Math.ceil((RESEND_COOLDOWN_MS - age) / 1000),
          });
        }
      }

      const code = generateOtp();
      const code_hash = await hashCode(code, pepper);
      const expires_at = new Date(Date.now() + OTP_TTL_MS).toISOString();

      const { error: insertErr } = await supabase.from("quote_lookup_otps").insert({
        phone_digits: digits,
        code_hash,
        expires_at,
        attempts: 0,
      });

      if (insertErr) {
        console.error("[lookup-quote-otp] insert failed", insertErr);
        return json(500, { error: "Failed to create verification code" });
      }

      const sms = await sendOtpSms(displayPhone, code);
      if (!sms.ok) {
        return json(502, { ok: false, reason: "sms_failed", error: sms.error || "Failed to send SMS" });
      }

      return json(200, { ok: true });
    }

    if (action === "verify_otp") {
      const code = String(body.code || "").replace(/\D/g, "");
      if (code.length !== 6) {
        return json(400, { ok: false, reason: "invalid_code", error: "Enter the 6-digit code." });
      }

      const { data: otpRow, error: otpErr } = await supabase
        .from("quote_lookup_otps")
        .select("id, code_hash, expires_at, attempts")
        .eq("phone_digits", digits)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (otpErr) {
        console.error("[lookup-quote-otp] otp fetch failed", otpErr);
        return json(500, { error: "Verification failed" });
      }

      if (!otpRow) {
        return json(400, { ok: false, reason: "no_otp", error: "Request a new code first." });
      }

      if (new Date(otpRow.expires_at).getTime() < Date.now()) {
        await supabase.from("quote_lookup_otps").delete().eq("id", otpRow.id);
        return json(400, { ok: false, reason: "expired", error: "That code expired. Request a new one." });
      }

      if ((otpRow.attempts ?? 0) >= MAX_ATTEMPTS) {
        await supabase.from("quote_lookup_otps").delete().eq("id", otpRow.id);
        return json(400, {
          ok: false,
          reason: "locked",
          error: "Too many attempts. Request a new code.",
        });
      }

      const expected = await hashCode(code, pepper);
      if (expected !== otpRow.code_hash) {
        await supabase
          .from("quote_lookup_otps")
          .update({ attempts: (otpRow.attempts ?? 0) + 1 })
          .eq("id", otpRow.id);
        return json(400, { ok: false, reason: "wrong_code", error: "Incorrect code. Try again." });
      }

      await supabase.from("quote_lookup_otps").delete().eq("phone_digits", digits);

      const open = await findLatestOpenPrebooking(supabase, digits);
      if (!open) {
        return json(200, { ok: false, reason: "no_quote" });
      }

      return json(200, { ok: true, prebooking: shapePayload(open) });
    }

    return json(400, { error: "Unknown action. Use request_otp or verify_otp." });
  } catch (err) {
    console.error("[lookup-quote-otp] exception", err);
    return json(500, {
      error: "Lookup failed",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
});
