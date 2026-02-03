
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateNaijaTagline = async (movieTitle: string, movieDescription: string): Promise<string> => {
  try {
    if (!ai) {
      return "A must-watch for the weekend!";
    }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a savvy Nigerian movie promoter. Generate a short, catchy, and culturally relevant "Naija style" tagline for the movie "${movieTitle}". Description: "${movieDescription}". Keep it under 60 characters and use a bit of Nigerian Pidgin if appropriate. Output ONLY the tagline text.`,
    });
    return response.text?.trim() || "A must-watch for the weekend!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The vibiest movie in Naija right now!";
  }
};

export const getAIPicks = async (prompt: string): Promise<string> => {
  try {
    if (!ai) {
      return "AI not configured.";
    }
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    return "Error getting AI insights";
  }
}
