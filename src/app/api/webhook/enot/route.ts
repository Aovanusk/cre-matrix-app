import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Hardcoded packages (Security)
const PACKAGES: Record<string, { priceUSD: number, credits: number }> = {
  'starter': { priceUSD: 100, credits: 50 },
  'pro': { priceUSD: 250, credits: 150 },
  'enterprise': { priceUSD: 500, credits: 400 },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Enot params
    const merchant = formData.get('merchant') as string;
    const amount = formData.get('amount') as string;
    const intid = formData.get('intid') as string; // Enot internal ID
    const merchant_id = formData.get('merchant_id') as string; // our orderId
    const sign = formData.get('sign') as string;

    const shopId = process.env.ENOT_SHOP_ID;
    const secretKey2 = process.env.ENOT_SECRET_KEY_2 || process.env.ENOT_SECRET_KEY; // У Enot бывает второй секретный ключ для вебхуков
    
    if (!shopId || !secretKey2) {
      return NextResponse.json({ error: 'Enot is not configured' }, { status: 500 });
    }

    // Проверяем подпись (MD5: merchant:amount:secret_word_2:merchant_id)
    const signString = `${shopId}:${amount}:${secretKey2}:${merchant_id}`;
    const calculatedSign = crypto.createHash('md5').update(signString).digest('hex');

    if (sign !== calculatedSign) {
      console.error('[Enot] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // merchant_id = userId_packageId_timestamp
    const parts = merchant_id.split('_');
    const userId = parts[0];
    const packageId = parts[1];

    if (!userId || !packageId || !PACKAGES[packageId]) {
      console.error('[Enot] Invalid order structure');
      return NextResponse.json({ error: 'Invalid order structure' }, { status: 400 });
    }

    // Идемпотентность: проверяем, не обрабатывали ли мы уже этот платеж
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('transaction_id', intid)
      .single();

    if (existingPayment) {
      return NextResponse.json({ message: 'OK' });
    }

    // 1. Сохраняем информацию о платеже
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        amount: parseFloat(amount),
        currency: 'USD',
        status: 'completed',
        transaction_id: intid,
        gateway: 'enot'
      });

    if (paymentError) {
      console.error('Payment log error:', paymentError);
      return NextResponse.json({ error: 'DB Error' }, { status: 500 });
    }

    // 2. Начисляем кредиты
    const creditsToAdd = PACKAGES[packageId].credits;
    const { error: rpcError } = await supabaseAdmin.rpc('add_credits', {
      user_id: userId,
      credits_to_add: creditsToAdd
    });

    if (rpcError) {
      console.error('Add credits error:', rpcError);
      return NextResponse.json({ error: 'DB Error' }, { status: 500 });
    }

    console.log(`[Enot] Successfully added ${creditsToAdd} credits to ${userId}`);
    
    // Обязательно возвращаем OK для Enot, иначе он будет повторять запросы
    return NextResponse.json({ message: 'OK' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
