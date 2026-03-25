
import { GoogleGenAI, Type } from "@google/genai";
import { QuoteEstimate } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key');
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyzes an image of junk/waste and provides a cost estimate.
 * @param base64Image The base64 encoded image string (without the data prefix).
 * @param mimeType The mime type of the image.
 */
export const getJunkQuote = async (base64Image: string, mimeType: string): Promise<QuoteEstimate> => {
  
  const prompt = `
    You are an expert estimator for "Opek Junk Removal". 
    Analyze the provided image of junk or waste.
    
    1. Identify the main items visible (e.g., mattress, cardboard boxes, old appliances).
    2. Estimate the volume of the junk in terms of "pickup truck loads" (where 1 load = 15 cubic yards).
    3. Calculate a price range based on the following rules:
       - Base fee: $99
       - Per 1/4 truck load: $150
       - Minimum total price is $99.
    
    Return the result as a strict JSON object.
  `;

  try {
    const ai = getAiClient();
    // Always use gemini-3-flash-preview for basic multimodal reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of identified junk items",
            },
            estimatedVolume: {
              type: Type.STRING,
              description: "Volume estimate text (e.g., 'Approx. 1/2 Truck Load')",
            },
            priceRange: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER, description: "Minimum estimated price in USD" },
                max: { type: Type.NUMBER, description: "Maximum estimated price in USD" },
              },
              required: ["min", "max"],
            },
            summary: {
              type: Type.STRING,
              description: "A friendly, short summary of the estimate for the customer.",
            },
          },
          required: ["itemsDetected", "estimatedVolume", "priceRange", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as QuoteEstimate;

  } catch (error) {
    console.error("Error generating quote:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};
