// src/services/ai.ts
import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText';

export const aiAPI = {
  /**
   * Sends a prompt to Gemini and returns the generated text.
   */
  generateContent: async (prompt: string): Promise<string> => {
    const res = await axios.post<{ 
      candidates: Array<{ output: string }> 
    }>(
      `${BASE_URL}?key=${API_KEY}`, 
      {
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    );
    return res.data.candidates[0].output;
  }
};