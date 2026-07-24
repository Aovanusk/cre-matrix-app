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
    throw new Error('API ключи не настроены в .env.local');
  }
  
  const rawKey = keys[Math.floor(Math.random() * keys.length)];
  const randomKey = rawKey.trim().replace(/^["']|["']$/g, '');
  
  try {
    // 1. Скачиваем PDF по публичной ссылке из Supabase
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) throw new Error('Не удалось скачать PDF файл по ссылке');
    
    const arrayBuffer = await fileRes.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Формируем жесткий промпт для извлечения данных
    const prompt = `You are an expert Commercial Real Estate (CRE) Data Extraction AI.
Analyze this property presentation/flyer/report and extract the key financial and property metrics into a strict JSON format.
If a specific value is missing or not mentioned in the document, use null.
Return ONLY valid JSON. Do not include markdown code blocks or explanations.

CRITICAL RULES:
1. Deep Search: Even if this is a massive corporate report (50+ pages), scan ALL pages to find any Acquisition Targets or properties for sale.
2. Pro Forma vs Current: If both Current (As-Is) and Pro Forma (Stabilized/Future) metrics are present, ALWAYS extract the Pro Forma metrics as they represent the target underwriting.
3. Portfolio Sales: If the document is selling a Portfolio of multiple properties, extract the TOTAL (Blended) Asking Price, TOTAL NOI, Blended Cap Rate, and TOTAL GLA for the entire portfolio.
4. Fake/Non-CRE Documents: If the document is clearly not a real estate offering (e.g. restaurant menu, personal letter, etc.), return null for all financial and property fields.

Required JSON structure:
{
  "property_address": "string (full address, name of property, or 'Portfolio')",
  "asking_price": number (just the number, e.g. 5500000),
  "noi": number (Net Operating Income, e.g. 385000),
  "cap_rate": number (Capitalization Rate, e.g. 7.5 for 7.5%),
  "occupancy_rate": number (e.g. 100 for 100%),
  "gla_sqft": number (Gross Leasable Area in sq ft),
  "property_type": "string (e.g. Retail, Industrial, Office, Multifamily, Portfolio)"
}`;

    // Отправляем запрос к VseGPT API
    const response = await fetch("https://api.vsegpt.ru/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${randomKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { 
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64Data}`
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`VseGPT Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content;
    
    if (!text) {
      throw new Error('ИИ не вернул текст');
    }
    
    // Пытаемся распарсить JSON
    try {
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON output:', text);
      throw new Error('ИИ вернул некорректный формат данных (не JSON)');
    }
    
  } catch (error: any) {
    console.error('API Error:', error);
    throw new Error(`Ошибка обработки ИИ: ${error.message}`);
  }
}
