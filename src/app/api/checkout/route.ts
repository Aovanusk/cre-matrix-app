import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const body = await request.json();
    const { amount, credits } = body;
    
    if (!amount || !credits) {
      return NextResponse.json({ success: false, error: 'Missing amount or credits' }, { status: 400 });
    }

    // В реальном приложении здесь нужно проверить token через supabase.auth.getUser()
    // Но так как нам нужен только user.id, мы можем запросить его:
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Генерация уникального order_id (transaction_id)
    const orderId = `${user.id}_${Date.now()}_${credits}`;

    const payload = {
      amount: amount.toString(),
      currency: 'USD',
      order_id: orderId,
      url_return: 'https://cozy-sopapillas-896c75.netlify.app/',
      url_callback: 'https://cozy-sopapillas-896c75.netlify.app/api/webhook/cryptomus',
      is_payment_multiple: false,
      lifetime: 3600,
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // MD5(Base64(json) + API_KEY)
    const sign = crypto.createHash('md5').update(payloadBase64 + process.env.CRYPTOMUS_PAYMENT_KEY).digest('hex');

    const response = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'merchant': process.env.CRYPTOMUS_MERCHANT_ID!,
        'sign': sign,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Cryptomus] Create Invoice Error:', err);
      throw new Error('Failed to create payment invoice');
    }

    const data = await response.json();
    
    return NextResponse.json({ success: true, paymentUrl: data.result.url });

  } catch (error: any) {
    console.error('[Checkout API] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
