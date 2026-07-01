import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const NOTIFY_EMAIL = 'support@opekjunkremoval.com';
const FROM_EMAIL = Deno.env.get('EMAIL_FROM') || 'Opek Junk Removal <notifications@opekjunkremoval.com>';
const SITE_URL = 'https://opekjunkremoval.com';
const LOGO_BLACK = `${SITE_URL}/logo1.png`;
const LOGO_WHITE = `${SITE_URL}/opek-logo-plain.png`;
const PHONE = '(831) 318-7139';
const PHONE_LINK = 'tel:8313187139';

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: Record<string, any>;
  schema: string;
}

// Escape user-controlled values before interpolating into HTML email bodies.
const esc = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatPreferredSchedule = (date?: string, time?: string): string => {
  if (!date) return '';
  return time ? `${date} (${time})` : date;
};

// --- Clean email layout ---

const emailLayout = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <!-- Header with logo -->
        <tr><td style="padding:28px 32px 20px;border-bottom:1px solid #f0f0f0;">
          <img src="${LOGO_BLACK}" alt="Opek Junk Removal" width="120" style="display:block;height:auto;" />
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:28px 32px;">
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#111;padding:24px 32px;border-radius:0 0 8px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td>
              <img src="${LOGO_WHITE}" alt="Opek" width="80" style="display:block;height:auto;margin-bottom:12px;" />
              <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">${PHONE} &middot; Support@opekjunkremoval.com</p>
              <p style="margin:0;font-size:11px;color:#71717a;">This is a transactional email from opekjunkremoval.com</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

const heading = (text: string) =>
  `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#111;line-height:1.3;">${esc(text)}</h1>`;

const paragraph = (text: string) =>
  `<p style="margin:0 0 14px;font-size:14px;color:#374151;line-height:1.6;">${text}</p>`;

const detailRow = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;font-size:13px;color:#6b7280;vertical-align:top;width:120px;">${esc(label)}</td><td style="padding:6px 0;font-size:13px;color:#111;">${value ? esc(value) : '\u2014'}</td></tr>`;

