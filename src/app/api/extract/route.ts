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

    // Инициализируем Supabase клиент с токеном пользователя
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // 1. Проверяем валидность токена
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
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

    // 3. Вызываем Gemini API
    const extractedData = await extractDataFromPdf(fileUrl);
    
    // 4. Списываем 1 кредит с помощью вызова RPC-функции
    const { error: deductError } = await supabase.rpc('deduct_credit', { user_id: user.id });
    if (deductError) {
      console.error('[API] Ошибка при списании кредита:', deductError);
      // Мы не прерываем запрос, так как работа выполнена, но логгируем ошибку
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
