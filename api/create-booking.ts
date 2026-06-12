import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.VITE_SUPABASE_URL;
const supabaseUrl = (rawUrl && rawUrl !== 'your_supabase_url_here')
  ? rawUrl
  : 'https://mjgwoukwyqwoectxfwqv.supabase.co';

const rawAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseAnonKey = (rawAnonKey && rawAnonKey !== 'your_supabase_anon_key_here')
  ? rawAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3dvdWt3eXF3b2VjdHhmd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjAzNjcsImV4cCI6MjA3MDMzNjM2N30.3ee-rHN_BYQKaZmLOTiyoVxU4fYLDnNnfToI8veH5F8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !state || !zipCode || !serviceType || !date) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields. Please ensure name, email, phone, address, city, state, zipCode, serviceType, and date are provided.'
      });
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
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_info: customerInfo,
          location_info: locationInfo,
          booking_details: bookingDetails,
          status: 'pending',
          order_number: orderNumber
        }
      ])
      .select('order_number')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({
        status: 'error',
        message: `Database error: ${error.message}`
      });
    }

    const finalOrderNumber = data?.order_number || orderNumber;

    // Trigger booking confirmation email using the Supabase Edge Function (matching client behavior)
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking',
          record: {
            name,
            email: email || '',
            phone,
            address,
            unit_number: unitNumber || null,
            city,
            state,
            zip_code: zipCode,
            service_type: normalizedServiceType,
            preferred_date: date,
            details: details || '',
            price: 0,
            order_number: finalOrderNumber
          }
        }
      });
    } catch (emailErr) {
      console.warn('Failed to send booking confirmation email:', emailErr);
    }

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
      message: error.message || 'Internal Server Error'
    });
  }
}
