import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, never expose key if not using a proxy, but for this demo standard env is assumed.
// We handle the case where key is missing gracefully in UI.

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getAiAdvice = async (goal: string, level: string): Promise<string> => {
  if (!ai) return "Система AI временно недоступна. Пожалуйста, обратитесь к тренеру.";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Ты профессиональный тренер по плаванию в открытом бассейне.
      Пользователь:
      Уровень: ${level}
      Цель: ${goal}
      
      Дай краткий совет (максимум 3 предложения) и пример тренировки на 45 минут.
      Используй эмодзи для структуры, но не перебарщивай. Тон: мотивирующий, энергичный.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "Не удалось получить совет. Попробуйте позже.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Сервис перегружен. Попробуйте позже.";
  }
};