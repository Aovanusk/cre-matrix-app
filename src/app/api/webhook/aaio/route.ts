import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// У AAio вебхуки приходят как x-www-form-urlencoded
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const merchant_id = formData.get('merchant_id') as string;
    const amount = formData.get('amount') as string;
    const currency = formData.get('currency') as string;
    const order_id = formData.get('order_id') as string;
    const sign = formData.get('sign') as string;
    const intid = formData.get('intid') as string; // ID транзакции в AAio

    if (!merchant_id || !amount || !currency || !order_id || !sign || !intid) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const secret2 = process.env.AAIO_SECRET_2!;
    
    // AAio webhook подпись: sha256(merchant_id:amount:currency:secret_key_2:order_id)
    const signString = `${merchant_id}:${amount}:${currency}:${secret2}:${order_id}`;
    const expectedSign = crypto.createHash('sha256').update(signString).digest('hex');

    if (sign !== expectedSign) {
      console.error('[AAio Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Извлекаем user_id и credits из order_id (формат: user_id|timestamp|credits)
    const [userId, timestamp, creditsStr] = order_id.split('|');
    const credits = parseInt(creditsStr, 10);

    if (!userId || isNaN(credits)) {
      console.error('[AAio Webhook] Invalid order_id format:', order_id);
      return NextResponse.json({ error: 'Invalid order_id' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Используем Service Role Key для обхода RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Идемпотентность: Пытаемся записать транзакцию в БД
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        transaction_id: intid, // Уникальный ID платежа от AAio
        user_id: userId,
        amount_usd: parseFloat(amount), // Сохраняем сумму в рублях
        credits: credits,
        status: 'paid'
      });

    if (insertError) {
      // Код 23505 = Unique Violation. Значит мы уже обрабатывали этот вебхук.
      if (insertError.code === '23505') {
        console.log(`[AAio Webhook] Payment ${intid} already processed.`);
        return new NextResponse('OK', { status: 200 }); // AAio ждет просто 200 OK
      }
      throw new Error(`DB Insert Error: ${insertError.message}`);
    }

    // 2. Транзакция уникальна, начисляем кредиты пользователю
    const { error: addError } = await supabase.rpc('add_credits', { 
      user_id: userId, 
      amount: credits 
    });

    if (addError) {
      throw new Error(`RPC add_credits Error: ${addError.message}`);
    }

    console.log(`[AAio Webhook] Successfully added ${credits} credits to user ${userId}`);
    return new NextResponse('OK', { status: 200 }); // Важно вернуть ровно 200 OK текстом

  } catch (error: any) {
    console.error('[AAio Webhook] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
