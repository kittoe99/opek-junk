import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import {
  INBOUND_AGENT_ID,
  OUTBOUND_AGENT_ID,
  VOICE_AGENT_TOOL_IDS,
} from "./agents.config.js";
import { DYNAMIC_VARIABLE_DEFAULTS, MASTER_PROMPT } from "./master-prompt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const FIRST_MESSAGE =
  'Hello, Macy with Opek Junk Removal, Is this {{customer_name}}?';

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("Error: ELEVENLABS_API_KEY is not defined in the .env file.");
    process.exit(1);
  }

  const client = new ElevenLabsClient({ apiKey });
  const INBOUND_AGENT_ID = "agent_5101kgxcwtkgek18m0j13cq16t3y";

  try {
    console.log(`Mirroring inbound agent ${INBOUND_AGENT_ID} onto outbound ${OUTBOUND_AGENT_ID}...`);
    const inbound = await client.conversationalAi.agents.get(INBOUND_AGENT_ID);
    const inCc = inbound.conversationConfig || {};
    const inAgent = inCc.agent || {};
    const inPrompt = inAgent.prompt || {};
    const inBuiltIns = inPrompt.builtInTools || {};

    // qwen35 rejects null reasoning_effort on first set; set low then clear to match inbound.
    const promptConfig = {
      prompt: MASTER_PROMPT,
      llm: inPrompt.llm || "qwen35-397b-a17b",
      reasoningEffort: "low",
      temperature: inPrompt.temperature ?? 0,
      maxTokens: inPrompt.maxTokens ?? -1,
      timezone: inPrompt.timezone || "America/Denver",
      cascadeTimeoutSeconds: inPrompt.cascadeTimeoutSeconds,
      enableParallelToolCalls: inPrompt.enableParallelToolCalls ?? false,
      ignoreDefaultPersonality: inPrompt.ignoreDefaultPersonality ?? false,
      enableReasoningSummary: inPrompt.enableReasoningSummary ?? false,
      toolIds: VOICE_AGENT_TOOL_IDS,
      knowledgeBase: inPrompt.knowledgeBase || [],
      rag: inPrompt.rag,
      backupLlmConfig: inPrompt.backupLlmConfig,
    };
    if (inBuiltIns.voicemailDetection) {
      promptConfig.builtInTools = {
        voicemailDetection: inBuiltIns.voicemailDetection,
      };
    }

    await client.conversationalAi.agents.update(OUTBOUND_AGENT_ID, {
      name: "Opek Outbound SMS Follow-Up",
      conversationConfig: {
        asr: inCc.asr,
        turn: inCc.turn,
        tts: inCc.tts,
        conversation: inCc.conversation,
        vad: inCc.vad,
        agent: {
          firstMessage: FIRST_MESSAGE,
          language: inAgent.language || "en",
          disableFirstMessageInterruptions: inAgent.disableFirstMessageInterruptions,
          prompt: promptConfig,
          dynamicVariables: {
            dynamicVariablePlaceholders: {
              ...DYNAMIC_VARIABLE_DEFAULTS,
              call_direction: "outbound",
            },
          },
        },
      },
      platformSettings: {
        overrides: {
          conversationConfigOverride: {
            agent: {
              firstMessage: true,
              prompt: {
                prompt: true,
                toolIds: true,
              },
            },
          },
        },
      },
    });

    // Match inbound's null reasoning_effort after qwen is attached.
    await client.conversationalAi.agents.update(OUTBOUND_AGENT_ID, {
      conversationConfig: {
        agent: {
          prompt: {
            reasoningEffort: null,
          },
        },
      },
    });

    const updated = await client.conversationalAi.agents.get(OUTBOUND_AGENT_ID);
    const up = updated.conversationConfig || {};
    // Publish Main at 100% so Twilio outbound uses the latest committed version.
    const branchId = updated.branchId || updated.mainBranchId;
    await client.conversationalAi.agents.deployments.create(OUTBOUND_AGENT_ID, {
      deploymentRequest: {
        requests: [
          {
            branchId,
            deploymentStrategy: {
              type: "percentage",
              trafficPercentage: 100,
            },
          },
        ],
      },
    });

    console.log(
      JSON.stringify(
        {
          name: updated.name,
          branchId,
          versionId: updated.versionId,
          deployedTrafficPercent: 100,
          promptLen: (up.agent?.prompt?.prompt || "").length,
          llm: up.agent?.prompt?.llm,
          reasoningEffort: up.agent?.prompt?.reasoningEffort,
          timezone: up.agent?.prompt?.timezone,
          tools: up.agent?.prompt?.toolIds || [],
          knowledgeBase: (up.agent?.prompt?.knowledgeBase || []).map((k) => k.name || k.id),
          voice: up.tts?.voiceId,
          ttsModel: up.tts?.modelId,
          expressive: up.tts?.expressiveMode,
          latency: up.tts?.optimizeStreamingLatency,
          turnTimeout: up.turn?.turnTimeout,
          silenceEndCall: up.turn?.silenceEndCallTimeout,
          firstMessage: up.agent?.firstMessage,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Error updating outbound agent:", error);
    process.exit(1);
  }
}

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  main();
}
