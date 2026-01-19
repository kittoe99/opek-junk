import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant testing the OpenAI API connection.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 150,
    });

    const reply = completion.choices[0]?.message?.content || 'No response';

    return res.status(200).json({
      success: true,
      reply,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect to OpenAI',
    });
  }
}
