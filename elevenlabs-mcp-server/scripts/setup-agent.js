import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import {
  INBOUND_AGENT_ID as AGENT_ID,
  VOICE_AGENT_TOOL_IDS,
} from "./agents.config.js";
import { DYNAMIC_VARIABLE_DEFAULTS, MASTER_PROMPT } from "./master-prompt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("Error: ELEVENLABS_API_KEY is not defined in the .env file.");
    process.exit(1);
  }

  console.log(`Initializing ElevenLabs client...`);
  const client = new ElevenLabsClient({ apiKey });

  try {
    console.log(`Retrieving current agent configuration for ${AGENT_ID}...`);
    const agentData = await client.conversationalAi.agents.get(AGENT_ID);

    // Keep any placeholders already set on the agent; add the master prompt's missing ones.
    const existingPlaceholders =
      agentData.conversationConfig?.agent?.dynamicVariables?.dynamicVariablePlaceholders || {};

    console.log(`Updating agent prompt + attach booking tools...`);
    await client.conversationalAi.agents.update(AGENT_ID, {
      conversationConfig: {
        agent: {
          prompt: {
            prompt: MASTER_PROMPT,
            toolIds: VOICE_AGENT_TOOL_IDS,
          },
          dynamicVariables: {
            dynamicVariablePlaceholders: {
              ...DYNAMIC_VARIABLE_DEFAULTS,
              ...existingPlaceholders,
              call_direction: "inbound",
            },
          },
        },
      },
    });

    console.log(
      `Agent '${agentData.name}' (${AGENT_ID}) updated with tools ${VOICE_AGENT_TOOL_IDS.join(", ")}.`
    );
  } catch (error) {
    console.error("Error updating agent:", error);
    process.exit(1);
  }
}

main();
