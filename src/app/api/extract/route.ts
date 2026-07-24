import { NextResponse } from 'next/server';
import { extractDataFromPdf } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60; 

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const body = await request.json();
    const { fileUrl, fileName } = body;
    
    if (!fileUrl) {
      return NextResponse.json({ success: false, error: 'Отсутствует fileUrl в запросе' }, { status: 400 });
    }

    // SSRF & Storage Abuse Protection: Verify URL belongs to our Supabase Storage and to the current user
    const expectedBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/om_pdfs/`;
    if (!fileUrl.startsWith(expectedBaseUrl)) {
      return NextResponse.json({ success: false, error: 'Недопустимый источник файла' }, { status: 403 });
    }

    // Инициализируем Supabase клиент с токеном пользователя
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // 1. Проверяем валидность токена
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Дополнительная проверка SSRF: файл должен принадлежать текущему пользователю
    const filePath = fileUrl.replace(expectedBaseUrl, '');
    if (!filePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ success: false, error: 'Нет доступа к этому файлу' }, { status: 403 });
    }

    // 2. Проверяем баланс кредитов
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_balance')
      .eq('id', user.id)
      .single();

    if (!profile || profile.credits_balance <= 0) {
      return NextResponse.json({ success: false, error: 'Недостаточно кредитов' }, { status: 403 });
    }

    console.log(`[API] Обработка файла: ${fileName} для пользователя ${user.email}`);

    // 3. Вызываем RPC-функцию deduct_credit ДО вызова тяжелого API (Pessimistic Locking)
    const { error: deductError } = await supabase.rpc('deduct_credit', { user_id: user.id });
    if (deductError) {
      console.error('[API] Ошибка при списании кредита:', deductError);
      return NextResponse.json({ success: false, error: 'Не удалось списать кредит' }, { status: 500 });
    }

    // 4. Вызываем Gemini API
    let extractedData;
    try {
      extractedData = await extractDataFromPdf(fileUrl);
    } catch (geminiError: any) {
      console.error('[API] Ошибка парсинга PDF (Gemini):', geminiError);
      
      // Откат транзакции (Refund): возвращаем 1 кредит
      // Используем Service Key для возврата, так как deduct_credit мог быть вызван с Anon
      const serviceSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await serviceSupabase.rpc('add_credits', { user_id: user.id, amount: 1 });
      
      throw geminiError; // Пробрасываем ошибку дальше в catch блок маршрута
    }

    // Возвращаем успешный ответ фронтенду
    return NextResponse.json({ 
      success: true, 
      data: extractedData 
    });

  } catch (error: any) {
    console.error('[API] Ошибка при экстракции:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Внутренняя ошибка сервера' }, 
      { status: 500 }
    );
  }
}
