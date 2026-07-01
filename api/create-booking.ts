import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseUrl = (rawUrl && rawUrl !== 'your_supabase_url_here') ? rawUrl : '';

const rawAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const supabaseAnonKey =
  (rawAnonKey && rawAnonKey !== 'your_supabase_anon_key_here') ? rawAnonKey : '';

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const isString = (v: unknown): v is string => typeof v === 'string';
const trimmed = (v: unknown): string => (isString(v) ? v.trim() : '');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabase) {
    return res.status(500).json({
      status: 'error',
      message: 'Server is not configured.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const {
      name,
      email,
      phone,
      address,
      unitNumber,
      city,
      state,
      zipCode,
      serviceType,
      date,
      details
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !state || !zipCode || !serviceType || !date) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields. Please ensure name, email, phone, address, city, state, zipCode, serviceType, and date are provided.'
      });
    }

    // Validate formats and reasonable lengths to reject malformed/abusive input.
    const emailValue = trimmed(email);
    const phoneDigits = trimmed(phone).replace(/\D/g, '');
    if (!EMAIL_RE.test(emailValue) || emailValue.length > 254) {
      return res.status(400).json({ status: 'error', message: 'Invalid email address.' });
    }
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      return res.status(400).json({ status: 'error', message: 'Invalid phone number.' });
    }
    const fields: Record<string, unknown> = { name, address, unitNumber, city, state, zipCode, serviceType, date, details };
    for (const [key, value] of Object.entries(fields)) {
      if (isString(value) && value.length > 2000) {
        return res.status(400).json({ status: 'error', message: `Field "${key}" is too long.` });
      }
    }

    const normalizedServiceType = serviceType
      ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
        : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
        : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
        : 'Junk Removal')
      : 'Junk Removal';

    const orderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const customerInfo = {
      name,
      email: email || '',
      phone
    };

    const locationInfo = {
      address,
      unit_number: unitNumber || null,
      city,
      state,
      zip_code: zipCode
    };

    const bookingDetails = {
      service_type: normalizedServiceType,
      preferred_date: date,
      details: details || '',
      estimated_items: [],
      estimated_volume: '',
      price: 0,
      estimate_summary: '',
      photo_url: ''
    };

    // Insert into Supabase bookings table
    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_info: customerInfo,
          location_info: locationInfo,
          booking_details: bookingDetails,
          status: 'pending',
          order_number: orderNumber
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Unable to create booking. Please try again later.'
      });
    }

    const finalOrderNumber = orderNumber;

    // Confirmation + admin emails are sent automatically by the
    // send_notification_on_insert trigger on public.bookings.

    // Return success JSON for the ElevenLabs Agent to read back to the user
    return res.status(200).json({
      status: 'success',
      orderNumber: finalOrderNumber,
      message: `Booking confirmed successfully! The order number is ${finalOrderNumber}. Kofi or a crew member will call to confirm details within 15 minutes.`
    });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}
