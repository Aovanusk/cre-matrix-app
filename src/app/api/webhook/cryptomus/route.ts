import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('sign');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    // Cryptomus подпись: md5(base64(json_body) + API_KEY)
    const base64Body = Buffer.from(rawBody).toString('base64');
    const expectedSignature = crypto.createHash('md5').update(base64Body + process.env.CRYPTOMUS_PAYMENT_KEY).digest('hex');

    if (signature !== expectedSignature) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Если статус не оплачен, просто игнорируем
    if (payload.status !== 'paid' && payload.status !== 'paid_over') {
      return NextResponse.json({ success: true, message: 'Status ignored' });
    }

    // Извлекаем user_id и credits из order_id (формат: user_id_timestamp_credits)
    const [userId, timestamp, creditsStr] = payload.order_id.split('_');
    const credits = parseInt(creditsStr, 10);

    if (!userId || isNaN(credits)) {
      console.error('[Webhook] Invalid order_id format:', payload.order_id);
      return NextResponse.json({ error: 'Invalid order_id' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ДОЛЖЕН БЫТЬ В .ENV!
    
    // Используем Service Role Key для обхода RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Идемпотентность: Пытаемся записать транзакцию в БД
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        transaction_id: payload.uuid, // Уникальный ID платежа от Cryptomus
        user_id: userId,
        amount_usd: parseFloat(payload.amount),
        credits: credits,
        status: payload.status
      });

    if (insertError) {
      // Код 23505 = Unique Violation. Значит мы уже обрабатывали этот вебхук.
      if (insertError.code === '23505') {
        console.log(`[Webhook] Payment ${payload.uuid} already processed.`);
        return NextResponse.json({ success: true, message: 'Already processed' });
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

    console.log(`[Webhook] Successfully added ${credits} credits to user ${userId}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
