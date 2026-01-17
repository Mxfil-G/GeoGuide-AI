
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserLocation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiResponse = async (
  prompt: string,
  location: UserLocation | null,
  history: { role: string; parts: { text: string }[] }[] = []
) => {
  try {
    const config: any = {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      systemInstruction: `You are GeoGuide AI, a world-class mapping and location expert. 
      Your primary tool is Google Maps. Use it to find businesses, landmarks, and geographic features.
      When users ask for "nearby" places, use the provided geolocation data.
      Provide detailed answers about locations, including interesting facts, history, or practical tips.
      Always ensure that if the Google Maps tool is used, the response provides high-quality grounding.
      If you mention specific places, ensure they are reflected in the grounding metadata so the user can see them as interactive cards.`,
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          }
        }
      };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config,
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Fallback if the model returns grounding but no text
    const finalText = text || (groundingChunks.length > 0 
      ? "I've found some relevant locations for you on the map:" 
      : "I'm sorry, I couldn't find a descriptive answer for that query.");

    return {
      text: finalText,
      groundingChunks,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
