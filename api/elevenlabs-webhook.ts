import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const rawUrl = process.env.VITE_SUPABASE_URL || 'https://mjgwoukwyqwoectxfwqv.supabase.co';
const rawAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3dvdWt3eXF3b2VjdHhmd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjAzNjcsImV4cCI6MjA3MDMzNjM2N30.3ee-rHN_BYQKaZmLOTiyoVxU4fYLDnNnfToI8veH5F8';

const supabase = createClient(rawUrl, rawAnonKey);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow POST requests from ElevenLabs
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    
    // ElevenLabs webhook event can be nested or direct
    const convId = body.conversation_id || body.conversation?.conversation_id;
    const transcriptList = body.transcript || body.conversation?.transcript || [];
    const messageCount = body.message_count || body.conversation?.message_count || transcriptList.length;

    if (!convId) {
      console.warn('ElevenLabs webhook called without conversation_id.');
      return res.status(400).json({ error: 'Missing conversation_id' });
    }

    if (messageCount < 2) {
      console.log(`Skipping call ${convId} because of low message count (${messageCount}).`);
      return res.status(200).json({ success: true, skipped: true, reason: 'low_message_count' });
    }

    console.log(`Processing ElevenLabs post-call webhook for conversation: ${convId}...`);

    // 1. Check duplicates across all three tables (bookings, contacts, provider_signups)
    // bookings
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .ilike('details', `%${convId}%`)
      .limit(1);

    if (existingBooking && existingBooking.length > 0) {
      console.log(`Conversation ${convId} already has a booking recorded. Skipping.`);
      return res.status(200).json({ success: true, skipped: true, reason: 'already_synced_booking' });
    }

    // contacts
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .ilike('message', `%${convId}%`)
      .limit(1);

    if (existingContact && existingContact.length > 0) {
      console.log(`Conversation ${convId} already has a contact recorded. Skipping.`);
      return res.status(200).json({ success: true, skipped: true, reason: 'already_synced_contact' });
    }

    // provider_signups
    const { data: existingSignup } = await supabase
      .from('provider_signups')
      .select('id')
      .eq('availability->>convId', convId)
      .limit(1);

    if (existingSignup && existingSignup.length > 0) {
      console.log(`Conversation ${convId} already has a provider signup recorded. Skipping.`);
      return res.status(200).json({ success: true, skipped: true, reason: 'already_synced_signup' });
    }

    // 2. Format the transcript text
    const transcriptText = transcriptList
      .map((turn: any) => `${(turn.role || 'unknown').toUpperCase()}: ${turn.message || ''}`)
      .join('\n');

    if (!transcriptText) {
      console.log(`Conversation ${convId} transcript is empty. Skipping.`);
      return res.status(200).json({ success: true, skipped: true, reason: 'empty_transcript' });
    }

    // 3. Extract structured details using OpenAI (gpt-5-mini)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const currentDate = new Date().toISOString().split('T')[0];
    const systemInstruction = `You are an expert transcription analysis agent for Opek Junk Removal. Analyze the provided transcript of a phone call conversation between an office agent (Macy) and a customer/caller. Your first job is to determine what the caller wants to submit. Decide the appropriate 'submissionType':
- 'booking': The caller wants to book one of our services (Junk Removal, Moving Labor, Dumpster Rental, Donation Pick Up) and provided details.
- 'contact': The caller has a general enquiry, question, request for callback, or complaint (support/FAQ request) that is NOT a booking or provider signup.
- 'provider_signup': An independent hauler/provider wants to sign up or apply to join our network.
- 'none': No valid request, prank call, or they hung up immediately.

Based on the 'submissionType', extract and fill the corresponding fields:
1. For 'booking': Fill name, email, phone, address, unitNumber, city, state, zipCode, serviceType, date, and details.
2. For 'contact': Fill name, email, phone, contactSubject, and contactMessage (which MUST be a clear, concise summary of what the caller inquired about or their message/concern).
3. For 'provider_signup': Fill name, email, phone, providerServiceArea, providerVehicleType, providerScheduleAvailability, providerBusinessName, and providerAdditionalInfo.

CRITICAL DATE RULE (for bookings):
The current local date is ${currentDate}. You MUST convert any relative or informal dates mentioned (e.g. 'tomorrow', 'next Monday', 'June 11th', 'this Friday') into the exact YYYY-MM-DD format (e.g. '2026-06-11'). Never return informal text like 'June 11th' or 'tomorrow'. If date cannot be resolved, set to null.

EMAIL CLEANUP RULE:
If the email is spelled out letter-by-letter or phonetically, clean and format it into a standard lowercase email address (e.g. 'kofi@gmail.com').

ADDRESS CORRECTION & STANDARDIZATION RULE:
Verify and correct the street address, city, state, and zip code for typos (e.g. 'Main Stree' -> 'Main Street'). Use US geographic knowledge to align them.`;

    const promptText = `Please analyze the following transcript and extract the details:\n\n--- TRANSCRIPT START ---\n${transcriptText}\n--- TRANSCRIPT END ---\n`;

    console.log('Calling OpenAI (gpt-5-mini) for extraction...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: promptText }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'SyncExtraction',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              submissionType: { type: 'string', enum: ['booking', 'contact', 'provider_signup', 'none'] },
              name: { type: ['string', 'null'] },
              email: { type: ['string', 'null'] },
              phone: { type: ['string', 'null'] },
              address: { type: ['string', 'null'] },
              unitNumber: { type: ['string', 'null'] },
              city: { type: ['string', 'null'] },
              state: { type: ['string', 'null'] },
              zipCode: { type: ['string', 'null'] },
              serviceType: { type: ['string', 'null'] },
              date: { type: ['string', 'null'] },
              details: { type: ['string', 'null'] },
              contactSubject: { type: ['string', 'null'] },
              contactMessage: { type: ['string', 'null'] },
              providerServiceArea: { type: ['string', 'null'] },
              providerVehicleType: { type: ['string', 'null'] },
              providerScheduleAvailability: {
                type: 'array',
                items: { type: 'string' }
              },
              providerBusinessName: { type: ['string', 'null'] },
              providerAdditionalInfo: { type: ['string', 'null'] }
            },
            required: [
              'submissionType', 'name', 'email', 'phone', 'address', 'unitNumber', 'city', 
              'state', 'zipCode', 'serviceType', 'date', 'details', 'contactSubject', 
              'contactMessage', 'providerServiceArea', 'providerVehicleType', 
              'providerScheduleAvailability', 'providerBusinessName', 'providerAdditionalInfo'
            ],
            additionalProperties: false
          }
        }
      }
    });

    const extractedData = JSON.parse(completion.choices[0]?.message?.content || '{}');
    let submissionType = extractedData.submissionType || 'none';

    // 4. Normalization & Fallbacks
    if (submissionType === 'none') {
      console.log(`Conversation ${convId} classified as 'none'. Storing as a call log to mark as processed.`);
      submissionType = 'contact';
      extractedData.contactSubject = 'General Call Log';
      extractedData.contactMessage = `Conversation completed but did not contain booking, signup, or contact details. ID: ${convId}.`;
    }

    let name = extractedData.name || 'Phone Caller';
    let phone = extractedData.phone || 'N/A';
    let email = extractedData.email || '';

    // Validation checks for bookings
    if (submissionType === 'booking') {
      const { address, city, state, zipCode, serviceType, date } = extractedData;

      const missing: string[] = [];
      if (!name || name.trim().toLowerCase() === 'phone caller') missing.push('name');
      if (!phone || phone.trim().toLowerCase() === 'n/a') missing.push('phone');
      if (!address) missing.push('address');
      if (!city) missing.push('city');
      if (!state) missing.push('state');
      if (!zipCode) missing.push('zipCode');
      if (!serviceType) missing.push('serviceType');
      if (!date) missing.push('date');

      if (missing.length > 0 || (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
        console.warn(`Booking classification failed validation. Missing fields: ${missing.join(', ')}. Falling back to contact ticket.`);
        submissionType = 'contact';
        extractedData.contactSubject = 'Incomplete Booking Callback';
        extractedData.contactMessage = `Caller wanted to book but was missing required fields: ${missing.join(', ')}. Details: ${JSON.stringify(extractedData)}. Please callback.`;
      }
    }

    // Validation checks for contacts
    if (submissionType === 'contact') {
      const cleanName = (name || '').trim();
      const cleanEmail = (email || '').trim();
      const cleanPhone = (phone || '').trim();

      const hasName = cleanName && !['phone caller', 'unknown', 'none', 'null', 'n/a', ''].includes(cleanName.toLowerCase());
      const hasEmail = cleanEmail && cleanEmail.includes('@');
      const hasPhone = cleanPhone && !['n/a', 'unknown', 'none', 'null', ''].includes(cleanPhone.toLowerCase());

      const isValidContact = hasName && (hasEmail || hasPhone);

      if (!isValidContact) {
        console.log(`Lacks name/contact details. Logging as a general call log.`);
        name = 'Call Log (No Contact Details)';
        phone = phone || 'N/A';
        email = email || '';
        extractedData.contactSubject = 'System Call Log';
        extractedData.contactMessage = `Conversation completed but did not contain booking, signup, or contact details. ID: ${convId}.`;
      } else {
        name = cleanName;
        phone = hasPhone ? cleanPhone : 'N/A';
        email = hasEmail ? cleanEmail : '';
      }
    }

    // 5. DB Insertion
    if (submissionType === 'booking') {
      const { address, unitNumber, city, state, zipCode, serviceType, date, details } = extractedData;
      const detailsField = `${details || ''}\n\n[ElevenLabs ConvID: ${convId}]`;

      const normalizedServiceType = serviceType
        ? (serviceType.toLowerCase().includes('donation') ? 'Donation Pick Up'
          : serviceType.toLowerCase().includes('moving') ? 'Moving Labor'
          : serviceType.toLowerCase().includes('dumpster') ? 'Dumpster Rental'
          : 'Junk Removal')
        : 'Junk Removal';

      const orderNumber = `OPK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      console.log(`Inserting booking record for ${name}...`);
      const { error: dbError } = await supabase
        .from('bookings')
        .insert([
          {
            name,
            email,
            phone,
            address,
            unit_number: unitNumber || null,
            city,
            state,
            zip_code: zipCode,
            service_type: normalizedServiceType,
            preferred_date: date,
            details: detailsField,
            status: 'pending',
            price: 0,
            estimated_volume: '',
            estimated_items: [],
            order_number: orderNumber
          }
        ]);

      if (dbError) throw dbError;

      // Trigger Email Notification
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking',
          record: {
            name,
            email,
            phone,
            address,
            unit_number: unitNumber || null,
            city,
            state,
            zip_code: zipCode,
            service_type: normalizedServiceType,
            preferred_date: date,
            details: detailsField,
            price: 0,
            order_number: orderNumber
          }
        }
      });
      console.log('Booking sync completed successfully.');

    } else if (submissionType === 'contact') {
      const subject = extractedData.contactSubject || 'General Enquiry';
      const message = extractedData.contactMessage || 'No message details.';
      const messageField = `${subject}: ${message}\n\n[ElevenLabs ConvID: ${convId}]`;

      console.log(`Inserting contact record for ${name}...`);
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([
          {
            name,
            email,
            phone,
            message: messageField
          }
        ]);

      if (dbError) throw dbError;

      // Trigger Email Notification
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'contact',
          record: {
            name,
            email,
            phone,
            message: messageField
          }
        }
      });
      console.log('Contact sync completed successfully.');

    } else if (submissionType === 'provider_signup') {
      const serviceArea = extractedData.providerServiceArea || 'N/A';
      const vehicleType = extractedData.providerVehicleType || 'Pickup Truck';
      const schedule = extractedData.providerScheduleAvailability || [];
      const businessName = extractedData.providerBusinessName || '';
      const info = extractedData.providerAdditionalInfo || '';

      console.log(`Inserting provider signup record for ${name}...`);
      const { error: dbError } = await supabase
        .from('provider_signups')
        .insert([
          {
            name,
            email,
            phone,
            service_area: serviceArea,
            vehicle_type: vehicleType,
            availability: {
              schedule,
              businessName,
              additionalInfo: info,
              convId
            },
            status: 'pending'
          }
        ]);

      if (dbError) throw dbError;

      // Trigger Email Notification
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'provider_signup',
          record: {
            name,
            email,
            phone,
            service_area: serviceArea,
            vehicle_type: vehicleType
          }
        }
      });
      console.log('Provider signup sync completed successfully.');
    }

    return res.status(200).json({ success: true, processed: true, type: submissionType });

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
