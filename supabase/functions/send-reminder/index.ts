import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("EMAIL_FROM") || "Opek Junk Removal <notifications@opekjunkremoval.com>";
const SITE_URL = "https://opekjunkremoval.com";
const LOGO_BLACK = `${SITE_URL}/logo1.png`;
const LOGO_WHITE = `${SITE_URL}/opek-logo-plain.png`;
const PHONE = "(831) 318-7139";
const PHONE_LINK = "tel:8313187139";

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
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

interface ReminderPayload {
  type: "appointment_reminder";
  record: {
    email: string;
    name?: string;
    order_number?: string;
    preferred_date?: string;
    preferred_time?: string;
    address?: string;
    phone?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const payload: ReminderPayload = await req.json();
    const { type, record } = payload;

    if (type !== "appointment_reminder" || !record?.email) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const name = (record.name || "there").split(" ")[0];
    const schedule = [record.preferred_date, record.preferred_time].filter(Boolean).join(" ");
    const subject = schedule
      ? `Reminder: your Opek pickup on ${record.preferred_date}`
      : "Reminder: your upcoming Opek junk removal";

    const html = emailLayout(`
      <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#111;">Hi ${esc(name)}, this is a friendly reminder</h1>
      <p style="margin:0 0 14px;font-size:14px;color:#374151;line-height:1.6;">
        Your junk removal appointment${schedule ? ` is scheduled for <strong>${esc(schedule)}</strong>` : " is coming up"}.
      </p>
      ${record.order_number ? `<p style="margin:0 0 14px;font-size:14px;color:#374151;">Order: <strong>${esc(record.order_number)}</strong></p>` : ""}
      ${record.address ? `<p style="margin:0 0 14px;font-size:14px;color:#374151;">Location: ${esc(record.address)}</p>` : ""}
      <p style="margin:0 0 14px;font-size:14px;color:#374151;line-height:1.6;">
        Please ensure items are accessible. Need to reschedule? Call us at
        <a href="${PHONE_LINK}" style="color:#ff5a1f;">${PHONE}</a>.
      </p>
    `);

    if (!RESEND_API_KEY) {
      console.log("Mock reminder to:", record.email, subject);
      return new Response(JSON.stringify({ success: true, mock: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [record.email],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
