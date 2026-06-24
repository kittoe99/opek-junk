import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("EMAIL_FROM") || "Opek Junk Removal <notifications@opekjunkremoval.com>";
const SITE_URL = "https://www.opekjunkremoval.com";
const LOGO_BLACK = `${SITE_URL}/logo1.png`;
const LOGO_WHITE = `${SITE_URL}/opek-logo-plain.png`;
const PHONE = "(831) 318-7139";
const PHONE_LINK = "tel:8313187139";

interface WebhookPayload {
  type: "INSERT" | "UPDATE";
  table: string;
  record: PaymentRecord;
  schema: string;
}

interface PaymentRecord {
  id: string;
  stripe_payment_intent_id: string;
  stripe_charge_id?: string | null;
  amount_cents: number;
  currency: string;
  status: string;
  payment_type?: string | null;
  service_type?: string | null;
  customer_email?: string | null;
  customer_id?: string | null;
  booking_id?: string | null;
  metadata?: Record<string, string> | null;
  receipt_sent_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

const esc = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const emailLayout = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:28px 32px 20px;border-bottom:1px solid #f0f0f0;">
          <img src="${LOGO_BLACK}" alt="Opek Junk Removal" width="120" style="display:block;height:auto;" />
        </td></tr>
        <tr><td style="padding:28px 32px;">${body}</td></tr>
        <tr><td style="background:#111;padding:24px 32px;border-radius:0 0 8px 8px;">
          <img src="${LOGO_WHITE}" alt="Opek" width="80" style="display:block;height:auto;margin-bottom:12px;" />
          <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">${PHONE} &middot; Support@opekjunkremoval.com</p>
          <p style="margin:0;font-size:11px;color:#71717a;">Payment receipt from opekjunkremoval.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const heading = (text: string) =>
  `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#111;line-height:1.3;">${esc(text)}</h1>`;

const paragraph = (text: string) =>
  `<p style="margin:0 0 14px;font-size:14px;color:#374151;line-height:1.6;">${text}</p>`;

const detailRow = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;vertical-align:top;width:130px;">${esc(label)}</td><td style="padding:6px 0;font-size:13px;color:#111;font-weight:600;">${value ? esc(value) : "\u2014"}</td></tr>`;

const detailsBlock = (rows: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;padding:16px;background:#fafafa;border-radius:6px;border:1px solid #f0f0f0;">${rows}</table>`;

const ctaLink = (text: string, url: string) =>
  `<p style="margin:20px 0 0;"><a href="${url}" style="display:inline-block;background:#111;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">${text}</a></p>`;

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(value?: string | null): string {
  if (!value) return new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  try {
    return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return value;
  }
}

function paymentLabel(paymentType?: string | null): string {
  if (paymentType === "booking_deposit") return "Booking deposit";
  return "Payment";
}

function buildReceiptEmail(input: {
  name: string;
  email: string;
  payment: PaymentRecord;
  orderNumber?: string | null;
  serviceType?: string | null;
}): { subject: string; html: string } {
  const firstName = input.name.split(" ")[0] || "there";
  const amount = formatAmount(input.payment.amount_cents, input.payment.currency || "usd");
  const label = paymentLabel(input.payment.payment_type);
  const service = input.serviceType || input.payment.service_type || "Junk Removal";
  const paidAt = formatDate(input.payment.updated_at || input.payment.created_at);
  const reference = input.payment.stripe_payment_intent_id;

  return {
    subject: `Payment receipt — ${amount} (${label})`,
    html: emailLayout(
      heading(`Thanks, ${firstName}!`) +
        paragraph(`We received your <strong>${esc(label.toLowerCase())}</strong> of <strong>${esc(amount)}</strong>. This email is your receipt for your records.`) +
        detailsBlock(
          detailRow("Amount paid", amount) +
            detailRow("Payment type", label) +
            detailRow("Service", service) +
            (input.orderNumber ? detailRow("Order number", input.orderNumber) : "") +
            detailRow("Date", paidAt) +
            detailRow("Reference", reference)
        ) +
        paragraph("Your booking is being processed. A matched provider will contact you shortly to confirm arrival details.") +
        ctaLink("Track your order", `${SITE_URL}/track-order`) +
        `<p style="margin:20px 0 0;font-size:13px;color:#6b7280;">Questions about this charge? Call us at <a href="${PHONE_LINK}" style="color:#111;font-weight:600;text-decoration:none;">${PHONE}</a> or reply to this email.</p>`
    ),
  };
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log("--- MOCK PAYMENT RECEIPT ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    return { mock: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Resend error:", data);
    throw new Error(JSON.stringify(data));
  }
  return data;
}

Deno.serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();
    const payment = payload.record;

    if (payload.table !== "payments" || payment.status !== "succeeded") {
      return new Response(JSON.stringify({ skipped: true, reason: "Not a succeeded payment" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (payment.receipt_sent_at) {
      return new Response(JSON.stringify({ skipped: true, reason: "Receipt already sent" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let customerName =
      payment.metadata?.customer_name ||
      payment.metadata?.customer_email?.split("@")[0] ||
      "Customer";
    let customerEmail = payment.customer_email || payment.metadata?.customer_email || "";

    if (payment.customer_id) {
      const { data: customer } = await supabase
        .from("stripe_customers")
        .select("email, name")
        .eq("id", payment.customer_id)
        .maybeSingle();

      if (customer?.email) customerEmail = customer.email;
      if (customer?.name) customerName = customer.name;
    }

    customerEmail = customerEmail.trim();
    if (!customerEmail || !customerEmail.includes("@")) {
      return new Response(JSON.stringify({ error: "No customer email for receipt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let orderNumber: string | null = null;
    let serviceType = payment.service_type;

    if (payment.booking_id) {
      const { data: booking } = await supabase
        .from("bookings")
        .select("order_number, booking_details")
        .eq("id", payment.booking_id)
        .maybeSingle();

      orderNumber = booking?.order_number ?? null;
      const details = booking?.booking_details as Record<string, unknown> | null;
      if (!serviceType && typeof details?.service_type === "string") {
        serviceType = details.service_type;
      }
    }

    const { subject, html } = buildReceiptEmail({
      name: customerName,
      email: customerEmail,
      payment,
      orderNumber,
      serviceType,
    });

    const sendResult = await sendEmail(customerEmail, subject, html);

    const { error: updateError } = await supabase
      .from("payments")
      .update({ receipt_sent_at: new Date().toISOString() })
      .eq("id", payment.id)
      .is("receipt_sent_at", null);

    if (updateError) {
      console.error("Failed to mark receipt_sent_at:", updateError);
    }

    return new Response(
      JSON.stringify({ success: true, recipient: customerEmail, sendResult }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-payment-receipt error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
