import os
import sys
import json
import logging
import asyncio
import random
import string
import requests
import pydantic
import datetime
import re
from openai import OpenAI
from typing import Optional, List

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# Constants
AGENT_ID = "agent_5101kgxcwtkgek18m0j13cq16t3y"
SUPABASE_URL = os.getenv("SUPABASE_URL")
# This agent reads/writes the bookings tables directly and must use the service
# role key (RLS blocks anon reads). Keys are loaded from the environment only.
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment."
    )

# Define Pydantic Schema for Structured Output
class SyncExtraction(pydantic.BaseModel):
    submissionType: str  # "booking", "contact", "provider_signup", or "none"
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    
    # Booking specific fields
    address: Optional[str] = None
    unitNumber: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[str] = None
    serviceType: Optional[str] = None  # "Junk Removal", "Moving Labor", "Donation Pick Up", "Dumpster Rental"
    date: Optional[str] = None  # YYYY-MM-DD
    details: Optional[str] = None
    
    # Contact/Support specific fields
    contactSubject: Optional[str] = None
    contactMessage: Optional[str] = None
    
    # Provider signup specific fields
    providerServiceArea: Optional[str] = None
    providerVehicleType: Optional[str] = None
    providerScheduleAvailability: Optional[List[str]] = None
    providerBusinessName: Optional[str] = None
    providerAdditionalInfo: Optional[str] = None

def load_elevenlabs_api_key():
    """Load ElevenLabs API key from env or relative .env file."""
    key = os.getenv("ELEVENLABS_API_KEY")
    if key:
        return key
    
    # Try loading from elevenlabs-mcp-server/.env
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        env_path = os.path.join(base_dir, "elevenlabs-mcp-server", ".env")
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                for line in f:
                    if line.strip().startswith("ELEVENLABS_API_KEY="):
                        return line.strip().split("=", 1)[1].strip()
    except Exception as e:
        logging.warning(f"Failed to read elevenlabs-mcp-server/.env: {e}")
        
    return None

