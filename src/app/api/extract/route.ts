import { NextResponse } from 'next/server';
import { extractDataFromPdf } from '@/lib/gemini';

// Мы указываем Next.js, что этот эндпоинт может выполняться дольше обычного
// Vercel Serverless Function Timeout: 60 секунд (на Hobby тарифе максимум 10с, но для теста хватит)
export const maxDuration = 60; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileUrl, fileName } = body;
    
    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Отсутствует fileUrl в запросе' }, 
        { status: 400 }
      );
    }
    
    console.log(`[API] Начало обработки файла: ${fileName || 'unnamed.pdf'}`);
    console.log(`[API] URL: ${fileUrl}`);

    // Вызываем нашу кастомную функцию с ротацией ключей Gemini
    const extractedData = await extractDataFromPdf(fileUrl);
    
    // Возвращаем успешный ответ фронтенду
    return NextResponse.json({ 
      success: true, 
      data: extractedData 
    });

  } catch (error: any) {
    console.error('[API] Ошибка при экстракции:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Внутренняя ошибка сервера при обработке PDF' 
      }, 
      { status: 500 }
    );
  }
}
