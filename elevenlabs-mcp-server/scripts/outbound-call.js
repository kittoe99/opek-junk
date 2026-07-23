/**
 * Place an outbound quote follow-up call via ElevenLabs + Twilio.
 *
 * Usage:
 *   node scripts/outbound-call.js \
 *     --to +14696266268 \
 *     --name "John Smith" \
 *     --phone "+14696266268" \
 *     --service "Junk Removal" \
 *     --amount "$249" \
 *     --summary "Half truck load, couch and boxes"
 *
 * Requires ELEVENLABS_API_KEY in elevenlabs-mcp-server/.env
 */
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { OUTBOUND_AGENT_ID, TWILIO_PHONE_NUMBER_ID } from "./agents.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    const value = argv[i + 1];
    if (key && value) args[key] = value;
  }
  return args;
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("Error: ELEVENLABS_API_KEY is not defined in the .env file.");
    process.exit(1);
  }

  const args = parseArgs(process.argv);
  const toNumber = args.to;
  if (!toNumber) {
    console.error("Missing required --to argument (E.164 format, e.g. +14696266268)");
    process.exit(1);
  }

  const dynamicVariables = {
    customer_name: args.name || "there",
    customer_phone: args.phone || toNumber,
    service_type: args.service || "junk removal",
    quote_amount: args.amount || "your recent estimate",
    quote_summary: args.summary || "the items and volume from your online quote",
  };

  // Guard against shell eating `$249` → `49` when callers forget to quote the flag value.
  if (/^\d+$/.test(dynamicVariables.quote_amount) && dynamicVariables.quote_amount.length <= 3) {
    console.warn(
      `Warning: quote_amount looks like "${dynamicVariables.quote_amount}" — did the shell strip a dollar sign? Use --amount '$249' or --amount 249-dollars.`
    );
  }

  const client = new ElevenLabsClient({ apiKey });

  try {
    const response = await client.conversationalAi.twilio.outboundCall({
      agentId: OUTBOUND_AGENT_ID,
      agentPhoneNumberId: TWILIO_PHONE_NUMBER_ID,
      toNumber,
      callRecordingEnabled: true,
      conversationInitiationClientData: {
        dynamicVariables,
      },
    });

    console.log(JSON.stringify({
      success: response.success,
      message: response.message,
      conversationId: response.conversationId,
      callSid: response.callSid,
      agentId: OUTBOUND_AGENT_ID,
      toNumber,
      dynamicVariables,
    }, null, 2));
  } catch (error) {
    console.error("Outbound call failed:", error);
    process.exit(1);
  }
}

main();
