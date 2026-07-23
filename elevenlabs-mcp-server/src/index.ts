import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get file names and directory names in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables relative to the build output/server folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Initialize the MCP Server
const server = new McpServer({
  name: "elevenlabs-mcp-server",
  version: "1.0.0",
});

let elevenLabsClient: ElevenLabsClient | null = null;

/**
 * Retrieve or initialize the ElevenLabs API client.
 * Verifies that the API key is set before initialization.
 */
function getClient(): ElevenLabsClient {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === "your_elevenlabs_api_key_here") {
    throw new Error(
      "ELEVENLABS_API_KEY is not set. Please add it to the `.env` file in the `elevenlabs-mcp-server` directory."
    );
  }
  if (!elevenLabsClient) {
    elevenLabsClient = new ElevenLabsClient({ apiKey });
  }
  return elevenLabsClient;
}

/**
 * Utility function to save a stream (Node.js Readable or Web ReadableStream) to a file.
 */
async function saveStreamToFile(stream: any, filePath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    
    if (stream && typeof stream.pipe === "function") {
      // Node.js Readable Stream
      stream.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", (err: any) => {
        writeStream.close();
        reject(err);
      });
      stream.on("error", (err: any) => {
        writeStream.close();
        reject(err);
      });
    } else if (stream && typeof stream.getReader === "function") {
      // Web ReadableStream fallback
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          writeStream.write(Buffer.from(value));
        }
        writeStream.end();
        resolve();
      } catch (err) {
        writeStream.close();
        reject(err);
      }
    } else {
      writeStream.close();
      reject(new Error("Unsupported or invalid stream type returned from ElevenLabs API"));
    }
  });
}

// 1. Tool: List Voices
server.tool(
  "list_voices",
  "List all available ElevenLabs voices (including premade, custom, and shared voices).",
  {},
  async () => {
    try {
      const client = getClient();
      const response = await client.voices.getAll();
      const voices = response.voices || [];

      if (voices.length === 0) {
        return {
          content: [{ type: "text", text: "No voices found." }]
        };
      }

      const formatted = voices
        .map((v: any) => {
          const labels = v.labels
            ? Object.entries(v.labels)
                .map(([k, val]) => `${k}: ${val}`)
                .join(", ")
            : "None";
          return `- **${v.name}**\n  - Voice ID: \`${v.voice_id}\`\n  - Category: ${v.category}\n  - Description: ${v.description || "N/A"}\n  - Labels: ${labels}`;
        })
        .join("\n\n");

      return {
        content: [{ type: "text", text: `### Available Voices:\n\n${formatted}` }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message || error}` }],
        isError: true
      };
    }
  }
);

// 2. Tool: Get Voice Details
server.tool(
  "get_voice",
  "Get details of a specific voice by its ID.",
  {
    voice_id: z.string().describe("The unique ID of the voice to retrieve details for.")
  },
  async ({ voice_id }) => {
    try {
      const client = getClient();
      const voice = await client.voices.get(voice_id);
      return {
        content: [{ type: "text", text: JSON.stringify(voice, null, 2) }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message || error}` }],
        isError: true
      };
    }
  }
);

