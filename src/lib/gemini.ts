import { GoogleGenAI } from '@google/genai';

// Функция для получения всех доступных ключей из .env.local
const getAvailableKeys = () => {
  return [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_6,
  ].filter(Boolean) as string[];
};

export async function extractDataFromPdf(fileUrl: string) {
  const keys = getAvailableKeys();
  
  if (keys.length === 0) {
    throw new Error('API ключи Gemini не настроены в .env.local');
  }
  
  // Ротация ключей: случайный выбор ключа для распределения нагрузки (Load Balancing)
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  
  // Инициализируем клиент Google Gen AI с выбранным ключом
  const ai = new GoogleGenAI({ apiKey: randomKey });
  
  try {
    // 1. Скачиваем PDF по публичной ссылке из Supabase
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Не удалось скачать PDF файл по ссылке');
    
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    
    // 2. Формируем жесткий промпт для извлечения данных
    const prompt = `You are an expert Commercial Real Estate (CRE) Data Extraction AI.
Analyze this property presentation/flyer and extract the key financial and property metrics into a strict JSON format.
If a specific value is missing or not mentioned in the document, use null.
Return ONLY valid JSON. Do not include markdown code blocks or explanations.

Required JSON structure:
{
  "property_address": "string (full address or name of property)",
  "asking_price": number (just the number, e.g. 5500000),
  "noi": number (Net Operating Income, e.g. 385000),
  "cap_rate": number (Capitalization Rate, e.g. 7.5 for 7.5%),
  "occupancy_rate": number (e.g. 100 for 100%),
  "gla_sqft": number (Gross Leasable Area in sq ft),
  "property_type": "string (e.g. Retail, Industrial, Office, Multifamily)"
}`;

    // 3. Отправляем запрос к Gemini
    // Используем gemini-2.0-flash-exp (или gemini-1.5-flash), так как она идеально читает длинные PDF
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Используем актуальную модель 2026 года
        contents: [
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'application/pdf'
                }
            }
        ],
        config: {
            responseMimeType: "application/json", // Заставляем ИИ отвечать только строгим JSON
        }
    });

    const text = result.text;
    
    if (!text) {
      throw new Error('Gemini не вернула текст');
    }
    
    // Пытаемся распарсить JSON
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', text);
      throw new Error('Gemini вернула некорректный формат данных (не JSON)');
    }
    
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Ошибка обработки ИИ: ${error.message}`);
  }
}
