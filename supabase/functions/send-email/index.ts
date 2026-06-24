import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DEFAULT_ALLOWED_ORIGINS = [
  'https://opekjunkremoval.com',
  'https://www.opekjunkremoval.com',
]

function getAllowedOrigins(): string[] {
  const fromEnv = Deno.env.get('ALLOWED_ORIGINS')
  if (fromEnv) {
    return fromEnv.split(',').map((o) => o.trim()).filter(Boolean)
  }
  return DEFAULT_ALLOWED_ORIGINS
}

function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || ''
  const allowed = getAllowedOrigins()
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0]
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  }
}

// Escape user-controlled values before interpolating into HTML email bodies.
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeRecord(record: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [key, value] of Object.entries(record || {})) {
    out[key] = typeof value === 'string' ? esc(value) : value
  }
  return out
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req)

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { type } = payload
    const rawRecord = payload.record

    if (!type || !rawRecord) {
      return new Response(
        JSON.stringify({ error: 'Missing type or record in payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitized copy used for HTML rendering; raw email kept only for routing.
    const record = sanitizeRecord(rawRecord)

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('EMAIL_FROM') || 'Opek <onboarding@resend.dev>'
    
    let subject = ''
    let toEmail = (typeof rawRecord.email === 'string' ? rawRecord.email : '').trim()
    const toEmailDisplay = esc(toEmail)
    let htmlContent = ''

    if (!toEmail) {
      return new Response(
        JSON.stringify({ error: 'No recipient email found in record' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Header and footer shared template parts
    const headerHtml = `
      <div style="background-color: #111827; padding: 32px 24px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; font-size: 28px; font-weight: 900; letter-spacing: -0.025em;">
          Opek<span style="color: #ff5a1f;">.</span>
        </h1>
        <p style="color: #9ca3af; margin: 4px 0 0 0; font-family: sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;">
          Junk Removal & Hauling
        </p>
      </div>
    `

    const footerHtml = `
      <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border-top: 1px solid #f3f4f6;">
        <p style="color: #4b5563; margin: 0 0 8px 0; font-family: sans-serif; font-size: 14px; font-weight: 700;">
          Need assistance?
        </p>
        <p style="color: #6b7280; margin: 0 0 16px 0; font-family: sans-serif; font-size: 13px;">
          Call us at <a href="tel:8313187139" style="color: #ff5a1f; text-decoration: none; font-weight: 700;">(831) 318-7139</a> or reply to this email.
        </p>
        <p style="color: #9ca3af; margin: 0; font-family: sans-serif; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Opek Junk Removal. All rights reserved.
        </p>
      </div>
    `

    if (type === 'booking') {
      const orderNumber = record.order_number || 'OPK-BOOKING'
      subject = `Booking Confirmed - Order ${orderNumber}`
      
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${headerHtml}
          <div style="padding: 32px 24px; color: #1f2937;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 8px; color: #111827;">
              Booking Confirmed!
            </h2>
            <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-top: 0; margin-bottom: 24px;">
              Hi ${record.name || 'Customer'}, thank you for booking with Opek. A matched provider will contact you shortly to confirm the exact arrival window.
            </p>
            
            <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; width: 40%;">Order Number</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 700; font-family: monospace; font-size: 15px;">${orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Service</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 700;">${record.service_type || 'Junk Removal'}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Preferred Date</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 700;">${record.preferred_date ? `${record.preferred_date}${record.preferred_time ? ` (${record.preferred_time})` : ''}` : 'TBD'}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Location</td>
                  <td style="color: #111827; padding-bottom: 8px;">${record.address}${record.unit_number ? ', ' + record.unit_number : ''}, ${record.city || ''}, ${record.state || ''} ${record.zip_code || ''}</td>
                </tr>
                ${record.price ? `
                <tr style="border-top: 1px solid #e5e7eb;">
                  <td style="color: #6b7280; padding-top: 12px; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Estimated Price</td>
                  <td style="color: #ff5a1f; padding-top: 12px; font-weight: 800; font-size: 16px;">$${record.price}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            ${record.details ? `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6b7280; margin-top: 0; margin-bottom: 6px; letter-spacing: 0.05em;">Details / Notes</h3>
              <p style="font-size: 13px; line-height: 1.5; color: #4b5563; margin: 0; background-color: #f9fafb; padding: 12px; border-radius: 4px; border-left: 3px solid #ff5a1f; white-space: pre-line;">${record.details}</p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://opekjunkremoval.com/track-order" style="background-color: #111827; color: #ffffff; padding: 12px 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; text-decoration: none; border-radius: 6px; letter-spacing: 0.05em; display: inline-block;">
                Track Your Order
              </a>
            </div>
          </div>
          ${footerHtml}
        </div>
      `
    } else if (type === 'contact') {
      subject = `Message Received - Opek Support`
      
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${headerHtml}
          <div style="padding: 32px 24px; color: #1f2937;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 8px; color: #111827;">
              Thank you for contacting us!
            </h2>
            <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-top: 0; margin-bottom: 24px;">
              Hi ${record.name || 'there'}, we have received your message. Our team is on it and one of our agents will respond to you within 30 minutes during standard business hours.
            </p>
            
            <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 20px;">
              <h3 style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6b7280; margin-top: 0; margin-bottom: 8px; letter-spacing: 0.05em;">Message Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700; width: 30%;">Name</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.name || ''}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700;">Email</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.email || ''}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700;">Phone</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.phone || ''}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-top: 8px; font-weight: 700; vertical-align: top;">Message</td>
                  <td style="color: #111827; padding-top: 8px; white-space: pre-line; line-height: 1.4;">${record.message || ''}</td>
                </tr>
              </table>
            </div>
          </div>
          ${footerHtml}
        </div>
      `
    } else if (type === 'provider_signup') {
      subject = `Provider Application Received`
      
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          ${headerHtml}
          <div style="padding: 32px 24px; color: #1f2937;">
            <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 8px; color: #111827;">
              Welcome Aboard!
            </h2>
            <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-top: 0; margin-bottom: 24px;">
              Hi ${record.name || 'Provider'}, thank you for applying to join the Opek Provider Network. 
              We've received your application and will review it within 1–2 business days.
            </p>
            
            <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
              <h3 style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6b7280; margin-top: 0; margin-bottom: 8px; letter-spacing: 0.05em;">Application Summary</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700; width: 45%;">Applicant Name</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.name || ''}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700;">Email</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.email || ''}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700;">Phone</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.phone || ''}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700;">Service Area</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.service_area || ''}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; padding-bottom: 8px; font-weight: 700;">Vehicle Type</td>
                  <td style="color: #111827; padding-bottom: 8px; font-weight: 600;">${record.vehicle_type || ''}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 13px; line-height: 1.5; color: #4b5563; margin-top: 0; margin-bottom: 0;">
              Once approved, you'll be set up to browse and claim available jobs in your service area. We look forward to working with you!
            </p>
          </div>
          ${footerHtml}
        </div>
      `
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid notification type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (resendApiKey) {
      const toRecipients = [toEmail];
      if (toEmail.toLowerCase() !== 'support@opekjunkremoval.com') {
        toRecipients.push('support@opekjunkremoval.com');
      }
      console.log(`Sending real email using Resend to: ${toRecipients.join(', ')}`);
      let response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toRecipients,
          subject: subject,
          html: htmlContent,
        }),
      })

      let resText = await response.text()
      
      // Handle Resend Sandbox / 403 Unverified Domain restriction gracefully
      if (!response.ok && response.status === 403) {
        let isValidationError = false;
        try {
          const parsed = JSON.parse(resText);
          if (parsed.name === 'validation_error' || (parsed.message && parsed.message.includes('testing emails'))) {
            isValidationError = true;
          }
        } catch (_) {
          if (resText.includes('validation_error') || resText.includes('testing emails')) {
            isValidationError = true;
          }
        }

        if (isValidationError) {
          console.warn(`Resend 403 Sandbox restriction detected. Retrying with fallback email: support@opekjunkremoval.com (original recipient: ${toEmail})`);
          
          const fallbackEmail = 'support@opekjunkremoval.com';
          const sandboxBanner = `
            <div style="background-color: #fee2e2; border: 1px solid #fca5a5; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-family: sans-serif; font-size: 13px; color: #991b1b; line-height: 1.5;">
              <strong>[Sandbox Mode Notification]</strong> This email was originally intended for <strong>${toEmailDisplay}</strong>, but was redirected to you because the domain is not yet verified on your Resend dashboard. To send directly to customers, please verify your domain at <a href="https://resend.com/domains" style="color: #991b1b; text-decoration: underline;">resend.com/domains</a>.
            </div>
          `;
          
          let fallbackHtml = htmlContent;
          if (htmlContent.includes(headerHtml)) {
            fallbackHtml = htmlContent.replace(headerHtml, `${headerHtml}\n${sandboxBanner}`);
          } else {
            fallbackHtml = sandboxBanner + htmlContent;
          }

          response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [fallbackEmail],
              subject: `[Sandbox] ${subject}`,
              html: fallbackHtml,
            }),
          })
          resText = await response.text()
        }
      }

      if (!response.ok) {
        throw new Error(`Resend API failed with status ${response.status}: ${resText}`)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully via Resend', data: resText }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.log('--- MOCK EMAIL SENDING ---');
      console.log(`To: ${toEmail}`);
      console.log(`From: ${fromEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Payload type: ${type}`);
      console.log('---------------------------');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email logged (mock mode - RESEND_API_KEY environment variable is not configured)', 
          mock: true 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
