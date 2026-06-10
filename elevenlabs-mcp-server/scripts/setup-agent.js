import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const AGENT_ID = "agent_5101kgxcwtkgek18m0j13cq16t3y";

const SYSTEM_PROMPT = `# IDENTITY & ROLE
You are Macy, the customer service and sales rep agent for Opek Junk Removal. Your sole objective is to efficiently book appointments and answer customer questions. Speak naturally, confidently, and with professionalism.

# Business Brand & Services
* Brand: Opek Junk Removal
* Services: We ONLY offer and book two services:
  1. Junk Removal (hauling away unwanted items).
  2. Moving Labor (hourly labor for heavy lifting, loading, unloading, or moving furniture inside the home).
* Service Areas: Nationwide coverage (all US zip codes/cities).
* Hours: 7 days a week, 7 am to 8 pm.

# Pricing Guidelines (Crucial for Quotes)
* Junk Removal Pricing:
  - Minimum charge starts at $169.
  - Pricing is based on truck volume (how much space items take up).
  - Common single item estimates (always quote as a ballpark range):
    * Sofa / Couch: $150 - $250
    * Sectional: $250 - $450
    * Mattress: $120 - $190
    * Refrigerator / Freezer: $150 - $250
    * Washer / Dryer: $200 - $350
    * TV: $70 - $130
    * Bags of trash / boxes of junk: $40 - $70 each
* Moving Labor Pricing:
  - Charged as a flat hourly rate (2-hour minimum booking):
    * 2 Helpers (Movers): $149/hour
    * 3 Helpers (Movers): $189/hour
  - Note: We do NOT move items over 400 lbs (such as pianos, grandfather clocks, or safes).

# VOICE & STYLE CONSTRAINT (CRITICAL)
* Brevity is Law: Keep every single response under 15–20 words. Never elaborate or explain unless directly asked.
* Human Cadence: Use natural voice fillers ("Sure, i can help with that", "Makes sense,", "Let's see...") to feel real. Never sound robotic.
* Terminology: Use local service terms: "truck," "crew," "haul," "load." Avoid corporate jargon.
* Step-by-Step: Ask exactly ONE question at a time. Never double-prompt.

# Junk Removal Service Booking flow (Ask in that order)
1. Itemization: Ask what needs to be hauled away.
2. Location: Get their zip code or city.
3. Pricing & Pitch: State the ballpark estimate/range, explain the truck-volume policy, and immediately transition to the close.
4. The Close: Ask what date they prefer for the appointment.
5. Logistics: Collect Name, Email, Phone, and exact Address (ask/collect one after the other).

# Moving Labor Booking Flow (ask in that order)
1. Ask what specifically they need help with (Loading, Unloading, or both).
2. Ask what we're Loading/Unloading (storage units, box trucks, inside home, etc.).
3. Ask if they have any item over 400 pounds (pianos, grandfather clocks, safes - remind them we do not move these).
4. Ask how many helpers (2 or 3) and hours (2-hour minimum) they need. Quote the rate (2 helpers = $149/hr, 3 helpers = $189/hr).
5. Ask what date they need the helpers.
6. Get the service location/address.
7. Ask if they need any special equipment for the job.
8. Logistics: Collect Name, Email, and Phone to finalize.

* IF asked if you are AI:
  "Nope, I'm the office dispatcher here."
* IF complex complaint / escalation:
  "I want to get this right for you. What's the best number for my manager to call you back right now?"
Do not ask "Are you still there" when there is a silence after booking is confirmed. If booking is not yet confirmed you can say "Hello [their name], are we still connected?"
Always confirm booking details by saying it back to the user before submitting the booking.

# BOOKING TOOL (CRITICAL)
Once you have collected the required fields (Name, Email, Phone, Address, City, State, Zip, Date, Service Type, and Details/Items), you MUST call the \`book_appointment\` tool to insert the booking into the database. Tell the user you are confirming the booking, execute the tool, and then read back the final confirmation message and order number returned by the tool. Do not guess or make up an order number.`;

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("Error: ELEVENLABS_API_KEY is not defined in the .env file.");
    process.exit(1);
  }

  // Get the webhook URL from command line arguments
  const webhookUrl = process.argv[2];
  if (!webhookUrl) {
    console.error("Usage: node scripts/setup-agent.js <your_vercel_app_url>");
    console.error("Example: node scripts/setup-agent.js https://opek-junk.vercel.app/api/create-booking");
    process.exit(1);
  }

  console.log(`Initializing ElevenLabs client...`);
  const client = new ElevenLabsClient({ apiKey });

  try {
    // 1. Check if the tool already exists
    console.log(`Checking existing tools in ElevenLabs...`);
    const toolsList = await client.conversationalAi.tools.list();
    let bookingTool = toolsList.tools?.find(t => t.toolConfig.name === "book_appointment");
    let toolId = bookingTool?.id;

    if (bookingTool) {
      console.log(`Found existing booking tool with ID: ${toolId}. Updating its URL to ${webhookUrl}...`);
      await client.conversationalAi.tools.update(toolId, {
        toolConfig: {
          type: "webhook",
          name: "book_appointment",
          description: "Submit a live booking request for junk removal or moving labor to the database. Use this when the customer agrees to book and provides their details.",
          apiSchema: {
            url: webhookUrl,
            method: "POST",
            requestBodySchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "The customer's full name" },
                email: { type: "string", description: "The customer's email address (optional)" },
                phone: { type: "string", description: "The customer's phone number" },
                address: { type: "string", description: "The street address for the service" },
                unitNumber: { type: "string", description: "The apartment, suite, or unit number (optional)" },
                city: { type: "string", description: "The city for the service" },
                state: { type: "string", description: "The two-letter state abbreviation (e.g. TX)" },
                zipCode: { type: "string", description: "The zip code for the service" },
                serviceType: { type: "string", description: "The type of service: 'Junk Removal' or 'Moving Labor'", enum: ["Junk Removal", "Moving Labor"] },
                date: { type: "string", description: "The preferred date for the service in YYYY-MM-DD format" },
                details: { type: "string", description: "Additional details or item description" }
              },
              required: ["name", "email", "phone", "address", "city", "state", "zipCode", "serviceType", "date"]
            }
          }
        }
      });
    } else {
      console.log(`Creating new booking tool in ElevenLabs...`);
      const newTool = await client.conversationalAi.tools.create({
        toolConfig: {
          type: "webhook",
          name: "book_appointment",
          description: "Submit a live booking request for junk removal or moving labor to the database. Use this when the customer agrees to book and provides their details.",
          apiSchema: {
            url: webhookUrl,
            method: "POST",
            requestBodySchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "The customer's full name" },
                email: { type: "string", description: "The customer's email address (optional)" },
                phone: { type: "string", description: "The customer's phone number" },
                address: { type: "string", description: "The street address for the service" },
                unitNumber: { type: "string", description: "The apartment, suite, or unit number (optional)" },
                city: { type: "string", description: "The city for the service" },
                state: { type: "string", description: "The two-letter state abbreviation (e.g. TX)" },
                zipCode: { type: "string", description: "The zip code for the service" },
                serviceType: { type: "string", description: "The type of service: 'Junk Removal' or 'Moving Labor'", enum: ["Junk Removal", "Moving Labor"] },
                date: { type: "string", description: "The preferred date for the service in YYYY-MM-DD format" },
                details: { type: "string", description: "Additional details or item description" }
              },
              required: ["name", "email", "phone", "address", "city", "state", "zipCode", "serviceType", "date"]
            }
          }
        }
      });
      toolId = newTool.id;
      console.log(`Created new booking tool with ID: ${toolId}`);
    }

    // 2. Retrieve the agent's current configuration
    console.log(`Retrieving current agent configuration for ${AGENT_ID}...`);
    const agentData = await client.conversationalAi.agents.get(AGENT_ID);
    
    // Prepare updated tool IDs list
    const currentToolIds = agentData.conversationConfig?.agent?.prompt?.toolIds || [];
    const updatedToolIds = Array.from(new Set([...currentToolIds, toolId]));

    console.log(`Updating agent prompt and attaching booking tool...`);
    await client.conversationalAi.agents.update(AGENT_ID, {
      conversationConfig: {
        agent: {
          prompt: {
            prompt: SYSTEM_PROMPT,
            toolIds: updatedToolIds
          }
        }
      }
    });

    console.log(`Agent '${agentData.name}' has been successfully updated with the new prompt and connected to the booking webhook!`);

  } catch (error) {
    console.error("Error setting up agent booking tool:", error);
    process.exit(1);
  }
}

main();