def load_openai_api_key():
    """Load OpenAI API key from env or relative .env file."""
    key = os.getenv("OPENAI_API_KEY")
    if key:
        return key
    
    # Try loading from root .env
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        env_path = os.path.join(base_dir, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                for line in f:
                    if line.strip().startswith("OPENAI_API_KEY="):
                        return line.strip().split("=", 1)[1].strip()
    except Exception as e:
        logging.warning(f"Failed to read root .env: {e}")
        
    return None

def generate_order_number() -> str:
    """Generate a unique order number like OPK-XXXXXX."""
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"OPK-{chars}"

def check_already_synced(conv_id: str, supabase_headers: dict) -> bool:
    """Check if the conversation has already been synced to bookings, contacts, or provider_signups."""
    # 1. Check bookings table
    try:
        check_url = f"{SUPABASE_URL}/rest/v1/bookings"
        params = {"booking_details->>details": f"ilike.*{conv_id}*"}
        resp = requests.get(check_url, headers=supabase_headers, params=params, timeout=10)
        resp.raise_for_status()
        if resp.json():
            logging.info(f"Conversation {conv_id} already has a booking recorded in database.")
            return True
    except Exception as e:
        logging.error(f"Failed to query bookings for duplicate {conv_id}: {e}")

    # 2. Check contacts table
    try:
        check_url = f"{SUPABASE_URL}/rest/v1/contacts"
        params = {"contact_info->>message": f"ilike.*{conv_id}*"}
        resp = requests.get(check_url, headers=supabase_headers, params=params, timeout=10)
        resp.raise_for_status()
        if resp.json():
            logging.info(f"Conversation {conv_id} already has a contact/enquiry recorded in database.")
            return True
    except Exception as e:
        logging.error(f"Failed to query contacts for duplicate {conv_id}: {e}")

    # 3. Check provider_signups table
    try:
        check_url = f"{SUPABASE_URL}/rest/v1/provider_signups"
        params = {"provider_info->availability->>convId": f"eq.{conv_id}"}
        resp = requests.get(check_url, headers=supabase_headers, params=params, timeout=10)
        resp.raise_for_status()
        if resp.json():
            logging.info(f"Conversation {conv_id} already has a provider signup recorded in database.")
            return True
    except Exception as e:
        logging.error(f"Failed to query provider_signups for duplicate {conv_id}: {e}")

    return False

async def trigger_email_function(email_payload: dict, supabase_headers: dict):
    """Trigger the send-email edge function on Supabase."""
    try:
        email_resp = requests.post(
            f"{SUPABASE_URL}/functions/v1/send-email",
            headers=supabase_headers,
            json=email_payload,
            timeout=10
        )
        if email_resp.status_code == 200:
            logging.info("Confirmation email sent successfully.")
        else:
            logging.warning(f"Edge Function returned status {email_resp.status_code}: {email_resp.text}")
    except Exception as e:
        logging.warning(f"Failed to trigger confirmation email: {e}")

async def extract_transcript_details(transcript_text: str, openai_key: str) -> Optional[dict]:
    """Extract booking, contact, or provider details using OpenAI structured outputs with gpt-5-mini."""
    current_date = datetime.date.today().strftime("%Y-%m-%d")
    system_instruction = (
        f"You are an expert transcription analysis agent for Opek Junk Removal. Analyze the provided "
        f"transcript of a phone call conversation between an office agent (Macy) and a customer/caller. "
        f"Your first job is to determine what the caller wants to submit. Decide the appropriate 'submissionType':\n"
        f"- 'booking': The caller wants to book one of our services (Junk Removal, Moving Labor, Dumpster Rental, Donation Pick Up) and provided details.\n"
        f"- 'contact': The caller has a general enquiry, question, request for callback, or complaint (support/FAQ request) that is NOT a booking or provider signup.\n"
        f"- 'provider_signup': An independent hauler/provider wants to sign up or apply to join our network.\n"
        f"- 'none': No valid request, prank call, or they hung up immediately.\n\n"
        f"Based on the 'submissionType', extract and fill the corresponding fields:\n"
        f"1. For 'booking': Fill name, email, phone, address, unitNumber, city, state, zipCode, serviceType, date, and details.\n"
        f"2. For 'contact': Fill name, email, phone, contactSubject, and contactMessage (which MUST be a clear, concise summary of what the caller inquired about or their message/concern).\n"
        f"3. For 'provider_signup': Fill name, email, phone, providerServiceArea, providerVehicleType, providerScheduleAvailability, providerBusinessName, and providerAdditionalInfo.\n\n"
        f"CRITICAL DATE RULE (for bookings):\n"
        f"The current local date is {current_date}. You MUST convert any relative or informal dates mentioned (e.g. 'tomorrow', 'next Monday', 'June 11th', 'this Friday') "
        f"into the exact YYYY-MM-DD format (e.g. '2026-06-11'). Never return informal text like 'June 11th' or 'tomorrow'. If date cannot be resolved, set to null.\n\n"
        f"EMAIL CLEANUP RULE:\n"
        f"If the email is spelled out letter-by-letter or phonetically, clean and format it into a standard lowercase email address (e.g. 'kofi@gmail.com').\n\n"
        f"ADDRESS CORRECTION & STANDARDIZATION RULE:\n"
        f"Verify and correct the street address, city, state, and zip code for typos (e.g. 'Main Stree' -> 'Main Street'). Use US geographic knowledge to align them."
    )
    prompt = (
        f"Please analyze the following transcript and extract the details:\n\n"
        f"--- TRANSCRIPT START ---\n"
        f"{transcript_text}\n"
        f"--- TRANSCRIPT END ---\n"
    )

    try:
        logging.info("Using OpenAI (gpt-5-mini) for structured extraction...")
        client = OpenAI(api_key=openai_key)
        completion = client.beta.chat.completions.parse(
            model="gpt-5-mini",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            response_format=SyncExtraction,
        )
        parsed = completion.choices[0].message.parsed
        if parsed:
            return parsed.model_dump()
    except Exception as e:
        logging.error(f"Failed with OpenAI structured output: {e}")
            
    return None

def load_agent_state(supabase_headers: dict) -> dict:
    """Load sync agent state from pricing_config table."""
    default_state = {
        "last_processed_timestamp": 0,
        "processed_ids": [],
        "failed_attempts": {}
    }
    try:
        url = f"{SUPABASE_URL}/rest/v1/pricing_config?key=eq.booking_sync_agent_state"
        resp = requests.get(url, headers=supabase_headers, timeout=15)
        resp.raise_for_status()
        rows = resp.json()
        if rows:
            val = rows[0].get("value")
            if isinstance(val, dict):
                return {
                    "last_processed_timestamp": val.get("last_processed_timestamp", 0),
                    "processed_ids": val.get("processed_ids", []),
                    "failed_attempts": val.get("failed_attempts", {})
                }
    except Exception as e:
        logging.warning(f"Failed to load agent state from database: {e}")
    return default_state

def save_agent_state(state: dict, supabase_headers: dict):
    """Save sync agent state to pricing_config table."""
    try:
        headers = supabase_headers.copy()
        headers["Prefer"] = "resolution=merge-duplicates"
        url = f"{SUPABASE_URL}/rest/v1/pricing_config"
        payload = {
            "key": "booking_sync_agent_state",
            "value": state,
            "description": "Persistent state for the background booking sync agent"
        }
        resp = requests.post(url, headers=headers, json=payload, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        logging.error(f"Failed to save agent state to database: {e}")

async def sync_bookings_pass(elevenlabs_key: str, openai_key: str):
    """Run a single pass of the booking and contact synchronization."""
    logging.info("Starting ElevenLabs conversations sync pass...")
    
    # Setup Supabase headers
    supabase_headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    # Load persistent state
    state = load_agent_state(supabase_headers)
    last_processed_ts = state["last_processed_timestamp"]
    processed_ids = set(state["processed_ids"])
    failed_attempts = state.setdefault("failed_attempts", {})
    
    # 1. Fetch first page of conversations from ElevenLabs to check for candidate records
    headers = {
        "xi-api-key": elevenlabs_key,
        "Content-Type": "application/json"
    }
    
    url = f"https://api.elevenlabs.io/v1/convai/conversations?agent_id={AGENT_ID}"
    try:
        logging.info("Checking first page of conversations from ElevenLabs...")
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        first_page_data = response.json()
    except Exception as e:
        logging.error(f"Failed to fetch conversations from ElevenLabs on page 1: {e}")
        return
        
    page_convs = first_page_data.get("conversations", [])
    if not page_convs:
        logging.info("No conversations returned by ElevenLabs. Nothing to sync.")
        return

    # Early exit check: Are there any potentially new completed calls on the first page?
    has_candidates = False
    for c in page_convs:
        conv_id = c.get("conversation_id")
        start_time = c.get("start_time_unix_secs", 0)
        status = c.get("status")
        message_count = c.get("message_count", 0)

        if conv_id in processed_ids:
            continue
        if start_time < last_processed_ts - 1800:
            continue
        if status != "done" or message_count < 2:
            continue

        has_candidates = True
        break

    if not has_candidates:
        logging.info("No new completed conversations in buffer window. Skipping sync pass.")
        return

    # 2. Fetch conversations with pagination support (reusing the first page we already fetched)
    conversations = []
    cursor = None
    has_more = True
    max_pages = 10  # Safeguard to prevent API rate limit abuse
    page_count = 0
    stop_paginating = False
    
    while has_more and page_count < max_pages and not stop_paginating:
        if page_count == 0:
            data = first_page_data
        else:
            url = f"https://api.elevenlabs.io/v1/convai/conversations?agent_id={AGENT_ID}"
            if cursor:
                url += f"&cursor={cursor}"
                
            try:
                logging.info(f"Fetching page {page_count + 1} of conversations...")
                response = requests.get(url, headers=headers, timeout=15)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                logging.error(f"Failed to fetch conversations from ElevenLabs on page {page_count + 1}: {e}")
                break
                
        page_convs = data.get("conversations", [])
        if not page_convs:
            break
            
        for c in page_convs:
            conv_id = c.get("conversation_id")
            start_time = c.get("start_time_unix_secs", 0)
            
            # If the conversation is in processed_ids, we skip adding it to our queue
            if conv_id in processed_ids:
                continue
                
            # If the conversation is older than our last processed timestamp (with a 30-minute buffer for overlap/in-progress calls),
            # we can stop paging/processing because all subsequent calls will be even older.
            if start_time < last_processed_ts - 1800:
                logging.info(f"Reached conversation {conv_id} which is older than last_processed_timestamp minus buffer. Stopping pagination.")
                stop_paginating = True
                break
                
            conversations.append(c)
        
        if stop_paginating:
            break
            
        has_more = data.get("has_more", False)
        cursor = data.get("next_cursor")
        page_count += 1
        
        # Check if all conversations on this page are older than 7 days
        # 7 days in seconds = 7 * 24 * 3600 = 604800
        now_unix = datetime.datetime.utcnow().timestamp()
        all_older_than_7_days = True
        for c in page_convs:
            start_time = c.get("start_time_unix_secs", 0)
            if now_unix - start_time < 604800:
                all_older_than_7_days = False
                break
                
        if all_older_than_7_days:
            logging.info("All conversations on this page are older than 7 days. Stopping pagination.")
            break
            
    logging.info(f"Found {len(conversations)} new/unprocessed conversations to inspect.")

    new_processed_ids = []
    max_ts_this_pass = last_processed_ts
    state_changed = False

    for conv in conversations:
        conv_id = conv.get("conversation_id")
        if not conv_id:
            continue

        start_time = conv.get("start_time_unix_secs", 0)
        
        # Double check in memory
        if conv_id in processed_ids:
            continue
            
        # Only process completed calls
        status = conv.get("status")
        if status != "done":
            logging.info(f"Skipping call {conv_id} because status is '{status}' (not completed).")
            continue

        # Check if conversation status is done/completed or has messages
        message_count = conv.get("message_count", 0)
        if message_count < 2:
            logging.info(f"Skipping call {conv_id} because of low message count ({message_count}). Marking as processed.")
            processed_ids.add(conv_id)
            new_processed_ids.append(conv_id)
            state_changed = True
            if start_time > max_ts_this_pass:
                max_ts_this_pass = start_time
            continue

        # 3. Check if conversation has already been synced to any table
        if check_already_synced(conv_id, supabase_headers):
            logging.info(f"Conversation {conv_id} already has a record recorded in database. Adding to state and skipping.")
            processed_ids.add(conv_id)
            new_processed_ids.append(conv_id)
            state_changed = True
            if start_time > max_ts_this_pass:
                max_ts_this_pass = start_time
            continue

        logging.info(f"Processing new conversation: {conv_id}...")

        # 4. Fetch the full transcript for this conversation
        detail_url = f"https://api.elevenlabs.io/v1/convai/conversations/{conv_id}"
        try:
            detail_resp = requests.get(detail_url, headers=headers, timeout=15)
            detail_resp.raise_for_status()
            conv_details = detail_resp.json()
        except Exception as e:
            logging.error(f"Failed to fetch conversation details for {conv_id}: {e}")
            failed_attempts[conv_id] = failed_attempts.get(conv_id, 0) + 1
            if failed_attempts[conv_id] >= 3:
                logging.warning(f"Conversation {conv_id} details fetch failed 3 times. Skipping further retries.")
                processed_ids.add(conv_id)
                new_processed_ids.append(conv_id)
                state_changed = True
                if conv_id in failed_attempts:
                    del failed_attempts[conv_id]
            continue

        transcript_list = conv_details.get("transcript", [])
        if not transcript_list:
            logging.info(f"Conversation {conv_id} transcript is empty. Marking as processed.")
            processed_ids.add(conv_id)
            new_processed_ids.append(conv_id)
            state_changed = True
            if start_time > max_ts_this_pass:
                max_ts_this_pass = start_time
            continue

        # Format the transcript text
        transcript_lines = []
        for turn in transcript_list:
            role = turn.get("role", "unknown")
            message = turn.get("message", "")
            transcript_lines.append(f"{role.upper()}: {message}")
        
        transcript_text = "\n".join(transcript_lines)

        # 5. Extract structured data using AI
        extracted_data = await extract_transcript_details(transcript_text, openai_key)

        if not extracted_data:
            logging.warning(f"No structured output returned for conversation {conv_id}.")
            failed_attempts[conv_id] = failed_attempts.get(conv_id, 0) + 1
            if failed_attempts[conv_id] >= 3:
                logging.warning(f"Conversation {conv_id} structured extraction failed 3 times. Skipping further retries.")
                processed_ids.add(conv_id)
                new_processed_ids.append(conv_id)
                state_changed = True
                if conv_id in failed_attempts:
                    del failed_attempts[conv_id]
            continue

        submission_type = extracted_data.get("submissionType", "none")
        name = extracted_data.get("name")
        phone = extracted_data.get("phone")
        email = extracted_data.get("email")

        # 1. Validate bookings requirements
        if submission_type == "booking":
            address = extracted_data.get("address")
            city = extracted_data.get("city")
            state = extracted_data.get("state")
            zip_code = extracted_data.get("zipCode")
            service_type = extracted_data.get("serviceType")
            date = extracted_data.get("date")

            missing = []
            if not name or name.strip().lower() in ["phone caller", "unknown", "none", "null", ""]: missing.append("name")
            if not phone or phone.strip().lower() in ["n/a", "unknown", "none", "null", ""]: missing.append("phone")
            if not address: missing.append("address")
            if not city: missing.append("city")
            if not state: missing.append("state")
            if not zip_code: missing.append("zipCode")
            if not service_type: missing.append("serviceType")
            if not date: missing.append("date")

            if missing:
                logging.warning(
                    f"Conversation {conv_id} wanted to book, but is missing required fields: {', '.join(missing)}. "
                    f"Recording as contact/enquiry ticket for callback."
                )
                submission_type = "contact"
                extracted_data["contactSubject"] = "Incomplete Booking Callback"
                extracted_data["contactMessage"] = (
                    f"Caller wanted to book but was missing required fields: {', '.join(missing)}.\n"
                    f"Details: {extracted_data}\n\nPlease callback to complete."
                )

        if submission_type == "booking":
            date = extracted_data.get("date")
            if date and not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
                logging.warning(f"Conversation {conv_id} has invalid date '{date}'. Falling back to contact ticket.")
                submission_type = "contact"
                extracted_data["contactSubject"] = "Booking Date Issue Callback"
                extracted_data["contactMessage"] = f"Caller wanted to book but date format was invalid: '{date}'."

        # 2. Validate general enquiries (contact type)
        if submission_type == "contact" or submission_type == "none":
            clean_name = (name or "").strip()
            clean_email = (email or "").strip()
            clean_phone = (phone or "").strip()
            
            has_name = bool(clean_name and clean_name.lower() not in ["phone caller", "unknown", "none", "null", "n/a", ""])
            has_email = bool(clean_email and "@" in clean_email)
            has_phone = bool(clean_phone and clean_phone.lower() not in ["n/a", "unknown", "none", "null", ""])

            is_valid_contact = has_name and (has_email or has_phone)

            if not is_valid_contact:
                # Downgrade to system call log to prevent infinite loops while keeping list clean
                logging.info(f"Conversation {conv_id} lacks name or contact details. Logging as a general log in contacts to mark as synced.")
                submission_type = "contact"
                name = "Call Log (No Contact Details)"
                phone = phone or "N/A"
                email = email or ""
                extracted_data["contactSubject"] = "System Call Log"
                extracted_data["contactMessage"] = f"Conversation completed but did not contain booking, signup, or contact details. ID: {conv_id}."
            else:
                name = clean_name
                phone = clean_phone if has_phone else "N/A"
                email = clean_email if has_email else ""
                logging.info(f"Conversation {conv_id} classified as a valid customer contact enquiry: {name}.")
        else:
            # provider_signup or valid booking
            name = name or "Phone Caller"
            phone = phone or "N/A"
            email = email or ""

        # Process insertions based on decided submission_type
        sync_success = False
        if submission_type == "booking":
            address = extracted_data.get("address")
            city = extracted_data.get("city")
            state = extracted_data.get("state")
            zip_code = extracted_data.get("zipCode")
            service_type = extracted_data.get("serviceType")
            date = extracted_data.get("date")

            details_text = extracted_data.get("details") or ""
            details_field = f"{details_text}\n\n[ElevenLabs ConvID: {conv_id}]"

            # Normalize service type
            norm_service_type = "Junk Removal"
            if service_type:
                service_type_lower = service_type.lower()
                if "donation" in service_type_lower:
                    norm_service_type = "Donation Pick Up"
                elif "moving" in service_type_lower:
                    norm_service_type = "Moving Labor"
                elif "dumpster" in service_type_lower:
                    norm_service_type = "Dumpster Rental"
                else:
                    norm_service_type = "Junk Removal"

            order_number = generate_order_number()

            insert_payload = {
                "customer_info": {
                    "name": name,
                    "email": email,
                    "phone": phone
                },
                "location_info": {
                    "address": address,
                    "unit_number": extracted_data.get("unitNumber") or None,
                    "city": city,
                    "state": state,
                    "zip_code": zip_code
                },
                "booking_details": {
                    "service_type": norm_service_type,
                    "preferred_date": date,
                    "details": details_field,
                    "price": 0,
                    "estimated_volume": "",
                    "estimated_items": [],
                    "estimate_summary": "",
                    "photo_url": ""
                },
                "status": "pending",
                "order_number": order_number
            }

            logging.info(f"Inserting new booking for {name} to Supabase...")
            try:
                insert_resp = requests.post(
                    f"{SUPABASE_URL}/rest/v1/bookings",
                    headers=supabase_headers,
                    json=insert_payload,
                    timeout=15
                )
                if insert_resp.status_code >= 400:
                    logging.error(f"Failed to insert booking: {insert_resp.status_code} - {insert_resp.text}")
                else:
                    logging.info(f"Successfully inserted booking with order number {order_number}.")
                    sync_success = True
            except Exception as e:
                logging.error(f"Failed to insert booking: {e}")

            # Confirmation + admin emails are sent automatically by the
            # send_notification_on_insert trigger on public.bookings.

        elif submission_type == "contact":
            subject = extracted_data.get("contactSubject") or "General Enquiry"
            message = extracted_data.get("contactMessage") or "No message details."
            
            message_field = f"{subject}: {message}\n\n[ElevenLabs ConvID: {conv_id}]"

            insert_payload = {
                "customer_info": {
                    "name": name,
                    "email": email,
                    "phone": phone
                },
                "contact_info": {
                    "message": message_field
                }
            }

            logging.info(f"Inserting new contact/enquiry for {name} to Supabase...")
            try:
                insert_resp = requests.post(
                    f"{SUPABASE_URL}/rest/v1/contacts",
                    headers=supabase_headers,
                    json=insert_payload,
                    timeout=15
                )
                if insert_resp.status_code >= 400:
                    logging.error(f"Failed to insert contact: {insert_resp.status_code} - {insert_resp.text}")
                else:
                    logging.info(f"Successfully inserted contact ticket.")
                    sync_success = True
            except Exception as e:
                logging.error(f"Failed to insert contact: {e}")

            # Confirmation + admin emails are sent automatically by the
            # send_notification_on_insert trigger on public.contacts.

        elif submission_type == "provider_signup":
            service_area = extracted_data.get("providerServiceArea") or "N/A"
            vehicle_type = extracted_data.get("providerVehicleType") or "Pickup Truck"
            schedule = extracted_data.get("providerScheduleAvailability") or []
            business_name = extracted_data.get("providerBusinessName") or ""
            info = extracted_data.get("providerAdditionalInfo") or ""

            insert_payload = {
                "customer_info": {
                    "name": name,
                    "email": email,
                    "phone": phone
                },
                "provider_info": {
                    "service_area": service_area,
                    "vehicle_type": vehicle_type,
                    "availability": {
                      "schedule": schedule,
                      "businessName": business_name,
                      "additionalInfo": info,
                      "convId": conv_id
                    }
                },
                "status": "pending"
            }

            logging.info(f"Inserting new provider signup for {name} to Supabase...")
            try:
                insert_resp = requests.post(
                    f"{SUPABASE_URL}/rest/v1/provider_signups",
                    headers=supabase_headers,
                    json=insert_payload,
                    timeout=15
                )
                if insert_resp.status_code >= 400:
                    logging.error(f"Failed to insert provider: {insert_resp.status_code} - {insert_resp.text}")
                else:
                    logging.info(f"Successfully inserted provider signup.")
                    sync_success = True
            except Exception as e:
                logging.error(f"Failed to insert provider: {e}")

            # Confirmation + admin emails are sent automatically by the
            # send_notification_on_insert trigger on public.provider_signups.

        # Update tracking state if sync was successful or if we hit max retries
        if sync_success:
            processed_ids.add(conv_id)
            new_processed_ids.append(conv_id)
            state_changed = True
            if start_time > max_ts_this_pass:
                max_ts_this_pass = start_time
            if conv_id in failed_attempts:
                del failed_attempts[conv_id]
        else:
            failed_attempts[conv_id] = failed_attempts.get(conv_id, 0) + 1
            if failed_attempts[conv_id] >= 3:
                logging.warning(f"Conversation {conv_id} sync failed 3 times. Skipping further retries.")
                processed_ids.add(conv_id)
                new_processed_ids.append(conv_id)
                state_changed = True
                if conv_id in failed_attempts:
                    del failed_attempts[conv_id]

    # Save updated state back to database
    if state_changed or max_ts_this_pass > last_processed_ts:
        recent_ids = list(processed_ids)
        if len(recent_ids) > 100:
            recent_ids = recent_ids[-100:]
        
        state["last_processed_timestamp"] = max(last_processed_ts, max_ts_this_pass)
        state["processed_ids"] = recent_ids
        state["failed_attempts"] = failed_attempts
        save_agent_state(state, supabase_headers)
        logging.info(f"Saved state to database: last_processed_timestamp={state['last_processed_timestamp']}, tracked_ids_count={len(recent_ids)}")

    logging.info("Sync pass completed.")

async def main():
    elevenlabs_key = load_elevenlabs_api_key()
    if not elevenlabs_key:
        logging.error("ELEVENLABS_API_KEY is not defined. Please set it in your environment or elevenlabs-mcp-server/.env")
        sys.exit(1)

    openai_key = load_openai_api_key()
    if not openai_key:
        logging.error("OPENAI_API_KEY is not defined. OpenAI key is required.")
        sys.exit(1)

    # If --run-once is passed, just do a single run and exit
    if len(sys.argv) > 1 and sys.argv[1] == "--run-once":
        await sync_bookings_pass(elevenlabs_key, openai_key)
        return

    logging.info("Starting Booking Sync Agent in background mode...")
    
    while True:
        try:
            await sync_bookings_pass(elevenlabs_key, openai_key)
        except Exception as e:
            logging.exception(f"Unhandled error in sync pass: {e}")
        
        # Sleep for 5 minutes (300 seconds)
        await asyncio.sleep(300)

if __name__ == "__main__":
    asyncio.run(main())
