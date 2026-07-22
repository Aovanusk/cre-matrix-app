import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_1 });
    const response = await ai.models.list();
    console.log("Available models:");
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

listModels();
