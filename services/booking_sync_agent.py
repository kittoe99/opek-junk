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
from typing import Optional

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
SUPABASE_URL = "https://mjgwoukwyqwoectxfwqv.supabase.co"
SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1"
    "qZ3dvdWt3eXF3b2VjdHhmd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjAzNjcsIm"
    "V4cCI6MjA3MDMzNjM2N30.3ee-rHN_BYQKaZmLOTiyoVxU4fYLDnNnfToI8veH5F8"
)

# Define Pydantic Schema for Structured Output
class BookingExtraction(pydantic.BaseModel):
    bookingRequested: bool
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    unitNumber: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[str] = None
    serviceType: Optional[str] = None  # "Junk Removal" or "Moving Labor"
    date: Optional[str] = None  # YYYY-MM-DD
    details: Optional[str] = None

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

async def extract_booking_details(transcript_text: str, gemini_key: Optional[str], openai_key: Optional[str]) -> Optional[dict]:
    """Extract booking details using either Gemini or OpenAI as fallback."""
    current_date = datetime.date.today().strftime("%Y-%m-%d")
    system_instruction = (
        f"You are an expert booking extraction agent. Analyze the provided "
        f"transcript of a phone call conversation between an office agent (Macy) "
        f"and a customer. Your job is to determine if the customer requested to "
        f"book a service (Junk Removal or Moving Labor) and provided booking "
        f"details. If they agreed/decided to book, extract all fields accurately.\n\n"
        f"CRITICAL DATE RULE:\n"
        f"The current local date is {current_date}. You MUST convert any relative or "
        f"informal dates mentioned (e.g. 'tomorrow', 'next Monday', 'June 11th', 'this Friday') "
        f"into the exact YYYY-MM-DD format (e.g. '2026-06-11'). Never return informal text like "
        f"'June 11th' or 'tomorrow' for the date field. If a valid calendar date cannot be "
        f"resolved or is not mentioned, set date to null."
    )
    prompt = (
        f"Please analyze the following transcript and extract the booking details:\n\n"
        f"--- TRANSCRIPT START ---\n"
        f"{transcript_text}\n"
        f"--- TRANSCRIPT END ---\n"
    )

    # If Gemini key is available, try using Google Antigravity SDK
    if gemini_key:
        try:
            from google.antigravity import Agent, LocalAgentConfig
            logging.info("Using Gemini (via Google Antigravity SDK) for structured extraction...")
            config = LocalAgentConfig(
                model="gemini-2.5-flash",
                response_schema=BookingExtraction,
                system_instructions=system_instruction
            )
            async with Agent(config=config) as agent:
                resp = await agent.chat(prompt)
                data = await resp.structured_output()
                return data
        except Exception as e:
            logging.warning(f"Failed with Gemini / Antigravity SDK: {e}. Falling back to OpenAI...")

    # Fallback to OpenAI structured outputs
    if openai_key:
        try:
            from openai import OpenAI
            logging.info("Using OpenAI (GPT-4o-mini) for structured extraction...")
            client = OpenAI(api_key=openai_key)
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                response_format=BookingExtraction,
            )
            parsed = completion.choices[0].message.parsed
            if parsed:
                return parsed.model_dump()
        except Exception as e:
            logging.error(f"Failed with OpenAI structured output: {e}")
            
    return None

