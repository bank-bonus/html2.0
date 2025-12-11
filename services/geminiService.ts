import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to strip markdown code blocks if the model adds them
const cleanCode = (text: string): string => {
  let cleaned = text.trim();
  // Remove ```html at the start and ``` at the end
  if (cleaned.startsWith('```html')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  return cleaned.trim();
};

export const improveGameCode = async (currentCode: string, instruction: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const model = "gemini-2.5-flash"; // Fast and capable for code
  
  const systemPrompt = `
    Ты эксперт по разработке веб-игр (HTML5, Canvas, JavaScript).
    Твоя задача - модифицировать предоставленный HTML-код игры согласно инструкциям пользователя.
    
    ПРАВИЛА:
    1. Верни ПОЛНЫЙ, рабочий HTML файл. Не обрезай код.
    2. Все стили (CSS) должны быть внутри тега <style>.
    3. Весь JavaScript должен быть внутри тега <script>.
    4. Не используй внешние локальные файлы (картинки, звуки), так как у нас нет к ним доступа. Если нужны картинки, используй placeholder'ы (например, цветные квадраты или data URI) или надежные CDN (например, https://picsum.photos).
    5. Если пользователь просит добавить функционал, реализуй его максимально качественно и чисто.
    6. Сохраняй существующую логику, если пользователь не просил её менять, но исправляй ошибки.
    7. Ответ должен содержать ТОЛЬКО код. Без объяснений.
  `;

  const userPrompt = `
    Вот текущий код игры:
    
    ${currentCode}
    
    ЗАДАЧА: ${instruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster code iteration, enable if logic is complex
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return cleanCode(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};