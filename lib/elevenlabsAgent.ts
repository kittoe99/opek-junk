/** ElevenLabs ConvAI agent used for phone + contact-page web chat. */
export const INBOUND_AGENT_ID =
  (import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined)?.trim() ||
  'agent_5101kgxcwtkgek18m0j13cq16t3y';
