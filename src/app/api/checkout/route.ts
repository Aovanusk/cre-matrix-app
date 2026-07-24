import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Hardcoded packages (Security)
const PACKAGES: Record<string, { priceUSD: number, credits: number }> = {
  'starter': { priceUSD: 100, credits: 50 },
  'pro': { priceUSD: 250, credits: 150 },
  'enterprise': { priceUSD: 500, credits: 400 },
};

export async function POST(req: Request) {
  try {
    const { packageId, userId } = await req.json();

    if (!userId || !packageId || !PACKAGES[packageId]) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const price = PACKAGES[packageId].priceUSD;
    
    // Enot config
    const shopId = process.env.ENOT_SHOP_ID;
    const secretKey = process.env.ENOT_SECRET_KEY; // Секретный ключ (или API ключ, в зависимости от версии Enot)
    
    if (!shopId || !secretKey) {
      console.error('[Enot] Missing environment variables ENOT_SHOP_ID or ENOT_SECRET_KEY');
      return NextResponse.json({ error: 'Payment gateway is not configured on the server.' }, { status: 500 });
    }

    const orderId = `${userId}_${packageId}_${Date.now()}`;
    
    // Формат MD5: shop_id:amount:secret_word:order_id
    const signString = `${shopId}:${price}:${secretKey}:${orderId}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');

    // Формируем URL для редиректа на страницу оплаты Enot
    const paymentUrl = `https://enot.io/pay?m=${shopId}&oa=${price}&o=${orderId}&c=USD&s=${sign}`;

    return NextResponse.json({ url: paymentUrl });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
