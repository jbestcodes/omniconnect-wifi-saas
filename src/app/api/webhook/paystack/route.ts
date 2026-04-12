
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import { authorizeUser } from '@/lib/omada';

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    await dbConnect();
    const { reference, metadata, amount } = event.data;
    const clientMac = metadata?.client_mac || 'unknown';

    // Update transaction record
    await Transaction.findOneAndUpdate(
      { reference },
      { 
        status: 'success', 
        paidAt: new Date(), 
        amount: amount / 100,
        clientMac 
      },
      { upsert: true }
    );

    // Authorize user on Omada Controller
    try {
      await authorizeUser(clientMac, 60); // 1 hour access
    } catch (err) {
      console.error('Failed to authorize via Omada API', err);
    }
  }

  return NextResponse.json({ status: 'received' });
}