const detailsBlock = (rows: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;padding:16px;background:#fafafa;border-radius:6px;border:1px solid #f0f0f0;">${rows}</table>`;

const ctaLink = (text: string, url: string) =>
  `<p style="margin:20px 0 0;"><a href="${url}" style="display:inline-block;background:#111;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">${text}</a></p>`;

const signoff = `<p style="margin:20px 0 0;font-size:13px;color:#6b7280;">\u2014 Opek Junk Removal</p>`;

const steps = (items: string[]) => {
  let html = '<ol style="margin:12px 0 0;padding-left:18px;">';
  items.forEach(item => { html += `<li style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:2px;">${item}</li>`; });
  html += '</ol>';
  return html;
};

const formatDate = (d: string | null) => {
  if (!d) return null;
  try { return new Date(d).toLocaleString('en-US', { timeZone: 'America/Denver', dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return d; }
};

// --- ADMIN emails ---

function adminContact(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const contact = r.contact_info || {};
  return {
    subject: `Contact form: ${customer.name || ''}`,
    html: emailLayout(
      heading('New contact submission') +
      detailsBlock(
        detailRow('Name', customer.name) +
        detailRow('Email', customer.email) +
        detailRow('Phone', customer.phone) +
        detailRow('Message', contact.message)
      ) +
      paragraph(`Submitted ${formatDate(r.created_at) || 'just now'}.`)
    ),
  };
}

function adminQuote(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const location = r.location_info || {};
  const visit = r.visit_details || r.estimate_details || {};
  const visitDate = visit.preferred_date ? (visit.preferred_date + (visit.preferred_time ? ` (${visit.preferred_time})` : '')) : '';
  const visitDetails = visit.details || visit.message || '';
  return {
    subject: `Quote request: ${customer.name || ''}`,
    html: emailLayout(
      heading('New quote request') +
      detailsBlock(
        detailRow('Name', customer.name) +
        detailRow('Email', customer.email) +
        detailRow('Phone', customer.phone) +
        detailRow('Address', location.address) +
        detailRow('Zip', location.zip_code) +
        detailRow('Preferred date', visitDate) +
        detailRow('Details', visitDetails)
      ) +
      paragraph(`Submitted ${formatDate(r.created_at) || 'just now'}.`)
    ),
  };
}

function adminProvider(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const provider = r.provider_info || {};
  const a = provider.availability || {};
  return {
    subject: `Provider application: ${customer.name || ''}`,
    html: emailLayout(
      heading('New provider application') +
      detailsBlock(
        detailRow('Name', customer.name) +
        detailRow('Email', customer.email) +
        detailRow('Phone', customer.phone) +
        detailRow('Service area', provider.service_area) +
        detailRow('Vehicle', provider.vehicle_type) +
        detailRow('Business', a.businessName) +
        detailRow('Schedule', Array.isArray(a.schedule) ? a.schedule.join(', ') : '') +
        detailRow('Notes', a.additionalInfo)
      ) +
      paragraph(`Submitted ${formatDate(r.created_at) || 'just now'}.`)
    ),
  };
}

function formatItemList(details: Record<string, any>): string {
  if (Array.isArray(details.estimated_items) && details.estimated_items.length > 0) {
    return details.estimated_items.join(', ');
  }
  if (Array.isArray(details.items) && details.items.length > 0) {
    return details.items
      .map((item: { name?: string; quantity?: number }) => {
        const qty = item.quantity && item.quantity > 1 ? `${item.quantity}x ` : '';
        return `${qty}${item.name || ''}`.trim();
      })
      .filter(Boolean)
      .join(', ');
  }
  return '';
}

function formatPhotoField(details: Record<string, unknown>): string {
  const photoUrl = typeof details.photo_url === 'string' ? details.photo_url.trim() : '';
  const extraPhotoUrls = Array.isArray(details.photo_urls)
    ? details.photo_urls.filter((url): url is string => typeof url === 'string' && url.trim() !== '')
    : [];
  const allPhotoUrls = photoUrl
    ? [photoUrl, ...extraPhotoUrls.filter((url) => url !== photoUrl)]
    : extraPhotoUrls;

  if (allPhotoUrls.length > 1) {
    return allPhotoUrls.map((url, index) => `Photo ${index + 1}: ${url}`).join('\n');
  }

  return allPhotoUrls[0] || '';
}

function adminBooking(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const location = r.location_info || {};
  const details = r.booking_details || {};
  
  const fullAddress = [
    location.address,
    location.unit_number,
    location.city,
    location.state,
    location.zip_code
  ].filter(Boolean).join(', ');

  const priceVal = details.price ? `$${details.price}` : '';
  const depositVal = details.deposit_amount ? `$${details.deposit_amount}` : '';
  const photoDisplay = formatPhotoField(details);
  const items = formatItemList(details);

  return {
    subject: `New booking: ${customer.name || ''}${r.order_number ? ` (${r.order_number})` : ''}`,
    html: emailLayout(
      heading('New booking received') +
      detailsBlock(
        detailRow('Order #', r.order_number) +
        detailRow('Name', customer.name) +
        detailRow('Email', customer.email) +
        detailRow('Phone', customer.phone) +
        detailRow('Service', details.service_type) +
        detailRow('Address', fullAddress) +
        detailRow('Zip', location.zip_code) +
        detailRow('Date', formatPreferredSchedule(details.preferred_date, details.preferred_time)) +
        detailRow('Est. price', priceVal) +
        detailRow('Deposit', details.deposit_paid ? (depositVal || 'Paid') : '') +
        detailRow('Payment ID', details.stripe_payment_intent_id) +
        detailRow('Items', items) +
        detailRow('Volume', details.estimated_volume) +
        detailRow('Photo', photoDisplay) +
        detailRow('Details', details.details)
      ) +
      paragraph(`Submitted ${formatDate(r.created_at) || 'just now'}.`)
    ),
  };
}

function adminPrebooking(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const details = r.booking_details || {};
  const priceVal = details.price ? `$${details.price}` : '';
  const items = formatItemList(details);

  return {
    subject: `New lead: ${customer.name || 'Unknown'}${details.service_type ? ` — ${details.service_type}` : ''}`,
    html: emailLayout(
      heading('New prebooking / lead') +
      detailsBlock(
        detailRow('Status', r.status) +
        detailRow('Name', customer.name) +
        detailRow('Email', customer.email) +
        detailRow('Phone', customer.phone) +
        detailRow('Service', details.service_type) +
        detailRow('Zip', details.zip_code) +
        detailRow('Est. price', priceVal) +
        detailRow('Items', items) +
        detailRow('Volume', details.estimated_volume) +
        detailRow('Photo', formatPhotoField(details)) +
        detailRow('Summary', details.estimate_summary) +
        detailRow('Details', details.details)
      ) +
      paragraph(`Submitted ${formatDate(r.created_at) || 'just now'}.`)
    ),
  };
}

// --- USER confirmation emails ---

function userContact(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const contact = r.contact_info || {};
  const name = (customer.name || '').split(' ')[0] || 'there';
  const parts = (contact.message || '').split(':');
  const subj = parts[0] || '';
  const msg = parts.slice(1).join(':').trim() || '';
  return {
    subject: `We received your message, ${name}`,
    html: emailLayout(
      heading(`Hi ${name}, we got your message`) +
      paragraph('Thank you for reaching out. Our team will review your inquiry and get back to you within 30 minutes during business hours (7 AM\u20137 PM, 7 days a week).') +
      detailsBlock(
        detailRow('Subject', subj) +
        detailRow('Message', msg)
      ) +
      paragraph('If you need an immediate response, give us a call.') +
      ctaLink(`Call ${PHONE}`, PHONE_LINK) +
      signoff
    ),
  };
}

function userQuote(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const location = r.location_info || {};
  const visit = r.visit_details || r.estimate_details || {};
  const name = (customer.name || '').split(' ')[0] || 'there';
  const visitDate = visit.preferred_date ? (visit.preferred_date + (visit.preferred_time ? ` (${visit.preferred_time})` : '')) : '';
  const visitDetails = visit.details || visit.message || '';
  return {
    subject: `Your quote request is confirmed, ${name}`,
    html: emailLayout(
      heading(`Hi ${name}, we received your quote request`) +
      paragraph('A local provider will reach out shortly to discuss pricing and schedule your pickup. No obligation, no hidden fees.') +
      detailsBlock(
        detailRow('Address', location.address) +
        detailRow('Zip', location.zip_code) +
        detailRow('Preferred date', visitDate) +
        detailRow('Details', visitDetails)
      ) +
      paragraph('<strong>What happens next:</strong>') +
      steps([
        'We match you with a local provider',
        'You receive a call or text to confirm pricing',
        'We show up on time and get the job done',
      ]) +
      ctaLink(`Call ${PHONE}`, PHONE_LINK) +
      signoff
    ),
  };
}

function userProvider(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const provider = r.provider_info || {};
  const name = (customer.name || '').split(' ')[0] || 'there';
  return {
    subject: `Application received, ${name}`,
    html: emailLayout(
      heading(`Welcome, ${name}`) +
      paragraph('Thank you for applying to the Opek provider network. We\u2019re reviewing your application and will follow up within 1\u20132 business days.') +
      detailsBlock(
        detailRow('Service area', provider.service_area) +
        detailRow('Vehicle', provider.vehicle_type)
      ) +
      paragraph('<strong>What happens next:</strong>') +
      steps([
        'Our team reviews your application',
        'We verify your info and insurance',
        'Once approved, you start receiving jobs in your area',
      ]) +
      paragraph('Questions? Reply to this email or call our recruiting team.') +
      ctaLink('Call recruiting', PHONE_LINK) +
      signoff
    ),
  };
}

function userBooking(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const location = r.location_info || {};
  const details = r.booking_details || {};

  const fullAddress = [
    location.address,
    location.unit_number,
    location.city,
    location.state,
    location.zip_code
  ].filter(Boolean).join(', ');

  const name = (customer.name || '').split(' ')[0] || 'there';
  const priceVal = details.price ? `$${details.price}` : '';
  const depositVal = details.deposit_amount ? `$${details.deposit_amount}` : '';

  return {
    subject: `Booking confirmed, ${name}`,
    html: emailLayout(
      heading(`Hi ${name}, your pickup is scheduled`) +
      paragraph('Your junk removal booking is confirmed.') +
      detailsBlock(
        detailRow('Service', details.service_type) +
        detailRow('Address', fullAddress) +
        detailRow('Date', formatPreferredSchedule(details.preferred_date, details.preferred_time)) +
        (priceVal ? detailRow('Est. price', priceVal) : '') +
        (details.deposit_paid ? detailRow('Deposit paid', depositVal || 'Yes') : '') +
        detailRow('Items', formatItemList(details)) +
        detailRow('Details', details.details)
      ) +
      paragraph('<strong>What to expect:</strong>') +
      steps([
        'Provider details will be sent after been matched.',
        'They arrive on time at your scheduled date',
        'Junk is removed and recycled responsibly',
      ]) +
      paragraph('Need to reschedule? Call us anytime.') +
      ctaLink(`Call ${PHONE}`, PHONE_LINK) +
      signoff
    ),
  };
}

function userPrebooking(r: Record<string, any>): { subject: string; html: string } {
  const customer = r.customer_info || {};
  const details = r.booking_details || {};
  const name = (customer.name || '').split(' ')[0] || 'there';
  const priceVal = details.price ? `$${details.price}` : '';

  return {
    subject: `We received your request, ${name}`,
    html: emailLayout(
      heading(`Hi ${name}, we got your info`) +
      paragraph('Thanks for starting your request with Opek. A local provider will follow up shortly to confirm pricing and next steps.') +
      detailsBlock(
        detailRow('Service', details.service_type) +
        detailRow('Zip', details.zip_code) +
        (priceVal ? detailRow('Est. price', priceVal) : '') +
        detailRow('Items', formatItemList(details)) +
        detailRow('Details', details.details)
      ) +
      ctaLink(`Call ${PHONE}`, PHONE_LINK) +
      signoff
    ),
  };
}

// --- Send helper ---

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Resend error (${to}):`, data);
    throw new Error(JSON.stringify(data));
  }
  return data;
}

// --- Main handler ---

Deno.serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();
    const { table, record } = payload;

    let admin: { subject: string; html: string };
    let user: { subject: string; html: string };

    switch (table) {
      case 'contacts':
        admin = adminContact(record);
        user = userContact(record);
        break;
      case 'schedule_visits':
      case 'in_home_estimates':
        admin = adminQuote(record);
        user = userQuote(record);
        break;
      case 'provider_signups':
        admin = adminProvider(record);
        user = userProvider(record);
        break;
      case 'bookings':
        admin = adminBooking(record);
        user = userBooking(record);
        break;
      case 'Prebooking':
        admin = adminPrebooking(record);
        user = userPrebooking(record);
        break;
      default:
        return new Response(JSON.stringify({ error: `Unknown table: ${table}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    const recipientEmail = record.customer_info?.email?.trim();
    const shouldEmailUser =
      recipientEmail &&
      recipientEmail.toLowerCase() !== NOTIFY_EMAIL.toLowerCase();

    const results = await Promise.allSettled([
      sendEmail(NOTIFY_EMAIL, admin.subject, admin.html),
      shouldEmailUser
        ? sendEmail(recipientEmail, user.subject, user.html)
        : Promise.resolve({ skipped: true, reason: 'No customer email or same as company inbox' }),
    ]);

    return new Response(JSON.stringify({
      success: true,
      admin: results[0].status === 'fulfilled' ? results[0].value : { error: (results[0] as PromiseRejectedResult).reason?.message },
      user: results[1].status === 'fulfilled' ? results[1].value : { error: (results[1] as PromiseRejectedResult).reason?.message },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
