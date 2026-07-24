import { NextResponse } from 'next/server';
import crypto from 'crypto';

const PACKAGES = [
  { id: 'starter', credits: 50, priceUSD: 100 },
  { id: 'pro', credits: 150, priceUSD: 250 },
  { id: 'enterprise', credits: 400, priceUSD: 500 }
];

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const body = await request.json();
    const { packageId } = body;
    
    if (!packageId) {
      return NextResponse.json({ success: false, error: 'Missing packageId' }, { status: 400 });
    }

    const selectedPackage = PACKAGES.find(p => p.id === packageId);
    if (!selectedPackage) {
      return NextResponse.json({ success: false, error: 'Invalid packageId' }, { status: 400 });
    }

    const { amount, credits } = { amount: selectedPackage.priceUSD, credits: selectedPackage.credits };

    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Генерация уникального order_id: user_id|timestamp|credits
    const orderId = `${user.id}|${Date.now()}|${credits}`;
    const merchantId = process.env.AAIO_MERCHANT_ID!;
    const secret1 = process.env.AAIO_SECRET_1!;
    const currency = 'USD';
    const desc = `Покупка ${credits} кредитов для CRE Matrix`;

    // AAio подпись: sha256(merchant_id:amount:currency:secret_key_1:order_id)
    const signString = `${merchantId}:${amount}:${currency}:${secret1}:${orderId}`;
    const sign = crypto.createHash('sha256').update(signString).digest('hex');

    // Формируем URL для редиректа на страницу оплаты AAio
    const params = new URLSearchParams({
      merchant_id: merchantId,
      amount: amount.toString(),
      currency: currency,
      order_id: orderId,
      sign: sign,
      desc: desc,
      lang: 'ru'
    });

    const paymentUrl = `https://aaio.so/merchant/pay?${params.toString()}`;
    
    return NextResponse.json({ success: true, paymentUrl: paymentUrl });

  } catch (error: any) {
    console.error('[Checkout API] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