async def sync_bookings_pass(elevenlabs_key: str, gemini_key: Optional[str], openai_key: Optional[str]):
    """Run a single pass of the booking synchronization."""
    logging.info("Starting ElevenLabs conversations sync pass...")
    
    # 1. Fetch conversations from ElevenLabs
    headers = {
        "xi-api-key": elevenlabs_key,
        "Content-Type": "application/json"
    }
    
    url = f"https://api.elevenlabs.io/v1/convai/conversations?agent_id={AGENT_ID}"
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        conversations_data = response.json()
    except Exception as e:
        logging.error(f"Failed to fetch conversations from ElevenLabs: {e}")
        return

    conversations = conversations_data.get("conversations", [])
    logging.info(f"Found {len(conversations)} conversations from ElevenLabs.")

    # 2. Setup Supabase headers
    supabase_headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    for conv in conversations:
        conv_id = conv.get("conversation_id")
        if not conv_id:
            continue

        # Check if conversation status is done/completed or has messages
        message_count = conv.get("message_count", 0)
        if message_count < 2:
            logging.debug(f"Skipping call {conv_id} because of low message count ({message_count}).")
            continue

        # 3. Check if booking already exists in Supabase
        check_url = f"{SUPABASE_URL}/rest/v1/bookings"
        check_params = {
            "details": f"ilike.*{conv_id}*"
        }
        try:
            check_resp = requests.get(check_url, headers=supabase_headers, params=check_params, timeout=10)
            check_resp.raise_for_status()
            existing_bookings = check_resp.json()
        except Exception as e:
            logging.error(f"Failed to query Supabase for conversation {conv_id}: {e}")
            continue

        if existing_bookings:
            logging.info(f"Conversation {conv_id} already has a booking recorded in database. Skipping.")
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
            continue

        transcript_list = conv_details.get("transcript", [])
        if not transcript_list:
            logging.info(f"Conversation {conv_id} transcript is empty. Skipping.")
            continue

        # Format the transcript text
        transcript_lines = []
        for turn in transcript_list:
            role = turn.get("role", "unknown")
            message = turn.get("message", "")
            transcript_lines.append(f"{role.upper()}: {message}")
        
        transcript_text = "\n".join(transcript_lines)

        # 5. Extract structured data using AI
        extracted_data = await extract_booking_details(transcript_text, gemini_key, openai_key)

        if not extracted_data:
            logging.warning(f"No structured output returned for conversation {conv_id}.")
            continue

        # Check if booking was requested
        is_requested = extracted_data.get("bookingRequested", False)
        if not is_requested:
            logging.info(f"Conversation {conv_id} did not result in a booking request according to LLM analysis.")
            continue

        # Validate required fields
        name = extracted_data.get("name")
        phone = extracted_data.get("phone")
        address = extracted_data.get("address")
        city = extracted_data.get("city")
        state = extracted_data.get("state")
        zip_code = extracted_data.get("zipCode")
        service_type = extracted_data.get("serviceType")
        date = extracted_data.get("date")

        missing = []
        if not name: missing.append("name")
        if not phone: missing.append("phone")
        if not address: missing.append("address")
        if not city: missing.append("city")
        if not state: missing.append("state")
        if not zip_code: missing.append("zipCode")
        if not service_type: missing.append("serviceType")
        if not date: missing.append("date")

        if missing:
            logging.warning(
                f"Conversation {conv_id} wanted to book, but is missing required fields: {', '.join(missing)}. "
                f"Details extracted: {extracted_data}"
            )
            continue

        # Validate date format (must be YYYY-MM-DD)
        if date and not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
            logging.warning(
                f"Conversation {conv_id} wanted to book, but date is not in YYYY-MM-DD format: '{date}'. "
                f"Skipping to prevent database errors."
            )
            continue

        # Formulate the details field, embedding the conversation ID as tracking
        details_text = extracted_data.get("details") or ""
        details_field = f"{details_text}\n\n[ElevenLabs ConvID: {conv_id}]"

        order_number = generate_order_number()

        # 6. Insert booking into Supabase
        insert_payload = {
            "name": name,
            "email": extracted_data.get("email") or "",
            "phone": phone,
            "address": address,
            "unit_number": extracted_data.get("unitNumber") or None,
            "city": city,
            "state": state,
            "zip_code": zip_code,
            "service_type": service_type,
            "preferred_date": date,
            "details": details_field,
            "status": "pending",
            "price": 0,
            "estimated_volume": "",
            "estimated_items": [],
            "order_number": order_number
        }

        logging.info(f"Inserting new booking for {name} ({phone}) to Supabase...")
        try:
            insert_resp = requests.post(
                f"{SUPABASE_URL}/rest/v1/bookings",
                headers=supabase_headers,
                json=insert_payload,
                timeout=15
            )
            if insert_resp.status_code >= 400:
                logging.error(f"Failed to insert booking into Supabase: {insert_resp.status_code} - {insert_resp.text}")
                continue
            logging.info(f"Successfully inserted booking into Supabase with order number {order_number}.")
        except Exception as e:
            logging.error(f"Failed to insert booking into Supabase: {e}")
            continue

        # 7. Trigger the Supabase Edge Function to send the confirmation email
        logging.info(f"Triggering confirmation email Edge Function for order {order_number}...")
        email_payload = {
            "type": "booking",
            "record": {
                "name": name,
                "email": extracted_data.get("email") or "",
                "phone": phone,
                "address": address,
                "unit_number": extracted_data.get("unitNumber") or None,
                "city": city,
                "state": state,
                "zip_code": zip_code,
                "service_type": service_type,
                "preferred_date": date,
                "details": details_field,
                "price": 0,
                "order_number": order_number
            }
        }
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

    logging.info("Sync pass completed.")

async def main():
    elevenlabs_key = load_elevenlabs_api_key()
    if not elevenlabs_key:
        logging.error("ELEVENLABS_API_KEY is not defined. Please set it in your environment or elevenlabs-mcp-server/.env")
        sys.exit(1)

    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = load_openai_api_key()

    if not gemini_key and not openai_key:
        logging.error("Neither GEMINI_API_KEY nor OPENAI_API_KEY is defined. At least one LLM key is required.")
        sys.exit(1)

    # If --run-once is passed, just do a single run and exit
    if len(sys.argv) > 1 and sys.argv[1] == "--run-once":
        await sync_bookings_pass(elevenlabs_key, gemini_key, openai_key)
        return

    logging.info("Starting Booking Sync Agent in background mode...")
    
    # We use a simple sleep loop for background sync to support environments without Gemini API key 
    # while retaining robust background capability.
    while True:
        try:
            await sync_bookings_pass(elevenlabs_key, gemini_key, openai_key)
        except Exception as e:
            logging.exception(f"Unhandled error in sync pass: {e}")
        
        # Sleep for 5 minutes (300 seconds)
        await asyncio.sleep(300)

if __name__ == "__main__":
    asyncio.run(main())