// 3. Tool: List Models
server.tool(
  "get_models",
  "Get a list of available text-to-speech models.",
  {},
  async () => {
    try {
      const client = getClient();
      const models = await client.models.list();
      const formatted = models
        .map((m: any) => {
          const languages = m.languages
            ? m.languages.map((l: any) => l.name).join(", ")
            : "N/A";
          return `- **${m.name}**\n  - Model ID: \`${m.model_id}\`\n  - Description: ${m.description || "N/A"}\n  - Supported Languages: ${languages}`;
        })
        .join("\n\n");

      return {
        content: [{ type: "text", text: `### Available Models:\n\n${formatted}` }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message || error}` }],
        isError: true
      };
    }
  }
);

// 4. Tool: Get Subscription Details
server.tool(
  "get_subscription",
  "Get current ElevenLabs subscription tier, character usage, and limits.",
  {},
  async () => {
    try {
      const client = getClient();
      const sub = await client.user.subscription.get();
      const percent = ((sub.characterCount / sub.characterLimit) * 100).toFixed(1);

      const formatted = [
        `### ElevenLabs Subscription Status`,
        `- **Tier**: ${sub.tier}`,
        `- **Character Usage**: ${sub.characterCount.toLocaleString()} / ${sub.characterLimit.toLocaleString()} (${percent}%)`,
        `- **Remaining Characters**: ${(sub.characterLimit - sub.characterCount).toLocaleString()}`,
        `- **Reset Date**: ${sub.nextCharacterCountResetUnix ? new Date(sub.nextCharacterCountResetUnix * 1000).toLocaleDateString() : "N/A"}`,
        `- **Voice Limit**: ${sub.voiceLimit ?? "N/A"} (Custom Voice Slots)`
      ].join("\n");

      return {
        content: [{ type: "text", text: formatted }]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message || error}` }],
        isError: true
      };
    }
  }
);

// 5. Tool: Text-to-Speech (TTS)
server.tool(
  "text_to_speech",
  "Convert text to a high-quality spoken audio MP3 file.",
  {
    text: z.string().describe("The text content to synthesize into speech."),
    voice_id: z.string().describe("The ID of the voice to use. Retrieve voice IDs using the list_voices tool."),
    model_id: z.string().optional().describe("The text-to-speech model ID. Default is 'eleven_multilingual_v2'."),
    output_file: z.string().optional().describe("The optional absolute or relative path to save the output MP3 file. Defaults to an output folder inside the server directory."),
    stability: z.number().min(0).max(1).optional().describe("Stability parameter (0.0 to 1.0). Lower is more expressive, higher is more consistent."),
    similarity_boost: z.number().min(0).max(1).optional().describe("Clarity/similarity boost (0.0 to 1.0).")
  },
  async ({ text, voice_id, model_id, output_file, stability, similarity_boost }) => {
    try {
      const client = getClient();
      const stream = await client.textToSpeech.convert(voice_id, {
        text,
        modelId: model_id || "eleven_multilingual_v2",
        voiceSettings:
          stability !== undefined || similarity_boost !== undefined
            ? {
                stability: stability ?? 0.75,
                similarityBoost: similarity_boost ?? 0.75,
              }
            : undefined,
      });

      const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, "../output");
      if (!fs.existsSync(DEFAULT_OUTPUT_DIR)) {
        fs.mkdirSync(DEFAULT_OUTPUT_DIR, { recursive: true });
      }

      const filename = `tts_${Date.now()}.mp3`;
      const targetPath = output_file
        ? path.resolve(output_file)
        : path.join(DEFAULT_OUTPUT_DIR, filename);

      await saveStreamToFile(stream, targetPath);

      return {
        content: [
          {
            type: "text",
            text: `Successfully generated speech and saved to:\n\`${targetPath}\``
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message || error}` }],
        isError: true
      };
    }
  }
);

// 6. Tool: Sound Generation
server.tool(
  "sound_generation",
  "Generate sound effects from text prompts.",
  {
    text: z.string().describe("The text description of the sound effect to generate (e.g. 'A small bird chirping in a forest')."),
    duration_seconds: z.number().min(0.5).max(30).optional().describe("Duration of the sound in seconds (0.5 to 30.0)."),
    prompt_influence: z.number().min(0).max(1).optional().describe("How closely the model adheres to your text prompt (0.0 to 1.0)."),
    output_file: z.string().optional().describe("The optional absolute or relative path to save the output MP3 file. Defaults to an output folder inside the server directory.")
  },
  async ({ text, duration_seconds, prompt_influence, output_file }) => {
    try {
      const client = getClient();
      const stream = await client.textToSoundEffects.convert({
        text,
        durationSeconds: duration_seconds,
        promptInfluence: prompt_influence,
      });

      const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, "../output");
      if (!fs.existsSync(DEFAULT_OUTPUT_DIR)) {
        fs.mkdirSync(DEFAULT_OUTPUT_DIR, { recursive: true });
      }

      const filename = `sfx_${Date.now()}.mp3`;
      const targetPath = output_file
        ? path.resolve(output_file)
        : path.join(DEFAULT_OUTPUT_DIR, filename);

      await saveStreamToFile(stream, targetPath);

      return {
        content: [
          {
            type: "text",
            text: `Successfully generated sound effect and saved to:\n\`${targetPath}\``
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message || error}` }],
        isError: true
      };
    }
  }
);

// 7. Tool: Speech-to-Speech (STS)
server.tool(
  "speech_to_speech",
  "Convert an existing audio file's voice to another voice while keeping the same performance.",
  {
    audio_file_path: z.string().describe("The absolute path to the source audio file to convert."),
    voice_id: z.string().describe("The target voice ID to convert the audio into."),
    model_id: z.string().optional().describe("Model ID. Default is 'eleven_multilingual_v2'."),
    output_file: z.string().optional().describe("The optional absolute or relative path to save the converted MP3 file. Defaults to an output folder inside the server directory.")
  },
  async ({ audio_file_path, voice_id, model_id, output_file }) => {
    try {
      const client = getClient();
      const absoluteInputPath = path.resolve(audio_file_path);

      if (!fs.existsSync(absoluteInputPath)) {
        return {
          content: [{ type: "text", text: `Error: Source audio file not found at path: ${absoluteInputPath}` }],
          isError: true
        };
      }

      const audioStream = fs.createReadStream(absoluteInputPath);
      const stream = await client.speechToSpeech.convert(voice_id, {
        audio: audioStream,
        modelId: model_id || "eleven_multilingual_v2",
      });

      const DEFAULT_OUTPUT_DIR = path.resolve(__dirname, "../output");
      if (!fs.existsSync(DEFAULT_OUTPUT_DIR)) {
        fs.mkdirSync(DEFAULT_OUTPUT_DIR, { recursive: true });
      }

      const filename = `sts_${Date.now()}.mp3`;
      const targetPath = output_file
        ? path.resolve(output_file)
        : path.join(DEFAULT_OUTPUT_DIR, filename);

      await saveStreamToFile(stream, targetPath);

      return {
        content: [
          {
            type: "text",
            text: `Successfully converted speech and saved to:\n\`${targetPath}\``
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message || error}` }],
        isError: true
      };
    }
  }
);

// Start the server using standard input/output (Stdio) transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting ElevenLabs MCP Server:", error);
  process.exit(1);
});
