# ElevenLabs MCP Server

A Model Context Protocol (MCP) server that provides integration with the ElevenLabs API, enabling AI agents (like Claude Desktop, Cursor, or Windsurf) to generate speech, synthesize sound effects, list voices, and perform speech-to-speech conversions.

## Features

- **`list_voices`**: Lists all available voices (name, ID, category, labels, and description).
- **`get_voice`**: Retrieves details about a specific voice by its ID.
- **`get_models`**: Lists available Text-to-Speech models.
- **`get_subscription`**: Checks subscription status, character counts/limits, and reset date.
- **`text_to_speech`**: Converts text to high-quality spoken audio and saves it as an `.mp3` file.
- **`sound_generation`**: Generates custom sound effects from text descriptions.
- **`speech_to_speech`**: Converts an existing audio file's voice to another voice while preserving performance.

## Prerequisites

- Node.js (v18+)
- An ElevenLabs account and API key.

## Installation & Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace `your_elevenlabs_api_key_here` with your actual ElevenLabs API key:
   ```env
   ELEVENLABS_API_KEY=your_actual_api_key_here
   ```
3. Install dependencies and build the server:
   ```bash
   npm install
   npm run build
   ```

## Connecting to Clients

### Claude Desktop

Add the following to your Claude Desktop configuration (usually located at `~/.config/Claude/claude_desktop_config.json` on Linux/macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "elevenlabs": {
      "command": "node",
      "args": ["/absolute/path/to/elevenlabs-mcp-server/build/index.js"],
      "env": {
        "ELEVENLABS_API_KEY": "your_elevenlabs_api_key_here"
      }
    }
  }
}
```

Make sure to replace `/absolute/path/to/elevenlabs-mcp-server` with the actual path to this folder.

### Cursor / Windsurf

Configure a new MCP server in the settings:
- **Name**: ElevenLabs
- **Type**: `stdio`
- **Command**: `node /absolute/path/to/elevenlabs-mcp-server/build/index.js`
- **Environment Variables**: Add `ELEVENLABS_API_KEY` with your API key.

## Generated Files Output

By default, generated audio files (`.mp3`) from `text_to_speech`, `sound_generation`, and `speech_to_speech` are saved to the `elevenlabs-mcp-server/output` folder unless you specify a custom path in the tool arguments.
